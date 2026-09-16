import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import {
  Link2,
  Copy,
  Eye,
  ShieldCheck,
  Share2,
  Plus,
  Clock,
  CheckCircle2,
  ExternalLink,
  Lock,
  Calendar,
  Trash2,
  QrCode,
  FileText,
  AlertCircle,
  Building2,
  Check,
  KeyRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function SharedPage() {
  const { business, user } = useAuth();
  const [copiedId, setCopiedId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Active secure sharing links
  const [activeShares, setActiveShares] = useState([
    {
      id: "sh-8821",
      recipient: "Axis Bank Credit Risk Team",
      scope: "Full KYC & Financial Dossier",
      createdAt: "2026-03-10",
      expiresAt: "2026-04-10",
      views: 14,
      status: "ACTIVE",
      pinProtected: true,
      lastViewed: "2 hours ago",
    },
    {
      id: "sh-7419",
      recipient: "Tata Steel Procurement Desk",
      scope: "GSTIN, MCA & Bank Verification",
      createdAt: "2026-03-05",
      expiresAt: "2026-03-25",
      views: 8,
      status: "ACTIVE",
      pinProtected: false,
      lastViewed: "1 day ago",
    },
    {
      id: "sh-6204",
      recipient: "HDFC Commercial Lending",
      scope: "Credit Score & Deal Ledger",
      createdAt: "2026-02-15",
      expiresAt: "2026-03-01",
      views: 22,
      status: "EXPIRED",
      pinProtected: true,
      lastViewed: "15 days ago",
    },
  ]);

  // Form state for creating a new share pass
  const [newShare, setNewShare] = useState({
    recipient: "",
    scope: "Full KYC & Verified Docs",
    expiryDays: "14",
    pinProtected: true,
  });

  const myProfileId = business?._id || "tkyc-enterprise-node";
  const myTradeName = business?.tradeName || business?.legalName || "TrustKYC Verified Enterprise";
  const publicUrl = `${window.location.origin}/profile/${myProfileId}`;

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateShare = (e) => {
    e.preventDefault();
    if (!newShare.recipient.trim()) {
      return toast.error("Please enter the counterparty or institution name");
    }

    const created = new Date();
    const expiry = new Date();
    expiry.setDate(created.getDate() + parseInt(newShare.expiryDays || "14", 10));

    const newEntry = {
      id: `sh-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: newShare.recipient.trim(),
      scope: newShare.scope,
      createdAt: created.toISOString().split("T")[0],
      expiresAt: expiry.toISOString().split("T")[0],
      views: 0,
      status: "ACTIVE",
      pinProtected: newShare.pinProtected,
      lastViewed: "Never",
    };

    setActiveShares([newEntry, ...activeShares]);
    setShowCreateModal(false);
    setNewShare({
      recipient: "",
      scope: "Full KYC & Verified Docs",
      expiryDays: "14",
      pinProtected: true,
    });
    toast.success(`Secure share token created for ${newEntry.recipient}`);
  };

  const revokeShare = (id) => {
    setActiveShares((prev) => prev.map((s) => (s.id === id ? { ...s, status: "REVOKED" } : s)));
    toast.info("Share access link revoked");
  };

  const deleteShare = (id) => {
    setActiveShares((prev) => prev.filter((s) => s.id !== id));
    toast.success("Share record deleted");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        kicker="Credential Exchange"
        title="Shared Passes & Data Rooms"
        description="Generate encrypted, time-limited credential packages to share verified business credentials and audit-ready KYC proofs with counterparties."
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Secure Pass</span>
          </button>
        }
      />

      {/* Primary Organization Dossier Card */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-primary/5 via-card to-accent/5 border-primary/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Master Company Dossier
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> Live & Verified
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground mt-0.5">{myTradeName}</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Your canonical public verification passport. Contains your accredited Trust Score,
                registry filings, and verified badge for external counterparties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setShowQrModal(true)}
              className="btn-secondary px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
            >
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Preview Live</span>
            </a>
            <button
              onClick={() => copyToClipboard(publicUrl, "master")}
              className="btn-primary px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
            >
              {copiedId === "master" ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Master Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Master Link display field */}
        <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border text-xs font-mono text-muted-foreground overflow-hidden">
            <Link2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{publicUrl}</span>
          </div>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            Publicly visible to any counterparty with the link
          </span>
        </div>
      </Card>

      {/* Active Shares Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Targeted Counterparty Passes
            </h3>
            <p className="text-xs text-muted-foreground">
              Encrypted, scoped access links issued to specific banks, vendors, or institutional
              partners.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {activeShares.filter((s) => s.status === "ACTIVE").length} active passes
          </span>
        </div>

        <div className="grid gap-3.5">
          {activeShares.map((item) => {
            const shareUrl = `${publicUrl}?pass=${item.id}`;
            const isActive = item.status === "ACTIVE";

            return (
              <Card
                key={item.id}
                className={`p-4 sm:p-5 transition-all ${
                  isActive ? "hover:border-primary/30" : "opacity-75 bg-muted/20 border-dashed"
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-foreground text-sm truncate">
                          {item.recipient}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : item.status === "EXPIRED"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.pinProtected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Lock className="h-2.5 w-2.5" /> PIN Protected
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-primary" />
                          <span className="font-medium text-foreground">{item.scope}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expires: {item.expiresAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Eye className="h-3 w-3" />
                          {item.views} views (last: {item.lastViewed})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                    <button
                      onClick={() => copyToClipboard(shareUrl, item.id)}
                      disabled={!isActive}
                      className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    {isActive ? (
                      <button
                        onClick={() => revokeShare(item.id)}
                        className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-colors cursor-pointer"
                        title="Revoke access immediately"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteShare(item.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-bar with Token URL */}
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <div className="truncate max-w-xl">
                    <span className="text-foreground/70">Token URL: </span>
                    <span>{shareUrl}</span>
                  </div>
                  <span className="shrink-0 text-foreground/60 ml-2">ID: {item.id}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Share Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-6 space-y-5 border-border shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Create Secure Share Pass</h3>
                  <p className="text-xs text-muted-foreground">
                    Grant scoped, time-limited verification access to an external counterparty.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShare} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Counterparty Organization / Recipient
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICICI Bank Underwriting, Reliance Retail Vendor Desk"
                  value={newShare.recipient}
                  onChange={(e) => setNewShare({ ...newShare, recipient: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg form-input text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Credential Scope</label>
                <select
                  value={newShare.scope}
                  onChange={(e) => setNewShare({ ...newShare, scope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg form-input text-sm outline-none cursor-pointer"
                >
                  <option value="Full KYC & Financial Dossier">
                    Full KYC & Financial Dossier (All Documents)
                  </option>
                  <option value="GSTIN, MCA & Bank Verification">
                    Registry Proofs Only (GSTIN, MCA & Bank)
                  </option>
                  <option value="Credit Score & Deal Ledger">
                    Credit & Deal Performance History Only
                  </option>
                  <option value="Trust Badge & Verification Certificate">
                    Trust Badge & Verified Status Only
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Validity Period</label>
                  <select
                    value={newShare.expiryDays}
                    onChange={(e) => setNewShare({ ...newShare, expiryDays: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg form-input text-sm outline-none cursor-pointer"
                  >
                    <option value="1">24 Hours (Urgent Review)</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days (Standard)</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days (Quarterly Audit)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Security Mode</label>
                  <div className="flex items-center h-10 px-3 rounded-lg border border-border bg-card">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={newShare.pinProtected}
                        onChange={(e) =>
                          setNewShare({ ...newShare, pinProtected: e.target.checked })
                        }
                        className="rounded accent-primary"
                      />
                      <span>Require OTP / PIN</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  All counterparty access will be logged with timestamp, IP address, and document
                  view activity in your compliance audit trail.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary px-4 py-2 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg"
                >
                  Issue Secure Pass
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 text-center space-y-4 border-border shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground">Verified Entity QR Code</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Generated Mock QR frame */}
            <div className="p-5 rounded-2xl bg-white text-slate-900 mx-auto w-48 h-48 flex flex-col items-center justify-center border-4 border-primary/20 shadow-inner">
              <QrCode className="h-32 w-32 text-slate-900" />
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">{myTradeName}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Scan to instantly view verified KYC credentials on any mobile device
              </p>
            </div>

            <button
              onClick={() => {
                copyToClipboard(publicUrl, "qr-copy");
                setShowQrModal(false);
              }}
              className="btn-primary w-full py-2 text-xs font-semibold rounded-lg"
            >
              Copy Link & Close
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
