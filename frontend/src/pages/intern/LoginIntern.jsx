import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, UserCheck, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { BpsLogo } from '../../components/BpsLogo';

export const LoginIntern = () => {
  const [noId, setNoId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginIntern } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginIntern(noId, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal login, periksa kembali No ID dan Password!');
    } finally {
      setLoading(false);
    }
  };

  const setSampleAccount = (id, pass) => {
    setNoId(id);
    setPassword(pass);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.2rem', color: 'var(--color-primary)' }}>
            BADAN PUSAT STATISTIK
          </h2>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-secondary)', letterSpacing: '0.5px' }}>
            KOTA SUKABUMI
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '3px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 75, 135, 0.08)',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--color-primary)',
            }}
          >
            Portal Presensi Magang &bull; <em>Mencatat Indonesia</em>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">No ID Peserta</label>
            <div style={{ position: 'relative' }}>
              <UserCheck
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
                type="text"
                className="form-input"
                placeholder="Contoh: 20220040165"
                value={noId}
                onChange={(e) => setNoId(e.target.value)}
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
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Memproses Masuk...' : 'Masuk ke Sistem'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Sample Login */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem' }}>
            Akun Percobaan Cepat:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setSampleAccount('20220040165', '1234')}
            >
              Dimas (1234)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setSampleAccount('20220040166', '12345')}
            >
              Aceng (12345)
            </button>
          </div>
        </div>

        {/* Admin Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/admin/login"
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Shield size={14} /> Portal Administrator BPS &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
