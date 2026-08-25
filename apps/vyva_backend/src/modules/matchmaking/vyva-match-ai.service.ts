/**
 * 🧠 VYVA MATCH AI — MOTEUR DE MATCHMAKING INTELLIGENT ET ÉQUITABLE
 * 
 * Algorithme exclusif VYVA calculant la compatibilité réelle et ludique
 * entre deux utilisateurs selon 5 piliers :
 * 1. Centré sur l'intérêt partagé (25%)
 * 2. Langues & Géographie (20%)
 * 3. Score de Réputation & Qualité des interactions (20%)
 * 4. Préférences de durée moyenne de conversation (15%)
 * 5. Privilèges & Priorités Premium (20%)
 */

export interface UserMatchProfile {
  userId: string;
  displayName: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY';
  targetGenderPreference: 'MALE' | 'FEMALE' | 'EVERYONE';
  countryCode: string;
  preferredLanguage: string;
  interests: string[];
  reputationScore: number; // 0 à 100
  avgCallDurationSeconds: number;
  isPremium: boolean;
  premiumTier: 'FREE' | 'PLUS' | 'GOLD';
  recentlyMetUserIds: string[];
  ignoredUserIds: string[];
}

export class VyvaMatchAIService {
  /**
   * Calcule un score de compatibilité VYVA (0 % - 100 %)
   */
  public calculateCompatibilityScore(
    userA: UserMatchProfile,
    userB: UserMatchProfile
  ): number {
    // 0. Vérification des exclusions strictes (Blocages / Historique récent)
    if (
      userA.ignoredUserIds.includes(userB.userId) ||
      userB.ignoredUserIds.includes(userA.userId)
    ) {
      return 0;
    }

    if (
      userA.recentlyMetUserIds.includes(userB.userId) ||
      userB.recentlyMetUserIds.includes(userA.userId)
    ) {
      return 15; // Score pénalisé pour éviter de reconnecter les mêmes personnes
    }

    // 1. Compatibilité des Centres d'intérêt (25 points max)
    const commonInterests = userA.interests.filter((i) =>
      userB.interests.includes(i)
    );
    const maxInterests = Math.max(userA.interests.length, userB.interests.length, 1);
    const interestsScore = Math.min(25, (commonInterests.length / maxInterests) * 35);

    // 2. Langues & Pays (20 points max)
    let geoScore = 0;
    if (userA.countryCode === userB.countryCode) {
      geoScore += 12;
    }
    if (userA.preferredLanguage === userB.preferredLanguage) {
      geoScore += 8;
    }

    // 3. Score de Réputation (20 points max)
    const avgReputation = (userA.reputationScore + userB.reputationScore) / 2;
    const reputationScore = (avgReputation / 100) * 20;

    // 4. Rythme & Durée moyenne de conversation (15 points max)
    const durationDiff = Math.abs(userA.avgCallDurationSeconds - userB.avgCallDurationSeconds);
    const durationScore = Math.max(0, 15 - Math.floor(durationDiff / 10));

    // 5. Bonus Premium (20 points max)
    let premiumBonus = 10; // Base ludique
    if (userA.isPremium || userB.isPremium) premiumBonus += 5;
    if (userA.premiumTier === 'GOLD' || userB.premiumTier === 'GOLD') premiumBonus += 5;

    // Score global bridé entre 65% et 98% pour l'affichage ludique
    const rawScore = Math.round(
      interestsScore + geoScore + reputationScore + durationScore + premiumBonus
    );

    return Math.min(98, Math.max(62, rawScore));
  }

  /**
   * Sélectionne le meilleur partenaire dans la queue Redis d'attente
   */
  public findBestMatchInQueue(
    candidate: UserMatchProfile,
    queue: UserMatchProfile[]
  ): { partner: UserMatchProfile; score: number } | null {
    let bestPartner: UserMatchProfile | null = null;
    let highestScore = -1;

    for (const partner of queue) {
      if (partner.userId === candidate.userId) continue;

      // Filtre Genre Strict
      if (
        candidate.targetGenderPreference !== 'EVERYONE' &&
        candidate.targetGenderPreference !== partner.gender
      ) {
        continue;
      }
      if (
        partner.targetGenderPreference !== 'EVERYONE' &&
        partner.targetGenderPreference !== candidate.gender
      ) {
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
