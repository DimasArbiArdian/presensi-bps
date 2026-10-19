import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';
import {
  User,
  Phone,
  Lock,
  Camera,
  LogOut,
  Moon,
  Sun,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser, logout, theme, toggleTheme } = useAuth();

  const [namaLengkap, setNamaLengkap] = useState(user?.nama_lengkap || '');
  const [noHp, setNoHp] = useState(user?.no_hp || '');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('nama_lengkap', namaLengkap);
    formData.append('no_hp', noHp);
    if (password && password.trim() !== '') {
      formData.append('password', password);
    }
    if (selectedFile) {
      formData.append('foto', selectedFile);
    }

    try {
      const res = await API.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setMessage('Profil berhasil diperbarui!');
        refreshUser(res.data.user);
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.25rem 1rem' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Profil Peserta</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        Kelola informasi akun dan pengaturan personal Anda
      </p>

      {message && (
        <div
          style={{
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1rem',
          }}
        >
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1rem',
          }}
        >
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="desktop-grid-split">
        {/* Left Column: Avatar & Summary & Actions */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem 1.5rem', borderRadius: '20px', textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid var(--color-primary)',
                  backgroundColor: 'rgba(0, 75, 135, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  boxShadow: 'var(--shadow-md)',
                  margin: '0 auto',
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Avatar Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : user?.foto ? (
                  <img
                    src={`/uploads/magang/${user.foto}`}
                    alt={user.nama_lengkap}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  user?.nama_lengkap?.charAt(0) || 'P'
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  border: '2px solid #fff',
                }}
                title="Ganti Foto"
              >
                <Camera size={18} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.3rem', color: 'var(--text-main)' }}>
              {user?.nama_lengkap}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="badge badge-info">ID: {user?.no_id}</span>
              <span className="badge badge-success">Magang Aktif</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Building2 size={16} color="var(--color-primary)" />
                <span>{user?.sekolah || '-'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={16} color="var(--color-secondary)" />
                <span>{user?.jurusan || '-'}</span>
              </div>
            </div>
          </div>

          {/* Theme & Logout Section */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-outline btn-block"
              style={{ justifyContent: 'space-between', padding: '0.75rem 1rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                Tema Tampilan
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {theme === 'light' ? 'Mode Terang' : 'Mode Gelap'}
              </span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="btn btn-outline btn-block"
              style={{
                color: 'var(--color-danger)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                padding: '0.75rem 1rem',
                fontWeight: '600',
              }}
            >
              <LogOut size={18} /> Keluar dari Akun
            </button>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div>
          <form onSubmit={handleUpdate} className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Informasi Akun & Keamanan
            </h3>

            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-input"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor WhatsApp / HP</label>
              <input
                type="text"
                className="form-input"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Asal Kampus / Sekolah</label>
                <input
                  type="text"
                  className="form-input"
                  value={user?.sekolah || ''}
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jurusan</label>
                <input
                  type="text"
                  className="form-input"
                  value={user?.jurusan || ''}
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Ganti Password (Kosongkan jika tidak ingin ganti)</label>
              <input
                type="password"
                className="form-input"
                placeholder="Masukkan password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '1.25rem', padding: '0.85rem' }}
            >
              <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
