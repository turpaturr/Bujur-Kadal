import { Wind } from "@/pages/Components/Welcome/Icons";

export function Footer() {
  return (
    <footer className="border-t border-[#1F6F5F]/20 bg-[#1F6F5F] text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2FA084] shadow-xs text-white">
            <Wind className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <span className="font-heading font-serif text-lg font-bold tracking-tight text-white">
            Borneo<span className="text-[#6FCF97]">Care</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-wider text-white/75">
          <a href="#beranda" className="hover:text-[#6FCF97] transition-colors">Beranda</a>
          <a href="#quote-section" className="hover:text-[#6FCF97] transition-colors">Esensi</a>
          <a href="#gallery-section" className="hover:text-[#6FCF97] transition-colors">Stasiun Rimba</a>
          <a href="#analisis" className="hover:text-[#6FCF97] transition-colors">Analisis</a>
          <a href="#edukasi" className="hover:text-[#6FCF97] transition-colors">Edukasi</a>
          <a href="#solusi" className="hover:text-[#6FCF97] transition-colors">Solusi</a>
        </nav>

        <p className="text-xs text-white/60 text-center md:text-right">
          © 2026 BorneoCare · Platform Mitigasi Karhutla &amp; ISPU Kalimantan.
        </p>
      </div>
    </footer>
  );
}

