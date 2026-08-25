import React, { useState, useEffect } from 'react';
import { Mic, MicOff, SkipForward, Heart, Gamepad2, Flag, Sparkles, MapPin } from 'lucide-react';
import UserCameraView from './UserCameraView';
import VyvaGamesModal from './VyvaGamesModal';
import VyvaMomentModal from './VyvaMomentModal';

export default function VideoCallScreen({ partner, mode, onNextMatch, onMatchSuccess, onOpenReport, onOpenCameraTest }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isMysteryActive, setIsMysteryActive] = useState(mode === 'MYSTERY');
  const [mysteryBlurLevel, setMysteryBlurLevel] = useState(25); // Blur in px
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showMomentModal, setShowMomentModal] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Fallback high quality video streams if videoUrl is not set on partner
  const DEFAULT_PARTNER_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-girl-looking-at-her-phone-and-smiling-40176-large.mp4";

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mystery match blur countdown
  useEffect(() => {
    if (isMysteryActive && mysteryBlurLevel > 0) {
      const interval = setInterval(() => {
        setMysteryBlurLevel((b) => Math.max(0, b - 2));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMysteryActive, mysteryBlurLevel]);

  const handleRevealMystery = () => {
    setMysteryBlurLevel(0);
    setIsMysteryActive(false);
  };

  const handleLike = () => {
    setUserLiked(true);
    onMatchSuccess(partner);
  };

  const handleEndCall = () => {
    setShowMomentModal(true);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', overflow: 'hidden' }}>
      
      {/* 1. Main Partner Live Video Feed (REAL MOVING VIDEO) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        filter: isMysteryActive ? `blur(${mysteryBlurLevel}px)` : 'none',
        transition: 'filter 0.5s ease'
      }}>
        <video
          src={partner.videoUrl || DEFAULT_PARTNER_VIDEO}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Soft overlay gradient for controls visibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)'
        }}></div>
      </div>

      {/* 2. Mystery Match Banner & Reveal Button */}
      {isMysteryActive && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '20px',
          right: '20px',
          padding: '12px 18px',
          borderRadius: '20px',
          background: 'rgba(139, 92, 246, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          color: '#fff',
          zIndex: 30
        }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> MYSTERY MATCH
            </div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>Identité floutée temporairement</div>
          </div>
          <button
            onClick={handleRevealMystery}
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '16px',
              padding: '8px 14px',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Révéler 👁️
          </button>
        </div>
      )}

      {/* 3. Top Info Bar (Partner Name, Age, Country, Compatibility Score, Report) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(24, 24, 27, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff'
          }}>
            <div style={{ fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{partner.name}, {partner.age}</span>
              <span style={{ fontSize: '11px', color: 'var(--vyva-accent)', fontWeight: '700' }}>
                {partner.compatibilityScore}%
              </span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--vyva-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={10} color="#FF7EB3" />
              <span>{partner.country} {partner.city ? `(${partner.city})` : ''}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenReport(partner)}
          style={{
            background: 'rgba(239, 68, 68, 0.25)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444',
            cursor: 'pointer'
          }}
          title="Signaler / Bloquer"
        >
          <Flag size={18} />
        </button>
      </div>

      {/* 4. Local User Self Video (Picture in Picture with UserCameraView Live Video) */}
      <div
        style={{
          position: 'absolute',
          top: '65px',
          right: '16px',
          width: '115px',
          height: '155px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '2px solid var(--vyva-secondary)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.7)',
          zIndex: 20
        }}
      >
        <UserCameraView
          showLabel={true}
          label="Ma Caméra"
          onClick={onOpenCameraTest}
        />
      </div>

      {/* 5. One-Hand Bottom Controls Bar */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        zIndex: 25
      }}>
        {/* Mute & Mini-games buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isMuted ? '#EF4444' : 'rgba(24, 24, 27, 0.85)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button
            onClick={() => setShowGamesModal(true)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Mini-Jeux VYVA Games"
          >
            <Gamepad2 size={20} />
          </button>
        </div>

        {/* Big Like Button */}
        <button
          onClick={handleLike}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: userLiked ? 'var(--vyva-secondary)' : 'rgba(255, 79, 129, 0.3)',
            border: '2px solid var(--vyva-secondary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--vyva-shadow-pink)',
            transform: userLiked ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={32} fill={userLiked ? '#fff' : 'transparent'} />
        </button>

        {/* Next Match (Skip) Button */}
        <button
          onClick={handleEndCall}
          className="btn-primary-gradient"
          style={{
            height: '48px',
            padding: '0 18px',
            borderRadius: '24px',
            fontSize: '14px'
          }}
        >
          <span>Suivant</span>
          <SkipForward size={18} />
        </button>
      </div>

      {/* Mini-Games Modal */}
      {showGamesModal && (
        <VyvaGamesModal onClose={() => setShowGamesModal(false)} />
      )}

      {/* VYVA Moment Rating Modal */}
      {showMomentModal && (
        <VyvaMomentModal
          partnerName={partner.name}
          onCompleted={(rating) => {
            setShowMomentModal(false);
            onNextMatch();
          }}
        />
      )}

    </div>
  );
}
