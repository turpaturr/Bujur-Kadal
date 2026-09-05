import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { cn } from '@/lib/utils';
import type { ConfidenceLevel } from '@/hooks/useWildfireData';
import { KALIMANTAN_GEOJSON } from '@/data/kalimantanProvinces';

// Impor sub-komponen, konstanta, tipe, dan pembuat marker modular
import {
    NASA_API_KEY,
    KALIMANTAN_BOUNDS,
    PROVINCE_COLORS,
    createHotspotMarker,
    createUserHomeLayers,
    createRegisteredUserMarker,
    createClinicMarker,
    MapHud,
    MapLegend,
    type MapsProps,
    type RegisteredUserLocation,
    type RegisteredFamilyMember,
} from './Maps/index';
import { KALIMANTAN_CLINICS } from '@/data/kalimantanClinics';

// Re-export untuk backward-compatibility konsumen
export {
    NASA_API_KEY,
    KALIMANTAN_BOUNDS,
    PROVINCE_COLORS,
    type MapsProps,
    type RegisteredUserLocation,
    type RegisteredFamilyMember,
};

export function Maps({
    center = [0.35, 114.4],
    zoom = 6,
    className,
    apiKey = NASA_API_KEY,
    wildfireHotspots = [],
    selectedHotspot = null,
    onHotspotSelect,
    userLocation = null,
    userSafety = null,
    onFocusHome,
    selectedProvinces = [],
    onToggleProvince,
    selectedConfidenceLevels = ['high', 'nominal', 'low'],
    onToggleConfidenceLevel,
    showUserHome = true,
    onToggleUserHome,
    onResetFilters,
    registeredUsers = [],
    selectedUserLocation = null,
    onSelectUserLocation,
    showRegisteredUsers,
    onToggleRegisteredUsers,
    showClinics,
    onToggleClinics,
}: MapsProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const hotspotLayerRef = useRef<L.LayerGroup | null>(null);
    const userLayerRef = useRef<L.LayerGroup | null>(null);
    const registeredUsersLayerRef = useRef<L.LayerGroup | null>(null);
    const clinicsLayerRef = useRef<L.LayerGroup | null>(null);
    const provinceLayerRef = useRef<L.GeoJSON | null>(null);

    const [activeBasemap, setActiveBasemap] = useState<'osm' | 'nasa'>('osm');
    const [localShowRegisteredUsers, setLocalShowRegisteredUsers] = useState<boolean>(true);
    const shouldShowRegisteredUsers =
        showRegisteredUsers !== undefined ? showRegisteredUsers : localShowRegisteredUsers;

    const [localShowClinics, setLocalShowClinics] = useState<boolean>(true);
    const shouldShowClinics =
        showClinics !== undefined ? showClinics : localShowClinics;

    const handleToggleClinics = () => {
        if (onToggleClinics) {
            onToggleClinics();
        } else {
            setLocalShowClinics((prev) => !prev);
        }
    };

    const osmLayerRef = useRef<L.TileLayer | null>(null);
    const nasaLayerRef = useRef<L.TileLayer | null>(null);

    // Hitung jumlah keluarga rentan
    const vulnerableHouseholdsCount = useMemo(() => {
        return registeredUsers.filter((u) => u.is_vulnerable).length;
    }, [registeredUsers]);

    // Hitung jumlah titik api per level confidence
    const countsByLevel = useMemo(() => {
        const counts: Record<ConfidenceLevel, number> = { high: 0, nominal: 0, low: 0 };
        for (const h of wildfireHotspots) {
            if (counts[h.confidenceLevel] !== undefined) {
                counts[h.confidenceLevel]++;
            }
        }
        return counts;
    }, [wildfireHotspots]);

    // Hitung jumlah titik api per provinsi
    const countsByProvince = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const h of wildfireHotspots) {
            const p = (h.province || 'Kalimantan').toUpperCase();
            counts[p] = (counts[p] || 0) + 1;
        }
        return counts;
    }, [wildfireHotspots]);

    // 1. Inisialisasi Peta Leaflet (hanya sekali)
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }

        const map = L.map(mapContainerRef.current, {
            center,
            zoom,
            minZoom: 5,
            maxZoom: 18,
            maxBounds: KALIMANTAN_BOUNDS,
            maxBoundsViscosity: 0.5,
            worldCopyJump: false,
            zoomControl: false,
            preferCanvas: true,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        if (!map.getPane('provincesPane')) {
            const pane = map.createPane('provincesPane');
            pane.style.zIndex = '350';
        }

        // Base Layer 1: OpenStreetMap
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 5,
            maxZoom: 18,
            noWrap: true,
            attribution: '&copy; OpenStreetMap contributors',
        });
        osmLayer.addTo(map);
        osmLayerRef.current = osmLayer;

        // Base Layer 2: Citra Satelit Resolusi Tinggi (Esri World Imagery) - Mulus Tanpa Garis Hitam, Detail Hingga Zoom 18
        const satelliteLayer = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                minZoom: 5,
                maxZoom: 18,
                noWrap: true,
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
            },
        );
        nasaLayerRef.current = satelliteLayer;

        // Layer Groups
        const hotspotLayer = L.layerGroup().addTo(map);
        hotspotLayerRef.current = hotspotLayer;

        const userLayer = L.layerGroup().addTo(map);
        userLayerRef.current = userLayer;

        const registeredUsersLayer = L.layerGroup().addTo(map);
        registeredUsersLayerRef.current = registeredUsersLayer;

        const clinicsLayer = L.layerGroup().addTo(map);
        clinicsLayerRef.current = clinicsLayer;

        const resizeTimeout = setTimeout(() => {
            map.invalidateSize();
        }, 150);

        mapInstanceRef.current = map;

        return () => {
            clearTimeout(resizeTimeout);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                hotspotLayerRef.current = null;
                userLayerRef.current = null;
                registeredUsersLayerRef.current = null;
                clinicsLayerRef.current = null;
                provinceLayerRef.current = null;
            }
        };
    }, []);

    // 2. Smooth Pan / FlyTo ketika center atau zoom berubah
    useEffect(() => {
        mapInstanceRef.current?.flyTo(center, zoom, {
            duration: 1.0,
            easeLinearity: 0.25,
        });
    }, [center, zoom]);

    // 3. Switch Basemap (OSM vs NASA GIBS)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !osmLayerRef.current || !nasaLayerRef.current) {
            return;
        }

        if (activeBasemap === 'nasa') {
            if (map.hasLayer(osmLayerRef.current)) map.removeLayer(osmLayerRef.current);
            if (!map.hasLayer(nasaLayerRef.current)) nasaLayerRef.current.addTo(map);
        } else {
            if (map.hasLayer(nasaLayerRef.current)) map.removeLayer(nasaLayerRef.current);
            if (!map.hasLayer(osmLayerRef.current)) osmLayerRef.current.addTo(map);
        }
    }, [activeBasemap]);

    // 4. Batas & Highlight 5 Wilayah Provinsi Kalimantan (GeoJSON)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        if (provinceLayerRef.current) {
            map.removeLayer(provinceLayerRef.current);
            provinceLayerRef.current = null;
        }

        const hasFilter = selectedProvinces.length > 0;

        const geoLayer = L.geoJSON(KALIMANTAN_GEOJSON as any, {
            pane: 'provincesPane',
            style: (feature) => {
                const rawName = (feature?.properties?.name || '').toUpperCase();
                const colorConfig = PROVINCE_COLORS[rawName] || {
                    stroke: '#2FA084',
                    fill: '#2FA084',
                    label: rawName,
                    name: rawName,
                };

                const isSelected = selectedProvinces.some(
                    (p) => rawName.includes(p.toUpperCase()) || p.toUpperCase().includes(rawName),
                );

                if (isSelected) {
                    return {
                        color: colorConfig.stroke,
                        weight: 3.5,
                        opacity: 1,
                        fillColor: colorConfig.fill,
                        fillOpacity: 0.35,
                    };
                }

                if (hasFilter) {
                    return {
                        color: colorConfig.stroke,
                        weight: 1,
                        opacity: 0.25,
                        fillColor: colorConfig.fill,
                        fillOpacity: 0.02,
                        dashArray: '3, 4',
                    };
                }

                return {
                    color: colorConfig.stroke,
                    weight: 1.8,
                    opacity: 0.8,
                    fillColor: colorConfig.fill,
                    fillOpacity: 0.10,
                };
            },
            onEachFeature: (feature, layer) => {
                const rawName = (feature?.properties?.name || '').toUpperCase();
                const displayName = PROVINCE_COLORS[rawName]?.name || feature?.properties?.name || '';

                layer.bindTooltip(
                    `<div style="font-family: 'Figtree', sans-serif; font-size: 11px; font-weight: 700; color: #1F6F5F;">
                        Wilayah: ${displayName} <span style="font-size: 9px; color: #666;">(Klik utk filter)</span>
                    </div>`,
                    { sticky: true, direction: 'top' },
                );

                layer.on('click', () => onToggleProvince?.(displayName));
            },
        });

        geoLayer.addTo(map);
        provinceLayerRef.current = geoLayer;
    }, [selectedProvinces, onToggleProvince]);

    // 5. Render Titik Api (CircleMarker)
    useEffect(() => {
        const layer = hotspotLayerRef.current;
        if (!layer) return;

        layer.clearLayers();

        const filtered = wildfireHotspots.filter((h) =>
            selectedConfidenceLevels.includes(h.confidenceLevel),
        );

        for (const hotspot of filtered) {
            const marker = createHotspotMarker(hotspot, (e) => {
                const map = mapInstanceRef.current;
                if (map) {
                    const pt = map.latLngToContainerPoint(e.latlng);
                    if (pt.y < 300) {
                        map.panBy([0, pt.y - 320], { animate: true, duration: 0.25 });
                    }
                }
                onHotspotSelect?.(hotspot);
            });
            layer.addLayer(marker);
        }
    }, [wildfireHotspots, selectedConfidenceLevels, onHotspotSelect]);

    // 6. FlyTo jika hotspot spesifik dipilih dari list
    useEffect(() => {
        if (!mapInstanceRef.current || !selectedHotspot) return;
        mapInstanceRef.current.flyTo([selectedHotspot.latitude, selectedHotspot.longitude], 11, {
            duration: 1.2,
        });
    }, [selectedHotspot]);

    // 7. Render Kediaman Pribadi Pengguna & Radius Aman
    useEffect(() => {
        const layer = userLayerRef.current;
        if (!layer) return;

        layer.clearLayers();

        if (
            !showUserHome ||
            !userLocation ||
            userLocation.latitude === null ||
            userLocation.latitude === undefined ||
            isNaN(Number(userLocation.latitude)) ||
            isNaN(Number(userLocation.longitude))
        ) {
            return;
        }

        const { homeMarker, circle25km, circle10km } = createUserHomeLayers(
            userLocation,
            userSafety,
        );

        layer.addLayer(circle25km);
        layer.addLayer(circle10km);
        layer.addLayer(homeMarker);
    }, [userLocation, userSafety, showUserHome]);

    // 8. Render Seluruh Titik Lokasi Warga Terdaftar (Khusus Otoritas / Admin)
    useEffect(() => {
        const layer = registeredUsersLayerRef.current;
        if (!layer) return;

        layer.clearLayers();

        if (!shouldShowRegisteredUsers || !registeredUsers || registeredUsers.length === 0) {
            return;
        }

        for (const household of registeredUsers) {
            if (
                household.latitude === null ||
                household.latitude === undefined ||
                isNaN(Number(household.latitude)) ||
                isNaN(Number(household.longitude))
            ) {
                continue;
            }

            const marker = createRegisteredUserMarker(household, onSelectUserLocation);
            layer.addLayer(marker);
        }
    }, [registeredUsers, shouldShowRegisteredUsers, onSelectUserLocation]);

    // 9. FlyTo jika lokasi warga tertentu dipilih dari list admin (hanya jika jarak > 0.05 agar popup tidak tertutup)
    useEffect(() => {
        if (!mapInstanceRef.current || !selectedUserLocation) return;
        const curCenter = mapInstanceRef.current.getCenter();
        const dist =
            Math.abs(curCenter.lat - Number(selectedUserLocation.latitude)) +
            Math.abs(curCenter.lng - Number(selectedUserLocation.longitude));
        if (dist > 0.05) {
            mapInstanceRef.current.flyTo(
                [selectedUserLocation.latitude, selectedUserLocation.longitude],
                13,
                { duration: 1.0 },
            );
        }
    }, [selectedUserLocation]);

    // 10. Render Seluruh Fasilitas Kesehatan / Klinik Kalimantan (1.848 Faskes)
    useEffect(() => {
        const layer = clinicsLayerRef.current;
        if (!layer) return;

        layer.clearLayers();

        if (!shouldShowClinics) {
            return;
        }

        for (const clinic of KALIMANTAN_CLINICS) {
            const marker = createClinicMarker(clinic);
            layer.addLayer(marker);
        }
    }, [shouldShowClinics]);

    const handleToggleRegisteredUsers = () => {
        if (onToggleRegisteredUsers) {
            onToggleRegisteredUsers();
        } else {
            setLocalShowRegisteredUsers((prev) => !prev);
        }
    };

    return (
        <div className="relative w-full">
            {/* Top Bar HUD Control */}
            <MapHud
                activeBasemap={activeBasemap}
                onBasemapChange={setActiveBasemap}
                userLocation={userLocation}
                userSafety={userSafety}
                onFocusHome={onFocusHome}
                registeredUsersCount={registeredUsers.length}
                shouldShowRegisteredUsers={shouldShowRegisteredUsers}
                onToggleRegisteredUsers={
                    registeredUsers.length > 0 ? handleToggleRegisteredUsers : undefined
                }
                hotspotsCount={wildfireHotspots.length}
            />

            {/* Container Canvas Leaflet */}
            <div
                ref={mapContainerRef}
                className={cn(
                    'w-full rounded-xl overflow-hidden border border-[#EEEEEE] shadow-inner bg-[#e5e3df]',
                    className ?? 'h-[500px]',
                )}
            />

            {/* Bottom-Left Legend & Interactive Filters */}
            <MapLegend
                countsByLevel={countsByLevel}
                selectedConfidenceLevels={selectedConfidenceLevels}
                onToggleConfidenceLevel={onToggleConfidenceLevel}
                selectedProvinces={selectedProvinces}
                onToggleProvince={onToggleProvince}
                countsByProvince={countsByProvince}
                showUserHome={showUserHome}
                userLocation={userLocation}
                onToggleUserHome={onToggleUserHome}
                registeredUsersCount={registeredUsers.length}
                vulnerableHouseholdsCount={vulnerableHouseholdsCount}
                shouldShowRegisteredUsers={shouldShowRegisteredUsers}
                onToggleRegisteredUsers={
                    registeredUsers.length > 0 ? handleToggleRegisteredUsers : undefined
                }
                onResetFilters={onResetFilters}
                showClinics={shouldShowClinics}
                onToggleClinics={handleToggleClinics}
                clinicsCount={KALIMANTAN_CLINICS.length}
            />
        </div>
    );
}

export default Maps;
