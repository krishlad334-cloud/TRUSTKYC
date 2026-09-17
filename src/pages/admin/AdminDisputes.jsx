import { useState, useEffect, useCallback } from "react";
import { Card, PageHeader } from "@/components/ui-kit";
import { formatINR } from "@/data";
import {
  AlertOctagon,
  X,
  ShieldOff,
  ShieldCheck,
  ArrowUpRight,
  Scale,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { getDeals, updateDealStatus, addAuditLog } from "@/utils/storage";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [open, setOpen] = useState(null);

  const loadDisputes = useCallback(() => {
    const all = getDeals();
    const disputed = all.filter((d) => d.status === "disputed");
    setDisputes(disputed);
  }, []);

  useEffect(() => {
    loadDisputes();
    const handleUpdate = () => loadDisputes();
    window.addEventListener("trustkyc:data_update", handleUpdate);
    return () => window.removeEventListener("trustkyc:data_update", handleUpdate);
  }, [loadDisputes]);

  const sel = disputes.find((d) => (d.id || d._id) === open);

  const handleDismiss = (dealId) => {
    updateDealStatus(dealId, "active");
    addAuditLog({
      type: "Dispute Dismissed",
      action: "Tribunal Ruling",
      actor: "Chief Compliance Officer (Admin)",
      target: dealId,
      category: "COMMERCIAL",
      severity: "INFO",
      status: "SUCCESS",
      details:
        "Commercial dispute dismissed by compliance tribunal. Deal returned to active status.",
    });
    toast.success("Dispute dismissed and returned to active status");
    setOpen(null);
    loadDisputes();
  };

  const handleEscalate = (dealId) => {
    addAuditLog({
      type: "Dispute Escalated",
      action: "Tribunal Escalation",
      actor: "Chief Compliance Officer (Admin)",
      target: dealId,
      category: "COMMERCIAL",
      severity: "WARNING",
      status: "SUCCESS",
      details: "Dispute escalated to external legal mediation panel.",
    });
    toast.warning("Escalated to legal mediation panel", {
      description: "Arbitration docket generated for legal counsel.",
    });
    setOpen(null);
  };

  const handleResolveWithPenalty = (dealId) => {
    updateDealStatus(dealId, "resolved");
    addAuditLog({
      type: "Dispute Adjudicated",
      action: "Penalty Enforcement",
      actor: "Chief Compliance Officer (Admin)",
      target: dealId,
      category: "COMMERCIAL",
      severity: "WARNING",
      status: "SUCCESS",
      details: "Penalty enforced against counterparty; dispute marked resolved.",
    });
    toast.success("Penalty applied & dispute resolved", {
      description: "Trust score adjusted and settlement recorded in ledger.",
    });
    setOpen(null);
    loadDisputes();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Dispute Mediation"
        title="Commercial Dispute Tribunal"
        description="Arbitrate contested deals, adjudicate escrow terms, and manage counterparty resolution processes."
      />

      <Card className="overflow-hidden p-0 border border-border">
        {disputes.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="size-10 text-emerald-500/60 mb-1" />
            <p className="font-bold text-base text-foreground">No Active Commercial Disputes</p>
            <p className="text-xs max-w-sm">
              All commercial agreements and escrow milestones across the network are operating in
              normal compliance.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px] border-collapse text-left">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Deal Reference</th>
                  <th className="px-5 py-3.5 font-semibold">Counterparties</th>
                  <th className="px-5 py-3.5 font-semibold">Grounds</th>
                  <th className="px-5 py-3.5 font-semibold text-center">Severity</th>
                  <th className="px-5 py-3.5 font-semibold">Date Filed</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {disputes.map((d) => (
                  <tr
                    key={d.id || d._id}
                    className="hover:bg-muted/20 transition-colors cursor-pointer group"
                    onClick={() => setOpen(d.id || d._id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {d.title || d.name}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {d.id || d._id} · {formatINR(d.value || d.amount || 0)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      Helios Networks ↔{" "}
                      {typeof d.counterparty === "object"
                        ? d.counterparty?.tradeName || d.counterparty?.legalName
                        : d.counterparty || "Counterparty"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground font-medium max-w-xs truncate">
                      {d.disputeReason || "Quality / Terms Discrepancy"}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        High Priority
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="h-8 w-8 rounded-lg border border-border bg-card hover:bg-muted text-primary inline-flex items-center justify-center transition-colors cursor-pointer">
                        <ArrowUpRight className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Dispute Mediation Drawer/Modal */}
      {sel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setOpen(null)}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl p-6 border-border shadow-xl space-y-5"
          >
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  Active Commercial Dispute · {sel.id || sel._id}
                </div>
                <h3 className="text-xl font-bold text-foreground mt-1">{sel.title || sel.name}</h3>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Dispute Claim:</span>{" "}
              {sel.disputeReason ||
                `Helios Trade Networks raised an escrow dispute against ${typeof sel.counterparty === "object" ? sel.counterparty?.tradeName || sel.counterparty?.legalName : sel.counterparty || "counterparty"}. Counterparty denies breach of contract citing signed bill of lading.`}
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Stat label="Deal Value" value={formatINR(sel.value || sel.amount || 0)} />
              <Stat
                label="Date Filed"
                value={sel.createdAt ? new Date(sel.createdAt).toLocaleDateString() : "Recent"}
              />
              <Stat label="Status" value={sel.status?.toUpperCase() || "DISPUTED"} />
            </div>

            <div className="flex flex-wrap gap-2.5 justify-end pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleDismiss(sel.id || sel._id)}
                className="btn-secondary px-3.5 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Dismiss Dispute</span>
              </button>
              <button
                type="button"
                onClick={() => handleEscalate(sel.id || sel._id)}
                className="px-3.5 py-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <AlertOctagon className="h-3.5 w-3.5" />
                <span>Escalate to Legal</span>
              </button>
              <button
                type="button"
                onClick={() => handleResolveWithPenalty(sel.id || sel._id)}
                className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-rose-600/20"
              >
                <ShieldOff className="h-3.5 w-3.5" />
                <span>Enforce & Resolve</span>
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-sm font-bold text-foreground mt-0.5">{value}</div>
    </div>
  );
}
