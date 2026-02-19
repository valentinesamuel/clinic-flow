import { AxiosRequestConfig } from "axios";
import { onlineManager } from "@tanstack/react-query";
import { mutationQueue } from "./mutationQueue";
import Client from "@/api/axios";

function extractResourceType(url: string): string {
  // "/patients/123" → "patients"
  const parts = url.replace(/^\//, "").split("/");
  return parts[0] || "unknown";
}

export const offlineApiClient = {
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: "POST",
        data,
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return {
        data: {
          ...(data as Record<string, unknown>),
          id: `temp-${Date.now()}`,
          _offline: true,
        },
      };
    }
    return Client.post<T>(url, data, config);
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: "PATCH",
        data,
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return { data: { ...(data as Record<string, unknown>), _offline: true } };
    }
    return Client.patch<T>(url, data, config);
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: "PUT",
        data,
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return { data: { ...(data as Record<string, unknown>), _offline: true } };
    }
    return Client.put<T>(url, data, config);
  },

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    if (!onlineManager.isOnline()) {
      await mutationQueue.add({
        url,
        method: "DELETE",
        headers: config?.headers as Record<string, string>,
        resourceType: extractResourceType(url),
      });
      return { data: { success: true, _offline: true } };
    }
    return Client.delete<T>(url, config);
  },

  // Reads pass through — React Query cache handles offline reads
  get: Client.get.bind(Client),
};
