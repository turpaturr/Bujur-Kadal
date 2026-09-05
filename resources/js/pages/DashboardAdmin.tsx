import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    AdminMapSection,
    StatCards,
    WildfirePanel,
    AdminSidebar,
    AdminTopBar,
    CitizensListView,
    TriageView,
    type ProvinceItem,
} from '@/pages/Components/DashboardAdmin';
import type { AdminMenuType } from '@/pages/Components/DashboardAdmin/AdminSidebar';
import {
    useWildfireData,
    PROVINCE_CONFIG,
    type SensorSource,
    type WildfireHotspot,
    type ConfidenceLevel,
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

    // Sensor yang diaktifkan; default: VIIRS SNPP + NOAA-20
    const [enabledSensors, setEnabledSensors] = useState<SensorSource[]>([
        'VIIRS_SNPP',
        'VIIRS_NOAA20',
    ]);
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [selectedConfidenceLevels, setSelectedConfidenceLevels] = useState<
        ConfidenceLevel[]
    >(['high', 'nominal', 'low']);

    const wildfire = useWildfireData({ enabledSensors, dayRange: 1 });
    const { stats, hotspots, isLoading, lastUpdated, refresh } = wildfire;

    const visibleHotspots = hotspots.filter((hotspot) => {
        if (activeCategoryFilter !== 'all' && hotspot.category !== activeCategoryFilter) {
            return false;
        }
        if (!selectedConfidenceLevels.includes(hotspot.confidenceLevel)) {
            return false;
        }
        if (selectedProvinces.length > 0) {
            const hotspotProv = (hotspot.province || '').toUpperCase();
            const matched = selectedProvinces.some((p) => {
                const pName = p.toUpperCase();
                return hotspotProv.includes(pName) || pName.includes(hotspotProv);
            });
            if (!matched) return false;
        }
        return true;
    });

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
            setSelectedHotspot(null);
            setMapCenter([household.latitude, household.longitude]);
            setMapZoom(13);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleResetView = () => {
        setSelectedProvince(null);
        setSelectedHotspot(null);
        setSelectedUserLocation(null);
        setMapCenter([0.9619, 114.5548]);
        setMapZoom(6);
    };

    const handleToggleSensor = (sensor: SensorSource) => {
        setEnabledSensors((prev) =>
            prev.includes(sensor) ? prev.filter((s) => s !== sensor) : [...prev, sensor],
        );
    };

    // Helper rendering content based on active menu
    const renderContent = () => {
        if (activeMenu === 'citizens') {
            return <CitizensListView registeredUsers={registeredUsers} />;
        }
        
        if (activeMenu === 'triage') {
            return <TriageView registeredUsers={registeredUsers} hotspots={visibleHotspots} />;
        }
        
        if (activeMenu === 'facilities') {
            return (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-[#EEEEEE]">
                    <p className="text-gray-500 font-medium">Modul Manajemen Faskes akan segera hadir.</p>
                </div>
            );
        }

        // Default 'maps'
        return (
            <div className="space-y-6">
                <StatCards
                    stats={stats}
                    isLoading={isLoading}
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

    const handleToggleProvinceMap = (provName: string) => {
        setSelectedHotspot(null);
        setSelectedProvinces((prev) => {
            const upper = provName.toUpperCase();
            const exists = prev.some((p) => p.toUpperCase() === upper);
            if (exists) {
                const updated = prev.filter((p) => p.toUpperCase() !== upper);
                if (updated.length === 0) {
                    setMapCenter([0.9619, 114.5548]);
                    setMapZoom(6);
                }
                return updated;
            } else {
                return [...prev, provName];
            }
        });
    };

    const handleToggleConfidenceLevel = (level: ConfidenceLevel) => {
        setSelectedConfidenceLevels((prev) => {
            if (prev.includes(level)) {
                const next = prev.filter((l) => l !== level);
                return next.length === 0 ? ['high', 'nominal', 'low'] : next;
            } else {
                return [...prev, level];
            }
        });
    };

    const handleResetAllFiltersMap = () => {
        setSelectedProvinces([]);
        setSelectedConfidenceLevels(['high', 'nominal', 'low']);
        handleResetView();
    };

    return (
        <>
            <Head title="Admin Command Center - BorneoCare" />
            
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
                        title="BorneoCare Admin"
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
                        registeredUsers={registeredUsers}
                        selectedUserLocation={selectedUserLocation}
                        onSelectUserLocation={handleSelectUserLocation}
                        selectedProvinces={selectedProvinces}
                        onToggleProvince={handleToggleProvinceMap}
                        selectedConfidenceLevels={selectedConfidenceLevels}
                        onToggleConfidenceLevel={handleToggleConfidenceLevel}
                        onResetFilters={handleResetAllFiltersMap}
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
                    </main>
                </div>
            </div>
        </>
    );
}

