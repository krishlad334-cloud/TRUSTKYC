import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GlobalLoader } from "./ProtectedRoute";

export default function PublicRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <GlobalLoader />;

  if (isAuthenticated && user) {
    if (user.scope === "SYSTEM" || user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
