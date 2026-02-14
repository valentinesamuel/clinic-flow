import { useCurrentUser } from './queries/useAuthQueries';
import { useLogin, useLogout } from './mutations/useAuthMutations';
import { User, UserRole, roleMetadata } from '@/types/user.types';

export function useAuth() {
  const { data: user } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    login: (role: UserRole) => loginMutation.mutate(role),
    logout: () => logoutMutation.mutate(),
  };
}

// Re-export types for convenience (matches old AuthContext exports)
export type { User, UserRole };
export { roleMetadata };
