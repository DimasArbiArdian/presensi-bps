import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, History, Camera, FileCheck2, User } from 'lucide-react';

export const MobileNavbar = () => {
  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        height: '65px',
        backgroundColor: 'var(--bg-card-glass)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 900,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        padding: '0 0.5rem',
      }}
    >
      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--color-primary-light)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
        })}
      >
        <Home size={20} />
        <span>Beranda</span>
      </NavLink>

      <NavLink
        to="/histori"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--color-primary-light)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
        })}
      >
        <History size={20} />
        <span>Histori</span>
      </NavLink>

      {/* Floating Center Presensi Button */}
      <NavLink
        to="/presensi"
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-28px',
          boxShadow: '0 6px 16px rgba(59, 130, 246, 0.45)',
          border: '4px solid var(--bg-card)',
          transition: 'var(--transition)',
        }}
        title="Ambil Presensi"
      >
        <Camera size={26} />
      </NavLink>

      <NavLink
        to="/izin"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--color-primary-light)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
        })}
      >
        <FileCheck2 size={20} />
        <span>Izin</span>
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--color-primary-light)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive ? '700' : '500',
        })}
      >
        <User size={20} />
        <span>Profil</span>
      </NavLink>
    </nav>
  );
};
