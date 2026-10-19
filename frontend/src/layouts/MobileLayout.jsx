import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MobileNavbar } from '../components/MobileNavbar';
import { DesktopNavbar } from '../components/DesktopNavbar';

export const MobileLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-app)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 75, 135, 0.2)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Memuat Sistem Presensi...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'intern') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="intern-wrapper">
      {/* Visible only on Desktop (>= 768px) */}
      <DesktopNavbar />

      {/* Adaptive container: max-width 480px on phone, max-width 1280px on laptop/desktop */}
      <main className="intern-container">
        <Outlet />
      </main>

      {/* Visible only on Mobile (< 768px) */}
      <MobileNavbar />
    </div>
  );
};
