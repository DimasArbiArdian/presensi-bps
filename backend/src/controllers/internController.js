import { Intern } from '../models/Intern.js';
import bcrypt from 'bcryptjs';

// @desc Admin melihat daftar peserta magang
// @route GET /api/interns
export const getInterns = async (req, res) => {
  try {
    const { nama_peserta, status } = req.query;

    const query = {};
    if (nama_peserta) {
      query.nama_lengkap = { $regex: nama_peserta, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const interns = await Intern.find(query).sort({ nama_lengkap: 1 });

    res.json({
      success: true,
      interns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin menambah peserta magang baru
// @route POST /api/interns
export const createIntern = async (req, res) => {
  try {
    const { no_id, nama_lengkap, sekolah, jurusan, semester, status, no_hp, password } = req.body;

    if (!no_id || !nama_lengkap || !sekolah || !jurusan || !no_hp) {
      return res.status(400).json({
        success: false,
        message: 'No ID, Nama Lengkap, Sekolah, Jurusan, dan No HP wajib diisi!',
      });
    }

    const existing = await Intern.findOne({ no_id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Peserta dengan No ID ${no_id} sudah terdaftar!`,
      });
    }

    let fotoName = null;
    if (req.file) {
      fotoName = req.file.filename;
    }

    const newIntern = await Intern.create({
      no_id,
      nama_lengkap,
      sekolah,
      jurusan,
      semester: semester || '',
      status: status || 'Magang',
      no_hp,
      password: password && password.trim() !== '' ? password : '12345',
      foto: fotoName,
    });

    res.status(201).json({
      success: true,
      message: 'Data peserta magang berhasil ditambahkan!',
      intern: newIntern,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin memperbarui data peserta magang
// @route PUT /api/interns/:no_id
export const updateIntern = async (req, res) => {
  try {
    const { no_id } = req.params;
    const { nama_lengkap, sekolah, jurusan, semester, status, no_hp, password } = req.body;

    const intern = await Intern.findOne({ no_id });
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Data peserta tidak ditemukan' });
    }

    intern.nama_lengkap = nama_lengkap || intern.nama_lengkap;
    intern.sekolah = sekolah || intern.sekolah;
    intern.jurusan = jurusan || intern.jurusan;
    intern.semester = semester !== undefined ? semester : intern.semester;
    intern.status = status || intern.status;
    intern.no_hp = no_hp || intern.no_hp;

    if (req.file) {
      intern.foto = req.file.filename;
    }

    if (password && password.trim() !== '') {
      intern.password = password;
    }

    await intern.save();

    res.json({
      success: true,
      message: 'Data peserta magang berhasil diperbarui!',
      intern,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin menghapus peserta magang
// @route DELETE /api/interns/:no_id
export const deleteIntern = async (req, res) => {
  try {
    const { no_id } = req.params;
    const intern = await Intern.findOneAndDelete({ no_id });

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Data peserta tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Data peserta magang berhasil dihapus!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Reset password peserta magang ke default '12345'
// @route POST /api/interns/:no_id/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { no_id } = req.params;
    const intern = await Intern.findOne({ no_id });

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Data peserta tidak ditemukan' });
    }

    intern.password = '12345';
    await intern.save();

    res.json({
      success: true,
      message: 'Password peserta berhasil direset ke default: 12345',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
