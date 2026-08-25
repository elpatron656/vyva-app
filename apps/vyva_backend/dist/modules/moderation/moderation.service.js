"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VyvaModerationService = void 0;
class VyvaModerationService {
    constructor() {
        this.reports = [];
    }
    submitReport(reporterId, reportedUserId, reason, sessionId, comment, snapshotUrl) {
        const report = {
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
    inspectVideoFrame(frameBase64) {
        return {
            flagged: false,
            confidence: 0.02,
        };
    }
    getPendingReports() {
        return this.reports.filter((r) => r.status === 'PENDING');
    }
}
exports.VyvaModerationService = VyvaModerationService;
//# sourceMappingURL=moderation.service.js.map