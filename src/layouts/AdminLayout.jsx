import { Outlet, useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { adminHeaders, resolveHeader } from "./headerConfig";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const header = resolveHeader(pathname, adminHeaders, adminHeaders["/admin/dashboard"]);

  return (
    <AppShell kind="admin" header={header}>
      <Outlet />
    </AppShell>
  );
}
