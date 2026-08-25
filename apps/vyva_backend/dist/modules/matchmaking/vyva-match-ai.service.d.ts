export interface UserMatchProfile {
    userId: string;
    displayName: string;
    gender: 'MALE' | 'FEMALE' | 'NON_BINARY';
    targetGenderPreference: 'MALE' | 'FEMALE' | 'EVERYONE';
    countryCode: string;
    preferredLanguage: string;
    interests: string[];
    reputationScore: number;
    avgCallDurationSeconds: number;
    isPremium: boolean;
    premiumTier: 'FREE' | 'PLUS' | 'GOLD';
    recentlyMetUserIds: string[];
    ignoredUserIds: string[];
}
export declare class VyvaMatchAIService {
    calculateCompatibilityScore(userA: UserMatchProfile, userB: UserMatchProfile): number;
    findBestMatchInQueue(candidate: UserMatchProfile, queue: UserMatchProfile[]): {
        partner: UserMatchProfile;
        score: number;
    } | null;
}
