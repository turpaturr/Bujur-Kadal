import { useState } from 'react';
import {
    HOTSPOT_CATEGORIES,
    type HotspotCategory,
    type ProvinceDetail,
    type SensorSource,
    type WildfireData,
    type WildfireHotspot,
} from '@/hooks/useWildfireData';

interface WildfirePanelProps {
    wildfire: WildfireData;
    enabledSensors: SensorSource[];
    onToggleSensor: (sensor: SensorSource) => void;
    onSelectProvince?: (provinceName: string) => void;
    onSelectHotspot?: (hotspot: WildfireHotspot) => void;
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
}: WildfirePanelProps) {
    const { stats, hotspots, isLoading, error, lastUpdated, refresh } = wildfire;
    const [activeTab, setActiveTab] = useState<'provinces' | 'clusters' | 'guide'>('provinces');

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
                        Pemilahan data antara kebakaran aktif berkobar, bara gambut berasap, dan anomali panas
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-[#EEEEEE]/80 rounded-xl self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('provinces')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'guide'
                                ? 'bg-white text-[#1F6F5F] shadow-xs font-bold'
                                : 'text-[#262626]/70 hover:text-[#1F6F5F]'
                        }`}
                    >
                        Panduan Klasifikasi
                    </button>
                </div>
            </div>

            {/* 2. Content Tabs */}
            <div className="p-5">
                {isLoading ? (
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
                    /* TAB 2: Daftar Titik Api Kritis */
                    <div className="space-y-2">
                        <div className="text-xs text-[#262626]/70 mb-2">
                            Titik-titik api dengan radiasi termal (FRP) paling intens, dipilah berdasarkan klasifikasi tanda bahaya.
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-[#EEEEEE] text-[11px] font-bold text-[#1F6F5F] uppercase tracking-wider">
                                        <th className="py-2 px-2">Klasifikasi Tanda</th>
                                        <th className="py-2 px-2">Koordinat</th>
                                        <th className="py-2 px-2">Provinsi</th>
                                        <th className="py-2 px-2 text-right">Energi Api (FRP)</th>
                                        <th className="py-2 px-2">Fase</th>
                                        <th className="py-2 px-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EEEEEE]">
                                    {topHotspots.map((h) => {
                                        const cat = HOTSPOT_CATEGORIES[h.category];
                                        return (
                                            <tr key={h.id} className="hover:bg-[#2FA084]/5 transition-colors">
                                                <td className="py-2.5 px-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] border ${cat.badgeBg} ${cat.badgeText} ${cat.badgeBorder}`}>
                                                        <span>{cat.icon}</span>
                                                        <span>{cat.title}</span>
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-2 font-mono font-bold text-[#262626]">
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
                                                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2FA084] text-white hover:bg-[#1F6F5F] transition-colors shadow-2xs"
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
                    /* TAB 3: Panduan Klasifikasi Tanda */
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Box 1: Kebakaran Aktif */}
                            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🔥</span>
                                    <div>
                                        <h4 className="font-bold text-rose-800 text-sm">Kebakaran Aktif</h4>
                                        <span className="text-[10px] text-rose-600 uppercase font-semibold">Flaming Wildfire</span>
                                    </div>
                                </div>
                                <p className="text-xs text-[#262626]/80 leading-relaxed">
                                    Titik di mana radiasi panas sangat tinggi dengan keyakinan kuat bahwa api menyala terbuka di vegetasi atau tajuk pohon. Menjadi prioritas pemadaman regu darat & water bombing helikopter.
                                </p>
                            </div>

                            {/* Box 2: Potensi Asap & Gambut */}
                            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">💨</span>
                                    <div>
                                        <h4 className="font-bold text-orange-800 text-sm">Potensi Asap & Gambut</h4>
                                        <span className="text-[10px] text-orange-600 uppercase font-semibold">Peatland Smoldering</span>
                                    </div>
                                </div>
                                <p className="text-xs text-[#262626]/80 leading-relaxed">
                                    Bara di lapisan tanah gambut atau pembakaran semak lembap. Seringkali tidak terlihat api tinggi menjulang di atas pohon, namun memancarkan asap pekat kelabu yang menjadi biang kabut asap (ISPU/AQI buruk).
                                </p>
                            </div>

                            {/* Box 3: Panas Berlebih */}
                            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">☀️</span>
                                    <div>
                                        <h4 className="font-bold text-amber-900 text-sm">Panas Berlebih</h4>
                                        <span className="text-[10px] text-amber-700 uppercase font-semibold">Thermal Anomaly</span>
                                    </div>
                                </div>
                                <p className="text-xs text-[#262626]/80 leading-relaxed">
                                    Suhu tanah di atas normal akibat terik matahari ekstrem pada lahan gersang, atap industri, atau vegetasi yang sangat kering. Berfungsi sebagai peringatan dini area rawan tersulut api.
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
