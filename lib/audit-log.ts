export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'APPOINTMENT_APPROVED'
  | 'APPOINTMENT_CANCELLED'
  | 'TIME_BLOCKED'
  | 'TIME_UNBLOCKED';

export interface AuditLog {
  timestamp: string;
  action: AuditAction;
  email: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
  success: boolean;
}

// In production, store these in a database
// For now, keep in browser sessionStorage (not localStorage, so it clears on close)
const AUDIT_LOGS_KEY = 'admin_audit_logs';

export function addAuditLog(
  action: AuditAction,
  email: string,
  success: boolean = true,
  details?: Record<string, unknown>
) {
  try {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
      email,
      success,
      details,
    };

    // Keep only last 100 logs to save space
    const existing = getAuditLogs().slice(-99);
    const logs = [...existing, log];

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
    }
  } catch (err) {
    console.error('Failed to add audit log:', err);
  }
}

export function getAuditLogs(): AuditLog[] {
  if (typeof window === 'undefined') return [];

  try {
    const logs = sessionStorage.getItem(AUDIT_LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
}

export function getLoginAttempts(email: string): AuditLog[] {
  return getAuditLogs().filter(
    (log) => log.email === email && (log.action === 'LOGIN' || log.action === 'LOGIN_FAILED')
  );
}

export function getFailedLoginCount(email: string, withinMinutes: number = 15): number {
  const cutoff = Date.now() - withinMinutes * 60 * 1000;

  return getAuditLogs().filter(
    (log) =>
      log.email === email &&
      log.action === 'LOGIN_FAILED' &&
      new Date(log.timestamp).getTime() > cutoff
  ).length;
}
