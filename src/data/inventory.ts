// Mock Inventory Data

import { InventoryItem } from '@/types/billing.types';

export const mockInventory: InventoryItem[] = [
  // Medicines
  {
    id: 'inv-001',
    name: 'Paracetamol 500mg',
    category: 'medicine',
    unit: 'tablets',
    currentStock: 5000,
    reorderLevel: 1000,
    unitCost: 5,
    supplier: 'Emzor Pharmaceuticals',
    expiryDate: '2025-12-31',
    location: 'Pharmacy Store A',
    lastRestocked: '2024-01-15',
  },
  {
    id: 'inv-002',
    name: 'Amoxicillin 500mg',
    category: 'medicine',
    unit: 'capsules',
    currentStock: 800,
    reorderLevel: 500,
    unitCost: 25,
    supplier: 'Fidson Healthcare',
    expiryDate: '2025-06-30',
    location: 'Pharmacy Store A',
    lastRestocked: '2024-01-20',
  },
  {
    id: 'inv-003',
    name: 'Metformin 500mg',
    category: 'medicine',
    unit: 'tablets',
    currentStock: 300,
    reorderLevel: 400,
    unitCost: 15,
    supplier: 'Drugfield Pharmaceuticals',
    expiryDate: '2025-09-30',
    location: 'Pharmacy Store A',
    lastRestocked: '2024-01-10',
  },
  {
    id: 'inv-004',
    name: 'Lisinopril 10mg',
    category: 'medicine',
    unit: 'tablets',
    currentStock: 450,
    reorderLevel: 300,
    unitCost: 30,
    supplier: 'May & Baker Nigeria',
    expiryDate: '2025-08-31',
    location: 'Pharmacy Store A',
    lastRestocked: '2024-01-22',
  },
  {
    id: 'inv-005',
    name: 'Ventolin Inhaler',
    category: 'medicine',
    unit: 'units',
    currentStock: 50,
    reorderLevel: 30,
    unitCost: 2500,
    supplier: 'GlaxoSmithKline',
    expiryDate: '2025-04-30',
    location: 'Pharmacy Store B',
    lastRestocked: '2024-01-25',
  },
  // Consumables
  {
    id: 'inv-006',
    name: 'Surgical Gloves (Medium)',
    category: 'consumable',
    unit: 'boxes (100pcs)',
    currentStock: 25,
    reorderLevel: 20,
    unitCost: 3500,
    supplier: 'MedPlus Nigeria',
    location: 'Store Room 1',
    lastRestocked: '2024-01-18',
  },
  {
    id: 'inv-007',
    name: 'Disposable Syringes 5ml',
    category: 'consumable',
    unit: 'boxes (100pcs)',
    currentStock: 15,
    reorderLevel: 20,
    unitCost: 2800,
    supplier: 'MedPlus Nigeria',
    location: 'Store Room 1',
    lastRestocked: '2024-01-12',
  },
  {
    id: 'inv-008',
    name: 'Cotton Wool',
    category: 'consumable',
    unit: 'rolls (500g)',
    currentStock: 40,
    reorderLevel: 25,
    unitCost: 800,
    supplier: 'HealthPlus Nigeria',
    location: 'Store Room 1',
    lastRestocked: '2024-01-20',
  },
  {
    id: 'inv-009',
    name: 'Bandages (5cm)',
    category: 'consumable',
    unit: 'boxes (12pcs)',
    currentStock: 18,
    reorderLevel: 15,
    unitCost: 1200,
    supplier: 'HealthPlus Nigeria',
    location: 'Store Room 1',
    lastRestocked: '2024-01-22',
  },
  // Utilities
  {
    id: 'inv-010',
    name: 'Diesel',
    category: 'utility',
    unit: 'litres',
    currentStock: 150,
    reorderLevel: 200,
    unitCost: 1200,
    supplier: 'Total Nigeria',
    location: 'Generator Room',
    lastRestocked: '2024-01-28',
  },
  {
    id: 'inv-011',
    name: 'Medical Oxygen',
    category: 'utility',
    unit: 'cylinders',
    currentStock: 5,
    reorderLevel: 8,
    unitCost: 15000,
    supplier: 'BOC Gas Nigeria',
    location: 'Oxygen Store',
    lastRestocked: '2024-01-25',
  },
  {
    id: 'inv-012',
    name: 'Printer Paper A4',
    category: 'utility',
    unit: 'reams',
    currentStock: 12,
    reorderLevel: 20,
    unitCost: 4500,
    supplier: 'Office Mart',
    location: 'Admin Store',
    lastRestocked: '2024-01-15',
  },
  // Equipment
  {
    id: 'inv-013',
    name: 'Blood Pressure Monitor',
    category: 'equipment',
    unit: 'units',
    currentStock: 8,
    reorderLevel: 3,
    unitCost: 25000,
    supplier: 'MedEquip Nigeria',
    location: 'Equipment Store',
    lastRestocked: '2023-12-01',
  },
  {
    id: 'inv-014',
    name: 'Digital Thermometer',
    category: 'equipment',
    unit: 'units',
    currentStock: 15,
    reorderLevel: 5,
    unitCost: 5000,
    supplier: 'MedEquip Nigeria',
    location: 'Equipment Store',
    lastRestocked: '2024-01-10',
  },
];

export const getLowStockItems = (): InventoryItem[] => 
  mockInventory.filter(item => item.currentStock <= item.reorderLevel);

export const getItemsByCategory = (category: InventoryItem['category']): InventoryItem[] => 
  mockInventory.filter(item => item.category === category);

export const getCriticalItems = (): InventoryItem[] =>
  mockInventory.filter(item =>
    ['Diesel', 'Medical Oxygen'].includes(item.name) &&
    item.currentStock <= item.reorderLevel
  );

export const addInventoryItem = (item: Omit<InventoryItem, 'id'>): InventoryItem => {
  const newItem: InventoryItem = {
    ...item,
    id: `inv-${String(mockInventory.length + 1).padStart(3, '0')}`,
  };
  mockInventory.push(newItem);
  return newItem;
};

export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>): void => {
  const index = mockInventory.findIndex(item => item.id === id);
  if (index !== -1) {
    mockInventory[index] = { ...mockInventory[index], ...updates };
  }
};

export const archiveInventoryItem = (id: string): void => {
  const index = mockInventory.findIndex(item => item.id === id);
  if (index !== -1) {
    mockInventory.splice(index, 1);
  }
};
