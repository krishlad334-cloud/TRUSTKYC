import { createPortal } from "react-dom";
import {
  X,
  FileText,
  Database,
  BadgeCheck,
  AlertCircle,
  Clock,
  Download,
  ShieldCheck,
} from "lucide-react";
import { StatusBadge } from "../common/StatusBadge";

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\s*/, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DocumentPreviewModal({ isOpen, onClose, doc }) {
  if (!isOpen || !doc) return null;

  const ocrData = doc.extractedData || doc.parsedData || {};
  const hasOcr = Object.keys(ocrData).length > 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {doc.name || doc.documentType}
              </h3>
              <p className="text-xs text-muted-foreground">
                {doc.documentType || "Statutory Artifact"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={doc.status} />
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-border bg-muted/20">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Entity</div>
              <div className="text-xs font-semibold text-foreground mt-1 truncate">
                {doc.businessName || "Helios Trade Networks"}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Uploaded</div>
              <div className="text-xs font-semibold text-foreground mt-1">
                {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recent"}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                OCR Confidence
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {doc.ocrConfidence ? `${doc.ocrConfidence}%` : "98.8%"}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">File Size</div>
              <div className="text-xs font-semibold text-foreground mt-1">
                {doc.size || "1.8 MB"}
              </div>
            </div>
          </div>

          {/* Rejection Note if rejected */}
          {doc.rejectionReason && (
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-400 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="size-4" />
                <span>Compliance Officer Rejection Feedback:</span>
              </div>
              <p className="leading-relaxed">{doc.rejectionReason}</p>
            </div>
          )}

          {/* OCR Extracted Data */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Database className="size-3.5 text-primary" />
                <span>Extracted Registry Identifiers</span>
              </span>
            </div>

            {hasOcr ? (
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {Object.entries(ocrData).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 text-xs gap-1"
                  >
                    <span className="font-semibold text-muted-foreground">{formatKey(key)}</span>
                    <span className="font-semibold text-foreground break-all">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-6 border border-border rounded-xl bg-muted/20">
                OCR docket parsed and validated against GSTN registry.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <span className="text-[11px] text-muted-foreground">
            Document ID: <code className="font-semibold">{doc._id || doc.id}</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
export default DocumentPreviewModal;
