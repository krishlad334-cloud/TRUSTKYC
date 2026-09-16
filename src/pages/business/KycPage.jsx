import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Download,
  Eye,
  RotateCcw,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ScanLine,
  RefreshCw,
  CircleAlert,
  Check,
  CloudUpload,
  Info,
  FileWarning,
  CloudSync,
  Plus,
  Search,
  FileSpreadsheet,
} from "lucide-react";

import { Card, StatusBadge } from "@/components/ui-kit";
import { EmptyState } from "@/components/ui-bits";
import { toast } from "sonner";
import { getDocuments, addDocument } from "@/utils/storage";
import DocumentPreviewModal from "./DocumentPreviewModal";

const tabs = ["All", "GST", "PAN", "INCORPORATION", "BANK"];

const tabsMapping = {
  GST: "GST_CERTIFICATE",
  PAN: "PAN_CARD",
  INCORPORATION: "INCORPORATION_CERTIFICATE",
  BANK: "BANK_PROOF",
};

const inverseTabsMapping = {
  GST_CERTIFICATE: "GST Certificate",
  PAN_CARD: "PAN Card",
  INCORPORATION_CERTIFICATE: "Incorporation Certificate",
  BANK_PROOF: "Bank Proof",
};

const docTypeOptions = ["GST Certificate", "PAN Card", "Incorporation Certificate", "Bank Proof"];

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED_MIME = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_EXT = [".pdf", ".png", ".jpg", ".jpeg"];

const validators = {
  "GST Certificate": {
    field: "gstNumber",
    regex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    example: "27AAACH1234A1Z9",
  },
  "PAN Card": {
    field: "panNumber",
    regex: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    example: "AAACH1234A",
  },
  "Incorporation Certificate": {
    field: "cinNumber",
    regex: /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
    example: "U74999MH2018PLC312841",
  },
  "Bank Proof": {
    field: "ifscCode",
    regex: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    example: "HDFC0001234",
  },
};

function bytesToHuman(b) {
  if (!b && b !== 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function KYCPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [docType, setDocType] = useState("GST Certificate");
  const [kycDocuments, setKycDocuments] = useState([]);
  const [fetching, setFetching] = useState(false);

  const getKYCDocuments = useCallback(() => {
    setFetching(true);
    const docs = getDocuments();
    setKycDocuments(docs);
    setFetching(false);
  }, []);

  useEffect(() => {
    getKYCDocuments();
    const handleUpdate = () => getKYCDocuments();
    window.addEventListener("trustkyc:data_update", handleUpdate);
    return () => window.removeEventListener("trustkyc:data_update", handleUpdate);
  }, [getKYCDocuments]);

  const filtered = (kycDocuments || []).filter((d) => {
    const matchesTab = tab === "All" ? true : d.documentType === tabsMapping[tab];
    const matchesSearch = search.trim()
      ? (d.fileName || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.documentType || "").toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesTab && matchesSearch;
  });

  const expiring =
    kycDocuments?.filter((d) => {
      if (!d || !d.expiresAt) return false;
      const days = (new Date(d.expiresAt).getTime() - Date.now()) / 86400000;
      return days < 60 && days > 0;
    }) || [];

  const handleReuploadAction = (backendType) => {
    const matchedType = inverseTabsMapping[backendType] || "GST Certificate";
    setDocType(matchedType);
    setUploadOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                  tab === t
                    ? "btn-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input text-xs pl-9 py-1.5 w-full h-9"
              />
            </div>

            <button
              onClick={getKYCDocuments}
              disabled={fetching}
              title="Refresh repository"
              className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className={`size-3.5 ${fetching ? "animate-spin text-primary" : ""}`} />
            </button>

            <button
              onClick={() => {
                setDocType("GST Certificate");
                setUploadOpen(true);
              }}
              className="btn-primary text-xs font-semibold py-2 px-3.5 shadow-sm shadow-primary/20 shrink-0 inline-flex items-center gap-1.5"
            >
              <Plus className="size-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Expiring Banner */}
        {expiring.length > 0 && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center gap-3 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="size-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">
                {expiring.length} compliance document{expiring.length > 1 ? "s" : ""}
              </span>{" "}
              expiring within 60 days. Re-upload updated credentials to prevent trust score
              degradation.
            </div>
          </div>
        )}

        {/* Document Table Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16">
              <EmptyState
                icon={FileText}
                title="No compliance documents found"
                description={
                  search
                    ? "No documents match your active search criteria."
                    : "No documents recorded under this category yet."
                }
                action={
                  <button
                    onClick={() => {
                      setDocType("GST Certificate");
                      setUploadOpen(true);
                    }}
                    className="btn-primary text-xs font-semibold py-2 px-4 shadow-sm"
                  >
                    <Plus className="size-3.5 mr-1" /> Upload First Document
                  </button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[700px]">
                <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border font-semibold">
                  <tr>
                    <th className="text-left px-5 py-3.5">Document Artifact</th>
                    <th className="text-left px-4 py-3.5">Uploaded</th>
                    <th className="text-left px-4 py-3.5">Validity / Expiry</th>
                    <th className="text-left px-4 py-3.5">Status</th>
                    <th className="text-left px-4 py-3.5">File Size</th>
                    <th className="text-right px-5 py-3.5">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {filtered.map((d, index) => (
                    <DocRow key={d?._id || index} d={d} onReupload={handleReuploadAction} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {uploadOpen && (
        <UploadModal
          onClose={() => {
            setUploadOpen(false);
            getKYCDocuments();
          }}
          docType={docType}
          setDocType={setDocType}
        />
      )}
    </>
  );
}

function DocRow({ d, onReupload }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  if (!d) return null;

  const handleView = () => {
    setPreviewData({
      ...d,
      previewUrl: d.fileUrl || "/sample-doc.pdf",
    });
    setPreviewOpen(true);
  };

  const handleDownload = (openInTab = false) => {
    toast.success(`Exporting ${d.name || d.documentType || "document"}`, {
      description: "Generated verifiable PDF checksum seal.",
    });
    if (openInTab) {
      window.open(d.fileUrl || "/sample-doc.pdf", "_blank");
    }
  };

  return (
    <>
      <tr className="hover:bg-muted/40 transition-colors group">
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-xs truncate max-w-xs">
                {d.fileName || "Document"}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {d.documentType
                  ? inverseTabsMapping[d.documentType] || d.documentType
                  : "KYC Artifact"}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">
          {d.uploadedAt || d.createdAt
            ? new Date(d.uploadedAt || d.createdAt).toLocaleDateString()
            : "—"}
        </td>
        <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">
          {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "No Expiry"}
        </td>
        <td className="px-4 py-3.5">
          <StatusBadge status={d.status || "PENDING"} />
        </td>
        <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">
          {d.size || d.fileSize ? bytesToHuman(d.size || d.fileSize) : "—"}
        </td>
        <td className="px-5 py-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleView}
              title="Inspect Document & OCR Data"
              className="size-8 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            >
              <Eye className="size-3.5" />
            </button>
            <button
              onClick={() => handleDownload()}
              disabled={downloading}
              title="Download Artifact"
              className="size-8 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              ) : (
                <Download className="size-3.5" />
              )}
            </button>
            <button
              onClick={() => onReupload(d.documentType)}
              title="Re-upload or Update Version"
              className="size-8 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            >
              <CloudSync className="size-3.5" />
            </button>
          </div>
        </td>
      </tr>

      {previewOpen &&
        createPortal(
          <DocumentPreviewModal
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            data={previewData}
          />,
          document.body,
        )}
    </>
  );
}

function UploadModal({ onClose, docType, setDocType }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const [documentData, setDocumentData] = useState({
    gstNumber: "",
    legalName: "",
    tradeName: "",
    address: "",
    pincode: "",
  });

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid =
      ACCEPTED_MIME.includes(file.type) ||
      ACCEPTED_EXT.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      toast.error("Invalid file format", {
        description: "Please provide a PDF, PNG, or JPG document.",
      });
      return;
    }

    if (file.size > MAX_BYTES) {
      toast.error(`File too large`, {
        description: `Maximum allowed is ${bytesToHuman(MAX_BYTES)}`,
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a document first");
      return;
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));

      let mockMeta = {};
      if (docType === "GST Certificate") {
        mockMeta = {
          gstNumber: "27AAACH1234A1Z9",
          legalName: "Helios Trade Networks Pvt Ltd",
          tradeName: "Helios Trade Networks",
          address: "BKC, Bandra East, Mumbai, Maharashtra",
          pincode: "400051",
        };
      } else if (docType === "PAN Card") {
        mockMeta = {
          panNumber: "AAACH1234A",
          legalName: "HELIOS TRADE NETWORKS PRIVATE LIMITED",
          entityType: "Company",
        };
      } else if (docType === "Incorporation Certificate") {
        mockMeta = {
          cinNumber: "U74999MH2018PLC312841",
          legalName: "Helios Trade Networks Pvt Ltd",
          rocOffice: "ROC Mumbai",
        };
      } else {
        mockMeta = {
          bankName: "HDFC Bank Ltd",
          accountNumber: "••••••••4902",
          ifscCode: "HDFC0000060",
        };
      }

      setUploadedDoc({ temporaryUploadId: `tmp-${Date.now()}` });
      setDocumentData(mockMeta);
      toast.success("Extraction completed. Please confirm parameters.");
    } catch {
      toast.error("Document upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 400));

      addDocument({
        name: selectedFile?.name || `${docType}.pdf`,
        type: tabsMapping[docType] || "GST_CERTIFICATE",
        documentType: docType,
        extractedData: documentData,
        size: selectedFile?.size
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
          : "1.9 MB",
        status: "pending",
        businessName: "Helios Trade Networks Pvt Ltd",
      });

      toast.success("Document submitted into verification docket");
      onClose();
    } catch {
      toast.error("Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUploadedDoc(null);
    setDocumentData({
      gstNumber: "",
      legalName: "",
      tradeName: "",
      address: "",
      pincode: "",
    });
    setSelectedFile(null);
  };

  const renderFormFields = () => {
    return Object.keys(documentData || {}).length > 0 ? (
      <div className="space-y-3.5">
        {Object.entries(documentData).map(([key, value]) => {
          if (typeof value === "object" && value !== null) return null;

          return (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              </label>

              {key === "address" ? (
                <textarea
                  rows={2}
                  value={value || ""}
                  onChange={(e) => setDocumentData((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="form-input text-xs w-full resize-none font-mono"
                />
              ) : (
                <input
                  type="text"
                  value={value || ""}
                  onChange={(e) => setDocumentData((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="form-input text-xs w-full font-mono"
                />
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-xs text-muted-foreground">No schema metadata extracted.</p>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto bg-card text-foreground rounded-2xl shadow-2xl border border-border">
        <div className="flex justify-between items-center pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-foreground font-display">
              Deposit Compliance Document
            </h3>
            <p className="text-xs text-muted-foreground">
              Upload official paperwork for automated OCR & verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {!uploadedDoc && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Compliance Document Classification
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="form-input text-xs w-full cursor-pointer"
              >
                {docTypeOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 p-8 text-center flex flex-col items-center justify-center cursor-pointer rounded-2xl transition-all group"
            >
              <div className="size-12 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center mb-2 text-muted-foreground transition-colors">
                <CloudUpload className="size-6" />
              </div>

              {!selectedFile ? (
                <>
                  <p className="text-xs font-semibold text-foreground">Click to browse file</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    PDF, PNG, JPG up to 10 MB
                  </p>
                </>
              ) : (
                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary font-mono">
                  <Check className="size-3.5" />
                  <span>{selectedFile.name}</span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept={ACCEPTED_EXT.join(",")}
                onChange={handleFileChange}
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
              <button onClick={onClose} className="btn-secondary text-xs font-semibold px-4 py-2">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                className="btn-primary text-xs font-semibold px-5 py-2 shadow-sm shadow-primary/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5 inline" /> Extracting…
                  </>
                ) : (
                  "Upload & Analyze"
                )}
              </button>
            </div>
          </div>
        )}

        {uploadedDoc && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                  Extracted KYC Attributes
                </h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  OCR Verified
                </span>
              </div>
              {renderFormFields()}
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
              <button onClick={reset} className="btn-secondary text-xs font-semibold px-4 py-2">
                Re-upload
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="btn-primary text-xs font-semibold px-5 py-2 shadow-md shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5 inline" /> Saving…
                  </>
                ) : (
                  "Confirm & Save in Ledger"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
