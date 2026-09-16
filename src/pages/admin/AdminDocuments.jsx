import { useState, useEffect } from "react";
import {
  FileText,
  Check,
  X,
  Eye,
  Building2,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DocumentPreviewModal } from "../../components/documents/DocumentPreviewModal";
import { AdminReviewModal } from "../../components/admin/AdminReviewModal";
import { getDocuments, updateDocumentStatus } from "../../utils/storage";
import { toast } from "sonner";

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = () => {
    setDocs(getDocuments());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("trustgrid:data_update", handleUpdate);
    return () => window.removeEventListener("trustgrid:data_update", handleUpdate);
  }, []);

  const handleQuickApprove = (doc) => {
    updateDocumentStatus(doc._id || doc.id, "verified");
    toast.success(`Approved ${doc.name || doc.documentType}`, {
      description: `Updated verification status for ${doc.businessName || "Business"}.`,
    });
    loadData();
  };

  const handleOpenReview = (doc) => {
    setSelectedDoc(doc);
    setReviewModalOpen(true);
  };

  const filteredDocs = docs.filter((d) => {
    const matchesSearch = (d.name || d.documentType || d.businessName || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || (d.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Document Review & Statutory Adjudication
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit submitted GST, PAN, and COI filings, inspect OCR dockets, and record decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Pending Queue:{" "}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {docs.filter((d) => d.status === "pending").length}
            </span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by entity, document title, or filing type..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="size-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="verified">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Document Review Table */}
      <Card className="overflow-hidden p-0 border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead className="bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-5 py-3.5">Business Entity</th>
                <th className="px-5 py-3.5">Document Title</th>
                <th className="px-5 py-3.5">Filing Type</th>
                <th className="px-5 py-3.5">OCR Match</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-border">
              {filteredDocs.map((doc) => (
                <tr key={doc._id || doc.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-3.5 text-primary shrink-0" />
                      <span>{doc.businessName || "Helios Trade Networks"}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div
                      className="font-semibold text-foreground truncate max-w-[200px]"
                      title={doc.name}
                    >
                      {doc.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recent"}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-muted-foreground">{doc.documentType}</td>

                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {doc.ocrConfidence ? `${doc.ocrConfidence}%` : "99.1%"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status={doc.status} />
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setPreviewOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-muted text-foreground cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="size-3" />
                        <span>Inspect</span>
                      </button>

                      {doc.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleQuickApprove(doc)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer flex items-center gap-1"
                          title="Quick Approve"
                        >
                          <Check className="size-3" />
                          <span>Approve</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenReview(doc)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer flex items-center gap-1"
                      >
                        <span>Decision</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <DocumentPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        doc={selectedDoc}
      />

      <AdminReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        doc={selectedDoc}
        onUpdated={loadData}
      />
    </div>
  );
}
