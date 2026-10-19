import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';

export const PersetujuanIzinPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [statusApprove, setStatusApprove] = useState('');
  const [searchNoId, setSearchNoId] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let query = `?dari=${dari}&sampai=${sampai}&status_approve=${statusApprove}`;
      if (searchNoId) query += `&no_id=${searchNoId}`;
      const res = await API.get(`/leaves${query}`);
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
  }, [dari, sampai, statusApprove, searchNoId]);

  const handleUpdateStatus = async (id, status, statusText) => {
    if (window.confirm(`Yakin ingin mengubah status pengajuan ini menjadi: ${statusText}?`)) {
      try {
        await API.put(`/leaves/${id}/status`, { status_approve: status });
        fetchLeaves();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal mengubah status pengajuan');
      }
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
        <Clock size={12} /> Menunggu Verifikasi
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Persetujuan Izin & Sakit</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Verifikasi, setujui, atau tolak permohonan ketidakhadiran peserta magang
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLeaves}
          disabled={loading}
          className="btn btn-outline"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Segarkan
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          borderRadius: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'flex-end',
        }}
      >
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Dari Tanggal</label>
          <input
            type="date"
            className="form-input"
            value={dari}
            onChange={(e) => setDari(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Sampai Tanggal</label>
          <input
            type="date"
            className="form-input"
            value={sampai}
            onChange={(e) => setSampai(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Status Pengajuan</label>
          <select
            className="form-select"
            value={statusApprove}
            onChange={(e) => setStatusApprove(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="0">Menunggu (Pending)</option>
            <option value="1">Disetujui (Approved)</option>
            <option value="2">Ditolak (Rejected)</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter No ID</label>
          <input
            type="text"
            className="form-input"
            placeholder="Cari No ID..."
            value={searchNoId}
            onChange={(e) => setSearchNoId(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No</th>
              <th>Tanggal Izin</th>
              <th>Peserta Magang</th>
              <th>Tipe</th>
              <th>Keterangan / Alasan</th>
              <th>Status</th>
              <th>Aksi Persetujuan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Memuat data izin...
                </td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Tidak ada permohonan izin ditemukan.
                </td>
              </tr>
            ) : (
              leaves.map((l, idx) => (
                <tr key={l._id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: '700' }}>{l.tgl_izin}</td>
                  <td>
                    <div>
                      <span style={{ fontWeight: '600' }}>
                        {l.intern?.nama_lengkap || l.no_id}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID: {l.no_id} &bull; {l.intern?.sekolah}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${l.status_izin === 's' ? 'badge-danger' : 'badge-info'}`}
                    >
                      {l.status_izin === 's' ? 'Sakit' : 'Izin'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '280px' }}>{l.keterangan}</td>
                  <td>{getStatusBadge(l.status_approve)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {l.status_approve !== 1 && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(l._id, 1, 'Disetujui')}
                          className="btn btn-success btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <CheckCircle2 size={13} /> Setujui
                        </button>
                      )}
                      {l.status_approve !== 2 && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(l._id, 2, 'Ditolak')}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <XCircle size={13} /> Tolak
                        </button>
                      )}
                      {l.status_approve !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(l._id, 0, 'Pending/Reset')}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
