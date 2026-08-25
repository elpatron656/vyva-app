import React from 'react';
import { Globe, X, Check, Timer, CreditCard, Lock, Sparkles } from 'lucide-react';

export default function TravelModal({
  activePasses,
  selectedCountry,
  homeCountry,
  onSelectFreeCountry,
  onOpenPassPayment,
  onClose
}) {
  const COUNTRIES = [
    { code: 'FR', name: 'France', flag: '🇫🇷', isHome: true },
    { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
    { code: 'IT', name: 'Italie', flag: '🇮🇹' },
    { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
    { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
    { code: 'JP', name: 'Japon', flag: '🇯🇵' },
    { code: 'BR', name: 'Brésil', flag: '🇧🇷' }
  ];

  const formatPassTime = (expiresAt) => {
    if (!expiresAt) return null;
    const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    if (remainingSeconds <= 0) return null;
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(9, 9, 11, 0.95)',
      backdropFilter: 'blur(18px)',
      zIndex: 120,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      overflowY: 'auto'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe color="#FF7EB3" size={24} />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>VYVA TRAVEL (PASS 30 MIN)</h3>
            <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)' }}>0,99 € pour 30 minutes de rencontres internationales</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      {/* Info Card */}
      <div className="vyva-card" style={{
        marginBottom: '20px',
        padding: '14px 16px',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(255, 79, 129, 0.15) 100%)',
        borderColor: 'rgba(255, 79, 129, 0.3)'
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="#FF4F81" /> Rencontrez des célibataires à l'étranger !
        </div>
        <p style={{ fontSize: '11px', color: 'var(--vyva-text-muted)', lineHeight: '1.4' }}>
          Par défaut, vous êtes connecté en France 🇫🇷. Pour partir à l'étranger pendant 30 minutes (ex. Espagne 🇪🇸), débloquez un pass à 0,99 €. Une fois les 30 minutes terminées, vous revenez automatiquement en France.
        </p>
      </div>

      {/* Country List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
        {COUNTRIES.map((c) => {
          const isSelected = selectedCountry?.code === c.code;
          const activePass = activePasses[c.code];
          const timeString = activePass ? formatPassTime(activePass.expiresAt) : null;
          const hasActivePass = !!timeString;

          return (
            <div
              key={c.code}
              className="vyva-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '16px',
                borderColor: isSelected
                  ? 'var(--vyva-secondary)'
                  : hasActivePass
                  ? '#10B981'
                  : 'rgba(255,255,255,0.08)',
                background: isSelected
                  ? 'rgba(255, 79, 129, 0.15)'
                  : hasActivePass
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'var(--vyva-card)',
                color: '#fff',
                borderRadius: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{c.flag}</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)' }}>
                    {c.isHome ? 'Gratuit (Votre pays)' : hasActivePass ? `Pass Actif (${timeString})` : 'Pass 30 Min requis'}
                  </div>
                </div>
              </div>

              <div>
                {c.isHome ? (
                  <button
                    onClick={() => {
                      onSelectFreeCountry(c);
                      onClose();
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: isSelected ? 'var(--vyva-gradient-primary)' : 'transparent',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? 'Sélectionné ✓' : 'Sélectionner'}
                  </button>
                ) : hasActivePass ? (
                  <button
                    onClick={() => {
                      onSelectFreeCountry(c);
                      onClose();
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '16px',
                      border: 'none',
                      background: '#10B981',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Timer size={14} /> {timeString}
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenPassPayment(c)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'var(--vyva-gradient-primary)',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: 'var(--vyva-shadow-glow)'
                    }}
                  >
                    <CreditCard size={14} /> 0,99 € (30 min)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
