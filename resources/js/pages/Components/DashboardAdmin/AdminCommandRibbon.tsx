import React from 'react';

interface AdminCommandRibbonProps {
    totalHotspots: number;
    hazeRiskLevel: string;
    onRefresh?: () => void;
    isLoading?: boolean;
}

export default function AdminCommandRibbon({
    totalHotspots,
    hazeRiskLevel,
    onRefresh,
    isLoading = false,
}: AdminCommandRibbonProps) {
    return (
        <div className="rounded-2xl bg-gradient-to-r from-[#175246] via-[#1F6F5F] to-[#2FA084] p-4 sm:p-5 text-white shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent">Pusat Komando Satgas Karhutla</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[11px] text-white/80 font-medium">Otoritas Penuh</span>
                    </div>
                    <p className="text-xs text-white/90 mt-0.5 max-w-xl leading-relaxed">
                        Akses khusus administrator: Pemantauan Matriks Analisis Spasial satelit NASA FIRMS, klaster radiasi daya api (FRP), koordinasi safe zone, dan mitigasi darurat kabut asap.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-auto shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-black/20 border border-white/20 text-white backdrop-blur-xs text-right">
                    <div className="text-[9px] uppercase font-bold text-white/70 tracking-wider">Status Asap</div>
                    <div className="text-xs font-bold text-accent">{hazeRiskLevel}</div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-white/15 border border-white/20 text-white backdrop-blur-xs text-right">
                    <div className="text-[9px] uppercase font-bold text-white/70 tracking-wider">Pantauan Satelit</div>
                    <div className="text-xs font-bold">{totalHotspots} Titik Hotspot</div>
                </div>

                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#1F6F5F] hover:bg-white/90 transition-all text-xs font-bold shadow-xs disabled:opacity-50"
                    >
                        <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{isLoading ? 'Sinkron...' : 'Sync Satelit'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}

    