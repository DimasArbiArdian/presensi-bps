import { Leave } from '../models/Leave.js';
import { Intern } from '../models/Intern.js';

// @desc Peserta Magang mengajukan izin / sakit
// @route POST /api/leaves
export const createLeave = async (req, res) => {
  try {
    const no_id = req.user.no_id;
    const intern_id = req.user._id;
    const { tgl_izin, status_izin, keterangan } = req.body;

    if (!tgl_izin || !status_izin || !keterangan) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal izin, tipe (izin/sakit), dan alasan/keterangan wajib diisi!',
      });
    }

    // Cek apakah tanggal ini sudah pernah diajukan
    const existing = await Leave.findOne({ no_id, tgl_izin });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Pengajuan izin untuk tanggal ${tgl_izin} sudah pernah dibuat sebelumnya!`,
      });
    }

    const leave = await Leave.create({
      intern: intern_id,
      no_id,
      tgl_izin,
      status_izin,
      keterangan,
      status_approve: 0, // Pending
    });

    res.status(201).json({
      success: true,
      message: 'Pengajuan izin/sakit berhasil dikirim! Menunggu persetujuan Admin.',
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Dapatkan daftar pengajuan izin peserta yang sedang login
// @route GET /api/leaves/my-leaves
export const getInternLeaves = async (req, res) => {
  try {
    const no_id = req.user.no_id;
    const leaves = await Leave.find({ no_id }).sort({ tgl_izin: -1 });

    res.json({
      success: true,
      leaves,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin melihat semua pengajuan izin & sakit dengan filter
// @route GET /api/leaves
export const getAllLeaves = async (req, res) => {
  try {
    const { dari, sampai, no_id, status_approve } = req.query;

    const query = {};

    if (dari && sampai) {
      query.tgl_izin = { $gte: dari, $lte: sampai };
    } else if (dari) {
      query.tgl_izin = { $gte: dari };
    } else if (sampai) {
      query.tgl_izin = { $lte: sampai };
    }

    if (no_id) {
      query.no_id = no_id;
    }

    if (status_approve !== undefined && status_approve !== '') {
      query.status_approve = Number(status_approve);
    }

    const leaves = await Leave.find(query)
      .populate('intern', 'nama_lengkap sekolah jurusan status')
      .sort({ tgl_izin: -1 });

    res.json({
      success: true,
      leaves,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin mengubah status approve izin/sakit
// @route PUT /api/leaves/:id/status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status_approve } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Data pengajuan tidak ditemukan' });
    }

    leave.status_approve = Number(status_approve);
    await leave.save();

    const statusText =
      leave.status_approve === 1
        ? 'Disetujui'
        : leave.status_approve === 2
        ? 'Ditolak'
        : 'Pending';

    res.json({
      success: true,
      message: `Pengajuan izin berhasil diubah menjadi: ${statusText}`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
