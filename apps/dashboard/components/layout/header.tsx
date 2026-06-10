import { Building2 } from "lucide-react";

export function Header() {
  return (
    <header
      className="glass-panel flex h-14 shrink-0 items-center justify-between px-6"
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="squircle-xs flex h-8 w-8 items-center justify-center bg-accent/8 text-accent">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[13px] font-semibold text-foreground">
            AGEC Finances
          </span>
          <span className="text-[11px] text-muted">Cabinet comptable · Firm API</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="squircle-xs flex h-8 w-8 items-center justify-center bg-navy text-[11px] font-semibold text-white">
          AF
        </div>
      </div>
    </header>
  );
}
