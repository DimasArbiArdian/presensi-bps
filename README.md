# 📊 Sistem Presensi Online BPS Kota Sukabumi (MERN Stack)

Sistem presensi modern berbasis **MERN Stack** (MongoDB Atlas, Express.js, React.js dengan Vite, dan Node.js) yang dirancang khusus untuk Badan Pusat Statistik (BPS) Kota Sukabumi.

---

## 🌟 Fitur Utama

- **Presensi GPS Geofencing**: Validasi radius kehadiran otomatis di titik kantor BPS Kota Sukabumi menggunakan formula Haversine.
- **Kamera Selfie & Face Snapshot**: Pengambilan foto kehadiran langsung melalui webcam dengan hitung mundur otomatis.
- **Dual Responsive Layout**:
  - **Desktop ($ge$ 768px)**: Web app layar penuh dengan desktop navbar, multi-column grid, dan tampilan dashboard analitik.
  - **Mobile (< 768px)**: Native-style mobile app layout dengan floating bottom navigation bar.
- **Identitas Resmi BPS**: Menggunakan lambang resmi BPS Kota Sukabumi dan palet warna institusi (*BPS Navy Blue*, *Orange*, dan *Green*).
- **Portal Administrator Lengkap**:
  - Monitoring kehadiran harian secara real-time dengan pratinjau peta Leaflet & foto selfie.
  - Manajemen data peserta magang & master program (Magang/PKL).
  - Persetujuan izin/sakit peserta (*Approve/Reject*).
  - Konfigurasi koordinat kantor dan radius meter geofence.
  - Cetak laporan presensi resmi ber-kop surat BPS dan Export ke Excel (.xlsx).

---

## 🏗️ Struktur Proyek

```
bps-presensi-mern/
├── backend/            # Express.js REST API & MongoDB Mongoose Models
│   ├── src/
│   │   ├── config/     # Koneksi MongoDB Atlas & DNS resolver
│   │   ├── controllers/# Business logic (auth, attendance, leaves, reports)
│   │   ├── models/     # Mongoose models (Intern, User, Attendance, Leave, etc.)
│   │   ├── routes/     # Express API routes
│   │   └── server.js   # Server entrypoint (CORS & dynamic origins)
│   ├── uploads/        # Direktori foto selfie absensi & avatar
│   ├── .env.example    # Template konfigurasi environment backend
│   └── package.json
│
├── frontend/           # React 18 + Vite Web Application
│   ├── src/
│   │   ├── components/ # BpsLogo, DesktopNavbar, MobileNavbar, AdminSidebar
│   │   ├── layouts/    # MobileLayout (adaptif) & AdminLayout
│   │   ├── pages/      # Halaman Intern & Admin
│   │   └── services/   # Axios API client & dynamic backend URL
│   ├── public/         # Aset logo resmi BPS & favicon
│   ├── vercel.json     # Konfigurasi SPA rewrite untuk Vercel
│   ├── .env.example    # Template environment frontend (VITE_API_URL)
│   └── package.json
│
├── presensi.sql        # Database dump SQL awal
└── README.md
```

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Backend
```bash
cd backend
npm install
# Salin .env.example menjadi .env dan sesuaikan MONGODB_URI jika perlu
cp .env.example .env
npm start
```
Server backend berjalan di `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di `http://localhost:5173`.

---

## ☁️ Deployment ke Cloud (100% Gratis)

- **Frontend**: Deploy ke **[Vercel](https://vercel.com)** dengan Root Directory `frontend`. Set environment variable `VITE_API_URL` mengarah ke URL backend Anda.
- **Backend**: Deploy ke **[Render.com](https://render.com)** sebagai Free Web Service dengan Root Directory `backend`. Set environment variables sesuai `backend/.env.example`.
- **Database**: Menggunakan cluster **MongoDB Atlas** M0 Free Tier.
