import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { loginAdmin } from "@/feature/admin/api";
import { AdminDashboard, AdminLogin } from "@/feature/admin/components";
import { Stack } from "@/shared/components/ui";
import { ApiMessageResponse } from "@/shared/types/api";

import s from "./admin.module.scss";

const ADMIN_SESSION_KEY = "portfolio-admin-session";

function getStoredAuthState() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "authenticated";
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    getStoredAuthState(),
  );
  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = useMutation<ApiMessageResponse, Error, string>({
    mutationFn: (password) => loginAdmin({ password }),
    onSuccess: () => {
      // 세션 유지 자체는 클라이언트(localStorage)에 있으므로 민감 인증 용도는 아닙니다.
      localStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      setErrorMessage("");
      setIsAuthenticated(true);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleLogin = (password: string) => {
    loginMutation.mutate(password);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  const containerClassName = [
    s.container,
    isAuthenticated ? s.authenticated : "",
  ]
    .filter(Boolean)
    .join(" ");

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
