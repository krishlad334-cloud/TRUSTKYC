import { Outlet, useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { businessHeaders, resolveHeader } from "./headerConfig";

export default function BusinessLayout() {
  const { pathname } = useLocation();
  const header = resolveHeader(pathname, businessHeaders, businessHeaders["/business/dashboard"]);

  return (
    <AppShell kind="business" header={header}>
      <Outlet />
    </AppShell>
  );
}
