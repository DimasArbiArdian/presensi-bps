import React from 'react';

/**
 * Official Badan Pusat Statistik (BPS) Kota Sukabumi Logo Component
 * Uses authentic official high-resolution assets from BPS:
 * - /img/logoaja.png: Official emblem (blue, green, orange ribbon inside orbit)
 * - /img/logobps.png: Complete official emblem with "BADAN PUSAT STATISTIK KOTA SUKABUMI" text
 * - /img/logo-bps.webp: Optimized webp version
 */
export const BpsLogo = ({
  size = 42,
  showText = true,
  layout = 'horizontal',
  textColor = 'inherit',
  variant = 'emblem', // 'emblem' | 'full'
  className = '',
  style = {},
}) => {
  // If variant is 'full', render the official complete lockup with typography directly
  if (variant === 'full') {
    return (
      <img
        src="/img/logobps.png"
        alt="Badan Pusat Statistik Kota Sukabumi"
        style={{
          width: 'auto',
          height: `${size}px`,
          maxWidth: '100%',
          objectFit: 'contain',
          flexShrink: 0,
          ...style,
        }}
        className={className}
      />
    );
  }

  const emblem = (
    <img
      src="/img/logoaja.png"
      alt="Lambang Resmi BPS"
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        flexShrink: 0,
        ...style,
      }}
      className={className}
    />
  );

  if (!showText) return emblem;

  if (layout === 'vertical') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
        {emblem}
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.5px', color: textColor, lineHeight: 1.2 }}>
            BADAN PUSAT STATISTIK
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-secondary, #f37021)', letterSpacing: '1px' }}>
            KOTA SUKABUMI
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {emblem}
      <div>
        <div style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.5px', color: textColor, lineHeight: 1.15 }}>
          BADAN PUSAT STATISTIK
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-secondary, #f37021)', letterSpacing: '1px' }}>
          KOTA SUKABUMI
        </div>
      </div>
    </div>
  );
};

