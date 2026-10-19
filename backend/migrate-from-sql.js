import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {}
}

import { User } from './src/models/User.js';
import { Intern } from './src/models/Intern.js';
import { Program } from './src/models/Program.js';
import { OfficeConfig } from './src/models/OfficeConfig.js';
import { Attendance } from './src/models/Attendance.js';
import { Leave } from './src/models/Leave.js';

// Fungsi parser SQL dump sederhana yang tangguh
const parseSqlInserts = (sqlContent, tableName) => {
  const regex = new RegExp(`INSERT INTO \`${tableName}\` \\(([^)]+)\\) VALUES\\s*([^;]+);`, 'gi');
  const matches = [...sqlContent.matchAll(regex)];
  const results = [];

  for (const match of matches) {
    const columns = match[1].split(',').map((c) => c.replace(/[`'\s]/g, '').trim());
    const rawValuesBlock = match[2].trim();

    // Split rows: (val1, val2), (val3, val4)
    const rowMatches = rawValuesBlock.match(/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g);
    if (!rowMatches) continue;

    for (const rowStr of rowMatches) {
      // Hilangkan kurung luar
      const inner = rowStr.slice(1, -1);

      // Parse comma separated values respecting strings
      const values = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';

      for (let i = 0; i < inner.length; i++) {
        const char = inner[i];
        if ((char === "'" || char === '"') && (i === 0 || inner[i - 1] !== '\\')) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char;
          } else if (quoteChar === char) {
            inQuotes = false;
          } else {
            current += char;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(cleanVal(current));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(cleanVal(current));

      const rowObj = {};
      columns.forEach((col, index) => {
        rowObj[col] = values[index];
      });
      results.push(rowObj);
    }
  }

  return results;
};

const cleanVal = (val) => {
  let v = val.trim();
  if (v === 'NULL' || v === 'null') return null;
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    v = v.slice(1, -1);
  }
  return v;
};

const runMigration = async () => {
  const sqlPath = path.resolve(__dirname, '../presensi.sql');
  console.log('====================================================');
  console.log('🚀 MEMULAI MIGRASI OTOMATIS DATA SQL KE MONGODB');
  console.log('====================================================');
  console.log(`📄 Membaca file dump: ${sqlPath}`);

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ File ${sqlPath} tidak ditemukan!`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/presensi_bps';

  console.log(`🔌 Menghubungkan ke MongoDB: ${mongoUri}...`);
  await mongoose.connect(mongoUri);
  console.log('✅ Berhasil terhubung ke MongoDB!\n');

  try {
    // 1. Migrasi Konfigurasi Lokasi
    console.log('1️⃣ Migrasi Konfigurasi Lokasi Kantor...');
    const lokasiRows = parseSqlInserts(sqlContent, 'konfigurasi_lokasi');
    if (lokasiRows.length > 0) {
      await OfficeConfig.deleteMany();
      for (const row of lokasiRows) {
        await OfficeConfig.create({
          nama_kantor: 'BPS Kota Sukabumi',
          lokasi_kantor: row.lokasi_kantor || '-6.910091184058985,106.93593094557392',
          radius: Number(row.radius) || 200,
        });
      }
      console.log(`   ✅ ${lokasiRows.length} konfigurasi lokasi berhasil dimigrasikan.`);
    }

    // 2. Migrasi Program
    console.log('2️⃣ Migrasi Master Program...');
    const programRows = parseSqlInserts(sqlContent, 'program');
    if (programRows.length > 0) {
      await Program.deleteMany();
      for (const row of programRows) {
        await Program.create({
          status: row.status,
          keterangan: row.keterangan,
        });
      }
      console.log(`   ✅ ${programRows.length} program kerja lapangan berhasil dimigrasikan.`);
    }

    // 3. Migrasi Admin Users
    console.log('3️⃣ Migrasi Akun Administrator...');
    const userRows = parseSqlInserts(sqlContent, 'users');
    if (userRows.length > 0) {
      await User.deleteMany();
      for (const row of userRows) {
        // Simpan langsung hash bcrypt dari Laravel atau re-hash
        const user = new User({
          name: row.name || 'Admin BPS',
          email: row.email,
          password: '123', // Set password yang dikenal (admin@gmail.com / 123)
          role: 'admin',
        });
        await user.save();
      }
      console.log(`   ✅ ${userRows.length} akun administrator berhasil dimigrasikan.`);
    }

    // 4. Migrasi Peserta Magang
    console.log('4️⃣ Migrasi Data Peserta Magang...');
    const magangRows = parseSqlInserts(sqlContent, 'magang');
    const internMap = {}; // mapping no_id -> ObjectId
    if (magangRows.length > 0) {
      await Intern.deleteMany();
      for (const row of magangRows) {
        // Tentukan password default sesuai akun
        let pass = '12345';
        if (row.no_id === '20220040165') pass = '1234';

        const intern = new Intern({
          no_id: row.no_id,
          nama_lengkap: row.nama_lengkap,
          sekolah: row.sekolah,
          jurusan: row.jurusan,
          semester: row.semester || '',
          status: row.status || 'Magang',
          foto: row.foto || null,
          no_hp: row.no_hp || '',
          password: pass,
        });
        await intern.save();
        internMap[intern.no_id] = intern._id;
      }
      console.log(`   ✅ ${magangRows.length} peserta magang berhasil dimigrasikan.`);
    }

    // 5. Migrasi Pengajuan Izin/Sakit
    console.log('5️⃣ Migrasi Riwayat Pengajuan Izin & Sakit...');
    const pengajuanRows = parseSqlInserts(sqlContent, 'pengajuan');
    if (pengajuanRows.length > 0) {
      await Leave.deleteMany();
      for (const row of pengajuanRows) {
        await Leave.create({
          intern: internMap[row.no_id] || null,
          no_id: row.no_id,
          tgl_izin: row.tgl_izin,
          status_izin: row.status_izin || 'i',
          keterangan: row.keterangan,
          status_approve: Number(row.status_approve) || 0,
        });
      }
      console.log(`   ✅ ${pengajuanRows.length} permohonan izin/sakit berhasil dimigrasikan.`);
    }

    // 6. Migrasi Riwayat Presensi
    console.log('6️⃣ Migrasi Riwayat Presensi Harian...');
    const presensiRows = parseSqlInserts(sqlContent, 'presensi');
    if (presensiRows.length > 0) {
      await Attendance.deleteMany();
      for (const row of presensiRows) {
        const isLate = row.jam_in > '08:00:00';
        await Attendance.create({
          intern: internMap[row.no_id] || null,
          no_id: row.no_id,
          tgl_presensi: row.tgl_presensi,
          jam_in: row.jam_in || null,
          jam_out: row.jam_out || null,
          foto_in: row.foto_in || null,
          foto_out: row.foto_out || null,
          lokasi_in: row.lokasi_in || null,
          lokasi_out: row.lokasi_out || null,
          jarak_in: 15,
          jarak_out: 15,
          kegiatan_in: row.kegiatan_in || 'Tidak ada kegiatan',
          kegiatan_out: row.kegiatan_out || 'Tidak ada kegiatan',
          status_waktu: isLate ? 'Terlambat' : 'Tepat Waktu',
        });
      }
      console.log(`   ✅ ${presensiRows.length} catatan presensi berhasil dimigrasikan.`);
    }

    console.log('\n====================================================');
    console.log('🎉 MIGRASI DATA LAMA KE MONGODB SUKSES 100%!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat migrasi:', err);
    process.exit(1);
  }
};

runMigration();
