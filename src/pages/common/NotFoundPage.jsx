import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NotFoundPage() {
  const { user } = useAuth();
  const returnPath =
    user?.role === "ADMIN" || user?.scope === "SYSTEM"
      ? "/admin/dashboard"
      : user
        ? "/business/dashboard"
        : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center bg-card border border-border p-8 rounded-2xl shadow-xs">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6">
          <span className="font-mono text-2xl font-black">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
          Route Not Found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The requested compliance route or dossier does not exist or has been relocated.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to={returnPath}
            className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-semibold shadow-xs"
          >
            Return to Dashboard
          </Link>
          <Link
            to="/documentation"
            className="btn-secondary inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-semibold border border-border hover:bg-muted"
          >
            Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
