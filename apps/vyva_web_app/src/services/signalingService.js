/**
 * 🔌 VYVA SIGNALING & MATCHMAKING SERVICE
 * 
 * Connects to the live backend on vyva-uura.onrender.com via Socket.io.
 * Handles: matchmaking queue, WebRTC signaling (offer/answer/ICE), and reports.
 * Falls back gracefully if the server is unavailable (demo mode).
 */

const BACKEND_URL = import.meta.env.VITE_SIGNALING_URL || 'wss://vyva-uura.onrender.com';
const API_URL = import.meta.env.VITE_API_URL || 'https://vyva-uura.onrender.com';

// ─── REPORT SUBMISSION ──────────────────────────────────────────────────────

/**
 * Submit a user report to the backend API.
 * @param {object} report - { reportedUserId, reason, comment }
 */
export async function submitReport({ reportedUserId, reason, comment = '' }) {
  try {
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportedUserId, reason, comment, timestamp: new Date().toISOString() })
    });

    if (!response.ok) {
      console.warn('[VYVA] Report API responded with:', response.status);
    } else {
      console.log('[VYVA] Report submitted successfully.');
    }
  } catch (err) {
    // Non-blocking - report is logged locally even if server is down
    console.warn('[VYVA] Report submission failed (offline?):', err.message);
  }
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────

/**
 * Check if the VYVA backend is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── PRIVACY POLICY URL ───────────────────────────────────────────────────

export const PRIVACY_POLICY_URL = `${API_URL}/privacy`;
export { API_URL, BACKEND_URL };
