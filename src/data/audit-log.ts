// In-memory Audit Log

export type AuditAction =
  | 'consultation_started'
  | 'consultation_saved_draft'
  | 'consultation_finalized'
  | 'consultation_amended'
  | 'bundle_applied'
  | 'bundle_item_deselected'
  | 'justification_provided'
  | 'lab_order_added'
  | 'prescription_added'
  | 'lab_order_created'
  | 'prescription_created';

export type AuditEntityType = 'consultation' | 'lab_order' | 'prescription' | 'bundle';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  patientId: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

const auditLog: AuditEntry[] = [];
let nextId = 1;

export function logAuditEntry(
  entry: Omit<AuditEntry, 'id' | 'timestamp'>,
): AuditEntry {
  const auditEntry: AuditEntry = {
    ...entry,
    id: `audit-${String(nextId++).padStart(4, '0')}`,
    timestamp: new Date().toISOString(),
  };
  auditLog.push(auditEntry);
  return auditEntry;
}

export function getAuditLog(entityId: string): AuditEntry[] {
  return auditLog
    .filter(e => e.entityId === entityId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getAuditLogByPatient(patientId: string): AuditEntry[] {
  return auditLog
    .filter(e => e.patientId === patientId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
