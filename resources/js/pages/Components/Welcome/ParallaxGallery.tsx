import { useState, useRef } from 'react';
import { useRelativeScroll } from '@/hooks/useParallax';
import { getCategory } from './ParallaxHero';
import { ArrowRight, MapPinned } from '@/pages/Components/Welcome/Icons';

export interface StationTripItem {
    id: number;
    title: string;
    province: string;
    location: string;
    station: string;
    tag: string;
    aqi: number;
    image: string;
    heightClass: string;
    accent?: boolean;
}

export const BORNEO_STATIONS: StationTripItem[] = [
    {
        id: 1,
        title: 'Kalimantan Barat',
        province: 'Kalbar',
        location: 'Pontianak & Danau Sentarum',
        station: 'Stasiun Kantor Gubernur Kalbar',
        tag: 'Kalimantan Barat',
        aqi: 185,
        // Gambar autentik Sungai Kapuas & rimba basah Kalbar
        image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
        heightClass: 'h-[360px] sm:h-[400px] md:h-[440px]',
    },
    {
        id: 2,
        title: 'Kalimantan Tengah',
        province: 'Kalteng',
        location: 'Palangka Raya & Sebangau',
        station: 'Stasiun Univ. Palangka Raya',
        tag: 'Kalimantan Tengah',
        aqi: 240,
        // Gambar autentik Hutan Rawa Gambut Sebangau Kalteng
        image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
        heightClass: 'h-[390px] sm:h-[430px] md:h-[470px]',
    },
    {
        id: 3,
        title: 'Kalimantan Selatan',
        province: 'Kalsel',
        location: 'Banjarmasin & Meratus',
        station: 'Stasiun Lambung Mangkurat',
        tag: 'Kalimantan Selatan',
        aqi: 162,
        // Gambar autentik Lanskap Sungai & Rimba Meratus Kalsel
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
        heightClass: 'h-[410px] sm:h-[450px] md:h-[490px]',
        accent: true,
    },
    {
        id: 4,
        title: 'Kalimantan Timur',
        province: 'Kaltim',
        location: 'Samarinda, Balikpapan & Derawan',
        station: 'Stasiun Segiri & Klandasan',
        tag: 'Kalimantan Timur',
        aqi: 88,
        // Gambar autentik Pesona Bahari Derawan & Hutan Lindung Kaltim
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        heightClass: 'h-[390px] sm:h-[430px] md:h-[470px]',
    },
    {
        id: 5,
        title: 'Kalimantan Utara',
        province: 'Kaltara',
        location: 'Tarakan & Kayan Mentarang',
        station: 'Stasiun Rimba Kayan Mentarang',
        tag: 'Kalimantan Utara',
        aqi: 42,
        // Gambar autentik Rimba Perawan & Air Terjun Kayan Mentarang Kaltara
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
        heightClass: 'h-[360px] sm:h-[400px] md:h-[440px]',
    },
];

interface ParallaxGalleryProps {
    onSelectStation?: (station: StationTripItem) => void;
}

export default function ParallaxGallery({ onSelectStation }: ParallaxGalleryProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const relativeScroll = useRelativeScroll(sectionRef, 400);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section
            id="gallery-section"
            ref={sectionRef}
            className="relative w-full bg-[#EEEEEE] text-[#1F6F5F] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
        >
            {/* Header Section in Fraunces font */}
            <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
                <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[#2FA084] block">
                    PANTAUAN 5 PROVINSI PULAU BORNEO
                </span>
                <h2 className="mt-3 font-heading font-serif text-3xl sm:text-5xl md:text-6xl text-[#1F6F5F] tracking-tight font-normal">
                    LIMA PROVINSI KALIMANTAN
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#1F6F5F]/80 max-w-xl mx-auto font-light leading-relaxed">
                    Pantau kondisi kualitas udara (ISPU) dan indeks titik panas secara real-time di seluruh provinsi Pulau Kalimantan.
                </p>
            </div>

            {/* 5 Vertical Staggered Parallax Photo Cards with Proper Padding and Sizing */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-5 overflow-x-auto pt-8 pb-10 no-scrollbar">
                {BORNEO_STATIONS.map((station, index) => {
                    // Parallax velocity yang proporsional dan tidak menyebabkan elemen terpotong
                    const speed = index === 2 ? -0.06 : index % 2 === 0 ? 0.04 : -0.04;
                    const translateY = Math.max(-25, Math.min(25, relativeScroll * speed));

                    const isHovered = hoveredId === station.id;
                    const isCenter = station.accent;
                    const cat = getCategory(station.aqi);

                    return (
                        <div
                            key={station.id}
                            onMouseEnter={() => setHoveredId(station.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => onSelectStation?.(station)}
                            className={`group relative flex-1 min-w-[240px] sm:min-w-[260px] md:min-w-0 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer ${station.heightClass} will-change-transform border ${
                                isCenter
                                    ? 'border-[#2FA084] ring-2 ring-[#2FA084]/50'
                                    : 'border-white/90'
                            }`}
                            style={{
                                transform: `translate3d(0, ${translateY}px, 0) scale(${isHovered ? 1.025 : 1})`,
                            }}
                        >
                            {/* Photographic Image with Contrast & Saturation Shift */}
                            <img
                                src={station.image}
                                alt={station.title}
                                className={`w-full h-full object-cover transition-all duration-700 ${
                                    isCenter
                                        ? 'contrast-110 saturate-110 group-hover:scale-105'
                                        : 'grayscale-30 group-hover:grayscale-0 group-hover:scale-105'
                                }`}
                            />

                            {/* Gradient Overlay for Legibility */}
                            <div
                                className={`absolute inset-0 transition-opacity duration-500 ${
                                    isCenter
                                        ? 'bg-gradient-to-t from-[#1F6F5F]/95 via-[#1F6F5F]/35 to-transparent'
                                        : 'bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-[#1F6F5F]/90'
                                }`}
                            />

                            {/* Top Badge: Tag & Number - Diberi padding aman agar tidak terpotong */}
                            <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center z-10">
                                <span
                                    className={`text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-md shadow-xs ${
                                        isCenter
                                            ? 'bg-[#2FA084] text-white'
                                            : 'bg-white/90 text-[#1F6F5F] group-hover:bg-[#2FA084] group-hover:text-white transition-colors'
                                    }`}
                                >
                                    {station.tag}
                                </span>
                                <span className="text-xs font-mono font-bold text-white/90">
                                    0{station.id}
                                </span>
                            </div>

                            {/* Floating ISPU Live Badge on Card */}
                            <div className="absolute top-13 right-3.5 z-10">
                                <div className="rounded-xl border border-white/30 bg-black/50 backdrop-blur-md px-2.5 py-1 text-right text-white shadow-md">
                                    <div className="font-heading font-serif text-lg font-bold tabular-nums leading-none">
                                        {station.aqi}
                                    </div>
                                    <div className={`text-[9px] font-semibold uppercase tracking-wider ${cat.text}`}>
                                        {cat.label}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Card Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10 text-white transform transition-transform duration-500">
                                <span className="text-[11px] text-[#6FCF97] font-medium tracking-wide flex items-center gap-1 uppercase">
                                    <MapPinned className="h-3 w-3" />
                                    {station.location}
                                </span>
                                <h3 className="font-heading font-serif text-xl sm:text-2xl font-bold leading-tight mt-1 text-white group-hover:text-[#6FCF97] transition-colors">
                                    {station.title}
                                </h3>
                                <p className="text-[11px] text-white/80 mt-0.5 font-light">
                                    {station.station}
                                </p>

                                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="font-medium">Lihat Telemetri</span>
                                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-[#6FCF97]" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
