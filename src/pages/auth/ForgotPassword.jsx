import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Mail, Loader2, Clock3, ArrowLeft, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { useTheme } from "@/context/ThemeContext";

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (loading || timer > 0) return;

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || "Invalid email");
      return;
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Demo Password Reset link dispatched", {
        description: `Recovery instructions simulated for ${email}. You can reset password on the reset page.`,
      });
      setTimer(60);
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

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
            <ArrowLeft className="size-4" /> Back to Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl relative overflow-hidden">
            {/* Subtle top brand bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="size-3" /> Account Recovery
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mt-3">
                Forgot password?
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your registered business email and we&apos;ll send you a secure verification
                link to reset your credentials.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Corporate Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="compliance@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="form-input w-full pl-10"
                  />
                </div>
              </div>

              {timer > 0 && (
                <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-center justify-between gap-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Clock3 className="size-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Reset link dispatched</p>
                      <p className="text-xs text-muted-foreground">
                        Wait for cooldown before resending
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {formatTime(timer)}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || timer > 0}
                className="btn-primary w-full justify-center text-sm font-semibold py-2.5 shadow-md shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Dispatching Link…
                  </>
                ) : (
                  <>
                    Send Reset Link <ArrowRight className="size-4 ml-1" />
                  </>
                )}
              </button>

              <div className="pt-4 text-center border-t border-border mt-6">
                <Link
                  to="/"
                  className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="size-3.5" /> Return to secure sign-in
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              Protected by TrustKYC Enterprise Security • 256-bit TLS Encrypted
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
