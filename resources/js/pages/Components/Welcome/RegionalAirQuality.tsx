import { Info } from '@/pages/Components/Welcome/Icons';
import { cn } from '@/lib/utils';
import { getCategory } from './HeroSection';

export interface CityAqiItem {
    city: string;
    display_name: string;
    station_name: string;
    aqi: number;
}

export const CITIES_STATIC: CityAqiItem[] = [
    { city: "balikpapan", display_name: "Balikpapan", station_name: "Stasiun Klandasan", aqi: 78 },
    { city: "pontianak", display_name: "Pontianak", station_name: "Stasiun Kantor Gubernur", aqi: 195 },
    { city: "palangkaraya", display_name: "Palangka Raya", station_name: "Stasiun Universitas Palangka", aqi: 240 },
    { city: "banjarmasin", display_name: "Banjarmasin", station_name: "Stasiun Lambung Mangkurat", aqi: 162 },
    { city: "samarinda", display_name: "Samarinda", station_name: "Stasiun GOR Segiri", aqi: 95 },
];

export default function RegionalAirQuality() {
    return (
        <section className="mt-20">
            <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#14967F]">
                    <Info className="h-3.5 w-3.5" /> Pantauan Regional
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#095D7E] sm:text-3xl">
                    Kualitas Udara di Kota Kalimantan
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Indeks Standar Pencemar Udara (ISPU) stasiun pemantau resmi di Kalimantan.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {CITIES_STATIC.map((c) => {
                    const cat = getCategory(c.aqi);
                    return (
                        <div
                            key={c.city}
                            className="flex items-center justify-between rounded-xl border border-[#CCECEE] bg-white dark:bg-card/50 px-4 py-3 shadow-xs hover:border-[#14967F]/40 transition-colors"
                        >
                            <div>
                                <p className="text-sm font-semibold text-foreground">{c.display_name}</p>
                                <p className="text-[11px] text-muted-foreground">{c.station_name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="font-display text-2xl font-bold tabular-nums text-foreground">{c.aqi}</p>
                                    <p className={cn("text-[10px] font-semibold uppercase tracking-wider", cat.text)}>{cat.label}</p>
                                </div>
                                <span className={cn("h-9 w-1.5 rounded-full", cat.chip)} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
