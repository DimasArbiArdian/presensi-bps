import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  HeartPulse,
  Camera,
  ChevronRight,
  Trophy,
  MapPin,
  Building2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { BpsLogo } from '../../components/BpsLogo';

export const DashboardIntern = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Digital clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/attendance/dashboard-intern');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const todayAtt = data?.todayAttendance;
  const hasClockedIn = !!todayAtt?.jam_in;
  const hasClockedOut = !!todayAtt?.jam_out;

  return (
    <div>
      {/* Mobile-Only Institution Brand Bar */}
      <div
        className="mobile-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          padding: '0.25rem 0.5rem',
        }}
      >
        <BpsLogo size={32} showText={true} />
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: 'var(--color-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Mencatat Indonesia
        </span>
      </div>

      {/* Top Welcome / Profile Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          borderLeft: '5px solid var(--color-primary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 75, 135, 0.1)',
              border: '2px solid var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
              flexShrink: 0,
            }}
          >
            {user?.foto ? (
              <img
                src={`/uploads/magang/${user.foto}`}
                alt={user.nama_lengkap}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user?.nama_lengkap?.charAt(0) || 'P'
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: '800' }}>
                Selamat Datang, {user?.nama_lengkap}!
              </h3>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                {user?.status || 'Magang'}
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user?.sekolah} &bull; {user?.jurusan} (NIM: {user?.no_id})
            </span>
          </div>
        </div>

        <div className="desktop-only" style={{ textAlign: 'right' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--color-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Mencatat Indonesia
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            BPS Kota Sukabumi
          </div>
        </div>
      </div>

      {/* Responsive Split Grid: Left Column (Clock & Stats), Right Column (Leaderboard & Info) */}
      <div className="desktop-grid-split">
        {/* LEFT COLUMN */}
        <div>
          {/* Real-time Clock Card with BPS Gradient */}
          <div
            style={{
              background: 'linear-gradient(135deg, #004b87 0%, #0284c7 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              padding: '1.75rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.9, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <Calendar size={16} color="#f37021" />
              <span>{formatDate(currentTime)}</span>
            </div>

            <div style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '2px', fontFamily: 'monospace', lineHeight: 1.1 }}>
              {formatTime(currentTime)}
            </div>

            <p style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '0.5rem' }}>
              Batas Waktu Masuk: <strong>08:00 WIB</strong> &bull; Kepulangan: <strong>16:00 WIB</strong>
            </p>

            {/* Action button to clock in/out */}
            <div style={{ marginTop: '1.5rem' }}>
              {!hasClockedIn ? (
                <Link
                  to="/presensi"
                  className="btn btn-secondary"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.85rem 2.25rem',
                    fontSize: '1rem',
                  }}
                >
                  <Camera size={20} /> Presensi Masuk Sekarang
                </Link>
              ) : !hasClockedOut ? (
                <Link
                  to="/presensi"
                  className="btn btn-secondary"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.85rem 2.25rem',
                    fontSize: '1rem',
                  }}
                >
                  <Camera size={20} /> Presensi Pulang Sekarang
                </Link>
              ) : (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  <CheckCircle size={18} color="#10b981" /> Presensi Hari Ini Lengkap
                </div>
              )}
            </div>
          </div>

          {/* Status Presensi Hari Ini (Masuk & Pulang) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div
              className="glass-panel"
              style={{ padding: '1.25rem', borderRadius: '18px', borderLeft: '4px solid var(--color-success)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
                <Clock size={15} /> Masuk
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                {todayAtt?.jam_in || '-- : --'}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: todayAtt?.status_waktu === 'Terlambat' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {todayAtt?.status_waktu || 'Belum Presensi'}
              </span>
            </div>

            <div
              className="glass-panel"
              style={{ padding: '1.25rem', borderRadius: '18px', borderLeft: '4px solid var(--color-secondary)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>
                <Clock size={15} /> Pulang
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                {todayAtt?.jam_out || '-- : --'}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {todayAtt?.jam_out ? 'Tercatat Selesai' : 'Belum Presensi'}
              </span>
            </div>
          </div>

          {/* Ringkasan Bulanan */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Statistik Kehadiran Bulan Ini
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              <div
                className="glass-panel"
                style={{ padding: '1rem 0.5rem', textAlign: 'center', borderRadius: '16px' }}
              >
                <div style={{ color: 'var(--color-success)', marginBottom: '4px' }}>
                  <CheckCircle size={22} style={{ margin: '0 auto' }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data?.stats?.jmlHadir || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Hadir</div>
              </div>

              <div
                className="glass-panel"
                style={{ padding: '1rem 0.5rem', textAlign: 'center', borderRadius: '16px' }}
              >
                <div style={{ color: 'var(--color-danger)', marginBottom: '4px' }}>
                  <AlertTriangle size={22} style={{ margin: '0 auto' }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data?.stats?.jmlTerlambat || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Terlambat</div>
              </div>

              <div
                className="glass-panel"
                style={{ padding: '1rem 0.5rem', textAlign: 'center', borderRadius: '16px' }}
              >
                <div style={{ color: 'var(--color-info)', marginBottom: '4px' }}>
                  <FileText size={22} style={{ margin: '0 auto' }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data?.stats?.jmlIzin || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Izin</div>
              </div>

              <div
                className="glass-panel"
                style={{ padding: '1rem 0.5rem', textAlign: 'center', borderRadius: '16px' }}
              >
                <div style={{ color: 'var(--color-warning)', marginBottom: '4px' }}>
                  <HeartPulse size={22} style={{ margin: '0 auto' }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data?.stats?.jmlSakit || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sakit</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Leaderboard Presensi Hari Ini */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={18} color="#f37021" /> Papan Kehadiran Hari Ini
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {data?.leaderboard?.length || 0} peserta presensi
              </span>
            </div>

            <div className="glass-panel" style={{ borderRadius: '18px', overflow: 'hidden' }}>
              {data?.leaderboard && data.leaderboard.length > 0 ? (
                data.leaderboard.map((item, index) => (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.15rem',
                      borderBottom:
                        index !== data.leaderboard.length - 1 ? '1px solid var(--border-color)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background:
                            index === 0
                              ? '#f37021'
                              : index === 1
                              ? '#64748b'
                              : index === 2
                              ? '#b45309'
                              : 'var(--border-color)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                          {item.intern?.nama_lengkap || item.no_id}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.intern?.sekolah || 'Magang BPS'}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--color-primary-light)' }}>
                        {item.jam_in}
                      </div>
                      <span
                        className={`badge ${
                          item.status_waktu === 'Terlambat' ? 'badge-danger' : 'badge-success'
                        }`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {item.status_waktu}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Belum ada peserta yang presensi hari ini.
                </div>
              )}
            </div>
          </div>

          {/* Guidelines / Office Info Card */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: '18px',
              borderTop: '4px solid var(--color-secondary)',
            }}
          >
            <h5 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} color="var(--color-secondary)" /> Ketentuan & Panduan Presensi
            </h5>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: '1.7', margin: 0 }}>
              <li>
                <strong>Lokasi Kantor</strong>: BPS Kota Sukabumi, Jl. Selabintana No. 12.
              </li>
              <li>
                <strong>Radius Presensi</strong>: Maksimal 200 meter dari titik koordinat kantor.
              </li>
              <li>
                <strong>Wajib Kamera & GPS</strong>: Izinkan akses webcam & geolokasi di browser.
              </li>
              <li>
                <strong>Izin / Sakit</strong>: Wajib diajukan sebelum jam kerja dimulai melalui menu Pengajuan Izin.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
