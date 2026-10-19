import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import { MobileLayout } from './layouts/MobileLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Intern Pages
import { LoginIntern } from './pages/intern/LoginIntern';
import { DashboardIntern } from './pages/intern/DashboardIntern';
import { PresensiPage } from './pages/intern/PresensiPage';
import { HistoriPage } from './pages/intern/HistoriPage';
import { IzinPage } from './pages/intern/IzinPage';
import { ProfilePage } from './pages/intern/ProfilePage';

// Admin Pages
import { LoginAdmin } from './pages/admin/LoginAdmin';
import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { MonitoringPage } from './pages/admin/MonitoringPage';
import { DataMagangPage } from './pages/admin/DataMagangPage';
import { MasterProgramPage } from './pages/admin/MasterProgramPage';
import { PersetujuanIzinPage } from './pages/admin/PersetujuanIzinPage';
import { KonfigurasiLokasiPage } from './pages/admin/KonfigurasiLokasiPage';
import { LaporanRekapPage } from './pages/admin/LaporanRekapPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<LoginIntern />} />
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Intern Portal Protected Routes */}
          <Route element={<MobileLayout />}>
            <Route path="/dashboard" element={<DashboardIntern />} />
            <Route path="/presensi" element={<PresensiPage />} />
            <Route path="/histori" element={<HistoriPage />} />
            <Route path="/izin" element={<IzinPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Panel Protected Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/monitoring" element={<MonitoringPage />} />
            <Route path="/admin/magang" element={<DataMagangPage />} />
            <Route path="/admin/program" element={<MasterProgramPage />} />
            <Route path="/admin/izin" element={<PersetujuanIzinPage />} />
            <Route path="/admin/lokasi" element={<KonfigurasiLokasiPage />} />
            <Route path="/admin/laporan" element={<LaporanRekapPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
