import { useEffect, useRef } from 'react';
import { Instagram, Wind } from '@/pages/Components/Welcome/Icons';

const TECH_PARTNERS = [
    {
        name: 'PHP',
        logo: 'https://www.php.net/images/logos/new-php-logo.svg',
        url: 'https://www.php.net',
    },
    {
        name: 'Laravel',
        logo: 'https://laravel.com/img/logomark.min.svg',
        url: 'https://laravel.com',
    },
    {
        name: 'Inertia.js',
        logo: 'https://avatars.githubusercontent.com/u/47703742?s=200&v=4',
        url: 'https://inertiajs.com',
    },
    {
        name: 'NASA FIRMS',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
        url: 'https://firms.modaps.eosdis.nasa.gov',
    },
    {
        name: 'Overpass API',
        logo: 'https://wiki.openstreetmap.org/w/images/thumb/b/b0/Openstreetmap-logo.svg/200px-Openstreetmap-logo.svg.png',
        url: 'https://overpass-api.de',
    },
    {
        name: 'Leaflet',
        logo: 'https://leafletjs.com/docs/images/logo.png',
        url: 'https://leafletjs.com',
    },
    {
        name: 'React',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/200px-React-icon.svg.png',
        url: 'https://react.dev',
    },
    {
        name: 'Tailwind CSS',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/200px-Tailwind_CSS_Logo.svg.png',
        url: 'https://tailwindcss.com',
    },
    {
        name: 'TypeScript',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Typescript.svg/200px-Typescript.svg.png',
        url: 'https://www.typescriptlang.org',
    },
    {
        name: 'Vite',
        logo: 'https://vite.dev/logo.svg',
        url: 'https://vite.dev',
    },
    {
        name: 'Recharts',
        logo: 'https://recharts.org/favicon.png',
        url: 'https://recharts.org',
    },
    {
        name: 'SQLite',
        logo: 'https://www.sqlite.org/images/sqlite370.svg',
        url: 'https://www.sqlite.org',
    },
    {
        name: 'Wayfinder',
        logo: 'https://laravel.com/img/logomark.min.svg',
        url: 'https://github.com/laravel/wayfinder',
    },
];

const HONORABLE_MENTIONS = [
    {
        name: 'studywithfarhan',
        url: 'https://www.instagram.com/studywithFarhan/?hl=es',
    },
];

// Duplicate for seamless infinite scroll
const CAROUSEL_ITEMS = [
    ...TECH_PARTNERS.map((partner) => ({ ...partner, type: 'tech' as const })),
    ...HONORABLE_MENTIONS.map((mention) => ({ ...mention, type: 'mention' as const })),
];
const CAROUSEL_LOOP = [...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS];

const TECH_MARKS: Record<string, string> = {
    PHP: 'php',
    Laravel: 'L',
    'Inertia.js': 'I',
    'NASA FIRMS': 'N',
    'Overpass API': 'O',
    Leaflet: 'Lf',
    React: 'R',
    'Tailwind CSS': 'Tw',
    TypeScript: 'TS',
    Vite: 'V',
    Recharts: 'Rc',
    SQLite: 'Sq',
    Wayfinder: 'W',
};

export function Footer() {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let animFrame: number;
        let pos = 0;
        const speed = 0.45; // px per frame
        const halfWidth = track.scrollWidth / 2;

        const animate = () => {
            pos += speed;
            if (pos >= halfWidth) pos = 0;
            track.style.transform = `translateX(-${pos}px)`;
            animFrame = requestAnimationFrame(animate);
        };

        animFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrame);
    }, []);

    return (
        <footer className="bg-[#1A5C4F] text-white">
            {/* Tech Partner Carousel */}
            <div className="border-b border-white/10 py-5 overflow-hidden">
                <div className="relative overflow-hidden">
                    <div ref={trackRef} className="flex gap-10 items-center w-max will-change-transform">
                        {CAROUSEL_LOOP.map((partner, i) => (
                            <a
                                key={i}
                                href={partner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 opacity-50 hover:opacity-90 transition-opacity shrink-0 group"
                                title={partner.name}
                            >
                                {partner.type === 'mention' ? (
                                    <Instagram className="h-5 w-5 text-white" strokeWidth={1.8} />
                                ) : (
                                    <span className="flex h-6 min-w-7 items-center justify-center">
                                        <img
                                            src={partner.logo}
                                            alt={partner.name}
                                            className="h-6 w-auto object-contain brightness-0 invert"
                                            loading="lazy"
                                            onError={(event) => {
                                                event.currentTarget.hidden = true;
                                                event.currentTarget.nextElementSibling?.removeAttribute('hidden');
                                            }}
                                        />
                                        <span
                                            hidden
                                            className="rounded-md border border-white/30 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white"
                                        >
                                            {TECH_MARKS[partner.name]}
                                        </span>
                                    </span>
                                )}
                                <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                                    {partner.type === 'mention' ? `${partner.name}` : partner.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="font-heading font-serif text-lg font-bold tracking-tight text-white">
                                Borneo<span className="text-[#6FCF97]">Care</span>
                            </span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                            Platform mitigasi kebakaran hutan & lahan (Karhutla) dan pemantauan kualitas udara (ISPU) untuk Pulau Kalimantan.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest font-semibold text-white/40 mb-4">Navigasi</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Beranda', href: '#beranda' },
                                { label: 'Esensi', href: '#quote-section' },
                                { label: 'Provinsi', href: '#gallery-section' },
                                { label: 'Analisis', href: '#analisis' },
                                { label: 'Edukasi', href: '#edukasi' },
                                { label: 'Solusi', href: '#solusi' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className="text-sm text-white/65 hover:text-[#6FCF97] transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest font-semibold text-white/40 mb-4">Info</h4>
                        <ul className="space-y-2.5 text-sm text-white/65">
                            <li>Data Hotspot: <span className="text-white/80">NASA VIIRS SNPP & NOAA-20</span></li>
                            <li>Cakupan: <span className="text-white/80">Seluruh Pulau Kalimantan</span></li>
                            <li>Update: <span className="text-white/80">Real-time (setiap hari)</span></li>
                            <li className="pt-2">
                                <a href="/register" className="inline-flex items-center gap-1.5 text-[#6FCF97] hover:underline font-medium">
                                    Daftar Warga →
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-white/40">
                        © 2026 BorneoCare · Platform Mitigasi Karhutla & ISPU Kalimantan.
                    </p>
                    <p className="text-xs text-white/30">
                        Dibangun untuk DevFest Hackathon 2026
                    </p>
                </div>
            </div>
        </footer>
    );
}
