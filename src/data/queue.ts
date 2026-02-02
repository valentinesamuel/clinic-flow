// Mock Queue Data with Queue Management Functions

import { QueueEntry, QueueType, QueueStatus, QueuePriority } from '@/types/patient.types';

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

// ID counter for new queue entries
let queueIdCounter = mockQueueEntries.length;
let queueNumberCounters: Record<QueueType, number> = {
  check_in: 20,
  triage: 10,
  doctor: 5,
  pharmacy: 10,
  lab: 5,
  billing: 10,
};

// ============ Query Functions ============

export const getQueueByType = (type: QueueType): QueueEntry[] => 
  mockQueueEntries
    .filter(q => q.queueType === type && q.status !== 'completed' && q.status !== 'cancelled')
    .sort((a, b) => {
      // Emergency first, then by check-in time
      if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
      if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
      if (a.priority === 'high' && b.priority === 'normal') return -1;
      if (b.priority === 'high' && a.priority === 'normal') return 1;
      return new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime();
    });

export const getWaitingCount = (type: QueueType): number => 
  mockQueueEntries.filter(q => q.queueType === type && q.status === 'waiting').length;

export const getEmergencyQueue = (): QueueEntry[] => 
  mockQueueEntries.filter(q => q.priority === 'emergency' && q.status !== 'completed');

export const getQueueByAssignee = (staffId: string): QueueEntry[] => 
  mockQueueEntries.filter(q => q.assignedTo === staffId && q.status !== 'completed');

export const getQueueEntryById = (id: string): QueueEntry | undefined =>
  mockQueueEntries.find(q => q.id === id);

export const getPatientCurrentQueue = (patientId: string): QueueEntry | undefined =>
  mockQueueEntries.find(q => 
    q.patientId === patientId && 
    ['waiting', 'in_progress'].includes(q.status)
  );

export const calculateWaitTime = (checkInTime: string): number => {
  const now = new Date();
  const checkIn = new Date(checkInTime);
  return Math.floor((now.getTime() - checkIn.getTime()) / 60000); // minutes
};

// ============ Queue Management Functions ============

export interface QueueInput {
  patientId: string;
  patientName: string;
  patientMrn: string;
  queueType: QueueType;
  priority?: QueuePriority;
  reasonForVisit: string;
  assignedTo?: string;
  notes?: string;
}

export const addToQueue = (data: QueueInput): QueueEntry => {
  queueIdCounter++;
  queueNumberCounters[data.queueType]++;
  
  const newEntry: QueueEntry = {
    id: `que-${String(queueIdCounter).padStart(3, '0')}`,
    patientId: data.patientId,
    patientName: data.patientName,
    patientMrn: data.patientMrn,
    queueType: data.queueType,
    priority: data.priority || 'normal',
    status: 'waiting',
    assignedTo: data.assignedTo,
    reasonForVisit: data.reasonForVisit,
    checkInTime: new Date().toISOString(),
    queueNumber: queueNumberCounters[data.queueType],
    notes: data.notes,
  };
  
  mockQueueEntries.push(newEntry);
  return newEntry;
};

export const updateQueueEntry = (id: string, updates: Partial<QueueEntry>): QueueEntry | undefined => {
  const index = mockQueueEntries.findIndex(q => q.id === id);
  if (index === -1) return undefined;
  
  mockQueueEntries[index] = {
    ...mockQueueEntries[index],
    ...updates,
  };
  return mockQueueEntries[index];
};

export const startQueueEntry = (id: string, staffId?: string): QueueEntry | undefined => {
  return updateQueueEntry(id, {
    status: 'in_progress',
    startTime: new Date().toISOString(),
    assignedTo: staffId,
  });
};

export const completeQueueEntry = (id: string): QueueEntry | undefined => {
  return updateQueueEntry(id, {
    status: 'completed',
    endTime: new Date().toISOString(),
  });
};

export const cancelQueueEntry = (id: string): QueueEntry | undefined => {
  return updateQueueEntry(id, { status: 'cancelled' });
};

export const markNoShowQueue = (id: string): QueueEntry | undefined => {
  return updateQueueEntry(id, { status: 'no_show' });
};

export const moveToNextQueue = (id: string, targetQueue: QueueType, assignedTo?: string): QueueEntry | undefined => {
  const currentEntry = getQueueEntryById(id);
  if (!currentEntry) return undefined;
  
  // Complete current entry
  completeQueueEntry(id);
  
  // Create new entry in target queue
  return addToQueue({
    patientId: currentEntry.patientId,
    patientName: currentEntry.patientName,
    patientMrn: currentEntry.patientMrn,
    queueType: targetQueue,
    priority: currentEntry.priority,
    reasonForVisit: currentEntry.reasonForVisit,
    assignedTo,
    notes: currentEntry.notes,
  });
};

export const transferQueue = (id: string, newAssignee: string): QueueEntry | undefined => {
  return updateQueueEntry(id, { assignedTo: newAssignee });
};

export const updatePriority = (id: string, priority: QueuePriority, notes?: string): QueueEntry | undefined => {
  const entry = getQueueEntryById(id);
  if (!entry) return undefined;
  
  return updateQueueEntry(id, {
    priority,
    notes: notes ? `${entry.notes ? entry.notes + '\n' : ''}Priority: ${notes}` : entry.notes,
  });
};

// ============ Statistics Functions ============

export interface QueueStats {
  waiting: number;
  inProgress: number;
  completed: number;
  avgWaitTime: number;
  emergencyCount: number;
}

export const getQueueStats = (queueType: QueueType): QueueStats => {
  const entries = mockQueueEntries.filter(q => q.queueType === queueType);
  
  const waiting = entries.filter(e => e.status === 'waiting').length;
  const inProgress = entries.filter(e => e.status === 'in_progress').length;
  const completed = entries.filter(e => e.status === 'completed').length;
  const emergencyCount = entries.filter(e => e.priority === 'emergency' && e.status !== 'completed').length;
  
  // Calculate average wait time for waiting patients
  const waitingEntries = entries.filter(e => e.status === 'waiting');
  const avgWaitTime = waitingEntries.length > 0
    ? Math.round(waitingEntries.reduce((sum, e) => sum + calculateWaitTime(e.checkInTime), 0) / waitingEntries.length)
    : 0;
  
  return { waiting, inProgress, completed, avgWaitTime, emergencyCount };
};

export const getAverageWaitTime = (queueType: QueueType): number => {
  const entries = mockQueueEntries.filter(q => q.queueType === queueType && q.status === 'waiting');
  if (entries.length === 0) return 0;
  
  const totalWait = entries.reduce((sum, e) => sum + calculateWaitTime(e.checkInTime), 0);
  return Math.round(totalWait / entries.length);
};

export const getQueuePosition = (id: string): number => {
  const entry = getQueueEntryById(id);
  if (!entry) return -1;
  
  const queue = getQueueByType(entry.queueType);
  const waitingQueue = queue.filter(e => e.status === 'waiting');
  const position = waitingQueue.findIndex(e => e.id === id);
  
  return position === -1 ? -1 : position + 1;
};

export const getAllQueueStats = (): Record<QueueType, QueueStats> => {
  const types: QueueType[] = ['check_in', 'triage', 'doctor', 'pharmacy', 'lab', 'billing'];
  const result: Partial<Record<QueueType, QueueStats>> = {};
  
  types.forEach(type => {
    result[type] = getQueueStats(type);
  });
  
  return result as Record<QueueType, QueueStats>;
};
