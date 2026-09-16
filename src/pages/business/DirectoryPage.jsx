import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Card, StatusBadge, PageHeader, EmptyState } from "@/components/ui-kit";
import {
  Search,
  MapPin,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Building2,
  ShieldCheck,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  X,
  TrendingUp,
} from "lucide-react";
import { businesses as staticBusinesses } from "@/data";

export default function DirectoryPage() {
  const [businesses, setBusinesses] = useState(staticBusinesses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("All");
  const [scoreMin, setScoreMin] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setBusinesses(staticBusinesses);
    setLoading(false);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, industry, scoreMin]);

  const industries = useMemo(() => {
    return [
      "All",
      ...new Set(businesses.map((b) => b.industry || b.basicInfo?.industry).filter(Boolean)),
    ];
  }, [businesses]);

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const displayName =
        b.tradeName || b.legalName || b.basicInfo?.tradeName || "Unknown Business";
      const businessIndustry = b.industry || b.basicInfo?.industry || "";
      const overallScore =
        typeof b.trustScore === "object" ? b.trustScore?.overall || 0 : b.trustScore || 0;

      const matchesIndustry =
        industry === "All" || businessIndustry.toLowerCase() === industry.toLowerCase();
      const matchesScore = overallScore >= scoreMin;
      const matchesSearch =
        !q.trim() ||
        displayName.toLowerCase().includes(q.toLowerCase()) ||
        businessIndustry.toLowerCase().includes(q.toLowerCase());

      return matchesIndustry && matchesScore && matchesSearch;
    });
  }, [businesses, q, industry, scoreMin]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const resetFilters = () => {
    setQ("");
    setIndustry("All");
    setScoreMin(0);
  };

  const isFiltered = q.trim() !== "" || industry !== "All" || scoreMin > 0;

  const getScoreInfo = (s) => {
    if (s >= 80)
      return {
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        label: "Prime",
      };
    if (s >= 60)
      return {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        label: "Standard",
      };
    if (s >= 40)
      return {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        label: "Moderate",
      };
    return {
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
      label: "High Risk",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        kicker="Counterparty Intelligence"
        title="Accredited Business Directory"
        description="Search, evaluate, and verify counterparty credibility across the TrustGrid accredited business network."
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified Entities:</span>
              <span className="font-semibold text-foreground">{businesses.length}</span>
            </div>
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by legal name, trade name, or sector…"
              className="w-full pl-9 pr-8 py-2.5 rounded-lg form-input text-sm outline-none transition-colors"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Industry Filter */}
          <div className="w-full sm:w-56">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg form-input text-sm outline-none cursor-pointer"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === "All" ? "All Industries" : ind}
                </option>
              ))}
            </select>
          </div>

          {/* Trust Score Slider */}
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg border border-border bg-card">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Min Trust Score
              </span>
              <span className="text-xs font-semibold text-foreground font-mono">
                {scoreMin} <span className="text-muted-foreground font-normal">/ 100</span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={scoreMin}
              onChange={(e) => setScoreMin(+e.target.value)}
              className="w-28 sm:w-36 accent-primary cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Filter Summary Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <span>Active criteria:</span>
          {q && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted border border-border font-medium text-foreground">
              Query: "{q}"
              <button onClick={() => setQ("")} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {industry !== "All" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted border border-border font-medium text-foreground">
              Industry: {industry}
              <button onClick={() => setIndustry("All")} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {scoreMin > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted border border-border font-medium text-foreground">
              Score ≥ {scoreMin}
              <button onClick={() => setScoreMin(0)} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {!isFiltered && <span className="italic">No filters active (showing all entries)</span>}
          <span className="ml-auto font-medium text-foreground">
            {filtered.length} {filtered.length === 1 ? "counterparty" : "counterparties"} found
          </span>
        </div>
      </Card>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl shimmer-loading shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 shimmer-loading rounded" />
                  <div className="h-3 w-1/2 shimmer-loading rounded" />
                </div>
              </div>
              <div className="h-10 shimmer-loading rounded-lg" />
              <div className="h-9 shimmer-loading rounded-lg" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center border-dashed border-destructive/40 bg-destructive/5 space-y-3">
          <div className="h-10 w-10 mx-auto rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Failed to load counterparty records
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retry Connection
          </button>
        </Card>
      ) : currentItems.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Building2}
            title="No counterparties match your search"
            description="Try loosening your filters, selecting a different industry category, or lowering the minimum trust score."
            action={
              isFiltered && (
                <button
                  onClick={resetFilters}
                  className="btn-secondary px-4 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Clear All Filters
                </button>
              )
            }
          />
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentItems.map((b) => {
            const displayName =
              b.tradeName || b.legalName || b.basicInfo?.tradeName || "Unknown Business";
            const businessIndustry = b.industry || b.basicInfo?.industry || "Commercial Enterprise";
            const overallScore =
              typeof b.trustScore === "object" ? b.trustScore?.overall || 0 : b.trustScore || 0;
            const displayLocation =
              b.registeredAddress?.city || b.basicInfo?.city || b.city || "India";

            const initials = displayName
              ? displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "TG";

            const scoreInfo = getScoreInfo(overallScore);

            return (
              <Card
                key={b._id}
                className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 group p-5"
              >
                {/* Header with Monogram and Details */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 shadow-sm text-sm tracking-wider">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                      {displayName}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {businessIndustry}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">{displayLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Status Panel */}
                <div className="bg-muted/40 rounded-xl p-3 border border-border/80 mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        Trust Rating
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${scoreInfo.bg}`}
                      >
                        {scoreInfo.label}
                      </span>
                    </div>
                    <StatusBadge status={b.kycStatus || "PENDING"} />
                  </div>

                  {/* Trust Score bar */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Score</span>
                      <span className={`text-base font-bold font-mono ${scoreInfo.color}`}>
                        {overallScore}{" "}
                        <span className="text-xs text-muted-foreground font-normal">/ 100</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(overallScore, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <Link
                  to={`/profile/${b._id}`}
                  className="btn-primary w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 mt-auto transition-all shadow-sm shadow-primary/20"
                >
                  <span>Inspect Verified Dossier</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card className="overflow-hidden p-0 border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Business Entity</th>
                  <th className="py-3 px-4">Industry Sector</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">KYC Status</th>
                  <th className="py-3 px-4 text-center">Trust Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.map((b) => {
                  const displayName =
                    b.tradeName || b.legalName || b.basicInfo?.tradeName || "Unknown Business";
                  const businessIndustry =
                    b.industry || b.basicInfo?.industry || "Commercial Enterprise";
                  const overallScore =
                    typeof b.trustScore === "object"
                      ? b.trustScore?.overall || 0
                      : b.trustScore || 0;
                  const displayLocation =
                    b.registeredAddress?.city || b.basicInfo?.city || b.city || "India";
                  const initials = displayName
                    ? displayName
                        .split(" ")
                        .filter(Boolean)
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "TG";
                  const scoreInfo = getScoreInfo(overallScore);

                  return (
                    <tr key={b._id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-sm">
                              {displayName}
                            </div>
                            {b.legalName && b.legalName !== displayName && (
                              <div className="text-[11px] text-muted-foreground">{b.legalName}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground font-medium">
                        {businessIndustry}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground/60" />
                          <span>{displayLocation}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={b.kycStatus || "PENDING"} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`font-mono font-bold text-sm ${scoreInfo.color}`}>
                            {overallScore}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${scoreInfo.bg}`}
                          >
                            {scoreInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/profile/${b._id}`}
                          className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination Controls */}
      {!loading && !error && currentItems.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(indexOfLastItem, filtered.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filtered.length}</span> verified
            entities
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
              )
              .map((page, idx, arr) => (
                <div key={page} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-1 text-xs text-muted-foreground">…</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
