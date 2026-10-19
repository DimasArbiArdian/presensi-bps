import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';

export const HistoriPage = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const monthOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const fetchHistori = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/attendance/histori?bulan=${bulan}&tahun=${tahun}`);
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (error) {
      console.error('Error fetching histori:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistori();
  }, [bulan, tahun]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div style={{ padding: '1.25rem 1rem' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Riwayat Presensi</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
        Catatan kehadiran dan foto selfie presensi bulanan Anda
      </p>

      {/* Filter Month & Year */}
      <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
        <select
          className="form-select"
          value={bulan}
          onChange={(e) => setBulan(Number(e.target.value))}
        >
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Records List (Responsive Multi-column Grid) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          Memuat riwayat kehadiran...
        </div>
      ) : records.length === 0 ? (
        <div
          className="glass-panel"
          style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '20px' }}
        >
          <Calendar size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>Tidak ada data presensi pada bulan ini.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {records.map((r) => (
            <div
              key={r._id}
              onClick={() => setSelectedRecord(r)}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor:
                      r.status_waktu === 'Terlambat'
                        ? 'var(--color-danger-bg)'
                        : 'var(--color-success-bg)',
                    color:
                      r.status_waktu === 'Terlambat'
                        ? 'var(--color-danger)'
                        : 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {r.status_waktu === 'Terlambat' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                </div>

                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    {formatDate(r.tgl_presensi)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>In: {r.jam_in || '-'}</span>
                    &bull;
                    <span>Out: {r.jam_out || '-'}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  className={`badge ${
                    r.status_waktu === 'Terlambat' ? 'badge-danger' : 'badge-success'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {r.status_waktu}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', marginTop: '4px', fontWeight: '600' }}>
                  Lihat Foto &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                Detail Presensi: {formatDate(selectedRecord.tgl_presensi)}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {/* Selfie Photos Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Foto Masuk ({selectedRecord.jam_in})</label>
                  <div
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                    }}
                  >
                    {selectedRecord.foto_in ? (
                      <img
                        src={`/uploads/absensi/${selectedRecord.foto_in}`}
                        alt="Foto Masuk"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                        Tidak Ada Foto
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Foto Pulang ({selectedRecord.jam_out || '-'})</label>
                  <div
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                    }}
                  >
                    {selectedRecord.foto_out ? (
                      <img
                        src={`/uploads/absensi/${selectedRecord.foto_out}`}
                        alt="Foto Pulang"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.8rem' }}>
                        Belum Pulang
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kegiatan */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Catatan Kegiatan Masuk:
                </span>
                <p style={{ fontSize: '0.85rem', margin: '2px 0 8px' }}>
                  {selectedRecord.kegiatan_in || 'Tidak ada catatan'}
                </p>

                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Catatan Kegiatan Pulang:
                </span>
                <p style={{ fontSize: '0.85rem', margin: '2px 0 0' }}>
                  {selectedRecord.kegiatan_out || 'Tidak ada catatan'}
                </p>
              </div>

              {/* Jarak */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                📍 Jarak saat masuk: <strong>{selectedRecord.jarak_in || 0} meter</strong> dari kantor BPS
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="btn btn-outline btn-block"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
