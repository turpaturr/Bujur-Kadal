import { BookOpen, HeartPulse, Radiation, Home, ArrowRight } from '@/pages/Components/Welcome/Icons';

export const EDUCATION_ITEMS = [
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
        excerpt: "Ukuran PM2.5 sangat kecil sehingga lolos dari filter hidung dan memicu peradangan sistemik organ paru.",
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

export default function EducationSection() {
    return (
        <section id="edukasi" className="mt-20">
            <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#14967F]">
                    <BookOpen className="h-3.5 w-3.5" /> Pusat Edukasi
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#095D7E] sm:text-3xl">
                    Napas Sehat Dimulai dari Pengetahuan
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Panduan praktis mitigasi medis dan perlindungan keluarga dari paparan asap.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {EDUCATION_ITEMS.map((art, i) => {
                    const IconComponent = art.icon;
                    return (
                        <div
                            key={i}
                            className="flex flex-col justify-between rounded-2xl border border-[#CCECEE] bg-white dark:bg-card p-6 shadow-xs hover:border-[#14967F]/40 transition-colors"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CCECEE] text-[#14967F]">
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground">{art.minutes} min baca</span>
                                </div>
                                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-[#14967F] mb-2">
                                    {art.tag}
                                </span>
                                <h4 className="font-display text-lg font-bold leading-snug tracking-tight text-[#095D7E]">
                                    {art.title}
                                </h4>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {art.excerpt}
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#14967F] inline-flex items-center gap-1 hover:underline cursor-pointer">
                                    Baca Panduan <ArrowRight className="h-3 w-3" />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
