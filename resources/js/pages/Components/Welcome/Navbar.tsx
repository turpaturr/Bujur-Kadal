import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Wind, Menu, X, ArrowRight } from "@/pages/Components/Welcome/Icons";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EEEEEE] bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#beranda" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2FA084] shadow-xs text-white group-hover:bg-[#1F6F5F] transition-colors">
            <Wind className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <span className="font-heading font-serif text-xl font-bold tracking-tight text-[#1F6F5F]">
            Borneo<span className="text-[#2FA084]">Care</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-wider md:flex">
          <a href="#beranda" className="text-[#1F6F5F]/80 transition hover:text-[#2FA084]">Beranda</a>
          <a href="#quote-section" className="text-[#1F6F5F]/80 transition hover:text-[#2FA084]">Esensi</a>
          <a href="#gallery-section" className="text-[#1F6F5F]/80 transition hover:text-[#2FA084]">Stasiun Rimba</a>
          <a href="#analisis" className="text-[#1F6F5F]/80 transition hover:text-[#2FA084]">Analisis</a>
          <a href="#edukasi" className="text-[#1F6F5F]/80 transition hover:text-[#2FA084]">Edukasi</a>
          <a href="#solusi" className="text-[#1F6F5F]/80 transition hover:text-[#2FA084]">Solusi</a>
        </nav>

        <div className="flex items-center gap-3">
          {auth?.user ? (
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold bg-[#2FA084] hover:bg-[#1F6F5F] text-white shadow-xs transition-colors"
            >
              Masuk Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold text-[#1F6F5F] hover:text-[#2FA084] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold bg-[#2FA084] hover:bg-[#1F6F5F] text-white shadow-xs transition-colors"
              >
                Daftar Warga
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-[#1F6F5F] hover:bg-[#EEEEEE]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#EEEEEE] bg-white px-6 py-4 space-y-3 text-sm">
          <a href="#beranda" onClick={() => setMenuOpen(false)} className="block py-1 text-[#1F6F5F]/80 hover:text-[#2FA084]">Beranda</a>
          <a href="#quote-section" onClick={() => setMenuOpen(false)} className="block py-1 text-[#1F6F5F]/80 hover:text-[#2FA084]">Esensi Rimba</a>
          <a href="#gallery-section" onClick={() => setMenuOpen(false)} className="block py-1 text-[#1F6F5F]/80 hover:text-[#2FA084]">Stasiun Rimba</a>
          <a href="#analisis" onClick={() => setMenuOpen(false)} className="block py-1 text-[#1F6F5F]/80 hover:text-[#2FA084]">Analisis</a>
          <a href="#edukasi" onClick={() => setMenuOpen(false)} className="block py-1 text-[#1F6F5F]/80 hover:text-[#2FA084]">Edukasi</a>
          <a href="#solusi" onClick={() => setMenuOpen(false)} className="block py-1 text-[#1F6F5F]/80 hover:text-[#2FA084]">Solusi</a>
          <div className="pt-2 border-t border-[#EEEEEE] space-y-2">
            {auth?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold bg-[#2FA084] text-white"
              >
                Buka Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full py-2 text-xs font-semibold border border-[#1F6F5F]/30 text-[#1F6F5F]"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full py-2 text-xs font-semibold bg-[#2FA084] text-white"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

