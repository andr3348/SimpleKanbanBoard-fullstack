import { http } from "@/shared/api/http";
import type { LoginFormData, RegisterFormData } from "../model/auth.schemas";

interface AuthResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const authApi = {
  login: (data: LoginFormData) =>
    http.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterFormData) =>
    http.post<AuthResponse>("/auth/register", data),
};
