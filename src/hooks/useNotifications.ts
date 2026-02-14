import { useCallback } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from './queries/queryKeys';
import { Notification, NotificationType } from '@/types/notification.types';

const generateId = (): string =>
  `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getToastType = (
  type: NotificationType,
): 'success' | 'error' | 'warning' | 'info' => {
  switch (type) {
    case 'success':
    case 'prescription_ready':
    case 'results_ready':
    case 'payment_received':
      return 'success';
    case 'error':
      return 'error';
    case 'emergency':
    case 'queue_warning':
    case 'consultation_autoclosed':
      return 'warning';
    default:
      return 'info';
  }
};

export function useNotifications() {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.notifications.lists();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey,
    queryFn: () => queryClient.getQueryData<Notification[]>(queryKey) ?? [],
    initialData: [],
    staleTime: Infinity,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: generateId(),
        timestamp: new Date(),
        read: false,
      };

      queryClient.setQueryData<Notification[]>(queryKey, (prev = []) =>
        [newNotification, ...prev].slice(0, 50),
      );

      const toastType = getToastType(notification.type);
      const toastFn =
        toastType === 'success'
          ? toast.success
          : toastType === 'error'
            ? toast.error
            : toastType === 'warning'
              ? toast.warning
              : toast.info;

      toastFn(notification.title, {
        description: notification.message,
        duration: notification.type === 'emergency' ? 10000 : 5000,
        action: notification.actionUrl
          ? {
              label: notification.actionLabel || 'View',
              onClick: () => {
                window.location.href = notification.actionUrl!;
              },
            }
          : undefined,
      });
    },
    [queryClient, queryKey],
  );

  const removeNotification = useCallback(
    (id: string) => {
      queryClient.setQueryData<Notification[]>(queryKey, (prev = []) =>
        prev.filter((n) => n.id !== id),
      );
    },
    [queryClient, queryKey],
  );

  const markAsRead = useCallback(
    (id: string) => {
      queryClient.setQueryData<Notification[]>(queryKey, (prev = []) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    [queryClient, queryKey],
  );

  const markAllAsRead = useCallback(() => {
    queryClient.setQueryData<Notification[]>(queryKey, (prev = []) =>
      prev.map((n) => ({ ...n, read: true })),
    );
  }, [queryClient, queryKey]);

  const clearAll = useCallback(() => {
    queryClient.setQueryData<Notification[]>(queryKey, []);
  }, [queryClient, queryKey]);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
