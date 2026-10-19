import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Intern } from '../models/Intern.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak, token autentikasi tidak ditemukan.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Akun admin tidak ditemukan.' });
      }
      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'admin',
      };
    } else if (decoded.role === 'intern') {
      const intern = await Intern.findById(decoded.id).select('-password');
      if (!intern) {
        return res.status(401).json({ success: false, message: 'Akun peserta magang tidak ditemukan.' });
      }
      req.user = {
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
      };
    } else {
      return res.status(401).json({ success: false, message: 'Role tidak valid.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Sesi telah berakhir atau token tidak valid. Silakan login kembali.',
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Akses terbatas hanya untuk Administrator.',
    });
  }
};

export const internOnly = (req, res, next) => {
  if (req.user && req.user.role === 'intern') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Akses terbatas hanya untuk Peserta Magang.',
    });
  }
};
