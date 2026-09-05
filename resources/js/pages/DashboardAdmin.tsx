import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    AdminNavbar,
    AdminCommandRibbon,
    AdminHeaderBanner,
    AdminMapSection,
    StatCards,
    WildfirePanel,
    Footer,
    type ProvinceItem,
} from '@/pages/Components/DashboardAdmin';
import {
    useWildfireData,
    PROVINCE_CONFIG,
    type HotspotCategory,
    type SensorSource,
    type WildfireHotspot,
} from '@/hooks/useWildfireData';

interface AdminStats {
    totalUsers: number;
    totalFamilies: number;
    activeSosCount: number;
    safeZonesCount: number;
}

interface DashboardAdminProps {
    adminStats?: AdminStats;
}

export default function DashboardAdmin({ adminStats }: DashboardAdminProps) {
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
            window.scrollTo({ top: 220, behavior: 'smooth' });
        }
    };

    const handleSelectHotspot = (hotspot: WildfireHotspot) => {
        setSelectedHotspot(hotspot);
        setMapCenter([hotspot.latitude, hotspot.longitude]);
        setMapZoom(12);
        window.scrollTo({ top: 220, behavior: 'smooth' });
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
        window.scrollTo({ top: 260, behavior: 'smooth' });
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
            <Head title="Admin Command Center - Monitoring Karhutla & Satelit Borneo" />

            {/* Layout Utama: Background Light Neutral & Typography Figtree / Fraunces */}
            <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                {/* 1. Header & Admin Navigation */}
                <AdminNavbar
                    onReset={handleResetView}
                    lastUpdated={lastUpdated}
                />

                {/* 2. Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Pusat Komando Satgas Ribbon */}
                    <AdminCommandRibbon
                        totalHotspots={stats.total}
                        hazeRiskLevel={stats.hazeRiskLevel}
                        onRefresh={refresh}
                        isLoading={isLoading}
                    />

                    {/* Header Banner & Status Alert Karhutla */}
                    <AdminHeaderBanner
                        hazeRiskLevel={stats.hazeRiskLevel}
                        isLoading={isLoading}
                        onRefresh={refresh}
                        selectedProvince={selectedProvince}
                        onSelectProvince={handleSelectProvince}
                        countsByProvince={stats.byProvince}
                        totalCount={stats.total}
                    />

                    {/* Ringkasan Kartu 3 Tanda (StatCards) */}
                    <section>
                        <StatCards
                            stats={stats}
                            isLoading={isLoading}
                            onCategoryClick={handleCategoryCardClick}
                        />
                    </section>

                    {/* Komponen Peta Interaktif Leaflet */}
                    <AdminMapSection
                        center={mapCenter}
                        zoom={mapZoom}
                        selectedProvince={selectedProvince}
                        activeCategoryFilter={activeCategoryFilter}
                        onClearCategoryFilter={() =>
                            setActiveCategoryFilter('all')
                        }
                        selectedHotspot={selectedHotspot}
                        onClearSelectedHotspot={() => setSelectedHotspot(null)}
                        visibleHotspots={visibleHotspots}
                    />

                    {/* Matriks Analisis Karhutla & Gambut: Khusus Administrator */}
                    <section className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span className="shadow-2xs rounded-full bg-[#1F6F5F] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                    Panel Khusus Administrator
                                </span>
                                <span className="text-xs text-[#262626]/70">
                                    Matriks Analisis Karhutla, Klaster Radiasi
                                    Panas (FRP) & Filter Sensor
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
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}

