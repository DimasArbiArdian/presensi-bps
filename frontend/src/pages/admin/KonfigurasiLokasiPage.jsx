import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import API from '../../services/api';
import {
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Building2,
  Navigation,
} from 'lucide-react';

const officeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component helper untuk click on map
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export const KonfigurasiLokasiPage = () => {
  const [namaKantor, setNamaKantor] = useState('BPS Kota Sukabumi');
  const [coords, setCoords] = useState([-6.910091184058985, 106.93593094557392]);
  const [radius, setRadius] = useState(200);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const markerRef = useRef(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await API.get('/office');
      if (res.data.success && res.data.office) {
        const off = res.data.office;
        setNamaKantor(off.nama_kantor);
        setRadius(off.radius);
        const parts = off.lokasi_kantor.split(',').map((s) => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          setCoords(parts);
        }
      }
    } catch (err) {
      console.error('Error fetching office config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setCoords([newPos.lat, newPos.lng]);
        }
      },
    }),
    []
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        nama_kantor: namaKantor,
        lokasi_kantor: `${coords[0]},${coords[1]}`,
        radius: Number(radius),
      };

      const res = await API.put('/office', payload);
      if (res.data.success) {
        setMessage('Konfigurasi lokasi dan radius kantor berhasil disimpan!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan konfigurasi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Konfigurasi Lokasi & Geofence</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Geser marker merah pada peta atau sesuaikan slider radius untuk menentukan batas toleransi presensi
        </p>
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Map */}
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '20px' }}>
          <div style={{ borderRadius: '14px', overflow: 'hidden', height: '440px', position: 'relative' }}>
            <MapContainer
              center={coords}
              zoom={16}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              key={`${coords[0]}-${coords[1]}`}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Circle
                center={coords}
                radius={radius}
                pathOptions={{
                  color: '#1e3a8a',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              />

              <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={coords}
                ref={markerRef}
                icon={officeIcon}
              >
                <Popup>
                  <strong>🏢 {namaKantor}</strong>
                  <br />
                  Radius: {radius} meter
                  <br />
                  <small>Geser pin ini untuk memindahkan lokasi</small>
                </Popup>
              </Marker>

              <MapClickHandler onLocationSelect={(newCoords) => setCoords(newCoords)} />
            </MapContainer>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.5rem 0 0', textAlign: 'center' }}>
            💡 Tips: Anda dapat mengklik sembarang titik di peta atau menarik (drag) marker merah untuk memindahkan koordinat kantor.
          </p>
        </div>

        {/* Right: Controls & Info */}
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={18} color="var(--color-primary-light)" /> Parameter Geofence
          </h3>

          <div className="form-group">
            <label className="form-label">Nama Instansi / Kantor</label>
            <input
              type="text"
              className="form-input"
              value={namaKantor}
              onChange={(e) => setNamaKantor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Titik Koordinat (Latitude, Longitude)</label>
            <input
              type="text"
              className="form-input"
              value={`${coords[0]}, ${coords[1]}`}
              onChange={(e) => {
                const parts = e.target.value.split(',').map((s) => parseFloat(s.trim()));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                  setCoords(parts);
                }
              }}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Radius Geofence (Meter)</label>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary-light)' }}>
                {radius} meter
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={2000}
              step={10}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary-light)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>20m</span>
              <span>500m</span>
              <span>1000m</span>
              <span>2000m</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-block"
            style={{ marginTop: '1.5rem' }}
          >
            <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
          </button>
        </form>
      </div>
    </div>
  );
};
