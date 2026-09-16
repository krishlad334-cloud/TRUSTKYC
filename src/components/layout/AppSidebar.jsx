import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Award,
  Handshake,
  Building2,
  Share2,
  FileSpreadsheet,
  Settings,
  Scale,
  LogOut,
  BookOpen,
  FileText,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import CompanyLogo from "../ui/CompanyLogo";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/utils";

const businessNav = [
  { name: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
  { name: "KYC Verification", href: "/business/kyc", icon: ShieldCheck },
  { name: "Documents", href: "/business/documents", icon: FileText },
  { name: "Trust Score", href: "/business/trust", icon: Award },
  { name: "My Deals", href: "/business/deals", icon: Handshake },
  { name: "Directory", href: "/business/directory", icon: Building2 },
  { name: "Shared Profiles", href: "/business/shared", icon: Share2 },
  { name: "Audit Logs", href: "/business/audit", icon: FileSpreadsheet },
  { name: "Settings", href: "/business/settings", icon: Settings },
];

const adminNav = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Businesses", href: "/admin/businesses", icon: Building2 },
  { name: "KYC Reviews", href: "/admin/kyc", icon: ShieldCheck },
  { name: "Documents", href: "/admin/documents", icon: FileText },
  { name: "Deals & Disputes", href: "/admin/deals", icon: Scale },
  { name: "Audit Ledger", href: "/admin/audit", icon: FileSpreadsheet },
  { name: "User Roles", href: "/admin/users", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AppSidebar({ kind = "business", onLinkClick }) {
  const { user, business, logout } = useAuth();
  const navItems = kind === "admin" ? adminNav : businessNav;

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
        <CompanyLogo size="md" to={kind === "admin" ? "/admin/dashboard" : "/business/dashboard"} />
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
          {kind === "admin" ? "Admin" : "Business"}
        </span>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          {kind === "admin" ? "Compliance Operations" : "Enterprise Workspace"}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onLinkClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                )
              }
            >
              <Icon className="size-4 shrink-0 transition-transform group-hover:scale-105" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {/* In-App Documentation Link */}
        <div className="pt-4 mt-2 border-t border-sidebar-border">
          <NavLink
            to="/documentation"
            onClick={onLinkClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
              )
            }
          >
            <BookOpen className="size-4 shrink-0 text-primary" />
            <span>Documentation</span>
          </NavLink>
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-sidebar-border bg-muted/20">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-foreground truncate">
              {user?.name || (kind === "admin" ? "Smit Patel" : "Krish Lad")}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {kind === "admin"
                ? "Compliance Administrator"
                : business?.name || "Helios Trade Networks"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:border-rose-500/30 transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="size-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
export default AppSidebar;
