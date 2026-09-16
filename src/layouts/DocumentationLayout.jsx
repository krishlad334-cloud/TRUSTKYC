import { Outlet, Link } from "react-router-dom";
import { Sun, Moon, ArrowLeft, ShieldCheck, LayoutDashboard } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import CompanyLogo from "../components/ui/CompanyLogo";

export default function DocumentationLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const returnLink = !isAuthenticated
    ? "/"
    : user?.scope === "SYSTEM" || user?.role === "ADMIN"
      ? "/admin/dashboard"
      : "/business/dashboard";

  const returnLabel = !isAuthenticated
    ? "Return to Home"
    : user?.scope === "SYSTEM" || user?.role === "ADMIN"
      ? "Admin Console"
      : "Business Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CompanyLogo to="/" />
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border text-xs font-mono text-muted-foreground">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
              Docs Portal
            </span>
            <span>v2.4.0 (Static Demo)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={returnLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground shadow-xs transition-all active:scale-95"
          >
            {isAuthenticated ? (
              <LayoutDashboard className="size-3.5 text-primary" />
            ) : (
              <ArrowLeft className="size-3.5" />
            )}
            <span>{returnLabel}</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-card shadow-xs transition-all hover:bg-muted active:scale-95 text-foreground cursor-pointer"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">{children || <Outlet />}</main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-xs text-muted-foreground">
        <p>TrustKYC™ B2B KYC & Identity Verification Network — 100% Static Frontend Architecture</p>
      </footer>
    </div>
  );
}
