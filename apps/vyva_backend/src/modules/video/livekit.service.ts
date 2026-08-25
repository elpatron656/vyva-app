/**
 * 🎥 LIVEKIT WEBRTC VIDEO SERVICE
 * 
 * Gestionnaire d'infrastructure vidéo WebRTC SFU pour VYVA.
 * Génération de jetons d'accès sécurisés, création dynamique de salons
 * et écouteur d'événements pour le calcul de durée et la modération.
 */

import { AccessToken } from 'livekit-server-sdk';

export interface RoomTokenRequest {
  roomId: string;
  userId: string;
  identityName: string;
  isPublisher: boolean;
}

export class VyvaLiveKitService {
  private apiKey: string;
  private apiSecret: string;
  private wsUrl: string;

  constructor() {
    this.apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    this.apiSecret = process.env.LIVEKIT_API_SECRET || 'secretkeysecretkeysecretkey123456';
    this.wsUrl = process.env.LIVEKIT_WS_URL || 'wss://livekit.vyva.app';
  }

  /**
   * Génère un token WebRTC sécurisé pour un utilisateur rejoignant une room vidéo VYVA
   */
  public async generateRoomToken(request: RoomTokenRequest): Promise<string> {
    const token = new AccessToken(this.apiKey, this.apiSecret, {
      identity: request.userId,
      name: request.identityName,
      ttl: '1h', // Jeton valide pour la durée de la session
    });

    token.addGrant({
      roomJoin: true,
      room: request.roomId,
      canPublish: request.isPublisher,
      canSubscribe: true,
      canPublishData: true, // Pour la synchro des mini-jeux
    });

    return await token.toJwt();
  }

  public getWebSocketUrl(): string {
    return this.wsUrl;
  }
}
