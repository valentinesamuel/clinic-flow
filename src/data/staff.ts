// Mock Staff Data

import { StaffMember } from "@/types/clinical.types";

export const mockStaff: StaffMember[] = [
  // Doctors
  {
    id: "usr-004",
    name: "Dr. Chukwuemeka Nwosu",
    role: "Doctor",
    department: "General Practice",
    specialization: "General Medicine",
    licenseNumber: "MDCN/2012/34567",
    phone: "+234 807 456 7890",
    email: "doctor@deyon.ng",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    isOnDuty: true,
  },
  {
    id: "doc-002",
    name: "Dr. Amaka Obi",
    role: "Doctor",
    department: "Pediatrics",
    specialization: "Pediatrics",
    licenseNumber: "MDCN/2010/22345",
    phone: "+234 814 123 4567",
    email: "amaka.obi@deyon.ng",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    isOnDuty: true,
  },
  {
    id: "doc-003",
    name: "Dr. Ibrahim Musa",
    role: "Doctor",
    department: "Internal Medicine",
    specialization: "Internal Medicine",
    licenseNumber: "MDCN/2015/45678",
    phone: "+234 815 234 5678",
    email: "ibrahim.musa@deyon.ng",
    shiftStart: "12:00",
    shiftEnd: "20:00",
    isOnDuty: false,
  },
  // Nurses
  {
    id: "usr-005",
    name: "Fatima Ibrahim",
    role: "Nurse",
    department: "Nursing",
    licenseNumber: "NMCN/2015/45678",
    phone: "+234 808 567 8901",
    email: "nurse@deyon.ng",
    shiftStart: "07:00",
    shiftEnd: "15:00",
    isOnDuty: true,
  },
  {
    id: "nur-002",
    name: "Adaeze Okoli",
    role: "Nurse",
    department: "Nursing",
    licenseNumber: "NMCN/2017/56789",
    phone: "+234 816 345 6789",
    email: "adaeze.okoli@deyon.ng",
    shiftStart: "15:00",
    shiftEnd: "23:00",
    isOnDuty: false,
  },
  {
    id: "nur-003",
    name: "Joseph Okonkwo",
    role: "Nurse",
    department: "Nursing",
    licenseNumber: "NMCN/2018/67890",
    phone: "+234 817 456 7890",
    email: "joseph.okonkwo@deyon.ng",
    shiftStart: "23:00",
    shiftEnd: "07:00",
    isOnDuty: false,
  },
  // Receptionists
  {
    id: "usr-006",
    name: "Chiamaka Obi",
    role: "Receptionist",
    department: "Front Desk",
    phone: "+234 809 678 9012",
    email: "reception@deyon.ng",
    shiftStart: "08:00",
    shiftEnd: "16:00",
    isOnDuty: true,
  },
  {
    id: "rec-002",
    name: "Yusuf Abubakar",
    role: "Receptionist",
    department: "Front Desk",
    phone: "+234 818 567 8901",
    email: "yusuf.abubakar@deyon.ng",
    shiftStart: "16:00",
    shiftEnd: "00:00",
    isOnDuty: false,
  },
  // Security
  {
    id: "sec-001",
    name: "Musa Danjuma",
    role: "Security",
    department: "Security",
    phone: "+234 819 678 9012",
    email: "security@deyon.ng",
    shiftStart: "06:00",
    shiftEnd: "18:00",
    isOnDuty: true,
  },
  {
    id: "sec-002",
    name: "Emmanuel Okechukwu",
    role: "Security",
    department: "Security",
    phone: "+234 820 789 0123",
    email: "e.okechukwu@deyon.ng",
    shiftStart: "18:00",
    shiftEnd: "06:00",
    isOnDuty: false,
  },
  // Pharmacists
  {
    id: "phm-001",
    name: "Pharm. Oluwaseun Adeyemi",
    role: "Pharmacist",
    department: "Pharmacy",
    specialization: "Clinical Pharmacy",
    licenseNumber: "PCN/2013/12345",
    phone: "+234 822 901 2345",
    email: "pharmacy@deyon.ng",
    shiftStart: "08:00",
    shiftEnd: "16:00",
    isOnDuty: true,
  },
  {
    id: "phm-002",
    name: "Pharm. Ngozi Eze",
    role: "Pharmacist",
    department: "Pharmacy",
    specialization: "Hospital Pharmacy",
    licenseNumber: "PCN/2016/67890",
    phone: "+234 823 012 3456",
    email: "ngozi.eze@deyon.ng",
    shiftStart: "14:00",
    shiftEnd: "22:00",
    isOnDuty: false,
  },
  // Lab Technicians
  {
    id: "lab-t-001",
    name: "Chinedu Okafor",
    role: "Lab Technician",
    department: "Laboratory",
    specialization: "Medical Laboratory Science",
    licenseNumber: "MLSCN/2014/34567",
    phone: "+234 824 123 4567",
    email: "lab@deyon.ng",
    shiftStart: "08:00",
    shiftEnd: "16:00",
    isOnDuty: true,
  },
  // Cleaners
  {
    id: "cln-001",
    name: "Grace Adekunle",
    role: "Cleaner",
    department: "Housekeeping",
    phone: "+234 821 890 1234",
    email: "housekeeping@deyon.ng",
    shiftStart: "06:00",
    shiftEnd: "14:00",
    isOnDuty: true,
  },
];

export const getDoctors = (): StaffMember[] =>
  mockStaff.filter((s) => s.role === "Doctor");

export const getNurses = (): StaffMember[] =>
  mockStaff.filter((s) => s.role === "Nurse");

export const getMedicalStaff = (): StaffMember[] =>
  mockStaff.filter((s) => ["Doctor", "Nurse"].includes(s.role));

export const getNonMedicalStaff = (): StaffMember[] =>
  mockStaff.filter((s) => !["Doctor", "Nurse"].includes(s.role));

export const getOnDutyStaff = (): StaffMember[] =>
  mockStaff.filter((s) => s.isOnDuty);

export const getStaffByDepartment = (department: string): StaffMember[] =>
  mockStaff.filter((s) => s.department === department);

export const getPharmacists = (): StaffMember[] =>
  mockStaff.filter((s) => s.role === "Pharmacist");

export const getLabTechnicians = (): StaffMember[] =>
  mockStaff.filter((s) => s.role === "Lab Technician");

export const getStaffById = (id: string): StaffMember | undefined =>
  mockStaff.find((s) => s.id === id);

export const addStaffMember = (
  staff: Omit<StaffMember, "id">
): StaffMember => {
  const newStaff: StaffMember = {
    ...staff,
    id: `staff-${Date.now()}`,
  };
  mockStaff.push(newStaff);
  return newStaff;
};

export const updateStaffMember = (
  id: string,
  updates: Partial<StaffMember>
): StaffMember | undefined => {
  const index = mockStaff.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  mockStaff[index] = { ...mockStaff[index], ...updates };
  return mockStaff[index];
};

export const archiveStaffMember = (id: string): boolean => {
  const index = mockStaff.findIndex((s) => s.id === id);
  if (index === -1) return false;
  mockStaff.splice(index, 1);
  return true;
};
