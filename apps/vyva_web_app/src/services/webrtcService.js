/**
 * 🌐 VYVA WEBRTC PEER CONNECTION & SIGNALING SERVICE
 * 
 * Production WebRTC architecture for Azar-like video matchmaking.
 * Handles RTCPeerConnection lifecycle, RTCRtpSender.replaceTrack() for seamless camera flips,
 * and candidate handling without recreating connections unnecessarily.
 */

export class VyvaWebRTCClient {
  constructor({ onRemoteStream, onIceCandidate, onConnectionStateChange, onIceConnectionStateChange }) {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = new MediaStream();
    this.onRemoteStream = onRemoteStream;
    this.onIceCandidate = onIceCandidate;
    this.onConnectionStateChange = onConnectionStateChange;
    this.onIceConnectionStateChange = onIceConnectionStateChange;
    
    this.configuration = {
      iceServers: [
        // ── STUN servers (Google fallback + Metered) ──────────────────────
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun.relay.metered.ca:80' },

        // ── TURN servers Metered.ca (required for 4G ↔ 4G connections) ───
        {
          urls: 'turn:global.relay.metered.ca:80',
          username: '611a6da22d24e28b77071aa2',
          credential: '1dXRnZDR3ZGL4Q0o'
        },
        {
          urls: 'turn:global.relay.metered.ca:80?transport=tcp',
          username: '611a6da22d24e28b77071aa2',
          credential: '1dXRnZDR3ZGL4Q0o'
        },
        {
          urls: 'turn:global.relay.metered.ca:443',
          username: '611a6da22d24e28b77071aa2',
          credential: '1dXRnZDR3ZGL4Q0o'
        },
        {
          urls: 'turns:global.relay.metered.ca:443?transport=tcp',
          username: '611a6da22d24e28b77071aa2',
          credential: '1dXRnZDR3ZGL4Q0o'
        }
      ],
      iceCandidatePoolSize: 10
    };
  }

  initializePeerConnection(localStream) {
    this.close(); // Clean up previous connection if any

    this.peerConnection = new RTCPeerConnection(this.configuration);
    this.localStream = localStream;

    // Attach local MediaStream tracks to RTCPeerConnection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, localStream);
      });
    }

    // Remote track reception
    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track);
        });
      } else if (event.track) {
        this.remoteStream.addTrack(event.track);
      }

      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    // ICE Candidate handler
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.onIceCandidate) {
        this.onIceCandidate(event.candidate);
      }
    };

    // Connection state listeners
    this.peerConnection.onconnectionstatechange = () => {
      if (this.onConnectionStateChange && this.peerConnection) {
        this.onConnectionStateChange(this.peerConnection.connectionState);
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.onIceConnectionStateChange && this.peerConnection) {
        this.onIceConnectionStateChange(this.peerConnection.iceConnectionState);
      }
    };

    return this.peerConnection;
  }

  /**
   * Seamless camera track replacement via RTCRtpSender.replaceTrack()
   * Avoids destroying/recreating the RTCPeerConnection during call camera flips.
   */
  async replaceVideoTrack(newVideoTrack) {
    if (!this.peerConnection) return false;

    const senders = this.peerConnection.getSenders();
    const videoSender = senders.find((sender) => sender.track && sender.track.kind === 'video');

    if (videoSender && newVideoTrack) {
      await videoSender.replaceTrack(newVideoTrack);
      return true;
    }
    return false;
  }

  async createOffer() {
    if (!this.peerConnection) return null;
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async handleAnswer(answer) {
    if (!this.peerConnection) return;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async addIceCandidate(candidate) {
    if (!this.peerConnection) return;
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  close() {
    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch (e) {
        console.warn("Error closing RTCPeerConnection:", e);
      }
      this.peerConnection = null;
    }
    this.remoteStream = new MediaStream();
  }
}
