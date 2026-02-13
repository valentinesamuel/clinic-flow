// Stock Requests Mock Data

import {
  StockRequest,
  StockRequestItem,
  StockRequestStatus,
  StockRequestUrgency,
} from '@/types/stock-request.types';
import { UserRole } from '@/types/user.types';

export const mockStockRequests: StockRequest[] = [
  {
    id: 'sr-001',
    requesterId: 'phm-001',
    requesterName: 'Fatima Ibrahim',
    requesterRole: 'pharmacist',
    requesterDepartment: 'Pharmacy',
    items: [
      {
        inventoryItemId: 'inv-003',
        itemName: 'Metformin 500mg',
        currentStock: 300,
        requestedQuantity: 500,
      },
      {
        inventoryItemId: 'inv-002',
        itemName: 'Amoxicillin 500mg',
        currentStock: 800,
        requestedQuantity: 300,
      },
    ],
    urgency: 'urgent',
    reason: 'Metformin stock is below reorder level (400). Amoxicillin running low with high demand this season.',
    notes: 'Flu season has increased demand for antibiotics significantly.',
    status: 'pending',
    createdAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'sr-002',
    requesterId: 'usr-006',
    requesterName: 'Obioma Eze',
    requesterRole: 'lab_tech',
    requesterDepartment: 'Laboratory',
    items: [
      {
        inventoryItemId: 'inv-007',
        itemName: 'Disposable Syringes 5ml',
        currentStock: 15,
        requestedQuantity: 30,
      },
      {
        inventoryItemId: 'inv-006',
        itemName: 'Surgical Gloves (Medium)',
        currentStock: 25,
        requestedQuantity: 20,
      },
    ],
    urgency: 'normal',
    reason: 'Routine restocking for lab consumables. Syringes below reorder level.',
    status: 'approved',
    createdAt: '2024-02-08T14:30:00Z',
    reviewedAt: '2024-02-09T10:00:00Z',
    reviewedBy: 'usr-admin',
    reviewedByName: 'Dr. Adeyemi',
    reviewerNotes: 'Approved. Procurement initiated.',
  },
  {
    id: 'sr-003',
    requesterId: 'usr-003',
    requesterName: 'Ngozi Obi',
    requesterRole: 'nurse',
    requesterDepartment: 'Nursing',
    urgency: 'normal',
    reason: 'Ward consumables restocking for the month.',
    status: 'partially_approved',
    createdAt: '2024-02-07T11:00:00Z',
    reviewedAt: '2024-02-07T16:00:00Z',
    reviewedBy: 'usr-admin',
    reviewedByName: 'Dr. Adeyemi',
    reviewerNotes: 'Approved cotton wool and bandages. Thermometers on backorder — will fulfill when available.',
    items: [
      {
        inventoryItemId: 'inv-008',
        itemName: 'Cotton Wool',
        currentStock: 40,
        requestedQuantity: 20,
        approvedQuantity: 20,
      },
      {
        inventoryItemId: 'inv-009',
        itemName: 'Bandages (5cm)',
        currentStock: 18,
        requestedQuantity: 24,
        approvedQuantity: 24,
      },
      {
        inventoryItemId: 'inv-014',
        itemName: 'Digital Thermometer',
        currentStock: 15,
        requestedQuantity: 5,
        approvedQuantity: 0,
      },
    ],
  },
  {
    id: 'sr-004',
    requesterId: 'usr-004',
    requesterName: 'Dr. Chukwuemeka Nwosu',
    requesterRole: 'doctor',
    requesterDepartment: 'General Medicine',
    items: [
      {
        inventoryItemId: 'inv-013',
        itemName: 'Blood Pressure Monitor',
        currentStock: 8,
        requestedQuantity: 2,
      },
    ],
    urgency: 'normal',
    reason: 'Consulting room 3 needs a replacement BP monitor. Current one is malfunctioning.',
    status: 'forwarded_to_cmo',
    createdAt: '2024-02-06T10:00:00Z',
    reviewedAt: '2024-02-06T15:00:00Z',
    reviewedBy: 'usr-admin',
    reviewedByName: 'Dr. Adeyemi',
    reviewerNotes: 'Equipment purchase over threshold — forwarding to CMO for approval.',
    forwardedToCmo: true,
    forwardedAt: '2024-02-06T15:00:00Z',
  },
  {
    id: 'sr-005',
    requesterId: 'usr-002',
    requesterName: 'Amina Yusuf',
    requesterRole: 'receptionist',
    requesterDepartment: 'Front Desk',
    items: [
      {
        inventoryItemId: 'inv-012',
        itemName: 'Printer Paper A4',
        currentStock: 12,
        requestedQuantity: 20,
      },
    ],
    urgency: 'urgent',
    reason: 'Printer paper is below reorder level. Registration forms printing is impacted.',
    status: 'rejected',
    createdAt: '2024-02-05T08:00:00Z',
    reviewedAt: '2024-02-05T12:00:00Z',
    reviewedBy: 'usr-admin',
    reviewedByName: 'Dr. Adeyemi',
    reviewerNotes: 'Bulk order was placed last week. Expected delivery tomorrow. No new order needed.',
  },
  {
    id: 'sr-006',
    requesterId: 'phm-001',
    requesterName: 'Fatima Ibrahim',
    requesterRole: 'pharmacist',
    requesterDepartment: 'Pharmacy',
    items: [
      {
        inventoryItemId: 'inv-005',
        itemName: 'Ventolin Inhaler',
        currentStock: 50,
        requestedQuantity: 30,
      },
    ],
    urgency: 'normal',
    reason: 'Preventive restocking ahead of harmattan season.',
    status: 'pending',
    createdAt: '2024-02-11T10:00:00Z',
  },
  {
    id: 'sr-007',
    requesterId: 'usr-003',
    requesterName: 'Ngozi Obi',
    requesterRole: 'nurse',
    requesterDepartment: 'Nursing',
    items: [
      {
        inventoryItemId: 'inv-011',
        itemName: 'Medical Oxygen',
        currentStock: 5,
        requestedQuantity: 10,
      },
    ],
    urgency: 'urgent',
    reason: 'Medical oxygen critically low — below reorder level. Emergency resupply needed.',
    status: 'info_requested',
    createdAt: '2024-02-09T07:00:00Z',
    reviewedAt: '2024-02-09T09:00:00Z',
    reviewedBy: 'usr-admin',
    reviewedByName: 'Dr. Adeyemi',
    reviewerNotes: 'Please confirm: do we need size H or size E cylinders? Also confirm delivery location.',
  },
];

// Helper functions

export const getStockRequests = (filters?: {
  status?: StockRequestStatus | 'all';
  urgency?: StockRequestUrgency | 'all';
  requesterRole?: UserRole | 'all';
}): StockRequest[] => {
  let result = [...mockStockRequests];

  if (filters?.status && filters.status !== 'all') {
    result = result.filter((r) => r.status === filters.status);
  }

  if (filters?.urgency && filters.urgency !== 'all') {
    result = result.filter((r) => r.urgency === filters.urgency);
  }

  if (filters?.requesterRole && filters.requesterRole !== 'all') {
    result = result.filter((r) => r.requesterRole === filters.requesterRole);
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getStockRequestsByRequester = (
  requesterId: string
): StockRequest[] => {
  return mockStockRequests
    .filter((r) => r.requesterId === requesterId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getStockRequestById = (
  id: string
): StockRequest | undefined => {
  return mockStockRequests.find((r) => r.id === id);
};

export const getPendingStockRequests = (): StockRequest[] => {
  return mockStockRequests.filter((r) => r.status === 'pending');
};

export const getUrgentPendingStockRequests = (): StockRequest[] => {
  return mockStockRequests.filter(
    (r) => r.status === 'pending' && r.urgency === 'urgent'
  );
};

export const createStockRequest = (
  data: Omit<StockRequest, 'id' | 'createdAt' | 'status'>
): StockRequest => {
  const request: StockRequest = {
    ...data,
    id: `sr-${String(mockStockRequests.length + 1).padStart(3, '0')}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  mockStockRequests.push(request);
  return request;
};

export const updateStockRequestStatus = (
  id: string,
  status: StockRequestStatus,
  reviewedBy: string,
  reviewedByName: string,
  reviewerNotes?: string,
  approvedQuantities?: Record<string, number>
): StockRequest | undefined => {
  const request = mockStockRequests.find((r) => r.id === id);
  if (!request) return undefined;

  request.status = status;
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = reviewedBy;
  request.reviewedByName = reviewedByName;
  if (reviewerNotes) request.reviewerNotes = reviewerNotes;

  if (status === 'forwarded_to_cmo') {
    request.forwardedToCmo = true;
    request.forwardedAt = new Date().toISOString();
  }

  if (
    approvedQuantities &&
    (status === 'approved' || status === 'partially_approved')
  ) {
    for (const item of request.items) {
      if (approvedQuantities[item.inventoryItemId] !== undefined) {
        item.approvedQuantity = approvedQuantities[item.inventoryItemId];
      } else {
        item.approvedQuantity =
          status === 'approved' ? item.requestedQuantity : 0;
      }
    }
  }

  if (status === 'approved') {
    for (const item of request.items) {
      if (item.approvedQuantity === undefined) {
        item.approvedQuantity = item.requestedQuantity;
      }
    }
  }

  return request;
};
