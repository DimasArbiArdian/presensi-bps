import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';

export const CameraCapture = ({ onCapture, capturedImage, onRetake }) => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front, 'environment' for back
  const [countdown, setCountdown] = useState(null);

  const videoConstraints = {
    width: 640,
    height: 640,
    facingMode: facingMode,
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTriggerCapture = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const imageSrc = webcamRef.current.getScreenshot();
          onCapture(imageSrc);
          return null;
        }
        return prev - 1;
      });
    }, 800);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '380px', margin: '0 auto' }}>
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#000',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          border: '3px solid var(--border-color)',
        }}
      >
        {!capturedImage ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              mirrored={facingMode === 'user'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Countdown Overlay */}
            {countdown && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  fontSize: '5rem',
                  fontWeight: '800',
                  animation: 'pulseSlow 0.8s infinite',
                }}
              >
                {countdown}
              </div>
            )}

            {/* Switch Camera Button */}
            <button
              type="button"
              onClick={toggleCamera}
              className="btn btn-sm"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: 0,
                backdropFilter: 'blur(4px)',
              }}
              title="Ganti Kamera"
            >
              <RefreshCw size={18} />
            </button>
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img
              src={capturedImage}
              alt="Hasil Selfie"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(16, 185, 129, 0.9)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={14} /> Foto Siap
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Below Camera */}
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
        {!capturedImage ? (
          <button
            type="button"
            onClick={handleTriggerCapture}
            disabled={countdown !== null}
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 2rem' }}
          >
            <Camera size={20} />
            {countdown ? 'Mengambil Foto...' : 'Ambil Selfie'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onRetake}
            className="btn btn-outline"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.5rem' }}
          >
            <RefreshCw size={16} /> Foto Ulang
          </button>
        )}
      </div>
    </div>
  );
};
