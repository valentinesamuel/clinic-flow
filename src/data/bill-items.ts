// Service Catalog for Bill Creation

import { ServiceCategory } from '@/types/billing.types';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  defaultPrice: number;
  isActive: boolean;
  description?: string;
  isPremium?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
}

export const CONSULTATION_ITEMS: ServiceItem[] = [
  { id: 'con-001', name: 'General Consultation', category: 'consultation', defaultPrice: 15000, isActive: true },
  { id: 'con-002', name: 'Specialist Consultation', category: 'consultation', defaultPrice: 25000, isActive: true },
  { id: 'con-003', name: 'Emergency Consultation', category: 'consultation', defaultPrice: 30000, isActive: true },
  { id: 'con-004', name: 'Follow-up Consultation', category: 'consultation', defaultPrice: 10000, isActive: true },
  { id: 'con-005', name: 'Pediatric Consultation', category: 'consultation', defaultPrice: 18000, isActive: true },
  { id: 'con-006', name: 'Obstetric Consultation', category: 'consultation', defaultPrice: 20000, isActive: true },
];

export const LAB_ITEMS: ServiceItem[] = [
  { id: 'lab-001', name: 'Full Blood Count (FBC)', category: 'lab', defaultPrice: 5000, isActive: true },
  { id: 'lab-002', name: 'Malaria Parasite (MP)', category: 'lab', defaultPrice: 2500, isActive: true },
  { id: 'lab-003', name: 'Urinalysis', category: 'lab', defaultPrice: 2000, isActive: true },
  { id: 'lab-004', name: 'Liver Function Test (LFT)', category: 'lab', defaultPrice: 10000, isActive: true },
  { id: 'lab-005', name: 'Kidney Function Test (KFT)', category: 'lab', defaultPrice: 10000, isActive: true },
  { id: 'lab-006', name: 'Fasting Blood Sugar (FBS)', category: 'lab', defaultPrice: 3000, isActive: true },
  { id: 'lab-007', name: 'HbA1c', category: 'lab', defaultPrice: 8000, isActive: true },
  { id: 'lab-008', name: 'Lipid Profile', category: 'lab', defaultPrice: 8000, isActive: true },
  { id: 'lab-009', name: 'Widal Test', category: 'lab', defaultPrice: 3500, isActive: true },
  { id: 'lab-010', name: 'HIV Screening', category: 'lab', defaultPrice: 4000, isActive: true },
  { id: 'lab-011', name: 'Hepatitis B Surface Antigen', category: 'lab', defaultPrice: 4500, isActive: true },
  { id: 'lab-012', name: 'Hepatitis C', category: 'lab', defaultPrice: 5000, isActive: true },
  { id: 'lab-013', name: 'Pregnancy Test (Serum)', category: 'lab', defaultPrice: 3000, isActive: true },
  { id: 'lab-014', name: 'Blood Group & Genotype', category: 'lab', defaultPrice: 4000, isActive: true },
  { id: 'lab-015', name: 'X-Ray - Chest', category: 'lab', defaultPrice: 10000, isActive: true },
  { id: 'lab-016', name: 'X-Ray - Limbs', category: 'lab', defaultPrice: 12000, isActive: true },
  { id: 'lab-017', name: 'Ultrasound - Abdominal', category: 'lab', defaultPrice: 15000, isActive: true, isPremium: true },
  { id: 'lab-018', name: 'Ultrasound - Pelvic', category: 'lab', defaultPrice: 15000, isActive: true, isPremium: true },
  { id: 'lab-019', name: 'ECG', category: 'lab', defaultPrice: 8000, isActive: true },
  { id: 'lab-020', name: 'Echocardiography', category: 'lab', defaultPrice: 25000, isActive: true, isPremium: true },
];

export const PHARMACY_ITEMS: ServiceItem[] = [
  { id: 'pha-001', name: 'Paracetamol 500mg x 10', category: 'pharmacy', defaultPrice: 500, isActive: true },
  { id: 'pha-002', name: 'Ibuprofen 400mg x 10', category: 'pharmacy', defaultPrice: 800, isActive: true },
  { id: 'pha-003', name: 'Amoxicillin 500mg x 21', category: 'pharmacy', defaultPrice: 2500, isActive: true },
  { id: 'pha-004', name: 'Ciprofloxacin 500mg x 10', category: 'pharmacy', defaultPrice: 3000, isActive: true },
  { id: 'pha-005', name: 'Metformin 500mg x 30', category: 'pharmacy', defaultPrice: 2000, isActive: true },
  { id: 'pha-006', name: 'Lisinopril 10mg x 30', category: 'pharmacy', defaultPrice: 4500, isActive: true },
  { id: 'pha-007', name: 'Amlodipine 5mg x 30', category: 'pharmacy', defaultPrice: 3500, isActive: true },
  { id: 'pha-008', name: 'Omeprazole 20mg x 14', category: 'pharmacy', defaultPrice: 2000, isActive: true },
  { id: 'pha-009', name: 'Vitamin C 1000mg x 30', category: 'pharmacy', defaultPrice: 1500, isActive: true },
  { id: 'pha-010', name: 'Multivitamins x 30', category: 'pharmacy', defaultPrice: 2500, isActive: true },
  { id: 'pha-011', name: 'Loratadine 10mg x 10', category: 'pharmacy', defaultPrice: 1000, isActive: true },
  { id: 'pha-012', name: 'Artemether/Lumefantrine', category: 'pharmacy', defaultPrice: 3500, isActive: true },
  { id: 'pha-013', name: 'Diclofenac 50mg x 20', category: 'pharmacy', defaultPrice: 1500, isActive: true },
  { id: 'pha-014', name: 'Ventolin Inhaler', category: 'pharmacy', defaultPrice: 4500, isActive: true },
  { id: 'pha-015', name: 'Insulin Mixtard', category: 'pharmacy', defaultPrice: 8000, isActive: true, isRestricted: true, restrictionReason: 'Requires confirmed diabetes diagnosis and HbA1c result' },
];

export const PROCEDURE_ITEMS: ServiceItem[] = [
  { id: 'pro-001', name: 'Wound Dressing - Simple', category: 'procedure', defaultPrice: 3000, isActive: true },
  { id: 'pro-002', name: 'Wound Dressing - Complex', category: 'procedure', defaultPrice: 5000, isActive: true },
  { id: 'pro-003', name: 'Suturing - Minor', category: 'procedure', defaultPrice: 8000, isActive: true },
  { id: 'pro-004', name: 'Suturing - Major', category: 'procedure', defaultPrice: 15000, isActive: true },
  { id: 'pro-005', name: 'IV Cannulation', category: 'procedure', defaultPrice: 2000, isActive: true },
  { id: 'pro-006', name: 'IV Fluid Administration', category: 'procedure', defaultPrice: 3500, isActive: true },
  { id: 'pro-007', name: 'Nebulization', category: 'procedure', defaultPrice: 5000, isActive: true },
  { id: 'pro-008', name: 'Catheterization', category: 'procedure', defaultPrice: 6000, isActive: true },
  { id: 'pro-009', name: 'Incision & Drainage', category: 'procedure', defaultPrice: 15000, isActive: true },
  { id: 'pro-010', name: 'NG Tube Insertion', category: 'procedure', defaultPrice: 5000, isActive: true },
  { id: 'pro-011', name: 'Splinting', category: 'procedure', defaultPrice: 8000, isActive: true },
  { id: 'pro-012', name: 'POP Cast', category: 'procedure', defaultPrice: 15000, isActive: true },
];

export const OTHER_ITEMS: ServiceItem[] = [
  { id: 'oth-001', name: 'Medical Certificate', category: 'other', defaultPrice: 5000, isActive: true },
  { id: 'oth-002', name: 'Medical Report', category: 'other', defaultPrice: 10000, isActive: true },
  { id: 'oth-003', name: 'Fitness Certificate', category: 'other', defaultPrice: 8000, isActive: true },
  { id: 'oth-004', name: 'Admission Fee', category: 'other', defaultPrice: 50000, isActive: true },
  { id: 'oth-005', name: 'Bed Charges (per day)', category: 'other', defaultPrice: 25000, isActive: true },
  { id: 'oth-006', name: 'Private Ward (per day)', category: 'other', defaultPrice: 50000, isActive: true },
];

// All items combined
export const ALL_SERVICE_ITEMS: ServiceItem[] = [
  ...CONSULTATION_ITEMS,
  ...LAB_ITEMS,
  ...PHARMACY_ITEMS,
  ...PROCEDURE_ITEMS,
  ...OTHER_ITEMS,
];

// Get items by category
export function getItemsByCategory(category: ServiceCategory): ServiceItem[] {
  return ALL_SERVICE_ITEMS.filter(item => item.category === category && item.isActive);
}

// Search items
export function searchServiceItems(query: string, category?: ServiceCategory): ServiceItem[] {
  const lowerQuery = query.toLowerCase();
  let items = ALL_SERVICE_ITEMS.filter(item => item.isActive);
  
  if (category) {
    items = items.filter(item => item.category === category);
  }
  
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.id.toLowerCase().includes(lowerQuery)
  );
}

// Get item by ID
export function getServiceItemById(id: string): ServiceItem | undefined {
  return ALL_SERVICE_ITEMS.find(item => item.id === id);
}

// Category labels
export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  consultation: 'Consultation',
  lab: 'Lab & Imaging',
  pharmacy: 'Pharmacy',
  procedure: 'Procedures',
  admission: 'Admission',
  other: 'Other',
};
