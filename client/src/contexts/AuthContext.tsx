import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
} from "../api/authApi";
import { useApiClient } from "../hooks/useApiClient";
import {
  clearQuizResults,
  loadQuizResults,
} from "../session/persistQuizSession";
import { attachDeviceResults } from "../api/quizApi";

/**
 * Represents the authenticated user.
 * `null` means no user is logged in.
 */
type User = { id: number; username: string } | null;

/**
 * Shape of the authentication context.
 */
type AuthContextValue = {
  /** Currently authenticated user */
  user: User;
  /** Indicates whether authentication state is being loaded */
  isLoading: boolean;
  /**
   * Logs in a user using username and password.
   * @param username - The user's username
   * @param password - The user's password
   */
  login: (username: string, password: string) => Promise<void>;
  /**
   * Logs out the current user.
   */
  logout: () => Promise<void>;
  /**
   * Manually sets the current user.
   * @param user - The user to set or null
   */
  setUser: (user: User) => void;
};

/**
 * Authentication context.
 * Must be accessed via {@link useAuth}.
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provides authentication state and actions to its children.
 *
 * - Loads the current user on mount
 * - Exposes login and logout functionality
 *
 * @param props.children - React child components
 * @returns Auth context provider
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { apiFetch } = useApiClient();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const current = await getCurrentUser(apiFetch);
      if (mounted) {
        setUser(current);
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiFetch]);

  const login = async (username: string, password: string) => {
    try {
      const res = await apiLogin(username, password, apiFetch);
      if (res.user) {
        setUser(res.user);
        setIsLoading(false);
      }
      let cached: Awaited<ReturnType<typeof loadQuizResults>> = null;
      try {
        cached = await loadQuizResults();
      } catch (error) {
        if (!(error instanceof Error)) throw error;
        if (!error.message.includes("IndexedDB is not supported")) {
          throw error;
        }
      }

      if (cached && cached.length > 0) {
        const resultIds = cached
          .map((p) => p?.studiengang_id)
          .filter(
            (id): id is string => typeof id === "string" && id.length > 0,
          );

        if (resultIds.length > 0) {
          await attachDeviceResults(resultIds, apiFetch);
          await clearQuizResults();
        }
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await apiLogout(apiFetch);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the authentication context.
 *
 * @throws Error if used outside of {@link AuthProvider}
 * @returns Authentication context value
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
