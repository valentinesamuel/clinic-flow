// Mock Appointments Data with CRUD Operations

import { Appointment, AppointmentStatus, AppointmentType } from '@/types/clinical.types';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'follow_up',
    status: 'scheduled',
    scheduledDate: today,
    scheduledTime: '09:00',
    duration: 30,
    reasonForVisit: 'Blood pressure follow-up',
    createdAt: '2024-01-28T10:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-002',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    patientMrn: 'LC-2024-0002',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'consultation',
    status: 'checked_in',
    scheduledDate: today,
    scheduledTime: '09:30',
    duration: 45,
    reasonForVisit: 'Diabetes management review',
    createdAt: '2024-01-27T14:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-003',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'consultation',
    status: 'scheduled',
    scheduledDate: today,
    scheduledTime: '10:15',
    duration: 30,
    reasonForVisit: 'General checkup',
    createdAt: '2024-01-29T09:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-004',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'follow_up',
    status: 'scheduled',
    scheduledDate: today,
    scheduledTime: '11:00',
    duration: 30,
    reasonForVisit: 'Arthritis medication review',
    createdAt: '2024-01-25T11:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-005',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    patientMrn: 'LC-2024-0005',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'emergency',
    status: 'in_progress',
    scheduledDate: today,
    scheduledTime: '08:30',
    duration: 60,
    reasonForVisit: 'Severe asthma attack',
    notes: 'Patient arrived with breathing difficulties',
    createdAt: '2024-02-02T08:00:00Z',
    createdBy: 'usr-005',
  },
  {
    id: 'apt-006',
    patientId: 'pat-006',
    patientName: 'Oluwafemi Adesanya',
    patientMrn: 'LC-2024-0006',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'consultation',
    status: 'scheduled',
    scheduledDate: today,
    scheduledTime: '14:00',
    duration: 30,
    reasonForVisit: 'Annual physical examination',
    createdAt: '2024-01-30T16:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-007',
    patientId: 'pat-007',
    patientName: 'Blessing Igwe',
    patientMrn: 'LC-2024-0007',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'consultation',
    status: 'scheduled',
    scheduledDate: today,
    scheduledTime: '14:30',
    duration: 30,
    reasonForVisit: 'Headache and dizziness',
    createdAt: '2024-02-01T10:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-008',
    patientId: 'pat-008',
    patientName: 'Yakubu Abdullahi',
    patientMrn: 'LC-2024-0008',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'follow_up',
    status: 'scheduled',
    scheduledDate: tomorrow,
    scheduledTime: '09:00',
    duration: 30,
    reasonForVisit: 'Cholesterol medication follow-up',
    createdAt: '2024-01-28T15:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-009',
    patientId: 'pat-009',
    patientName: 'Chisom Nnamdi',
    patientMrn: 'LC-2024-0009',
    doctorId: 'doc-002',
    doctorName: 'Dr. Amaka Obi',
    appointmentType: 'consultation',
    status: 'scheduled',
    scheduledDate: tomorrow,
    scheduledTime: '10:00',
    duration: 45,
    reasonForVisit: 'Childhood vaccination',
    createdAt: '2024-02-01T12:00:00Z',
    createdBy: 'usr-006',
  },
  {
    id: 'apt-010',
    patientId: 'pat-010',
    patientName: 'Halima Bello',
    patientMrn: 'LC-2024-0010',
    doctorId: 'usr-004',
    doctorName: 'Dr. Chukwuemeka Nwosu',
    appointmentType: 'consultation',
    status: 'completed',
    scheduledDate: yesterday,
    scheduledTime: '11:00',
    duration: 30,
    reasonForVisit: 'Migraine treatment',
    createdAt: '2024-01-20T10:00:00Z',
    createdBy: 'usr-006',
  },
];

// ID counter for new appointments
let appointmentIdCounter = mockAppointments.length;

// ============ Query Functions ============

export const getTodaysAppointments = (): Appointment[] => 
  mockAppointments.filter(a => a.scheduledDate === today);

export const getAppointmentsByDoctor = (doctorId: string): Appointment[] => 
  mockAppointments.filter(a => a.doctorId === doctorId);

export const getAppointmentsByPatient = (patientId: string): Appointment[] => 
  mockAppointments.filter(a => a.patientId === patientId);

export const getUpcomingAppointments = (): Appointment[] => 
  mockAppointments.filter(a => 
    a.scheduledDate >= today && 
    ['scheduled', 'confirmed'].includes(a.status)
  );

export const getAppointmentsByDateRange = (startDate: string, endDate: string): Appointment[] =>
  mockAppointments.filter(a => 
    a.scheduledDate >= startDate && a.scheduledDate <= endDate
  );

export const getAppointmentsByStatus = (status: AppointmentStatus): Appointment[] =>
  mockAppointments.filter(a => a.status === status);

export const getAppointmentsByDate = (date: string): Appointment[] =>
  mockAppointments.filter(a => a.scheduledDate === date);

export const getAppointmentById = (id: string): Appointment | undefined =>
  mockAppointments.find(a => a.id === id);

// ============ CRUD Operations ============

export interface AppointmentInput {
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  appointmentType: AppointmentType;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  reasonForVisit: string;
  notes?: string;
}

export const createAppointment = (data: AppointmentInput): Appointment => {
  appointmentIdCounter++;
  const newAppointment: Appointment = {
    ...data,
    id: `apt-${String(appointmentIdCounter).padStart(3, '0')}`,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    createdBy: 'current-user', // Would be actual user ID in real app
  };
  mockAppointments.push(newAppointment);
  return newAppointment;
};

export const updateAppointment = (id: string, updates: Partial<Appointment>): Appointment | undefined => {
  const index = mockAppointments.findIndex(a => a.id === id);
  if (index === -1) return undefined;
  
  mockAppointments[index] = {
    ...mockAppointments[index],
    ...updates,
  };
  return mockAppointments[index];
};

export const updateAppointmentStatus = (id: string, status: AppointmentStatus): Appointment | undefined => {
  return updateAppointment(id, { status });
};

export const cancelAppointment = (id: string, reason?: string): Appointment | undefined => {
  return updateAppointment(id, { 
    status: 'cancelled',
    notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
  });
};

export const rescheduleAppointment = (
  id: string, 
  newDate: string, 
  newTime: string
): Appointment | undefined => {
  const appointment = getAppointmentById(id);
  if (!appointment) return undefined;
  
  return updateAppointment(id, {
    scheduledDate: newDate,
    scheduledTime: newTime,
    notes: appointment.notes 
      ? `${appointment.notes}\nRescheduled from ${appointment.scheduledDate} ${appointment.scheduledTime}`
      : `Rescheduled from ${appointment.scheduledDate} ${appointment.scheduledTime}`,
  });
};

export const markNoShow = (id: string): Appointment | undefined => {
  return updateAppointment(id, { status: 'no_show' });
};

export const checkInAppointment = (id: string): Appointment | undefined => {
  return updateAppointment(id, { status: 'checked_in' });
};

// ============ Availability Functions ============

export interface TimeSlot {
  time: string;
  available: boolean;
}

export const getAvailableSlots = (
  doctorId: string, 
  date: string,
  duration: number = 30
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const doctorAppointments = mockAppointments.filter(
    a => a.doctorId === doctorId && 
         a.scheduledDate === date &&
         !['cancelled', 'no_show'].includes(a.status)
  );
  
  const startHour = 8;
  const endHour = 17;
  const breakStart = 13;
  const breakEnd = 14;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      // Skip lunch break
      if (hour >= breakStart && hour < breakEnd) continue;
      
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      
      // Check if slot conflicts with existing appointment
      const hasConflict = doctorAppointments.some(apt => {
        const aptHour = parseInt(apt.scheduledTime.split(':')[0]);
        const aptMinute = parseInt(apt.scheduledTime.split(':')[1]);
        const aptStart = aptHour * 60 + aptMinute;
        const aptEnd = aptStart + apt.duration;
        const slotStart = hour * 60 + minute;
        const slotEnd = slotStart + duration;
        
        return slotStart < aptEnd && slotEnd > aptStart;
      });
      
      slots.push({
        time: timeStr,
        available: !hasConflict,
      });
    }
  }
  
  return slots;
};

export const isSlotAvailable = (
  doctorId: string, 
  date: string, 
  time: string,
  duration: number = 30
): boolean => {
  const slots = getAvailableSlots(doctorId, date, duration);
  const slot = slots.find(s => s.time === time);
  return slot?.available ?? false;
};

export interface DoctorAvailability {
  doctorId: string;
  doctorName: string;
  availableSlots: number;
  nextAvailable?: string;
}

export const getDoctorAvailability = (date: string): DoctorAvailability[] => {
  const doctors = [
    { id: 'usr-004', name: 'Dr. Chukwuemeka Nwosu' },
    { id: 'doc-002', name: 'Dr. Amaka Obi' },
    { id: 'doc-003', name: 'Dr. Ibrahim Musa' },
  ];
  
  return doctors.map(doc => {
    const slots = getAvailableSlots(doc.id, date);
    const availableSlots = slots.filter(s => s.available);
    
    return {
      doctorId: doc.id,
      doctorName: doc.name,
      availableSlots: availableSlots.length,
      nextAvailable: availableSlots[0]?.time,
    };
  });
};
