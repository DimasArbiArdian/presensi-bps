import { Attendance } from '../models/Attendance.js';
import { OfficeConfig } from '../models/OfficeConfig.js';
import { Leave } from '../models/Leave.js';
import { Intern } from '../models/Intern.js';
import { calculateDistance } from '../utils/haversine.js';
import { saveBase64Image } from '../middlewares/upload.js';

// Helper get today YYYY-MM-DD
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper get current time HH:mm:ss
const getCurrentTimeString = () => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// @desc Dapatkan status presensi hari ini + konfigurasi kantor
// @route GET /api/attendance/today-status
export const getTodayStatus = async (req, res) => {
  try {
    const today = getTodayString();
    const no_id = req.user.no_id;

    const attendance = await Attendance.findOne({ no_id, tgl_presensi: today });
    let officeConfig = await OfficeConfig.findOne();

    if (!officeConfig) {
      officeConfig = await OfficeConfig.create({
        nama_kantor: 'BPS Kota Sukabumi',
        lokasi_kantor: '-6.910091184058985,106.93593094557392',
        radius: 200,
      });
    }

    res.json({
      success: true,
      today,
      attendance,
      officeConfig,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Melakukan presensi Masuk / Pulang
// @route POST /api/attendance/store
export const storeAttendance = async (req, res) => {
  try {
    const no_id = req.user.no_id;
    const intern_id = req.user._id;
    const today = getTodayString();
    const currentTime = getCurrentTimeString();

    const { lokasi, image, kegiatan } = req.body;

    if (!lokasi) {
      return res.status(400).json({ success: false, message: 'Koordinat lokasi GPS tidak terdeteksi!' });
    }

    if (!image) {
      return res.status(400).json({ success: false, message: 'Foto selfie absensi wajib diambil!' });
    }

    // Ambil konfigurasi lokasi kantor
    let officeConfig = await OfficeConfig.findOne();
    if (!officeConfig) {
      officeConfig = await OfficeConfig.create({
        nama_kantor: 'BPS Kota Sukabumi',
        lokasi_kantor: '-6.910091184058985,106.93593094557392',
        radius: 200,
      });
    }

    const [officeLat, officeLng] = officeConfig.lokasi_kantor.split(',').map((s) => s.trim());
    const [userLat, userLng] = lokasi.split(',').map((s) => s.trim());

    const distance = calculateDistance(officeLat, officeLng, userLat, userLng);

    // Validasi Radius Geofence
    if (distance > officeConfig.radius) {
      return res.status(400).json({
        success: false,
        type: 'radius_exceeded',
        distance,
        allowedRadius: officeConfig.radius,
        message: `Jarak Anda terlalu jauh dari kantor! Jarak Anda saat ini ${distance} meter (Batas radius kantor: ${officeConfig.radius} meter).`,
      });
    }

    let attendance = await Attendance.findOne({ no_id, tgl_presensi: today });
    const kegiatanText = kegiatan && kegiatan.trim() !== '' ? kegiatan.trim() : 'Tidak ada kegiatan';

    if (!attendance) {
      // PRESENSI MASUK
      const filename = `${no_id}-${today}-in-${Date.now()}.png`;
      saveBase64Image(image, filename, 'absensi');

      const isLate = currentTime > '08:00:00';
      const status_waktu = isLate ? 'Terlambat' : 'Tepat Waktu';

      attendance = await Attendance.create({
        intern: intern_id,
        no_id,
        tgl_presensi: today,
        jam_in: currentTime,
        foto_in: filename,
        lokasi_in: lokasi,
        jarak_in: distance,
        kegiatan_in: kegiatanText,
        status_waktu,
      });

      return res.json({
        success: true,
        type: 'in',
        message: isLate
          ? `Presensi Masuk Berhasil! Anda tercatat Terlambat (${currentTime}). Selamat bekerja!`
          : `Presensi Masuk Berhasil! Tepat waktu (${currentTime}). Selamat bekerja!`,
        attendance,
      });
    } else {
      // PRESENSI PULANG
      if (attendance.jam_out) {
        return res.status(400).json({
          success: false,
          message: 'Anda sudah melakukan presensi pulang untuk hari ini!',
        });
      }

      const filename = `${no_id}-${today}-out-${Date.now()}.png`;
      saveBase64Image(image, filename, 'absensi');

      attendance.jam_out = currentTime;
      attendance.foto_out = filename;
      attendance.lokasi_out = lokasi;
      attendance.jarak_out = distance;
      attendance.kegiatan_out = kegiatanText;

      await attendance.save();

      return res.json({
        success: true,
        type: 'out',
        message: 'Presensi Pulang Berhasil! Terima kasih atas dedikasi Anda hari ini, hati-hati di jalan!',
        attendance,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Dashboard data untuk Peserta Magang
// @route GET /api/attendance/dashboard-intern
export const getDashboardIntern = async (req, res) => {
  try {
    const today = getTodayString();
    const no_id = req.user.no_id;

    // Parsing bulan dan tahun saat ini
    const d = new Date();
    const currentMonth = String(d.getMonth() + 1).padStart(2, '0');
    const currentYear = String(d.getFullYear());
    const monthRegex = new RegExp(`^${currentYear}-${currentMonth}`);

    // Presensi hari ini
    const todayAttendance = await Attendance.findOne({ no_id, tgl_presensi: today });

    // Histori bulan ini
    const monthlyAttendances = await Attendance.find({
      no_id,
      tgl_presensi: { $regex: monthRegex },
    }).sort({ tgl_presensi: 1 });

    const jmlHadir = monthlyAttendances.length;
    const jmlTerlambat = monthlyAttendances.filter((a) => a.jam_in > '08:00:00').length;

    // Hitung Izin & Sakit bulan ini yang sudah diapprove
    const leaves = await Leave.find({
      no_id,
      tgl_izin: { $regex: monthRegex },
      status_approve: 1,
    });

    const jmlIzin = leaves.filter((l) => l.status_izin === 'i').length;
    const jmlSakit = leaves.filter((l) => l.status_izin === 's').length;

    // Leaderboard hari ini
    const todayAll = await Attendance.find({ tgl_presensi: today })
      .populate('intern', 'nama_lengkap status sekolah foto')
      .sort({ jam_in: 1 })
      .limit(10);

    res.json({
      success: true,
      today,
      todayAttendance,
      monthlyAttendances,
      stats: {
        jmlHadir,
        jmlTerlambat,
        jmlIzin,
        jmlSakit,
      },
      leaderboard: todayAll,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Riwayat presensi bulanan peserta
// @route GET /api/attendance/histori
export const getHistori = async (req, res) => {
  try {
    const no_id = req.user.no_id;
    const { bulan, tahun } = req.query;

    const b = bulan ? String(bulan).padStart(2, '0') : String(new Date().getMonth() + 1).padStart(2, '0');
    const t = tahun || String(new Date().getFullYear());
    const filter = new RegExp(`^${t}-${b}`);

    const records = await Attendance.find({
      no_id,
      tgl_presensi: { $regex: filter },
    }).sort({ tgl_presensi: -1 });

    res.json({
      success: true,
      bulan: b,
      tahun: t,
      records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Dashboard data untuk Administrator
// @route GET /api/attendance/dashboard-admin
export const getDashboardAdmin = async (req, res) => {
  try {
    const today = getTodayString();

    const todayAttendances = await Attendance.find({ tgl_presensi: today });
    const jmlHadir = todayAttendances.length;
    const jmlTerlambat = todayAttendances.filter((a) => a.jam_in > '08:00:00').length;

    const todayLeaves = await Leave.find({ tgl_izin: today, status_approve: 1 });
    const jmlIzin = todayLeaves.filter((l) => l.status_izin === 'i').length;
    const jmlSakit = todayLeaves.filter((l) => l.status_izin === 's').length;

    const totalInterns = await Intern.countDocuments({ status_aktif: true });

    res.json({
      success: true,
      today,
      stats: {
        jmlHadir,
        jmlTerlambat,
        jmlIzin,
        jmlSakit,
        totalInterns,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Monitoring Presensi Realtime untuk Admin
// @route GET /api/attendance/monitoring
export const getLiveMonitoring = async (req, res) => {
  try {
    const tanggal = req.query.tanggal || getTodayString();

    const attendances = await Attendance.find({ tgl_presensi: tanggal })
      .populate('intern', 'nama_lengkap sekolah jurusan status foto no_hp')
      .sort({ jam_in: 1 });

    const officeConfig = await OfficeConfig.findOne();

    res.json({
      success: true,
      tanggal,
      attendances,
      officeConfig,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Detail satu presensi untuk modal peta / detail
// @route GET /api/attendance/:id
export const getAttendanceDetail = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('intern');
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Data presensi tidak ditemukan' });
    }

    const officeConfig = await OfficeConfig.findOne();

    res.json({
      success: true,
      attendance,
      officeConfig,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
