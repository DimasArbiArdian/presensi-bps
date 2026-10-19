import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Intern } from '../models/Intern.js';
import bcrypt from 'bcryptjs';

const generateToken = (res, id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  // Pasang cookie HTTP-Only
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });

  return token;
};

// @desc Login Peserta Magang
// @route POST /api/auth/login-intern
export const loginIntern = async (req, res) => {
  try {
    const { no_id, password } = req.body;

    if (!no_id || !password) {
      return res.status(400).json({
        success: false,
        message: 'No ID dan Password wajib diisi!',
      });
    }

    const intern = await Intern.findOne({ no_id });
    if (!intern) {
      return res.status(401).json({
        success: false,
        message: 'No ID atau Password salah!',
      });
    }

    const isMatch = await intern.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'No ID atau Password salah!',
      });
    }

    const token = generateToken(res, intern._id, 'intern');

    res.json({
      success: true,
      message: 'Login berhasil! Selamat datang, ' + intern.nama_lengkap,
      token,
      user: {
        _id: intern._id,
        no_id: intern.no_id,
        nama_lengkap: intern.nama_lengkap,
        sekolah: intern.sekolah,
        jurusan: intern.jurusan,
        semester: intern.semester,
        status: intern.status,
        foto: intern.foto,
        no_hp: intern.no_hp,
        role: 'intern',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login Administrator
// @route POST /api/auth/login-admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan Password wajib diisi!',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau Password salah!',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau Password salah!',
      });
    }

    const token = generateToken(res, user._id, 'admin');

    res.json({
      success: true,
      message: 'Login Admin berhasil!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Dapatkan profile akun saat ini
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update profil peserta magang
// @route PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const intern = await Intern.findById(req.user._id);

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Peserta tidak ditemukan' });
    }

    intern.nama_lengkap = req.body.nama_lengkap || intern.nama_lengkap;
    intern.no_hp = req.body.no_hp || intern.no_hp;

    if (req.file) {
      intern.foto = req.file.filename;
    }

    if (req.body.password && req.body.password.trim() !== '') {
      intern.password = req.body.password;
    }

    await intern.save();

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      user: {
        _id: intern._id,
        no_id: intern.no_id,
        nama_lengkap: intern.nama_lengkap,
        sekolah: intern.sekolah,
        jurusan: intern.jurusan,
        semester: intern.semester,
        status: intern.status,
        foto: intern.foto,
        no_hp: intern.no_hp,
        role: 'intern',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Berhasil logout' });
};
