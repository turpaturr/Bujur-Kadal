import { useState } from "react";
import { Wind, Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#beranda" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Wind className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">BorneoCare</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#beranda" className="text-muted-foreground transition hover:text-foreground">Beranda</a>
          <a href="#analisis" className="text-muted-foreground transition hover:text-foreground">Analisis</a>
          <a href="#edukasi" className="text-muted-foreground transition hover:text-foreground">Edukasi</a>
          <a href="#solusi" className="text-muted-foreground transition hover:text-foreground">Solusi</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button size="sm" className="hidden md:inline-flex rounded-full px-4">
            Cek Udara
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3 text-sm">
          <a href="#beranda" onClick={() => setMenuOpen(false)} className="block">Beranda</a>
          <a href="#analisis" onClick={() => setMenuOpen(false)} className="block">Analisis</a>
          <a href="#edukasi" onClick={() => setMenuOpen(false)} className="block">Edukasi</a>
          <a href="#solusi" onClick={() => setMenuOpen(false)} className="block">Solusi</a>
          <div className="pt-2">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
