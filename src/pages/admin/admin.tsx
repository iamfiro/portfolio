import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { checkSession, loginAdmin, logoutAdmin } from "@/feature/admin/api";
import { AdminDashboard, AdminLogin } from "@/feature/admin/components";
import { Stack } from "@/shared/components/ui";
import { ApiError } from "@/shared/lib/api";
import { AdminSessionResponse, ApiMessageResponse } from "@/shared/types/api";

import s from "./admin.module.scss";

export default function Admin() {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  // 서버 세션 확인 — 쿠키 기반 인증
  const { data: sessionData, isLoading: isSessionLoading } = useQuery<
    AdminSessionResponse,
    ApiError
  >({
    queryKey: ["admin", "session"],
    queryFn: checkSession,
    retry: false,
  });

  const isAuthenticated = sessionData?.authenticated === true;

  const loginMutation = useMutation<ApiMessageResponse, ApiError, string>({
    mutationFn: (password) => loginAdmin({ password }),
    onSuccess: () => {
      setErrorMessage("");
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const logoutMutation = useMutation<ApiMessageResponse, ApiError>({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "session"] });
    },
  });

  const handleLogin = (password: string) => {
    loginMutation.mutate(password);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const containerClassName = [s.container, isAuthenticated ? s.authenticated : ""]
    .filter(Boolean)
    .join(" ");

  if (isSessionLoading) {
    return (
      <main className={s.container}>
        <Stack className={s.loginSection} />
      </main>
    );
  }

  return (
    <main className={containerClassName}>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <Stack className={s.loginSection}>
          <AdminLogin
            onLogin={handleLogin}
            errorMessage={errorMessage}
            disabled={loginMutation.isPending}
          />
        </Stack>
      )}
    </main>
  );
}
