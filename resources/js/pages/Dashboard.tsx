import { useState } from 'react';
import { Head } from '@inertiajs/react';
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
    type SensorSource,
} from '@/hooks/useWildfireData';

export default function Dashboard() {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0.9619, 114.5548]);
    const [mapZoom, setMapZoom] = useState<number>(6);

    // Sensor yang diaktifkan; defaultnya VIIRS SNPP + NOAA-20
    const [enabledSensors, setEnabledSensors] = useState<SensorSource[]>([
        'VIIRS_SNPP',
        'VIIRS_NOAA20',
    ]);

    const wildfire = useWildfireData({ enabledSensors, dayRange: 1 });

    const handleSelectProvince = (province: ProvinceItem | null) => {
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
        setMapCenter([0.9619, 114.5548]);
        setMapZoom(6);
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
            <Head title="Dashboard - BorneoCare" />

            {/* Layout Utama: Background Clean Whisper (#F1F9FF) & Teks Charcoal (#262626) */}
            <div className="flex min-h-screen flex-col bg-[#F1F9FF] font-sans text-[#262626] antialiased">
                {/* 1. Header & Navigation */}
                <Navbar onReset={handleResetView} />

                {/* 2. Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Peta & Filter Provinsi */}
                    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#CCECEE] bg-white p-4 shadow-xs sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-[#095D7E]">
                                Peta Spasial Pulau Borneo
                            </h1>
                            <p className="mt-0.5 text-xs text-[#262626]/70">
                                Pantau citra satelit NASA dan deteksi titik panas lingkungan secara langsung.
                            </p>
                        </div>

                        {/* Filter Tombol Provinsi */}
                        <ProvinceFilter
                            selectedProvince={selectedProvince}
                            onSelect={handleSelectProvince}
                        />
                    </div>

                    {/* Komponen Peta Leaflet */}
                    <section className="overflow-hidden rounded-2xl border border-[#CCECEE] bg-white p-3 shadow-xs sm:p-4">
                        <Maps
                            key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                            center={mapCenter}
                            zoom={mapZoom}
                            className="h-[460px] w-full rounded-xl border border-[#CCECEE]/70 sm:h-[520px]"
                            wildfireHotspots={wildfire.hotspots}
                        />
                    </section>

                    {/* Wildfire Tracker Panel */}
                    <section>
                        <WildfirePanel
                            wildfire={wildfire}
                            enabledSensors={enabledSensors}
                            onToggleSensor={handleToggleSensor}
                        />
                    </section>

                    {/* Kartu Ringkasan Metrik */}
                    <section>
                        <StatCards
                            hotspotsCount={wildfire.stats.total}
                            isLoadingHotspots={wildfire.isLoading}
                        />
                    </section>
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}
