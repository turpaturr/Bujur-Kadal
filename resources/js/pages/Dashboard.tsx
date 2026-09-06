import { useEffect, useMemo, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { getEcho } from '@/echo';
import {
    ProvinceFilter,
    Maps,
    StatCards,
    WildfirePanel,
    FamilyMemberModal,
    BookCheckupModal,
    CitizenSidebar,
    type FamilyMemberItem,
    type UserReservationItem,
    type ProvinceItem,
} from '@/pages/Components/Dashboard';
import type { ClinicData } from '@/pages/Components/Dashboard/Maps/markers';
import {
    useWildfireData,
    PROVINCE_CONFIG,
    type HotspotCategory,
    type SensorSource,
    type WildfireHotspot,
    type ConfidenceLevel,
} from '@/hooks/useWildfireData';
import { analyzeUserSafety, type UserLocation } from '@/utils/geoSafety';
import { showReservationNotificationAlert, AppSwal } from '@/utils/alerts';
import { AdminTopBar } from '@/pages/Components/DashboardAdmin';

interface PageProps {
    auth?: {
        user?: {
            id?: number;
            name?: string;
            role?: string;
            home_address?: string | null;
            home_latitude?: number | string | null;
            home_longitude?: number | string | null;
            [key: string]: unknown;
        } | null;
    };
    familyMembers?: FamilyMemberItem[];
    userReservations?: UserReservationItem[];
    unreadReservationsCount?: number;
    [key: string]: unknown;
}

export default function Dashboard() {
    const {
        auth,
        familyMembers,
        userReservations = [],
        unreadReservationsCount = 0,
    } = usePage<PageProps>().props;
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // State Reservasi Medical Checkup & Inbox User
    const [localReservations, setLocalReservations] = useState<UserReservationItem[]>(userReservations);
    const [localUnreadCount, setLocalUnreadCount] = useState<number>(unreadReservationsCount);
    const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
    const [selectedCheckupClinic, setSelectedCheckupClinic] = useState<ClinicData | null>(null);

    useEffect(() => {
        setLocalReservations(userReservations);
        setLocalUnreadCount(unreadReservationsCount);
    }, [userReservations, unreadReservationsCount]);

    // Reverb WebSocket Listener & Real-Time Sync untuk Warga
    useEffect(() => {
        const userId = auth?.user?.id;
        if (!userId) return;

        const echo = getEcho();
        let channel: any = null;

        if (echo) {
            channel = echo.channel(`user-reservations.${userId}`);
            channel.listen(
                '.reservation.updated',
                (data: { reservation: { id: number; status: string; admin_notes?: string } }) => {
                    if (data?.reservation) {
                        setLocalReservations((prev) =>
                            prev.map((r) =>
                                r.id === data.reservation.id
                                    ? {
                                          ...r,
                                          status: data.reservation.status,
                                          admin_notes: data.reservation.admin_notes ?? r.admin_notes,
                                          is_read: false,
                                      }
                                    : r,
                            ),
                        );
                        // Nyalakan badge angka notifikasi baru saat ada aksi terima / tolak dari faskes
                        setLocalUnreadCount((prev) => prev + 1);
                        showReservationNotificationAlert();
                    }
                },
            );

            // Reverb real-time listener untuk update penjemputan evakuasi
            const evacChannel = echo.channel(`user-evacuations.${userId}`);
            evacChannel.listen('.evacuation.updated', (data: { mission: { status: string; safe_zone_name: string } }) => {
                if (data?.mission) {
                    const statusText =
                        data.mission.status === 'waiting_team'
                            ? 'Tim Penjemputan Darurat Sedang Menuju ke Kediaman Anda!'
                            : data.mission.status === 'in_transit'
                                ? 'Tim Telah Tiba di Lokasi & Proses Evakuasi Sedang Berjalan.'
                                : 'Evakuasi Selesai. Anda & Keluarga Telah Tiba di Posko Ruang Oksigen.';

                    AppSwal.fire({
                        title: '🚨 Update Tim Evakuasi',
                        text: `${statusText} (Tujuan: ${data.mission.safe_zone_name})`,
                        icon: data.mission.status === 'completed' ? 'success' : 'info',
                        confirmButtonColor: '#1F6F5F',
                    });
                }
            });
        }

        const interval = setInterval(() => {
            router.reload({ only: ['userReservations', 'unreadReservationsCount'] });
        }, 8000);

        return () => {
            clearInterval(interval);
            if (echo) {
                if (channel) echo.leaveChannel(`user-reservations.${userId}`);
                echo.leaveChannel(`user-evacuations.${userId}`);
            }
        };
    }, [auth?.user?.id]);

    const handleOpenInbox = () => {
        router.visit('/reservations');
    };

    const handleBookCheckup = (clinic: ClinicData) => {
        setSelectedCheckupClinic(clinic);
        setIsBookModalOpen(true);
    };

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

    // Default tampilan peta: Menampilkan keseluruhan Pulau Kalimantan (Borneo) secara penuh sesuai referensi
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [selectedConfidenceLevels, setSelectedConfidenceLevels] = useState<ConfidenceLevel[]>([
        'high',
        'nominal',
        'low',
    ]);
    const [showUserHome, setShowUserHome] = useState<boolean>(true);

    const [isHomeSelected, setIsHomeSelected] = useState<boolean>(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0.35, 114.4]);
    const [mapZoom, setMapZoom] = useState<number>(6);

    const [selectedHotspot, setSelectedHotspot] = useState<WildfireHotspot | null>(null);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | HotspotCategory>('all');

    // Sensor yang diaktifkan; default: VIIRS SNPP + NOAA-20
    const [enabledSensors, setEnabledSensors] = useState<SensorSource[]>([
        'VIIRS_SNPP',
        'VIIRS_NOAA20',
    ]);

    const wildfire = useWildfireData({ enabledSensors, dayRange: 2 });
    const { stats, hotspots, isLoading, lastUpdated, refresh } = wildfire;

    const [syncToast, setSyncToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleSyncSatellite = async () => {
        try {
            const freshHotspots = await refresh(true);
            const timeStr = new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            setSyncToast({
                type: 'success',
                message: `Sinkronisasi satelit NASA FIRMS berhasil! Terdeteksi ${freshHotspots.length.toLocaleString('id-ID')} titik anomali termal (pukul ${timeStr}).`,
            });
            setTimeout(() => {
                setSyncToast((cur) => (cur?.type === 'success' ? null : cur));
            }, 5000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Gagal menyinkronkan data satelit NASA.';
            setSyncToast({
                type: 'error',
                message: msg,
            });
            setTimeout(() => {
                setSyncToast((cur) => (cur?.type === 'error' ? null : cur));
            }, 6000);
        }
    };

    // Filter Titik Api berdasarkan kategori atas, level confidence legenda, dan filter wilayah provinsi
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

            // 3. Filter Multi-Select Wilayah Provinsi dari Legenda / Bar Atas
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

    // 2. Analisis Keamanan Karhutla Spasial di Sekitar Kediaman User (Radius 10km & 25km)
    const userSafety = useMemo(() => {
        return analyzeUserSafety(userLocation, visibleHotspots);
    }, [userLocation, visibleHotspots]);

    // 3. Otomatis fokus/scroll ke peta saat pertama kali membuka dashboard
    useEffect(() => {
        const timer = setTimeout(() => {
            const mapElem = document.getElementById('map-section');
            if (mapElem) {
                mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 350);

        return () => clearTimeout(timer);
    }, []);

    const handleFocusHome = () => {
        if (userLocation) {
            setSelectedProvinces([]);
            setSelectedHotspot(null);
            setIsHomeSelected(true);
            setShowUserHome(true);
            setMapCenter([userLocation.latitude, userLocation.longitude]);
            setMapZoom(11);
            const mapElem = document.getElementById('map-section');
            if (mapElem) {
                mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const handleSelectProvinceFromBar = (province: ProvinceItem | null) => {
        setSelectedHotspot(null);
        setIsHomeSelected(false);
        if (province) {
            setSelectedProvinces([province.name]);
            setMapCenter(province.center);
            setMapZoom(province.zoom);
        } else {
            handleResetView();
        }
    };

    const handleToggleProvince = (provName: string) => {
        setSelectedHotspot(null);
        setIsHomeSelected(false);

        setSelectedProvinces((prev) => {
            const upper = provName.toUpperCase();
            const exists = prev.some((p) => p.toUpperCase() === upper);
            if (exists) {
                const updated = prev.filter((p) => p.toUpperCase() !== upper);
                if (updated.length === 0) {
                    setMapCenter([0.35, 114.4]);
                    setMapZoom(6);
                }
                return updated;
            } else {
                const found = PROVINCE_CONFIG.find(
                    (p) => p.name.toUpperCase() === upper
                );
                if (found) {
                    setMapCenter(found.center);
                    setMapZoom(found.zoom);
                }
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

    const handleToggleUserHome = () => {
        setShowUserHome((prev) => !prev);
    };

    const handleResetAllFilters = () => {
        setSelectedConfidenceLevels(['high', 'nominal', 'low']);
        setSelectedProvinces([]);
        setShowUserHome(true);
        setSelectedHotspot(null);
        setIsHomeSelected(false);
        setActiveCategoryFilter('all');
        setMapCenter([0.35, 114.4]);
        setMapZoom(6);
    };

    const handleSelectHotspot = (hotspot: WildfireHotspot) => {
        setSelectedHotspot(hotspot);
        setIsHomeSelected(false);
        setMapCenter([hotspot.latitude, hotspot.longitude]);
        setMapZoom(12);
        const mapElem = document.getElementById('map-section');
        if (mapElem) {
            mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleFocusNearestHotspot = () => {
        if (userSafety.nearestHotspot?.hotspot) {
            handleSelectHotspot(userSafety.nearestHotspot.hotspot);
        }
    };

    const handleResetView = () => {
        setSelectedProvinces([]);
        setSelectedHotspot(null);
        setIsHomeSelected(false);
        setActiveCategoryFilter('all');
        setMapCenter([0.35, 114.4]);
        setMapZoom(6);
    };

    const handleCategoryCardClick = (category: HotspotCategory) => {
        setActiveCategoryFilter((prev) => (prev === category ? 'all' : category));
        const mapElem = document.getElementById('map-section');
        if (mapElem) {
            mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleToggleSensor = (sensor: SensorSource) => {
        setEnabledSensors((prev) =>
            prev.includes(sensor)
                ? prev.filter((s) => s !== sensor)
                : [...prev, sensor],
        );
    };

    // Helper: string nama provinsi pertama yang aktif untuk kompatibilitas filter bar
    const activeProvinceSingle = selectedProvinces.length === 1 ? selectedProvinces[0] : null;

    return (
        <>
            <Head title="Dashboard Karhutla & Gambut - BorneoCare" />

            <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                <CitizenSidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                    userName={auth?.user?.name ?? 'Warga'}
                    inboxCount={localUnreadCount}
                    onOpenInbox={handleOpenInbox}
                    onResetMap={handleResetAllFilters}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminTopBar
                        onOpenMobile={() => setIsMobileSidebarOpen(true)}
                        title="Dashboard Pemantauan & Evakuasi"
                    />

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                        {/* Floating Toast Notifikasi Status Sinkronisasi Satelit */}
                        {syncToast && (
                            <div
                                className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all duration-300 ${
                                    syncToast.type === 'success'
                                        ? 'bg-emerald-50/95 text-[#1F6F5F] border-emerald-200 shadow-emerald-900/10'
                                        : 'bg-rose-50/95 text-rose-800 border-rose-200 shadow-rose-900/10'
                                }`}
                            >
                                {syncToast.type === 'success' ? (
                                    <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                )}
                                <span>{syncToast.message}</span>
                                <button
                                    type="button"
                                    onClick={() => setSyncToast(null)}
                                    className="ml-2 text-current opacity-60 hover:opacity-100 cursor-pointer"
                                    title="Tutup Notifikasi"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Header Banner & Status Alert Karhutla */}
                        <div className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-xs">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F6F5F]">
                                        Wildfire & Hotspot Tracker Kalimantan
                                    </h1>
                                    <p className="mt-1 text-xs sm:text-sm text-[#262626]/70 max-w-2xl">
                                        Memantau titik anomali suhu tertinggi tanah dan estimasi <strong>Potensi Kebakaran</strong> (Tinggi, Sedang, Rendah) di 5 provinsi Pulau Borneo secara objektif dan valid berbasis sensor satelit NASA.
                                    </p>
                                </div>

                                {/* Status Bahaya & Quick Action dengan Tombol Sinkron Satelit */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                                    <div className="flex flex-col items-end gap-1">
                                        <button
                                            type="button"
                                            onClick={handleSyncSatellite}
                                            disabled={isLoading}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2FA084] text-white hover:bg-[#1F6F5F] active:scale-95 transition-all text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                                            title="Klik untuk menyinkronkan data satelit NASA secara langsung"
                                        >
                                            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>{isLoading ? 'Menyinkronkan...' : 'Sinkron Satelit'}</span>
                                        </button>
                                        {lastUpdated && (
                                            <span className="text-[10px] text-[#262626]/50">
                                                Sinkron: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
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

                        {/* Komponen Peta Interaktif Leaflet Terintegrasi (dengan Stacking Context Terisolasi) */}
                        <section
                            id="map-section"
                            className="relative z-10 isolate overflow-hidden rounded-2xl border border-[#EEEEEE] bg-white p-3 shadow-xs sm:p-4"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
                                <div>
                                    <h2 className="font-display text-base sm:text-lg font-bold text-[#1F6F5F]">
                                        Peta Sebaran Titik Spasial Pulau Borneo
                                    </h2>
                                    <p className="text-[11px] text-[#262626]/60">
                                        {isHomeSelected
                                            ? `Fokus: Kediaman Anda (${userLocation?.name ?? 'Warga'}) & Radius Pantauan 25 km`
                                            : selectedProvinces.length > 0
                                              ? `Filter Wilayah: ${selectedProvinces.join(', ')}`
                                              : 'Cakupan: Seluruh Pulau Kalimantan'} · Klik tanda titik untuk melihat suhu pasti (°C) dan tingkat potensi kebakaran.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    {isHomeSelected && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F]">
                                            <span>Kediaman Anda Aktif</span>
                                        </div>
                                    )}

                                    {selectedProvinces.length > 0 && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F]">
                                            <span>Wilayah ({selectedProvinces.length}): <strong>{selectedProvinces.join(', ')}</strong></span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedProvinces([])}
                                                className="ml-1 hover:underline text-rose-600 cursor-pointer"
                                                title="Tampilkan Seluruh Kalimantan"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {selectedConfidenceLevels.length < 3 && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                            <span>Status: {selectedConfidenceLevels.length} Tingkat</span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedConfidenceLevels(['high', 'nominal', 'low'])}
                                                className="ml-1 hover:underline text-amber-900 cursor-pointer"
                                                title="Tampilkan Semua Tingkat"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {activeCategoryFilter !== 'all' && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F]">
                                            <span>Filter Aktif:</span>
                                            <span>
                                                {activeCategoryFilter === 'active_fire'
                                                    ? '🔴 Potensi Tinggi'
                                                    : activeCategoryFilter === 'smoke_peat'
                                                      ? '🟡 Potensi Sedang'
                                                      : '🟢 Potensi Rendah'}
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
                                            <span>Titik Terpilih: <strong>{((selectedHotspot.brightness || 0) - 273.15).toFixed(1)}°C</strong> · {selectedHotspot.frp.toFixed(1)} MW</span>
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
                                selectedProvinces={selectedProvinces}
                                onToggleProvince={handleToggleProvince}
                                selectedConfidenceLevels={selectedConfidenceLevels}
                                onToggleConfidenceLevel={handleToggleConfidenceLevel}
                                showUserHome={showUserHome}
                                onToggleUserHome={handleToggleUserHome}
                                onResetFilters={handleResetAllFilters}
                                onBookCheckup={handleBookCheckup}
                            />
                        </section>

                    </main>
                </div>

                {/* Modal Reservasi Medical Checkup Faskes */}
                <BookCheckupModal
                    isOpen={isBookModalOpen}
                    onClose={() => setIsBookModalOpen(false)}
                    clinic={selectedCheckupClinic}
                    familyMembers={familyMembers ?? []}
                    defaultPatientName={auth?.user?.name ?? ''}
                />

            </div>
        </>
    );
}
