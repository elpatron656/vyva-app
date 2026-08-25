/**
 * 🛡️ VYVA MODERATION & SAFETY ENGINE
 * 
 * Système hybride d'inspection automatisée des flux vidéo et de gestion des signalements.
 * Respect de la sécurité 18+, anti-harcèlement et modération en direct.
 */

export type ReportReason =
  | 'NUDITY_OR_EXPLICIT'
  | 'HARASSMENT_OR_BULLYING'
  | 'UNDERAGE_USER'
  | 'SPAM_OR_FAKE'
  | 'INAPPROPRIATE_BEHAVIOR'
  | 'OTHER';

export interface SafetyReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  sessionId?: string;
  reason: ReportReason;
  comment?: string;
  snapshotUrl?: string;
  createdAt: Date;
  status: 'PENDING' | 'RESOLVED_WARNING' | 'RESOLVED_BAN' | 'DISMISSED';
}

export class VyvaModerationService {
  private reports: SafetyReport[] = [];

  /**
   * Enregistre un signalement 1-tap émis depuis un appel vidéo
   */
  public submitReport(
    reporterId: string,
    reportedUserId: string,
    reason: ReportReason,
    sessionId?: string,
    comment?: string,
    snapshotUrl?: string
  ): SafetyReport {
    const report: SafetyReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reporterId,
      reportedUserId,
      sessionId,
      reason,
      comment,
      snapshotUrl,
      createdAt: new Date(),
      status: 'PENDING',
    };

    this.reports.push(report);
    return report;
  }

  /**
   * Simulation d'inspection de frame vidéo automatisée par IA (Sightengine API)
   */
  public inspectVideoFrame(frameBase64: string): { flagged: boolean; reason?: string; confidence?: number } {
    // Dans la version prod, envoie l'image à l'API Sightengine / NudeNet.
    // Simulation pour les tests :
    return {
      flagged: false,
      confidence: 0.02,
    };
  }

  public getPendingReports(): SafetyReport[] {
    return this.reports.filter((r) => r.status === 'PENDING');
  }
}
