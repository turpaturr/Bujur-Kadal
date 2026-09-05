import { useState } from 'react';
import {
    HOTSPOT_CATEGORIES,
    type HotspotCategory,
    type ProvinceDetail,
    type SensorSource,
    type WildfireData,
    type WildfireHotspot,
} from '@/hooks/useWildfireData';
import FamilyMemberTable, { type FamilyMemberItem } from './FamilyMemberTable';

interface WildfirePanelProps {
    wildfire: WildfireData;
    enabledSensors: SensorSource[];
    onToggleSensor: (sensor: SensorSource) => void;
    onSelectProvince?: (provinceName: string) => void;
    onSelectHotspot?: (hotspot: WildfireHotspot) => void;
    familyMembers?: FamilyMemberItem[];
    isHeadOfFamily?: boolean;
    onOpenAddMember?: () => void;
    onOpenEditMember?: (member: any) => void;
    showFamilyTab?: boolean;
}

const SENSOR_INFO: Record<SensorSource, { name: string; tag: string }> = {
    VIIRS_SNPP: { name: 'VIIRS Suomi-NPP', tag: 'Resolusi 375m' },
    VIIRS_NOAA20: { name: 'VIIRS NOAA-20', tag: 'Resolusi 375m' },
    MODIS_NRT: { name: 'MODIS Terra/Aqua', tag: 'Resolusi 1km' },
};

export default function WildfirePanel({
    wildfire,
    enabledSensors,
    onToggleSensor,
    onSelectProvince,
    onSelectHotspot,
    familyMembers,
    isHeadOfFamily,
    onOpenAddMember,
    onOpenEditMember,
    showFamilyTab = true,
}: WildfirePanelProps) {
    const { stats, hotspots, isLoading, error, lastUpdated, refresh } = wildfire;
    const [activeTab, setActiveTab] = useState<'family' | 'provinces' | 'clusters' | 'guide'>(
        showFamilyTab && familyMembers && familyMembers.length > 0 ? 'family' : 'provinces'
    );

    // Top 8 titik api dengan FRP tertinggi
    const topHotspots = [...hotspots].sort((a, b) => b.frp - a.frp).slice(0, 10);

    return (
        <div className="bg-white rounded-2xl border border-[#EEEEEE] shadow-xs overflow-hidden">
            {/* 1. Header Panel */}
            <div className="p-5 border-b border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2FA084] animate-pulse"></span>
                        <h2 className="font-display text-lg sm:text-xl font-bold text-[#1F6F5F] tracking-tight">
                            Matriks Analisis Karhutla & Gambut Kalimantan
                        </h2>
                    </div>
                    <p className="text-xs text-[#262626]/70 mt-0.5">
                        Pemilahan data antara kebakaran aktif berkobar, bara gambut berasap, dan perlindungan kerentanan keluarga
                    </p>
                </div>

                {/* Tabs Switcher & Quick Add Button */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 p-1 bg-[#EEEEEE]/80 rounded-xl">
                        {showFamilyTab && <button
                            type="button"
                            onClick={() => setActiveTab('family')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'family'
                                    ? 'bg-white text-[#1F6F5F] shadow-xs font-bold'
                                    : 'text-[#262626]/70 hover:text-[#1F6F5F]'
                            }`}
                        >
                            <span>Anggota Keluarga</span>
                            {familyMembers && familyMembers.length > 0 && (
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                        activeTab === 'family'
                                            ? 'bg-[#2FA084] text-white'
                                            : 'bg-[#262626]/10 text-[#1F6F5F]'
                                    }`}
                                >
                                    {familyMembers.length}
                                </span>
                            )}
                        </button>}
                        <button
                            type="button"
                            onClick={() => setActiveTab('provinces')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'provinces'
                                    ? 'bg-white text-[#1F6F5F] shadow-xs font-bold'
                                    : 'text-[#262626]/70 hover:text-[#1F6F5F]'
                            }`}
                        >
                            Provinsi & Kategori
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('clusters')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'clusters'
                                    ? 'bg-white text-[#1F6F5F] shadow-xs font-bold'
                                    : 'text-[#262626]/70 hover:text-[#1F6F5F]'
                            }`}
                        >
                            Daftar Titik Kritis
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('guide')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'guide'
                                    ? 'bg-white text-[#1F6F5F] shadow-xs font-bold'
                                    : 'text-[#262626]/70 hover:text-[#1F6F5F]'
                            }`}
                        >
                            Panduan Klasifikasi
                        </button>
                    </div>


                </div>
            </div>

            {/* 2. Content Tabs */}
            <div className="p-5">
                {activeTab === 'family' ? (
                    <FamilyMemberTable
                        members={familyMembers ?? []}
                        isHeadOfFamily={Boolean(isHeadOfFamily)}
                        onOpenAddModal={onOpenAddMember ?? (() => {})}
                        onOpenEditModal={onOpenEditMember ?? (() => {})}
                    />
                ) : isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-[#EEEEEE] animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                        <div className="font-bold mb-1">Gagal Mengambil Data Satelit:</div>
                        <div>{error}</div>
                        <button
                            type="button"
                            onClick={refresh}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : activeTab === 'provinces' ? (
                    /* TAB 1: Matriks per Provinsi dengan Breakdown 3 Kategori */
                    <div className="space-y-3">
                        <div className="grid grid-cols-12 text-[11px] font-bold text-[#1F6F5F] uppercase tracking-wider px-3 pb-2 border-b border-[#EEEEEE]">
                            <div className="col-span-3 sm:col-span-3">Provinsi</div>
                            <div className="col-span-5 sm:col-span-4">Rasio Titik Api</div>
                            <div className="col-span-4 sm:col-span-3 text-center">Rincian Tanda</div>
                            <div className="col-span-12 sm:col-span-2 text-right mt-2 sm:mt-0">Fokus</div>
                        </div>

                        {stats.provinceDetails.map((prov: ProvinceDetail) => (
                            <div
                                key={prov.name}
                                className="grid grid-cols-12 items-center px-3 py-3 rounded-xl border border-transparent hover:border-[#2FA084]/30 hover:bg-[#2FA084]/5 transition-all"
                            >
                                <div className="col-span-3 sm:col-span-3">
                                    <div className="font-bold text-sm text-[#262626]">
                                        {prov.shortName}
                                    </div>
                                    <div className="text-[11px] text-[#262626]/60 truncate hidden sm:block">
                                        {prov.name}
                                    </div>
                                </div>

                                <div className="col-span-5 sm:col-span-4 pr-3">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="font-bold text-[#1F6F5F]">
                                            {prov.count.toLocaleString('id-ID')} titik
                                        </span>
                                        <span className="text-[11px] text-[#262626]/60">
                                            {prov.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#EEEEEE] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#2FA084] transition-all duration-700"
                                            style={{ width: `${prov.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Rincian 3 Tanda per Provinsi */}
                                <div className="col-span-4 sm:col-span-3">
                                    <div className="flex items-center justify-center gap-2 text-[11px]">
                                        <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200" title="Kebakaran Aktif">
                                            🔥 {prov.activeFireCount}
                                        </span>
                                        <span className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200" title="Asap & Gambut">
                                            💨 {prov.smokePeatCount}
                                        </span>
                                        <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hidden md:inline-flex" title="Panas Berlebih">
                                            ☀️ {prov.heatAnomalyCount}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-12 sm:col-span-2 text-right mt-2 sm:mt-0">
                                    <button
                                        type="button"
                                        onClick={() => onSelectProvince?.(prov.name)}
                                        className="w-full sm:w-auto px-3 py-1 rounded-lg text-xs font-semibold bg-[#EEEEEE] hover:bg-[#2FA084] hover:text-white text-[#1F6F5F] transition-colors"
                                    >
                                        Buka Peta
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'clusters' ? (
                    /* TAB 2: Daftar Titik Pantauan Kritis */
                    <div className="space-y-2">
                        <div className="text-xs text-[#262626]/70 mb-2">
                            Titik-titik anomali termal dengan radiasi (FRP) dan suhu tertinggi, dipilah berdasarkan tingkat potensi kebakaran.
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-[#EEEEEE] text-[11px] font-bold text-[#1F6F5F] uppercase tracking-wider">
                                        <th className="py-2 px-2">Potensi Kebakaran</th>
                                        <th className="py-2 px-2 text-right">Suhu Permukaan</th>
                                        <th className="py-2 px-2">Koordinat</th>
                                        <th className="py-2 px-2">Provinsi</th>
                                        <th className="py-2 px-2 text-right">Radiasi (FRP)</th>
                                        <th className="py-2 px-2">Fase</th>
                                        <th className="py-2 px-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EEEEEE]">
                                    {topHotspots.map((h) => {
                                        const cat = HOTSPOT_CATEGORIES[h.category];
                                        const tempC = (h.brightness - 273.15).toFixed(1);
                                        return (
                                            <tr key={h.id} className="hover:bg-[#2FA084]/5 transition-colors">
                                                <td className="py-2.5 px-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] border ${cat.badgeBg} ${cat.badgeText} ${cat.badgeBorder}`}>
                                                        <span>{cat.icon}</span>
                                                        <span>{cat.title}</span>
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-2 text-right font-mono font-bold text-[#1F6F5F]">
                                                    {tempC}°C
                                                </td>
                                                <td className="py-2.5 px-2 font-mono text-[#262626]">
                                                    {h.latitude.toFixed(4)}°, {h.longitude.toFixed(4)}°
                                                </td>
                                                <td className="py-2.5 px-2 text-[#1F6F5F] font-semibold">
                                                    {h.province ?? 'Kalimantan'}
                                                </td>
                                                <td className="py-2.5 px-2 text-right font-bold text-amber-600">
                                                    {h.frp.toFixed(1)} MW
                                                </td>
                                                <td className="py-2.5 px-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        h.daynight === 'N'
                                                            ? 'bg-indigo-50 text-indigo-700'
                                                            : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {h.daynight === 'N' ? '🌙 Malam' : '☀️ Siang'}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => onSelectHotspot?.(h)}
                                                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2FA084] text-white hover:bg-[#1F6F5F] transition-colors shadow-2xs cursor-pointer"
                                                    >
                                                        Fokus di Peta
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* TAB 3: Panduan Klasifikasi Tingkat Potensi */
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Box 1: Potensi Tinggi */}
                            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#B91C1C] shrink-0"></span>
                                    <div>
                                        <h4 className="font-bold text-rose-900 text-sm">Potensi Kebakaran Tinggi</h4>
                                        <span className="text-[10px] text-rose-700 uppercase font-semibold">Suhu &ge; 70&deg;C atau FRP &ge; 12 MW</span>
                                    </div>
                                </div>
                                <p className="text-xs text-[#262626]/80 leading-relaxed">
                                    Titik anomali termal bersuhu ekstrem dan radiasi masif. Mengindikasikan potensi kebakaran tajuk atau kobaran api nyata terbuka. Menjadi prioritas pemadaman regu darat dan water bombing.
                                </p>
                            </div>

                            {/* Box 2: Potensi Sedang */}
                            <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#E5A910] shrink-0"></span>
                                    <div>
                                        <h4 className="font-bold text-yellow-900 text-sm">Potensi Kebakaran Sedang</h4>
                                        <span className="text-[10px] text-yellow-800 uppercase font-semibold">Suhu 60&deg;C &ndash; 69.9&deg;C / FRP 5 &ndash; 11.9 MW</span>
                                    </div>
                                </div>
                                <p className="text-xs text-[#262626]/80 leading-relaxed">
                                    Suhu tanah panas sedang di atas batas normal. Berpotensi berasal dari bara di lapisan tanah gambut (*smoldering*) atau sisa pembakaran yang memicu kabut asap pekat.
                                </p>
                            </div>

                            {/* Box 3: Potensi Rendah */}
                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#15803D] shrink-0"></span>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 text-sm">Potensi Kebakaran Rendah</h4>
                                        <span className="text-[10px] text-emerald-800 uppercase font-semibold">Suhu &lt; 60&deg;C dan FRP &lt; 5 MW</span>
                                    </div>
                                </div>
                                <p className="text-xs text-[#262626]/80 leading-relaxed">
                                    Suhu permukaan hangat normal atau anomali termal rendah terkendali. Merupakan pantulan panas permukaan tanah/lahan kering alami dengan risiko kebakaran rendah.
                                </p>
                            </div>
                        </div>

                        {/* Konfigurasi Sensor */}
                        <div className="p-4 rounded-xl bg-[#EEEEEE]/50 border border-[#EEEEEE]">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F6F5F] mb-2">
                                Instrumen Satelit Aktif
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(['VIIRS_SNPP', 'VIIRS_NOAA20', 'MODIS_NRT'] as SensorSource[]).map((sensor) => {
                                    const isEnabled = enabledSensors.includes(sensor);
                                    const count = stats.bySensor[sensor] ?? 0;
                                    return (
                                        <label
                                            key={sensor}
                                            className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#EEEEEE] cursor-pointer hover:border-[#2FA084]/40 transition-colors"
                                        >
                                            <div>
                                                <div className="font-bold text-xs text-[#262626]">
                                                    {SENSOR_INFO[sensor].name}
                                                </div>
                                                <div className="text-[10px] text-[#262626]/60">
                                                    {count.toLocaleString('id-ID')} titik terdeteksi
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isEnabled}
                                                onChange={() => onToggleSensor(sensor)}
                                                className="rounded text-[#2FA084] focus:ring-[#2FA084]"
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Footer Panel */}
            <div className="px-5 py-3 bg-[#EEEEEE]/40 border-t border-[#EEEEEE] flex flex-wrap items-center justify-between gap-2 text-xs text-[#262626]/70">
                <div className="flex items-center gap-2">
                    <span>Sumber Satelit: NASA FIRMS Near Real-Time (VIIRS & MODIS)</span>
                    <span>·</span>
                    <span>Diperbarui: {lastUpdated ? lastUpdated.toLocaleTimeString('id-ID') : '-'}</span>
                </div>
                <button
                    type="button"
                    onClick={refresh}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 font-bold text-[#1F6F5F] hover:text-[#2FA084] transition-colors disabled:opacity-50"
                >
                    <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Sinkron Data Satelit</span>
                </button>
            </div>
        </div>
    );
}
