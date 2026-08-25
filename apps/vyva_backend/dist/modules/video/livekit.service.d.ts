export interface RoomTokenRequest {
    roomId: string;
    userId: string;
    identityName: string;
    isPublisher: boolean;
}
export declare class VyvaLiveKitService {
    private apiKey;
    private apiSecret;
    private wsUrl;
    constructor();
    generateRoomToken(request: RoomTokenRequest): Promise<string>;
    getWebSocketUrl(): string;
}
