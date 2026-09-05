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
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Equator_Pontianak_Monument.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Tugu_Batang_Garing.JPG?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Tugu_Selamat_Datang_di_Kota_Banjarbaru.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Tugu_Khatulistiwa_Pontianak_2024_01.jpg?utm_source=min.wikipedia.org&utm_campaign=index&utm_content=original',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Tugu_Cinta_Damai.JPG?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original',
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
                    PROFIL 5 PROVINSI PULAU BORNEO
                </span>
                <h2 className="mt-3 font-heading font-serif text-3xl sm:text-5xl md:text-6xl text-[#1F6F5F] tracking-tight font-normal">
                    LIMA PROVINSI KALIMANTAN
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#1F6F5F]/80 max-w-xl mx-auto font-light leading-relaxed">
                    Jelajahi profil dan kondisi wilayah di seluruh provinsi Pulau Kalimantan.
                </p>
            </div>

            {/* 5 Vertical Staggered Parallax Photo Cards */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-5 overflow-x-auto pt-8 pb-10 no-scrollbar">
                {BORNEO_STATIONS.map((station, index) => {
                    // Parallax velocity yang proporsional dan tidak menyebabkan elemen terpotong
                    const speed = index === 2 ? -0.06 : index % 2 === 0 ? 0.04 : -0.04;
                    const translateY = Math.max(-25, Math.min(25, relativeScroll * speed));

                    const isHovered = hoveredId === station.id;
                    const isCenter = station.accent;

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
                            {/* Photographic Image */}
                            <img
                                src={station.image}
                                alt={station.title}
                                className={`w-full h-full object-cover transition-all duration-700 ${
                                    isCenter
                                        ? 'contrast-110 saturate-110 group-hover:scale-105'
                                        : 'grayscale-30 group-hover:grayscale-0 group-hover:scale-105'
                                }`}
                            />

                            {/* Gradient Overlay */}
                            <div
                                className={`absolute inset-0 transition-opacity duration-500 ${
                                    isCenter
                                        ? 'bg-gradient-to-t from-[#1F6F5F]/95 via-[#1F6F5F]/35 to-transparent'
                                        : 'bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-[#1F6F5F]/90'
                                }`}
                            />

                            {/* Top Badge: Nama Provinsi & Nomor */}
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

                            {/* Bottom Card Content: Nama Provinsi & Kota */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10 text-white">
                                <h3 className="font-heading font-serif text-xl sm:text-2xl font-bold leading-tight text-white group-hover:text-[#6FCF97] transition-colors">
                                    {station.title}
                                </h3>
                                <p className="text-[12px] text-white/80 mt-1 font-light">
                                    {station.location}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
