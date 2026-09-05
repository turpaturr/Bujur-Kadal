import { Wind } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <Wind className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight">BorneoCare</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 BorneoCare · Platform Mitigasi &amp; Kesehatan Preventif Kalimantan.
        </p>
      </div>
    </footer>
  );
}
