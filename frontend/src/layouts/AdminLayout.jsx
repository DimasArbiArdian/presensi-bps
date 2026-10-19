import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/AdminSidebar';

export const AdminLayout = () => {
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
        <p style={{ color: 'var(--text-muted)' }}>Memuat Panel Admin...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-main">
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
