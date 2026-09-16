import { cn } from "../../utils/utils";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground p-5 sm:p-6 shadow-xs transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, action, className = "" }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 mb-4", className)}>
      <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">{children}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, delta, icon, accent = "default", className = "" }) {
  const accentStyles = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    destructive: "text-rose-600 dark:text-rose-400",
  };

  return (
    <Card className={cn("flex flex-col justify-between space-y-3", className)}>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center text-foreground">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className={cn("text-2xl sm:text-3xl font-bold tracking-tight", accentStyles[accent])}>
          {value}
        </div>
        {delta && <div className="text-xs text-muted-foreground mt-1 font-medium">{delta}</div>}
      </div>
    </Card>
  );
}
