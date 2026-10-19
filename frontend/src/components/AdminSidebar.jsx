import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  MapPin,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { BpsLogo } from './BpsLogo';

export const AdminSidebar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Monitoring Presensi', path: '/admin/monitoring', icon: CalendarCheck },
    { name: 'Data Peserta Magang', path: '/admin/magang', icon: Users },
    { name: 'Master Program', path: '/admin/program', icon: Award },
    { name: 'Persetujuan Izin', path: '/admin/izin', icon: ShieldCheck },
    { name: 'Konfigurasi Lokasi', path: '/admin/lokasi', icon: MapPin },
    { name: 'Laporan & Rekap', path: '/admin/laporan', icon: FileSpreadsheet },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div>
        {/* Brand / Logo */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <BpsLogo size={36} showText={true} />
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                  transition: 'var(--transition)',
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account / Theme Toggle */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem',
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Admin Panel</div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
            title="Ganti Tema"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-outline btn-block btn-sm"
          style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </aside>
  );
};
