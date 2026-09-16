import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ShieldCheck, ShieldAlert, Check, AlertCircle, FileText } from "lucide-react";
import { updateDocumentStatus } from "../../utils/storage";
import { toast } from "sonner";

export function AdminReviewModal({ isOpen, onClose, doc, onUpdated }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !doc) return null;

  const handleApprove = () => {
    updateDocumentStatus(doc._id || doc.id, "verified");
    toast.success(`Approved ${doc.name || doc.documentType}`, {
      description: `Verified document for ${doc.businessName || "Business Entity"}.`,
    });
    if (onUpdated) onUpdated();
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    updateDocumentStatus(doc._id || doc.id, "rejected", rejectionReason.trim());
    toast.error(`Rejected ${doc.name || doc.documentType}`, {
      description: `Rejection notice dispatched to business.`,
    });
    if (onUpdated) onUpdated();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 z-10">
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Compliance Review Decision</h3>
              <p className="text-xs text-muted-foreground">
                {doc.businessName || "Entity Artifact"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1 text-xs">
            <div className="font-bold text-foreground">{doc.name || doc.documentType}</div>
            <div className="text-muted-foreground">Type: {doc.documentType || doc.type}</div>
            <div className="text-muted-foreground">
              Current Status:{" "}
              <span className="font-semibold uppercase text-foreground">{doc.status}</span>
            </div>
          </div>

          {!showRejectInput ? (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verify that the statutory document data matches national registries. Approve the
              document to boost the entity&apos;s Trust Score, or reject it with corrective
              feedback.
            </p>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Document is illegible, expired, or registered under a different PAN..."
                className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 h-24 resize-none"
                required
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 gap-2">
          {!showRejectInput ? (
            <>
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                Reject with Reason
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="btn-primary px-5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="size-3.5" />
                <span>Approve Document</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
export default AdminReviewModal;
