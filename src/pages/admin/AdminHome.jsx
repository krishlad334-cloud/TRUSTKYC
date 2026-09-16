import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  AlertOctagon,
  Flag,
  Check,
  X,
  ArrowUpRight,
  Activity,
  Bell,
} from "lucide-react";
import { Card, SectionTitle, StatCard, StatusBadge, PageHeader } from "@/components/ui-kit";
import { getDocuments, getBusinesses, getDeals, updateDocumentStatus } from "@/utils/storage";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AdminHome() {
  const [documents, setDocuments] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [deals, setDeals] = useState([]);

  const loadData = () => {
    setDocuments(getDocuments());
    setBusinesses(getBusinesses());
    setDeals(getDeals());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("trustgrid:data_update", handleUpdate);
    return () => window.removeEventListener("trustgrid:data_update", handleUpdate);
  }, []);

  const pending = documents.filter((d) => d.status?.toLowerCase() === "pending").length;
  const flagged = businesses.filter((b) => (b.trustScore || 0) < 50).length;
  const disputed = deals.filter((d) => d.status?.toLowerCase() === "disputed").length;

  const queue = documents.slice(0, 5);

  const handleQuickStatus = (doc, newStatus) => {
    updateDocumentStatus(doc._id || doc.id, newStatus);
    toast.success(
      `${newStatus === "verified" ? "Approved" : "Rejected"} ${doc.name || doc.documentType} for ${doc.businessName || "Entity"}`,
    );
    loadData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="System Administration"
        title="Compliance Operations Center"
        description="Global verification queue dispatch, forensic screening status, counterparty disputes, and network health."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>Network Status: Optimal</span>
            </span>
          </div>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Entities"
          value={businesses.length.toLocaleString()}
          delta="↑ 4.2% wow"
          icon={<Users className="size-4" />}
        />
        <StatCard
          label="Pending Queue"
          value={String(pending)}
          delta="Avg 6h to resolve"
          icon={<ShieldCheck className="size-4" />}
          accent="warning"
        />
        <StatCard
          label="Flagged Entities"
          value={String(flagged)}
          delta="Manual review req."
          icon={<Flag className="size-4" />}
          accent="destructive"
        />
        <StatCard
          label="Active Disputes"
          value={String(disputed)}
          delta="2 escalated"
          icon={<AlertOctagon className="size-4" />}
          accent="destructive"
        />
      </div>

      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Real-Time KYC Verification Queue</SectionTitle>
          <Link
            to="/admin/kyc"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Full KYC Dispatch</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground h-10">
                <th className="text-left px-4">Entity</th>
                <th className="text-left px-4">Document Type</th>
                <th className="text-left px-4">Uploaded</th>
                <th className="text-center px-4">Status</th>
                <th className="text-right px-4">Quick Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {queue.map((q) => (
                <tr key={q._id || q.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground text-xs">
                    {q.businessName || "Helios Trade Networks"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {q.name || q.documentType}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {q.uploadedAt ? new Date(q.uploadedAt).toISOString().split("T")[0] : "Recent"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => handleQuickStatus(q, "verified")}
                        className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center cursor-pointer justify-center transition-colors"
                        title="Approve"
                      >
                        <Check className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickStatus(q, "rejected")}
                        className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 flex items-center cursor-pointer justify-center transition-colors"
                        title="Reject"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <SectionTitle>Platform Telemetry & Operational Alerts</SectionTitle>
        </div>

        <div className="space-y-2.5">
          {[
            {
              sev: "High",
              text: "GST Registry API latency spiked above 2.1s for 12 minutes.",
              time: "10 mins ago",
            },
            {
              sev: "Medium",
              text: "OCR confidence below 85% on 3 commercial invoice submissions.",
              time: "1 hour ago",
            },
            {
              sev: "Low",
              text: "Scheduled database backup & compliance snapshot window: Sat 02:00–04:00 IST.",
              time: "Today",
            },
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-medium text-foreground truncate">{a.text}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-muted-foreground font-mono">{a.time}</span>
                <StatusBadge status={a.sev} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
