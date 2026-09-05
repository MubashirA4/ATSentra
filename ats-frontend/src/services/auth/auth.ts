import api from "../api/axios";
import type {
  AuthResponse,
  MeResponse,
  RefreshResponse,
  SignInData,
  SignUpData,
} from "../../types/auth";

export const register = async (
  data: SignUpData,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  );

  return response.data;
};

export const login = async (
  data: SignInData,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data,
  );

  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get<MeResponse>(
    "/auth/me",
  );

  return response.data;
};

export const refresh = async (): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>(
    "/auth/refresh",
  );

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};