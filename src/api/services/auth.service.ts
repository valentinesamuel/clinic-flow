import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../clients/auth/auth.client";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { TUserRole } from "../clients/auth/authClient.types";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: TUserRole) => authClient.login(role),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.user(), user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authClient.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authClient.getCurrentUser(),
    enabled: !!authClient.getToken(),
  });
}
