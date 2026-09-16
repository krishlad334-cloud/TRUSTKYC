import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* Route Guards */
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import PublicRoute from "./PublicRoute";

/* Layouts */
import BusinessLayout from "../layouts/BusinessLayout";
import AdminLayout from "../layouts/AdminLayout";
import DocumentationLayout from "../layouts/DocumentationLayout";

/* Auth Pages */
import Landing from "../pages/auth/Landing";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/Verifyemail";
import ResetPassword from "../pages/auth/ResetPassword";
import ChangePassword from "../pages/auth/ChangePassword";

/* Business Pages */
import BusinessDashboardHome from "../pages/business/DashboardHome";
import BusinessKycPage from "../pages/business/KycPage";
import BusinessDocumentsPage from "../pages/business/DocumentsPage";
import BusinessTrustPage from "../pages/business/TrustPage";
import BusinessDealsPage from "../pages/business/DealsPage";
import BusinessDirectoryPage from "../pages/business/DirectoryPage";
import BusinessSharedPage from "../pages/business/SharedPage";
import BusinessAuditPage from "../pages/business/AuditPage";
import BusinessSettingsPage from "../pages/business/SettingsPage";
import BusinessProfilePage from "../pages/business/ProfilePage";
import BusinessProfileDetailPage from "../pages/business/ProfileDetailPage";

/* Admin Pages */
import AdminHome from "../pages/admin/AdminHome";
import AdminBusinesses from "../pages/admin/AdminBusinesses";
import AdminKyc from "../pages/admin/AdminKyc";
import AdminDocuments from "../pages/admin/AdminDocuments";
import AdminDeals from "../pages/admin/AdminDeals";
import AdminAudit from "../pages/admin/AdminAudit";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminReports from "../pages/admin/AdminReports";
import AdminSettings from "../pages/admin/AdminSettings";

/* Documentation Portal */
import DocumentationPage from "../pages/documentation/DocumentationPage";

/* Common Pages */
import UnauthorizedPage from "../pages/common/UnauthorizedPage";
import NotFoundPage from "../pages/common/NotFoundPage";

function DefaultRedirect() {
  const { user } = useAuth();
  if (user?.scope === "SYSTEM" || user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/business/dashboard" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Authentication Routes ── */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Landing />} />
        <Route path="/business/login" element={<Landing />} />
        <Route path="/admin/login" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ── In-Website Documentation Portal (Open to Reviewers & Devs) ── */}
      <Route
        path="/documentation"
        element={
          <DocumentationLayout>
            <DocumentationPage />
          </DocumentationLayout>
        }
      />

      {/* ── Protected Application Workspace ── */}
      <Route element={<ProtectedRoute />}>
        {/* User Account Utility */}
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Business Space */}
        <Route element={<RoleRoute allowedRole="BUSINESS" />}>
          <Route path="/business" element={<BusinessLayout />}>
            <Route index element={<Navigate to="/business/dashboard" replace />} />
            <Route path="dashboard" element={<BusinessDashboardHome />} />
            <Route path="kyc" element={<BusinessKycPage />} />
            <Route path="documents" element={<BusinessDocumentsPage />} />
            <Route path="trust" element={<BusinessTrustPage />} />
            <Route path="deals" element={<BusinessDealsPage />} />
            <Route path="directory" element={<BusinessDirectoryPage />} />
            <Route path="shared" element={<BusinessSharedPage />} />
            <Route path="audit" element={<BusinessAuditPage />} />
            <Route path="settings" element={<BusinessSettingsPage />} />
            <Route path="profile" element={<BusinessProfilePage />} />
            <Route path="profile/:id" element={<BusinessProfileDetailPage />} />
          </Route>
          {/* Legacy /dashboard path alias */}
          <Route path="/dashboard" element={<Navigate to="/business/dashboard" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/business/dashboard" replace />} />
        </Route>

        {/* Admin Operations Space */}
        <Route element={<RoleRoute allowedRole="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="deals" element={<AdminDeals />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>

      {/* Role-based default redirect */}
      <Route path="/home" element={<DefaultRedirect />} />

      {/* ── Error & Fallback Routes ── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
