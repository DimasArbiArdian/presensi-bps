import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

import { User } from './src/models/User.js';
import { Intern } from './src/models/Intern.js';
import { Program } from './src/models/Program.js';
import { OfficeConfig } from './src/models/OfficeConfig.js';
import { Attendance } from './src/models/Attendance.js';
import { Leave } from './src/models/Leave.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/presensi_bps';
    console.log(`Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB!');

    // 1. Seed Office Config
    await OfficeConfig.deleteMany();
    const office = await OfficeConfig.create({
      nama_kantor: 'BPS Kota Sukabumi',
      lokasi_kantor: '-6.910091184058985,106.93593094557392',
      radius: 200,
    });
    console.log(`✅ Office Config seeded (Radius: ${office.radius}m)`);

    // 2. Seed Programs
    await Program.deleteMany();
    await Program.create([
      { status: 'Magang', keterangan: 'Intership/Magang' },
      { status: 'PKL', keterangan: 'Praktik Kerja Lapangan' },
    ]);
    console.log('✅ Master Programs seeded');

    // 3. Seed Admin User
    await User.deleteMany();
    const admin = new User({
      name: 'Admin BPS Sukabumi',
      email: 'admin@gmail.com',
      password: '123',
      role: 'admin',
    });
    await admin.save();
    console.log('✅ Admin User created: admin@gmail.com (pass: 123)');

    // 4. Seed Interns
    await Intern.deleteMany();
    const dimas = new Intern({
      no_id: '20220040165',
      nama_lengkap: 'Dimas Arbi Adian',
      sekolah: 'Universitas Nusa Putra',
      jurusan: 'Teknik Informatika',
      semester: '6',
      status: 'Magang',
      no_hp: '085872834600',
      password: '1234',
    });
    await dimas.save();

    const aceng = new Intern({
      no_id: '20220040166',
      nama_lengkap: 'Aceng',
      sekolah: 'SMAN 1 SUKABUMI',
      jurusan: 'IPA',
      semester: '12',
      status: 'PKL',
      no_hp: '085872834666',
      password: '12345',
    });
    await aceng.save();

    const bilqis = new Intern({
      no_id: '20240070055',
      nama_lengkap: 'Bilqis Zaelani',
      sekolah: 'Universitas Nusa Putra',
      jurusan: 'Akuntansi',
      semester: '2',
      status: 'Magang',
      no_hp: '083877865977',
      password: '12345',
    });
    await bilqis.save();
    console.log('✅ Interns seeded (Dimas [20220040165], Aceng, Bilqis)');

    // 5. Seed Attendance Logs
    await Attendance.deleteMany();
    await Attendance.create([
      {
        intern: dimas._id,
        no_id: dimas.no_id,
        tgl_presensi: '2025-05-20',
        jam_in: '07:45:00',
        jam_out: '16:05:00',
        foto_in: 'sample-in.png',
        foto_out: 'sample-out.png',
        lokasi_in: '-6.910037926586197,106.93584822030506',
        lokasi_out: '-6.910037926586197,106.93584822030506',
        jarak_in: 12,
        jarak_out: 12,
        kegiatan_in: 'Membantu entri data sensus BPS',
        kegiatan_out: 'Merapikan laporan kerja harian',
        status_waktu: 'Tepat Waktu',
      },
      {
        intern: dimas._id,
        no_id: dimas.no_id,
        tgl_presensi: '2025-06-25',
        jam_in: '08:15:20',
        jam_out: '16:02:29',
        foto_in: 'sample-in2.png',
        foto_out: 'sample-out2.png',
        lokasi_in: '-6.910037926586197,106.93584822030506',
        lokasi_out: '-6.910037926586197,106.93584822030506',
        jarak_in: 15,
        jarak_out: 15,
        kegiatan_in: 'Pengolahan data statistik',
        kegiatan_out: 'Dokumentasi kegiatan',
        status_waktu: 'Terlambat',
      },
    ]);
    console.log('✅ Attendance sample records seeded');

    // 6. Seed Leaves
    await Leave.deleteMany();
    await Leave.create([
      {
        intern: dimas._id,
        no_id: dimas.no_id,
        tgl_izin: '2025-06-25',
        status_izin: 's',
        keterangan: 'Demam dan flu berat',
        status_approve: 2, // Ditolak
      },
      {
        intern: dimas._id,
        no_id: dimas.no_id,
        tgl_izin: '2025-06-26',
        status_izin: 'i',
        keterangan: 'Ada urusan administrasi kampus',
        status_approve: 1, // Disetujui
      },
      {
        intern: dimas._id,
        no_id: dimas.no_id,
        tgl_izin: '2025-06-27',
        status_izin: 's',
        keterangan: 'Sakit flu berobat ke klinik',
        status_approve: 1, // Disetujui
      },
      {
        intern: dimas._id,
        no_id: dimas.no_id,
        tgl_izin: '2026-10-18',
        status_izin: 'i',
        keterangan: 'Izin menghadiri seminar akademik',
        status_approve: 0, // Pending
      },
    ]);
    console.log('✅ Sample leave requests seeded');

    console.log('\n🎉 ALL SEED DATA SUCCESSFULLY MIGRATED TO MONGODB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
