import { useState, useEffect, useSyncExternalStore } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { syncManager, SyncEvent } from '@/lib/syncManager';
import { mutationQueue } from '@/lib/mutationQueue';

export type SyncStatus = 'online' | 'syncing' | 'offline' | 'error';

export function useSyncStatus() {
  const [syncEvent, setSyncEvent] = useState<SyncEvent>('idle');
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const isOnline = useSyncExternalStore(
    onlineManager.subscribe.bind(onlineManager),
    () => onlineManager.isOnline(),
  );

  useEffect(() => {
    const unsubSync = syncManager.subscribeToSync((event) => {
      setSyncEvent(event);
    });

    const unsubQueue = mutationQueue.subscribe(() => {
      const state = mutationQueue.getState();
      setPendingChanges(state.pending.length);
      if (state.lastSyncAt) {
        setLastSyncTime(new Date(state.lastSyncAt));
      }
    });

    // Initial state
    const state = mutationQueue.getState();
    setPendingChanges(state.pending.length);
    if (state.lastSyncAt) {
      setLastSyncTime(new Date(state.lastSyncAt));
    }

    return () => {
      unsubSync();
      unsubQueue();
    };
  }, []);

  const status: SyncStatus = !isOnline
    ? 'offline'
    : syncEvent === 'syncing'
      ? 'syncing'
      : syncEvent === 'error'
        ? 'error'
        : 'online';

  return {
    status,
    isOnline,
    pendingChanges,
    lastSyncTime,
    retryFailed: () => syncManager.retryFailed(),
    clearFailed: () => syncManager.clearFailed(),
  };
}
