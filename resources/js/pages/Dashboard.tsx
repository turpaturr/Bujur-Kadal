import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    Navbar,
    ProvinceFilter,
    Maps,
    StatCards,
    Footer,
    type ProvinceItem,
} from '@/pages/Components/Dashboard';

export default function Dashboard() {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0.9619, 114.5548]);
    const [mapZoom, setMapZoom] = useState<number>(6);

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

    return (
        <>
            <Head title="Dashboard - BorneoCare" />

            {/* Layout Utama: Background Clean Whisper (#F1F9FF) & Teks Charcoal (#262626) */}
            <div className="min-h-screen bg-[#F1F9FF] text-[#262626] font-sans flex flex-col antialiased">
                {/* 1. Header & Navigation */}
                <Navbar onReset={handleResetView} />

                {/* 2. Main Content */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
                    {/* Header Peta & Filter Provinsi */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#CCECEE] shadow-xs">
                        <div>
                            <h1 className="text-lg font-bold text-[#095D7E] tracking-tight">
                                Peta Spasial Pulau Borneo
                            </h1>
                            <p className="text-xs text-[#262626]/70 mt-0.5">
                                Pantau citra satelit NASA dan deteksi titik panas lingkungan secara langsung.
                            </p>
                        </div>

                        {/* Filter Tombol Provinsi */}
                        <ProvinceFilter
                            selectedProvince={selectedProvince}
                            onSelect={handleSelectProvince}
                        />
                    </div>

                    {/* Komponen Peta Leaflet (Posisi di Atas) */}
                    <section className="bg-white rounded-2xl border border-[#CCECEE] shadow-xs p-3 sm:p-4 overflow-hidden">
                        <Maps
                            key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                            center={mapCenter}
                            zoom={mapZoom}
                            className="h-[460px] sm:h-[520px] w-full rounded-xl border border-[#CCECEE]/70"
                        />
                    </section>

                    {/* Kartu Ringkasan Metrik (Simple & Bersih) */}
                    <section>
                        <StatCards />
                    </section>
                </main>

                {/* 3. Footer */}
                <Footer />
            </div>
        </>
    );
}
