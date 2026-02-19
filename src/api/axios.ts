import { handleErrorByStatus } from "@/utils/generic.util";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = process.env.apiBaseUrl;
const API_TOKEN = process.env.apiToken;

interface ApiErrorResponse {
  message: string;
  [key: string]: string | ApiError[];
}

interface ApiError {
  field: string;
  errors: string[];
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-token": API_TOKEN,
    "ngrok-skip-browser-warning": true,
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
);

const successHandler = async (
  response: AxiosResponse,
): Promise<AxiosResponse> => Promise.resolve(response);

const errorHandler = (error: AxiosError): Promise<AxiosError> => {
  if (error.response) {
    const { status, data } = error.response;
    const errorData = data as ApiErrorResponse; // Type assertion for `data`
    let message = errorData.message || "An error occurred.";

    if (typeof errorData.error !== "string") {
      message =
        `${errorData.message} - ${errorData.error?.[0]?.errors?.[0] ?? ""}`.trim();
    }

    const errorType =
      typeof errorData.error === "string" ? errorData.error : "Form error";
    handleErrorByStatus(status, message, errorType);
  }
  return Promise.reject(error.response);
};

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add timestamps for last-write-wins conflict resolution
  if (["post", "patch", "put"].includes(config.method?.toLowerCase() || "")) {
    const userRaw = localStorage.getItem("auth_user");
    const userId = userRaw ? JSON.parse(userRaw)?.id : "unknown";
    config.data = {
      ...config.data,
      _lastModified: new Date().toISOString(),
      _modifiedBy: userId,
    };
  }

  return config;
});

instance.interceptors.response.use(successHandler, errorHandler);

export default class Client {
  static async get<T>(url: string, options?: AxiosRequestConfig<unknown>) {
    const response = await instance.get<T>(url, options);
    return response.data;
  }
  static async post<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig<unknown>,
  ) {
    const response = await instance.post<T>(url, data, options);
    return response.data;
  }
  static async put<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig<unknown>,
  ) {
    const response = await instance.put<T>(url, data);
    return response.data;
  }
  static async patch<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig<unknown>,
  ) {
    const response = await instance.patch<T>(url, data, options);
    return response.data;
  }
  static async delete<T>(url: string, options?: AxiosRequestConfig<unknown>) {
    const response = await instance.delete<T>(url, options);
    return response.data;
  }
}
