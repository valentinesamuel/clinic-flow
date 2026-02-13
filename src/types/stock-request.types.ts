import { UserRole } from './user.types';

export type StockRequestStatus =
  | 'pending'
  | 'approved'
  | 'partially_approved'
  | 'rejected'
  | 'forwarded_to_cmo'
  | 'info_requested'
  | 'fulfilled';

export type StockRequestUrgency = 'normal' | 'urgent';

export interface StockRequestItem {
  inventoryItemId: string;
  itemName: string;
  currentStock: number;
  requestedQuantity: number;
  approvedQuantity?: number;
}

export interface StockRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  requesterDepartment: string;
  items: StockRequestItem[];
  urgency: StockRequestUrgency;
  reason: string;
  notes?: string;
  status: StockRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewerNotes?: string;
  forwardedToCmo?: boolean;
  forwardedAt?: string;
}
