"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VyvaLiveKitService = void 0;
const livekit_server_sdk_1 = require("livekit-server-sdk");
class VyvaLiveKitService {
    constructor() {
        this.apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
        this.apiSecret = process.env.LIVEKIT_API_SECRET || 'secretkeysecretkeysecretkey123456';
        this.wsUrl = process.env.LIVEKIT_WS_URL || 'wss://livekit.vyva.app';
    }
    async generateRoomToken(request) {
        const token = new livekit_server_sdk_1.AccessToken(this.apiKey, this.apiSecret, {
            identity: request.userId,
            name: request.identityName,
            ttl: '1h',
        });
        token.addGrant({
            roomJoin: true,
            room: request.roomId,
            canPublish: request.isPublisher,
            canSubscribe: true,
            canPublishData: true,
        });
        return await token.toJwt();
    }
    getWebSocketUrl() {
        return this.wsUrl;
    }
}
exports.VyvaLiveKitService = VyvaLiveKitService;
//# sourceMappingURL=livekit.service.js.map