import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    AdminMapSection,
    StatCards,
    WildfirePanel,
    AdminSidebar,
    AdminTopBar,
    CitizensListView,
    TriageView,
    FacilitiesView,
} from '@/pages/Components/DashboardAdmin';
import type { AdminMenuType } from '@/pages/Components/DashboardAdmin/AdminSidebar';
import type { HotspotCategory, ConfidenceLevel } from '@/hooks/useWildfireData';
import {
    useWildfireData,
    PROVINCE_CONFIG,
    type SensorSource,
    type WildfireHotspot,
} from '@/hooks/useWildfireData';

import type { RegisteredUserLocation } from '@/pages/Components/Dashboard/Maps';

interface AdminStats {
    totalUsers: number;
    totalFamilies: number;
    totalRegisteredLocations?: number;
    vulnerableFamiliesCount?: number;
    activeSosCount: number;
    safeZonesCount: number;
}

interface DashboardAdminProps {
    adminStats?: AdminStats;
    registeredUsers?: RegisteredUserLocation[];
}

export default function DashboardAdmin({
    adminStats,
    registeredUsers = [],
}: DashboardAdminProps) {
    const [activeMenu, setActiveMenu] = useState<AdminMenuType>('maps');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0.9619, 114.5548]);
    const [mapZoom, setMapZoom] = useState<number>(6);
    const [selectedHotspot, setSelectedHotspot] = useState<WildfireHotspot | null>(null);
    const [selectedUserLocation, setSelectedUserLocation] = useState<RegisteredUserLocation | null>(null);
    const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState<boolean>(false);

    const [enabledSensors, setEnabledSensors] = useState<SensorSource[]>([
        'VIIRS_SNPP',
        'VIIRS_NOAA20',
    ]);

    const wildfire = useWildfireData({ enabledSensors, dayRange: 1 });
    const { stats, hotspots, isLoading, refresh } = wildfire;
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | HotspotCategory>('all');
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [selectedConfidenceLevels, setSelectedConfidenceLevels] = useState<ConfidenceLevel[]>([
        'high',
        'nominal',
        'low',
    ]);

    const visibleHotspots = useMemo(() => {
        return hotspots.filter((hotspot) => {
            // 1. Kategori (Kebakaran Aktif / Asap Gambut / Panas Berlebih)
            if (activeCategoryFilter !== 'all' && hotspot.category !== activeCategoryFilter) {
                return false;
            }

            // 2. Filter Tingkat Bahaya (Tinggi / Sedang / Rendah) dari Legenda
            if (!selectedConfidenceLevels.includes(hotspot.confidenceLevel)) {
                return false;
            }

            // 3. Filter Multi-Select Wilayah Provinsi
            if (selectedProvinces.length > 0) {
                const hotspotProv = (hotspot.province || '').toUpperCase();
                const matched = selectedProvinces.some((p) => {
                    const upper = p.toUpperCase();
                    return hotspotProv.includes(upper) || upper.includes(hotspotProv);
                });
                if (!matched) {
                    return false;
                }
            }

            return true;
        });
    }, [hotspots, activeCategoryFilter, selectedConfidenceLevels, selectedProvinces]);

    const handleCategoryCardClick = (category: HotspotCategory) => {
        setActiveCategoryFilter((prev) => (prev === category ? 'all' : category));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleProvince = (provinceName: string) => {
        setSelectedProvinces((prev) =>
            prev.includes(provinceName) ? prev.filter((p) => p !== provinceName) : [...prev, provinceName],
        );
    };

    const handleToggleConfidenceLevel = (level: ConfidenceLevel) => {
        setSelectedConfidenceLevels((prev) =>
            prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
        );
    };

    const handleResetFilters = () => {
        setSelectedProvinces([]);
        setSelectedConfidenceLevels(['high', 'nominal', 'low']);
        setActiveCategoryFilter('all');
        setMapCenter([0.9619, 114.5548]);
        setMapZoom(6);
    };

    const handleSelectProvinceByName = (provinceName: string) => {
        const found = PROVINCE_CONFIG.find((p) => p.name === provinceName);
        if (found) {
            setSelectedProvince(found.name);
            setMapCenter(found.center);
            setMapZoom(found.zoom);
            setSelectedHotspot(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSelectHotspot = (hotspot: WildfireHotspot) => {
        setSelectedHotspot(hotspot);
        setSelectedUserLocation(null);
        setMapCenter([hotspot.latitude, hotspot.longitude]);
        setMapZoom(12);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSelectUserLocation = (household: RegisteredUserLocation | null) => {
        setSelectedUserLocation(household);
        if (household) {
            setIsHouseholdModalOpen(true);
            setSelectedHotspot(null);
        }
    };

    const handleToggleSensor = (sensor: SensorSource) => {
        setEnabledSensors((prev) =>
            prev.includes(sensor) ? prev.filter((s) => s !== sensor) : [...prev, sensor],
        );
    };

    // Helper rendering content based on active menu
    const renderContent = () => {
        if (activeMenu === 'citizens') {
            return (
                <CitizensListView
                    registeredUsers={registeredUsers}
                    onSelectHousehold={handleSelectUserLocation}
                />
            );
        }

        if (activeMenu === 'triage') {
            return (
                <TriageView
                    registeredUsers={registeredUsers}
                    hotspots={visibleHotspots}
                />
            );
        }

        if (activeMenu === 'facilities') {
            return <FacilitiesView />;
        }

        // Default 'maps'
        return (
            <div className="space-y-6">
                <StatCards
                    stats={stats}
                    isLoading={isLoading}
                    onCategoryClick={handleCategoryCardClick}
                />

                <AdminMapSection
                    center={mapCenter}
                    zoom={mapZoom}
                    selectedProvince={selectedProvince}
                    selectedHotspot={selectedHotspot}
                    onClearSelectedHotspot={() => setSelectedHotspot(null)}
                    visibleHotspots={visibleHotspots}
                    registeredUsers={registeredUsers}
                    selectedUserLocation={selectedUserLocation}
                    onSelectUserLocation={handleSelectUserLocation}
                    selectedProvinces={selectedProvinces}
                    onToggleProvince={handleToggleProvince}
                    selectedConfidenceLevels={selectedConfidenceLevels}
                    onToggleConfidenceLevel={handleToggleConfidenceLevel}
                    onResetFilters={handleResetFilters}
                />

                <section>
                    <WildfirePanel
                        wildfire={wildfire}
                        enabledSensors={enabledSensors}
                        onToggleSensor={handleToggleSensor}
                        onSelectProvince={handleSelectProvinceByName}
                        onSelectHotspot={handleSelectHotspot}
                    />
                </section>
            </div>
        );
    };

    return (
        <>
            <Head title="Admin Dashboard - BorneoCare" />

            <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                <AdminSidebar
                    activeMenu={activeMenu}
                    onMenuChange={setActiveMenu}
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminTopBar
                        onOpenMobile={() => setIsMobileSidebarOpen(true)}
                        title={
                            activeMenu === 'citizens'
                                ? 'Data Warga Terdaftar'
                                : activeMenu === 'triage'
                                  ? 'Antrean Triase Spasial Karhutla'
                                  : activeMenu === 'facilities'
                                    ? 'Fasilitas Kesehatan'
                                    : 'Peta Sebaran Spasial & Titik Api'
                        }
                    />

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                        {renderContent()}
                    </main>
                </div>
            </div>

            {/* Pop-up Detail Kediaman & Status Kerentanan Keluarga */}
            <HouseholdDetailModal
                isOpen={isHouseholdModalOpen}
                onClose={() => setIsHouseholdModalOpen(false)}
                household={selectedUserLocation}
                onFocusMap={(h) => {
                    setMapCenter([h.latitude, h.longitude]);
                    setMapZoom(13);
                    setActiveMenu('maps');
                }}
            />
        </>
    );
}

