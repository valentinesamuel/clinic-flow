import { apiClient } from "./client";
import { calculateWaitTime } from "@/utils/queueUtils";
import { QueueEntry } from "@/types/queue.types";

export const queueApi = {
  getAll: async (): Promise<QueueEntry[]> =>
    (await apiClient.get<QueueEntry[]>("/queue-entries")).data,
  getByType: async (type: string): Promise<QueueEntry[]> =>
    (
      await apiClient.get<QueueEntry[]>("/queue-entries", {
        params: { queueType: type },
      })
    ).data,
  getStats: async (type: string) => {
    const { data: entries } = await apiClient.get<QueueEntry[]>(
      "/queue-entries",
      {
        params: { queueType: type },
      },
    );
    const waiting = entries.filter(
      (e: QueueEntry) => e.status === "waiting",
    ).length;
    const inProgress = entries.filter(
      (e: QueueEntry) => e.status === "in_progress",
    ).length;
    return { total: entries.length, waiting, inProgress };
  },
  getAllStats: async () => {
    const { data: entries } =
      await apiClient.get<QueueEntry[]>("/queue-entries");
    const types = [...new Set(entries.map((e: QueueEntry) => e.queueType))];
    const stats: Record<
      string,
      { total: number; waiting: number; inProgress: number }
    > = {};
    for (const type of types) {
      const typed = entries.filter((e: QueueEntry) => e.queueType === type);
      stats[type as string] = {
        total: typed.length,
        waiting: typed.filter((e: QueueEntry) => e.status === "waiting").length,
        inProgress: typed.filter((e: QueueEntry) => e.status === "in_progress")
          .length,
      };
    }
    return stats;
  },
  getById: async (id: string) =>
    (await apiClient.get(`/queue-entries/${id}`)).data,
  getPatientCurrent: async (patientId: string) => {
    const { data } = await apiClient.get("/queue-entries", {
      params: { patientId, status: "waiting" },
    });
    return data[0] || null;
  },
  add: async (data: Record<string, unknown>) =>
    (await apiClient.post("/queue-entries", data)).data,
  start: async (id: string, staffId?: string) =>
    (
      await apiClient.patch(`/queue-entries/${id}`, {
        status: "in_progress",
        startedAt: new Date().toISOString(),
        ...(staffId ? { assignedTo: staffId } : {}),
      })
    ).data,
  complete: async (id: string) =>
    (
      await apiClient.patch(`/queue-entries/${id}`, {
        status: "completed",
        completedAt: new Date().toISOString(),
      })
    ).data,
  moveToNext: async (id: string, targetQueue: string, assignedTo?: string) => {
    // Complete current entry
    await apiClient.patch(`/queue-entries/${id}`, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    // Get the entry to copy patient data
    const { data: entry } = await apiClient.get(`/queue-entries/${id}`);
    // Create new entry in target queue
    const newEntry = {
      ...entry,
      id: `q-${Date.now()}`,
      queueType: targetQueue,
      status: "waiting",
      assignedTo: assignedTo || entry.assignedTo,
      startedAt: undefined,
      completedAt: undefined,
      addedAt: new Date().toISOString(),
    };
    return (await apiClient.post("/queue-entries", newEntry)).data;
  },
  updatePriority: async (id: string, priority: string, notes?: string) =>
    (
      await apiClient.patch(`/queue-entries/${id}`, {
        priority,
        ...(notes ? { notes } : {}),
      })
    ).data,
  transfer: async (id: string, newAssignee: string) =>
    (await apiClient.patch(`/queue-entries/${id}`, { assignedTo: newAssignee }))
      .data,
  calculateWaitTime,
  update: (id: string, updates: Record<string, unknown>) =>
    apiClient.patch(`/queue-entries/${id}`, {}),
};
