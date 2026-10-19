import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { BpsLogo } from '../../components/BpsLogo';

export const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau Password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(0, 75, 135, 0.15)',
              padding: '10px',
              border: '1px solid rgba(0, 75, 135, 0.08)',
            }}
          >
            <BpsLogo size={64} showText={false} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.2rem', color: 'var(--color-primary)' }}>
            PANEL ADMINISTRATOR
          </h2>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-secondary)' }}>
            BADAN PUSAT STATISTIK KOTA SUKABUMI
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
            Sistem Manajemen Presensi & Geofencing
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Administrator</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                className="form-input"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="password"
                className="form-input"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ marginTop: '1.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk Panel Admin'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Admin Credential Hint */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              setEmail('admin@gmail.com');
              setPassword('123');
            }}
          >
            Gunakan Akun Default (admin@gmail.com / 123)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={14} /> Kembali ke Portal Peserta
          </Link>
        </div>
      </div>
    </div>
  );
};
