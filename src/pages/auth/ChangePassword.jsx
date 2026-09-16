import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Undo2,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { z } from "zod";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { useTheme } from "@/context/ThemeContext";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, "Current password is required"),
    newPassword: z.string().trim().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangePassword() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = changePasswordSchema.safeParse(formData);
    if (!validation.success) {
      const errors = validation.error.flatten();
      const errorMessage =
        errors.formErrors[0] ||
        errors.fieldErrors.currentPassword?.[0] ||
        errors.fieldErrors.newPassword?.[0] ||
        errors.fieldErrors.confirmPassword?.[0];

      return toast.error(errorMessage);
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));

      toast.success("Password updated successfully!", {
        description: "Your new security credential is now active in demo state.",
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      navigate("/dashboard");
    } catch {
      toast.error("Failed to change password. Please try again.");
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
            to="/dashboard"
            className="btn-ghost text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            <Undo2 className="size-4" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="size-3.5" /> Security Credentials
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mt-3">
                Update Security Password
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Maintain enterprise security compliance by rotating your credentials regularly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                show={showPassword.current}
                toggle={() => togglePassword("current")}
                placeholder="Enter existing password"
              />

              <PasswordInput
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                show={showPassword.new}
                toggle={() => togglePassword("new")}
                placeholder="Min. 6 characters"
              />

              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                show={showPassword.confirm}
                toggle={() => togglePassword("confirm")}
                placeholder="Confirm new password"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-sm font-semibold py-2.5 shadow-md shadow-primary/20 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving Changes…
                  </>
                ) : (
                  <>
                    Update Password <ArrowRight className="size-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">TrustKYC Identity & Access Governance</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, show, toggle, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="form-input w-full pl-10 pr-10"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
