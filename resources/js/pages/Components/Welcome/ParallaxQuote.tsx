import { useRef } from 'react';
import { useRelativeScroll } from '@/hooks/useParallax';

export default function ParallaxQuote() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const relativeScroll = useRelativeScroll(sectionRef, 300);

    return (
        <section
            id="quote-section"
            ref={sectionRef}
            className="relative w-full min-h-[105vh] bg-[#1F6F5F] text-white flex flex-col justify-between items-center overflow-hidden pt-20 pb-0 select-none"
        >
            {/* Background subtle noise/dot pattern in #2FA084 */}
            <div className="absolute inset-0 bg-[radial-gradient(#2FA084_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

            {/* Container for Quote & Non-Obscuring Floating Parallax Cards */}
            <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-12 flex flex-col items-center justify-center min-h-[70vh] w-full">

                {/* 1. Floating Card Left - Di luar jangkauan teks utama (hidden di mobile, muncul di lg screen ke atas) */}
                <div
                    className="hidden lg:block absolute -top-4 -left-12 xl:-left-20 z-10 w-56 xl:w-72 aspect-4/3 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 pointer-events-auto transition-transform duration-700 ease-out hover:scale-105 will-change-transform"
                    style={{
                        transform: `translate3d(0, ${Math.max(-80, Math.min(80, relativeScroll * 0.12))}px, 0) rotate(-4deg)`,
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80"
                        alt="Penjelajah rimba Kalimantan"
                        className="w-full h-full object-cover grayscale-25 contrast-110 hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                    <span className="absolute bottom-3.5 left-3.5 text-[10px] uppercase tracking-widest text-white font-semibold px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-xs border border-white/10">
                        Eksplorasi Rimba
                    </span>
                </div>

                {/* 2. Floating Card Right - Di luar jangkauan teks utama (hidden di mobile, muncul di lg screen ke atas) */}
                <div
                    className="hidden lg:block absolute -bottom-6 -right-12 xl:-right-20 z-10 w-60 xl:w-76 aspect-4/3 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 pointer-events-auto transition-transform duration-700 ease-out hover:scale-105 will-change-transform"
                    style={{
                        transform: `translate3d(0, ${Math.max(-80, Math.min(80, -relativeScroll * 0.14))}px, 0) rotate(3deg)`,
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                        alt="Kabut murni pegunungan Borneo"
                        className="w-full h-full object-cover grayscale-20 contrast-110 hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                    <span className="absolute bottom-3.5 right-3.5 text-[10px] uppercase tracking-widest text-white font-semibold px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-xs border border-white/10">
                        Kemurnian Udara
                    </span>
                </div>

                {/* Main Protected Glass Editorial Container - Tidak akan pernah tertutup gambar */}
                <div className="relative z-20 max-w-3xl mx-auto px-6 sm:px-12 py-10 sm:py-14 rounded-3xl bg-[#1F6F5F]/90 backdrop-blur-xl border border-white/20 shadow-2xl text-center">
                    {/* Badge di atas kutipan */}
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#6FCF97] font-semibold mb-6">
                        <span className="w-6 h-[1px] bg-[#6FCF97]/60" />
                        <span>Misi &amp; Esensi BorneoCare</span>
                        <span className="w-6 h-[1px] bg-[#6FCF97]/60" />
                    </div>

                    {/* Paragraf Pernyataan Utama Sesuai Permintaan Pengguna */}
                    <p className="font-heading font-serif text-lg sm:text-2xl md:text-3xl font-light leading-relaxed sm:leading-[1.45] tracking-normal text-white">
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
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6FCF97]" />
                        <span>Melindungi Setiap Napas di Tanah Borneo</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6FCF97]" />
                    </div>
                </div>

                {/* 3. Small Floating Sanctuary Card (Placed safely below the text card, well-spaced) */}
                <div
                    className="relative mt-8 z-10 w-44 sm:w-56 aspect-16/9 rounded-xl overflow-hidden shadow-lg border border-white/25 pointer-events-auto transition-transform duration-700 ease-out hover:scale-105"
                >
                    <img
                        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
                        alt="Lembah hijau Kalimantan"
                        className="w-full h-full object-cover contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-widest text-white font-semibold px-2.5 py-0.5 rounded-full bg-[#2FA084]/90 border border-white/20">
                        Sanctuary Napas
                    </span>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-12 sm:h-16 w-full" />

            {/* Organic Torn Paper Edge SVG Divider transitioning from #1F6F5F to #EEEEEE */}
            <div className="relative w-full leading-none z-30 pointer-events-none">
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
