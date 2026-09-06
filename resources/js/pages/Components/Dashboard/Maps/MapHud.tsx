import React from 'react';
import { cn } from '@/lib/utils';
import type { UserLocation, UserSafetyAnalysis } from '@/utils/geoSafety';
import { Home, Users } from '../Icons';

export interface MapHudProps {
    activeBasemap: 'osm' | 'nasa';
    onBasemapChange: (basemap: 'osm' | 'nasa') => void;
    userLocation?: UserLocation | null;
    userSafety?: UserSafetyAnalysis | null;
    onFocusHome?: () => void;
    registeredUsersCount?: number;
    shouldShowRegisteredUsers?: boolean;
    onToggleRegisteredUsers?: () => void;
    hotspotsCount?: number;
}

export function MapHud({
    activeBasemap,
    onBasemapChange,
    userLocation,
    userSafety,
    onFocusHome,
    registeredUsersCount = 0,
    shouldShowRegisteredUsers = true,
    onToggleRegisteredUsers,
    hotspotsCount = 0,
}: MapHudProps) {
    return (
        <>
            {/* Bar Kontrol Kiri Atas Peta */}
            <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto">
                {/* Switcher Tipe Basemap */}
                <div className="flex rounded-xl bg-white/95 p-1 shadow-md backdrop-blur-sm border border-[#EEEEEE]">
                    <button
                        type="button"
                        onClick={() => onBasemapChange('osm')}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                            activeBasemap === 'osm'
                                ? 'bg-[#1F6F5F] text-white shadow-xs'
                                : 'text-[#262626]/70 hover:text-[#1F6F5F]',
                        )}
                    >
                        Peta Standar
                    </button>
                    <button
                        type="button"
                        onClick={() => onBasemapChange('nasa')}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                            activeBasemap === 'nasa'
                                ? 'bg-[#1F6F5F] text-white shadow-xs'
                                : 'text-[#262626]/70 hover:text-[#1F6F5F]',
                        )}
                    >
                        Citra Satelit
                    </button>
                </div>

                {/* Shortcut Fokus ke Rumah Pribadi Pengguna */}
                {userLocation && onFocusHome && (
                    <button
                        type="button"
                        onClick={onFocusHome}
                        className="px-3 py-1.5 rounded-xl bg-white/95 text-[#1F6F5F] hover:bg-[#EEEEEE] transition-all text-xs font-bold shadow-md border border-[#EEEEEE] flex items-center gap-1.5 cursor-pointer"
                        title="Fokuskan Peta ke Rumah Saya"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Rumah</span>
                        <span
                            className={cn(
                                'w-2 h-2 rounded-full',
                                userSafety?.status === 'danger'
                                    ? 'bg-[#B91C1C] animate-ping'
                                    : userSafety?.status === 'warning'
                                      ? 'bg-[#E5A910]'
                                      : 'bg-[#15803D]',
                            )}
                        />
                    </button>
                )}

                {/* Toggle Layer Seluruh Warga Terdaftar (Khusus Admin / Komando) */}
                {registeredUsersCount > 0 && onToggleRegisteredUsers && (
                    <button
                        type="button"
                        onClick={onToggleRegisteredUsers}
                        className={cn(
                            'px-3 py-1.5 rounded-xl transition-all text-xs font-bold shadow-md border flex items-center gap-1.5 cursor-pointer',
                            shouldShowRegisteredUsers
                                ? 'bg-[#1F6F5F] text-white border-[#1F6F5F]'
                                : 'bg-white/95 text-[#262626]/70 border-[#EEEEEE] hover:text-[#1F6F5F]',
                        )}
                        title="Tampilkan / Sembunyikan Titik Sebaran Tempat Tinggal Warga"
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>Warga Terdaftar ({registeredUsersCount})</span>
                        <span
                            className={cn(
                                'w-2 h-2 rounded-full',
                                shouldShowRegisteredUsers ? 'bg-emerald-300' : 'bg-neutral-300',
                            )}
                        />
                    </button>
                )}
            </div>

            {/* Badge Counter Titik Hotspot Terpantau (Kanan Atas) */}
            <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
                <div className="px-3 py-1.5 rounded-xl bg-white/95 text-[#1F6F5F] font-bold text-xs shadow-md border border-[#EEEEEE] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1F6F5F]" />
                    {hotspotsCount.toLocaleString('id-ID')} Titik Terpantau
                </div>
            </div>
        </>
    );
}
export default MapHud;

