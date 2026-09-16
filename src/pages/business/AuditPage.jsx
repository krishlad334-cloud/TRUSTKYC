import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, PageHeader, EmptyState } from "@/components/ui-kit";
import { getAuditLogs } from "@/utils/storage";
import {
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  ShieldAlert,
  FileCheck,
  User,
  Building2,
  Lock,
  Filter,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAuditLogs = useCallback(() => {
    try {
      setLoading(true);
      const data = getAuditLogs();
      setLogs(data);
      setCurrentPage(1);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const availableModules = useMemo(() => {
    const set = new Set(logs.map((l) => l.module).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [logs]);

  // Filter logs based on search and module
  const filteredRows = useMemo(() => {
    return logs.filter((item) => {
      const matchesModule =
        moduleFilter === "All" || (item?.module || "").toUpperCase() === moduleFilter.toUpperCase();

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesModule;

      const actorName =
        `${item?.actorId?.firstName || ""} ${item?.actorId?.lastName || ""}`.toLowerCase();
      const actorEmail = (item?.actorId?.email || "").toLowerCase();
      const tradeName = (item?.businessId?.tradeName || "").toLowerCase();
      const legalName = (item?.businessId?.legalName || "").toLowerCase();
      const action = (item?.action || "").toLowerCase();
      const desc = (item?.description || "").toLowerCase();
      const docType = (item?.metadata?.documentType || "").toLowerCase();

      const matchesSearch =
        actorName.includes(q) ||
        actorEmail.includes(q) ||
        tradeName.includes(q) ||
        legalName.includes(q) ||
        action.includes(q) ||
        desc.includes(q) ||
        docType.includes(q);

      return matchesModule && matchesSearch;
    });
  }, [logs, moduleFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [moduleFilter, searchQuery, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const exportCsv = () => {
    if (!filteredRows.length) {
      toast.error("No audit data available to export");
      return;
    }

    const csv = [
      "Log ID,Module,Action,Actor Name,Actor Email,Business Trade Name,Business Legal Name,Description,Document Type,Created At",
      ...filteredRows.map((row) =>
        [
          row._id || "",
          row.module || "",
          row.action || "",
          `${row?.actorId?.firstName || ""} ${row?.actorId?.lastName || ""}`.trim(),
          row?.actorId?.email || "",
          row?.businessId?.tradeName || "",
          row?.businessId?.legalName || "",
          (row?.description || "").replaceAll('"', '""'),
          row?.metadata?.documentType || "",
          row?.createdAt || "",
        ]
          .map((value) => `"${value}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trustgrid-audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredRows.length} audit records to CSV`);
  };

  const getModuleBadge = (module) => {
    const mod = (module || "").toUpperCase();
    switch (mod) {
      case "KYC":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "BUSINESS":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "DOCUMENT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "AUTH":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "USER":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "DEAL":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getActionBadge = (action) => {
    const val = (action || "").toLowerCase();
    if (
      val.includes("completed") ||
      val.includes("accepted") ||
      val.includes("approve") ||
      val.includes("verified")
    ) {
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    }
    if (
      val.includes("dispute") ||
      val.includes("reject") ||
      val.includes("delete") ||
      val.includes("failed")
    ) {
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
    }
    if (val.includes("update") || val.includes("edit") || val.includes("submit")) {
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    }
    return "bg-muted/70 text-foreground/80 border-border";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        kicker="Compliance & Forensics"
        title="Audit Trail & System Ledger"
        description="Immutable, chronological record of all identity checks, authentication milestones, document modifications, and counterparty deal interactions."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAuditLogs}
              disabled={loading}
              className="btn-secondary px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportCsv}
              disabled={!filteredRows.length}
              className="btn-primary px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV ({filteredRows.length})</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by actor, business, action, or description…"
              className="w-full pl-9 pr-8 py-2 rounded-lg form-input text-sm outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-2">
            <div className="relative w-44">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg form-input text-sm outline-none cursor-pointer"
              >
                {availableModules.map((m) => (
                  <option key={m} value={m}>
                    {m === "All" ? "All Modules" : `Module: ${m}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Size */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 rounded-lg form-input text-sm outline-none cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {/* Status bar */}
        {(searchQuery || moduleFilter !== "All") && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <span>Filters active:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                "{searchQuery}"
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {moduleFilter !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Module: {moduleFilter}
                <button onClick={() => setModuleFilter("All")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setModuleFilter("All");
              }}
              className="text-primary hover:underline text-xs ml-auto"
            >
              Reset all
            </button>
          </div>
        )}
      </Card>

      {/* Audit Data Table */}
      <Card className="overflow-hidden p-0 border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Business Entity</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="h-14">
                    <td className="px-4 py-3">
                      <div className="h-5 w-16 shimmer-loading rounded-md" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-24 shimmer-loading rounded-md" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-28 shimmer-loading rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 shimmer-loading rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-40 shimmer-loading rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 shimmer-loading rounded" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="h-4 w-24 shimmer-loading rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <EmptyState
                      icon={ShieldAlert}
                      title="No audit entries found"
                      description={
                        searchQuery || moduleFilter !== "All"
                          ? "No log entries match your active filter criteria. Try clearing filters."
                          : "No audit records have been generated yet for your account."
                      }
                      action={
                        (searchQuery || moduleFilter !== "All") && (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setModuleFilter("All");
                            }}
                            className="btn-secondary px-3 py-1.5 text-xs font-semibold rounded-lg"
                          >
                            Clear Filters
                          </button>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginatedRows.map((log) => {
                  const actorName =
                    `${log?.actorId?.firstName || ""} ${log?.actorId?.lastName || ""}`.trim() ||
                    "System Auto";
                  const actorEmail = log?.actorId?.email;
                  const businessName =
                    log?.businessId?.tradeName || log?.businessId?.legalName || "—";
                  const docType = log?.metadata?.documentType;

                  return (
                    <tr key={log._id} className="hover:bg-muted/30 transition-colors">
                      {/* Module */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getModuleBadge(log?.module)}`}
                        >
                          {log?.module || "SYSTEM"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${getActionBadge(log?.action)}`}
                        >
                          {log?.action || "ACTION"}
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="py-3 px-4 max-w-[170px]">
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground text-xs truncate">
                            {actorName}
                          </span>
                          {actorEmail && (
                            <span className="text-[11px] text-muted-foreground truncate">
                              {actorEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Business */}
                      <td className="py-3 px-4 max-w-[170px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span className="font-medium text-foreground text-xs truncate">
                            {businessName}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <span
                          className="text-xs text-muted-foreground line-clamp-1 font-medium"
                          title={log?.description}
                        >
                          {log?.description || "—"}
                        </span>
                      </td>

                      {/* Document Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {docType ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[11px] font-mono text-foreground border border-border">
                            <FileText className="h-3 w-3 text-primary" />
                            {docType}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap text-right text-xs text-muted-foreground font-mono">
                        {log?.createdAt
                          ? new Date(log.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {!loading && filteredRows.length > 0 && (
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(startIndex + itemsPerPage, filteredRows.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredRows.length}</span> audit
              records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={!hasPrevPage}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-2 py-1 text-xs font-mono font-medium text-foreground">
                Page {currentPage} / {totalPages}
              </span>

              <button
                disabled={!hasNextPage}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
