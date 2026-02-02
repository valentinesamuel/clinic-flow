// Mock Staff Data

import { StaffMember } from '@/types/clinical.types';

export const mockStaff: StaffMember[] = [
  // Doctors
  {
    id: 'usr-004',
    name: 'Dr. Chukwuemeka Nwosu',
    role: 'Doctor',
    department: 'General Practice',
    specialization: 'General Medicine',
    licenseNumber: 'MDCN/2012/34567',
    phone: '+234 807 456 7890',
    email: 'doctor@lifecare.ng',
    shiftStart: '08:00',
    shiftEnd: '17:00',
    isOnDuty: true,
  },
  {
    id: 'doc-002',
    name: 'Dr. Amaka Obi',
    role: 'Doctor',
    department: 'Pediatrics',
    specialization: 'Pediatrics',
    licenseNumber: 'MDCN/2010/22345',
    phone: '+234 814 123 4567',
    email: 'amaka.obi@lifecare.ng',
    shiftStart: '08:00',
    shiftEnd: '17:00',
    isOnDuty: true,
  },
  {
    id: 'doc-003',
    name: 'Dr. Ibrahim Musa',
    role: 'Doctor',
    department: 'Internal Medicine',
    specialization: 'Internal Medicine',
    licenseNumber: 'MDCN/2015/45678',
    phone: '+234 815 234 5678',
    email: 'ibrahim.musa@lifecare.ng',
    shiftStart: '12:00',
    shiftEnd: '20:00',
    isOnDuty: false,
  },
  // Nurses
  {
    id: 'usr-005',
    name: 'Fatima Ibrahim',
    role: 'Nurse',
    department: 'Nursing',
    licenseNumber: 'NMCN/2015/45678',
    phone: '+234 808 567 8901',
    email: 'nurse@lifecare.ng',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    isOnDuty: true,
  },
  {
    id: 'nur-002',
    name: 'Adaeze Okoli',
    role: 'Nurse',
    department: 'Nursing',
    licenseNumber: 'NMCN/2017/56789',
    phone: '+234 816 345 6789',
    email: 'adaeze.okoli@lifecare.ng',
    shiftStart: '15:00',
    shiftEnd: '23:00',
    isOnDuty: false,
  },
  {
    id: 'nur-003',
    name: 'Joseph Okonkwo',
    role: 'Nurse',
    department: 'Nursing',
    licenseNumber: 'NMCN/2018/67890',
    phone: '+234 817 456 7890',
    email: 'joseph.okonkwo@lifecare.ng',
    shiftStart: '23:00',
    shiftEnd: '07:00',
    isOnDuty: false,
  },
  // Receptionists
  {
    id: 'usr-006',
    name: 'Chiamaka Obi',
    role: 'Receptionist',
    department: 'Front Desk',
    phone: '+234 809 678 9012',
    email: 'reception@lifecare.ng',
    shiftStart: '08:00',
    shiftEnd: '16:00',
    isOnDuty: true,
  },
  {
    id: 'rec-002',
    name: 'Yusuf Abubakar',
    role: 'Receptionist',
    department: 'Front Desk',
    phone: '+234 818 567 8901',
    email: 'yusuf.abubakar@lifecare.ng',
    shiftStart: '16:00',
    shiftEnd: '00:00',
    isOnDuty: false,
  },
  // Security
  {
    id: 'sec-001',
    name: 'Musa Danjuma',
    role: 'Security',
    department: 'Security',
    phone: '+234 819 678 9012',
    email: 'security@lifecare.ng',
    shiftStart: '06:00',
    shiftEnd: '18:00',
    isOnDuty: true,
  },
  {
    id: 'sec-002',
    name: 'Emmanuel Okechukwu',
    role: 'Security',
    department: 'Security',
    phone: '+234 820 789 0123',
    email: 'e.okechukwu@lifecare.ng',
    shiftStart: '18:00',
    shiftEnd: '06:00',
    isOnDuty: false,
  },
  // Cleaners
  {
    id: 'cln-001',
    name: 'Grace Adekunle',
    role: 'Cleaner',
    department: 'Housekeeping',
    phone: '+234 821 890 1234',
    email: 'housekeeping@lifecare.ng',
    shiftStart: '06:00',
    shiftEnd: '14:00',
    isOnDuty: true,
  },
];

export const getDoctors = (): StaffMember[] => 
  mockStaff.filter(s => s.role === 'Doctor');

export const getNurses = (): StaffMember[] => 
  mockStaff.filter(s => s.role === 'Nurse');

export const getMedicalStaff = (): StaffMember[] => 
  mockStaff.filter(s => ['Doctor', 'Nurse'].includes(s.role));

export const getNonMedicalStaff = (): StaffMember[] => 
  mockStaff.filter(s => !['Doctor', 'Nurse'].includes(s.role));

export const getOnDutyStaff = (): StaffMember[] => 
  mockStaff.filter(s => s.isOnDuty);

export const getStaffByDepartment = (department: string): StaffMember[] => 
  mockStaff.filter(s => s.department === department);
