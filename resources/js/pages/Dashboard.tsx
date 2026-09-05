import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    Navbar,
    ProvinceFilter,
    Maps,
    StatCards,
    Footer,
    WildfirePanel,
    Flame,
    Wind,
    Sun,
    type ProvinceItem,
} from '@/pages/Components/Dashboard';
import {
    useWildfireData,
    PROVINCE_CONFIG,
    type HotspotCategory,
    type WildfireHotspot,
} from '@/hooks/useWildfireData';

export default function Dashboard() {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0.9619, 114.5548]);
    const [mapZoom, setMapZoom] = useState<number>(6);
    const [selectedHotspot, setSelectedHotspot] = useState<WildfireHotspot | null>(null);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | HotspotCategory>('all');

    const wildfire = useWildfireData({ enabledSensors: ['VIIRS_SNPP', 'VIIRS_NOAA20'], dayRange: 1 });
    const { stats, hotspots, isLoading, lastUpdated, refresh } = wildfire;

    const visibleHotspots = activeCategoryFilter === 'all'
        ? hotspots
        : hotspots.filter((hotspot) => hotspot.category === activeCategoryFilter);

    const handleSelectProvince = (province: ProvinceItem | null) => {
        setSelectedHotspot(null);
        if (province) {
            setSelectedProvince(province.name);
            setMapCenter(province.center);
            setMapZoom(province.zoom);
        } else {
            handleResetView();
        }
    };

    const handleSelectProvinceByName = (provinceName: string) => {
        const found = PROVINCE_CONFIG.find((p) => p.name === provinceName);
        if (found) {
            setSelectedProvince(found.name);
            setMapCenter(found.center);
            setMapZoom(found.zoom);
            setSelectedHotspot(null);
        }
    };

    const handleResetView = () => {
        setSelectedProvince(null);
        setSelectedHotspot(null);
        setActiveCategoryFilter('all');
        setMapCenter([0.9619, 114.5548]);
        setMapZoom(6);
    };

    const handleCategoryCardClick = (category: HotspotCategory) => {
        setActiveCategoryFilter((prev) => (prev === category ? 'all' : category));
    };

    // Rekomendasi ramah keluarga berdasarkan status risiko kabut asap
    const familyAdvice = stats.hazeRiskLevel === 'Kritis'
        ? {
            title: 'Bahaya Kabut Asap Kritis',
            desc: 'Asap pekat terdeteksi. Keluarga wajib menggunakan masker saat keluar dan tutup ventilasi rumah.',
            colorBadge: 'bg-rose-500 text-white',
            containerBg: 'bg-rose-50/70 border-rose-200 text-rose-900',
            dot: 'bg-rose-500 animate-ping',
        }
        : stats.hazeRiskLevel === 'Tinggi'
          ? {
            title: 'Waspada Kabut Asap Tinggi',
            desc: 'Kurangi aktivitas luar ruangan untuk anak-anak dan lansia. Siapkan masker pelindung.',
            colorBadge: 'bg-amber-500 text-white',
            containerBg: 'bg-amber-50/70 border-amber-200 text-amber-900',
            dot: 'bg-amber-500',
        }
          : stats.hazeRiskLevel === 'Waspada'
            ? {
            title: 'Siaga Udara & Titik Bara',
            desc: 'Terpantau beberapa titik bara gambut. Tetap jaga sirkulasi udara bersih dan cukup minum air.',
            colorBadge: 'bg-orange-500 text-white',
            containerBg: 'bg-orange-50/70 border-orange-200 text-orange-900',
            dot: 'bg-orange-500',
        }
            : {
            title: 'Kondisi Udara Relatif Aman',
            desc: 'Titik api minim. Udara terpantau baik untuk aktivitas keluarga di luar ruangan.',
            colorBadge: 'bg-[#2FA084] text-white',
            containerBg: 'bg-[#2FA084]/10 border-[#2FA084]/20 text-[#1F6F5F]',
            dot: 'bg-[#2FA084]',
        };

    return (
        <>
            <Head title="Pantauan Karhutla & Asap - BorneoCare" />

            <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                {/* 1. Header & Navigation */}
                <Navbar onReset={handleResetView} lastUpdated={lastUpdated} />

                {/* 2. Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* Compact Header & Status Keluarga */}
                    <div className="rounded-2xl border border-[#EEEEEE] bg-white p-4 sm:p-5 shadow-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1F6F5F]">
                                    Pantauan Kebakaran & Kabut Asap Borneo
                                </h1>
                                <p className="mt-0.5 text-xs text-[#262626]/70">
                                    Informasi dini sebaran titik api dan asap untuk keselamatan warga dan keluarga di 5 provinsi Kalimantan.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={refresh}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#2FA084] text-white hover:bg-[#1F6F5F] transition-all text-xs font-bold shadow-2xs self-start md:self-auto disabled:opacity-50 shrink-0"
                            >
                                <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>{isLoading ? 'Menyinkronkan...' : 'Perbarui Pantauan'}</span>
                            </button>
                        </div>

                        {/* Banner Status Udara & Saran Keluarga */}
                        <div className={`mt-3.5 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${familyAdvice.containerBg}`}>
                            <div className="flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${familyAdvice.dot}`} />
                                <div>
                                    <span className="font-bold text-xs mr-2">
                                        {familyAdvice.title}:
                                    </span>
                                    <span className="text-xs opacity-90">
                                        {familyAdvice.desc}
                                    </span>
                                </div>
                            </div>
                            <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 ${familyAdvice.colorBadge}`}>
                                Status {stats.hazeRiskLevel}
                            </span>
                        </div>

                        {/* Filter Tombol 5 Provinsi */}
                        <div className="mt-4 pt-3.5 border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <span className="text-xs font-semibold text-[#1F6F5F] shrink-0">
                                Pilih Wilayah:
                            </span>
                            <ProvinceFilter
                                selectedProvince={selectedProvince}
                                onSelect={handleSelectProvince}
                                countsByProvince={stats.byProvince}
                                totalCount={stats.total}
                            />
                        </div>
                    </div>

                    {/* Ringkasan Kartu 3 Tanda (Ramping & Bebas Jargon Teknis) */}
                    <section>
                        <StatCards
                            stats={stats}
                            isLoading={isLoading}
                            activeCategory={activeCategoryFilter}
                            onCategoryClick={handleCategoryCardClick}
                        />
                    </section>

                    {/* Area Utama: Peta Berdampingan dengan Panel Wilayah di Layar Besar */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Kolom Kiri: Peta Interaktif (8 Kolom) */}
                        <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-[#EEEEEE] bg-white p-3 shadow-xs sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
                                <div>
                                    <h2 className="font-display text-base font-bold text-[#1F6F5F]">
                                        Peta Sebaran Titik Panas Pulau Borneo
                                    </h2>
                                    <p className="text-[11px] text-[#262626]/60">
                                        {selectedProvince ? `Fokus: ${selectedProvince}` : 'Cakupan: Seluruh Kalimantan'} · Klik titik untuk melihat info bahaya & tips warga
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {activeCategoryFilter !== 'all' && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F]">
                                            {activeCategoryFilter === 'active_fire' && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                                                    Api Aktif
                                                </span>
                                            )}
                                            {activeCategoryFilter === 'smoke_peat' && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Wind className="w-3.5 h-3.5 text-orange-600" />
                                                    Asap & Gambut
                                                </span>
                                            )}
                                            {activeCategoryFilter === 'heat_anomaly' && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                                                    Panas Ekstrem
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setActiveCategoryFilter('all')}
                                                className="ml-1 hover:text-rose-600 font-bold"
                                                title="Hapus filter kategori"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {selectedProvince && (
                                        <button
                                            type="button"
                                            onClick={handleResetView}
                                            className="text-xs font-semibold text-[#1F6F5F] hover:underline"
                                        >
                                            Lihat Semua Wilayah
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Maps
                                center={mapCenter}
                                zoom={mapZoom}
                                className="h-[460px] sm:h-[510px] w-full"
                                wildfireHotspots={visibleHotspots}
                                selectedHotspot={selectedHotspot}
                            />
                        </div>

                        {/* Kolom Kanan: Panel Wilayah & Tips Keluarga (4 Kolom) */}
                        <div className="lg:col-span-4">
                            <WildfirePanel
                                wildfire={wildfire}
                                onSelectProvince={handleSelectProvinceByName}
                                className="h-auto lg:h-[570px]"
                            />
                        </div>
                    </div>
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}
