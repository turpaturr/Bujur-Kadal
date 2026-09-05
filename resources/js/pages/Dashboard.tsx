import { useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    Navbar,
    ProvinceFilter,
    Maps,
    StatCards,
    Footer,
    WildfirePanel,
    UserSafetyBanner,
    type ProvinceItem,
} from '@/pages/Components/Dashboard';
import {
    useWildfireData,
    PROVINCE_CONFIG,
    type HotspotCategory,
    type SensorSource,
    type WildfireHotspot,
} from '@/hooks/useWildfireData';
import { analyzeUserSafety, type UserLocation } from '@/utils/geoSafety';

interface PageProps {
    auth?: {
        user?: {
            id?: number;
            name?: string;
            home_address?: string | null;
            home_latitude?: number | string | null;
            home_longitude?: number | string | null;
            [key: string]: unknown;
        } | null;
    };
    [key: string]: unknown;
}

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;

    // 1. Ekstrak lokasi kediaman user jika tersedia dari database registrasi
    const userLocation: UserLocation | null = useMemo(() => {
        const rawLat = auth?.user?.home_latitude;
        const rawLng = auth?.user?.home_longitude;

        if (rawLat !== null && rawLat !== undefined && rawLng !== null && rawLng !== undefined) {
            const lat = Number(rawLat);
            const lng = Number(rawLng);

            if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
                return {
                    latitude: lat,
                    longitude: lng,
                    name: auth?.user?.name ?? 'Kediaman Anda',
                    address: auth?.user?.home_address ?? null,
                };
            }
        }
        return null;
    }, [auth?.user]);

    const hasHome = Boolean(userLocation);

    // Default map center & zoom: jika user memiliki koordinat tempat tinggal,
    // langsung arahkan pandangan pertama ke posisi user (zoom 11)
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [isHomeSelected, setIsHomeSelected] = useState<boolean>(hasHome);
    const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
        if (userLocation) {
            return [userLocation.latitude, userLocation.longitude];
        }
        return [0.9619, 114.5548];
    });
    const [mapZoom, setMapZoom] = useState<number>(() => {
        return userLocation ? 11 : 6;
    });

    const [selectedHotspot, setSelectedHotspot] = useState<WildfireHotspot | null>(null);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | HotspotCategory>('all');

    // Sensor yang diaktifkan; default: VIIRS SNPP + NOAA-20
    const [enabledSensors, setEnabledSensors] = useState<SensorSource[]>([
        'VIIRS_SNPP',
        'VIIRS_NOAA20',
    ]);

    const wildfire = useWildfireData({ enabledSensors, dayRange: 1 });
    const { stats, hotspots, isLoading, lastUpdated, refresh } = wildfire;

    const visibleHotspots = activeCategoryFilter === 'all'
        ? hotspots
        : hotspots.filter((hotspot) => hotspot.category === activeCategoryFilter);

    // 2. Analisis Keamanan Karhutla Spasial di Sekitar Kediaman User (Radius 10km & 25km)
    const userSafety = useMemo(() => {
        return analyzeUserSafety(userLocation, visibleHotspots);
    }, [userLocation, visibleHotspots]);

    const handleFocusHome = () => {
        if (userLocation) {
            setSelectedProvince(null);
            setSelectedHotspot(null);
            setIsHomeSelected(true);
            setMapCenter([userLocation.latitude, userLocation.longitude]);
            setMapZoom(11);
            window.scrollTo({ top: 220, behavior: 'smooth' });
        }
    };

    const handleSelectProvince = (province: ProvinceItem | null) => {
        setSelectedHotspot(null);
        setIsHomeSelected(false);
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
            setIsHomeSelected(false);
            setSelectedProvince(found.name);
            setMapCenter(found.center);
            setMapZoom(found.zoom);
            setSelectedHotspot(null);
            window.scrollTo({ top: 180, behavior: 'smooth' });
        }
    };

    const handleSelectHotspot = (hotspot: WildfireHotspot) => {
        setSelectedHotspot(hotspot);
        setIsHomeSelected(false);
        setMapCenter([hotspot.latitude, hotspot.longitude]);
        setMapZoom(12);
        window.scrollTo({ top: 180, behavior: 'smooth' });
    };

    const handleFocusNearestHotspot = () => {
        if (userSafety.nearestHotspot?.hotspot) {
            handleSelectHotspot(userSafety.nearestHotspot.hotspot);
        }
    };

    const handleResetView = () => {
        setSelectedProvince(null);
        setSelectedHotspot(null);
        setIsHomeSelected(false);
        setActiveCategoryFilter('all');
        setMapCenter([0.9619, 114.5548]);
        setMapZoom(6);
    };

    const handleCategoryCardClick = (category: HotspotCategory) => {
        setActiveCategoryFilter((prev) => (prev === category ? 'all' : category));
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
                    {/* Header Banner & Status Alert Karhutla */}
                    <div className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-xs">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F] border border-[#2FA084]/20">
                                        <span className="w-2 h-2 rounded-full bg-[#2FA084] animate-pulse"></span>
                                        NASA FIRMS Near Real-Time
                                    </span>
                                    <span className="text-xs text-[#262626]/50">·</span>
                                    <span className="text-xs text-[#262626]/70">
                                        Sistem Klasifikasi 3 Tanda Bahaya
                                    </span>
                                </div>
                                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F6F5F]">
                                    Wildfire & Hotspot Tracker Kalimantan
                                </h1>
                                <p className="mt-1 text-xs sm:text-sm text-[#262626]/70 max-w-2xl">
                                    Membedakan secara jelas antara <strong>Kebakaran Aktif</strong> (api terbuka), <strong>Potensi Asap & Bara Gambut</strong>, dan <strong>Panas Berlebih</strong> di 5 provinsi Pulau Borneo.
                                </p>
                            </div>

                            {/* Status Bahaya & Quick Action */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                                <div className="px-3.5 py-2 rounded-xl bg-[#EEEEEE]/80 border border-[#EEEEEE] flex items-center gap-2.5">
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase font-bold text-[#262626]/60 tracking-wider">
                                            Status Asap
                                        </div>
                                        <div className="text-xs font-bold text-[#1F6F5F]">
                                            {stats.hazeRiskLevel}
                                        </div>
                                    </div>
                                    <span className={`w-3 h-3 rounded-full ${
                                        stats.hazeRiskLevel === 'Kritis'
                                            ? 'bg-rose-500 animate-ping'
                                            : stats.hazeRiskLevel === 'Tinggi'
                                              ? 'bg-amber-500'
                                              : 'bg-[#2FA084]'
                                    }`} />
                                </div>

                                <button
                                    type="button"
                                    onClick={refresh}
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2FA084] text-white hover:bg-[#1F6F5F] transition-all text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>{isLoading ? 'Menyinkronkan...' : 'Sinkron Satelit'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Filter Tombol 5 Wilayah & Shortcut Rumah Pengguna */}
                        <div className="mt-5 pt-4 border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs font-semibold text-[#1F6F5F]">
                                Filter Wilayah Spasial:
                            </div>
                            <ProvinceFilter
                                selectedProvince={selectedProvince}
                                onSelect={handleSelectProvince}
                                countsByProvince={stats.byProvince}
                                totalCount={stats.total}
                                hasUserHome={hasHome}
                                isHomeSelected={isHomeSelected}
                                onSelectHome={handleFocusHome}
                                userSafetyStatus={userSafety.status}
                            />
                        </div>
                    </div>

                    {/* Banner Deteksi Keamanan Lingkungan Tempat Tinggal Pengguna */}
                    {hasHome && (
                        <UserSafetyBanner
                            safety={userSafety}
                            isFocusedOnHome={isHomeSelected}
                            onFocusHome={handleFocusHome}
                            onFocusNearestHotspot={handleFocusNearestHotspot}
                            onResetToBorneo={handleResetView}
                        />
                    )}

                    {/* Ringkasan Kartu 3 Tanda (StatCards) */}
                    <section>
                        <StatCards
                            stats={stats}
                            isLoading={isLoading}
                            onCategoryClick={handleCategoryCardClick}
                        />
                    </section>

                    {/* Komponen Peta Interaktif Leaflet Terintegrasi */}
                    <section className="overflow-hidden rounded-2xl border border-[#EEEEEE] bg-white p-3 shadow-xs sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
                            <div>
                                <h2 className="font-display text-base sm:text-lg font-bold text-[#1F6F5F]">
                                    Peta Sebaran Titik Spasial Pulau Borneo
                                </h2>
                                <p className="text-[11px] text-[#262626]/60">
                                    {isHomeSelected
                                        ? `Fokus: Kediaman Anda (${userLocation?.name ?? 'Warga'}) & Radius Pantauan 25 km`
                                        : selectedProvince
                                          ? `Fokus: ${selectedProvince}`
                                          : 'Cakupan: Seluruh Pulau Kalimantan'} · Klik tanda titik untuk melihat detail suhu dan jenis kebakaran.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {isHomeSelected && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F]">
                                        <span>🏠 Kediaman Anda Aktif</span>
                                    </div>
                                )}

                                {activeCategoryFilter !== 'all' && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F]">
                                        <span>Filter Aktif:</span>
                                        <span>
                                            {activeCategoryFilter === 'active_fire'
                                                ? '🔥 Kebakaran Aktif'
                                                : activeCategoryFilter === 'smoke_peat'
                                                  ? '💨 Asap & Gambut'
                                                  : '☀️ Panas Berlebih'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setActiveCategoryFilter('all')}
                                            className="ml-1 hover:underline text-rose-600 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}

                                {selectedHotspot && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                        <span>Titik Terpilih: <strong>{selectedHotspot.frp.toFixed(1)} MW</strong></span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedHotspot(null)}
                                            className="text-amber-900 font-bold hover:underline cursor-pointer"
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
                            className="h-[500px] sm:h-[560px] w-full"
                            wildfireHotspots={visibleHotspots}
                            selectedHotspot={selectedHotspot}
                            userLocation={userLocation}
                            userSafety={userSafety}
                            onFocusHome={handleFocusHome}
                        />
                    </section>

                    {/* Wildfire Tracker Panel (Provinsi, Top Clusters FRP, Panduan Klasifikasi) */}
                    <section>
                        <WildfirePanel
                            wildfire={wildfire}
                            enabledSensors={enabledSensors}
                            onToggleSensor={handleToggleSensor}
                            onSelectProvince={handleSelectProvinceByName}
                            onSelectHotspot={handleSelectHotspot}
                        />
                    </section>
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}
