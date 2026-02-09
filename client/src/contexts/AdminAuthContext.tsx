/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Admin = { id: number; username: string } | null;

type AuthContextValue = {
  admin: Admin;

  isLoading: boolean;

  login: (username: string, password: string) => Promise<void>;

  logout: () => Promise<void>;

  setAdmin: (admin: Admin) => void;
};

const AdminAuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setAdmin(data);
            setIsLoading(false);
          }
        } else {
          setAdmin(null);
          setIsLoading(false);
        }
      } catch {
        setAdmin(null);
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401) {
        throw Error("Username oder Passwort falsch eingegeben.");
      }

      if (!res.ok) {
        throw Error("Unerwarteter Fehler. Bitte später erneut versuchen.");
      }

      const adminData = await res.json();

      if (adminData) {
        setAdmin(adminData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    const res = await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Logout failed:", data);
      return;
    }

    setAdmin(null);
    navigate("/admin/login", { replace: true });
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, isLoading, login, logout, setAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
