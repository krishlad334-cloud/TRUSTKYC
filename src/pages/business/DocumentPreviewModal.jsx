import React from "react";
import { createPortal } from "react-dom";
import { X, FileText, Database, BadgeCheck, AlertCircle, Clock, ExternalLink } from "lucide-react";

// Converts camelCase / snake_case keys → "Human Readable Label"
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\s*/, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Formats values: null/undefined → "—", booleans, nested objects
function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    // Nested object: render each sub-key on its own line
    return (
      <div className="bg-muted/40 rounded-xl p-3 border border-border text-foreground leading-6 space-y-1">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="text-xs">
            <span className="text-muted-foreground font-medium">{formatKey(k)}: </span>
            <span className="font-mono">{v ?? "—"}</span>
          </div>
        ))}
      </div>
    );
  }
  return String(value);
}

function statusStyle(status) {
  const s = (status || "").toUpperCase();
  if (s === "VERIFIED")
    return {
      wrap: "bg-emerald-500/10 border-emerald-500/20",
      icon: "text-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
    };
  if (s === "PENDING")
    return {
      wrap: "bg-amber-500/10 border-amber-500/20",
      icon: "text-amber-500",
      text: "text-amber-600 dark:text-amber-400",
    };
  return {
    wrap: "bg-rose-500/10 border-rose-500/20",
    icon: "text-rose-500",
    text: "text-rose-600 dark:text-rose-400",
  };
}

function StatusIcon({ status }) {
  const s = (status || "").toUpperCase();
  if (s === "VERIFIED") return <BadgeCheck className="size-5" />;
  if (s === "PENDING") return <Clock className="size-5" />;
  return <AlertCircle className="size-5" />;
}

function DocumentPreviewModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const meta = data.metaData || {};
  const metaEntries = Object.entries(meta);
  const isPdf = data.previewUrl && /\.pdf(\?.*)?$/i.test(data.previewUrl);
  const style = statusStyle(data.status);

  const modal = (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border text-foreground w-full max-w-6xl h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground font-display">
                Document Inspection
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                {formatKey(data.documentType || "Document")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cryptographic verification record & metadata analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            {data.previewUrl && (
              <a
                href={data.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost text-xs inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-3.5" /> Open in Tab
              </a>
            )}
            <button
              onClick={onClose}
              className="size-8 rounded-lg hover:bg-muted flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-5 p-6 flex-1 overflow-hidden">
          {/* LEFT — file preview */}
          <div className="bg-muted/30 rounded-xl border border-border overflow-hidden flex items-center justify-center h-full">
            {isPdf ? (
              <iframe
                src={data.previewUrl}
                title="Document Preview"
                className="w-full h-full rounded-xl border-none"
              />
            ) : (
              <div className="w-full h-full overflow-auto p-4 flex items-center justify-center">
                <img
                  src={data.previewUrl}
                  alt="Document"
                  className="max-w-full max-h-full mx-auto rounded-lg shadow-sm object-contain"
                />
              </div>
            )}
          </div>

          {/* RIGHT — info sidebar */}
          <div className="bg-card border border-border rounded-xl h-full overflow-y-auto p-5 space-y-5">
            {/* Status badge */}
            <div className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 ${style.wrap}`}>
              <span className={style.icon}>
                <StatusIcon status={data.status} />
              </span>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                  Verification Status
                </p>
                <p className={`font-semibold text-sm ${style.text}`}>{data.status || "UNKNOWN"}</p>
              </div>
            </div>

            {/* File info */}
            <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="size-3.5" />
                File Attributes
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  ["File Name", data.fileName],
                  ["File Size", data.fileSize ? `${(data.fileSize / 1024).toFixed(2)} KB` : null],
                  ["Registry Version", data.version ? `v${data.version}` : "v1.0"],
                  [
                    "Uploaded At",
                    data.createdAt ? new Date(data.createdAt).toLocaleString() : null,
                  ],
                  [
                    "Verified At",
                    data.verifiedAt ? new Date(data.verifiedAt).toLocaleString() : null,
                  ],
                  [
                    "Expires At",
                    data.expiresAt ? new Date(data.expiresAt).toLocaleString() : "Never",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-border/40 pb-1.5 last:border-0 last:pb-0"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium font-mono text-foreground">{value ?? "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            {metaEntries.length > 0 && (
              <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Database className="size-3.5" />
                  Extracted Parameters
                </h3>
                <div className="space-y-3 text-xs">
                  {metaEntries.map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-muted-foreground text-[11px] font-medium">
                        {formatKey(key)}
                      </p>
                      <div className="font-mono text-xs text-foreground bg-card border border-border p-2 rounded-lg break-all">
                        {formatValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default DocumentPreviewModal;
