import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { VyvaMatchAIService, UserMatchProfile } from './vyva-match-ai.service';

interface JoinQueuePayload {
  userId: string;
  displayName: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY';
  targetGenderPreference: 'MALE' | 'FEMALE' | 'EVERYONE';
  countryCode: string;
  preferredLanguage: string;
  interests: string[];
  isPremium?: boolean;
  premiumTier?: 'FREE' | 'PLUS' | 'GOLD';
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MatchmakingGateway.name);
  private matchAi = new VyvaMatchAIService();

  // Active waiting queue of users
  private waitingQueue: Map<string, { socket: Socket; profile: UserMatchProfile }> = new Map();

  // Active call rooms: socketId -> roomId
  private activeUserRooms: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.removeFromQueue(client.id);
    this.handleCallDisconnect(client);
  }

  /**
   * User enters the matchmaking queue
   */
  @SubscribeMessage('join_queue')
  handleJoinQueue(@ConnectedSocket() client: Socket, @MessageBody() data: JoinQueuePayload) {
    this.logger.log(`[Queue] User ${data.displayName} (${data.userId}) joined queue.`);

    const userProfile: UserMatchProfile = {
      userId: data.userId || `usr_${client.id.substring(0, 6)}`,
      displayName: data.displayName || 'Utilisateur VYVA',
      gender: data.gender || 'NON_BINARY',
      targetGenderPreference: data.targetGenderPreference || 'EVERYONE',
      countryCode: data.countryCode || 'FR',
      preferredLanguage: data.preferredLanguage || 'fr',
      interests: data.interests || ['Musique', 'Voyages'],
      reputationScore: 90,
      avgCallDurationSeconds: 45,
      isPremium: data.isPremium || false,
      premiumTier: data.premiumTier || 'FREE',
      recentlyMetUserIds: [],
      ignoredUserIds: [],
    };

    // Store user socket in waiting queue
    this.waitingQueue.set(client.id, { socket: client, profile: userProfile });

    // Attempt instant match with existing users in queue
    const candidates = Array.from(this.waitingQueue.values()).map((u) => u.profile);
    const matchResult = this.matchAi.findBestMatchInQueue(userProfile, candidates);

    if (matchResult) {
      const { partner, score } = matchResult;
      const partnerEntry = Array.from(this.waitingQueue.entries()).find(
        ([_, val]) => val.profile.userId === partner.userId
      );

      if (partnerEntry) {
        const [partnerSocketId, partnerData] = partnerEntry;

        // Remove both from queue
        this.waitingQueue.delete(client.id);
        this.waitingQueue.delete(partnerSocketId);

        // Create exclusive room
        const roomId = `room_${client.id}_${partnerSocketId}`;
        client.join(roomId);
        partnerData.socket.join(roomId);

        this.activeUserRooms.set(client.id, roomId);
        this.activeUserRooms.set(partnerSocketId, roomId);

        this.logger.log(`[Match SUCCESS] Room ${roomId} created between ${userProfile.displayName} and ${partner.displayName} (Score: ${score}%)`);

        // Notify client A (Caller / Offer initiator)
        client.emit('match_found', {
          roomId,
          isInitiator: true,
          partner: partnerData.profile,
          compatibilityScore: score,
        });

        // Notify client B (Callee / Answer receiver)
        partnerData.socket.emit('match_found', {
          roomId,
          isInitiator: false,
          partner: userProfile,
          compatibilityScore: score,
        });
      }
    } else {
      client.emit('searching_status', { status: 'SEARCHING', queueLength: this.waitingQueue.size });
    }
  }

  /**
   * User cancels search
   */
  @SubscribeMessage('leave_queue')
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    this.removeFromQueue(client.id);
    client.emit('searching_status', { status: 'CANCELLED' });
  }

  /**
   * WebRTC Signaling: Relays SDP Offer
   */
  @SubscribeMessage('webrtc_offer')
  handleOffer(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; offer: any }) {
    client.to(data.roomId).emit('webrtc_offer', {
      offer: data.offer,
      senderSocketId: client.id,
    });
  }

  /**
   * WebRTC Signaling: Relays SDP Answer
   */
  @SubscribeMessage('webrtc_answer')
  handleAnswer(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; answer: any }) {
    client.to(data.roomId).emit('webrtc_answer', {
      answer: data.answer,
      senderSocketId: client.id,
    });
  }

  /**
   * WebRTC Signaling: Relays ICE Candidate
   */
  @SubscribeMessage('webrtc_ice_candidate')
  handleIceCandidate(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; candidate: any }) {
    client.to(data.roomId).emit('webrtc_ice_candidate', {
      candidate: data.candidate,
      senderSocketId: client.id,
    });
  }

  /**
   * User skips to next match
   */
  @SubscribeMessage('next_match')
  handleNextMatch(@ConnectedSocket() client: Socket, @MessageBody() data: JoinQueuePayload) {
    this.handleCallDisconnect(client);
    this.handleJoinQueue(client, data);
  }

  private removeFromQueue(socketId: string) {
    if (this.waitingQueue.has(socketId)) {
      this.waitingQueue.delete(socketId);
      this.logger.log(`[Queue] Removed socket ${socketId} from queue.`);
    }
  }

  private handleCallDisconnect(client: Socket) {
    const roomId = this.activeUserRooms.get(client.id);
    if (roomId) {
      client.to(roomId).emit('partner_disconnected', { message: 'Le correspondant s\'est déconnecté.' });
      client.leave(roomId);
      this.activeUserRooms.delete(client.id);
    }
  }
}
