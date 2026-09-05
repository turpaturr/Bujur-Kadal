import { Activity, ShieldCheck, BellRing, ArrowUpRight } from '@/pages/Components/Welcome/Icons';

export default function SolutionBento() {
    return (
        <section id="solusi" className="mt-24">
            <h2 className="mb-8 font-heading font-serif text-2xl font-bold tracking-tight text-[#1F6F5F] sm:text-3xl">
                Solusi Human-Centric BorneoCare
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
                {/* Bento 1: Sensor & KLHK Data (span 2) */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-8 md:col-span-2 shadow-xs hover:border-[#2FA084]/40 transition-colors">
                    <div className="relative z-10">
                        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEEEE] text-[#2FA084]">
                            <Activity className="h-5 w-5" />
                        </div>
                        <h3 className="font-heading font-serif text-xl font-bold tracking-tight text-[#1F6F5F]">
                            Jaringan Sensor &amp; Data Spasial NASA
                        </h3>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                            Sistem dirancang untuk memberikan informasi pencegahan dini yang akurat dan mudah dipahami langsung oleh masyarakat Kalimantan.
                        </p>
                    </div>
                </div>

                {/* Bento 2: Filter & Masker */}
                <div className="flex flex-col rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-8 shadow-xs hover:border-[#2FA084]/40 transition-colors">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEEEE] text-[#1F6F5F]">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading font-serif text-lg font-bold tracking-tight text-[#1F6F5F]">
                        Filter &amp; Masker
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Rekomendasi instan penggunaan respirator pelindung saat kualitas udara memburuk.
                    </p>
                </div>

                {/* Bento 3: Peringatan Dini */}
                <div className="flex flex-col rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-8 shadow-xs hover:border-[#2FA084]/40 transition-colors">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEEEE] text-[#1F6F5F]">
                        <BellRing className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading font-serif text-lg font-bold tracking-tight text-[#1F6F5F]">
                        Peringatan Dini
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Notifikasi langsung ketika kondisi udara mulai memasuki batas rentan ISPA.
                    </p>
                </div>

                {/* Bento 4: Panduan Harian (span 2) */}
                <div className="flex flex-col items-start justify-between rounded-2xl border border-[#1F6F5F] bg-[#1F6F5F] p-8 text-white sm:flex-row sm:items-center md:col-span-2 shadow-sm">
                    <div>
                        <h3 className="font-heading font-serif text-xl font-bold tracking-tight text-white">
                            Panduan Aktivitas Harian
                        </h3>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                            Instruksi aman jam aktivitas luar ruangan dan aturan ventilasi rumah saat terjadi lonjakan asap Karhutla.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#2FA084] text-white transition hover:bg-[#6FCF97] hover:text-[#1F6F5F] sm:mt-0 shadow-md"
                        aria-label="Buka panduan"
                    >
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

