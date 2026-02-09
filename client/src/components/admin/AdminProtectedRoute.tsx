/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { CircularProgress } from "@mui/material";

export default function AdminProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
