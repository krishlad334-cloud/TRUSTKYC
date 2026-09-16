import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, PageHeader } from "@/components/ui-kit";
import {
  Bell,
  Eye,
  LockKeyhole,
  Trash2,
  Camera,
  ChevronRight,
  X,
  Save,
  Building2,
  ShieldCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { business, fetchUserProfile, logout } = useAuth();

  const fileInputRef = useRef(null);

  const [prefs, setPrefs] = useState({
    verifications: true,
    deals: true,
    score: true,
    flags: true,
  });

  const [vis, setVis] = useState("Summary");

  const [formData, setFormData] = useState({
    legalName: "",
    tradeName: "",
    companyType: "",
    logo: null,
  });

  const [originalData, setOriginalData] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

  useEffect(() => {
    if (business) {
      const data = {
        legalName: business.legalName || business.legal_name || "",
        tradeName: business.tradeName || business.trade_name || "",
        companyType: business.companyType || business.company_type || "",
        logo: business.logo || business.logoUrl || null,
      };

      setFormData(data);
      setOriginalData(data);
    }
  }, [business]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || !!logoFile;

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, SVG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be under 2MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setLogoFile(file);
    setFormData((prev) => ({
      ...prev,
      logo: preview,
    }));
    toast.success("Logo selected for upload");
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    setLogoFile(null);
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
    toast.success("Logo marked for removal");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise((r) => setTimeout(r, 600));

      setOriginalData(formData);
      setLogoFile(null);
      toast.success("Organization profile updated successfully (Demo State)");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountLoading) return;
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your organization account? Active deals and verified badges will be temporarily suspended.",
    );
    if (!confirmed) return;

    try {
      setDeleteAccountLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Your business account has been deactivated (Demo).");
      logout();
    } catch {
      toast.error("Failed to deactivate account");
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  const initials =
    formData.tradeName || formData.legalName
      ? (formData.tradeName || formData.legalName).slice(0, 2).toUpperCase()
      : "TG";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <PageHeader
        kicker="Organization Settings"
        title="Settings & Governance"
        description="Configure entity branding, counterparty visibility, notification triggers, and security credentials."
      />

      {/* Business Branding Profile Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Entity Profile & Branding</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your official company emblem displayed on your public verified dossier and
              certificates.
            </p>
          </div>
          {business?.kycStatus && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-center">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>KYC: {business.kycStatus}</span>
            </span>
          )}
        </div>

        <div className="pt-6 space-y-6">
          {/* Logo Upload Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group h-24 w-24 rounded-2xl overflow-hidden border-2 border-border hover:border-primary bg-muted/40 shadow-sm cursor-pointer transition-all flex items-center justify-center"
              >
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Company emblem"
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-primary">
                    <span className="text-2xl font-bold font-display">{initials}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Upload</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="h-6 w-6" />
                </div>
              </div>

              {formData.logo && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  title="Remove logo"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">Organization Emblem</h4>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                PNG, JPG, or SVG. Maximum file size: 2MB. Recommended dimensions: 400x400 square.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 mt-2 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Choose Image File</span>
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="grid sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={formData.legalName || "—"}
                disabled
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground cursor-not-allowed font-medium"
              />
              <span className="text-[11px] text-muted-foreground">
                Verified via Ministry / Registry records. Cannot be changed manually.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company Constitution Type
              </label>
              <input
                type="text"
                value={(formData.companyType || "—").replaceAll("_", " ")}
                disabled
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground cursor-not-allowed font-medium"
              />
              <span className="text-[11px] text-muted-foreground">
                Determined by your certificate of incorporation.
              </span>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-3 border-t border-border">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-lg inline-flex items-center gap-2 shadow-sm shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Changes…" : "Save Profile Changes"}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications & Subscriptions */}
      <Card className="p-6 sm:p-8">
        <div className="mb-5 pb-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span>Compliance & Notification Feeds</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Specify automated email alerts and real-time dashboard notifications.
          </p>
        </div>

        <div className="divide-y divide-border">
          {[
            {
              k: "verifications",
              title: "Verification & OCR Alerts",
              desc: "Instant notifications when documents are screened, approved, or flagged for review.",
            },
            {
              k: "deals",
              title: "Deal State & Milestones",
              desc: "Alerts when counterparties sign agreements, accept deal terms, or initiate disputes.",
            },
            {
              k: "score",
              title: "Trust Score Recalculation",
              desc: "Periodic updates whenever mathematical factor adjustments alter your composite score.",
            },
            {
              k: "flags",
              title: "Risk Flag & Forensic Warnings",
              desc: "Urgent notifications if external court records, MCA defaults, or GST discrepancies occur.",
            },
          ].map(({ k, title, desc }) => (
            <div key={k} className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-foreground">{title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPrefs((prev) => ({
                    ...prev,
                    [k]: !prev[k],
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  prefs[k] ? "bg-primary" : "bg-muted border border-border"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow-md ring-0 transition duration-200 ease-in-out ${
                    prefs[k] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy and Security Columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Privacy Configuration */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span>Public Directory Visibility</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Control the depth of intelligence visible to peer organizations.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: "Full",
                label: "Full Accredited Dossier",
                desc: "Shows composite score, factor breakdown, and registry timestamps.",
              },
              {
                id: "Summary",
                label: "Executive Summary",
                desc: "Shows overall Trust Score and verified badges without factor breakdowns.",
              },
              {
                id: "Score Only",
                label: "Score Badge Only",
                desc: "Hides financial metrics; displays only certified Trust Score digit.",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setVis(option.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  vis === option.id
                    ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{option.label}</span>
                  {vis === option.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-[11px] text-muted-foreground">{option.desc}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Security & Access */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-primary" />
                <span>Security & Credentials</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Manage login credentials and cryptographic passkeys.
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-2">
              <div className="text-xs font-semibold text-foreground">Account Password</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ensure strong credentials with minimum 8 characters, numbers, and special
                characters.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => navigate("/change-password")}
              className="btn-primary w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-primary/20"
            >
              <span>Change Password</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/30 bg-destructive/5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Danger Zone</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Deactivating your organization will instantly revoke public credential access, disable
              active share tokens, and archive ongoing deals. Account reactivation requires
              compliance review.
            </p>
          </div>

          <button
            onClick={handleDeleteAccount}
            disabled={deleteAccountLoading}
            className="px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{deleteAccountLoading ? "Deactivating…" : "Deactivate Account"}</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
