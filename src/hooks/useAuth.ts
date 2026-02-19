import { useCurrentUser, useLogin, useLogout } from "@/api/services/auth.service";
import { TUserRole, roleMetadata } from "@/api/clients/auth/authClient.types";

export function useAuth() {
  const { data: user } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    login: (role: TUserRole) => loginMutation.mutate(role),
    logout: () => logoutMutation.mutate(),
  };
}

export { roleMetadata };
