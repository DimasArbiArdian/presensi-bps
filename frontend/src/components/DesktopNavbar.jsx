import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BpsLogo } from './BpsLogo';
import {
  Home,
  Camera,
  History,
  FileCheck2,
  User,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';

export const DesktopNavbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Beranda', path: '/dashboard', icon: Home },
    { name: 'Presensi', path: '/presensi', icon: Camera },
    { name: 'Riwayat Presensi', path: '/histori', icon: History },
    { name: 'Pengajuan Izin', path: '/izin', icon: FileCheck2 },
    { name: 'Profil Saya', path: '/profile', icon: User },
  ];

  return (
    <header className="desktop-navbar">
      <div className="desktop-navbar-inner">
        {/* Brand */}
        <NavLink to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <BpsLogo size={36} showText={true} />
        </NavLink>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `desktop-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle, Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            style={{ padding: '8px', borderRadius: '50%' }}
            title="Ganti Tema"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User Badge */}
          <NavLink
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(0, 75, 135, 0.06)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                fontSize: '0.85rem',
                fontWeight: '700',
              }}
            >
              {user?.foto ? (
                <img
                  src={`/uploads/magang/${user.foto}`}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                user?.nama_lengkap?.charAt(0) || 'P'
              )}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {user?.nama_lengkap?.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {user?.no_id}
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-danger)', borderColor: 'rgba(220, 38, 38, 0.2)' }}
            title="Keluar"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
