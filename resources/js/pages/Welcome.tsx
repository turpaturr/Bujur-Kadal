import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Navbar } from '@/pages/Components/Welcome/Navbar';
import { Footer } from '@/pages/Components/Welcome/Footer';
import {
    ParallaxHero,
    ParallaxQuote,
    ParallaxGallery,
    TrendAnalysis,
    ThreatCarousel,
    EducationSection,
    SolutionBento,
} from '@/pages/Components/Welcome';
import type { StationTripItem } from '@/pages/Components/Welcome/ParallaxGallery';
import { X, ArrowRight, Activity, MapPinned } from '@/pages/Components/Welcome/Icons';

export default function Welcome() {
    const [aqi, setAqi] = useState(187);
    const [activeStationModal, setActiveStationModal] = useState<StationTripItem | null>(null);

    useEffect(() => {
        const iv = setInterval(() => {
            setAqi((prev) =>
                Math.min(300, Math.max(120, prev + (Math.random() > 0.5 ? 1 : -1) * 3)),
            );
        }, 4000);
        return () => clearInterval(iv);
    }, []);

    return (
        <>
            <Head title="BorneoCare - Monitoring Karhutla & Kualitas Udara Kalimantan" />

            <div className="min-h-screen bg-[#EEEEEE] font-sans text-[#1F6F5F] antialiased flex flex-col selection:bg-[#2FA084] selection:text-white">
                {/* 1. Sleek Floating Header */}
                <Navbar />

                {/* 2. Cinematic Parallax Hero (TAE & Untitled Film Inspired) */}
                <ParallaxHero aqi={aqi} />

                {/* 3. Editorial Quote Section with 3 Floating Parallax Cards */}
                <ParallaxQuote />

                {/* 4. 5-Card Staggered Vertical Parallax Gallery (Destinasi & Stasiun Pantau) */}
                <ParallaxGallery onSelectStation={(st) => setActiveStationModal(st)} />

                {/* 5. Core Analytical & Educational Content Sections */}
                <main className="w-full bg-[#EEEEEE] px-4 sm:px-6 lg:px-8 pb-28 flex-1">
                    <div className="container mx-auto max-w-6xl">
                        {/* Analisis Tren Karhutla & ISPA */}
                        <TrendAnalysis />

                        {/* Carousel Ancaman & Dampak */}
                        <ThreatCarousel />

                        {/* Pusat Edukasi & Mitigasi */}
                        <EducationSection />

                        {/* Solusi Human-Centric */}
                        <SolutionBento />
                    </div>
                </main>

                {/* 6. Editorial Footer */}
                <Footer />

                {/* Quick Station Telemetry Modal */}
                {activeStationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-card border border-[#EEEEEE] shadow-2xl p-6 sm:p-8 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setActiveStationModal(null)}
                                className="absolute top-5 right-5 h-8 w-8 rounded-full border border-[#EEEEEE] flex items-center justify-center text-[#1F6F5F] hover:bg-[#EEEEEE] transition-colors"
                                aria-label="Tutup"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#2FA084]">
                                <MapPinned className="h-4 w-4" />
                                {activeStationModal.location}
                            </div>

                            <h3 className="mt-2 font-heading font-serif text-2xl sm:text-3xl font-bold text-[#1F6F5F]">
                                {activeStationModal.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {activeStationModal.station}
                            </p>

                            <div className="mt-6 p-4 rounded-2xl bg-[#EEEEEE]/70 border border-[#EEEEEE] flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#1F6F5F]/70 block font-medium">
                                        Indeks Standar Pencemar Udara (ISPU)
                                    </span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="font-heading font-serif text-4xl font-bold text-[#1F6F5F] tabular-nums">
                                            {activeStationModal.aqi}
                                        </span>
                                        <span className="text-xs font-semibold uppercase text-[#2FA084]">
                                            PM 2.5 Monitoring
                                        </span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-[#2FA084] text-white flex items-center justify-center">
                                    <Activity className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Link
                                    href="/dashboard"
                                    className="flex-1 inline-flex items-center justify-center rounded-full py-3 px-5 text-xs font-semibold uppercase tracking-wider bg-[#2FA084] hover:bg-[#1F6F5F] text-white transition-colors shadow-md"
                                >
                                    Pantau di Peta Spasial <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setActiveStationModal(null)}
                                    className="rounded-full py-3 px-5 text-xs font-semibold uppercase tracking-wider border border-[#1F6F5F]/25 text-[#1F6F5F] hover:bg-[#EEEEEE] transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

