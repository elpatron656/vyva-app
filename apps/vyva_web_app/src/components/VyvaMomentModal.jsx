import React from 'react';

export default function VyvaMomentModal({ partnerName, onCompleted }) {
  const RATINGS = [
    { emoji: '😐', label: 'Neutre', key: 'NEUTRAL' },
    { emoji: '🙂', label: 'Sympa', key: 'NICE' },
    { emoji: '😍', label: 'Super', key: 'GREAT' },
    { emoji: '🔥', label: 'Incroyable', key: 'FIRE' }
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(9, 9, 11, 0.92)',
      backdropFilter: 'blur(20px)',
      zIndex: 60,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff'
    }}>
      <h3 style={{
        fontSize: '13px',
        fontWeight: '700',
        color: 'var(--vyva-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '10px'
      }}>
        VYVA MOMENT
      </h3>

      <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px' }}>
        Comment était cette rencontre avec {partnerName} ?
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '300px' }}>
        {RATINGS.map((r) => (
          <button
            key={r.key}
            onClick={() => onCompleted(r.key)}
            style={{
              padding: '20px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'var(--vyva-card)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '36px' }}>{r.emoji}</span>
            <span style={{ fontSize: '13px', fontWeight: '700' }}>{r.label}</span>
          </button>
        ))}
      </div>

      <p style={{ marginTop: '24px', fontSize: '11px', color: 'var(--vyva-text-muted)', maxWidth: '260px' }}>
        Données utilisées anonymement par VYVA MATCH AI pour affiner tes suggestions futures.
      </p>
    </div>
  );
}
