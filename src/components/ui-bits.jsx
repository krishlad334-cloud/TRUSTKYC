import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Inbox,
  Loader2,
} from "lucide-react";

/** Enterprise Status Badge for KYC, Deals, Severity, and Verification */
export function StatusBadge({ status, className = "" }) {
  if (!status) status = "Draft";
  const raw = String(status).trim().toUpperCase();

  const map = {
    VERIFIED: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
      label: "Verified",
    },
    APPROVED: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
      label: "Approved",
    },
    ACTIVE: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
      label: "Active",
    },
    COMPLETED: {
      bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
      dot: "bg-blue-500",
      label: "Completed",
    },
    RESOLVED: {
      bg: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800/60",
      dot: "bg-teal-500",
      label: "Resolved",
    },
    PENDING: {
      bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
      dot: "bg-amber-500",
      label: "Pending",
    },
    SUBMITTED: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
      dot: "bg-indigo-500 animate-pulse",
      label: "Submitted",
    },
    UNDER_REVIEW: {
      bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
      dot: "bg-amber-500 animate-pulse",
      label: "Under Review",
    },
    DRAFT: {
      bg: "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      dot: "bg-slate-400",
      label: "Draft",
    },
    REJECTED: {
      bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
      dot: "bg-rose-500",
      label: "Rejected",
    },
    DISPUTED: {
      bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
      dot: "bg-rose-500 animate-pulse",
      label: "Disputed",
    },
    CANCELLED: {
      bg: "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      dot: "bg-slate-400",
      label: "Cancelled",
    },
    HIGH: {
      bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
      dot: "bg-rose-500",
      label: "High",
    },
    MEDIUM: {
      bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
      dot: "bg-amber-500",
      label: "Medium",
    },
    LOW: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
      label: "Low",
    },
  };

  const current = map[raw] || {
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg} ${className}`}
    >
      <span className={`size-1.5 rounded-full shrink-0 ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}

/** Modern Enterprise Stat KPI Card */
export function StatCard({
  label,
  value,
  delta,
  hint,
  icon,
  accent = "primary",
  trend,
  className = "",
}) {
  const subtext = delta ?? hint;

  const accentColors = {
    primary:
      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/40",
    success:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40",
    warning:
      "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/40",
    destructive:
      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40",
    neutral: "text-muted-foreground bg-muted border-border",
  };

  return (
    <div
      className={`glass-card p-5 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <div
            className={`size-9 rounded-xl flex items-center justify-center border shrink-0 ${accentColors[accent] || accentColors.primary}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="font-mono text-3xl font-bold tracking-tight text-foreground">{value}</div>

      {subtext && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
          {trend === "up" && <TrendingUp className="size-3.5 text-emerald-500 shrink-0" />}
          {trend === "down" && <TrendingDown className="size-3.5 text-rose-500 shrink-0" />}
          <span className="truncate">{subtext}</span>
        </div>
      )}
    </div>
  );
}

/** Standard Enterprise Card */
export function Card({ children, className = "", noPadding = false }) {
  return (
    <div className={`glass-card ${noPadding ? "" : "p-5 md:p-6"} ${className}`}>{children}</div>
  );
}

/** Clean Section Title with optional action button */
export function SectionTitle({ children, subtitle, action, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground font-mono">
          {children}
        </h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Helpful Empty State component */
export function EmptyState({
  icon: Icon = Inbox,
  title = "No records found",
  description = "Get started by adding or submitting a new record.",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl border border-dashed border-border bg-card/50 ${className}`}
    >
      <div className="size-12 rounded-2xl bg-muted/80 border border-border flex items-center justify-center text-muted-foreground mb-4">
        <Icon className="size-6" />
      </div>
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5">{description}</p>
      {action}
    </div>
  );
}

/** Shimmer Loading Skeleton */
export function LoadingSkeleton({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg shimmer-loading"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
