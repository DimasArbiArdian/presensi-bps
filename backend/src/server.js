import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import internRoutes from './routes/internRoutes.js';
import programRoutes from './routes/programRoutes.js';
import officeRoutes from './routes/officeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// Dynamic CORS for local & production (Vercel, custom domains)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

if (process.env.CLIENT_URL && process.env.CLIENT_URL.includes(',')) {
  process.env.CLIENT_URL.split(',').forEach((url) => allowedOrigins.push(url.trim()));
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) return callback(null, true);
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static Uploads Folder
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/office', officeRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BPS Sukabumi Presensi API (MERN Stack)',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port ${PORT} (Node.js ${process.version})`);
});
