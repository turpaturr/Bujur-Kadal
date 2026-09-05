import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck, MapPinned, BellRing, Activity,
  ArrowUpRight, ChevronLeft, ChevronRight, Flame, TrendingUp,
  BookOpen, HeartPulse, Home, Radiation, Info, ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area
} from "recharts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data Statis Terfokus
// ---------------------------------------------------------------------------
const ISPU_CATEGORIES = [
  { min: 0,   max: 50,  label: "Baik",              chip: "bg-emerald-500",   text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/30" },
  { min: 51,  max: 100, label: "Sedang",            chip: "bg-sky-500",       text: "text-sky-600 dark:text-sky-400",         ring: "ring-sky-500/30" },
  { min: 101, max: 200, label: "Tidak Sehat",       chip: "bg-amber-500",     text: "text-amber-600 dark:text-amber-400",     ring: "ring-amber-500/30" },
  { min: 201, max: 300, label: "Sangat Tidak Sehat",chip: "bg-orange-600",    text: "text-orange-600 dark:text-orange-400",   ring: "ring-orange-500/30" },
  { min: 301, max: 999, label: "Berbahaya",         chip: "bg-rose-700",      text: "text-rose-600 dark:text-rose-400",       ring: "ring-rose-500/30" },
];

const getCategory = (aqi: number) =>
  ISPU_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max) ?? ISPU_CATEGORIES[4];

const CITIES_STATIC = [
  { city: "balikpapan", display_name: "Balikpapan", station_name: "Stasiun Klandasan", aqi: 78 },
  { city: "pontianak", display_name: "Pontianak", station_name: "Stasiun Kantor Gubernur", aqi: 195 },
  { city: "palangkaraya", display_name: "Palangka Raya", station_name: "Stasiun Universitas Palangka", aqi: 240 },
  { city: "banjarmasin", display_name: "Banjarmasin", station_name: "Stasiun Lambung Mangkurat", aqi: 162 },
  { city: "samarinda", display_name: "Samarinda", station_name: "Stasiun GOR Segiri", aqi: 95 },
];

const KARHUTLA_CHART_DATA = [
  { week: "M1 Agt", hotspots: 120,  ispa: 1400 },
  { week: "M2 Agt", hotspots: 240,  ispa: 2100 },
  { week: "M3 Agt", hotspots: 450,  ispa: 3800 },
  { week: "M4 Agt", hotspots: 680,  ispa: 5200 },
  { week: "M1 Sep", hotspots: 890,  ispa: 7400 },
  { week: "M2 Sep", hotspots: 1150, ispa: 9600 },
];

const CAROUSEL_STATS = [
  { id: 1, title: "165.000+", subtitle: "Kasus ISPA", desc: "Lonjakan infeksi saluran pernapasan tercatat di Kalimantan sepanjang siklus karhutla." },
  { id: 2, title: "PM 2.5",   subtitle: "Ancaman Mikroskopis", desc: "Polutan super kecil yang menembus alveoli paru-paru dan masuk aliran darah." },
  { id: 3, title: "10,6 Jt",  subtitle: "Jiwa Terdampak", desc: "Masyarakat di 7 provinsi terpapar kabut asap pekat setiap harinya." },
  { id: 4, title: "Siaga",    subtitle: "Status Darurat", desc: "Penetapan status darurat oleh pemerintah daerah untuk mitigasi kesehatan." },
];

const EDUCATION_ITEMS = [
  {
    tag: "Kesehatan Pernapasan",
    icon: HeartPulse,
    title: "5 Latihan Napas untuk Bertahan di Musim Kabut Asap",
    excerpt: "Teknik pernapasan diafragma terbukti membantu tubuh mengurangi rasa sesak saat kualitas udara memburuk.",
    minutes: 6,
  },
  {
    tag: "Fakta Polusi",
    icon: Radiation,
    title: "Kenapa PM2.5 Lebih Berbahaya dari Debu Biasa?",
    excerpt: "Ukuran PM2.5 sangat kecil sehingga lolos dari filter hidung dan memicu peradangan sistemik.",
    minutes: 8,
  },
  {
    tag: "Mitigasi Rumah Tangga",
    icon: Home,
    title: "Membangun Ruang Aman di Rumah Saat ISPU Tinggi",
    excerpt: "Cukup satu ruangan tertutup rapat dengan filter sederhana bisa menurunkan konsentrasi PM2.5 hingga 80%.",
    minutes: 7,
  },
];

const NUMERIC_TICKS = { style: { fontFamily: "JetBrains Mono, monospace", fontSize: 11 } };

// ---------------------------------------------------------------------------
// Komponen Utama
// ---------------------------------------------------------------------------
export default function Welcome() {
  const [aqi, setAqi] = useState(187);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setAqi((prev) => Math.min(300, Math.max(120, prev + (Math.random() > 0.5 ? 1 : -1) * 3)));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const activeCategory = getCategory(aqi);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-30" />

      {/* Navbar Komponen Terpisah */}
      <Navbar />

      <main className="container mx-auto max-w-6xl px-6 pt-14 pb-24" id="beranda">

        {/* ============ Hero Section ============ */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-10">
          <div className="lg:col-span-7">
            <div className={cn("inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur ring-1", activeCategory.ring)}>
              <span className={cn("h-2 w-2 rounded-full animate-pulse", activeCategory.chip)} />
              Peringatan ISPA Dini · Real-time
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Kendalikan napas
              <br />
              <span className="text-primary">keluarga Anda.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Platform preventif berbasis data terpadu untuk melindungi warga Kalimantan dari ancaman infeksi pernapasan akibat kabut asap Karhutla.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-7">
                Mulai Mitigasi <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-7">
                Pelajari Ancaman
              </Button>
            </div>
          </div>

          {/* Live Monitor Card */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live ISPU Monitor</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPinned className="h-3 w-3" />
                  <span className="font-medium text-foreground">Palangka Raya</span>
                </div>
              </div>

              <div className="flex flex-col items-center px-6 pt-8 pb-6">
                <span className="font-display text-[88px] leading-none font-bold tracking-tighter text-foreground tabular-nums">
                  {aqi}
                </span>
                <div className={cn("mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white", activeCategory.chip)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
                  {activeCategory.label}
                </div>

                <div className="mt-6 w-full">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full transition-all duration-1000", activeCategory.chip)} style={{ width: `${Math.min(100, (aqi / 300) * 100)}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <span>0 Baik</span>
                    <span>300+ Bahaya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Perbandingan Kota ============ */}
        <section className="mt-24">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Info className="h-3.5 w-3.5" /> Pantauan Regional
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Kualitas Udara di Kota Kalimantan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {CITIES_STATIC.map((c) => {
              const cat = getCategory(c.aqi);
              return (
                <div key={c.city} className="flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.display_name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.station_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold tabular-nums text-foreground">{c.aqi}</p>
                      <p className={cn("text-[10px] font-semibold uppercase tracking-wider", cat.text)}>{cat.label}</p>
                    </div>
                    <span className={cn("h-9 w-1.5 rounded-full", cat.chip)} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============ Grafik Analisis (Statis) ============ */}
        <section id="analisis" className="mt-24">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <TrendingUp className="h-3.5 w-3.5" /> Analisis Tren Musiman
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Eskalasi Karhutla &amp; Kasus ISPA
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Korelasi mingguan titik panas dengan lonjakan kasus ISPA.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={KARHUTLA_CHART_DATA} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" tick={NUMERIC_TICKS} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={NUMERIC_TICKS} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, color: "hsl(var(--popover-foreground))" }} />
                  <Area type="monotone" dataKey="hotspots" name="Titik Panas" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={0.2} fill="hsl(var(--chart-2))" />
                  <Area type="monotone" dataKey="ispa" name="Kasus ISPA" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={0.2} fill="hsl(var(--chart-1))" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ============ Carousel Statis ============ */}
        <section className="mt-24">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Flame className="h-3.5 w-3.5" /> Ancaman Senyap
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Alasan Mitigasi Tak Bisa Ditunda
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel("left")} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted" aria-label="Geser kiri">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scrollCarousel("right")} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted" aria-label="Geser kanan">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={carouselRef} className="no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1">
            {CAROUSEL_STATS.map((stat) => (
              <div key={stat.id} className="flex min-w-[280px] shrink-0 snap-center flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:min-w-[320px]">
                <div>
                  <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{stat.subtitle}</span>
                  <div className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{stat.title}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stat.desc}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
                  <span>Data Resmi</span>
                  <span className="font-mono">0{stat.id} / 04</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ Pusat Edukasi ============ */}
        <section id="edukasi" className="mt-24">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <BookOpen className="h-3.5 w-3.5" /> Pusat Edukasi
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Napas Sehat Dimulai dari Pengetahuan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {EDUCATION_ITEMS.map((art, i) => {
              const Icon = art.icon;
              return (
                <div key={i} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">{art.minutes} min baca</span>
                    </div>
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">
                      {art.tag}
                    </span>
                    <h4 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
                      {art.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline cursor-pointer">
                      Baca Panduan <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============ Bento Solusi ============ */}
        <section id="solusi" className="mt-24">
          <h2 className="mb-8 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Solusi Human-Centric
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 md:col-span-2">
              <div className="relative z-10">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">Jaringan Sensor &amp; Data KLHK</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Sistem dirancang untuk memberikan informasi pencegahan dini yang akurat dan mudah dipahami langsung oleh masyarakat.
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">Filter &amp; Masker</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Rekomendasi instan penggunaan respirator pelindung kualitas udara.</p>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-card p-8">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <BellRing className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">Peringatan Dini</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Notifikasi langsung ketika kondisi udara mulai memasuki batas rentan.</p>
            </div>

            <div className="flex flex-col items-start justify-between rounded-2xl border border-border bg-foreground p-8 text-background sm:flex-row sm:items-center md:col-span-2">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight">Panduan Aktivitas Harian</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-background/70">Instruksi aman jam luar ruangan dan aturan ventilasi rumah.</p>
              </div>
              <button className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-background/10 transition hover:bg-background/20 sm:mt-0" aria-label="Buka panduan">
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Komponen Terpisah */}
      <Footer />
    </div>
  );
}
