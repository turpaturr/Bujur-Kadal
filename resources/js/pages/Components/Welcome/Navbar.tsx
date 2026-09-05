import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Wind, Menu, X, ArrowRight } from "@/pages/Components/Welcome/Icons";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CCECEE] bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#beranda" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14967F] shadow-xs text-white">
            <Wind className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[#095D7E]">
            Borneo<span className="text-[#14967F]">Care</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#beranda" className="text-[#262626]/80 transition hover:text-[#14967F]">Beranda</a>
          <a href="#analisis" className="text-[#262626]/80 transition hover:text-[#14967F]">Analisis</a>
          <a href="#edukasi" className="text-[#262626]/80 transition hover:text-[#14967F]">Edukasi</a>
          <a href="#solusi" className="text-[#262626]/80 transition hover:text-[#14967F]">Solusi</a>
        </nav>

        <div className="flex items-center gap-3">
          {auth?.user ? (
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold bg-[#14967F] hover:bg-[#107b68] text-white shadow-xs transition-colors"
            >
              Dashboard ({auth.user.name})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold text-[#095D7E] hover:text-[#14967F] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold bg-[#14967F] hover:bg-[#107b68] text-white shadow-xs transition-colors"
              >
                Daftar Warga
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-[#262626] hover:bg-[#CCECEE]/30"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#CCECEE] bg-white px-6 py-4 space-y-3 text-sm">
          <a href="#beranda" onClick={() => setMenuOpen(false)} className="block py-1 text-[#262626]/80 hover:text-[#14967F]">Beranda</a>
          <a href="#analisis" onClick={() => setMenuOpen(false)} className="block py-1 text-[#262626]/80 hover:text-[#14967F]">Analisis</a>
          <a href="#edukasi" onClick={() => setMenuOpen(false)} className="block py-1 text-[#262626]/80 hover:text-[#14967F]">Edukasi</a>
          <a href="#solusi" onClick={() => setMenuOpen(false)} className="block py-1 text-[#262626]/80 hover:text-[#14967F]">Solusi</a>
          <div className="pt-2 border-t border-[#CCECEE]/60 space-y-2">
            {auth?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold bg-[#14967F] text-white"
              >
                Buka Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full py-2 text-xs font-semibold border border-[#095D7E]/30 text-[#095D7E]"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full py-2 text-xs font-semibold bg-[#14967F] text-white"
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
