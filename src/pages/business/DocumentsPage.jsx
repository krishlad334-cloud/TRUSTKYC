import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Eye,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { Card, SectionTitle } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/StatusBadge";
import { DocumentPreviewModal } from "../../components/documents/DocumentPreviewModal";
import { getDocuments, addDocument, replaceDocument, deleteDocument } from "../../utils/storage";
import { toast } from "sonner";

const DOCUMENT_TYPES = [
  "GST Certificate",
  "PAN Card",
  "Incorporation Certificate",
  "Bank Proof",
  "Commercial Lease Agreement",
  "Board Resolution",
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [replacingDocId, setReplacingDocId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Form State for new upload or replacement
  const [newDocType, setNewDocType] = useState("GST Certificate");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileError, setFileError] = useState("");

  const loadData = () => {
    setDocs(getDocuments());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("trustkyc:data_update", handleUpdate);
    return () => window.removeEventListener("trustkyc:data_update", handleUpdate);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setFileError("");
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Invalid format. Only PDF, PNG, and JPG files are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File too large. Maximum file size is 10 MB.");
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!fileName) {
      setFileError("Please choose a file to upload.");
      return;
    }

    if (replacingDocId) {
      replaceDocument(replacingDocId, {
        name: fileName,
        documentType: newDocType,
        size: fileSize || "2.1 MB",
      });
      toast.success("Document updated successfully", {
        description: `Replaced document has been resubmitted for compliance review.`,
      });
    } else {
      addDocument({
        name: fileName,
        documentType: newDocType,
        type: newDocType.toUpperCase().replace(/\s+/g, "_"),
        businessName: "Helios Trade Networks Pvt Ltd",
        size: fileSize || "2.1 MB",
        ocrConfidence: 98.6,
        extractedData: {
          Document: newDocType,
          "Registration Number": `REG-${Math.floor(100000 + Math.random() * 900000)}`,
          "Valid Through": "Active",
        },
      });
      toast.success("Document uploaded successfully", {
        description: `${newDocType} has been placed into the review queue.`,
      });
    }

    setUploadModalOpen(false);
    setReplacingDocId(null);
    setFileName("");
    setFileSize("");
    loadData();
  };

  const handleDelete = (docId, docName) => {
    deleteDocument(docId);
    toast.info(`Deleted ${docName}`);
    loadData();
  };

  const handleOpenReplace = (doc) => {
    setReplacingDocId(doc._id || doc.id);
    setNewDocType(doc.documentType || "GST Certificate");
    setFileName("");
    setFileSize("");
    setFileError("");
    setUploadModalOpen(true);
  };

  const handleOpenNew = () => {
    setReplacingDocId(null);
    setNewDocType("GST Certificate");
    setFileName("");
    setFileSize("");
    setFileError("");
    setUploadModalOpen(true);
  };

  const filteredDocs = docs.filter((d) => {
    const matchesSearch = (d.name || d.documentType || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType === "ALL" || d.documentType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Compliance Document Repository
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage, upload, preview, and replace verified statutory filings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="btn-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Upload New Document</span>
        </button>
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
              placeholder="Search documents by name or statutory type..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="size-3.5 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
            >
              <option value="ALL">All Document Types</option>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Document Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredDocs.map((doc) => {
          const isRejected = doc.status === "rejected";
          const isVerified = doc.status === "verified";

          return (
            <Card
              key={doc._id || doc.id}
              className="flex flex-col justify-between p-5 space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <StatusBadge status={doc.status} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground truncate" title={doc.name}>
                    {doc.name}
                  </h4>
                  <div className="text-xs text-muted-foreground mt-0.5">{doc.documentType}</div>
                </div>

                <div className="text-[11px] text-muted-foreground space-y-1">
                  <div>
                    Uploaded:{" "}
                    <span className="text-foreground font-medium">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                  <div>
                    Size:{" "}
                    <span className="text-foreground font-medium">{doc.size || "1.8 MB"}</span>
                  </div>
                  {doc.ocrConfidence && (
                    <div>
                      OCR Confidence:{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {doc.ocrConfidence}%
                      </span>
                    </div>
                  )}
                </div>

                {isRejected && doc.rejectionReason && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-700 dark:text-rose-400">
                    <div className="font-bold flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      <span>Rejection Reason:</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2">{doc.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setPreviewOpen(true);
                  }}
                  className="flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenReplace(doc)}
                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    title="Replace/Update Document"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc._id || doc.id, doc.name)}
                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upload/Replace Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-foreground">
              {replacingDocId ? "Replace / Re-upload Document" : "Upload Statutory Filing"}
            </h3>

            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Document Type
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground"
                >
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Select File (PDF, PNG, JPG - max 10MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                />
                {fileError && <p className="text-[11px] text-rose-500 mt-1">{fileError}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 text-xs font-semibold rounded-xl shadow-xs"
                >
                  {replacingDocId ? "Update Document" : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DocumentPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        doc={selectedDoc}
      />
    </div>
  );
}
