import { useState, useMemo, useEffect } from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

import { Card, SectionTitle, StatusBadge } from "@/components/ui-bits";
import { TrustGauge } from "@/components/trust-gauge";
import { riskFlags, trustHistory } from "@/data";
import { useAuth } from "@/context/AuthContext";

const faqs = [
  {
    q: "What affects my trust score?",
    a: "Your score is based on KYC verification, compliance checks, successful deals, and account activity.",
  },
  {
    q: "How often is my score recalculated?",
    a: "Trust score recalculates automatically whenever trust-impacting events happen.",
  },
  {
    q: "Can a counterparty see all my documents?",
    a: "No. Only verification status is visible unless explicit access is granted.",
  },
  {
    q: "How do I improve my score?",
    a: "Complete KYC, resolve compliance issues, and maintain successful transactions.",
  },
];

const defaultScore = {
  overall: 0,
  kycScore: 0,
  complianceScore: 0,
  dealPerformanceScore: 0,
  activityScore: 0,
};

const num = (v) => Number(v) || 0;

function severityLabel(s) {
  if (!s) return "Low";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function TrustPage() {
  const { business } = useAuth();
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(defaultScore);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchTrustScore();
  }, [business]);

  const fetchTrustScore = () => {
    try {
      setLoading(true);
      const score = business?.trustScore || {
        overall: 88,
        kycScore: 38,
        complianceScore: 28,
        dealPerformanceScore: 22,
        activityScore: 8,
      };

      setTrustScore({
        overall: num(score.overall ?? 88),
        kycScore: num(score.kycScore ?? 38),
        complianceScore: num(score.complianceScore ?? 28),
        dealPerformanceScore: num(score.dealPerformanceScore ?? 22),
        activityScore: num(score.activityScore ?? 8),
      });

      setHistory(trustHistory);
    } finally {
      setLoading(false);
    }
  };

  const trustBreakdown = useMemo(
    () => [
      {
        factor: "KYC Verification",
        weight: 40,
        score: trustScore.kycScore,
        max: 40,
      },
      {
        factor: "Legal Compliance",
        weight: 20,
        score: trustScore.complianceScore,
        max: 20,
      },
      {
        factor: "Deal Performance",
        weight: 30,
        score: trustScore.dealPerformanceScore,
        max: 30,
      },
      {
        factor: "Business Activity",
        weight: 10,
        score: trustScore.activityScore,
        max: 10,
      },
    ],
    [trustScore],
  );

  const trustHistory = useMemo(() => {
    if (!history.length) {
      const current = trustScore.overall;

      return [
        { month: "Jan", score: 0 },
        { month: "Feb", score: Math.round(current * 0.15) },
        { month: "Mar", score: Math.round(current * 0.3) },
        { month: "Apr", score: Math.round(current * 0.5) },
        { month: "May", score: Math.round(current * 0.7) },
        { month: "Jun", score: Math.round(current * 0.85) },
        { month: "Now", score: current },
      ];
    }

    return history.map((item) => ({
      month: new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      score: num(item.newScore),
    }));
  }, [history, trustScore]);

  const growth = useMemo(() => {
    if (!history.length) return trustScore.overall;
    const first = num(history[0]?.previousScore);
    return trustScore.overall - first;
  }, [history, trustScore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-border bg-card shadow-xs">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-muted-foreground">
            Calculating algorithmic trust factors…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Grid: Trust Gauge & Factor Weighting Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center p-6 justify-between">
          <SectionTitle
            action={
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Verified Grade A
              </span>
            }
          >
            Composite Score
          </SectionTitle>

          <div className="my-3">
            <TrustGauge score={trustScore.overall} size={200} />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Standardized Trust Score · Scale 0 to 100
          </p>

          <div className="grid grid-cols-3 gap-2.5 mt-5 w-full">
            <div className="rounded-xl border border-border bg-muted/20 py-2.5 px-1 text-center">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block">
                Current
              </span>
              <span className="text-base font-bold text-foreground font-mono mt-0.5 block">
                {trustScore.overall}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 py-2.5 px-1 text-center">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block">
                Events
              </span>
              <span className="text-base font-bold text-foreground font-mono mt-0.5 block">
                {history.length}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 py-2.5 px-1 text-center">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block">
                Delta
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                +{growth}
              </span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <SectionTitle
            action={
              <span className="text-xs text-muted-foreground">Mathematical Weighting Model</span>
            }
          >
            Trust Component Attribution
          </SectionTitle>

          <div className="space-y-4 mt-4">
            {trustBreakdown.map((b) => {
              const pct = (b.score / b.max) * 100;

              return (
                <div
                  key={b.factor}
                  className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{b.factor}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">
                        ({b.weight}% weighting)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      {b.score} / {b.max} pts
                    </span>
                  </div>

                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Trajectory History */}
      <Card className="p-6">
        <SectionTitle
          action={
            <span className="text-xs text-muted-foreground font-mono">Temporal Stability Log</span>
          }
        >
          Historical Score Evolution
        </SectionTitle>

        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trustHistory}>
              <defs>
                <linearGradient id="scoreGradTrust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
              <XAxis
                dataKey="month"
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "var(--color-foreground)",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#scoreGradTrust)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Grid: Risk Flags & Frequently Asked Questions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              Active Risk Factors
            </span>
          </SectionTitle>

          <div className="space-y-3 mt-3">
            {riskFlags.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">{f.title}</p>
                  <StatusBadge status={severityLabel(f.severity)} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle>Methodology & FAQs</SectionTitle>

          <div className="divide-y divide-border/60 mt-1">
            {faqs.map((f, i) => (
              <div key={i} className="py-3.5">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex justify-between items-center text-left cursor-pointer group"
                >
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
                      open === i ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {open === i && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed animate-in fade-in duration-150">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
