// Audit Log Type Definitions

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
