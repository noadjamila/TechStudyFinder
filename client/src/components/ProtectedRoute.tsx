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
 * Redirects to home page if user is not logged in.
 *
 * @param props.children - The component to render if user is authenticated
 * @returns The protected component or redirect to home page
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
