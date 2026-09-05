import type { UserSafetyAnalysis } from '@/utils/geoSafety';

interface UserSafetyBannerProps {
    safety: UserSafetyAnalysis;
    isFocusedOnHome: boolean;
    onFocusHome: () => void;
    onFocusNearestHotspot?: () => void;
    onResetToBorneo: () => void;
}

export default function UserSafetyBanner({
    safety,
    isFocusedOnHome,
    onFocusHome,
    onFocusNearestHotspot,
    onResetToBorneo,
}: UserSafetyBannerProps) {
    if (!safety.hasLocation || !safety.userLocation) {
        return null;
    }

    const { status, statusLabel, nearestHotspot, hotspotsWithin25Km, hotspotsWithin10Km } = safety;

    return (
        <div
            className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                status === 'danger'
                    ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                    : status === 'warning'
                      ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                      : 'bg-[#2FA084]/10 border-[#2FA084]/25 text-[#1F6F5F]'
            }`}
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Bagian Kiri: Info Kediaman & Status Lingkungan */}
                <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/80 shadow-2xs border border-[#EEEEEE]">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    status === 'danger'
                                        ? 'bg-rose-500 animate-ping'
                                        : status === 'warning'
                                          ? 'bg-amber-500 animate-pulse'
                                          : 'bg-[#2FA084]'
                                }`}
                            />
                            {statusLabel}
                        </span>

                        <span className="text-xs font-semibold text-[#262626]/70">
                            • Radius Deteksi 25 km
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="font-heading font-serif text-base sm:text-lg font-bold text-[#1F6F5F]">
                            📍 {safety.userLocation.name ?? 'Kediaman Anda'}
                        </h3>
                        {safety.userLocation.address && (
                            <span className="text-xs text-[#262626]/80 truncate max-w-md" title={safety.userLocation.address}>
                                ({safety.userLocation.address})
                            </span>
                        )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#262626]/85 leading-relaxed max-w-3xl">
                        {safety.summaryText}{' '}
                        <span className="italic font-medium text-[#1F6F5F]/90">
                            {safety.recommendation}
                        </span>
                    </p>
                </div>

                {/* Bagian Kanan: Metrik Cepat & Tombol Aksi */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0">
                    {/* Metrik Titik Api Sekitar */}
                    <div className="flex items-center gap-2 bg-white/90 p-2 sm:p-2.5 rounded-xl border border-[#EEEEEE] shadow-2xs text-xs">
                        <div className="text-center px-2">
                            <span className="text-[10px] text-[#262626]/60 font-semibold uppercase block">
                                Dlm 25 km
                            </span>
                            <span
                                className={`text-base font-bold tabular-nums ${
                                    hotspotsWithin10Km > 0
                                        ? 'text-rose-600'
                                        : hotspotsWithin25Km > 0
                                          ? 'text-amber-600'
                                          : 'text-[#2FA084]'
                                }`}
                            >
                                {hotspotsWithin25Km}
                            </span>
                        </div>
                        <div className="w-[1px] h-7 bg-[#EEEEEE]" />
                        <div className="text-center px-2">
                            <span className="text-[10px] text-[#262626]/60 font-semibold uppercase block">
                                Terdekat
                            </span>
                            <span className="text-xs font-bold text-[#1F6F5F] tabular-nums">
                                {nearestHotspot ? `${nearestHotspot.distanceKm} km` : 'Aman'}
                            </span>
                        </div>
                    </div>

                    {/* Tombol Aksi: Fokus ke Rumah */}
                    <button
                        type="button"
                        onClick={onFocusHome}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                            isFocusedOnHome
                                ? 'bg-[#1F6F5F] text-white ring-2 ring-[#2FA084]/40'
                                : 'bg-[#2FA084] text-white hover:bg-[#1F6F5F]'
                        }`}
                        title="Arahkan peta langsung ke lokasi tempat tinggal Anda"
                    >
                        <span>🏠 Fokus Rumah</span>
                    </button>

                    {/* Tombol Titik Terdekat (bila ada) */}
                    {nearestHotspot && onFocusNearestHotspot && (
                        <button
                            type="button"
                            onClick={onFocusNearestHotspot}
                            className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/90 text-[#1F6F5F] hover:bg-white border border-[#EEEEEE] transition-all shadow-xs cursor-pointer"
                            title="Arahkan peta ke titik api terdekat dari rumah"
                        >
                            <span>🔥 Titik Terdekat</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
