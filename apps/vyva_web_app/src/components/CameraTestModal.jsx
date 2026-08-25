import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, X, RefreshCw, CheckCircle2, SwitchCamera, Volume2, ShieldAlert, Play } from 'lucide-react';
import {
  initializeLocalMedia,
  switchCamera,
  stopLocalMedia,
  getAvailableCameras,
  getDeviceInfo
} from '../services/mediaDeviceService';

export default function CameraSettingsModal({ onClose }) {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [availableCameras, setAvailableCameras] = useState([]);
  
  // Camera state: 'IDLE', 'LOADING', 'ACTIVE', 'ERROR'
  const [cameraState, setCameraState] = useState('IDLE');
  const [humanErrorMessage, setHumanErrorMessage] = useState('');
  const [activeLabel, setActiveLabel] = useState('Caméra avant');
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Hidden Dev Mode Diagnostic trigger (3 clicks on title)
  const [clickCount, setClickCount] = useState(0);
  const [showDevMode, setShowDevMode] = useState(false);
  const [devLogs, setDevLogs] = useState([]);

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const animFrameRef = useRef(null);

  const info = getDeviceInfo();

  useEffect(() => {
    // Auto-load stream cleanly on user tap
    handleStartCameraTest('user', '');

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (stream) stopLocalMedia(stream);
    };
  }, []);

  const handleHeaderClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 3) {
      setShowDevMode(!showDevMode);
      setClickCount(0);
    }
  };

  const handleStartCameraTest = async (targetFacing = facingMode, deviceId = selectedDeviceId) => {
    try {
      setCameraState('LOADING');
      setHumanErrorMessage('');

      if (stream) {
        stopLocalMedia(stream);
      }

      const media = await initializeLocalMedia({
        facingMode: targetFacing,
        deviceId: deviceId || null,
        video: true,
        audio: true
      });

      setStream(media.stream);
      setFacingMode(media.facingMode);
      setSelectedDeviceId(media.deviceId || '');
      setActiveLabel(targetFacing === 'user' ? 'Caméra avant' : 'Caméra arrière');
      setCameraState('ACTIVE');

      if (videoRef.current) {
        videoRef.current.srcObject = media.stream;
        videoRef.current.play().catch(() => {});
      }

      setupAudioVisualizer(media.stream);
      const cameras = await getAvailableCameras();
      setAvailableCameras(cameras);

    } catch (err) {
      console.warn("Camera init warning:", err);
      setCameraState('ERROR');

      // Human-friendly error translation (Zero technical jargon)
      if (err.errorType === 'SecurityError' || err.name === 'SecurityError') {
        setHumanErrorMessage("Connexion sécurisée requise. Veuillez rouvrir l'application avec un lien sécurisé.");
      } else if (err.errorType === 'NotAllowedError' || err.name === 'NotAllowedError') {
        setHumanErrorMessage("VYVA n'a pas accès à votre caméra. Veuillez autoriser l'accès à la caméra dans les réglages de votre téléphone.");
      } else if (err.errorType === 'NotFoundError' || err.name === 'NotFoundError') {
        setHumanErrorMessage("Aucune caméra n'a été détectée sur cet appareil.");
      } else if (err.errorType === 'NotReadableError' || err.name === 'NotReadableError') {
        setHumanErrorMessage("La caméra est déjà utilisée par une autre application. Veuillez la fermer puis réessayer.");
      } else {
        setHumanErrorMessage("Autorisez l'accès à la caméra pour continuer.");
      }

      setDevLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${err.name || 'Error'}: ${err.message}`]);
    }
  };

  const setupAudioVisualizer = (mediaStream) => {
    try {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (!audioTrack) return;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (e) {}
  };

  const handleFlipCamera = async () => {
    if (isFlipping) return;
    setIsFlipping(true);

    const nextFacing = facingMode === 'user' ? 'environment' : 'user';

    try {
      const res = await switchCamera({
        currentStream: stream,
        targetFacingMode: nextFacing
      });

      setFacingMode(res.facingMode);
      setActiveLabel(res.facingMode === 'user' ? 'Caméra avant' : 'Caméra arrière');

      if (videoRef.current) {
        videoRef.current.srcObject = res.stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn("Camera flip warning:", err);
      handleStartCameraTest(nextFacing, '');
    } finally {
      setIsFlipping(false);
    }
  };

  const handleDeviceChange = (e) => {
    const devId = e.target.value;
    setSelectedDeviceId(devId);
    handleStartCameraTest(facingMode, devId);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const handleCloseModal = () => {
    if (stream) stopLocalMedia(stream);
    onClose();
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#09090B',
      zIndex: 150,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      overflowY: 'auto'
    }}>
      {/* Clean AAA Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div
          onClick={handleHeaderClick}
          style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--vyva-gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Camera size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.3px' }}>Aperçu Caméra 🎥</h3>
            <p style={{ fontSize: '11px', color: 'var(--vyva-text-muted)' }}>Vérifiez votre image avant de commencer</p>
          </div>
        </div>

        <button
          onClick={handleCloseModal}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Immersive Video Viewport */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        borderRadius: '28px',
        backgroundColor: '#18181B',
        border: cameraState === 'ACTIVE' ? '2px solid var(--vyva-secondary)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: cameraState === 'ACTIVE' ? '0 12px 30px rgba(255, 79, 129, 0.25)' : 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        {cameraState === 'ACTIVE' && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
              opacity: isVideoOff ? 0.2 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}

        {isVideoOff && cameraState === 'ACTIVE' && (
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--vyva-text-muted)' }}>
            <VideoOff size={40} color="#FF4F81" />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Caméra Désactivée</span>
          </div>
        )}

        {cameraState === 'LOADING' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <RefreshCw size={32} color="var(--vyva-accent)" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span style={{ fontSize: '13px', color: 'var(--vyva-text-muted)', fontWeight: '600' }}>Activation de la caméra...</span>
          </div>
        )}

        {cameraState === 'ERROR' && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={40} color="#FF4F81" />
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#FF7EB3' }}>Caméra Inaccessible</div>
            <div style={{ fontSize: '12px', color: 'var(--vyva-text-muted)', maxWidth: '280px', lineHeight: '1.4' }}>
              {humanErrorMessage}
            </div>
            <button
              onClick={() => handleStartCameraTest(facingMode, selectedDeviceId)}
              className="btn-primary-gradient"
              style={{
                marginTop: '6px',
                padding: '10px 20px',
                borderRadius: '99px',
                border: 'none',
                color: '#fff',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Autoriser / Réessayer 🔄
            </button>
          </div>
        )}

        {/* Audio Visualizer Bar */}
        {cameraState === 'ACTIVE' && !isMuted && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(9, 9, 11, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '8px 12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Volume2 size={16} color={audioLevel > 10 ? "#10B981" : "var(--vyva-text-muted)"} />
            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${audioLevel}%`,
                height: '100%',
                background: audioLevel > 50 ? 'var(--vyva-secondary)' : '#10B981',
                transition: 'width 0.1s ease'
              }}></div>
            </div>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--vyva-text-muted)' }}>
              Micro Active
            </span>
          </div>
        )}
      </div>

      {/* Clean Status Pill Indicator (Item 2) */}
      <div className="vyva-card" style={{ padding: '14px', marginBottom: '16px', background: 'rgba(24, 24, 27, 0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: '13px', fontWeight: '700' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isVideoOff ? '#EF4444' : '#10B981', boxShadow: isVideoOff ? 'none' : '0 0 8px #10B981' }}></span>
            <span>Caméra : <strong style={{ color: isVideoOff ? '#EF4444' : '#10B981' }}>{isVideoOff ? 'Désactivée' : 'Activée'}</strong></span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isMuted ? '#EF4444' : '#10B981', boxShadow: isMuted ? 'none' : '0 0 8px #10B981' }}></span>
            <span>Micro : <strong style={{ color: isMuted ? '#EF4444' : '#10B981' }}>{isMuted ? 'Coupé' : 'Activé'}</strong></span>
          </div>
        </div>

        {/* PC Camera Selection Dropdown (Hidden on Mobile) */}
        {!info.isMobile && availableCameras.length > 1 && (
          <div style={{ marginTop: '12px', pt: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <select
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '12px',
                background: '#09090B',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {availableCameras.map((cam, idx) => (
                <option key={cam.deviceId || idx} value={cam.deviceId}>
                  {cam.displayLabel}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Simple Action Controls Bar (Item 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: info.isMobile ? '1fr 1fr 1fr' : '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {info.isMobile && (
          <button
            onClick={handleFlipCamera}
            disabled={isFlipping || cameraState !== 'ACTIVE'}
            style={{
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 79, 129, 0.3)',
              background: 'rgba(255, 79, 129, 0.1)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              opacity: (isFlipping || cameraState !== 'ACTIVE') ? 0.5 : 1
            }}
          >
            <SwitchCamera size={18} color="#FF7EB3" />
            <span>Changer</span>
          </button>
        )}

        <button
          onClick={toggleVideo}
          disabled={cameraState !== 'ACTIVE'}
          style={{
            padding: '12px',
            borderRadius: '16px',
            border: 'none',
            background: isVideoOff ? '#EF4444' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          <span>{isVideoOff ? 'Cam OFF' : 'Cam ON'}</span>
        </button>

        <button
          onClick={toggleAudio}
          disabled={cameraState !== 'ACTIVE'}
          style={{
            padding: '12px',
            borderRadius: '16px',
            border: 'none',
            background: isMuted ? '#EF4444' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          <span>{isMuted ? 'Micro OFF' : 'Micro ON'}</span>
        </button>
      </div>

      {/* Hidden Dev Mode Diagnostics Panel (Item 7) */}
      {showDevMode && (
        <div className="vyva-card" style={{ marginBottom: '16px', padding: '12px', background: '#000', fontSize: '10px', fontFamily: 'monospace', color: '#A7F3D0', border: '1px dashed #10B981' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🛠️ MODE DEVELOPPEUR MASQUE</div>
          <div>• Platform: {info.osName} ({info.isMobile ? 'Mobile' : 'Desktop'})</div>
          <div>• Dev Logs:</div>
          {devLogs.map((log, i) => (
            <div key={i}>  {log}</div>
          ))}
        </div>
      )}

      {/* Final Continuation Button (Item 2 & 8) */}
      <button
        onClick={handleCloseModal}
        className="btn-primary-gradient"
        style={{
          width: '100%',
          marginTop: 'auto',
          padding: '16px',
          borderRadius: '99px',
          fontSize: '15px',
          fontWeight: '900',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <CheckCircle2 size={20} />
        <span>Continuer vers VYVA</span>
      </button>

    </div>
  );
}
