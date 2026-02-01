import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SyncStatus = 'online' | 'syncing' | 'offline' | 'error';

interface SyncContextType {
  status: SyncStatus;
  pendingChanges: number;
  lastSyncTime: Date | null;
  setStatus: (status: SyncStatus) => void;
  setPendingChanges: (count: number) => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>('online');
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());

  const handleSetStatus = (newStatus: SyncStatus) => {
    setStatus(newStatus);
    if (newStatus === 'online') {
      setLastSyncTime(new Date());
      setPendingChanges(0);
    }
  };

  return (
    <SyncContext.Provider
      value={{
        status,
        pendingChanges,
        lastSyncTime,
        setStatus: handleSetStatus,
        setPendingChanges,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
