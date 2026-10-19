import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HeartPulse,
  CalendarCheck,
  MapPin,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';

export const DashboardAdmin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/attendance/dashboard-admin');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data?.stats;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Dashboard Administrator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Monitoring kehadiran dan aktivitas peserta magang BPS Kota Sukabumi hari ini ({data?.today || 'Hari Ini'})
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Card 1: Hadir */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Hadir Hari Ini</span>
            <div style={{ color: 'var(--color-success)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats?.jmlHadir || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peserta tercatat masuk</span>
        </div>

        {/* Card 2: Terlambat */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Terlambat</span>
            <div style={{ color: 'var(--color-danger)' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats?.jmlTerlambat || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Masuk setelah 08:00 WIB</span>
        </div>

        {/* Card 3: Izin & Sakit */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Izin / Sakit</span>
            <div style={{ color: 'var(--color-warning)' }}>
              <FileText size={24} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>
            {(stats?.jmlIzin || 0) + (stats?.jmlSakit || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Izin: {stats?.jmlIzin || 0} &bull; Sakit: {stats?.jmlSakit || 0}
          </span>
        </div>

        {/* Card 4: Total Peserta */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', borderLeft: '4px solid var(--color-primary-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Total Peserta</span>
            <div style={{ color: 'var(--color-primary-light)' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats?.totalInterns || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peserta Magang & PKL Aktif</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Pintasan Menu Pengelolaan</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <Link
          to="/admin/monitoring"
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', margin: '0 0 4px' }}>Monitoring Presensi</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Pantau kehadiran harian & koordinat peta
              </p>
            </div>
          </div>
          <ArrowRight size={20} color="var(--text-muted)" />
        </Link>

        <Link
          to="/admin/izin"
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', margin: '0 0 4px' }}>Persetujuan Izin</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Verifikasi atau tolak permohonan izin
              </p>
            </div>
          </div>
          <ArrowRight size={20} color="var(--text-muted)" />
        </Link>

        <Link
          to="/admin/lokasi"
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', margin: '0 0 4px' }}>Konfigurasi Lokasi</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Atur titik koordinat kantor & radius meter
              </p>
            </div>
          </div>
          <ArrowRight size={20} color="var(--text-muted)" />
        </Link>

        <Link
          to="/admin/laporan"
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', margin: '0 0 4px' }}>Laporan & Rekapitulasi</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Cetak laporan A4 & Export ke Excel
              </p>
            </div>
          </div>
          <ArrowRight size={20} color="var(--text-muted)" />
        </Link>
      </div>
    </div>
  );
};
