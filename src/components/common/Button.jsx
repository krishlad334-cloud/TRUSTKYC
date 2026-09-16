import { cn } from "../../utils/utils";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const variants = {
    primary: "btn-primary shadow-xs",
    secondary: "btn-secondary border border-border hover:bg-muted text-foreground",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/70",
    destructive: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-600/20",
    outline: "border border-border text-foreground hover:bg-muted bg-transparent",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-xs font-semibold gap-2",
    lg: "h-11 px-5 text-sm font-semibold gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
