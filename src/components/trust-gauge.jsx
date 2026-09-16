import { cn } from "@/utils/utils";

export function TrustGauge({ score, size = 220, label = "Trust Score", className }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const r = (size - 24) / 2;
  const circ = 2 * Math.PI * r;
  const pct = safeScore / 100;
  const offset = circ * (1 - pct);

  const color =
    safeScore >= 75 ? "var(--success)" : safeScore >= 50 ? "var(--warning)" : "var(--danger)";
  const grade =
    safeScore >= 85
      ? "A+"
      : safeScore >= 75
        ? "A"
        : safeScore >= 60
          ? "B"
          : safeScore >= 45
            ? "C"
            : "D";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 rounded-full">
        <defs>
          <linearGradient id={`grad-${safeScore}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-border)"
          strokeWidth="10"
          fill="none"
          opacity="0.6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#grad-${safeScore})`}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)",
            filter: "drop-shadow(0 0 12px var(--primary))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-5xl font-semibold tabular-nums" style={{ color }}>
          {safeScore}
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
          {label}
        </div>
        <div className="mt-1 text-[10px] font-mono text-muted-foreground">Grade {grade}</div>
      </div>
    </div>
  );
}
