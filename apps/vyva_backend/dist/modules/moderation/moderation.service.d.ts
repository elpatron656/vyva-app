export type ReportReason = 'NUDITY_OR_EXPLICIT' | 'HARASSMENT_OR_BULLYING' | 'UNDERAGE_USER' | 'SPAM_OR_FAKE' | 'INAPPROPRIATE_BEHAVIOR' | 'OTHER';
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
export declare class VyvaModerationService {
    private reports;
    submitReport(reporterId: string, reportedUserId: string, reason: ReportReason, sessionId?: string, comment?: string, snapshotUrl?: string): SafetyReport;
    inspectVideoFrame(frameBase64: string): {
        flagged: boolean;
        reason?: string;
        confidence?: number;
    };
    getPendingReports(): SafetyReport[];
}
