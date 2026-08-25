"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VyvaMatchAIService = void 0;
class VyvaMatchAIService {
    calculateCompatibilityScore(userA, userB) {
        if (userA.ignoredUserIds.includes(userB.userId) ||
            userB.ignoredUserIds.includes(userA.userId)) {
            return 0;
        }
        if (userA.recentlyMetUserIds.includes(userB.userId) ||
            userB.recentlyMetUserIds.includes(userA.userId)) {
            return 15;
        }
        const commonInterests = userA.interests.filter((i) => userB.interests.includes(i));
        const maxInterests = Math.max(userA.interests.length, userB.interests.length, 1);
        const interestsScore = Math.min(25, (commonInterests.length / maxInterests) * 35);
        let geoScore = 0;
        if (userA.countryCode === userB.countryCode) {
            geoScore += 12;
        }
        if (userA.preferredLanguage === userB.preferredLanguage) {
            geoScore += 8;
        }
        const avgReputation = (userA.reputationScore + userB.reputationScore) / 2;
        const reputationScore = (avgReputation / 100) * 20;
        const durationDiff = Math.abs(userA.avgCallDurationSeconds - userB.avgCallDurationSeconds);
        const durationScore = Math.max(0, 15 - Math.floor(durationDiff / 10));
        let premiumBonus = 10;
        if (userA.isPremium || userB.isPremium)
            premiumBonus += 5;
        if (userA.premiumTier === 'GOLD' || userB.premiumTier === 'GOLD')
            premiumBonus += 5;
        const rawScore = Math.round(interestsScore + geoScore + reputationScore + durationScore + premiumBonus);
        return Math.min(98, Math.max(62, rawScore));
    }
    findBestMatchInQueue(candidate, queue) {
        let bestPartner = null;
        let highestScore = -1;
        for (const partner of queue) {
            if (partner.userId === candidate.userId)
                continue;
            if (candidate.targetGenderPreference !== 'EVERYONE' &&
                candidate.targetGenderPreference !== partner.gender) {
                continue;
            }
            if (partner.targetGenderPreference !== 'EVERYONE' &&
                partner.targetGenderPreference !== candidate.gender) {
                continue;
            }
            const score = this.calculateCompatibilityScore(candidate, partner);
            if (score > highestScore && score >= 60) {
                highestScore = score;
                bestPartner = partner;
            }
        }
        return bestPartner ? { partner: bestPartner, score: highestScore } : null;
    }
}
exports.VyvaMatchAIService = VyvaMatchAIService;
//# sourceMappingURL=vyva-match-ai.service.js.map