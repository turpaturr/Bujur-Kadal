import { useRef } from 'react';
import { Flame, ChevronLeft, ChevronRight } from '@/pages/Components/Welcome/Icons';

export interface CarouselStat {
    id: number;
    title: string;
    subtitle: string;
    desc: string;
}

export const CAROUSEL_STATS: CarouselStat[] = [
    { id: 1, title: "165.000+", subtitle: "Kasus ISPA", desc: "Lonjakan infeksi saluran pernapasan tercatat di Kalimantan sepanjang siklus karhutla." },
    { id: 2, title: "PM 2.5",   subtitle: "Ancaman Mikroskopis", desc: "Polutan super kecil yang menembus alveoli paru-paru dan masuk aliran darah." },
    { id: 3, title: "10,6 Jt",  subtitle: "Jiwa Terdampak", desc: "Masyarakat di 7 provinsi terpapar kabut asap pekat setiap harinya." },
    { id: 4, title: "Siaga",    subtitle: "Status Darurat", desc: "Penetapan status darurat oleh pemerintah daerah untuk mitigasi kesehatan." },
];

export default function ThreatCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollCarousel = (dir: "left" | "right") => {
        if (!carouselRef.current) return;
        carouselRef.current.scrollBy({
            left: dir === "left" ? -320 : 320,
            behavior: "smooth",
        });
    };

    return (
        <section className="mt-24">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2FA084]">
                        <Flame className="h-3.5 w-3.5 text-amber-500" /> Ancaman Senyap
                    </div>
                    <h2 className="mt-2 font-heading font-serif text-2xl font-bold tracking-tight text-[#1F6F5F] sm:text-3xl">
                        Alasan Mitigasi Tak Bisa Ditunda
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => scrollCarousel("left")}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEEEE] bg-white dark:bg-card text-[#1F6F5F] transition hover:bg-[#EEEEEE]"
                        aria-label="Geser kiri"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollCarousel("right")}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEEEE] bg-white dark:bg-card text-[#1F6F5F] transition hover:bg-[#EEEEEE]"
                        aria-label="Geser kanan"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div
                ref={carouselRef}
                className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar"
            >
                {CAROUSEL_STATS.map((stat) => (
                    <div
                        key={stat.id}
                        className="flex min-w-[280px] shrink-0 snap-center flex-col justify-between rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-6 sm:min-w-[320px] shadow-xs hover:border-[#2FA084]/40 transition-colors"
                    >
                        <div>
                            <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2FA084]">
                                {stat.subtitle}
                            </span>
                            <div className="font-heading font-serif text-3xl font-bold tracking-tight text-[#1F6F5F] sm:text-4xl">
                                {stat.title}
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {stat.desc}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
                            <span>Data Resmi</span>
                            <span className="font-mono font-semibold text-[#1F6F5F]">0{stat.id} / 04</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

