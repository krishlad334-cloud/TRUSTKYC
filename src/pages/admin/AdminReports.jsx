import { BarChart3, TrendingUp, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, StatCard, SectionTitle } from "../../components/common/Card";
import { platformStats } from "../../data/dashboardData";

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-foreground">
          Compliance Analytics & SLA Throughput
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time performance metrics on document processing, turnaround time, and registry
          coverage.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Verification Success"
          value={`${platformStats.verificationSuccessRate}%`}
          delta="↑ 0.4% this month"
          icon={<ShieldCheck className="size-4" />}
          accent="success"
        />
        <StatCard
          label="Average SLA Turnaround"
          value={`${platformStats.averageReviewTimeHours} Hours`}
          delta="Target: < 24 Hours"
          icon={<Clock className="size-4" />}
          accent="primary"
        />
        <StatCard
          label="Active Trade Deals"
          value={String(platformStats.activeDeals)}
          delta="14 escrow contested"
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          label="Total Entities Underwritten"
          value={platformStats.totalEntities.toLocaleString()}
          delta="100% audit-sealed"
          icon={<CheckCircle2 className="size-4" />}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <SectionTitle>Turnaround Performance by Document Type</SectionTitle>
          <div className="space-y-3 text-xs">
            {[
              {
                type: "GST Registration Certificate",
                avg: "0.8 Hours",
                sla: "Within SLA",
                score: "99.4%",
              },
              { type: "Corporate PAN Card", avg: "0.4 Hours", sla: "Within SLA", score: "99.9%" },
              {
                type: "Certificate of Incorporation",
                avg: "1.9 Hours",
                sla: "Within SLA",
                score: "98.2%",
              },
              { type: "Bank Statement Proof", avg: "2.4 Hours", sla: "Within SLA", score: "97.5%" },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border"
              >
                <div>
                  <div className="font-bold text-foreground">{row.type}</div>
                  <div className="text-[11px] text-muted-foreground">
                    OCR Precision: {row.score}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{row.avg}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                    {row.sla}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-3">
          <SectionTitle>Statutory Registry Coverage</SectionTitle>
          <div className="space-y-3 text-xs">
            {[
              {
                registry: "GSTN Common Portal API (Active Status Match)",
                status: "Operational",
                uptime: "99.98%",
              },
              {
                registry: "MCA V3 Master Data Registry (CIN Validation)",
                status: "Operational",
                uptime: "99.95%",
              },
              {
                registry: "NSDL / Income Tax PAN Query Gateway",
                status: "Operational",
                uptime: "99.99%",
              },
              {
                registry: "RBI / NPCI IFSC Financial Institution Validation",
                status: "Operational",
                uptime: "100%",
              },
            ].map((reg, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border"
              >
                <div className="max-w-[70%]">
                  <div className="font-bold text-foreground truncate">{reg.registry}</div>
                  <div className="text-[10px] text-muted-foreground">Uptime 30d: {reg.uptime}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                  {reg.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
