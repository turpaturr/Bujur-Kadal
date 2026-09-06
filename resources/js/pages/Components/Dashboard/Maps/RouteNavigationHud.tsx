import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ClinicData } from './markers';
import type { RouteResult } from '@/services/routingService';

export interface RouteNavigationHudProps {
    clinic: ClinicData;
    routeData: RouteResult | null;
    isLoading: boolean;
    onCloseRoute: () => void;
    origin?: { lat: number; lng: number } | null;
}

export function RouteNavigationHud({
    clinic,
    routeData,
    isLoading,
    onCloseRoute,
    origin,
}: RouteNavigationHudProps) {
    const [transportMode, setTransportMode] = useState<'car' | 'motorcycle' | 'walk'>('car');

    const originParam = origin ? `&origin=${origin.lat},${origin.lng}` : '';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${clinic.lat},${clinic.lng}`;

    const activeDuration =
        transportMode === 'car'
            ? routeData?.estimates.carMinutes
            : transportMode === 'motorcycle'
              ? routeData?.estimates.motorcycleMinutes
              : routeData?.estimates.walkMinutes;

    return (
        <div className="absolute bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-[1050] max-w-md w-full sm:w-[380px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-emerald-200/80 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
            {/* Header Status & Tombol Tutup */}
            <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                        Panduan Rute Faskes
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onCloseRoute}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-gray-600 hover:text-rose-700 bg-gray-100 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Tutup mode navigasi dan kembalikan seluruh faskes di peta"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Tutup Rute</span>
                </button>
            </div>

            {/* Info Faskes Tujuan */}
            <div className="mb-3">
                <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#047857">
                            <path d="M8.5 2h7v6.5H22v7h-6.5V22h-7v-6.5H2v-7h6.5V2z" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-display text-sm font-bold text-[#1F6F5F] truncate leading-tight">
                            {clinic.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {clinic.addr || 'Fasilitas Kesehatan Siaga ISPA & Posko Oksigen'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Selector Moda Transportasi & Estimasi Waktu */}
            {isLoading ? (
                <div className="py-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 rounded-xl">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Mengkalkulasi rute jalan tercepat...</span>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {/* Tab Pilihan Moda */}
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/90 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setTransportMode('car')}
                            className={cn(
                                'flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer',
                                transportMode === 'car'
                                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                                    : 'text-gray-600 hover:text-gray-900',
                            )}
                        >
                            <span className="text-base">🚗</span>
                            <span className="text-[10.5px] mt-0.5">
                                {routeData?.estimates.carMinutes ?? '-'} mnt
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTransportMode('motorcycle')}
                            className={cn(
                                'flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer',
                                transportMode === 'motorcycle'
                                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                                    : 'text-gray-600 hover:text-gray-900',
                            )}
                        >
                            <span className="text-base">🏍️</span>
                            <span className="text-[10.5px] mt-0.5">
                                {routeData?.estimates.motorcycleMinutes ?? '-'} mnt
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTransportMode('walk')}
                            className={cn(
                                'flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer',
                                transportMode === 'walk'
                                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                                    : 'text-gray-600 hover:text-gray-900',
                            )}
                        >
                            <span className="text-base">🚶</span>
                            <span className="text-[10.5px] mt-0.5">
                                {routeData?.estimates.walkMinutes ?? '-'} mnt
                            </span>
                        </button>
                    </div>

                    {/* Ringkasan Jarak & Waktu Tempuh Terpilih */}
                    <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/80 border border-emerald-200/60 rounded-xl">
                        <div>
                            <div className="text-[10px] uppercase font-bold text-emerald-800/80">
                                {transportMode === 'car'
                                    ? 'Perjalanan Mobil'
                                    : transportMode === 'motorcycle'
                                      ? 'Perjalanan Motor'
                                      : 'Jalan Kaki'}
                            </div>
                            <div className="text-sm font-extrabold text-emerald-950 flex items-baseline gap-1.5">
                                <span>~{activeDuration ?? 0} Menit</span>
                                <span className="text-xs font-normal text-emerald-700">
                                    ({routeData?.distanceText ?? '0 km'})
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[9.5px] font-semibold text-emerald-700 block">
                                Rute Jalan Raya
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-900">
                                Jalur Tercepat
                            </span>
                        </div>
                    </div>

                    {/* Tombol Aksi Buka di Google Maps Eksternal */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#1F6F5F] bg-[#1F6F5F]/10 hover:bg-[#1F6F5F]/20 py-2 rounded-xl transition-all"
                        >
                            <span>Buka di Google Maps App</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RouteNavigationHud;
