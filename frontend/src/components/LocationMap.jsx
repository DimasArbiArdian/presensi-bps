import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet marker icon
const officeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const LocationMap = ({
  userCoords,
  officeCoords,
  radius = 200,
  distance = 0,
  height = '240px',
}) => {
  const officePos = officeCoords || [-6.910091184058985, 106.93593094557392];
  const userPos = userCoords || officePos;
  const isWithinRadius = distance <= radius;

  return (
    <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
      <MapContainer
        center={userPos}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Lingkaran Radius Kantor */}
        <Circle
          center={officePos}
          radius={radius}
          pathOptions={{
            color: '#1e3a8a',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            weight: 2,
          }}
        />

        {/* Marker Kantor */}
        <Marker position={officePos} icon={officeIcon}>
          <Popup>
            <strong>🏢 Kantor BPS Kota Sukabumi</strong>
            <br />
            Radius izin: {radius} meter
          </Popup>
        </Marker>

        {/* Marker Posisi Pengguna */}
        {userCoords && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <strong>📍 Posisi Anda</strong>
              <br />
              Jarak ke kantor: {distance} meter
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Info Jarak Floating Tag */}
      {distance !== undefined && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 1000,
            background: isWithinRadius ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Navigation size={14} />
          {isWithinRadius
            ? `Dalam Radius (${distance}m / maks ${radius}m)`
            : `Di Luar Radius (${distance}m / maks ${radius}m)`}
        </div>
      )}
    </div>
  );
};
