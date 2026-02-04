import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { QueueEntry, QueueType, QueueStats, QueueFilters, QueueSortOption, QUEUE_CONFIGS } from '@/types/queue.types';
import { mockQueueEntries, calculateWaitTime } from '@/data/queue';

interface QueueState {
  entries: QueueEntry[];
  lastUpdated: Date;
}

interface QueueContextType {
  // State
  queues: Record<QueueType, QueueEntry[]>;
  isLoading: boolean;
  lastUpdated: Date | null;

  // Query functions
  getQueueByType: (type: QueueType) => QueueEntry[];
  getQueueStats: (type: QueueType) => QueueStats;
  getEntryById: (id: string) => QueueEntry | undefined;
  getPatientInQueue: (patientId: string) => QueueEntry | undefined;

  // Mutation functions
  addToQueue: (entry: Omit<QueueEntry, 'id' | 'joinedAt' | 'queueNumber' | 'waitTimeMinutes'>) => QueueEntry;
  removeFromQueue: (entryId: string) => void;
  updateEntry: (entryId: string, updates: Partial<QueueEntry>) => QueueEntry | undefined;
  callPatient: (entryId: string, staffId: string, staffName: string) => QueueEntry | undefined;
  completeEntry: (entryId: string) => QueueEntry | undefined;
  pauseEntry: (entryId: string, reason: QueueEntry['pauseReason'], otherReason?: string) => QueueEntry | undefined;
  resumeEntry: (entryId: string, targetQueue: QueueType) => QueueEntry | undefined;
  markNoShow: (entryId: string) => QueueEntry | undefined;
  moveToQueue: (entryId: string, targetQueue: QueueType, assignedTo?: string) => QueueEntry | undefined;

  // Refresh
  refreshQueues: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Generate unique ID
const generateId = (): string => `que-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Queue number counters
const queueNumberCounters: Record<QueueType, number> = {
  triage: 100,
  doctor_new: 200,
  doctor_review: 300,
  lab: 400,
  pharmacy: 500,
};

interface QueueProviderProps {
  children: ReactNode;
}

export function QueueProvider({ children }: QueueProviderProps) {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialize from mock data
  useEffect(() => {
    // Map old queue type to new queue type
    const mapQueueType = (oldType: string): QueueType => {
      switch (oldType) {
        case 'check_in': return 'triage';
        case 'doctor': return 'doctor_new';
        case 'triage': return 'triage';
        case 'lab': return 'lab';
        case 'pharmacy': return 'pharmacy';
        case 'billing': return 'pharmacy'; // Map billing to pharmacy for now
        default: return 'triage';
      }
    };

    // Map old status to new status
    const mapStatus = (oldStatus: string): QueueEntry['status'] => {
      switch (oldStatus) {
        case 'waiting': return 'waiting';
        case 'in_progress': return 'in_progress';
        case 'completed': return 'completed';
        case 'cancelled': return 'cancelled';
        case 'no_show': return 'no_show';
        default: return 'waiting';
      }
    };

    // Convert old queue entries to new format
    const convertedEntries: QueueEntry[] = mockQueueEntries.map((entry) => ({
      id: entry.id,
      patientId: entry.patientId,
      patientName: entry.patientName,
      patientMrn: entry.patientMrn,
      queueType: mapQueueType(entry.queueType),
      status: mapStatus(entry.status),
      priority: entry.priority,
      joinedAt: entry.checkInTime,
      calledAt: entry.startTime,
      completedAt: entry.endTime,
      waitTimeMinutes: calculateWaitTime(entry.checkInTime),
      paymentStatus: 'cleared' as const,
      assignedTo: entry.assignedTo,
      chiefComplaint: entry.reasonForVisit,
      notes: entry.notes,
      queueNumber: entry.queueNumber,
    }));
    
    setEntries(convertedEntries);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  // Auto-update wait times every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEntries((prev) =>
        prev.map((entry) => ({
          ...entry,
          waitTimeMinutes: calculateWaitTime(entry.joinedAt),
        }))
      );
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get queues organized by type
  const queues = React.useMemo(() => {
    const queueTypes: QueueType[] = ['triage', 'doctor_new', 'doctor_review', 'lab', 'pharmacy'];
    const result: Record<QueueType, QueueEntry[]> = {
      triage: [],
      doctor_new: [],
      doctor_review: [],
      lab: [],
      pharmacy: [],
    };

    entries.forEach((entry) => {
      if (queueTypes.includes(entry.queueType) && entry.status !== 'completed' && entry.status !== 'no_show') {
        result[entry.queueType].push(entry);
      }
    });

    // Sort each queue by priority and wait time
    queueTypes.forEach((type) => {
      result[type].sort((a, b) => {
        // Emergency first
        if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
        if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
        // High priority second
        if (a.priority === 'high' && b.priority === 'normal') return -1;
        if (b.priority === 'high' && a.priority === 'normal') return 1;
        // Then by wait time (longest first)
        return b.waitTimeMinutes - a.waitTimeMinutes;
      });
    });

    return result;
  }, [entries]);

  const getQueueByType = useCallback(
    (type: QueueType): QueueEntry[] => queues[type] || [],
    [queues]
  );

  const getQueueStats = useCallback(
    (type: QueueType): QueueStats => {
      const queue = queues[type] || [];
      const waiting = queue.filter((e) => e.status === 'waiting');
      const inProgress = queue.filter((e) => e.status === 'in_progress');
      const paused = queue.filter((e) => e.status === 'paused');
      const completed = entries.filter((e) => e.queueType === type && e.status === 'completed');

      const waitTimes = waiting.map((e) => e.waitTimeMinutes);
      const avgWaitTime = waitTimes.length ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0;
      const longestWaitTime = waitTimes.length ? Math.max(...waitTimes) : 0;

      return {
        total: queue.length,
        waiting: waiting.length,
        inProgress: inProgress.length,
        paused: paused.length,
        completed: completed.length,
        averageWaitTime: avgWaitTime,
        longestWaitTime,
        emergencyCount: queue.filter((e) => e.priority === 'emergency').length,
      };
    },
    [queues, entries]
  );

  const getEntryById = useCallback(
    (id: string): QueueEntry | undefined => entries.find((e) => e.id === id),
    [entries]
  );

  const getPatientInQueue = useCallback(
    (patientId: string): QueueEntry | undefined =>
      entries.find((e) => e.patientId === patientId && ['waiting', 'in_progress', 'paused'].includes(e.status)),
    [entries]
  );

  const addToQueue = useCallback(
    (entry: Omit<QueueEntry, 'id' | 'joinedAt' | 'queueNumber' | 'waitTimeMinutes'>): QueueEntry => {
      queueNumberCounters[entry.queueType]++;
      
      const newEntry: QueueEntry = {
        ...entry,
        id: generateId(),
        joinedAt: new Date().toISOString(),
        queueNumber: queueNumberCounters[entry.queueType],
        waitTimeMinutes: 0,
      };

      setEntries((prev) => [...prev, newEntry]);
      setLastUpdated(new Date());
      return newEntry;
    },
    []
  );

  const removeFromQueue = useCallback((entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    setLastUpdated(new Date());
  }, []);

  const updateEntry = useCallback(
    (entryId: string, updates: Partial<QueueEntry>): QueueEntry | undefined => {
      let updatedEntry: QueueEntry | undefined;

      setEntries((prev) =>
        prev.map((e) => {
          if (e.id === entryId) {
            updatedEntry = { ...e, ...updates };
            return updatedEntry;
          }
          return e;
        })
      );

      setLastUpdated(new Date());
      return updatedEntry;
    },
    []
  );

  const callPatient = useCallback(
    (entryId: string, staffId: string, staffName: string): QueueEntry | undefined => {
      return updateEntry(entryId, {
        status: 'in_progress',
        calledAt: new Date().toISOString(),
        assignedTo: staffId,
        assignedToName: staffName,
        assignedAt: new Date().toISOString(),
      });
    },
    [updateEntry]
  );

  const completeEntry = useCallback(
    (entryId: string): QueueEntry | undefined => {
      return updateEntry(entryId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
    },
    [updateEntry]
  );

  const pauseEntry = useCallback(
    (entryId: string, reason: QueueEntry['pauseReason'], otherReason?: string): QueueEntry | undefined => {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 12);

      return updateEntry(entryId, {
        status: 'paused',
        pauseReason: reason,
        pauseReasonOther: otherReason,
        pausedAt: new Date().toISOString(),
        autoPauseExpiryAt: expiryDate.toISOString(),
      });
    },
    [updateEntry]
  );

  const resumeEntry = useCallback(
    (entryId: string, targetQueue: QueueType): QueueEntry | undefined => {
      const entry = getEntryById(entryId);
      if (!entry) return undefined;

      // Complete the paused entry
      completeEntry(entryId);

      // Add to target queue as a review
      return addToQueue({
        ...entry,
        queueType: targetQueue,
        status: 'waiting',
        isReview: true,
        originalConsultationId: entry.originalConsultationId || entry.id,
        pauseReason: undefined,
        pauseReasonOther: undefined,
        pausedAt: undefined,
        pausedBy: undefined,
        autoPauseExpiryAt: undefined,
      });
    },
    [getEntryById, completeEntry, addToQueue]
  );

  const markNoShow = useCallback(
    (entryId: string): QueueEntry | undefined => {
      return updateEntry(entryId, { status: 'no_show' });
    },
    [updateEntry]
  );

  const moveToQueue = useCallback(
    (entryId: string, targetQueue: QueueType, assignedTo?: string): QueueEntry | undefined => {
      const entry = getEntryById(entryId);
      if (!entry) return undefined;

      // Complete current entry
      completeEntry(entryId);

      // Add to new queue
      return addToQueue({
        patientId: entry.patientId,
        patientName: entry.patientName,
        patientMrn: entry.patientMrn,
        queueType: targetQueue,
        status: 'waiting',
        priority: entry.priority,
        paymentStatus: entry.paymentStatus,
        chiefComplaint: entry.chiefComplaint,
        notes: entry.notes,
        assignedTo,
      });
    },
    [getEntryById, completeEntry, addToQueue]
  );

  const refreshQueues = useCallback(() => {
    setEntries((prev) =>
      prev.map((entry) => ({
        ...entry,
        waitTimeMinutes: calculateWaitTime(entry.joinedAt),
      }))
    );
    setLastUpdated(new Date());
  }, []);

  const value: QueueContextType = {
    queues,
    isLoading,
    lastUpdated,
    getQueueByType,
    getQueueStats,
    getEntryById,
    getPatientInQueue,
    addToQueue,
    removeFromQueue,
    updateEntry,
    callPatient,
    completeEntry,
    pauseEntry,
    resumeEntry,
    markNoShow,
    moveToQueue,
    refreshQueues,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue(): QueueContextType {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}

// Hook for a specific queue type
export function useQueueByType(type: QueueType) {
  const { getQueueByType, getQueueStats } = useQueue();
  
  return {
    entries: getQueueByType(type),
    stats: getQueueStats(type),
    config: QUEUE_CONFIGS[type],
  };
}
