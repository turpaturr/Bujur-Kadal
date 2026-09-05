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
            {/* Card 1: 🔥 Kebakaran Aktif */}
            <div
                onClick={() => onCategoryClick?.('active_fire')}
                className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        Kebakaran Aktif
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                        🔥
                    </div>
                </div>

                <div className="mt-3">
                    {isLoading ? (
                        <div className="h-9 w-20 bg-[#EEEEEE] animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-bold text-rose-600 tracking-tight">
                                {activeFires.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-semibold text-rose-700">
                                Titik Nyata
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-[#262626]/70 mt-1.5 leading-snug">
                    Kobaran api terbuka terkonfirmasi (Confidence ≥80% atau FRP tinggi).
                </p>

                <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#262626]/70">
                    <span>Intensitas Puncak:</span>
                    <strong className="text-rose-600 font-bold">{maxFrp} MW</strong>
                </div>
            </div>

            {/* Card 2: 💨 Potensi Asap & Bara Gambut */}
            <div
                onClick={() => onCategoryClick?.('smoke_peat')}
                className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer group"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        Asap & Lahan Gambut
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                        💨
                    </div>
                </div>

                <div className="mt-3">
                    {isLoading ? (
                        <div className="h-9 w-20 bg-[#EEEEEE] animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-bold text-orange-600 tracking-tight">
                                {smokePeat.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-semibold text-orange-700">
                                Titik Bara
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-[#262626]/70 mt-1.5 leading-snug">
                    Bara bawah tanah gambut & semak memicu kepulan kabut asap tebal.
                </p>

                <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#262626]/70">
                    <span>Deteksi Malam (Smoldering):</span>
                    <strong className="text-orange-700 font-bold">
                        {stats?.byDayNight?.night ?? 0} titik
                    </strong>
                </div>
            </div>

            {/* Card 3: ☀️ Panas Berlebih (Anomali Termal) */}
            <div
                onClick={() => onCategoryClick?.('heat_anomaly')}
                className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer group"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        Panas Berlebih
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                        ☀️
                    </div>
                </div>

                <div className="mt-3">
                    {isLoading ? (
                        <div className="h-9 w-20 bg-[#EEEEEE] animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-bold text-amber-600 tracking-tight">
                                {heatAnomalies.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-semibold text-amber-800">
                                Titik Anomali
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-[#262626]/70 mt-1.5 leading-snug">
                    Suhu tanah tinggi / vegetasi kering. Belum tentu ada kobaran api terbuka.
                </p>

                <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#262626]/70">
                    <span>Status Risiko:</span>
                    <strong className="text-amber-800 font-semibold">Rawan Tersulut</strong>
                </div>
            </div>

            {/* Card 4: Total & Energi Radiasi Termal */}
            <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5 shadow-xs hover:border-[#2FA084]/40 transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F6F5F] uppercase tracking-wider">
                        Total Pantauan Satelit
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#2FA084]/10 text-[#2FA084] flex items-center justify-center text-sm">
                        🛰️
                    </div>
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
