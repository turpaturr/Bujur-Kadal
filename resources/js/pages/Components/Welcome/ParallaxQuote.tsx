export default function ParallaxQuote() {
    return (
        <section
            id="quote-section"
            className="relative w-full min-h-[75vh] bg-[#1F6F5F] text-white flex flex-col justify-between items-center overflow-hidden pt-20 pb-0 select-none"
        >
            {/* Background subtle noise/dot pattern in #2FA084 */}
            <div className="absolute inset-0 bg-[radial-gradient(#2FA084_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

            {/* Ambient Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,160,132,0.15)_0%,transparent_70%)] pointer-events-none" />

            {/* Container for Quote - Clean, Elegant & Focused */}
            <div className="relative max-w-4xl mx-auto px-6 sm:px-10 py-16 flex flex-col items-center justify-center my-auto w-full z-10">
                <div className="relative w-full max-w-3xl mx-auto px-6 sm:px-12 py-12 sm:py-16 rounded-3xl bg-[#1F6F5F]/90 backdrop-blur-xl border border-white/20 shadow-2xl text-center">
                    {/* Badge di atas kutipan */}
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#6FCF97] font-semibold mb-6">
                        <span className="w-8 h-[1px] bg-[#6FCF97]/60" />
                        <span>Misi &amp; Esensi BorneoCare</span>
                        <span className="w-8 h-[1px] bg-[#6FCF97]/60" />
                    </div>

                    {/* Paragraf Pernyataan Utama */}
                    <p className="font-heading font-serif text-lg sm:text-2xl md:text-3xl font-light leading-relaxed sm:leading-[1.5] tracking-normal text-white">
                        Sebuah{' '}
                        <span className="text-[#6FCF97] font-normal italic">
                            platform health-tech ramah pengguna
                        </span>{' '}
                        yang mendampingi Anda dan keluarga menghadapi musim kabut asap.{' '}
                        <br className="hidden sm:inline" />
                        Kami fokus pada{' '}
                        <span className="text-white font-medium underline decoration-[#6FCF97]/60 underline-offset-8">
                            tindakan preventif
                        </span>{' '}
                        untuk melindungi setiap tarikan napas masyarakat dari dampak buruk Karhutla melalui{' '}
                        <span className="text-[#EEEEEE]">panduan kesehatan praktis</span>,{' '}
                        <span className="text-[#6FCF97] font-normal">pemantauan udara</span>, dan{' '}
                        <span className="text-white font-normal">langkah proteksi dini</span>.
                    </p>

                    {/* Subtitle Accent Bawah */}
                    <div className="mt-8 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/70 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6FCF97] animate-pulse" />
                        <span>Melindungi Setiap Napas di Tanah Borneo</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6FCF97] animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-10 sm:h-14 w-full" />

            {/* Organic Torn Paper Edge SVG Divider transitioning from #1F6F5F to #EEEEEE */}
            <div className="relative w-full leading-none z-20 pointer-events-none">
                <svg
                    className="w-full h-14 sm:h-20 md:h-28 text-[#EEEEEE] fill-current preserve-3d"
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                >
                    <path d="M0,32L30,42.7C60,53,120,75,180,74.7C240,75,300,53,360,42.7C420,32,480,32,540,48C600,64,660,96,720,96C780,96,840,64,900,53.3C960,43,1020,53,1080,64C1140,75,1200,85,1260,80C1320,75,1380,53,1410,42.7L1440,32L1440,120L1410,120C1380,120,1320,120,1260,120C1200,120,1140,120,1080,120C1020,120,960,120,900,120C840,120,780,120,720,120C660,120,600,120,540,120C480,120,420,120,360,120C300,120,240,120,180,120C120,120,60,120,30,120L0,120Z" />
                </svg>
            </div>
        </section>
    );
}
