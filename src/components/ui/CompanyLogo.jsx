import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function CompanyLogo({ size = "md", to, className = "" }) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative ${
          isLg ? "size-11 rounded-xl" : isSm ? "size-7 rounded-md" : "size-9 rounded-xl"
        } bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0`}
      >
        <ShieldCheck className={isLg ? "size-6" : isSm ? "size-4" : "size-5"} />
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-background" />
      </div>
      <div className="leading-tight">
        <div
          className={`font-display font-bold tracking-tight text-foreground ${
            isLg ? "text-xl" : isSm ? "text-sm" : "text-base"
          }`}
        >
          Trust<span className="text-primary">Grid</span>
        </div>
        {!isSm && (
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            Enterprise KYC
          </div>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center group">
        {content}
      </Link>
    );
  }

  return content;
}

export { CompanyLogo };
