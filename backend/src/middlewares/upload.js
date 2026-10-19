import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan direktori uploads tersedia
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const uploadsBasePath = path.resolve(__dirname, '../../uploads');
createDir(path.join(uploadsBasePath, 'magang'));
createDir(path.join(uploadsBasePath, 'absensi'));

// Storage Avatar Magang
const magangStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadsBasePath, 'magang'));
  },
  filename: (req, file, cb) => {
    const no_id = req.user ? req.user.no_id : (req.body.no_id || 'avatar');
    const ext = path.extname(file.originalname);
    cb(null, `${no_id}-${Date.now()}${ext}`);
  },
});

// Storage Foto Absensi
const absensiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadsBasePath, 'absensi'));
  },
  filename: (req, file, cb) => {
    const no_id = req.user ? req.user.no_id : 'absensi';
    const date = new Date().toISOString().split('T')[0];
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${no_id}-${date}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  }
  cb(new Error('Hanya file gambar (JPEG, JPG, PNG, WEBP) yang diizinkan!'));
};

export const uploadAvatar = multer({
  storage: magangStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export const uploadAbsensi = multer({
  storage: absensiStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

// Helper untuk simpan Base64 Image (Webcam selfie capture)
export const saveBase64Image = (base64Data, filename, folder = 'absensi') => {
  const targetDir = path.join(uploadsBasePath, folder);
  createDir(targetDir);

  const targetPath = path.join(targetDir, filename);

  // Bersihkan header base64 (cth: data:image/png;base64,...)
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Image, 'base64');

  fs.writeFileSync(targetPath, buffer);
  return filename;
};
