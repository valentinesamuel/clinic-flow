import { AxiosRequestConfig } from 'axios';
import { onlineManager } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { mutationQueue } from './mutationQueue';

function extractResourceType(url: string): string {
  // "/patients/123" → "patients"
  const parts = url.replace(/^\//, '').split('/');
  return parts[0] || 'unknown';
}

export const offlineApiClient = {
  async post(url: string, data?: unknown, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: 'POST',
        data,
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return {
        data: { ...(data as Record<string, unknown>), id: `temp-${Date.now()}`, _offline: true },
      };
    }
    return apiClient.post(url, data, config);
  },

  async patch(url: string, data?: unknown, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: 'PATCH',
        data,
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return { data: { ...(data as Record<string, unknown>), _offline: true } };
    }
    return apiClient.patch(url, data, config);
  },

  async put(url: string, data?: unknown, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: 'PUT',
        data,
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return { data: { ...(data as Record<string, unknown>), _offline: true } };
    }
    return apiClient.put(url, data, config);
  },

  async delete(url: string, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: 'DELETE',
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return { data: { success: true, _offline: true } };
    }
    return apiClient.delete(url, config);
  },

  // Reads pass through — React Query cache handles offline reads
  get: apiClient.get.bind(apiClient),
};
