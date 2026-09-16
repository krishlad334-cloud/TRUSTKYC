import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Eye,
  EyeOff,
  Download,
  Building2,
  Lock,
  Mail,
  Phone,
  User,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import jsPDF from "jspdf";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { useTheme } from "@/context/ThemeContext";

const steps = ["Business Profile", "Administrator Account"];

const registerSchema = z
  .object({
    businessName: z.string().trim().min(2, "Business name must be at least 2 characters"),
    businessType: z.string().trim().min(2, "Business type is required"),
    industry: z.string().trim().min(2, "Industry is required"),
    registeredPhone: z
      .string()
      .trim()
      .length(10, "Phone number must be exactly 10 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    firstname: z.string().trim().min(2, "First name is required"),
    lastname: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("Enter a valid corporate email"),
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().trim().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    businessType: "private_limited",
    industry: "",
    registeredPhone: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const next = () => {
    setStep((prev) => Math.min(prev + 1, 1));
  };

  const prev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    const currentStepFields = {
      0: ["businessName", "businessType", "industry", "registeredPhone"],
      1: ["firstname", "lastname", "email", "password", "confirmPassword"],
    };

    const fields = currentStepFields[step];
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const stepErrors = {};
      let hasError = false;

      fields.forEach((field) => {
        if (fieldErrors[field]) {
          stepErrors[field] = fieldErrors[field];
          hasError = true;
        }
      });

      if (hasError) {
        setErrors(stepErrors);
        toast.error(Object.values(stepErrors)[0]?.[0] || "Please fill required fields correctly");
        return;
      }
    }

    setErrors({});
    next();
  };

  const downloadPDF = () => {
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      toast.error("Please fill in required fields before downloading summary");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("TrustKYC — Business Registration Summary", 20, 20);

    doc.setFontSize(11);
    doc.text("Generated: " + new Date().toLocaleString(), 20, 30);
    doc.text("Verification Status: PENDING ONBOARDING", 20, 36);

    const details = [
      ["Business Legal Name", form.businessName],
      ["Company Type", form.businessType.toUpperCase().replace(/_/g, " ")],
      ["Industry Sector", form.industry],
      ["Registered Mobile Phone", form.registeredPhone],
      ["Authorized Signatory Name", `${form.firstname} ${form.lastname}`],
      ["Primary Work Email", form.email],
    ];

    let y = 50;
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${value}`, 80, y);
      y += 10;
    });

    doc.save(`${form.businessName.replace(/\s+/g, "_") || "trustkyc"}-onboarding-summary.pdf`);
    toast.success("Registration summary downloaded as PDF");
  };

  const submit = async () => {
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0]?.[0] || "Validation failed");
      return;
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));

      toast.success("Business registration successful!", {
        description: `Entity "${form.businessName}" provisioned in demo state. Please sign in.`,
      });
      navigate("/");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* ── LEFT COLUMN: Enterprise Value Props (Desktop) ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-card border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <CompanyLogo size="lg" to="/" />

          <div className="mt-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono text-primary">
              <Sparkles className="size-3.5" />
              <span>Enterprise KYC & Compliance Onboarding</span>
            </div>

            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground leading-snug">
              Verify Once. <br />
              <span className="gradient-text">Transact Anywhere.</span>
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Create your corporate TrustKYC identity. Seamlessly onboard compliance officers,
              upload GSTN/MCA artifacts, and underwrite trust with verified counterparties.
            </p>
          </div>

          <div className="mt-12 space-y-4 max-w-sm">
            {[
              "Automated OCR extraction from GST, PAN, & CIN",
              "Dynamic B2B Trust Score calculation",
              "Encrypted 256-bit AES document vault",
              "Exportable audit logs and dispute protection",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-foreground font-medium">
                <div className="size-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <Check className="size-3" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="p-4 rounded-2xl border border-border bg-muted/30 relative z-10 text-xs text-muted-foreground">
          <p className="italic leading-relaxed">
            &ldquo;TrustKYC reduced our supplier onboarding timeline from 7 business days to under
            15 minutes with complete audit readiness.&rdquo;
          </p>
          <div className="mt-3 font-semibold text-foreground">
            Head of Risk & Compliance · Global Logistics Network
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Registration Form ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="p-6 md:px-12 flex items-center justify-between border-b border-border/60">
          <div className="lg:hidden">
            <CompanyLogo size="sm" to="/" />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="size-9 rounded-xl border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="size-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-xl space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
                Register your business
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Complete the two steps below to register your corporate profile on TrustKYC.
              </p>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-2 gap-3">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`p-3 rounded-xl border transition-all ${
                    i === step
                      ? "border-primary bg-primary/5 text-primary"
                      : i < step
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                        : "border-border bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        i < step
                          ? "bg-emerald-500 text-white"
                          : i === step
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < step ? <Check className="size-3.5" /> : i + 1}
                    </div>
                    <div className="text-xs font-semibold truncate">{s}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Fields Card */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-border space-y-5">
              {/* STEP 0: Business Details */}
              {step === 0 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Business Legal Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={form.businessName}
                        onChange={(e) => set("businessName", e.target.value)}
                        placeholder="Acme Global Technologies Pvt Ltd"
                        className={`form-input pl-10 ${errors.businessName ? "border-rose-500" : ""}`}
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.businessName[0]}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Company Type *
                      </label>
                      <select
                        value={form.businessType}
                        onChange={(e) => set("businessType", e.target.value)}
                        className="form-input cursor-pointer"
                      >
                        <option value="private_limited">Private Limited (Pvt Ltd)</option>
                        <option value="public_limited">Public Limited (Ltd)</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="partnership">Partnership Firm</option>
                        <option value="sole_proprietorship">Sole Proprietorship</option>
                        <option value="others">Other Entity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Industry Sector *
                      </label>
                      <input
                        type="text"
                        value={form.industry}
                        onChange={(e) => set("industry", e.target.value)}
                        placeholder="Fintech, Logistics, SaaS..."
                        className={`form-input ${errors.industry ? "border-rose-500" : ""}`}
                      />
                      {errors.industry && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.industry[0]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Registered Phone Number (10 Digits) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="tel"
                        maxLength={10}
                        value={form.registeredPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          set("registeredPhone", val);
                        }}
                        placeholder="9876543210"
                        className={`form-input pl-10 font-mono ${errors.registeredPhone ? "border-rose-500" : ""}`}
                      />
                    </div>
                    {errors.registeredPhone && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.registeredPhone[0]}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 1: Account Owner */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={form.firstname}
                          onChange={(e) => set("firstname", e.target.value)}
                          placeholder="Jane"
                          className={`form-input pl-10 ${errors.firstname ? "border-rose-500" : ""}`}
                        />
                      </div>
                      {errors.firstname && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.firstname[0]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={form.lastname}
                        onChange={(e) => set("lastname", e.target.value)}
                        placeholder="Doe"
                        className={`form-input ${errors.lastname ? "border-rose-500" : ""}`}
                      />
                      {errors.lastname && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.lastname[0]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Corporate Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="jane.doe@company.com"
                        className={`form-input pl-10 ${errors.email ? "border-rose-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.email[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Password (min. 6 characters) *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        placeholder="••••••••"
                        className={`form-input pl-10 pr-10 ${errors.password ? "border-rose-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.password[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) => set("confirmPassword", e.target.value)}
                        placeholder="••••••••"
                        className={`form-input pl-10 pr-10 ${errors.confirmPassword ? "border-rose-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword[0]}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={downloadPDF}
                      className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 underline cursor-pointer"
                    >
                      <Download className="size-3.5" /> Download Registration Details as PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prev}
                    className="btn-ghost text-xs font-medium px-4 py-2.5 rounded-xl"
                  >
                    <ArrowLeft className="size-3.5 mr-1" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step === 0 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary text-xs font-semibold px-5 py-2.5 rounded-xl"
                  >
                    Next: Account Owner <ArrowRight className="size-3.5 ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={loading}
                    className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-xl"
                  >
                    {loading ? "Registering Business..." : "Complete Registration"}
                    {!loading && <Check className="size-3.5 ml-1" />}
                  </button>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By creating an account, you agree to TrustKYC&apos;s Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
