import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, MapPinned } from '@/pages/Components/Welcome/Icons';
import { cn } from '@/lib/utils';

export interface IspuCategory {
    min: number;
    max: number;
    label: string;
    chip: string;
    text: string;
    ring: string;
}

export const ISPU_CATEGORIES: IspuCategory[] = [
    { min: 0,   max: 50,  label: "Baik",               chip: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/30" },
    { min: 51,  max: 100, label: "Sedang",             chip: "bg-sky-500",     text: "text-sky-600 dark:text-sky-400",         ring: "ring-sky-500/30" },
    { min: 101, max: 200, label: "Tidak Sehat",        chip: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400",     ring: "ring-amber-500/30" },
    { min: 201, max: 300, label: "Sangat Tidak Sehat", chip: "bg-orange-600",  text: "text-orange-600 dark:text-orange-400",   ring: "ring-orange-500/30" },
    { min: 301, max: 999, label: "Berbahaya",          chip: "bg-rose-700",    text: "text-rose-600 dark:text-rose-400",       ring: "ring-rose-500/30" },
];

export const getCategory = (aqi: number) =>
    ISPU_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max) ?? ISPU_CATEGORIES[4];

interface HeroSectionProps {
    aqi: number;
}

export default function HeroSection({ aqi }: HeroSectionProps) {
    const activeCategory = getCategory(aqi);
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;

    return (
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-10">
            {/* Sisi Kiri: Headline & CTA */}
            <div className="lg:col-span-7">
                <div className={cn("inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur ring-1", activeCategory.ring)}>
                    <span className={cn("h-2 w-2 rounded-full animate-pulse", activeCategory.chip)} />
                    Peringatan ISPA Dini · Real-time Kalimantan
                </div>

                <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl text-[#095D7E]">
                    Kendalikan napas{' '}
                    <br />
                    <span className="text-[#14967F]">keluarga Anda.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Platform preventif berbasis data spasial dan satelit NASA untuk melindungi warga Pulau Kalimantan dari ancaman kabut asap Karhutla.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href={auth?.user ? "/dashboard" : "/login"}
                        className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold bg-[#14967F] hover:bg-[#107b68] text-white shadow-xs transition-colors"
                    >
                        {auth?.user ? "Buka Dashboard" : "Masuk ke Dashboard"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <a
                        href="#analisis"
                        className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold border border-[#095D7E]/30 text-[#095D7E] hover:bg-[#CCECEE]/30 transition-colors"
                    >
                        Pelajari Ancaman
                    </a>
                </div>
            </div>

            {/* Sisi Kanan: Live ISPU Monitor Card */}
            <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-2xl border border-[#CCECEE] bg-white dark:bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/70 px-5 py-3 bg-[#F1F9FF] dark:bg-muted/30">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#095D7E]">
                            Live ISPU Monitor
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPinned className="h-3.5 w-3.5 text-[#14967F]" />
                            <span className="font-medium text-foreground">Palangka Raya</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center px-6 pt-8 pb-6">
                        <span className="font-display text-[88px] leading-none font-bold tracking-tighter text-[#095D7E] tabular-nums">
                            {aqi}
                        </span>
                        <div className={cn("mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-xs", activeCategory.chip)}>
                            <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
                            {activeCategory.label}
                        </div>

                        <div className="mt-6 w-full">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={cn("h-full transition-all duration-1000", activeCategory.chip)}
                                    style={{ width: `${Math.min(100, (aqi / 300) * 100)}%` }}
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                <span>0 Baik</span>
                                <span>300+ Berbahaya</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
