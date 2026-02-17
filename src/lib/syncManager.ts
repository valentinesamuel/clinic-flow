import { onlineManager } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { mutationQueue, QueuedMutation } from './mutationQueue';

export type SyncEvent = 'idle' | 'syncing' | 'error';

class SyncManager {
  private isSyncing = false;
  private listeners = new Set<(status: SyncEvent) => void>();

  async init() {
    await mutationQueue.init();

    onlineManager.subscribe((isOnline) => {
      if (isOnline) {
        this.sync();
      }
    });

    // Attempt initial sync if online and there are pending mutations
    if (onlineManager.isOnline() && mutationQueue.getCount() > 0) {
      this.sync();
    }
  }

  async sync() {
    if (this.isSyncing || !onlineManager.isOnline()) return;

    const pending = mutationQueue.getPending();
    if (pending.length === 0) return;

    this.isSyncing = true;
    await mutationQueue.setSyncInProgress(true);
    this.notifyListeners('syncing');

    const sorted = [...pending].sort((a, b) => a.timestamp - b.timestamp);
    let hasError = false;

    for (const mutation of sorted) {
      try {
        await this.executeMutation(mutation);
        await mutationQueue.remove(mutation.id);
      } catch (error: unknown) {
        hasError = true;
        const status = (error as { response?: { status?: number } })?.response
          ?.status;

        if (status === 409) {
          // Conflict — last-write-wins, discard this mutation
          await mutationQueue.remove(mutation.id);
        } else if (status && status >= 400 && status < 500) {
          // Client error — won't fix itself on retry
          await mutationQueue.markFailed(mutation.id);
        } else {
          // Network / server error — may succeed on retry
          await mutationQueue.markFailed(mutation.id);
        }
      }
    }

    await mutationQueue.setSyncInProgress(false);
    await mutationQueue.setLastSyncAt(Date.now());
    this.isSyncing = false;
    this.notifyListeners(hasError ? 'error' : 'idle');
  }

  private async executeMutation(mutation: QueuedMutation) {
    const { url, method, data, headers } = mutation;

    switch (method) {
      case 'POST':
        return apiClient.post(url, data, { headers });
      case 'PATCH':
        return apiClient.patch(url, data, { headers });
      case 'PUT':
        return apiClient.put(url, data, { headers });
      case 'DELETE':
        return apiClient.delete(url, { headers });
    }
  }

  subscribeToSync(listener: (status: SyncEvent) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(status: SyncEvent) {
    this.listeners.forEach((fn) => fn(status));
  }

  getQueueState() {
    return mutationQueue.getState();
  }

  async retryFailed() {
    await mutationQueue.retryFailed();
    return this.sync();
  }

  async clearFailed() {
    return mutationQueue.clearFailed();
  }
}

export const syncManager = new SyncManager();
