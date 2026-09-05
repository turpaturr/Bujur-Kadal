import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    Navbar,
    ProvinceFilter,
    Maps,
    StatCards,
    Footer,
    WildfirePanel,
    type ProvinceItem,
} from '@/pages/Components/Dashboard';
import {
    useWildfireData,
    PROVINCE_CONFIG,
    type HotspotCategory,
    type SensorSource,
    type WildfireHotspot,
} from '@/hooks/useWildfireData';

export default function Dashboard() {
    const { auth } = usePage<{
        auth?: {
            user?: {
                name?: string;
                role?: string;
                email?: string;
                nik?: string;
            };
            isAdmin?: boolean;
        };
    }>().props;
    const isAdmin = Boolean(auth?.isAdmin || auth?.user?.role === 'admin');

    const [selectedProvince, setSelectedProvince] = useState<string | null>(
        null,
    );
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        0.9619, 114.5548,
    ]);
    const [mapZoom, setMapZoom] = useState<number>(6);
    const [selectedHotspot, setSelectedHotspot] =
        useState<WildfireHotspot | null>(null);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<
        'all' | HotspotCategory
    >('all');

    // Sensor yang diaktifkan; default: VIIRS SNPP + NOAA-20
    const [enabledSensors, setEnabledSensors] = useState<SensorSource[]>([
        'VIIRS_SNPP',
        'VIIRS_NOAA20',
    ]);

    const wildfire = useWildfireData({ enabledSensors, dayRange: 1 });
    const { stats, hotspots, isLoading, lastUpdated, refresh } = wildfire;
    const visibleHotspots =
        activeCategoryFilter === 'all'
            ? hotspots
            : hotspots.filter(
                  (hotspot) => hotspot.category === activeCategoryFilter,
              );

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
            window.scrollTo({ top: 180, behavior: 'smooth' });
        }
    };

    const handleSelectHotspot = (hotspot: WildfireHotspot) => {
        setSelectedHotspot(hotspot);
        setMapCenter([hotspot.latitude, hotspot.longitude]);
        setMapZoom(12);
        window.scrollTo({ top: 180, behavior: 'smooth' });
    };

    const handleResetView = () => {
        setSelectedProvince(null);
        setSelectedHotspot(null);
        setActiveCategoryFilter('all');
        setMapCenter([0.9619, 114.5548]);
        setMapZoom(6);
    };

    const handleCategoryCardClick = (category: HotspotCategory) => {
        setActiveCategoryFilter((prev) =>
            prev === category ? 'all' : category,
        );
        window.scrollTo({ top: 220, behavior: 'smooth' });
    };

    const handleToggleSensor = (sensor: SensorSource) => {
        setEnabledSensors((prev) =>
            prev.includes(sensor)
                ? prev.filter((s) => s !== sensor)
                : [...prev, sensor],
        );
    };

    return (
        <>
            <Head title="Dashboard Karhutla & Gambut - BorneoCare" />

            {/* Layout Utama: Background Light Neutral & Typography Figtree / Fraunces */}
            <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                {/* 1. Header & Navigation */}
                <Navbar onReset={handleResetView} lastUpdated={lastUpdated} />

                {/* 2. Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Admin Command Ribbon */}
                    {isAdmin && (
                        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#175246] via-[#1F6F5F] to-[#2FA084] p-4 text-white shadow-sm sm:flex-row sm:items-center sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 shadow-inner backdrop-blur-md">
                                    <svg
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-accent text-xs font-bold tracking-wider uppercase">
                                            Pusat Komando Satgas
                                        </span>
                                        <span className="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />
                                        <span className="text-[11px] font-medium text-white/80">
                                            Mode Administrator Aktif
                                        </span>
                                    </div>
                                    <p className="mt-0.5 max-w-xl text-xs text-white/90">
                                        Otoritas penanganan karhutla: Matriks
                                        Analisis Spasial satelit NASA FIRMS &
                                        Klaster Radiasi Panas (FRP) diaktifkan
                                        khusus untuk akun Administrator.
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                                <span className="rounded-xl border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                                    Pantauan:{' '}
                                    <strong>{stats.total} Titik Hotspot</strong>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Header Banner & Status Alert Karhutla */}
                    <div className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-xs">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2FA084]/20 bg-[#2FA084]/15 px-2.5 py-0.5 text-xs font-bold text-[#1F6F5F]">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#2FA084]"></span>
                                        NASA FIRMS Near Real-Time
                                    </span>
                                    <span className="text-xs text-[#262626]/50">
                                        ·
                                    </span>
                                    <span className="text-xs text-[#262626]/70">
                                        Sistem Klasifikasi 3 Tanda Bahaya
                                    </span>
                                </div>
                                <h1 className="font-display text-2xl font-bold tracking-tight text-[#1F6F5F] sm:text-3xl">
                                    Wildfire & Hotspot Tracker Kalimantan
                                </h1>
                                <p className="mt-1 max-w-2xl text-xs text-[#262626]/70 sm:text-sm">
                                    Membedakan secara jelas antara{' '}
                                    <strong>Kebakaran Aktif</strong> (api
                                    terbuka),{' '}
                                    <strong>Potensi Asap & Bara Gambut</strong>,
                                    dan <strong>Panas Berlebih</strong> di 5
                                    provinsi Pulau Borneo.
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
                                            {stats.hazeRiskLevel}
                                        </div>
                                    </div>
                                    <span
                                        className={`h-3 w-3 rounded-full ${
                                            stats.hazeRiskLevel === 'Kritis'
                                                ? 'animate-ping bg-rose-500'
                                                : stats.hazeRiskLevel ===
                                                    'Tinggi'
                                                  ? 'bg-amber-500'
                                                  : 'bg-[#2FA084]'
                                        }`}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={refresh}
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
                                        {isLoading
                                            ? 'Menyinkronkan...'
                                            : 'Sinkron Satelit'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Filter Tombol 5 Provinsi */}
                        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#EEEEEE] pt-4 sm:flex-row sm:items-center">
                            <div className="text-xs font-semibold text-[#1F6F5F]">
                                Filter Wilayah Spasial:
                            </div>
                            <ProvinceFilter
                                selectedProvince={selectedProvince}
                                onSelect={handleSelectProvince}
                                countsByProvince={stats.byProvince}
                                totalCount={stats.total}
                            />
                        </div>
                    </div>

                    {/* Ringkasan Kartu 3 Tanda (StatCards) */}
                    <section>
                        <StatCards
                            stats={stats}
                            isLoading={isLoading}
                            onCategoryClick={handleCategoryCardClick}
                        />
                    </section>

                    {/* Komponen Peta Interaktif Leaflet */}
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
                                    · Klik tanda titik untuk melihat detail suhu
                                    dan jenis kebakaran.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {activeCategoryFilter !== 'all' && (
                                    <div className="flex items-center gap-1.5 rounded-lg bg-[#2FA084]/15 px-2.5 py-1 text-xs font-bold text-[#1F6F5F]">
                                        <span>Filter Aktif:</span>
                                        <span>
                                            {activeCategoryFilter ===
                                            'active_fire'
                                                ? '🔥 Kebakaran Aktif'
                                                : activeCategoryFilter ===
                                                    'smoke_peat'
                                                  ? '💨 Asap & Gambut'
                                                  : '☀️ Panas Berlebih'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveCategoryFilter('all')
                                            }
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
                                                {selectedHotspot.frp.toFixed(1)}{' '}
                                                MW
                                            </strong>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedHotspot(null)
                                            }
                                            className="font-bold text-amber-900 hover:underline"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Maps
                            center={mapCenter}
                            zoom={mapZoom}
                            className="h-[500px] w-full sm:h-[560px]"
                            wildfireHotspots={visibleHotspots}
                            selectedHotspot={selectedHotspot}
                        />
                    </section>

                    {/* Matriks Analisis Karhutla & Gambut: Khusus untuk Admin */}
                    {isAdmin ? (
                        <section className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-[#1F6F5F] px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-2xs">
                                        Panel Khusus Administrator
                                    </span>
                                    <span className="text-xs text-[#262626]/70">
                                        Matriks Analisis Karhutla, Klaster
                                        Radiasi Panas (FRP) & Filter Sensor
                                    </span>
                                </div>
                            </div>
                            <WildfirePanel
                                wildfire={wildfire}
                                enabledSensors={enabledSensors}
                                onToggleSensor={handleToggleSensor}
                                onSelectProvince={handleSelectProvinceByName}
                                onSelectHotspot={handleSelectHotspot}
                            />
                        </section>
                    ) : (
                        /* Tampilan Ramah Warga: Panduan Keselamatan & Evakuasi Cepat */
                        <section className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-xs sm:p-6">
                            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#EEEEEE] pb-4 sm:flex-row sm:items-center">
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#2FA084]/15 px-2.5 py-0.5 text-xs font-bold text-[#1F6F5F]">
                                            Panduan Warga Siaga
                                        </span>
                                        <span className="text-xs text-neutral-400">
                                            ·
                                        </span>
                                        <span className="text-xs text-neutral-600">
                                            Mitigasi Asap & Keselamatan Keluarga
                                        </span>
                                    </div>
                                    <h2 className="font-display text-xl font-bold text-[#1F6F5F]">
                                        Langkah Perlindungan Diri & Tanggap Asap
                                        Karhutla
                                    </h2>
                                    <p className="mt-0.5 text-xs text-neutral-600">
                                        Informasi penting bagi keluarga dan
                                        kelompok rentan (anak-anak, lansia, ibu
                                        hamil) di area terdampak kabut asap.
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <a
                                        href="tel:112"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
                                    >
                                        <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <span>Panggilan Darurat 112</span>
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
                                        😷
                                    </div>
                                    <h3 className="mb-1 text-xs font-bold text-neutral-800">
                                        Gunakan Masker Partikulat N95
                                    </h3>
                                    <p className="text-[11px] leading-relaxed text-neutral-600">
                                        Masker kain biasa tidak mampu menyaring
                                        partikel mikro PM2.5 dari kabut asap
                                        kebakaran lahan. Utamakan masker N95
                                        saat beraktivitas di luar.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
                                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                                        🛡️
                                    </div>
                                    <h3 className="mb-1 text-xs font-bold text-neutral-800">
                                        Titik Perlindungan Safe Zone
                                    </h3>
                                    <p className="text-[11px] leading-relaxed text-neutral-600">
                                        Bila indeks asap mencapai level Sangat
                                        Tidak Sehat, segera datangi Safe Zone
                                        atau shelter evakuasi terdekat dengan
                                        pasokan oksigen siaga.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sm font-bold text-sky-700">
                                        🏠
                                    </div>
                                    <h3 className="mb-1 text-xs font-bold text-neutral-800">
                                        Tutup Ventilasi Saat Asap Pekat
                                    </h3>
                                    <p className="text-[11px] leading-relaxed text-neutral-600">
                                        Tutup celah pintu dan jendela
                                        menggunakan kain basah, nyalakan air
                                        purifier bila ada, dan perbanyak
                                        konsumsi air putih untuk mencegah
                                        iritasi saluran napas.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}
