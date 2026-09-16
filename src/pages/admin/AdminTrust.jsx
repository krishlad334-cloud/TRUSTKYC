import { useState, useEffect } from "react";
import { Card, PageHeader } from "@/components/ui-kit";
import { getBusinesses, updateBusinessEntity } from "@/utils/storage";
import { Check, Search, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminTrust() {
  const [search, setSearch] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [scores, setScores] = useState({});

  const loadData = () => {
    const list = getBusinesses();
    setBusinesses(list);
    const initialScores = list.reduce((acc, b) => {
      const val =
        typeof b.trustScore === "object"
          ? (b.trustScore?.overall ?? 75)
          : Number(b.trustScore) || 75;
      return { ...acc, [b.id]: val };
    }, {});
    setScores(initialScores);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("trustkyc:data_update", handleUpdate);
    return () => window.removeEventListener("trustkyc:data_update", handleUpdate);
  }, []);

  const filtered = businesses.filter((b) =>
    (b.name || b.tradeName || b.legalName || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleUpdate = (id, name) => {
    const newScore = Number(scores[id]) || 0;
    updateBusinessEntity({
      id,
      trustScore: {
        overall: newScore,
        kycScore: Math.round(newScore * 0.4),
        complianceScore: Math.round(newScore * 0.3),
        dealPerformanceScore: Math.round(newScore * 0.2),
        activityScore: Math.round(newScore * 0.1),
      },
    });
    toast.success(`Calibrated trust score for ${name} to ${newScore}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Algorithmic Supervisory"
        title="Trust Score Governance"
        description="Manual algorithmic overrides, mathematical factor calibrations, and risk index mediation for accredited entities."
      />

      {/* Search Toolbar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business to calibrate score…"
            className="w-full pl-9 pr-9 py-2.5 rounded-lg form-input text-sm outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden p-0 border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px] border-collapse text-left">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40 border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Business Entity</th>
                <th className="px-5 py-3.5 font-semibold text-center">Current Score</th>
                <th className="px-5 py-3.5 font-semibold">Override Target</th>
                <th className="px-5 py-3.5 font-semibold text-right">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-border">
              {filtered.map((b) => {
                const currentScore =
                  typeof b.trustScore === "object"
                    ? (b.trustScore?.overall ?? 75)
                    : Number(b.trustScore) || 75;
                const inputVal = scores[b.id] ?? currentScore;

                return (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-foreground text-sm">
                        {b.tradeName || b.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {b.industry || "Enterprise"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold">
                      <span
                        className={
                          currentScore >= 75
                            ? "text-emerald-600 dark:text-emerald-400"
                            : currentScore >= 50
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                        }
                      >
                        {currentScore}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={inputVal}
                          onChange={(e) =>
                            setScores({
                              ...scores,
                              [b.id]: Math.min(100, Math.max(0, Number(e.target.value))),
                            })
                          }
                          className="w-20 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-background form-input"
                        />
                        <span className="text-xs text-muted-foreground">/ 100</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleUpdate(b.id, b.tradeName || b.name)}
                        className="btn-primary px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center gap-1 shadow-sm shadow-primary/20"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
