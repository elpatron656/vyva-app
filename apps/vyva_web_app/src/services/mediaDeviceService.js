/**
 * 🎥 VYVA MEDIA DEVICE & WEBRTC CAMERA SERVICE
 * 
 * Multi-device camera capture, non-destructive facingMode switching,
 * permission status evaluation, device enumeration, and WebRTC track replacement.
 */

export function getDeviceInfo() {
  const userAgent = typeof navigator !== 'undefined' ? (navigator.userAgent || navigator.vendor || '') : '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(userAgent);
  const isMobile = isIOS || isAndroid || /Mobi|Tablet|Mobile/i.test(userAgent);
  
  // Real browser secure context evaluation
  const isSecureContextReal = Boolean(
    typeof window !== 'undefined' &&
    (window.isSecureContext ||
     location.protocol === 'https:' ||
     location.hostname === 'localhost' ||
     location.hostname === '127.0.0.1')
  );

  let osName = 'Desktop (Windows/Mac/Linux)';
  if (isIOS) osName = 'iOS (iPhone/iPad)';
  else if (isAndroid) osName = 'Android';

  let browserName = 'Navigateur';
  if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browserName = 'Chrome';
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browserName = 'Safari';
  else if (/Firefox/i.test(userAgent)) browserName = 'Firefox';
  else if (/Edg/i.test(userAgent)) browserName = 'Edge';

  const hasMediaDevices = Boolean(typeof navigator !== 'undefined' && navigator.mediaDevices);
  const hasGetUserMedia = Boolean(hasMediaDevices && navigator.mediaDevices.getUserMedia);
  const hasEnumerateDevices = Boolean(hasMediaDevices && navigator.mediaDevices.enumerateDevices);

  return {
    isIOS,
    isAndroid,
    isMobile,
    isDesktop: !isMobile,
    isSecure: isSecureContextReal,
    protocol: typeof location !== 'undefined' ? location.protocol : 'http:',
    url: typeof location !== 'undefined' ? location.href : '',
    osName,
    browserName,
    userAgent,
    hasMediaDevices,
    hasGetUserMedia,
    hasEnumerateDevices
  };
}

export function getDeviceDisplayLabel(device, facingModeHint = 'user', index = 0) {
  const info = getDeviceInfo();
  const rawLabel = device?.label || '';

  if (info.isMobile) {
    if (facingModeHint === 'user' || /front|facing front|user|avant|selfie/i.test(rawLabel)) {
      return "Caméra avant (Selfie)";
    }
    if (facingModeHint === 'environment' || /back|rear|facing back|environment|arrière/i.test(rawLabel)) {
      return "Caméra arrière";
    }
    return `Caméra du téléphone ${index + 1}`;
  }

  if (rawLabel) {
    if (/usb/i.test(rawLabel)) {
      return rawLabel;
    }
    if (/integrated|built-in|internal|facetime/i.test(rawLabel)) {
      return "Webcam intégrée";
    }
    return rawLabel;
  }

  return index === 0 ? "Webcam principale" : `Webcam ${index + 1}`;
}

export async function checkPermissions() {
  let cameraPermission = 'unknown';
  let micPermission = 'unknown';

  if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
    try {
      const camStatus = await navigator.permissions.query({ name: 'camera' });
      cameraPermission = camStatus.state;
    } catch (e) {
      cameraPermission = 'unknown';
    }

    try {
      const micStatus = await navigator.permissions.query({ name: 'microphone' });
      micPermission = micStatus.state;
    } catch (e) {
      micPermission = 'unknown';
    }
  }

  return { cameraPermission, micPermission };
}

export function handleMediaError(err) {
  console.warn("Media capture error:", err);

  const errorType = err.name || 'UnknownError';
  const rawMessage = err.message || '';
  let userMessage = "Impossible d'accéder à la caméra ou au microphone.";

  if (errorType === 'NotAllowedError' || errorType === 'PermissionDeniedError') {
    userMessage = "Accès refusé par le navigateur (NotAllowedError). Sur mobile, assurez-vous d'avoir cliqué sur le bouton de démarrage, vérifié l'autorisation caméra du site, ou accepté le certificat SSL local.";
  } else if (errorType === 'NotFoundError' || errorType === 'DevicesNotFoundError') {
    userMessage = "Aucune caméra détectée sur cet appareil.";
  } else if (errorType === 'NotReadableError' || errorType === 'TrackStartError') {
    userMessage = "La caméra est déjà utilisée par une autre application (Zoom, Teams, ou autre onglet).";
  } else if (errorType === 'OverconstrainedError' || errorType === 'ConstraintNotSatisfiedError') {
    userMessage = "Les contraintes vidéo demandées ne sont pas supportées par cet appareil.";
  } else if (errorType === 'SecurityError') {
    userMessage = "L'accès à la caméra nécessite un contexte HTTPS sécurisé.";
  }

  return {
    granted: false,
    videoGranted: false,
    audioGranted: false,
    errorType,
    userMessage,
    rawMessage,
    originalError: err
  };
}

/**
 * Simplified UserMedia initialization for maximum mobile compatibility.
 * Avoids rigid width/height constraints on mobile initial load.
 */
export async function initializeLocalMedia({
  facingMode = 'user',
  deviceId = null,
  video = true,
  audio = false // Audio set to false by default for initial camera test to isolate video
} = {}) {
  const info = getDeviceInfo();

  if (!info.isSecure) {
    throw {
      name: 'SecurityError',
      userMessage: `Connexion non sécurisée (HTTP). Accédez à https://${location.host} pour autoriser la caméra.`,
      message: 'Unsecure HTTP Context'
    };
  }

  if (!info.hasGetUserMedia) {
    throw {
      name: 'NotSupportedError',
      userMessage: 'API getUserMedia non disponible sur ce navigateur.',
      message: 'getUserMedia unavailable'
    };
  }

  const constraints = {
    audio: audio ? { echoCancellation: true, noiseSuppression: true } : false,
    video: false
  };

  if (video) {
    if (deviceId) {
      constraints.video = { deviceId: { exact: deviceId } };
    } else if (info.isMobile) {
      // Minimal mobile constraint
      constraints.video = {
        facingMode: facingMode === 'environment' ? { ideal: 'environment' } : 'user'
      };
    } else {
      constraints.video = true;
    }
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const activeVideoTrack = stream.getVideoTracks()[0] || null;
    const activeAudioTrack = stream.getAudioTracks()[0] || null;

    const activeDeviceLabel = activeVideoTrack?.label || '';
    const displayLabel = getDeviceDisplayLabel(
      { label: activeDeviceLabel },
      facingMode
    );

    return {
      stream,
      activeVideoTrack,
      activeAudioTrack,
      facingMode,
      deviceId: activeVideoTrack?.getSettings()?.deviceId || deviceId,
      displayLabel
    };
  } catch (err) {
    throw handleMediaError(err);
  }
}

/**
 * 🔄 ROBUST NON-DESTRUCTIVE CAMERA FLIP SEQUENCE
 */
export async function switchCamera({
  currentStream,
  targetFacingMode = 'user',
  targetDeviceId = null,
  peerConnection = null
}) {
  const oldVideoTrack = currentStream ? currentStream.getVideoTracks()[0] : null;

  // 1. Request NEW MediaStream FIRST
  const newMedia = await initializeLocalMedia({
    facingMode: targetFacingMode,
    deviceId: targetDeviceId,
    video: true,
    audio: false
  });

  const newVideoTrack = newMedia.activeVideoTrack;
  if (!newVideoTrack) {
    throw new Error("Échec d'obtention de la nouvelle piste vidéo.");
  }

  // 2. Replace track in active WebRTC connection seamlessly
  if (peerConnection && newVideoTrack) {
    const senders = peerConnection.getSenders();
    const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
    if (videoSender) {
      await videoSender.replaceTrack(newVideoTrack);
    }
  }

  // 3. Update MediaStream track container
  if (currentStream) {
    if (oldVideoTrack) {
      currentStream.removeTrack(oldVideoTrack);
    }
    currentStream.addTrack(newVideoTrack);
  }

  // 4. Stop old track safely AFTER new stream is running
  if (oldVideoTrack) {
    try {
      oldVideoTrack.stop();
    } catch (e) {
      console.warn("Error stopping old video track:", e);
    }
  }

  return {
    stream: currentStream || newMedia.stream,
    newVideoTrack,
    facingMode: newMedia.facingMode,
    displayLabel: newMedia.displayLabel
  };
}

export function stopLocalMedia(stream) {
  if (stream) {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (e) {
        console.warn("Error stopping media track:", e);
      }
    });
  }
}

export async function getAvailableCameras() {
  const info = getDeviceInfo();
  if (!info.hasEnumerateDevices) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === 'videoinput');

    return videoDevices.map((d, i) => {
      const displayLabel = getDeviceDisplayLabel(d, i === 0 ? 'user' : 'environment', i);
      return {
        deviceId: d.deviceId,
        label: d.label || displayLabel,
        displayLabel,
        groupId: d.groupId
      };
    });
  } catch (err) {
    console.warn("Error enumerating devices:", err);
    return [];
  }
}

export async function getSystemDiagnostics(activeStream = null, lastError = null) {
  const info = getDeviceInfo();
  const perms = await checkPermissions();
  
  let videoDevices = [];
  let audioDevices = [];

  if (info.hasEnumerateDevices) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = devices.filter((d) => d.kind === 'videoinput');
      audioDevices = devices.filter((d) => d.kind === 'audioinput');
    } catch (e) {}
  }

  let activeTrackTelemetry = null;
  if (activeStream) {
    const track = activeStream.getVideoTracks()[0];
    if (track) {
      const settings = track.getSettings ? track.getSettings() : {};
      activeTrackTelemetry = {
        label: track.label || 'Active Track',
        readyState: track.readyState,
        width: settings.width || 0,
        height: settings.height || 0,
        frameRate: settings.frameRate || 30,
        facingMode: settings.facingMode || 'unknown',
        enabled: track.enabled
      };
    }
  }

  // Console output diagnostic trace (Item 1 requirement)
  console.log("=== DIAGNOSTIC SYSTEME VYVA ===");
  console.log("URL:", info.url);
  console.log("Protocol:", info.protocol);
  console.log("Secure context:", info.isSecure);
  console.log("mediaDevices:", info.hasMediaDevices);
  console.log("getUserMedia:", info.hasGetUserMedia);
  console.log("User agent:", info.userAgent);

  return {
    url: info.url,
    protocol: info.protocol,
    isSecureContext: info.isSecure,
    osName: info.osName,
    browserName: info.browserName,
    isMobile: info.isMobile,
    userAgent: info.userAgent,
    cameraApiAvailable: info.hasGetUserMedia,
    cameraPermission: perms.cameraPermission,
    micPermission: perms.micPermission,
    videoDevicesCount: videoDevices.length,
    audioDevicesCount: audioDevices.length,
    activeTrack: activeTrackTelemetry,
    streamActive: Boolean(activeStream && activeStream.active),
    lastErrorName: lastError?.errorType || lastError?.name || null,
    lastErrorMessage: lastError?.rawMessage || lastError?.message || lastError?.userMessage || null
  };
}
