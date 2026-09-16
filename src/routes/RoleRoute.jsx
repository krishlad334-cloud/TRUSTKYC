import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GlobalLoader } from "./ProtectedRoute";

export default function RoleRoute({ allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) return <GlobalLoader />;

  if (allowedRole === "ADMIN") {
    if (user?.scope !== "SYSTEM" && user?.role !== "ADMIN") {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (allowedRole === "BUSINESS") {
    if (user?.scope === "SYSTEM" || user?.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <Outlet />;
}
