import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ConfidenceLevel } from '@/hooks/useWildfireData';
import type { UserLocation } from '@/utils/geoSafety';
import { PROVINCE_COLORS } from './constants';
import { Users } from '../Icons';

export interface MapLegendProps {
    countsByLevel: Record<ConfidenceLevel, number>;
    selectedConfidenceLevels: ConfidenceLevel[];
    onToggleConfidenceLevel?: (level: ConfidenceLevel) => void;
    selectedProvinces: string[];
    onToggleProvince?: (name: string) => void;
    countsByProvince: Record<string, number>;
    showUserHome: boolean;
    userLocation?: UserLocation | null;
    onToggleUserHome?: () => void;
    registeredUsersCount?: number;
    vulnerableHouseholdsCount?: number;
    shouldShowRegisteredUsers?: boolean;
    onToggleRegisteredUsers?: () => void;
    onResetFilters?: () => void;
}

export function MapLegend({
    countsByLevel,
    selectedConfidenceLevels,
    onToggleConfidenceLevel,
    selectedProvinces,
    onToggleProvince,
    countsByProvince,
    showUserHome,
    userLocation,
    onToggleUserHome,
    registeredUsersCount = 0,
    vulnerableHouseholdsCount = 0,
    shouldShowRegisteredUsers = true,
    onToggleRegisteredUsers,
    onResetFilters,
}: MapLegendProps) {
    const [showInfoGuide, setShowInfoGuide] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const totalActiveFilters =
        3 - selectedConfidenceLevels.length +
        selectedProvinces.length +
        (showUserHome ? 0 : 1);
    const hasAnyFilterActive = totalActiveFilters > 0;

    return (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-[#EEEEEE] text-xs w-[270px] sm:w-[305px] pointer-events-auto max-h-[85%] overflow-y-auto no-scrollbar transition-all">
            {/* Header Legenda & Tombol Reset */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#1F6F5F] uppercase tracking-wide">
                        Filter &amp; Legenda Peta
                    </span>
                    {hasAnyFilterActive && (
                        <span className="text-[9px] font-bold bg-[#1F6F5F] text-white px-1.5 py-0.2 rounded-full">
                            {totalActiveFilters} aktif
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasAnyFilterActive && onResetFilters && !isCollapsed && (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                            Reset
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer transition-colors flex items-center justify-center w-5 h-5"
                        title={isCollapsed ? "Perbesar Legenda" : "Perkecil Legenda"}
                    >
                        <svg className="w-3.5 h-3.5 transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <>
            {/* 1. Filter Situasi Anomali Suhu & Potensi Kebakaran (Multi-Pilih) */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#262626]/60">
                    <span>Potensi Kebakaran (Multi-Pilih)</span>
                    <button
                        type="button"
                        onClick={() => setShowInfoGuide(!showInfoGuide)}
                        className="text-[#1F6F5F] font-bold hover:underline cursor-pointer lowercase first-letter:uppercase"
                    >
                        {showInfoGuide ? '✕ Tutup Panduan' : 'Panduan Analisis'}
                    </button>
                </div>

                {/* Expandable Panduan Analisis Tanpa Emoji */}
                {showInfoGuide && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-[11px] text-[#1F6F5F] space-y-2 mb-2 animate-fadeIn">
                        <div className="font-bold text-[11px] border-b border-emerald-200 pb-1">
                            Standar Minimum Suhu &amp; Potensi Kebakaran:
                        </div>
                        <div>
                            <strong className="text-[#B91C1C]">
                                <span className="inline-block w-2 h-2 rounded-full bg-[#B91C1C] mr-1 align-middle" />
                                Potensi Tinggi (&ge; 70&deg;C / FRP &ge; 12 MW):
                            </strong>{' '}
                            Anomali panas ekstrem. Mengindikasikan potensi kebakaran tajuk atau kobaran api nyata terbuka. Waspadai bahaya api dan kenakan masker N95.
                        </div>
                        <div>
                            <strong className="text-[#CA8A04]">
                                <span className="inline-block w-2 h-2 rounded-full bg-[#E5A910] mr-1 align-middle" />
                                Potensi Sedang (60&deg;C &ndash; 69.9&deg;C):
                            </strong>{' '}
                            Anomali panas sedang di atas tanah. Berpotensi merupakan bara di lapisan tanah gambut (<em>smoldering</em>) atau sisa pembakaran yang belum padam.
                        </div>
                        <div>
                            <strong className="text-[#15803D]">
                                <span className="inline-block w-2 h-2 rounded-full bg-[#15803D] mr-1 align-middle" />
                                Potensi Rendah (&lt; 60&deg;C):
                            </strong>{' '}
                            Suhu anomali ringan atau permukaan hangat terkendali dengan radiasi minimal. Risiko kebakaran rendah.
                        </div>
                        <div className="text-[9.5px] text-[#262626]/70 italic pt-1 border-t border-emerald-200">
                            *Sensor satelit mendeteksi radiasi termal &amp; suhu tanah (&deg;C), bukan pengamatan visual kamera langsung.
                        </div>
                    </div>
                )}

                {/* Item 1: Potensi Tinggi */}
                {(() => {
                    const isActive = selectedConfidenceLevels.includes('high');
                    return (
                        <button
                            type="button"
                            onClick={() => onToggleConfidenceLevel?.('high')}
                            className={cn(
                                'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer',
                                isActive
                                    ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-bold shadow-2xs'
                                    : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                            )}
                            title="Klik untuk menampilkan/menyembunyikan titik Potensi Kebakaran Tinggi (≥ 70°C)"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#B91C1C] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                    {isActive && '✓'}
                                </span>
                                <span className="text-[11px]">Tinggi (&ge; 70&deg;C)</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white border border-rose-200 text-[#B91C1C]">
                                {countsByLevel.high}
                            </span>
                        </button>
                    );
                })()}

                {/* Item 2: Potensi Sedang */}
                {(() => {
                    const isActive = selectedConfidenceLevels.includes('nominal');
                    return (
                        <button
                            type="button"
                            onClick={() => onToggleConfidenceLevel?.('nominal')}
                            className={cn(
                                'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer',
                                isActive
                                    ? 'bg-yellow-50/70 border-yellow-200 text-yellow-950 font-bold shadow-2xs'
                                    : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                            )}
                            title="Klik untuk menampilkan/menyembunyikan titik Potensi Kebakaran Sedang (60 - 69.9°C)"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#E5A910] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                    {isActive && '✓'}
                                </span>
                                <span className="text-[11px]">Sedang (60&ndash;69&deg;C)</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white border border-yellow-200 text-[#854D0E]">
                                {countsByLevel.nominal}
                            </span>
                        </button>
                    );
                })()}

                {/* Item 3: Potensi Rendah */}
                {(() => {
                    const isActive = selectedConfidenceLevels.includes('low');
                    return (
                        <button
                            type="button"
                            onClick={() => onToggleConfidenceLevel?.('low')}
                            className={cn(
                                'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer',
                                isActive
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold shadow-2xs'
                                    : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                            )}
                            title="Klik untuk menampilkan/menyembunyikan titik Potensi Kebakaran Rendah (< 60°C)"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#15803D] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                    {isActive && '✓'}
                                </span>
                                <span className="text-[11px]">Rendah (&lt; 60&deg;C)</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white border border-emerald-200 text-[#15803D]">
                                {countsByLevel.low}
                            </span>
                        </button>
                    );
                })()}

                {/* Item 4: Rumah Pribadi Warga & 25km Radius */}
                {userLocation && onToggleUserHome && (
                    <button
                        type="button"
                        onClick={onToggleUserHome}
                        className={cn(
                            'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer pt-1 border-t border-[#EEEEEE]',
                            showUserHome
                                ? 'bg-[#2FA084]/10 border-[#2FA084]/30 text-[#1F6F5F] font-bold'
                                : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                        )}
                        title="Klik untuk menyembunyikan/menampilkan marker rumah & radius pantauan"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#2FA084] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                {showUserHome && '✓'}
                            </span>
                            <span className="text-[11px]">Rumah &amp; 25km Radius</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#2FA084]">
                            {showUserHome ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </button>
                )}
            </div>

            {/* 2. Filter Wilayah 5 Provinsi Kalimantan (Multi-Pilih) */}
            <div className="mt-2.5 pt-2 border-t border-[#EEEEEE]">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#1F6F5F] tracking-wider mb-1.5">
                    <span>Wilayah Provinsi (Multi-Pilih)</span>
                    {selectedProvinces.length > 0 && (
                        <span className="text-[9px] text-neutral-500 font-semibold">
                            {selectedProvinces.length} dipilih
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(PROVINCE_COLORS).map(([provKey, provConfig]) => {
                        const isSelected = selectedProvinces.some(
                            (p) =>
                                provKey.includes(p.toUpperCase()) ||
                                p.toUpperCase().includes(provKey),
                        );

                        return (
                            <button
                                key={provKey}
                                type="button"
                                onClick={() => onToggleProvince?.(provConfig.name)}
                                className={cn(
                                    'flex items-center justify-between px-2 py-1 rounded-md text-[10px] transition-all border cursor-pointer',
                                    isSelected
                                        ? 'bg-white font-bold shadow-xs'
                                        : 'bg-[#FAFAFA] border-[#EEEEEE] text-[#262626]/70 hover:bg-white',
                                )}
                                style={{
                                    borderColor: isSelected ? provConfig.stroke : '#EEEEEE',
                                    boxShadow: isSelected
                                        ? `0 1px 4px ${provConfig.fill}40`
                                        : undefined,
                                }}
                                title={`Klik untuk filter/highlight wilayah ${provConfig.name}`}
                            >
                                <div className="flex items-center gap-1.5 truncate">
                                    <span
                                        className="w-2.5 h-2.5 rounded-xs shrink-0 flex items-center justify-center text-[7px] text-white font-bold"
                                        style={{
                                            backgroundColor: provConfig.fill,
                                            border: `1px solid ${provConfig.stroke}`,
                                        }}
                                    >
                                        {isSelected && '✓'}
                                    </span>
                                    <span className="truncate">{provConfig.label}</span>
                                </div>
                                <span
                                    className="text-[9px] font-mono px-1 rounded"
                                    style={{
                                        color: provConfig.stroke,
                                        backgroundColor: `${provConfig.fill}15`,
                                    }}
                                >
                                    {countsByProvince[provKey] || 0}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Sebaran Warga & Keluarga Terdaftar (Khusus Admin / Komando) */}
            {registeredUsersCount > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#EEEEEE]">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#1F6F5F] tracking-wider mb-1.5">
                        <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>Sebaran Warga ({registeredUsersCount} KK)</span>
                        </span>
                        {onToggleRegisteredUsers && (
                            <button
                                type="button"
                                onClick={onToggleRegisteredUsers}
                                className="text-[10px] text-[#1F6F5F] font-bold hover:underline cursor-pointer"
                            >
                                {shouldShowRegisteredUsers ? 'Sembunyikan' : 'Tampilkan'}
                            </button>
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between px-2 py-1 rounded-md bg-purple-50/70 border border-purple-200 text-purple-950 text-[10.5px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] shrink-0" />
                                <span>Prioritas Rentan</span>
                            </div>
                            <span className="text-[9.5px] font-mono font-bold text-[#6D28D9]">
                                {vulnerableHouseholdsCount} KK
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 rounded-md bg-teal-50/70 border border-teal-200 text-teal-950 text-[10.5px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] shrink-0" />
                                <span>Keluarga Non-Rentan</span>
                            </div>
                            <span className="text-[9.5px] font-mono font-bold text-[#0F766E]">
                                {registeredUsersCount - vulnerableHouseholdsCount} KK
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Keterangan Singkat */}
            <div className="mt-2 pt-1.5 border-t border-[#EEEEEE] text-[9.5px] text-[#262626]/60 flex items-center justify-between">
                <span>Radius lingkaran titik &prop; FRP (MW)</span>
                <span className="text-[#1F6F5F] font-semibold">Live FIRMS</span>
            </div>
            </>
            )}
        </div>
    );
}
export default MapLegend;

