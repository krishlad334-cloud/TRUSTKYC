import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Building2,
  Shield,
  FileCheck2,
  BookOpen,
  Check,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().min(1, "Work email is required").email("Enter a valid work email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Landing() {
  const navigate = useNavigate();
  const { login, loginAsBusiness, loginAsAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Role toggle: "BUSINESS" | "ADMIN"
  const [selectedRole, setSelectedRole] = useState("BUSINESS");
  const [email, setEmail] = useState("KRISHLAD123@GMAIL.COM");
  const [password, setPassword] = useState("KISHU@0209");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Switch role tab and update credentials
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrors({});
    if (role === "BUSINESS") {
      setEmail("KRISHLAD123@GMAIL.COM");
      setPassword("KISHU@0209");
    } else {
      setEmail("SMIT123@GMAIL.COM");
      setPassword("YANA@0723");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const validatedData = loginSchema.parse({ email, password });
      setErrors({});

      await login(validatedData);
      toast.success(
        `Signed in successfully as ${selectedRole === "ADMIN" ? "Compliance Officer" : "Business Entity"}`,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
      toast.error(error?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* ── 1. MINIMAL NAVBAR ── */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/85 border-b border-border/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <CompanyLogo size="md" to="/" />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#security" className="hover:text-foreground transition-colors">
                Security
              </a>
              <Link
                to="/documentation"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 font-semibold"
              >
                <BookOpen className="size-3.5" />
                <span>Docs</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="size-9 rounded-xl border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <a
              href="#login-card"
              className="hidden sm:inline-flex text-xs font-semibold px-3.5 py-2 rounded-xl text-foreground hover:bg-muted transition-colors"
            >
              Sign In
            </a>

            <Link
              to="/register"
              className="btn-primary text-xs font-semibold px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1"
            >
              <span>Register Business</span>
              <ArrowRight className="size-3.5 hidden sm:inline" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden size-9 rounded-xl border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                How It Works
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Security
              </a>
              <Link
                to="/documentation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-primary font-semibold hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <BookOpen className="size-4" />
                <span>Documentation Portal</span>
              </Link>
            </nav>
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <a
                href="#login-card"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO + LOGIN SECTION (FIRST VIEWPORT) ── */}
      <section className="relative flex-1 flex items-center py-12 md:py-18 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
                <ShieldCheck className="size-3.5" />
                <span>Enterprise KYC & Identity Verification</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground leading-[1.15]">
                Simple, Secure KYC for Your Business
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Automate statutory document collection, cross-check verified entity registries, and
                evaluate counterparty trust on a single, audit-ready compliance platform.
              </p>

              {/* Clean 3-point value proposition */}
              <div className="pt-2 space-y-3">
                {[
                  "Instant GSTIN, PAN, and MCA statutory verification",
                  "Automated OCR data extraction with confidence scoring",
                  "Immutable cryptographic audit trails and counterparty trust scores",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="size-3 stroke-[2.5]" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Minimal Trust Strip */}
              <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>SOC 2 Aligned</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>256-Bit AES Vault</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>100% Client-Side Demo</span>
                </span>
              </div>
            </div>

            {/* Right Column: Clean, Spacious Login Card */}
            <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto lg:mx-0">
              <div
                id="login-card"
                className="bg-card border border-border/90 rounded-2xl p-6 sm:p-8 shadow-sm transition-all relative"
              >
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
                    Sign in to TrustGrid
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a workspace role to access the interactive demo.
                  </p>
                </div>

                {/* Role Switcher: Business | Admin */}
                <div className="mb-5">
                  <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => handleRoleChange("BUSINESS")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                        selectedRole === "BUSINESS"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Building2 className="size-3.5" />
                      <span>Business</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange("ADMIN")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                        selectedRole === "ADMIN"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Shield className="size-3.5" />
                      <span>Admin</span>
                    </button>
                  </div>

                  {/* Active Persona Indicator */}
                  <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {selectedRole === "BUSINESS" ? "Krish Lad" : "Smit Patel"}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-primary font-semibold">
                      {selectedRole === "BUSINESS"
                        ? "Helios Trade Networks"
                        : "Compliance Operations"}
                    </span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                      required
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-foreground">Password</label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] text-primary hover:underline font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 px-3.5 pr-10 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full h-11 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                  >
                    {loading ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <span>
                          {selectedRole === "ADMIN"
                            ? "Sign In as Admin"
                            : "Sign In to Business Portal"}
                        </span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Demo Evaluation Shortcut */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Demo shortcuts:</span>
                  <button
                    type="button"
                    onClick={selectedRole === "BUSINESS" ? loginAsBusiness : loginAsAdmin}
                    className="text-primary hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>Instant 1-Click Sign In</span>
                  </button>
                </div>

                {/* Register Link */}
                <div className="mt-4 pt-3 border-t border-border text-center text-xs text-muted-foreground">
                  <span>Don&apos;t have an account?</span>{" "}
                  <Link to="/register" className="font-semibold text-primary hover:underline">
                    Register Business
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES SECTION (CLEAN & SPACIOUS) ── */}
      <section id="features" className="py-20 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-2">
              Everything Needed for Corporate Verification
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              A comprehensive toolkit designed specifically for compliance officers, operations
              teams, and enterprise finance managers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-card p-6 sm:p-7 rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Automated Verification
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Multi-registry checks validate GSTIN status, Corporate Identification Numbers (CIN),
                and corporate PANs in seconds against official databases.
              </p>
            </div>

            <div className="bg-card p-6 sm:p-7 rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <FileCheck2 className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Intelligent Document OCR
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Optical character recognition parses statutory certificates and bank statements,
                flagging discrepancies and calculating verification confidence scores.
              </p>
            </div>

            <div className="bg-card p-6 sm:p-7 rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Building2 className="size-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Counterparty Trust Scores
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Weighted trust indexes combine verification recency, commercial milestones, and
                regulatory standing into an actionable 0–100 risk score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS SECTION ── */}
      <section id="how-it-works" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Simplified Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-2">
              Three Steps to Full Accreditation
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Streamline supplier and vendor onboarding with zero paperwork and instant review.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-card border border-border">
              <div className="font-mono text-xs font-bold text-primary mb-2">STEP 01</div>
              <h3 className="text-base font-semibold text-foreground">Upload Statutory Dossier</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Provide corporate tax identifiers, incorporation certificates, and authorized
                signatory details through a guided submission wizard.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-card border border-border">
              <div className="font-mono text-xs font-bold text-primary mb-2">STEP 02</div>
              <h3 className="text-base font-semibold text-foreground">Automated OCR Validation</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Our verification engine cross-references registration databases, validates digital
                signatures, and runs sanctions screening.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-card border border-border">
              <div className="font-mono text-xs font-bold text-primary mb-2">STEP 03</div>
              <h3 className="text-base font-semibold text-foreground">Accreditation & Trade</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Receive an audit-grade Trust Score, share permissioned verification badges, and
                initiate protected commercial agreements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECURITY & GOVERNANCE SECTION ── */}
      <section id="security" className="py-20 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Enterprise Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-2">
              Bank-Grade Governance by Design
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Zero-trust architecture ensures data privacy and regulatory alignment at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h4 className="font-semibold text-sm text-foreground">256-Bit Encrypted Vault</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                All statutory artifacts are encrypted in transit and at rest with strict
                compartmentalized access keys.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h4 className="font-semibold text-sm text-foreground">Role-Based Access Control</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Distinct permission boundaries separate corporate uploaders from administrative
                compliance decision makers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h4 className="font-semibold text-sm text-foreground">Immutable Audit Trails</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Every document review, status change, and login event is logged with chronological
                timestamps for forensic audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. MINIMAL ENTERPRISE FOOTER ── */}
      <footer className="border-t border-border bg-background py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CompanyLogo size="sm" to="/" />
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TrustGrid Technologies. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
            <Link to="/documentation" className="hover:text-foreground transition-colors">
              Documentation
            </Link>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#security" className="hover:text-foreground transition-colors">
              Security
            </a>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
