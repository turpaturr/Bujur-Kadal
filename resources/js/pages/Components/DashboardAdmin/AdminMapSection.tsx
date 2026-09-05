import React from 'react';
import { Maps } from '@/pages/Components/Dashboard';
import type { RegisteredUserLocation } from '@/pages/Components/Dashboard/Maps';
import type { HotspotCategory, WildfireHotspot } from '@/hooks/useWildfireData';
import { Users, ShieldAlert } from '@/pages/Components/Dashboard/Icons';

interface AdminMapSectionProps {
    center: [number, number];
    zoom: number;
    selectedProvince: string | null;
    activeCategoryFilter: 'all' | HotspotCategory;
    onClearCategoryFilter: () => void;
    selectedHotspot: WildfireHotspot | null;
    onClearSelectedHotspot: () => void;
    visibleHotspots: WildfireHotspot[];
    registeredUsers?: RegisteredUserLocation[];
    selectedUserLocation?: RegisteredUserLocation | null;
    onSelectUserLocation?: (user: RegisteredUserLocation | null) => void;
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
    registeredUsers = [],
    selectedUserLocation = null,
    onSelectUserLocation,
}: AdminMapSectionProps) {
    const vulnerableCount = registeredUsers.filter((u) => u.is_vulnerable).length;

    return (
        <section className="overflow-hidden rounded-2xl border border-[#EEEEEE] bg-white p-3 shadow-xs sm:p-4">
            <div className="mb-3 flex flex-col justify-between gap-3 px-1 lg:flex-row lg:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-display text-base font-bold text-[#1F6F5F] sm:text-lg">
                            Peta Sebaran Titik Spasial &amp; Tempat Tinggal Warga
                        </h2>
                        {registeredUsers.length > 0 && (
                            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#1F6F5F]/10 px-2 py-0.5 text-[10px] font-bold text-[#1F6F5F]">
                                <Users className="h-3 w-3" />
                                {registeredUsers.length} KK Terdata
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-[#262626]/60">
                        {selectedProvince
                            ? `Fokus: ${selectedProvince}`
                            : 'Cakupan: Seluruh Pulau Kalimantan'}{' '}
                        · Klik tanda titik api atau pin warga untuk melihat detail kerentanan dan mitigasi asap.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Filter Kategori Titik Api Aktif (Tanpa Emoji) */}
                    {activeCategoryFilter !== 'all' && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#2FA084]/15 px-2.5 py-1 text-xs font-bold text-[#1F6F5F]">
                            <span>Filter:</span>
                            <span>
                                {activeCategoryFilter === 'active_fire'
                                    ? 'Kebakaran Aktif'
                                    : activeCategoryFilter === 'smoke_peat'
                                      ? 'Asap & Gambut'
                                      : 'Panas Berlebih'}
                            </span>
                            <button
                                type="button"
                                onClick={onClearCategoryFilter}
                                className="ml-1 text-rose-600 hover:underline cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Titik Terpilih */}
                    {selectedHotspot && (
                        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
                            <span>
                                Titik Api Terpilih:{' '}
                                <strong>
                                    {selectedHotspot.frp.toFixed(1)} MW
                                </strong>
                            </span>
                            <button
                                type="button"
                                onClick={onClearSelectedHotspot}
                                className="font-bold text-amber-900 hover:underline cursor-pointer"
                            >
                                Batal
                            </button>
                        </div>
                    )}

                    {/* Quick Selector Fokus Rumah Warga Terdaftar */}
                    {registeredUsers.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <select
                                value={selectedUserLocation?.id ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) {
                                        onSelectUserLocation?.(null);
                                    } else {
                                        const found = registeredUsers.find(
                                            (u) => u.id === Number(val),
                                        );
                                        if (found) {
                                            onSelectUserLocation?.(found);
                                        }
                                    }
                                }}
                                className="rounded-xl border border-[#EEEEEE] bg-[#FAFAFA] px-2.5 py-1.5 text-xs text-[#262626] font-medium outline-hidden hover:border-[#1F6F5F] cursor-pointer focus:border-[#1F6F5F]"
                            >
                                <option value="">Fokus ke Tempat Tinggal Warga...</option>
                                {registeredUsers.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.is_vulnerable ? '[Rentan] ' : ''}{u.name} ({u.total_members} Jiwa)
                                    </option>
                                ))}
                            </select>

                            {selectedUserLocation && (
                                <button
                                    type="button"
                                    onClick={() => onSelectUserLocation?.(null)}
                                    className="rounded-lg bg-neutral-100 px-2 py-1 text-[11px] text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                                    title="Batalkan fokus warga"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Status Sub-Bar Kerentanan Warga */}
            {registeredUsers.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#FAFAFA] border border-[#EEEEEE] px-3 py-2 text-xs">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[#1F6F5F] font-bold">
                            <Users className="h-3.5 w-3.5" />
                            <span>Total Warga Terdata: {registeredUsers.length} Tempat Tinggal</span>
                        </span>
                        <span className="text-neutral-300">|</span>
                        <span className="flex items-center gap-1.5 text-purple-800 font-bold">
                            <ShieldAlert className="h-3.5 w-3.5 text-purple-600" />
                            <span>{vulnerableCount} Keluarga Prioritas Rentan (Balita / Lansia / Komorbid)</span>
                        </span>
                    </div>

                    <div className="text-[11px] text-[#262626]/60">
                        *Klik marker ungu di peta untuk nomor darurat WhatsApp &amp; profil kerentanan
                    </div>
                </div>
            )}

            <Maps
                center={center}
                zoom={zoom}
                className="h-[500px] w-full sm:h-[560px]"
                wildfireHotspots={visibleHotspots}
                selectedHotspot={selectedHotspot}
                registeredUsers={registeredUsers}
                selectedUserLocation={selectedUserLocation}
                onSelectUserLocation={onSelectUserLocation}
            />
        </section>
    );
}

