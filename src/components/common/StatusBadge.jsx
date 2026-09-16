import { cn } from "../../utils/utils";

export function StatusBadge({ status, className }) {
  const norm = (status || "").toLowerCase();

  let styles = "bg-muted text-muted-foreground border-border";
  let label = status || "Unknown";

  if (
    norm.includes("verif") ||
    norm.includes("pass") ||
    norm.includes("success") ||
    norm.includes("approv")
  ) {
    styles = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    label = status === "approved" || status === "APPROVED" ? "Approved" : "Verified";
  } else if (norm.includes("pend") || norm.includes("progress") || norm.includes("review")) {
    styles = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    label = norm.includes("review") ? "Under Review" : "Pending";
  } else if (norm.includes("submit")) {
    styles = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    label = "Submitted";
  } else if (norm.includes("draft")) {
    styles = "bg-muted/70 text-muted-foreground border-border";
    label = "Draft";
  } else if (
    norm.includes("fail") ||
    norm.includes("reject") ||
    norm.includes("dispute") ||
    norm.includes("high")
  ) {
    styles = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    label = norm.includes("dispute")
      ? "Disputed"
      : norm.includes("reject")
        ? "Rejected"
        : "Flagged";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border uppercase",
        styles,
        className,
      )}
    >
      {label}
    </span>
  );
}
