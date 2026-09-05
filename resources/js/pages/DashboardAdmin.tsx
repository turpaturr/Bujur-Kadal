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
} from '@/pages/Components/DashboardAdmin';
import type { AdminMenuType } from '@/pages/Components/DashboardAdmin/AdminSidebar';
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

    const [enabledSensors, setEnabledSensors] = useState<SensorSource[]>([
        'VIIRS_SNPP',
        'VIIRS_NOAA20',
    ]);

    const wildfire = useWildfireData({ enabledSensors, dayRange: 1 });
    const { stats, hotspots, isLoading, refresh } = wildfire;
    const visibleHotspots = hotspots;

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
        </>
    );
}

