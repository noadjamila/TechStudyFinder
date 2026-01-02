import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";

/**
 * Protected route component that requires authentication.
 * Redirects to home page if user is not logged in.
 *
 * @param props.children - The component to render if user is authenticated
 * @returns The protected component or redirect to home
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  // Wait for auth state to load
  if (isLoading) {
    return null; // or a loading spinner if you have one
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
