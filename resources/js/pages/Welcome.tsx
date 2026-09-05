import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/pages/Components/Welcome/Navbar';
import { Footer } from '@/pages/Components/Welcome/Footer';
import {
    HeroSection,
    RegionalAirQuality,
    TrendAnalysis,
    ThreatCarousel,
    EducationSection,
    SolutionBento,
} from '@/pages/Components/Welcome';

export default function Welcome() {
    const [aqi, setAqi] = useState(187);

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

            <div className="min-h-screen bg-background font-sans text-foreground antialiased flex flex-col">
                {/* 1. Navbar */}
                <Navbar />

                {/* 2. Main Content Sections */}
                <main className="container mx-auto max-w-6xl px-6 pt-6 pb-20 flex-1" id="beranda">
                    {/* Hero & Live ISPU Monitor */}
                    <HeroSection aqi={aqi} />

                    {/* Pantauan Kualitas Udara Kota di Kalimantan */}
                    <RegionalAirQuality />

                    {/* Analisis Tren Karhutla & ISPA */}
                    <TrendAnalysis />

                    {/* Carousel Ancaman & Dampak */}
                    <ThreatCarousel />

                    {/* Pusat Edukasi & Mitigasi */}
                    <EducationSection />

                    {/* Solusi Human-Centric */}
                    <SolutionBento />
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}
