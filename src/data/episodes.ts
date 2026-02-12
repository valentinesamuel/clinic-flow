import {
  Episode,
  EpisodeStatus,
  EpisodeTimelineEvent,
} from '@/types/episode.types';

// Mock Episodes Data
export const mockEpisodes: Episode[] = [
  {
    id: 'ep-001',
    episodeNumber: 'EP-2024-0001',
    patientId: 'pat-001',
    patientName: 'Adaora Okafor',
    patientMrn: 'LC-2024-0001',
    status: 'active',
    createdAt: '2024-02-10T09:30:00Z',
    createdBy: 'Dr. Emeka Nwosu',
    expiresAt: '2024-02-17T09:30:00Z',
    billIds: ['bill-001'],
    consultationIds: ['cons-001'],
    labOrderIds: ['lab-001'],
    prescriptionIds: ['presc-001'],
    claimIds: ['clm-001'],
    provisionalDiagnosis: 'Acute Malaria',
    provisionalDiagnosisCode: 'B50.9',
    totalBilled: 45000,
    totalPaid: 0,
    totalBalance: 45000,
    isLockedForAudit: false,
    notes: 'Patient presents with fever and chills. Malaria RDT positive.',
  },
  {
    id: 'ep-002',
    episodeNumber: 'EP-2024-0002',
    patientId: 'pat-003',
    patientName: 'Fatima Yusuf',
    patientMrn: 'LC-2024-0003',
    status: 'pending_results',
    createdAt: '2024-02-09T14:15:00Z',
    createdBy: 'Dr. Chioma Adebayo',
    expiresAt: '2024-02-16T14:15:00Z',
    billIds: ['bill-003'],
    consultationIds: ['cons-002'],
    labOrderIds: ['lab-002', 'lab-003'],
    prescriptionIds: [],
    claimIds: [],
    provisionalDiagnosis: 'Suspected Typhoid Fever',
    provisionalDiagnosisCode: 'A01.0',
    totalBilled: 68500,
    totalPaid: 20000,
    totalBalance: 48500,
    isLockedForAudit: false,
    notes: 'Awaiting Widal test and blood culture results. Patient advised to return for follow-up.',
  },
  {
    id: 'ep-003',
    episodeNumber: 'EP-2024-0003',
    patientId: 'pat-004',
    patientName: 'Chukwudi Eze',
    patientMrn: 'LC-2024-0004',
    status: 'follow_up',
    createdAt: '2024-02-05T11:00:00Z',
    createdBy: 'Dr. Emeka Nwosu',
    expiresAt: '2024-02-12T11:00:00Z',
    billIds: ['bill-004'],
    consultationIds: ['cons-003', 'cons-004'],
    labOrderIds: ['lab-004'],
    prescriptionIds: ['presc-002'],
    claimIds: [],
    provisionalDiagnosis: 'Hypertension',
    provisionalDiagnosisCode: 'I10',
    finalDiagnosis: 'Essential (Primary) Hypertension',
    finalDiagnosisCode: 'I10',
    followUpScheduled: true,
    followUpDate: '2024-02-19T10:00:00Z',
    followUpUsed: false,
    totalBilled: 52000,
    totalPaid: 52000,
    totalBalance: 0,
    isLockedForAudit: false,
    notes: 'Patient on Amlodipine 5mg daily. Follow-up scheduled to monitor blood pressure control.',
  },
  {
    id: 'ep-004',
    episodeNumber: 'EP-2024-0004',
    patientId: 'pat-002',
    patientName: 'Emmanuel Adeleke',
    patientMrn: 'LC-2024-0002',
    status: 'completed',
    createdAt: '2024-01-28T10:45:00Z',
    createdBy: 'Dr. Chioma Adebayo',
    expiresAt: '2024-02-04T10:45:00Z',
    completedAt: '2024-02-03T16:30:00Z',
    billIds: ['bill-002'],
    consultationIds: ['cons-005', 'cons-006'],
    labOrderIds: ['lab-005', 'lab-006'],
    prescriptionIds: ['presc-003', 'presc-004'],
    claimIds: ['clm-002'],
    provisionalDiagnosis: 'Acute Gastroenteritis',
    provisionalDiagnosisCode: 'A09',
    finalDiagnosis: 'Acute Gastroenteritis',
    finalDiagnosisCode: 'A09',
    followUpScheduled: false,
    totalBilled: 89750,
    totalPaid: 89750,
    totalBalance: 0,
    isLockedForAudit: true,
    notes: 'Episode completed. Patient recovered fully. All bills settled and claim processed. Locked for audit review.',
  },
  {
    id: 'ep-005',
    episodeNumber: 'EP-2024-0005',
    patientId: 'pat-006',
    patientName: 'Nkechi Onyekachi',
    patientMrn: 'LC-2024-0006',
    status: 'auto_completed',
    createdAt: '2024-01-25T13:20:00Z',
    createdBy: 'Dr. Emeka Nwosu',
    expiresAt: '2024-02-01T13:20:00Z',
    completedAt: '2024-02-01T13:20:00Z',
    autoCompletedReason: 'Episode automatically completed after 7 days without activity',
    billIds: ['bill-006'],
    consultationIds: ['cons-007'],
    labOrderIds: [],
    prescriptionIds: ['presc-005'],
    claimIds: [],
    provisionalDiagnosis: 'Upper Respiratory Tract Infection',
    provisionalDiagnosisCode: 'J06.9',
    finalDiagnosis: 'Acute Upper Respiratory Infection, Unspecified',
    finalDiagnosisCode: 'J06.9',
    followUpScheduled: false,
    totalBilled: 28500,
    totalPaid: 28500,
    totalBalance: 0,
    isLockedForAudit: false,
    notes: 'Auto-completed after expiry period. Patient did not return for follow-up. Treatment course completed.',
  },
];

// Mock Episode Timeline Events
export const mockEpisodeTimeline: EpisodeTimelineEvent[] = [
  // Timeline for ep-001 (Active)
  {
    id: 'evt-001',
    episodeId: 'ep-001',
    timestamp: '2024-02-10T09:30:00Z',
    eventType: 'created',
    description: 'Episode created',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
  },
  {
    id: 'evt-002',
    episodeId: 'ep-001',
    timestamp: '2024-02-10T09:35:00Z',
    eventType: 'consultation',
    description: 'Initial consultation completed',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'cons-001',
    linkedEntityType: 'consultation',
  },
  {
    id: 'evt-003',
    episodeId: 'ep-001',
    timestamp: '2024-02-10T09:45:00Z',
    eventType: 'lab_ordered',
    description: 'Malaria RDT ordered',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'lab-001',
    linkedEntityType: 'lab_order',
  },
  {
    id: 'evt-004',
    episodeId: 'ep-001',
    timestamp: '2024-02-10T10:00:00Z',
    eventType: 'prescription',
    description: 'Prescription issued for Artemether-Lumefantrine',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'presc-001',
    linkedEntityType: 'prescription',
  },
  {
    id: 'evt-005',
    episodeId: 'ep-001',
    timestamp: '2024-02-10T10:15:00Z',
    eventType: 'bill_created',
    description: 'Bill created for consultation and lab tests',
    actorName: 'Ngozi Okonkwo',
    actorRole: 'Billing Officer',
    linkedEntityId: 'bill-001',
    linkedEntityType: 'bill',
  },

  // Timeline for ep-002 (Pending Results)
  {
    id: 'evt-006',
    episodeId: 'ep-002',
    timestamp: '2024-02-09T14:15:00Z',
    eventType: 'created',
    description: 'Episode created',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
  },
  {
    id: 'evt-007',
    episodeId: 'ep-002',
    timestamp: '2024-02-09T14:20:00Z',
    eventType: 'consultation',
    description: 'Initial consultation completed',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
    linkedEntityId: 'cons-002',
    linkedEntityType: 'consultation',
  },
  {
    id: 'evt-008',
    episodeId: 'ep-002',
    timestamp: '2024-02-09T14:30:00Z',
    eventType: 'lab_ordered',
    description: 'Widal test and blood culture ordered',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
    linkedEntityId: 'lab-002',
    linkedEntityType: 'lab_order',
  },
  {
    id: 'evt-009',
    episodeId: 'ep-002',
    timestamp: '2024-02-09T14:45:00Z',
    eventType: 'bill_created',
    description: 'Bill created for consultation and lab tests',
    actorName: 'Ngozi Okonkwo',
    actorRole: 'Billing Officer',
    linkedEntityId: 'bill-003',
    linkedEntityType: 'bill',
  },
  {
    id: 'evt-010',
    episodeId: 'ep-002',
    timestamp: '2024-02-09T15:00:00Z',
    eventType: 'bill_updated',
    description: 'Partial payment of ₦20,000 received',
    actorName: 'Ngozi Okonkwo',
    actorRole: 'Billing Officer',
    linkedEntityId: 'bill-003',
    linkedEntityType: 'bill',
  },

  // Timeline for ep-003 (Follow-up)
  {
    id: 'evt-011',
    episodeId: 'ep-003',
    timestamp: '2024-02-05T11:00:00Z',
    eventType: 'created',
    description: 'Episode created',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
  },
  {
    id: 'evt-012',
    episodeId: 'ep-003',
    timestamp: '2024-02-05T11:05:00Z',
    eventType: 'consultation',
    description: 'Initial consultation for hypertension',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'cons-003',
    linkedEntityType: 'consultation',
  },
  {
    id: 'evt-013',
    episodeId: 'ep-003',
    timestamp: '2024-02-05T11:20:00Z',
    eventType: 'lab_ordered',
    description: 'Basic metabolic panel ordered',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'lab-004',
    linkedEntityType: 'lab_order',
  },
  {
    id: 'evt-014',
    episodeId: 'ep-003',
    timestamp: '2024-02-05T11:30:00Z',
    eventType: 'prescription',
    description: 'Amlodipine 5mg daily prescribed',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'presc-002',
    linkedEntityType: 'prescription',
  },
  {
    id: 'evt-015',
    episodeId: 'ep-003',
    timestamp: '2024-02-05T12:00:00Z',
    eventType: 'bill_created',
    description: 'Bill created and paid in full',
    actorName: 'Ngozi Okonkwo',
    actorRole: 'Billing Officer',
    linkedEntityId: 'bill-004',
    linkedEntityType: 'bill',
  },
  {
    id: 'evt-016',
    episodeId: 'ep-003',
    timestamp: '2024-02-07T10:00:00Z',
    eventType: 'follow_up',
    description: 'Follow-up appointment scheduled for Feb 19, 2024',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
  },

  // Timeline for ep-004 (Completed)
  {
    id: 'evt-017',
    episodeId: 'ep-004',
    timestamp: '2024-01-28T10:45:00Z',
    eventType: 'created',
    description: 'Episode created',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
  },
  {
    id: 'evt-018',
    episodeId: 'ep-004',
    timestamp: '2024-01-28T10:50:00Z',
    eventType: 'consultation',
    description: 'Initial consultation for gastroenteritis',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
    linkedEntityId: 'cons-005',
    linkedEntityType: 'consultation',
  },
  {
    id: 'evt-019',
    episodeId: 'ep-004',
    timestamp: '2024-01-28T11:00:00Z',
    eventType: 'lab_ordered',
    description: 'Stool analysis and complete blood count ordered',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
    linkedEntityId: 'lab-005',
    linkedEntityType: 'lab_order',
  },
  {
    id: 'evt-020',
    episodeId: 'ep-004',
    timestamp: '2024-01-28T11:15:00Z',
    eventType: 'prescription',
    description: 'ORS and Ciprofloxacin prescribed',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
    linkedEntityId: 'presc-003',
    linkedEntityType: 'prescription',
  },
  {
    id: 'evt-021',
    episodeId: 'ep-004',
    timestamp: '2024-01-30T09:30:00Z',
    eventType: 'lab_results',
    description: 'Lab results received - no parasites detected',
    actorName: 'Lab Technician',
    actorRole: 'Laboratory',
    linkedEntityId: 'lab-005',
    linkedEntityType: 'lab_order',
  },
  {
    id: 'evt-022',
    episodeId: 'ep-004',
    timestamp: '2024-02-01T14:00:00Z',
    eventType: 'consultation',
    description: 'Follow-up consultation - patient improving',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
    linkedEntityId: 'cons-006',
    linkedEntityType: 'consultation',
  },
  {
    id: 'evt-023',
    episodeId: 'ep-004',
    timestamp: '2024-02-03T16:30:00Z',
    eventType: 'completed',
    description: 'Episode completed - patient fully recovered',
    actorName: 'Dr. Chioma Adebayo',
    actorRole: 'Physician',
  },

  // Timeline for ep-005 (Auto-completed)
  {
    id: 'evt-024',
    episodeId: 'ep-005',
    timestamp: '2024-01-25T13:20:00Z',
    eventType: 'created',
    description: 'Episode created',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
  },
  {
    id: 'evt-025',
    episodeId: 'ep-005',
    timestamp: '2024-01-25T13:25:00Z',
    eventType: 'consultation',
    description: 'Initial consultation for URTI',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'cons-007',
    linkedEntityType: 'consultation',
  },
  {
    id: 'evt-026',
    episodeId: 'ep-005',
    timestamp: '2024-01-25T13:35:00Z',
    eventType: 'prescription',
    description: 'Amoxicillin and cough syrup prescribed',
    actorName: 'Dr. Emeka Nwosu',
    actorRole: 'Physician',
    linkedEntityId: 'presc-005',
    linkedEntityType: 'prescription',
  },
  {
    id: 'evt-027',
    episodeId: 'ep-005',
    timestamp: '2024-01-25T14:00:00Z',
    eventType: 'bill_created',
    description: 'Bill created and paid in full',
    actorName: 'Ngozi Okonkwo',
    actorRole: 'Billing Officer',
    linkedEntityId: 'bill-006',
    linkedEntityType: 'bill',
  },
  {
    id: 'evt-028',
    episodeId: 'ep-005',
    timestamp: '2024-02-01T13:20:00Z',
    eventType: 'auto_completed',
    description: 'Episode auto-completed after 7 days',
    actorName: 'System',
    actorRole: 'Automated',
  },
];

// Helper Functions

/**
 * Get episode by ID
 */
export const getEpisodeById = (id: string): Episode | undefined => {
  return mockEpisodes.find((episode) => episode.id === id);
};

/**
 * Get active episode for a specific patient
 */
export const getActiveEpisodeForPatient = (
  patientId: string
): Episode | undefined => {
  return mockEpisodes.find(
    (episode) =>
      episode.patientId === patientId &&
      (episode.status === 'active' ||
        episode.status === 'pending_results' ||
        episode.status === 'follow_up')
  );
};

/**
 * Get paginated episodes with optional filters
 */
export const getEpisodesPaginated = (
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: EpisodeStatus;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): {
  data: Episode[];
  total: number;
  totalPages: number;
  currentPage: number;
} => {
  let filteredEpisodes = [...mockEpisodes];

  // Apply status filter
  if (filters?.status) {
    filteredEpisodes = filteredEpisodes.filter(
      (episode) => episode.status === filters.status
    );
  }

  // Apply search filter (searches episode number, patient name, and MRN)
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredEpisodes = filteredEpisodes.filter(
      (episode) =>
        episode.episodeNumber.toLowerCase().includes(searchLower) ||
        episode.patientName.toLowerCase().includes(searchLower) ||
        episode.patientMrn.toLowerCase().includes(searchLower) ||
        episode.provisionalDiagnosis?.toLowerCase().includes(searchLower) ||
        episode.finalDiagnosis?.toLowerCase().includes(searchLower)
    );
  }

  // Apply date range filters
  if (filters?.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filteredEpisodes = filteredEpisodes.filter(
      (episode) => new Date(episode.createdAt) >= fromDate
    );
  }

  if (filters?.dateTo) {
    const toDate = new Date(filters.dateTo);
    filteredEpisodes = filteredEpisodes.filter(
      (episode) => new Date(episode.createdAt) <= toDate
    );
  }

  // Sort by creation date (most recent first)
  filteredEpisodes.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = filteredEpisodes.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = filteredEpisodes.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total,
    totalPages,
    currentPage: page,
  };
};

/**
 * Get timeline events for a specific episode
 */
export const getTimelineForEpisode = (
  episodeId: string
): EpisodeTimelineEvent[] => {
  return mockEpisodeTimeline
    .filter((event) => event.episodeId === episodeId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

/**
 * Get all episodes for a specific patient
 */
export const getEpisodesByPatientId = (patientId: string): Episode[] => {
  return mockEpisodes
    .filter((episode) => episode.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * Get episodes by status
 */
export const getEpisodesByStatus = (status: EpisodeStatus): Episode[] => {
  return mockEpisodes
    .filter((episode) => episode.status === status)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * Get episodes expiring soon (within specified days)
 */
export const getExpiringEpisodes = (withinDays: number = 2): Episode[] => {
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(now.getDate() + withinDays);

  return mockEpisodes
    .filter((episode) => {
      const expiresAt = new Date(episode.expiresAt);
      return (
        (episode.status === 'active' ||
          episode.status === 'pending_results' ||
          episode.status === 'follow_up') &&
        expiresAt > now &&
        expiresAt <= thresholdDate
      );
    })
    .sort(
      (a, b) =>
        new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    );
};

/**
 * Get episodes with outstanding balance
 */
export const getEpisodesWithBalance = (): Episode[] => {
  return mockEpisodes
    .filter((episode) => episode.totalBalance > 0)
    .sort((a, b) => b.totalBalance - a.totalBalance);
};

/**
 * Get episode statistics
 */
export const getEpisodeStats = (): {
  total: number;
  active: number;
  pendingResults: number;
  followUp: number;
  completed: number;
  autoCompleted: number;
  totalBilled: number;
  totalPaid: number;
  totalBalance: number;
} => {
  const stats = {
    total: mockEpisodes.length,
    active: 0,
    pendingResults: 0,
    followUp: 0,
    completed: 0,
    autoCompleted: 0,
    totalBilled: 0,
    totalPaid: 0,
    totalBalance: 0,
  };

  mockEpisodes.forEach((episode) => {
    switch (episode.status) {
      case 'active':
        stats.active++;
        break;
      case 'pending_results':
        stats.pendingResults++;
        break;
      case 'follow_up':
        stats.followUp++;
        break;
      case 'completed':
        stats.completed++;
        break;
      case 'auto_completed':
        stats.autoCompleted++;
        break;
    }

    stats.totalBilled += episode.totalBilled;
    stats.totalPaid += episode.totalPaid;
    stats.totalBalance += episode.totalBalance;
  });

  return stats;
};
