import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthState,
  SignInData,
  SignUpData,
  User,
} from "../types/auth";

import * as authService from "../services/auth/auth";

import {
  clearAccessToken,
  setAccessToken,
} from "../services/auth/token";

interface AuthContextValue extends AuthState {
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(
    null,
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const isAuthenticated = Boolean(user);

  /*
   * Restore authentication after browser refresh.
   *
   * Access token:
   * - stored in memory
   * - lost after refresh
   *
   * Refresh token:
   * - stored in HttpOnly cookie
   * - survives refresh
   *
   * Therefore:
   *
   * refresh token
   *      ↓
   * new access token
   *      ↓
   * /auth/me
   *      ↓
   * authenticated user
   */
  const restoreSession = useCallback(async () => {
    try {
      const refreshResponse =
        await authService.refresh();

      const accessToken =
        refreshResponse.data.accessToken;

      setAccessToken(accessToken);

      const meResponse =
        await authService.getMe();

      setUser(meResponse.data.user);
    } catch (error) {
      console.error(
        "Failed to restore authentication session:",
        error,
      );

      clearAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = async (
    data: SignInData,
  ): Promise<void> => {
    const response =
      await authService.login(data);

    setAccessToken(
      response.data.accessToken,
    );

    setUser(response.data.user);
  };

  const signUp = async (
    data: SignUpData,
  ): Promise<void> => {
    const response =
      await authService.register(data);

    setAccessToken(
      response.data.accessToken,
    );

    setUser(response.data.user);
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};