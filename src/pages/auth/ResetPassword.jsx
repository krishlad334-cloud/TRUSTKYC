import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Undo2,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { useTheme } from "@/context/ThemeContext";

const resetPasswordSchema = z
  .object({
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().trim(),
    token: z.string().min(1, "Invalid reset link"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "demo-reset-token-2026";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const validation = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
      token,
    });

    if (!validation.success) {
      const errors = validation.error.flatten();
      const firstError =
        errors.formErrors?.[0] ||
        errors.fieldErrors?.confirmPassword?.[0] ||
        errors.fieldErrors?.password?.[0] ||
        "Validation failed";

      return toast.error(firstError);
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));

      toast.success("Password reset successfully!", {
        description: "Your new password is now active. Redirecting to sign in...",
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "None", color: "bg-muted" };
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;

    if (s <= 2) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (s <= 3) return { score: 2, label: "Medium", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

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
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="size-3" /> Credential Update
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mt-3">
                Reset your password
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Set a strong, compliant password for your business account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="form-input w-full pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Strength:</span>
                      <span className="font-medium text-foreground">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1.5">
                      <div
                        className={`rounded-full ${strength.score >= 1 ? strength.color : "bg-muted"}`}
                      />
                      <div
                        className={`rounded-full ${strength.score >= 2 ? strength.color : "bg-muted"}`}
                      />
                      <div
                        className={`rounded-full ${strength.score >= 3 ? strength.color : "bg-muted"}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="form-input w-full pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-sm font-semibold py-2.5 shadow-md shadow-primary/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Updating Credentials…
                  </>
                ) : (
                  <>
                    Confirm & Update Password <ArrowRight className="size-4 ml-1" />
                  </>
                )}
              </button>

              <div className="pt-4 text-center border-t border-border mt-6">
                <Link
                  to="/"
                  className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="size-3.5" /> Back to Sign in
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              TrustKYC Identity Protection • Single Sign-On Ready
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
