import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

export default function AdminProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
