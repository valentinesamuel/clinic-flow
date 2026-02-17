import { get, set } from 'idb-keyval';

const QUEUE_KEY = 'clinic-flow-mutation-queue';

let nextId = 1;

export type QueuedMutation = {
  id: string;
  url: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  data?: unknown;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
  resourceType: string;
};

export type MutationQueueState = {
  pending: QueuedMutation[];
  failed: QueuedMutation[];
  lastSyncAt: number | null;
  syncInProgress: boolean;
};

class MutationQueue {
  private state: MutationQueueState = {
    pending: [],
    failed: [],
    lastSyncAt: null,
    syncInProgress: false,
  };

  private listeners = new Set<() => void>();

  async init() {
    const stored = await get<MutationQueueState>(QUEUE_KEY);
    if (stored) {
      this.state = stored;
    }
  }

  async add(
    mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retryCount'>,
  ): Promise<QueuedMutation> {
    const queued: QueuedMutation = {
      ...mutation,
      id: `mut-${Date.now()}-${nextId++}`,
      timestamp: Date.now(),
      retryCount: 0,
    };
    this.state.pending.push(queued);
    await this.persist();
    this.notify();
    return queued;
  }

  async remove(id: string) {
    this.state.pending = this.state.pending.filter((m) => m.id !== id);
    await this.persist();
    this.notify();
  }

  async markFailed(id: string) {
    const index = this.state.pending.findIndex((m) => m.id === id);
    if (index === -1) return;

    const mutation = this.state.pending[index];
    mutation.retryCount++;

    if (mutation.retryCount >= 3) {
      this.state.failed.push(mutation);
      this.state.pending.splice(index, 1);
    }

    await this.persist();
    this.notify();
  }

  async retryFailed() {
    const toRetry = this.state.failed.map((m) => ({
      ...m,
      retryCount: 0,
    }));
    this.state.pending.push(...toRetry);
    this.state.failed = [];
    await this.persist();
    this.notify();
  }

  async clearFailed() {
    this.state.failed = [];
    await this.persist();
    this.notify();
  }

  async setSyncInProgress(value: boolean) {
    this.state.syncInProgress = value;
    await this.persist();
    this.notify();
  }

  async setLastSyncAt(timestamp: number) {
    this.state.lastSyncAt = timestamp;
    await this.persist();
    this.notify();
  }

  getPending() {
    return [...this.state.pending];
  }

  getFailed() {
    return [...this.state.failed];
  }

  getCount() {
    return this.state.pending.length;
  }

  getState(): MutationQueueState {
    return { ...this.state };
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private async persist() {
    await set(QUEUE_KEY, this.state);
  }
}

export const mutationQueue = new MutationQueue();
