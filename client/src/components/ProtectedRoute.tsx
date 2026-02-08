/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";
import { CircularProgress } from "@mui/material";

/**
 * Protected route component that requires authentication.
 * Redirects to error page with 401 if user is not logged in.
 *
 * @param props.children - The component to render if user is authenticated
 * @returns The protected component or redirect to error page
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!user) {
    return (
      <Navigate
        to="/error"
        replace
        state={{
          code: 401,
          message: "Hier hast du nichts verloren!\nBitte melde dich an.",
        }}
      />
    );
  }

  return <>{children}</>;
}
