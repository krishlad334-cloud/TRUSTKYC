import { Link, useParams } from "react-router-dom";
import {
  businesses,
  initialDocuments as kycDocuments,
  initialDeals as deals,
  riskFlags,
  formatINR,
} from "@/data";
import { TrustGauge } from "@/components/trust-gauge";
import { StatusBadge, Card } from "@/components/ui-kit";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  MapPin,
  Globe,
  Calendar,
  Handshake,
  AlertTriangle,
  ArrowRight,
  Lock,
  Building2,
  ArrowLeft,
} from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const { business: authBusiness } = useAuth();

  // If an id is provided, look in mock businesses or format auth business
  let b = id ? businesses.find((x) => x.id === id) : null;

  // If no ID or not found in mock, check if it's the authenticated user's business
  if (!b && authBusiness) {
    b = {
      id: authBusiness._id,
      name: authBusiness.tradeName || authBusiness.legalName || "TrustGrid Verified Node",
      industry: authBusiness.industry || "Commercial Enterprise",
      location: `${authBusiness.city || authBusiness.registeredAddress?.city || "Mumbai"}, India`,
      website: "https://trustgrid.io",
      founded: authBusiness.incorporationDate
        ? new Date(authBusiness.incorporationDate).getFullYear()
        : "2024",
      trustScore:
        typeof authBusiness.trustScore === "object"
          ? authBusiness.trustScore?.overall || 88
          : authBusiness.trustScore || 88,
      kycStatus: authBusiness.kycStatus || "VERIFIED",
      registration: authBusiness.cin || "U72200MH2024PTC123456",
      gstin: authBusiness.gstin || "27AABCU9603R1ZM",
      pan: authBusiness.pan || "AABCU9603R",
      logo: (authBusiness.tradeName || authBusiness.legalName || "TG").slice(0, 2).toUpperCase(),
    };
  }

  // Fallback to first mock business if completely unseeded
  if (!b) {
    b = businesses[0];
  }

  const docs = kycDocuments.filter((d) => d.status === "verified");
  const completed = deals.filter((d) => d.status === "completed").length;
  const active = deals.filter((d) => d.status === "active").length;

  return (
    <div className="min-h-screen relative bg-background text-foreground">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[350px] w-[700px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-10 px-6 lg:px-12 h-16 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/business"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <CompanyLogo size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground px-2.5 py-1 rounded-full border border-border bg-muted/30">
            <ShieldCheck className="h-3 w-3 text-primary" /> Verified Trust Dossier
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-6">
        {/* Header Hero Card */}
        <Card className="p-6 sm:p-8 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex items-start gap-5 flex-1">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground font-display font-bold text-2xl flex items-center justify-center shrink-0 shadow-md border border-primary/20">
                {b.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={b.kycStatus} />
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Accredited by TrustGrid
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {b.name}
                </h1>
                <div className="text-xs text-muted-foreground font-medium mt-1">{b.industry}</div>

                <div className="flex flex-wrap gap-4 mt-3.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {b.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary" /> {b.website}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Founded {b.founded}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              <TrustGauge score={b.trustScore} size={150} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-border">
            <Stat label="Reg. Number" value={b.registration} mono />
            <Stat label="GSTIN Identifier" value={b.gstin} mono />
            <Stat label="PAN Status" value={b.pan} mono />
            <Stat label="Active Deals" value={String(active)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/business/deals"
              className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-primary/20"
            >
              <Handshake className="h-4 w-4" />
              <span>Initiate B2B Deal</span>
            </Link>
            <Link
              to="/business/shared"
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            >
              <Lock className="h-4 w-4" />
              <span>Request Full Credential Pass</span>
            </Link>
          </div>
        </Card>

        {/* Documents + Flags Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified KYC Credentials</span>
            </h3>
            <div className="divide-y divide-border">
              {docs.map((d) => (
                <div key={d.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{d.type}</div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        Verified {d.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status="verified" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>Raw binary contents are encrypted in zero-knowledge storage.</span>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="p-5">
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-3">
                Deal Performance History
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="font-mono text-xl font-bold text-foreground">{completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="font-mono text-xl font-bold text-foreground">{active}</div>
                  <div className="text-xs text-muted-foreground">Active Deals</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="font-mono text-base font-bold text-foreground">
                    {formatINR(16_500_000)}
                  </div>
                  <div className="text-xs text-muted-foreground">Settled Value</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    98%
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Risk & Compliance Flags</span>
              </h4>
              <div className="space-y-2">
                {riskFlags.slice(0, 2).map((f) => (
                  <div
                    key={f.id}
                    className="text-xs text-muted-foreground py-1.5 px-2.5 rounded-lg bg-muted/20 border border-border flex items-center gap-2"
                  >
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        f.severity === "high"
                          ? "bg-rose-500"
                          : f.severity === "medium"
                            ? "bg-amber-500"
                            : "bg-primary"
                      }`}
                    />
                    <span className="truncate">{f.title}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="p-3 rounded-xl bg-muted/30 border border-border">
      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`text-xs font-semibold text-foreground mt-0.5 truncate ${mono ? "font-mono" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
