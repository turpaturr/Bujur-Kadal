import React from 'react';
import { Maps } from '@/pages/Components/Dashboard';
import type { HotspotCategory, WildfireHotspot } from '@/hooks/useWildfireData';

interface AdminMapSectionProps {
    center: [number, number];
    zoom: number;
    selectedProvince: string | null;
    activeCategoryFilter: 'all' | HotspotCategory;
    onClearCategoryFilter: () => void;
    selectedHotspot: WildfireHotspot | null;
    onClearSelectedHotspot: () => void;
    visibleHotspots: WildfireHotspot[];
}

export default function AdminMapSection({
    center,
    zoom,
    selectedProvince,
    activeCategoryFilter,
    onClearCategoryFilter,
    selectedHotspot,
    onClearSelectedHotspot,
    visibleHotspots,
}: AdminMapSectionProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-[#EEEEEE] bg-white p-3 shadow-xs sm:p-4">
            <div className="mb-3 flex flex-col justify-between gap-2 px-1 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-display text-base font-bold text-[#1F6F5F] sm:text-lg">
                        Peta Sebaran Titik Spasial Pulau Borneo
                    </h2>
                    <p className="text-[11px] text-[#262626]/60">
                        {selectedProvince
                            ? `Fokus: ${selectedProvince}`
                            : 'Cakupan: Seluruh Pulau Kalimantan'}{' '}
                        · Klik tanda titik untuk melihat detail suhu dan jenis
                        kebakaran.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {activeCategoryFilter !== 'all' && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#2FA084]/15 px-2.5 py-1 text-xs font-bold text-[#1F6F5F]">
                            <span>Filter Aktif:</span>
                            <span>
                                {activeCategoryFilter === 'active_fire'
                                    ? '🔥 Kebakaran Aktif'
                                    : activeCategoryFilter === 'smoke_peat'
                                      ? '💨 Asap & Gambut'
                                      : '☀️ Panas Berlebih'}
                            </span>
                            <button
                                type="button"
                                onClick={onClearCategoryFilter}
                                className="ml-1 text-rose-600 hover:underline"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {selectedHotspot && (
                        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
                            <span>
                                Titik Terpilih:{' '}
                                <strong>
                                    {selectedHotspot.frp.toFixed(1)} MW
                                </strong>
                            </span>
                            <button
                                type="button"
                                onClick={onClearSelectedHotspot}
                                className="font-bold text-amber-900 hover:underline"
                            >
                                Batal
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Maps
                center={center}
                zoom={zoom}
                className="h-[500px] w-full sm:h-[560px]"
                wildfireHotspots={visibleHotspots}
                selectedHotspot={selectedHotspot}
            />
        </section>
    );
}

