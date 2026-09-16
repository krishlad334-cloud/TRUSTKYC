import { useEffect, useState, useMemo } from "react";
import { getAuditLogs } from "@/utils/storage";
import { Card, PageHeader } from "@/components/ui-kit";
import { Search, ShieldAlert, X, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchAuditLogs = () => {
    try {
      setLoading(true);
      const data = getAuditLogs();
      setLogs(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Storage Error context:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    const handleUpdate = () => fetchAuditLogs();
    window.addEventListener("trustkyc:data_update", handleUpdate);
    return () => window.removeEventListener("trustkyc:data_update", handleUpdate);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.actorId?.email && l.actorId.email.toLowerCase().includes(q)) ||
        (l.businessId?.tradeName && l.businessId.tradeName.toLowerCase().includes(q)),
    );
  }, [logs, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const getActionBadgeStyles = (actionName) => {
    const normalized = actionName?.toLowerCase() || "";

    if (
      normalized.includes("verified") ||
      normalized.includes("accept") ||
      normalized.includes("approve") ||
      normalized.includes("success")
    ) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
    if (normalized.includes("submitted") || normalized.includes("create")) {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
    if (normalized.includes("update") || normalized.includes("edit")) {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
    if (
      normalized.includes("delete") ||
      normalized.includes("reject") ||
      normalized.includes("fail") ||
      normalized.includes("dispute")
    ) {
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  const startRecord = filtered.length === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Security Governance"
        title="Administrative Audit Logs"
        description="Master cryptographic event log tracking administrative interventions, security actions, and data modifications."
      />

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by actor email, action, or description…"
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

      {/* Table Card */}
      <Card className="overflow-hidden p-0 border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse text-left">
            <thead className="bg-muted/40 border-b border-border text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Action Event</th>
                <th className="px-5 py-3.5">Actor Identity</th>
                <th className="px-5 py-3.5">Business Entity</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-xs font-medium">
                        Fetching administrative audit events…
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    <p className="text-xs">No matching audit events found.</p>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((log) => (
                  <tr key={log._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border uppercase ${getActionBadgeStyles(
                          log.action,
                        )}`}
                      >
                        {log.action || "EVENT"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono bg-muted/60 text-foreground border border-border">
                        {log?.actorId?.email || "system_daemon"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 max-w-[200px]">
                      {log?.businessId ? (
                        <div>
                          <div
                            className="font-semibold text-foreground text-xs truncate"
                            title={log?.businessId?.tradeName}
                          >
                            {log?.businessId?.tradeName || "—"}
                          </div>
                          <div
                            className="text-[11px] text-muted-foreground font-mono truncate"
                            title={log?.businessId?.legalName}
                          >
                            {log?.businessId?.legalName || log?.businessId?._id}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Global System</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-muted-foreground text-xs max-w-[280px] break-words">
                      {log?.description || "—"}
                    </td>

                    <td className="px-5 py-3.5 text-right text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {log?.createdAt
                        ? new Date(log.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startRecord}</span> to{" "}
              <span className="font-semibold text-foreground">{endRecord}</span> of{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span> records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={!hasPrevPage}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-2 font-mono font-medium text-foreground">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={!hasNextPage}
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
