import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queries/queryKeys';
import { queueApi } from '@/api/queue';

export function useStartQueueEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId?: string }) =>
      queueApi.start(id, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queues.all });
    },
  });
}

export function useCompleteQueueEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queueApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queues.all });
    },
  });
}

export function useMoveToNextQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      targetQueue,
      assignedTo,
    }: {
      id: string;
      targetQueue: string;
      assignedTo?: string;
    }) => queueApi.moveToNext(id, targetQueue, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queues.all });
    },
  });
}

export function useUpdatePriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      priority,
      notes,
    }: {
      id: string;
      priority: string;
      notes?: string;
    }) => queueApi.updatePriority(id, priority, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queues.all });
    },
  });
}

export function useTransferQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newAssignee }: { id: string; newAssignee: string }) =>
      queueApi.transfer(id, newAssignee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queues.all });
    },
  });
}
