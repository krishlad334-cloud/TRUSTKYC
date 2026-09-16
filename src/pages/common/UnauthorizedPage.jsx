import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const targetPath =
    user?.role === "ADMIN" || user?.scope === "SYSTEM"
      ? "/admin/dashboard"
      : user
        ? "/business/dashboard"
        : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center bg-card border border-border p-8 rounded-2xl shadow-xs space-y-5">
        <div className="size-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="size-7" />
        </div>

        <div>
          <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
            Access Restricted
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Your current account role does not have authorization to access this area. Access is
            strictly governed by enterprise role-based permissions.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to={targetPath}
            className="btn-primary inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold rounded-xl shadow-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Authorized Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
