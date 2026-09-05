import type { WildfireStats } from '@/hooks/useWildfireData';

interface StatCardsProps {
    stats?: WildfireStats;
    isLoading?: boolean;
    onCategoryClick?: (category: 'active_fire' | 'smoke_peat' | 'heat_anomaly') => void;
}

export default function StatCards({
    stats,
    isLoading = false,
    onCategoryClick,
}: StatCardsProps) {
    const total = stats?.total ?? 0;
    const activeFires = stats?.byCategory?.active_fire ?? 0;
    const smokePeat = stats?.byCategory?.smoke_peat ?? 0;
    const heatAnomalies = stats?.byCategory?.heat_anomaly ?? 0;
    const totalFrp = stats?.totalFrp ?? 0;
    const maxFrp = stats?.maxFrp ?? 0;
    const mostAffected = stats?.mostAffectedProvince ?? 'Kalimantan Barat';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1:  Potensi Kebakaran Tinggi */}
            <div
                onClick={() => onCategoryClick?.('active_fire')}
                className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#B91C1C] animate-pulse"></span>
                        Tinggi (&ge; 70&deg;C)
                    </span>
                    
                </div>

                <div className="mt-3">
                    {isLoading ? (
                        <div className="h-9 w-20 bg-[#EEEEEE] animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-bold text-[#B91C1C] tracking-tight">
                                {activeFires.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-semibold text-rose-700">
                                Titik Anomali
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-[#262626]/70 mt-1.5 leading-snug">
                    Suhu permukaan &ge; 70&deg;C atau FRP &ge; 12 MW. Api berkobar &amp; potensi kebakaran tajuk.
                </p>

                <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#262626]/70">
                    <span>Radiasi Puncak:</span>
                    <strong className="text-[#B91C1C] font-bold">{maxFrp} MW</strong>
                </div>
            </div>

            {/* Card 2:  Potensi Kebakaran Sedang */}
            <div
                onClick={() => onCategoryClick?.('smoke_peat')}
                className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-yellow-300 hover:shadow-sm transition-all cursor-pointer group"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#E5A910]"></span>
                        Sedang (60&ndash;69&deg;C)
                    </span>
                    
                </div>

                <div className="mt-3">
                    {isLoading ? (
                        <div className="h-9 w-20 bg-[#EEEEEE] animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-bold text-[#CA8A04] tracking-tight">
                                {smokePeat.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-semibold text-yellow-800">
                                Titik Anomali
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-[#262626]/70 mt-1.5 leading-snug">
                    Suhu 60&deg;C &ndash; 69.9&deg;C atau bara tanah gambut yang berpotensi memicu kabut asap.
                </p>

                <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#262626]/70">
                    <span>Deteksi Malam:</span>
                    <strong className="text-[#CA8A04] font-bold">
                        {stats?.byDayNight?.night ?? 0} titik
                    </strong>
                </div>
            </div>

            {/* Card 3:  Potensi Kebakaran Rendah */}
            <div
                onClick={() => onCategoryClick?.('heat_anomaly')}
                className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#15803D]"></span>
                        Rendah (&lt; 60&deg;C)
                    </span>
                    
                </div>

                <div className="mt-3">
                    {isLoading ? (
                        <div className="h-9 w-20 bg-[#EEEEEE] animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-bold text-[#15803D] tracking-tight">
                                {heatAnomalies.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-semibold text-emerald-800">
                                Titik Normal
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-[#262626]/70 mt-1.5 leading-snug">
                    Suhu &lt; 60&deg;C dan radiasi termal rendah. Anomali termal ringan &amp; situasi aman.
                </p>

                <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#262626]/70">
                    <span>Kondisi Udara:</span>
                    <strong className="text-[#15803D] font-bold">Aman / Terkendali</strong>
                </div>
            </div>

            {/* Card 4: Total & Energi Radiasi Termal */}
            <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-[#2FA084]/40 transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F6F5F] uppercase tracking-wider">
                        Total Pantauan Satelit
                    </span>
                    
                </div>

                <div className="mt-3">
                    {isLoading ? (
                        <div className="h-9 w-28 bg-[#EEEEEE] animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-bold text-[#262626] tracking-tight">
                                {total.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-semibold text-[#1F6F5F]">
                                Total Terdeteksi
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-[#262626]/70 mt-1.5 leading-snug">
                    Total energi radiasi api: <strong className="text-[#262626]">{totalFrp.toLocaleString('id-ID')} MW</strong>
                </p>

                <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#262626]/70">
                    <span>Episentrum Terbanyak:</span>
                    <strong className="text-[#1F6F5F] font-bold truncate max-w-[120px]">
                        {mostAffected.replace('Kalimantan ', 'Kal. ')}
                    </strong>
                </div>
            </div>
        </div>
    );
}
