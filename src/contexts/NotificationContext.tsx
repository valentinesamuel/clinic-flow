import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

export type NotificationType =
  | 'patient_arrived'        // Patient checked in
  | 'results_ready'          // Lab results available
  | 'prescription_ready'     // Pharmacy ready
  | 'consultation_paused'    // Doctor paused consultation
  | 'consultation_autoclosed' // 12-hour auto-close
  | 'payment_received'       // Payment confirmed
  | 'queue_warning'          // Too many reviews pending
  | 'emergency'              // Emergency alert
  | 'info'                   // General info
  | 'success'                // Success message
  | 'error';                 // Error message

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  patientId?: string;
  patientName?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const generateId = (): string => `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Map notification types to toast types
const getToastType = (type: NotificationType): 'success' | 'error' | 'warning' | 'info' => {
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

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: generateId(),
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep max 50

      // Show toast notification
      const toastType = getToastType(notification.type);
      const toastFn = toastType === 'success' ? toast.success :
                      toastType === 'error' ? toast.error :
                      toastType === 'warning' ? toast.warning :
                      toast.info;

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
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
