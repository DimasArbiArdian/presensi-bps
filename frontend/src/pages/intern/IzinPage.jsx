import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Send,
} from 'lucide-react';

export const IzinPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [tglIzin, setTglIzin] = useState('');
  const [statusIzin, setStatusIzin] = useState('i'); // 'i' or 's'
  const [keterangan, setKeterangan] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await API.get('/leaves/my-leaves');
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const res = await API.post('/leaves', {
        tgl_izin: tglIzin,
        status_izin: statusIzin,
        keterangan,
      });

      if (res.data.success) {
        setFormSuccess('Pengajuan berhasil dikirim!');
        setTglIzin('');
        setKeterangan('');
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess('');
          fetchLeaves();
        }, 1200);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal mengirim pengajuan izin.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 1) {
      return (
        <span className="badge badge-success">
          <CheckCircle2 size={12} /> Disetujui
        </span>
      );
    }
    if (status === 2) {
      return (
        <span className="badge badge-danger">
          <XCircle size={12} /> Ditolak
        </span>
      );
    }
    return (
      <span className="badge badge-warning">
        <Clock size={12} /> Menunggu
      </span>
    );
  };

  return (
    <div style={{ padding: '1.25rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Pengajuan Izin / Sakit</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Permohonan tidak masuk magang
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-sm"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <Plus size={16} /> Buat Izin
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '0.85rem 1rem', borderRadius: '14px', borderLeft: '3px solid var(--color-primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Pengajuan</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary)' }}>
            {leaves.length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '0.85rem 1rem', borderRadius: '14px', borderLeft: '3px solid var(--color-warning)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Menunggu Approval</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-warning)' }}>
            {leaves.filter((l) => l.status_approve === 0).length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '0.85rem 1rem', borderRadius: '14px', borderLeft: '3px solid var(--color-success)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disetujui</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-success)' }}>
            {leaves.filter((l) => l.status_approve === 1).length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '0.85rem 1rem', borderRadius: '14px', borderLeft: '3px solid var(--color-danger)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ditolak</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-danger)' }}>
            {leaves.filter((l) => l.status_approve === 2).length}
          </div>
        </div>
      </div>

      {/* List Leaves */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          Memuat riwayat pengajuan...
        </div>
      ) : leaves.length === 0 ? (
        <div
          className="glass-panel"
          style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '20px' }}
        >
          <FileText size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>Belum ada pengajuan izin atau sakit.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {leaves.map((l) => (
            <div
              key={l._id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                borderLeft:
                  l.status_approve === 1
                    ? '4px solid var(--color-success)'
                    : l.status_approve === 2
                    ? '4px solid var(--color-danger)'
                    : '4px solid var(--color-warning)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    {l.status_izin === 'i' ? '📋 Izin Tidak Hadir' : '🏥 Sakit'}
                  </span>
                  {getStatusBadge(l.status_approve)}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Tanggal: {l.tgl_izin}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  <strong>Keterangan:</strong> {l.keterangan}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Form Pengajuan Izin / Sakit</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave}>
              <div className="modal-body">
                {formError && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-danger-bg)',
                      color: 'var(--color-danger)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {formSuccess}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Tanggal Izin</label>
                  <input
                    type="date"
                    className="form-input"
                    value={tglIzin}
                    onChange={(e) => setTglIzin(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipe Pengajuan</label>
                  <select
                    className="form-select"
                    value={statusIzin}
                    onChange={(e) => setStatusIzin(e.target.value)}
                  >
                    <option value="i">Izin Tidak Masuk</option>
                    <option value="s">Sakit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Keterangan / Alasan</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Tuliskan alasan lengkap permohonan izin..."
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  <Send size={16} /> {submitting ? 'Mengirim...' : 'Kirim Pengajuan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
