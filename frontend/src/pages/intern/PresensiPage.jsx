import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { CameraCapture } from '../../components/CameraCapture';
import { LocationMap } from '../../components/LocationMap';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Send,
  Loader2,
} from 'lucide-react';

export const PresensiPage = () => {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [userCoords, setUserCoords] = useState(null); // [lat, lng]
  const [distance, setDistance] = useState(0);
  const [kegiatan, setKegiatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // 1. Fetch Today Status & Office Config
  const fetchStatus = async () => {
    try {
      const res = await API.get('/attendance/today-status');
      if (res.data.success) {
        setStatusData(res.data);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // 2. Fetch User Geolocation
  const getLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Perangkat Anda tidak mendukung fitur Geolocation/GPS!');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);

        // Hitung jarak ke kantor
        if (statusData?.officeConfig?.lokasi_kantor) {
          const [offLat, offLng] = statusData.officeConfig.lokasi_kantor
            .split(',')
            .map((s) => parseFloat(s.trim()));
          const dist = calculateDistanceLocal(offLat, offLng, lat, lng);
          setDistance(dist);
        }
      },
      (err) => {
        setGeoError(
          'Gagal mendapatkan lokasi GPS. Pastikan izin lokasi (GPS) diaktifkan di browser/HP Anda!'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (statusData) {
      getLocation();
    }
  }, [statusData]);

  const calculateDistanceLocal = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => (deg * Math.PI) / 180;
    const rad2deg = (rad) => (rad * 180) / Math.PI;

    const theta = lon1 - lon2;
    let dist =
      Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
    dist = Math.min(1, Math.max(-1, dist));
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    const miles = dist * 60 * 1.1515;
    return Math.round(miles * 1.609344 * 1000);
  };

  const handleCapture = (imageSrc) => {
    setCapturedImage(imageSrc);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSubmitAttendance = async () => {
    if (!capturedImage) {
      setSubmitError('Silakan ambil foto selfie absensi terlebih dahulu!');
      return;
    }

    if (!userCoords) {
      setSubmitError('Koordinat GPS belum terdeteksi. Silakan segarkan izin lokasi!');
      return;
    }

    setLoading(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        lokasi: `${userCoords[0]},${userCoords[1]}`,
        image: capturedImage,
        kegiatan: kegiatan || 'Tidak ada kegiatan',
      };

      const res = await API.post('/attendance/store', payload);
      if (res.data.success) {
        setSubmitSuccess(res.data.message);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan presensi!';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  const todayAtt = statusData?.attendance;
  const isClockIn = !todayAtt?.jam_in;
  const isClockOut = todayAtt?.jam_in && !todayAtt?.jam_out;
  const isDone = todayAtt?.jam_in && todayAtt?.jam_out;

  const officeCoords = statusData?.officeConfig?.lokasi_kantor
    ? statusData.officeConfig.lokasi_kantor.split(',').map((s) => parseFloat(s.trim()))
    : [-6.910091184058985, 106.93593094557392];

  const allowedRadius = statusData?.officeConfig?.radius || 200;

  return (
    <div style={{ padding: '1.25rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline btn-sm"
          style={{ padding: '6px', borderRadius: '50%' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.15rem', margin: 0 }}>
            {isClockIn ? 'Presensi Masuk' : isClockOut ? 'Presensi Pulang' : 'Presensi Selesai'}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Badan Pusat Statistik Kota Sukabumi
          </span>
        </div>
      </div>

      {isDone ? (
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            borderRadius: '24px',
            marginTop: '2rem',
          }}
        >
          <CheckCircle2 size={54} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Presensi Hari Ini Lengkap!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Anda sudah mencatat kehadiran Masuk ({todayAtt.jam_in}) dan Pulang ({todayAtt.jam_out}).
            Terima kasih atas kerja keras Anda hari ini!
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Kembali ke Beranda
          </button>
        </div>
      ) : (
        <>
          {/* Notifications */}
          {submitError && (
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
                marginBottom: '1rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div
              style={{
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>{submitSuccess}</span>
            </div>
          )}

          {geoError && (
            <div
              style={{
                backgroundColor: 'var(--color-warning-bg)',
                color: 'var(--color-warning)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {geoError}
            </div>
          )}

          {/* Responsive Layout: 2-column on desktop, stacked on mobile */}
          <div className="desktop-grid-2">
            {/* 1. Camera Section */}
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={16} color="var(--color-primary-light)" />
                Kamera Selfie Presensi
              </label>
              <CameraCapture
                onCapture={handleCapture}
                capturedImage={capturedImage}
                onRetake={handleRetake}
              />
            </div>

            {/* 2. Geofence Map & Submission Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="var(--color-primary-light)" />
                  Verifikasi Geofencing Lokasi Kantor
                </label>
                <LocationMap
                  userCoords={userCoords}
                  officeCoords={officeCoords}
                  radius={allowedRadius}
                  distance={distance}
                  height="220px"
                />
              </div>

              {/* 3. Kegiatan / Keterangan Form */}
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Kegiatan Kerja Hari Ini</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Contoh: Mengolah data sensus ekonomi, input kuesioner..."
                    value={kegiatan}
                    onChange={(e) => setKegiatan(e.target.value)}
                  />
                </div>

                {/* 4. Action Button */}
                <button
                  type="button"
                  onClick={handleSubmitAttendance}
                  disabled={loading || !capturedImage || !userCoords}
                  className={`btn ${isClockIn ? 'btn-primary' : 'btn-secondary'} btn-block`}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memproses Presensi...
                    </>
                  ) : isClockIn ? (
                    <>
                      <Send size={18} />
                      Kirim Presensi Masuk
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Kirim Presensi Pulang
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
