import React, { useState, useEffect, useRef } from 'react';
import { Camera, ShieldAlert, RefreshCw, SwitchCamera } from 'lucide-react';
import {
  initializeLocalMedia,
  switchCamera,
  stopLocalMedia,
  getDeviceInfo
} from '../services/mediaDeviceService';

export default function UserCameraView({
  style = {},
  showLabel = true,
  labelOverride = null,
  onClick = null,
  allowFlip = false,
  onStreamInit = null
}) {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [displayLabel, setDisplayLabel] = useState('Caméra active');
  const [errorState, setErrorState] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const videoRef = useRef(null);
  const info = getDeviceInfo();

  const startCamera = async (targetFacing = facingMode) => {
    setErrorState(null);
    try {
      const media = await initializeLocalMedia({
        facingMode: targetFacing,
        video: true,
        audio: true
      });

      setStream(media.stream);
      setFacingMode(media.facingMode);
      setDisplayLabel(targetFacing === 'user' ? 'Caméra avant' : 'Caméra arrière');

      if (videoRef.current) {
        videoRef.current.srcObject = media.stream;
        videoRef.current.play().catch(() => {});
      }

      if (onStreamInit) {
        onStreamInit(media.stream);
      }
    } catch (err) {
      console.warn("Camera init warning:", err);
      if (err.name === 'SecurityError') {
        setErrorState("Connexion HTTPS sécurisée requise");
      } else if (err.name === 'NotAllowedError') {
        setErrorState("Autorisez la caméra dans les réglages");
      } else {
        setErrorState("Caméra inaccessible");
      }
    }
  };

  useEffect(() => {
    startCamera('user');

    return () => {
      if (stream) {
        stopLocalMedia(stream);
      }
    };
  }, []);

  const handleFlipCamera = async (e) => {
    if (e) e.stopPropagation();
    if (!stream || isFlipping) return;

    setIsFlipping(true);
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';

    try {
      const res = await switchCamera({
        currentStream: stream,
        targetFacingMode: nextFacing
      });

      setFacingMode(res.facingMode);
      setDisplayLabel(res.facingMode === 'user' ? 'Caméra avant' : 'Caméra arrière');

      if (videoRef.current) {
        videoRef.current.srcObject = res.stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn("Error flipping camera:", err);
    } finally {
      setIsFlipping(false);
    }
  };

  const isMirror = facingMode === 'user';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#18181B',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {/* Active Camera Video Feed */}
      {stream && !errorState && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isMirror ? 'scaleX(-1)' : 'none',
            transition: 'transform 0.3s ease'
          }}
        />
      )}

      {/* Error / Permission State Banner */}
      {errorState && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(24, 24, 27, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          textAlign: 'center',
          color: '#fff',
          zIndex: 15
        }}>
          <ShieldAlert size={28} color="#FF4F81" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '8px', color: '#FFA6C1' }}>
            {errorState}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              startCamera();
            }}
            style={{
              background: 'var(--vyva-gradient-primary)',
              border: 'none',
              borderRadius: '16px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} /> Réessayer
          </button>
        </div>
      )}

      {/* Camera Flip Button for Mobile */}
      {allowFlip && info.isMobile && stream && !errorState && (
        <button
          onClick={handleFlipCamera}
          disabled={isFlipping}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            zIndex: 12
          }}
          title="Changer caméra avant / arrière"
        >
          <SwitchCamera size={16} />
        </button>
      )}

      {/* Bottom Display Label */}
      {showLabel && !errorState && (
        <div style={{
          position: 'absolute',
          bottom: '6px',
          left: '6px',
          right: '6px',
          background: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '3px 6px',
          fontSize: '9px',
          textAlign: 'center',
          color: '#fff',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 10
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 6px #10B981'
          }}></span>
          <span>{labelOverride || displayLabel}</span>
        </div>
      )}
    </div>
  );
}
