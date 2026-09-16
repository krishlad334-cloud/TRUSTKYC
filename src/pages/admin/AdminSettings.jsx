import { useState } from "react";
import { Card, PageHeader } from "@/components/ui-kit";
import { Clock, ShieldAlert, Database, Cpu, CheckCircle2, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [slaHours, setSlaHours] = useState(24);
  const [minTrustScore, setMinTrustScore] = useState(50);
  const [ocrConfidence, setOcrConfidence] = useState(85);

  const handleSave = () => {
    toast.success("Governance parameters updated successfully");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        kicker="System Configuration"
        title="Compliance & Governance Settings"
        description="Global verification turnaround service-level agreements, automated risk quarantine thresholds, and external registry connectors."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Verification SLA */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Turnaround Service Level Agreement (SLA)
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Target Review Window
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="168"
                value={slaHours}
                onChange={(e) => setSlaHours(Number(e.target.value))}
                className="w-24 px-3 py-2 text-sm font-mono font-bold rounded-lg border border-border bg-background form-input"
              />
              <span className="text-xs text-muted-foreground font-medium">
                Hours to compliance decision
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Queue items exceeding this target will trigger urgent notifications on the compliance
              operations dashboard.
            </p>
          </div>
        </Card>

        {/* Risk Thresholds */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold text-foreground">Automated Risk Quarantine</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Auto-Quarantine Trust Score
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(Number(e.target.value))}
                className="w-24 px-3 py-2 text-sm font-mono font-bold rounded-lg border border-border bg-background form-input"
              />
              <span className="text-xs text-muted-foreground font-medium">
                Points (Entities below this score flagged)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Entities dropping below this mathematical cutoff are automatically locked from
              initiating escrow contracts.
            </p>
          </div>
        </Card>
      </div>

      {/* OCR and Connectors */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Cpu className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Machine Learning & Registry Connectors
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">GSTIN Gateway</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Direct webhook to Goods & Services Tax network
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">MCA 21 V3</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Ministry of Corporate Affairs company registrar
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">OCR Engine</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Confidence: {ocrConfidence}%
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tesseract + Gemini automated vision extraction
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button
            onClick={handleSave}
            className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-sm shadow-primary/20"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Governance Parameters</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
