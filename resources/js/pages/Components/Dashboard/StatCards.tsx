import type { ComponentType } from 'react';
import { Flame, Wind, Sun, MapPin } from './Icons';
import type { WildfireStats, HotspotCategory } from '@/hooks/useWildfireData';

interface StatCardsProps {
    stats?: WildfireStats;
    isLoading?: boolean;
    activeCategory?: 'all' | HotspotCategory;
    onCategoryClick?: (category: HotspotCategory) => void;
}

export default function StatCards({
    stats,
    isLoading = false,
    activeCategory = 'all',
    onCategoryClick,
}: StatCardsProps) {
    const total = stats?.total ?? 0;
    const activeFires = stats?.byCategory?.active_fire ?? 0;
    const smokePeat = stats?.byCategory?.smoke_peat ?? 0;
    const heatAnomalies = stats?.byCategory?.heat_anomaly ?? 0;

    const cards: Array<{
        key: HotspotCategory;
        label: string;
        count: number;
        icon: ComponentType<{ className?: string }>;
        iconColor: string;
        colorText: string;
        bgColor: string;
        activeBorder: string;
        hoverBorder: string;
        hint: string;
    }> = [
        {
            key: 'active_fire',
            label: 'Api Aktif Terbuka',
            count: activeFires,
            icon: Flame,
            iconColor: 'text-rose-600',
            colorText: 'text-rose-600',
            bgColor: 'bg-rose-50',
            activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
            hoverBorder: 'hover:border-rose-300',
            hint: 'Kobaran api nyata di permukaan',
        },
        {
            key: 'smoke_peat',
            label: 'Asap & Gambut',
            count: smokePeat,
            icon: Wind,
            iconColor: 'text-orange-600',
            colorText: 'text-orange-600',
            bgColor: 'bg-orange-50',
            activeBorder: 'border-orange-500 ring-2 ring-orange-500/20',
            hoverBorder: 'hover:border-orange-300',
            hint: 'Bara gambut penghasil asap pekat',
        },
        {
            key: 'heat_anomaly',
            label: 'Panas Ekstrem',
            count: heatAnomalies,
            icon: Sun,
            iconColor: 'text-amber-600',
            colorText: 'text-amber-600',
            bgColor: 'bg-amber-50',
            activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
            hoverBorder: 'hover:border-amber-300',
            hint: 'Lahan kering rawan terbakar',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card) => {
                const isActive = activeCategory === card.key;
                const Icon = card.icon;
                return (
                    <button
                        key={card.key}
                        type="button"
                        onClick={() => onCategoryClick?.(card.key)}
                        className={`text-left bg-white rounded-2xl border p-3.5 sm:p-4 transition-all shadow-2xs ${
                            isActive
                                ? `${card.activeBorder} bg-white`
                                : `border-[#EEEEEE] ${card.hoverBorder} hover:shadow-xs`
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] sm:text-xs font-bold text-[#262626]/70 truncate">
                                {card.label}
                            </span>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${card.bgColor} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-4 h-4 ${card.iconColor}`} />
                            </div>
                        </div>

                        <div className="mt-2 flex items-baseline gap-2">
                            {isLoading ? (
                                <div className="h-8 w-16 bg-[#EEEEEE] animate-pulse rounded-md" />
                            ) : (
                                <span className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${card.colorText}`}>
                                    {card.count.toLocaleString('id-ID')}
                                </span>
                            )}
                            <span className="text-[10px] sm:text-xs text-[#262626]/50 font-medium">
                                Titik
                            </span>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#EEEEEE]/80 flex items-center justify-between text-[10px] sm:text-[11px] text-[#262626]/60">
                            <span className="truncate">{card.hint}</span>
                            {isActive && (
                                <span className="text-[10px] font-bold text-[#1F6F5F] shrink-0">
                                    Aktif
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}

            {/* Total Kartu Pantauan */}
            <div className="bg-white rounded-2xl border border-[#EEEEEE] p-3.5 sm:p-4 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] sm:text-xs font-bold text-[#1F6F5F] truncate">
                        Total Pantauan Borneo
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2FA084]/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#2FA084]" />
                    </div>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                    {isLoading ? (
                        <div className="h-8 w-20 bg-[#EEEEEE] animate-pulse rounded-md" />
                    ) : (
                        <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#262626]">
                            {total.toLocaleString('id-ID')}
                        </span>
                    )}
                    <span className="text-[10px] sm:text-xs text-[#1F6F5F] font-semibold">
                        Titik Total
                    </span>
                </div>

                <div className="mt-2 pt-2 border-t border-[#EEEEEE]/80 flex items-center justify-between text-[10px] sm:text-[11px] text-[#262626]/60">
                    <span>Wilayah Terbanyak:</span>
                    <span className="font-bold text-[#1F6F5F] truncate max-w-[110px]">
                        {stats?.mostAffectedProvince ? stats.mostAffectedProvince.replace('Kalimantan ', 'Kal. ') : '-'}
                    </span>
                </div>
            </div>
        </div>
    );
}
