// Mock Queue Data

import { QueueEntry } from '@/types/patient.types';

export const mockQueueEntries: QueueEntry[] = [
  // Check-in Queue
  {
    id: 'que-001',
    patientId: 'pat-006',
    patientName: 'Oluwafemi Adesanya',
    patientMrn: 'LC-2024-0006',
    queueType: 'check_in',
    priority: 'normal',
    status: 'waiting',
    reasonForVisit: 'Annual physical examination',
    checkInTime: '2024-02-02T13:45:00Z',
    queueNumber: 15,
  },
  {
    id: 'que-002',
    patientId: 'pat-007',
    patientName: 'Blessing Igwe',
    patientMrn: 'LC-2024-0007',
    queueType: 'check_in',
    priority: 'normal',
    status: 'waiting',
    reasonForVisit: 'Headache and dizziness',
    checkInTime: '2024-02-02T14:00:00Z',
    queueNumber: 16,
  },
  // Triage Queue
  {
    id: 'que-003',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    queueType: 'triage',
    priority: 'high',
    status: 'waiting',
    reasonForVisit: 'Blood pressure follow-up',
    checkInTime: '2024-02-02T08:45:00Z',
    queueNumber: 1,
    notes: 'History of hypertension',
  },
  {
    id: 'que-004',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    queueType: 'triage',
    priority: 'normal',
    status: 'in_progress',
    assignedTo: 'usr-005',
    reasonForVisit: 'General checkup',
    checkInTime: '2024-02-02T09:00:00Z',
    startTime: '2024-02-02T09:30:00Z',
    queueNumber: 2,
  },
  {
    id: 'que-005',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    queueType: 'triage',
    priority: 'normal',
    status: 'waiting',
    reasonForVisit: 'Arthritis medication review',
    checkInTime: '2024-02-02T10:30:00Z',
    queueNumber: 3,
  },
  // Doctor Queue
  {
    id: 'que-006',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    patientMrn: 'LC-2024-0002',
    queueType: 'doctor',
    priority: 'normal',
    status: 'waiting',
    assignedTo: 'usr-004',
    reasonForVisit: 'Diabetes management review',
    checkInTime: '2024-02-02T09:15:00Z',
    queueNumber: 1,
  },
  {
    id: 'que-007',
    patientId: 'pat-005',
    patientName: 'Aisha Mohammed',
    patientMrn: 'LC-2024-0005',
    queueType: 'doctor',
    priority: 'emergency',
    status: 'in_progress',
    assignedTo: 'usr-004',
    reasonForVisit: 'Severe asthma attack',
    checkInTime: '2024-02-02T08:30:00Z',
    startTime: '2024-02-02T08:35:00Z',
    queueNumber: 0,
    notes: 'EMERGENCY - Skipped queue',
  },
  // Pharmacy Queue
  {
    id: 'que-008',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    queueType: 'pharmacy',
    priority: 'normal',
    status: 'waiting',
    reasonForVisit: 'Collect medications',
    checkInTime: '2024-02-02T11:00:00Z',
    queueNumber: 5,
  },
  // Lab Queue
  {
    id: 'que-009',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    patientMrn: 'LC-2024-0002',
    queueType: 'lab',
    priority: 'normal',
    status: 'waiting',
    reasonForVisit: 'Blood sugar tests',
    checkInTime: '2024-02-02T10:00:00Z',
    queueNumber: 3,
  },
  // Billing Queue
  {
    id: 'que-010',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    queueType: 'billing',
    priority: 'normal',
    status: 'waiting',
    reasonForVisit: 'Payment for services',
    checkInTime: '2024-02-02T16:00:00Z',
    queueNumber: 8,
  },
];

export const getQueueByType = (type: QueueEntry['queueType']): QueueEntry[] => 
  mockQueueEntries.filter(q => q.queueType === type && q.status !== 'completed');

export const getWaitingCount = (type: QueueEntry['queueType']): number => 
  mockQueueEntries.filter(q => q.queueType === type && q.status === 'waiting').length;

export const getEmergencyQueue = (): QueueEntry[] => 
  mockQueueEntries.filter(q => q.priority === 'emergency' && q.status !== 'completed');

export const getQueueByAssignee = (staffId: string): QueueEntry[] => 
  mockQueueEntries.filter(q => q.assignedTo === staffId);

export const calculateWaitTime = (checkInTime: string): number => {
  const now = new Date();
  const checkIn = new Date(checkInTime);
  return Math.floor((now.getTime() - checkIn.getTime()) / 60000); // minutes
};
