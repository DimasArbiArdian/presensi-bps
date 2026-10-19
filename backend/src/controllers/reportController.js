import { Attendance } from '../models/Attendance.js';
import { Intern } from '../models/Intern.js';
import ExcelJS from 'exceljs';

const monthNames = [
  '',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

// @desc Dapatkan data laporan presensi individu
// @route GET /api/reports/individual
export const getIndividualReport = async (req, res) => {
  try {
    const { no_id, bulan, tahun } = req.query;

    if (!no_id || !bulan || !tahun) {
      return res.status(400).json({ success: false, message: 'No ID, Bulan, dan Tahun wajib dipilih!' });
    }

    const intern = await Intern.findOne({ no_id });
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Peserta magang tidak ditemukan' });
    }

    const b = String(bulan).padStart(2, '0');
    const t = String(tahun);
    const filter = new RegExp(`^${t}-${b}`);

    const attendances = await Attendance.find({
      no_id,
      tgl_presensi: { $regex: filter },
    }).sort({ tgl_presensi: 1 });

    res.json({
      success: true,
      intern,
      attendances,
      bulan: Number(bulan),
      namaBulan: monthNames[Number(bulan)],
      tahun: Number(tahun),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Dapatkan matriks rekapitulasi presensi bulanan seluruh peserta (1 - 31 hari)
// @route GET /api/reports/rekap-matrix
export const getRekapMatrix = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
      return res.status(400).json({ success: false, message: 'Bulan dan Tahun wajib dipilih!' });
    }

    const b = String(bulan).padStart(2, '0');
    const t = String(tahun);
    const filter = new RegExp(`^${t}-${b}`);

    const interns = await Intern.find({ status_aktif: true }).sort({ nama_lengkap: 1 });
    const attendances = await Attendance.find({ tgl_presensi: { $regex: filter } });

    // Map attendances by `no_id_day`
    const attMap = {};
    attendances.forEach((att) => {
      const day = parseInt(att.tgl_presensi.split('-')[2], 10);
      const key = `${att.no_id}_${day}`;
      attMap[key] = att;
    });

    const matrix = interns.map((intern) => {
      const days = {};
      let totalHadir = 0;
      let totalTerlambat = 0;

      for (let day = 1; day <= 31; day++) {
        const key = `${intern.no_id}_${day}`;
        const record = attMap[key];
        if (record) {
          totalHadir++;
          if (record.jam_in > '08:00:00') {
            totalTerlambat++;
          }
          days[day] = {
            jam_in: record.jam_in,
            jam_out: record.jam_out || '',
            status_waktu: record.status_waktu,
          };
        } else {
          days[day] = null;
        }
      }

      return {
        intern: {
          no_id: intern.no_id,
          nama_lengkap: intern.nama_lengkap,
          sekolah: intern.sekolah,
          jurusan: intern.jurusan,
          status: intern.status,
        },
        days,
        totalHadir,
        totalTerlambat,
      };
    });

    res.json({
      success: true,
      bulan: Number(bulan),
      namaBulan: monthNames[Number(bulan)],
      tahun: Number(tahun),
      matrix,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Export Excel Matriks Rekapitulasi Presensi
// @route GET /api/reports/export-excel
export const exportExcelRekap = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    if (!bulan || !tahun) {
      return res.status(400).json({ success: false, message: 'Bulan dan Tahun wajib dipilih!' });
    }

    const b = String(bulan).padStart(2, '0');
    const t = String(tahun);
    const filter = new RegExp(`^${t}-${b}`);
    const bName = monthNames[Number(bulan)];

    const interns = await Intern.find({ status_aktif: true }).sort({ nama_lengkap: 1 });
    const attendances = await Attendance.find({ tgl_presensi: { $regex: filter } });

    const attMap = {};
    attendances.forEach((att) => {
      const day = parseInt(att.tgl_presensi.split('-')[2], 10);
      attMap[`${att.no_id}_${day}`] = att;
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Rekap ${bName} ${t}`);

    // Judul
    sheet.mergeCells('A1:AJ1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `REKAPITULASI PRESENSI MAGANG BPS KOTA SUKABUMI - ${bName.toUpperCase()} ${t}`;
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A8A' }, // Navy blue
    };
    sheet.getRow(1).height = 30;

    // Header baris 3
    const headerRow = ['No', 'No ID', 'Nama Lengkap', 'Program', 'Asal Sekolah / Kampus'];
    for (let d = 1; d <= 31; d++) {
      headerRow.push(String(d));
    }
    headerRow.push('Hadir');
    headerRow.push('Terlambat');

    const tableHeader = sheet.addRow(headerRow);
    tableHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    tableHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    tableHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' }, // Primary blue
    };

    // Tambah data baris
    interns.forEach((intern, idx) => {
      const row = [idx + 1, intern.no_id, intern.nama_lengkap, intern.status, intern.sekolah];
      let totalHadir = 0;
      let totalTerlambat = 0;

      for (let day = 1; day <= 31; day++) {
        const record = attMap[`${intern.no_id}_${day}`];
        if (record) {
          totalHadir++;
          if (record.jam_in > '08:00:00') totalTerlambat++;
          row.push(`${record.jam_in}`);
        } else {
          row.push('-');
        }
      }

      row.push(totalHadir);
      row.push(totalTerlambat);
      sheet.addRow(row);
    });

    // Auto fit widths
    sheet.columns.forEach((col, i) => {
      if (i >= 5 && i <= 35) {
        col.width = 10;
      } else if (i === 1) {
        col.width = 16;
      } else if (i === 2) {
        col.width = 28;
      } else if (i === 4) {
        col.width = 25;
      } else {
        col.width = 12;
      }
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Rekap_Presensi_BPS_${bName}_${t}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
