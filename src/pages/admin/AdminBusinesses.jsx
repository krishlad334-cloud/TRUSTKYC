import { useState } from "react";
import { Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import { businesses } from "@/data";
import { Search, Flag, Pause, Edit3, Building2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminBusinesses() {
  const [q, setQ] = useState("");
  const rows = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(q.toLowerCase()) ||
      (b.gstin && b.gstin.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Registry Governance"
        title="Business Entities Directory"
        description="Monitor registered enterprise counterparties, audit trust score metrics, and manage compliance restrictions."
      />

      {/* Search toolbar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search businesses by legal name or GSTIN…"
            className="w-full pl-9 pr-9 py-2.5 rounded-lg form-input text-sm outline-none"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>

      {/* Entities Table */}
      <Card className="overflow-hidden p-0 border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px] border-collapse text-left">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40 border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Business Entity</th>
                <th className="px-5 py-3.5 font-semibold">Industry Sector</th>
                <th className="px-5 py-3.5 font-semibold text-center">Trust Score</th>
                <th className="px-5 py-3.5 font-semibold text-center">KYC Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-accent grid place-items-center text-xs font-bold text-primary-foreground shrink-0 border border-primary/20">
                        {b.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{b.name}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">{b.gstin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground font-medium">
                    {b.industry}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-center">
                    {(() => {
                      const score =
                        typeof b.trustScore === "object"
                          ? b.trustScore?.overall || 80
                          : b.trustScore || 80;
                      return (
                        <span
                          className={`text-sm font-bold ${
                            score >= 75
                              ? "text-emerald-600 dark:text-emerald-400"
                              : score >= 50
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {score}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status={b.kycStatus} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toast.success(`Score override dialog opened for ${b.name}`)}
                        title="Override score"
                        className="h-8 w-8 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Edit3 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.warning(`${b.name} flagged for compliance audit`)}
                        title="Flag for Review"
                        className="h-8 w-8 rounded-lg border border-border bg-card hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.error(`Suspended account for ${b.name}`)}
                        title="Suspend Account"
                        className="h-8 w-8 rounded-lg border border-border bg-card hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Pause className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
