import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Navbar,
    ProvinceFilter,
    Maps,
    StatCards,
    Footer,
    type ProvinceItem,
} from '@/pages/Components/Dashboard';
import {
    useWildfireData,
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
    const [enabledSensors] = useState<SensorSource[]>([
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

    return (
        <>
            <Head title="Dashboard Karhutla & Gambut - BorneoCare" />

            {/* Layout Utama: Background Light Neutral & Typography Figtree / Fraunces */}
            <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                {/* 1. Header & Navigation */}
                <Navbar onReset={handleResetView} lastUpdated={lastUpdated} />

                {/* 2. Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Admin Mode Shortcut Banner */}
                    {isAdmin && (
                        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#175246] to-[#1F6F5F] p-3.5 text-white shadow-xs sm:flex-row sm:items-center sm:p-4">
                            <div className="flex items-center gap-2.5">
                                <span className="bg-accent h-2 w-2 shrink-0 animate-pulse rounded-full" />
                                <span className="text-xs font-semibold text-white/95">
                                    Anda login sebagai{' '}
                                    <strong>Administrator</strong>. Buka Command
                                    Center untuk matriks analisis satelit
                                    lengkap & manajemen data spasial.
                                </span>
                            </div>
                            <Link
                                href="/admin/dashboard"
                                className="shrink-0 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-[#1F6F5F] shadow-2xs transition-colors hover:bg-neutral-100"
                            >
                                Buka Command Center Admin →
                            </Link>
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

                    {/* Panduan Keselamatan & Evakuasi Cepat Warga */}
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
                                    Informasi penting bagi keluarga dan kelompok
                                    rentan (anak-anak, lansia, ibu hamil) di
                                    area terdampak kabut asap.
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
                                    kebakaran lahan. Utamakan masker N95 saat
                                    beraktivitas di luar.
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
                                    Bila indeks asap mencapai level Sangat Tidak
                                    Sehat, segera datangi Safe Zone atau shelter
                                    evakuasi terdekat dengan pasokan oksigen
                                    siaga.
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 font-bold text-sky-700">
                                    🏠
                                </div>
                                <h3 className="mb-1 text-xs font-bold text-neutral-800">
                                    Tutup Ventilasi Saat Asap Pekat
                                </h3>
                                <p className="text-[11px] leading-relaxed text-neutral-600">
                                    Tutup celah pintu dan jendela menggunakan
                                    kain basah, nyalakan air purifier bila ada,
                                    dan perbanyak konsumsi air putih untuk
                                    mencegah iritasi saluran napas.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}
