import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { LocationMap } from '../../components/LocationMap';
import {
  Calendar,
  RefreshCw,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
  User,
} from 'lucide-react';

export const MonitoringPage = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [tanggal, setTanggal] = useState(todayStr);
  const [attendances, setAttendances] = useState([]);
  const [officeConfig, setOfficeConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  // Selected item for Map / Detail modal
  const [selectedAtt, setSelectedAtt] = useState(null);

  const fetchMonitoring = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/attendance/monitoring?tanggal=${tanggal}`);
      if (res.data.success) {
        setAttendances(res.data.attendances);
        setOfficeConfig(res.data.officeConfig);
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, [tanggal]);

  const parseCoords = (coordStr) => {
    if (!coordStr) return null;
    const parts = coordStr.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts;
    }
    return null;
  };

  const officeCoords = officeConfig?.lokasi_kantor
    ? parseCoords(officeConfig.lokasi_kantor)
    : [-6.910091184058985, 106.93593094557392];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Monitoring Presensi Harian</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Pemantauan kehadiran peserta magang & verifikasi koordinat lokasi secara langsung
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              className="form-input"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              style={{ width: 'auto', paddingRight: '1rem' }}
            />
          </div>

          <button
            type="button"
            onClick={fetchMonitoring}
            disabled={loading}
            className="btn btn-outline"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Segarkan
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>No</th>
              <th>Peserta Magang</th>
              <th>Program</th>
              <th>Jam Masuk</th>
              <th>Jam Pulang</th>
              <th>Status Waktu</th>
              <th>Jarak / Radius</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Memuat data presensi...
                </td>
              </tr>
            ) : attendances.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Tidak ada peserta yang melakukan presensi pada tanggal {tanggal}.
                </td>
              </tr>
            ) : (
              attendances.map((att, idx) => (
                <tr key={att._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          fontWeight: '700',
                          color: 'var(--color-primary-light)',
                        }}
                      >
                        {att.intern?.foto ? (
                          <img
                            src={`/uploads/magang/${att.intern.foto}`}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          att.intern?.nama_lengkap?.charAt(0) || 'P'
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                          {att.intern?.nama_lengkap || att.no_id}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {att.intern?.sekolah} &bull; ID: {att.no_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{att.intern?.status || 'Magang'}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                      {att.jam_in || '-'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--color-secondary)' }}>
                      {att.jam_out || 'Belum Pulang'}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        att.status_waktu === 'Terlambat' ? 'badge-danger' : 'badge-success'
                      }`}
                    >
                      {att.status_waktu}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      📍 {att.jarak_in || 0}m
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedAtt(att)}
                      className="btn btn-primary btn-sm"
                    >
                      <MapPin size={14} /> Lihat Detail & Peta
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail & Peta Presensi */}
      {selectedAtt && (
        <div className="modal-overlay" onClick={() => setSelectedAtt(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                Verifikasi Presensi: {selectedAtt.intern?.nama_lengkap} ({selectedAtt.tgl_presensi})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAtt(null)}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {/* Selfie Photos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span className="form-label" style={{ fontSize: '0.8rem' }}>
                    Foto Masuk ({selectedAtt.jam_in})
                  </span>
                  <div
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                      marginTop: '4px',
                    }}
                  >
                    {selectedAtt.foto_in ? (
                      <img
                        src={`/uploads/absensi/${selectedAtt.foto_in}`}
                        alt="Foto Masuk"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                        Tidak Ada Foto
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Kegiatan: {selectedAtt.kegiatan_in || 'Tidak ada kegiatan'}
                  </p>
                </div>

                <div>
                  <span className="form-label" style={{ fontSize: '0.8rem' }}>
                    Foto Pulang ({selectedAtt.jam_out || 'Belum Pulang'})
                  </span>
                  <div
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                      marginTop: '4px',
                    }}
                  >
                    {selectedAtt.foto_out ? (
                      <img
                        src={`/uploads/absensi/${selectedAtt.foto_out}`}
                        alt="Foto Pulang"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.85rem' }}>
                        Belum Presensi Pulang
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Kegiatan: {selectedAtt.kegiatan_out || 'Tidak ada kegiatan'}
                  </p>
                </div>
              </div>

              {/* Interactive Map */}
              <div>
                <span className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
                  Lokasi Presensi di Peta
                </span>
                <LocationMap
                  userCoords={parseCoords(selectedAtt.lokasi_in)}
                  officeCoords={officeCoords}
                  radius={officeConfig?.radius || 200}
                  distance={selectedAtt.jarak_in || 0}
                  height="260px"
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Koordinat: {selectedAtt.lokasi_in || '-'} &bull; Jarak: {selectedAtt.jarak_in || 0}m ke kantor
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setSelectedAtt(null)}
                className="btn btn-outline"
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
