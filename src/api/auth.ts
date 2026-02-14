import { User, UserRole } from '@/types/user.types';
import { apiClient } from './client';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Module-level cache for synchronous access (used by API interceptors)
let cachedUser: User | null = null;

function init() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      cachedUser = JSON.parse(stored);
    }
  } catch {
    cachedUser = null;
  }
}
init();

export const authApi = {
  login: async (role: UserRole): Promise<{ user: User; token: string }> => {
    // Fetch user by role from json-server
    const { data: users } = await apiClient.get<User[]>('/users', {
      params: { role },
    });
    const user = users[0];
    const token = `mock-token-${role}-${Date.now()}`;

    // Persist
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    cachedUser = user;

    return { user, token };
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    cachedUser = null;
  },

  getCurrentUser: async (): Promise<User | null> => {
    return cachedUser;
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
};
