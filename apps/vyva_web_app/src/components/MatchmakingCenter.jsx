import React, { useState } from 'react';
import { Video, Globe, Sparkles, Coins, Crown, Camera, Timer } from 'lucide-react';
import UserCameraView from './UserCameraView';

export default function MatchmakingCenter({
  onStartSearch,
  user,
  selectedCountry,
  activePasses,
  onOpenStore,
  onOpenTravel,
  onOpenCameraTest,
  onOpenPassPayment
}) {
  const [selectedGender, setSelectedGender] = useState('EVERYONE'); // 'FEMALE', 'MALE', 'EVERYONE'
  const [selectedMode, setSelectedMode] = useState('STANDARD'); // 'STANDARD', 'MYSTERY'

  const handleGenderChange = (gender) => {
    if ((gender === 'FEMALE' || gender === 'MALE') && !user.isPremium) {
      alert("⭐ Le filtrage par genre nécessite un abonnement VYVA Plus ou VYVA Gold ! Redirection vers la boutique...");
      onOpenStore();
      return;
    }
    setSelectedGender(gender);
  };

  // Helper for pass timer
  const activePass = activePasses[selectedCountry?.code];
  const formatPassTime = (expiresAt) => {
    if (!expiresAt) return null;
    const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    if (remainingSeconds <= 0) return null;
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const passTimeString = activePass ? formatPassTime(activePass.expiresAt) : null;

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', overflowY: 'auto' }}>
      
      {/* Header bar with Coins & Camera Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '900', 
            background: 'var(--vyva-gradient-primary)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px' 
          }}>
            VYVA
          </h1>
          {user.isPremium && <span className="badge-premium">VYVA {user.premiumTier}</span>}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Camera Settings Button */}
          <button
            onClick={onOpenCameraTest}
            style={{
              background: '#18181B',
              border: '1px solid rgba(255, 126, 179, 0.4)',
              borderRadius: '20px',
              padding: '6px 12px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '12px'
            }}
            title="Réglages Caméra"
          >
            <Camera size={15} color="#FF7EB3" />
            <span>Caméra 🟢</span>
          </button>

          {/* Coins balance */}
          <button 
            onClick={onOpenStore}
            style={{
              background: '#18181B',
              border: '1px solid rgba(255, 79, 129, 0.4)',
              borderRadius: '20px',
              padding: '6px 12px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '12px'
            }}
          >
            <Coins size={15} color="#FF4F81" />
            <span>{user.coins} Coins</span>
          </button>
        </div>
      </div>

      {/* Main Mode Selector: Standard vs Mystery Match */}
      <div className="vyva-card" style={{ marginTop: '12px', padding: '6px', display: 'flex', gap: '6px' }}>
        <button
          onClick={() => setSelectedMode('STANDARD')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '16px',
            border: 'none',
            background: selectedMode === 'STANDARD' ? 'var(--vyva-gradient-primary)' : 'transparent',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🎥 Standard
        </button>
        <button
          onClick={() => setSelectedMode('MYSTERY')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '16px',
            border: 'none',
            background: selectedMode === 'MYSTERY' ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' : 'transparent',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} color="#FF7EB3" /> Mystery Match
        </button>
      </div>

      {/* Hero Visual Area: LIVE CAMERA PREVIEW inside Radar Circle */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '18px 0',
        position: 'relative'
      }}>
        <div className="radar-circle" style={{ width: '210px', height: '210px' }}></div>
        <div className="radar-circle" style={{ width: '210px', height: '210px' }}></div>

        {/* Live Camera Circle / Start Match Button */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid var(--vyva-secondary)',
          boxShadow: 'var(--vyva-shadow-pink)',
          zIndex: 5,
          background: '#18181B'
        }}>
          {/* Live Camera Stream */}
          <UserCameraView showLabel={false} />

          {/* Dark Overlay Start Button */}
          <button
            onClick={() => onStartSearch(selectedGender, selectedMode)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              backdropFilter: 'blur(1px)'
            }}
          >
            <Video size={34} color="#fff" />
            <span style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '0.5px' }}>COMMENCER</span>
          </button>
        </div>

        {/* Selected Location & Pass Timer Widget */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: '700' }}>
            <span>{selectedCountry?.flag || '🇫🇷'} {selectedCountry?.name || 'France'}</span>
            {passTimeString ? (
              <span style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '12px' }}>
                <Timer size={13} /> {passTimeString}
              </span>
            ) : selectedCountry?.code !== 'FR' ? (
              <span style={{ color: '#EF4444' }}>Pass Expiré</span>
            ) : (
              <span style={{ color: 'var(--vyva-text-muted)' }}>(Pays Natal - Gratuit)</span>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Filters: Gender & Country */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Gender Selection */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--vyva-text-muted)', textTransform: 'uppercase' }}>
              Qui veux-tu rencontrer ?
            </span>
            {!user.isPremium && (
              <span style={{ fontSize: '10px', color: '#FF4F81', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Crown size={11} /> Premium
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => handleGenderChange('FEMALE')}
              style={{
                padding: '10px 4px',
                borderRadius: '14px',
                border: '1px solid ' + (selectedGender === 'FEMALE' ? 'var(--vyva-secondary)' : 'rgba(255,255,255,0.08)'),
                background: selectedGender === 'FEMALE' ? 'rgba(255, 79, 129, 0.15)' : 'var(--vyva-card)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              👩 Femmes
            </button>
            <button
              onClick={() => handleGenderChange('MALE')}
              style={{
                padding: '10px 4px',
                borderRadius: '14px',
                border: '1px solid ' + (selectedGender === 'MALE' ? 'var(--vyva-primary)' : 'rgba(255,255,255,0.08)'),
                background: selectedGender === 'MALE' ? 'rgba(124, 58, 237, 0.15)' : 'var(--vyva-card)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              👨 Hommes
            </button>
            <button
              onClick={() => setSelectedGender('EVERYONE')}
              style={{
                padding: '10px 4px',
                borderRadius: '14px',
                border: '1px solid ' + (selectedGender === 'EVERYONE' ? '#fff' : 'rgba(255,255,255,0.08)'),
                background: selectedGender === 'EVERYONE' ? 'rgba(255, 255, 255, 0.15)' : 'var(--vyva-card)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🌎 Tous
            </button>
          </div>
        </div>

        {/* International Travel Pass Card (0,99€ / 30 min) */}
        <button
          className="vyva-card"
          onClick={onOpenTravel}
          style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            color: '#fff',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            borderColor: passTimeString ? '#10B981' : 'rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={20} color="#FF7EB3" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800' }}>
                Zone : {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : '🇫🇷 France'}
              </div>
              <div style={{ fontSize: '11px', color: passTimeString ? '#10B981' : 'var(--vyva-text-muted)' }}>
                {passTimeString ? `Pass 30 Min Actif (${passTimeString})` : 'Pass International : 0,99 € / 30 min'}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--vyva-secondary)', background: 'rgba(255, 79, 129, 0.15)', padding: '4px 10px', borderRadius: '12px' }}>
            {passTimeString ? 'Changer' : 'Voyager 0,99€'}
          </span>
        </button>

      </div>

    </div>
  );
}
