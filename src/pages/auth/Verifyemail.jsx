import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Undo2,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { useTheme } from "@/context/ThemeContext";

export default function VerifyEmail() {
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const token = searchParams.get("token") || "demo-token";

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await new Promise((r) => setTimeout(r, 600));
        setVerified(true);
        toast.success("Demo Email verified successfully!");

        setTimeout(() => {
          navigate("/");
        }, 2500);
      } catch {
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);
  return (
    <div className="min-h-screen px-4 py-8 flex flex-col bg-background text-foreground transition-colors duration-200">
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-2">
        <CompanyLogo size="md" />
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-all hover:bg-muted active:scale-95 text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/"
            className="btn-ghost text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            <Undo2 className="size-4" /> Back to Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            {loading ? (
              <div className="py-6 space-y-4 animate-in fade-in duration-300">
                <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                  <Loader2 className="size-8 animate-spin" />
                </div>

                <h2 className="text-2xl font-display font-bold text-foreground">
                  Verifying Business Email
                </h2>

                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Validating your cryptographic verification token against the TrustKYC identity
                  registry…
                </p>
              </div>
            ) : verified ? (
              <div className="py-6 space-y-4 animate-in fade-in duration-300">
                <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="size-8" />
                </div>

                <h2 className="text-2xl font-display font-bold text-foreground">
                  Email Verified Successfully
                </h2>

                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Your corporate identity has been verified. Redirecting you automatically to the
                  portal…
                </p>

                <div className="pt-4">
                  <Link
                    to="/"
                    className="btn-primary w-full justify-center text-sm font-semibold py-2.5 shadow-md shadow-primary/20"
                  >
                    Continue to Portal Now <ArrowLeft className="size-4 ml-1 rotate-180" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-4 animate-in fade-in duration-300">
                <div className="size-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500">
                  <XCircle className="size-8" />
                </div>

                <h2 className="text-2xl font-display font-bold text-foreground">
                  Verification Failed
                </h2>

                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  The verification link is either invalid, already used, or has expired. Please
                  request a new activation link.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/forgot-password"
                    className="btn-secondary flex-1 justify-center text-sm font-semibold py-2.5"
                  >
                    Resend Link
                  </Link>
                  <Link
                    to="/"
                    className="btn-primary flex-1 justify-center text-sm font-semibold py-2.5"
                  >
                    Return to Sign in
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              TrustKYC Compliance & Verification Network
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
