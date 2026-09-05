interface StatCardsProps {
    hotspotsCount?: number;
    isLoadingHotspots?: boolean;
    aqiScore?: number;
    satelliteStatus?: string;
}

export default function StatCards({
    hotspotsCount,
    isLoadingHotspots = false,
    aqiScore = 34,
    satelliteStatus = 'Aktif (NASA GIBS & FIRMS)',
}: StatCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Hotspots */}
            <div className="bg-white rounded-2xl border border-[#CCECEE] p-4 sm:p-5 shadow-xs flex items-center justify-between">
                <div>
                    <span className="text-xs font-semibold text-[#095D7E] uppercase tracking-wider">
                        Titik Panas (Hotspots)
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-[#262626] mt-1">
                        {isLoadingHotspots ? (
                            <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-[#CCECEE]/60" />
                        ) : (
                            <>
                                {hotspotsCount ?? '—'}{' '}
                                <span className="text-xs font-medium text-amber-600">
                                    Titik Pantau
                                </span>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-[#262626]/70 mt-0.5">
                        Sensor termal VIIRS / MODIS · NASA FIRMS
                    </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#CCECEE] flex items-center justify-center text-[#095D7E] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                </div>
            </div>

            {/* Card 2: AQI */}
            <div className="bg-white rounded-2xl border border-[#CCECEE] p-4 sm:p-5 shadow-xs flex items-center justify-between">
                <div>
                    <span className="text-xs font-semibold text-[#095D7E] uppercase tracking-wider">
                        Kualitas Udara (AQI)
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-[#14967F] mt-1">
                        {aqiScore}{' '}
                        <span className="text-xs font-medium text-emerald-600">
                            Sehat (Baik)
                        </span>
                    </div>
                    <p className="text-xs text-[#262626]/70 mt-0.5">
                        Rata-rata 5 provinsi Kalimantan
                    </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#CCECEE] flex items-center justify-center text-[#14967F] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                </div>
            </div>

            {/* Card 3: Status Satelit */}
            <div className="bg-white rounded-2xl border border-[#CCECEE] p-4 sm:p-5 shadow-xs flex items-center justify-between">
                <div>
                    <span className="text-xs font-semibold text-[#095D7E] uppercase tracking-wider">
                        Integrasi Satelit
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-[#095D7E] mt-1">
                        Aktif{' '}
                        <span className="text-xs font-medium text-[#14967F]">
                            Online
                        </span>
                    </div>
                    <p className="text-xs text-[#262626]/70 mt-0.5">
                        {satelliteStatus}
                    </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#CCECEE] flex items-center justify-center text-[#095D7E] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
