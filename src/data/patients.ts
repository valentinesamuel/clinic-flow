// Mock Patients Data - Nigerian names and addresses

import { Patient, PaymentType } from '@/types/patient.types';

export const mockPatients: Patient[] = [
  {
    id: 'pat-001',
    mrn: 'LC-2024-0001',
    firstName: 'Adaora',
    lastName: 'Okafor',
    middleName: 'Chidinma',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    bloodGroup: 'O+',
    maritalStatus: 'married',
    phone: '+234 803 111 2222',
    email: 'adaora.okafor@email.com',
    address: '15 Awolowo Road, Ikoyi',
    state: 'Lagos',
    lga: 'Eti-Osa',
    nationality: 'Nigerian',
    occupation: 'Banker',
    paymentType: 'hmo',
    hmoDetails: {
      providerId: 'hyg-001',
      providerName: 'Hygeia HMO',
      enrollmentId: 'HYG-2024-ABC123',
      planType: 'Gold',
      expiryDate: '2025-12-31',
      copayAmount: 5000,
      isActive: true,
    },
    nextOfKin: {
      name: 'Chinedu Okafor',
      relationship: 'Husband',
      phone: '+234 803 333 4444',
      address: '15 Awolowo Road, Ikoyi, Lagos',
    },
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    isActive: true,
  },
  {
    id: 'pat-002',
    mrn: 'LC-2024-0002',
    firstName: 'Emmanuel',
    lastName: 'Adeleke',
    dateOfBirth: '1978-07-22',
    gender: 'male',
    bloodGroup: 'A+',
    maritalStatus: 'married',
    phone: '+234 805 222 3333',
    address: '42 Ogunlana Drive, Surulere',
    state: 'Lagos',
    lga: 'Surulere',
    nationality: 'Nigerian',
    occupation: 'Engineer',
    paymentType: 'cash',
    nextOfKin: {
      name: 'Folake Adeleke',
      relationship: 'Wife',
      phone: '+234 805 444 5555',
    },
    allergies: [],
    chronicConditions: ['Diabetes Type 2'],
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-01-12T10:30:00Z',
    isActive: true,
  },
  {
    id: 'pat-003',
    mrn: 'LC-2024-0003',
    firstName: 'Fatima',
    lastName: 'Yusuf',
    dateOfBirth: '1992-11-08',
    gender: 'female',
    bloodGroup: 'B+',
    maritalStatus: 'single',
    phone: '+234 806 333 4444',
    address: '8 Gwarimpa Estate',
    state: 'Abuja',
    lga: 'Bwari',
    nationality: 'Nigerian',
    occupation: 'Lawyer',
    paymentType: 'hmo',
    hmoDetails: {
      providerId: 'axa-001',
      providerName: 'AXA Mansard',
      enrollmentId: 'AXA-2024-DEF456',
      planType: 'Premium',
      expiryDate: '2025-06-30',
      copayAmount: 4000,
      isActive: true,
    },
    nextOfKin: {
      name: 'Musa Yusuf',
      relationship: 'Father',
      phone: '+234 806 555 6666',
    },
    allergies: ['Sulfa drugs'],
    chronicConditions: [],
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    isActive: true,
  },
  {
    id: 'pat-004',
    mrn: 'LC-2024-0004',
    firstName: 'Chukwudi',
    lastName: 'Eze',
    dateOfBirth: '1965-02-28',
    gender: 'male',
    bloodGroup: 'O-',
    maritalStatus: 'married',
    phone: '+234 807 444 5555',
    address: '23 Trans-Amadi Road',
    state: 'Rivers',
    lga: 'Port Harcourt',
    nationality: 'Nigerian',
    occupation: 'Retired Teacher',
    paymentType: 'cash',
    nextOfKin: {
      name: 'Ngozi Eze',
      relationship: 'Wife',
      phone: '+234 807 666 7777',
    },
    allergies: [],
    chronicConditions: ['Hypertension', 'Arthritis'],
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    isActive: true,
  },
  {
    id: 'pat-005',
    mrn: 'LC-2024-0005',
    firstName: 'Aisha',
    lastName: 'Mohammed',
    dateOfBirth: '2010-05-12',
    gender: 'female',
    bloodGroup: 'AB+',
    maritalStatus: 'single',
    phone: '+234 808 555 6666',
    address: '5 Maitama Crescent',
    state: 'Abuja',
    lga: 'Municipal',
    nationality: 'Nigerian',
    occupation: 'Student',
    paymentType: 'hmo',
    hmoDetails: {
      providerId: 'rel-001',
      providerName: 'Reliance HMO',
      enrollmentId: 'REL-2024-GHI789',
      planType: 'Family',
      expiryDate: '2025-03-31',
      copayAmount: 2500,
      isActive: true,
    },
    nextOfKin: {
      name: 'Ibrahim Mohammed',
      relationship: 'Father',
      phone: '+234 808 777 8888',
    },
    allergies: ['Peanuts'],
    chronicConditions: ['Asthma'],
    createdAt: '2024-01-20T09:30:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
    isActive: true,
  },
  {
    id: 'pat-006',
    mrn: 'LC-2024-0006',
    firstName: 'Oluwafemi',
    lastName: 'Adesanya',
    dateOfBirth: '1988-09-03',
    gender: 'male',
    bloodGroup: 'A-',
    maritalStatus: 'married',
    phone: '+234 809 666 7777',
    address: '17 Ring Road, GRA',
    state: 'Oyo',
    lga: 'Ibadan North',
    nationality: 'Nigerian',
    occupation: 'Business Owner',
    paymentType: 'corporate',
    nextOfKin: {
      name: 'Titilayo Adesanya',
      relationship: 'Wife',
      phone: '+234 809 888 9999',
    },
    allergies: [],
    chronicConditions: [],
    createdAt: '2024-01-22T15:00:00Z',
    updatedAt: '2024-01-22T15:00:00Z',
    isActive: true,
  },
  {
    id: 'pat-007',
    mrn: 'LC-2024-0007',
    firstName: 'Blessing',
    lastName: 'Igwe',
    dateOfBirth: '1995-12-25',
    gender: 'female',
    bloodGroup: 'B-',
    maritalStatus: 'single',
    phone: '+234 810 777 8888',
    email: 'blessing.igwe@email.com',
    address: '33 Aba Road',
    state: 'Abia',
    lga: 'Aba South',
    nationality: 'Nigerian',
    occupation: 'Nurse',
    paymentType: 'cash',
    nextOfKin: {
      name: 'Peter Igwe',
      relationship: 'Brother',
      phone: '+234 810 999 0000',
    },
    allergies: ['Ibuprofen'],
    chronicConditions: [],
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    isActive: true,
  },
  {
    id: 'pat-008',
    mrn: 'LC-2024-0008',
    firstName: 'Yakubu',
    lastName: 'Abdullahi',
    dateOfBirth: '1970-04-18',
    gender: 'male',
    bloodGroup: 'O+',
    maritalStatus: 'married',
    phone: '+234 811 888 9999',
    address: '12 Ahmadu Bello Way',
    state: 'Kaduna',
    lga: 'Kaduna North',
    nationality: 'Nigerian',
    occupation: 'Civil Servant',
    paymentType: 'hmo',
    hmoDetails: {
      providerId: 'aii-001',
      providerName: 'AIICO Multishield',
      enrollmentId: 'AII-2024-JKL012',
      planType: 'Standard',
      expiryDate: '2025-09-30',
      copayAmount: 3000,
      isActive: true,
    },
    nextOfKin: {
      name: 'Amina Abdullahi',
      relationship: 'Wife',
      phone: '+234 811 000 1111',
    },
    allergies: [],
    chronicConditions: ['High Cholesterol'],
    createdAt: '2024-01-28T13:30:00Z',
    updatedAt: '2024-01-28T13:30:00Z',
    isActive: true,
  },
  {
    id: 'pat-009',
    mrn: 'LC-2024-0009',
    firstName: 'Chisom',
    lastName: 'Nnamdi',
    middleName: 'Obinna',
    dateOfBirth: '2018-08-10',
    gender: 'male',
    bloodGroup: 'A+',
    maritalStatus: 'single',
    phone: '+234 812 999 0000',
    address: '7 New Haven',
    state: 'Enugu',
    lga: 'Enugu East',
    nationality: 'Nigerian',
    paymentType: 'cash',
    nextOfKin: {
      name: 'Obiora Nnamdi',
      relationship: 'Father',
      phone: '+234 812 111 2222',
    },
    allergies: [],
    chronicConditions: [],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
    isActive: true,
  },
  {
    id: 'pat-010',
    mrn: 'LC-2024-0010',
    firstName: 'Halima',
    lastName: 'Bello',
    dateOfBirth: '1982-01-30',
    gender: 'female',
    bloodGroup: 'AB-',
    maritalStatus: 'divorced',
    phone: '+234 813 000 1111',
    address: '45 Sokoto Road',
    state: 'Kano',
    lga: 'Nassarawa',
    nationality: 'Nigerian',
    occupation: 'Trader',
    paymentType: 'cash',
    nextOfKin: {
      name: 'Zainab Bello',
      relationship: 'Sister',
      phone: '+234 813 222 3333',
    },
    allergies: ['Aspirin'],
    chronicConditions: ['Migraine'],
    createdAt: '2024-02-03T11:30:00Z',
    updatedAt: '2024-02-03T11:30:00Z',
    isActive: true,
  },
];

// Counter for generating unique IDs
let patientIdCounter = mockPatients.length;

// Generate new MRN in format LC-YYYY-XXXX
export const generateMRN = (): string => {
  const year = new Date().getFullYear();
  const sequence = String(mockPatients.length + 1).padStart(4, '0');
  return `LC-${year}-${sequence}`;
};

// Get patient by ID
export const getPatientById = (id: string): Patient | undefined => 
  mockPatients.find(p => p.id === id);

// Get patient by MRN
export const getPatientByMrn = (mrn: string): Patient | undefined => 
  mockPatients.find(p => p.mrn === mrn);

// Search patients by name, MRN, or phone
export const searchPatients = (query: string): Patient[] => {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  return mockPatients.filter(p => 
    p.firstName.toLowerCase().includes(lowerQuery) ||
    p.lastName.toLowerCase().includes(lowerQuery) ||
    p.mrn.toLowerCase().includes(lowerQuery) ||
    p.phone.includes(query)
  );
};

// Get all patients
export const getAllPatients = (): Patient[] => [...mockPatients];

// Get patients with pagination
export const getPatientsPaginated = (
  page: number = 1, 
  limit: number = 20, 
  filter?: { paymentType?: PaymentType; search?: string }
): { patients: Patient[]; total: number; totalPages: number } => {
  let filtered = [...mockPatients];
  
  // Apply filters
  if (filter?.paymentType) {
    filtered = filtered.filter(p => p.paymentType === filter.paymentType);
  }
  
  if (filter?.search && filter.search.length >= 2) {
    const lowerQuery = filter.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.mrn.toLowerCase().includes(lowerQuery) ||
      p.phone.includes(filter.search!)
    );
  }
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const patients = filtered.slice(start, start + limit);
  
  return { patients, total, totalPages };
};

// Get patients by payment type
export const getPatientsByPaymentType = (type: PaymentType): Patient[] => 
  mockPatients.filter(p => p.paymentType === type);

// Get recent patients (by creation date)
export const getRecentPatients = (days: number = 7): Patient[] => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return mockPatients.filter(p => new Date(p.createdAt) >= cutoff);
};

// Add a new patient
export const addPatient = (
  patientData: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>
): Patient => {
  patientIdCounter++;
  const now = new Date().toISOString();
  const newPatient: Patient = {
    ...patientData,
    id: `pat-${String(patientIdCounter).padStart(3, '0')}`,
    mrn: generateMRN(),
    createdAt: now,
    updatedAt: now,
  };
  mockPatients.push(newPatient);
  return newPatient;
};

// Update an existing patient
export const updatePatient = (
  id: string, 
  updates: Partial<Omit<Patient, 'id' | 'mrn' | 'createdAt'>>
): Patient | undefined => {
  const index = mockPatients.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  
  mockPatients[index] = {
    ...mockPatients[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockPatients[index];
};

// Delete a patient (soft delete by setting isActive to false)
export const deletePatient = (id: string): boolean => {
  const patient = updatePatient(id, { isActive: false });
  return !!patient;
};

// Check if phone number is unique
export const isPhoneUnique = (phone: string, excludeId?: string): boolean => {
  return !mockPatients.some(p => 
    p.phone === phone && p.id !== excludeId
  );
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
