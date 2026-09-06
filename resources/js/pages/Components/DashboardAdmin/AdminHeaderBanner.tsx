import React from 'react';
import { ProvinceFilter, type ProvinceItem } from '@/pages/Components/Dashboard';

interface AdminHeaderBannerProps {
    hazeRiskLevel: string;
    isLoading: boolean;
    onRefresh: () => void;
    selectedProvince: string | null;
    onSelectProvince: (province: ProvinceItem | null) => void;
    countsByProvince: Record<string, number>;
    totalCount: number;
}

export default function AdminHeaderBanner({
    hazeRiskLevel,
    isLoading,
    onRefresh,
    selectedProvince,
    onSelectProvince,
    countsByProvince,
    totalCount,
}: AdminHeaderBannerProps) {
    return (
        <div className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F6F5F] px-2.5 py-0.5 text-xs font-bold text-white">
                            <span className="bg-accent h-2 w-2 animate-pulse rounded-full" />
                            NASA FIRMS Near Real-Time
                        </span>
                        <span className="text-xs text-[#262626]/50">·</span>
                        <span className="text-xs text-[#262626]/70">
                            Pengawasan Otoritas Administrator
                        </span>
                    </div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-[#1F6F5F] sm:text-3xl">
                        Pusat Kendali Hotspot & Karhutla Kalimantan
                    </h1>
                    <p className="mt-1 max-w-2xl text-xs text-[#262626]/70 sm:text-sm">
                        Akses penuh pemantauan <strong>Kebakaran Aktif</strong>{' '}
                        (api terbuka),{' '}
                        <strong>Potensi Asap & Bara Gambut</strong>, dan{' '}
                        <strong>Panas Berlebih</strong> di 5 provinsi Pulau
                        Borneo.
                    </p>
                </div>

                {/* Status Bahaya & Quick Action */}
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2.5 rounded-xl border border-[#EEEEEE] bg-[#EEEEEE]/80 px-3.5 py-2">
                        <div className="text-right">
                            <div className="text-[10px] font-bold tracking-wider text-[#262626]/60 uppercase">
                                Status Asap
                            </div>
                            <div className="text-xs font-bold text-[#1F6F5F]">
                                {hazeRiskLevel}
                            </div>
                        </div>
                        <span
                            className={`h-3 w-3 rounded-full ${
                                hazeRiskLevel === 'Kritis'
                                    ? 'animate-ping bg-rose-500'
                                    : hazeRiskLevel === 'Tinggi'
                                      ? 'bg-amber-500'
                                      : 'bg-[#2FA084]'
                            }`}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#2FA084] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#1F6F5F] disabled:opacity-50"
                    >
                        <svg
                            className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span>
                            {isLoading ? 'Menyinkronkan...' : 'Sinkron Satelit'}
                        </span>
                    </button>
                </div>
            </div>

        </div>
    );
}

