import { apiClient } from './client';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const notificationsApi = {
  getAll: async (): Promise<NotificationItem[]> =>
    (await apiClient.get('/notifications')).data,
};
