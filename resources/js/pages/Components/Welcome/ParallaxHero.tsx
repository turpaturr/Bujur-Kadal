import { Link, usePage } from '@inertiajs/react';
import { useScrollPosition } from '@/hooks/useParallax';
import { MapPinned, ArrowRight, Activity } from '@/pages/Components/Welcome/Icons';
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
    { min: 0,   max: 50,  label: "Baik",               chip: "bg-[#2FA084]",  text: "text-[#2FA084]", ring: "ring-[#2FA084]/40" },
    { min: 51,  max: 100, label: "Sedang",             chip: "bg-emerald-600", text: "text-emerald-500", ring: "ring-emerald-500/40" },
    { min: 101, max: 200, label: "Tidak Sehat",        chip: "bg-amber-500",   text: "text-amber-400", ring: "ring-amber-500/40" },
    { min: 201, max: 300, label: "Sangat Tidak Sehat", chip: "bg-orange-600",  text: "text-orange-400", ring: "ring-orange-600/40" },
    { min: 301, max: 999, label: "Berbahaya",          chip: "bg-rose-700",    text: "text-rose-400", ring: "ring-rose-700/40" },
];

export const getCategory = (aqi: number) =>
    ISPU_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max) ?? ISPU_CATEGORIES[4];

interface ParallaxHeroProps {
    aqi?: number;
    onExploreClick?: () => void;
}

export default function ParallaxHero({ aqi = 187, onExploreClick }: ParallaxHeroProps) {
    const scrollY = useScrollPosition();
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;
    const activeCategory = getCategory(aqi);

    const handleScrollDown = () => {
        if (onExploreClick) {
            onExploreClick();
            return;
        }
        const nextSection = document.getElementById('quote-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="beranda"
            className="relative min-h-[105vh] w-full flex flex-col justify-between items-center overflow-hidden select-none bg-[#112420]"
        >
            {/* 1. Background Image with Parallax & Dark Pine Atmospheric Gradients - Pulau Kalimantan */}
            <div
                className="absolute inset-0 w-full h-[125%] -top-[12%] bg-cover bg-center pointer-events-none will-change-transform"
                style={{
                    backgroundImage: `url('https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Dipterocarp_Forest_at_Danum_Valley_%2813997709808%29.jpg/330px-Dipterocarp_Forest_at_Danum_Valley_%2813997709808%29.jpg?utm_source=id.wikipedia.org&utm_campaign=parser&utm_content=thumbnail')`,
                    transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(${1 + scrollY * 0.00025})`,
                }}
            />

            {/* Cinematic Gradient Overlays to match #1F6F5F and #112420 theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#1F6F5F]/40 to-[#1F6F5F] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,35,30,0.65)_100%)] pointer-events-none" />

            {/* Subtle top spacer for fixed/sticky navbar */}
            <div className="h-20 w-full" />

            {/* 2. Hero Center Editorial Content */}
            <div
                className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center my-auto transition-opacity duration-300 will-change-transform"
                style={{
                    transform: `translate3d(0, ${scrollY * 0.14}px, 0)`,
                    opacity: Math.max(0, 1 - scrollY / 650),
                }}
            >

                {/* Grand Heading with Fraunces Serif Font */}
                <h1 className="mt-7 font-heading font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal leading-[1.12] tracking-tight drop-shadow-md">
                    <span className="block">Satu Aksi Preventif,</span>
                    <span className="block mt-2 italic font-light text-[#6FCF97]">Selamatkan Jutaan Nyawa</span>
                    <span className="block text-2xl sm:text-4xl md:text-5xl text-[#EEEEEE]/95 mt-2 tracking-normal">
                        dan <span className="underline decoration-[#6FCF97]/70 underline-offset-8">Ekosistem.</span>
                    </span>
                </h1>

                {/* Subtitle / Context */}
                <p className="mt-6 max-w-2xl text-sm sm:text-base text-white/85 font-light leading-relaxed">
                    Kendalikan napas keluarga Anda. Platform preventif berbasis data spasial satelit NASA untuk melindungi warga Pulau Kalimantan dari ancaman kabut asap Karhutla.
                </p>

                {/* CTAs & Floating Real-time Telemetry Pill */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href={auth?.user ? "/dashboard" : "/login"}
                        className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider bg-[#2FA084] hover:bg-[#1F6F5F] text-white shadow-xl hover:shadow-[#2FA084]/30 transition-all duration-300 border border-[#6FCF97]/40"
                    >
                        {auth?.user ? "Buka Peta Spasial" : "Akses Dashboard Spasial"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>

                    <a
                        href="#gallery-section"
                        className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider border border-white/40 text-white hover:bg-white/15 backdrop-blur-sm transition-all duration-300"
                    >
                        Jelajah Stasiun Rimba
                    </a>
                </div>
            </div>

            {/* 3. Circular Rotating Compass / Adventure Badge */}
            <div
                className="relative z-20 pb-12 pt-4 transition-opacity duration-300 will-change-transform cursor-pointer group"
                onClick={handleScrollDown}
                style={{
                    transform: `translate3d(0, ${scrollY * 0.08}px, 0)`,
                    opacity: Math.max(0, 1 - scrollY / 500),
                }}
            >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                    {/* Rotating SVG Circular Text */}
                    <svg
                        className="absolute inset-0 w-full h-full animate-spin-slow group-hover:scale-105 transition-transform duration-500"
                        viewBox="0 0 140 140"
                    >
                        <path
                            id="circlePath"
                            d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                            fill="none"
                        />
                        <text className="text-[10.5px] uppercase tracking-[0.26em] fill-white/85 font-medium">
                            <textPath href="#circlePath" startOffset="0%">
                                amazing adventures • borneo wilds • clean air •
                            </textPath>
                        </text>
                    </svg>

                    {/* Center Circle & Arrow Indicator */}
                    <div className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#2FA084] group-hover:border-[#6FCF97] group-hover:scale-110 transition-all duration-300 shadow-xl">
                        <svg
                            className="w-5 h-5 animate-bounce mt-0.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}

