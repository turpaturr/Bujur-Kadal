import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

import { cn } from '@/lib/utils';
import type {
    ConfidenceLevel,
    WildfireHotspot,
} from '@/hooks/useWildfireData';
import type { UserLocation, UserSafetyAnalysis } from '@/utils/geoSafety';
import { KALIMANTAN_GEOJSON } from '@/data/kalimantanProvinces';

// Setup icon default Leaflet untuk bundler Vite
const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export const NASA_API_KEY: string =
    (import.meta.env.NASA_API_KEY as string | undefined) ??
    (import.meta.env.VITE_NASA_API_KEY as string | undefined) ??
    '';

// Batas wilayah koordinat Pulau Kalimantan (Borneo)
export const KALIMANTAN_BOUNDS: L.LatLngBoundsExpression = [
    [-5.5, 107.0], // Barat Daya (Batas Selatan Kalsel / Laut Jawa / Selat Karimata)
    [7.8, 121.0],  // Timur Laut (Batas Utara Kaltara-Sabah / Laut Sulu / Selat Makassar)
];

/** Warna pembeda khas untuk setiap 5 provinsi di Kalimantan */
export const PROVINCE_COLORS: Record<
    string,
    { stroke: string; fill: string; label: string; name: string }
> = {
    'KALIMANTAN BARAT': {
        stroke: '#2563EB',
        fill: '#3B82F6',
        label: 'Kalbar',
        name: 'Kalimantan Barat',
    },
    'KALIMANTAN TENGAH': {
        stroke: '#059669',
        fill: '#10B981',
        label: 'Kalteng',
        name: 'Kalimantan Tengah',
    },
    'KALIMANTAN SELATAN': {
        stroke: '#7C3AED',
        fill: '#8B5CF6',
        label: 'Kalsel',
        name: 'Kalimantan Selatan',
    },
    'KALIMANTAN TIMUR': {
        stroke: '#D97706',
        fill: '#F59E0B',
        label: 'Kaltim',
        name: 'Kalimantan Timur',
    },
    'KALIMANTAN UTARA': {
        stroke: '#0891B2',
        fill: '#06B6D4',
        label: 'Kaltara',
        name: 'Kalimantan Utara',
    },
};

/**
 * Palet Warna Indikator Situasi Karhutla & Asap Baru Sesuai Permintaan:
 * - Rendah = Hijau Tua (#15803D)
 * - Sedang = Kuning Pekat (#E5A910)
 * - Tinggi = Merah Pekat (#B91C1C)
 */
export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
    high: '#B91C1C',    // Merah Pekat (Bahaya Karhutla Nyata)
    nominal: '#E5A910', // Kuning Pekat (Waspada Asap & Bara Gambut)
    low: '#15803D',     // Hijau Tua (Rendah & Relatif Aman)
};

export const CONFIDENCE_FILL_OPACITY: Record<ConfidenceLevel, number> = {
    high: 0.90,
    nominal: 0.75,
    low: 0.65,
};

/** Panduan Penjelasan Informatif untuk Orang Awam */
export const CONFIDENCE_DESCRIPTIONS: Record<
    ConfidenceLevel,
    { title: string; subtitle: string; desc: string; advice: string }
> = {
    high: {
        title: 'Tinggi (Merah Pekat)',
        subtitle: 'Bahaya Karhutla Aktif',
        desc: 'Kobaran api terbuka terdeteksi bersuhu tinggi & intensitas radiasi panas kuat. Sangat berisiko menghasilkan asap tebal beracun.',
        advice: 'Tutup rapat pintu & jendela. Gunakan masker N95 jika terpaksa keluar, atau segera lakukan evakuasi jika dekat permukiman.',
    },
    nominal: {
        title: 'Sedang (Kuning Pekat)',
        subtitle: 'Waspada Asap & Bara Gambut',
        desc: 'Terdeteksi anomali panas sedang atau bara pembakaran bawah tanah (gambut). Berpotensi memicu kabut asap tipis hingga sedang.',
        advice: 'Kelompok rentan (balita, ibu hamil, lansia, penderita asma) disarankan memakai masker dan membatasi aktivitas di luar.',
    },
    low: {
        title: 'Rendah (Hijau Tua)',
        subtitle: 'Kondisi Aman / Terkendali',
        desc: 'Titik panas bersuhu rendah atau anomali termal ringan permukaan. Tidak terindikasi adanya kobaran api membahayakan.',
        advice: 'Udara dan lingkungan relatif aman. Aktivitas luar ruangan warga dapat dilakukan secara normal.',
    },
};

function formatTime(acqTime: string): string {
    if (!acqTime || acqTime.length < 3) {
        return acqTime || '-';
    }
    const padded = acqTime.padStart(4, '0');
    return `${padded.slice(0, 2)}:${padded.slice(2)} UTC`;
}

function buildPopupHtml(hotspot: WildfireHotspot): string {
    const info = CONFIDENCE_DESCRIPTIONS[hotspot.confidenceLevel];
    const color = CONFIDENCE_COLORS[hotspot.confidenceLevel];

    return `
        <div style="font-family: 'Figtree', sans-serif; font-size: 12px; min-width: 240px; line-height: 1.4; color: #262626;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 5px; font-weight: 800; color: ${color}; font-size: 13px;">
                    <span>🔥 Titik Api Terpantau</span>
                </div>
                <span style="font-size: 10px; font-weight: 800; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}40;">
                    ${info.title}
                </span>
            </div>

            <div style="background: #FAFAFA; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; border-left: 3px solid ${color}; font-size: 11px;">
                <div style="font-weight: 700; color: #1F6F5F; margin-bottom: 2px;">${info.subtitle}</div>
                <div style="color: #555; line-height: 1.3;">${info.desc}</div>
                <div style="margin-top: 4px; font-weight: 600; color: ${color}; font-size: 10px;">💡 ${info.advice}</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <tr>
                    <td style="color: #666; padding: 2px 0;">Koordinat:</td>
                    <td style="font-weight: 600; text-align: right; font-family: monospace;">${hotspot.latitude.toFixed(4)}°, ${hotspot.longitude.toFixed(4)}°</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Provinsi:</td>
                    <td style="font-weight: 600; text-align: right; color: #1F6F5F;">${hotspot.province ?? 'Kalimantan'}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Energi Radiasi (FRP):</td>
                    <td style="font-weight: 700; text-align: right; color: #d97706;">${hotspot.frp > 0 ? hotspot.frp.toFixed(1) + ' MW' : '-'}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Waktu Satelit:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.acquisitionDate} (${formatTime(hotspot.acquisitionTime)})</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Sensor Satelit:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.satellite} · ${hotspot.source.replace('_NRT', '')}</td>
                </tr>
            </table>
        </div>
    `;
}

export interface MapsProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    apiKey?: string;
    wildfireHotspots?: WildfireHotspot[];
    selectedHotspot?: WildfireHotspot | null;
    onHotspotSelect?: (hotspot: WildfireHotspot | null) => void;
    userLocation?: UserLocation | null;
    userSafety?: UserSafetyAnalysis | null;
    onFocusHome?: () => void;
    // Filter Provinsi (Multi-Select)
    selectedProvinces?: string[];
    onToggleProvince?: (provinceName: string) => void;
    // Filter Level Confidence (Multi-Select)
    selectedConfidenceLevels?: ConfidenceLevel[];
    onToggleConfidenceLevel?: (level: ConfidenceLevel) => void;
    // Toggle Layer Rumah Warga
    showUserHome?: boolean;
    onToggleUserHome?: () => void;
    // Reset Filter
    onResetFilters?: () => void;
}

export function Maps({
    center = [0.35, 114.4],
    zoom = 6,
    className,
    apiKey = NASA_API_KEY,
    wildfireHotspots = [],
    selectedHotspot = null,
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
}: MapsProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const hotspotLayerRef = useRef<L.LayerGroup | null>(null);
    const userLayerRef = useRef<L.LayerGroup | null>(null);
    const provinceLayerRef = useRef<L.GeoJSON | null>(null);
    const [activeBasemap, setActiveBasemap] = useState<'osm' | 'nasa'>('osm');
    const [showInfoGuide, setShowInfoGuide] = useState<boolean>(false);
    const osmLayerRef = useRef<L.TileLayer | null>(null);
    const nasaLayerRef = useRef<L.TileLayer | null>(null);

    // Hitung jumlah titik api per level confidence untuk ditampilkan di legenda
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
        if (!mapContainerRef.current) {
            return;
        }

        if (mapInstanceRef.current) {
            return;
        }

        // Buat map instance dengan batas pulau Kalimantan & preferCanvas untuk akselerasi performa
        const map = L.map(mapContainerRef.current, {
            center,
            zoom,
            minZoom: 5,
            maxZoom: 18,
            maxBounds: KALIMANTAN_BOUNDS,
            maxBoundsViscosity: 1.0,
            worldCopyJump: false,
            zoomControl: false,
            preferCanvas: true,
        });

        // Kontrol Zoom di pojok kanan bawah
        L.control
            .zoom({
                position: 'bottomright',
            })
            .addTo(map);

        // Buat custom pane untuk polygon provinsi dengan zIndex 350 (di bawah marker & radius)
        if (!map.getPane('provincesPane')) {
            const pane = map.createPane('provincesPane');
            pane.style.zIndex = '350';
        }

        // Base Layer 1: OpenStreetMap Carto
        const osmLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                minZoom: 5,
                maxZoom: 18,
                noWrap: true,
                attribution: '&copy; OpenStreetMap contributors',
            },
        );
        osmLayer.addTo(map);
        osmLayerRef.current = osmLayer;

        // Base Layer 2: NASA GIBS True Color
        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const gibsDate = yesterday.toISOString().split('T')[0];

        const nasaLayer = L.tileLayer(
            `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
            {
                minZoom: 5,
                maxZoom: 9,
                noWrap: true,
                attribution: 'NASA EOSDIS GIBS',
            },
        );
        nasaLayerRef.current = nasaLayer;

        // Layer group titik api
        const hotspotLayer = L.layerGroup();
        hotspotLayer.addTo(map);
        hotspotLayerRef.current = hotspotLayer;

        // Layer group posisi & radius rumah warga
        const userLayer = L.layerGroup();
        userLayer.addTo(map);
        userLayerRef.current = userLayer;

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
                provinceLayerRef.current = null;
            }
        };
    }, []);

    // 2. Smooth Pan / FlyTo ketika center atau zoom berubah (tanpa re-create map)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) {
            return;
        }
        map.flyTo(center, zoom, {
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
            if (map.hasLayer(osmLayerRef.current)) {
                map.removeLayer(osmLayerRef.current);
            }
            if (!map.hasLayer(nasaLayerRef.current)) {
                nasaLayerRef.current.addTo(map);
            }
        } else {
            if (map.hasLayer(nasaLayerRef.current)) {
                map.removeLayer(nasaLayerRef.current);
            }
            if (!map.hasLayer(osmLayerRef.current)) {
                osmLayerRef.current.addTo(map);
            }
        }
    }, [activeBasemap]);

    // 4. Highlight & Batas Wilayah 5 Provinsi Kalimantan (GeoJSON Multi-Select)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) {
            return;
        }

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
                    (p) =>
                        rawName.includes(p.toUpperCase()) ||
                        p.toUpperCase().includes(rawName),
                );

                if (isSelected) {
                    // Provinsi yang aktif difilter: Highlight tebal & tegas
                    return {
                        color: colorConfig.stroke,
                        weight: 3.5,
                        opacity: 1,
                        fillColor: colorConfig.fill,
                        fillOpacity: 0.35,
                        dashArray: '',
                    };
                }

                if (hasFilter) {
                    // Provinsi lain yang tidak dipilih: Redupkan halus
                    return {
                        color: colorConfig.stroke,
                        weight: 1,
                        opacity: 0.25,
                        fillColor: colorConfig.fill,
                        fillOpacity: 0.02,
                        dashArray: '3, 4',
                    };
                }

                // Default: Seluruh provinsi tampil dengan warna lembut
                return {
                    color: colorConfig.stroke,
                    weight: 1.8,
                    opacity: 0.8,
                    fillColor: colorConfig.fill,
                    fillOpacity: 0.10,
                    dashArray: '',
                };
            },
            onEachFeature: (feature, layer) => {
                const rawName = (feature?.properties?.name || '').toUpperCase();
                const colorConfig = PROVINCE_COLORS[rawName];
                const displayName = colorConfig?.name || feature?.properties?.name || '';

                layer.bindTooltip(
                    `<div style="font-family: 'Figtree', sans-serif; font-size: 11px; font-weight: 700; color: #1F6F5F;">
                        Wilayah: ${displayName} <span style="font-size: 9px; color: #666;">(Klik utk filter)</span>
                    </div>`,
                    {
                        sticky: true,
                        direction: 'top',
                    },
                );

                layer.on('click', () => {
                    if (onToggleProvince) {
                        onToggleProvince(displayName);
                    }
                });
            },
        });

        geoLayer.addTo(map);
        provinceLayerRef.current = geoLayer;
    }, [selectedProvinces, onToggleProvince]);

    // 5. Render Titik Api (CircleMarker) dengan Palet Warna Baru: Merah Pekat, Kuning Pekat, Hijau Tua
    useEffect(() => {
        const layer = hotspotLayerRef.current;
        if (!layer) {
            return;
        }

        layer.clearLayers();

        // Saring titik api sesuai multi-select confidence level yang aktif di legenda
        const filtered = wildfireHotspots.filter((h) =>
            selectedConfidenceLevels.includes(h.confidenceLevel),
        );

        for (const hotspot of filtered) {
            const color = CONFIDENCE_COLORS[hotspot.confidenceLevel];
            const fillOpacity = CONFIDENCE_FILL_OPACITY[hotspot.confidenceLevel];

            // Ukuran proporsional dengan FRP
            const radius = Math.min(13, Math.max(4.5, 4.5 + hotspot.frp / 25));

            const marker = L.circleMarker(
                [hotspot.latitude, hotspot.longitude],
                {
                    radius,
                    color: hotspot.confidenceLevel === 'high' ? '#7f1d1d' : color,
                    fillColor: color,
                    fillOpacity,
                    weight: hotspot.confidenceLevel === 'high' ? 2 : 1.2,
                    opacity: 0.95,
                },
            );

            marker.bindPopup(buildPopupHtml(hotspot), {
                maxWidth: 290,
                className: 'wildfire-popup-custom',
            });

            layer.addLayer(marker);
        }
    }, [wildfireHotspots, selectedConfidenceLevels]);

    // 6. FlyTo jika hotspot spesifik dipilih dari list
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedHotspot) {
            return;
        }
        map.flyTo([selectedHotspot.latitude, selectedHotspot.longitude], 11, {
            duration: 1.2,
        });
    }, [selectedHotspot]);

    // 7. Render Lokasi Rumah Warga & Radius (interactive: false agar titik api di dalamnya BISA diklik bebas)
    useEffect(() => {
        const layer = userLayerRef.current;
        if (!layer) {
            return;
        }

        layer.clearLayers();

        if (!showUserHome) {
            return;
        }

        if (
            !userLocation ||
            userLocation.latitude === null ||
            userLocation.latitude === undefined ||
            userLocation.longitude === null ||
            userLocation.longitude === undefined ||
            isNaN(Number(userLocation.latitude)) ||
            isNaN(Number(userLocation.longitude))
        ) {
            return;
        }

        const lat = Number(userLocation.latitude);
        const lng = Number(userLocation.longitude);

        const status = userSafety?.status ?? 'safe';
        const statusColor =
            status === 'danger'
                ? '#B91C1C'
                : status === 'warning'
                  ? '#E5A910'
                  : '#15803D';

        const statusLabel =
            status === 'danger'
                ? '🔴 BAHAYA KARHUTLA'
                : status === 'warning'
                  ? '🟠 STATUS WASPADA'
                  : '🟢 LINGKUNGAN AMAN';

        // 1. Outer Radius: 25 km Buffer Lingkungan (interactive: false agar bebas tembus klik)
        const circle25km = L.circle([lat, lng], {
            radius: 25000,
            color: statusColor,
            fillColor: statusColor,
            fillOpacity: status === 'danger' ? 0.12 : 0.05,
            weight: 2,
            dashArray: '6, 8',
            interactive: false,
        });
        layer.addLayer(circle25km);

        // 2. Inner Radius: 10 km Zona Bahaya Kritis (interactive: false)
        const circle10km = L.circle([lat, lng], {
            radius: 10000,
            color: status === 'danger' ? '#B91C1C' : '#E5A910',
            fillColor: status === 'danger' ? '#B91C1C' : '#E5A910',
            fillOpacity: status === 'danger' ? 0.16 : 0.03,
            weight: status === 'danger' ? 2.5 : 1,
            dashArray: '4, 4',
            interactive: false,
        });
        layer.addLayer(circle10km);

        // 3. Marker Rumah Warga (Custom Animated DivIcon)
        const homeIcon = L.divIcon({
            className: 'custom-user-home-marker',
            html: `
                <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${statusColor}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                    <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: ${statusColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 15px;">
                        🏠
                    </div>
                    <div style="position: absolute; top: 34px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); padding: 2px 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border: 1px solid #EEEEEE; font-family: 'Figtree', sans-serif; font-size: 10px; font-weight: 800; color: #1F6F5F;">
                        Kediaman Anda
                    </div>
                </div>
            `,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
            popupAnchor: [0, -22],
        });

        const homeMarker = L.marker([lat, lng], {
            icon: homeIcon,
            zIndexOffset: 2000,
        });

        const popupContent = `
            <div style="font-family: 'Figtree', sans-serif; font-size: 12px; min-width: 230px; line-height: 1.4; color: #262626;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 5px; font-weight: 800; color: #1F6F5F; font-size: 13px;">
                        <span>🏠 Lokasi Tempat Tinggal</span>
                    </div>
                    <span style="font-size: 10px; font-weight: 700; background: ${statusColor}18; color: ${statusColor}; padding: 2px 6px; border-radius: 4px;">
                        ${statusLabel}
                    </span>
                </div>
                <div style="margin-bottom: 4px; font-weight: 700; color: #1F6F5F;">
                    ${userLocation.name ?? 'Warga Terdaftar'}
                </div>
                ${userLocation.address ? `<div style="font-size: 11px; color: #666; margin-bottom: 8px;">${userLocation.address}</div>` : ''}
                <table style="width: 100%; border-collapse: collapse; font-size: 11px; border-top: 1px solid #EEEEEE; padding-top: 6px;">
                    <tr>
                        <td style="color: #666; padding: 2px 0;">Koordinat:</td>
                        <td style="font-weight: 600; text-align: right; font-family: monospace;">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</td>
                    </tr>
                    <tr>
                        <td style="color: #666; padding: 2px 0;">Titik Api dlm 25 km:</td>
                        <td style="font-weight: 700; text-align: right; color: ${statusColor};">${userSafety?.hotspotsWithin25Km ?? 0} Titik</td>
                    </tr>
                    <tr>
                        <td style="color: #666; padding: 2px 0;">Titik Api Terdekat:</td>
                        <td style="font-weight: 700; text-align: right; color: #1F6F5F;">${userSafety?.nearestHotspot ? `${userSafety.nearestHotspot.distanceKm} km (${userSafety.nearestHotspot.direction})` : 'Aman (>50 km)'}</td>
                    </tr>
                </table>
            </div>
        `;

        homeMarker.bindPopup(popupContent, {
            maxWidth: 280,
            className: 'user-home-popup-custom',
        });

        layer.addLayer(homeMarker);
    }, [userLocation, userSafety, showUserHome]);

    // Status filter aktif saat ini
    const totalActiveFilters =
        (3 - selectedConfidenceLevels.length) +
        selectedProvinces.length +
        (showUserHome ? 0 : 1);
    const hasAnyFilterActive = totalActiveFilters > 0;

    return (
        <div className="relative w-full">
            {/* HUD Bar Atas Peta (z-[1000] agar tampil di atas canvas/tiles Leaflet) */}
            <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* Switch Tile Basemap */}
                <div className="flex rounded-xl bg-white/95 p-1 shadow-md backdrop-blur-sm border border-[#EEEEEE]">
                    <button
                        type="button"
                        onClick={() => setActiveBasemap('osm')}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                            activeBasemap === 'osm'
                                ? 'bg-[#1F6F5F] text-white shadow-xs'
                                : 'text-[#262626]/70 hover:text-[#1F6F5F]',
                        )}
                    >
                        Peta Standar
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveBasemap('nasa')}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                            activeBasemap === 'nasa'
                                ? 'bg-[#1F6F5F] text-white shadow-xs'
                                : 'text-[#262626]/70 hover:text-[#1F6F5F]',
                        )}
                    >
                        Satelit NASA
                    </button>
                </div>

                {/* Tombol Shortcut Fokus Rumah */}
                {userLocation && onFocusHome && (
                    <button
                        type="button"
                        onClick={onFocusHome}
                        className="px-3 py-1.5 rounded-xl bg-white/95 text-[#1F6F5F] hover:bg-[#EEEEEE] transition-all text-xs font-bold shadow-md border border-[#EEEEEE] flex items-center gap-1.5 cursor-pointer"
                        title="Fokuskan Peta ke Rumah Saya"
                    >
                        <span>🏠 Rumah</span>
                        <span
                            className={`w-2 h-2 rounded-full ${
                                userSafety?.status === 'danger'
                                    ? 'bg-[#B91C1C] animate-ping'
                                    : userSafety?.status === 'warning'
                                      ? 'bg-[#E5A910]'
                                      : 'bg-[#15803D]'
                            }`}
                        />
                    </button>
                )}
            </div>

            {/* Badge Counter Titik Api (Pojok Kanan Atas, z-[1000]) */}
            <div className="absolute top-3 right-3 z-[1000] hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 shadow-md backdrop-blur-sm border border-[#EEEEEE] text-xs font-bold text-[#1F6F5F]">
                <span className="w-2 h-2 rounded-full bg-[#B91C1C] animate-pulse"></span>
                <span>
                    {wildfireHotspots.length.toLocaleString('id-ID')} Titik Api Tampil
                </span>
            </div>

            {/* Kontainer Peta Leaflet */}
            <div
                ref={mapContainerRef}
                className={cn(
                    'w-full rounded-xl overflow-hidden border border-[#EEEEEE] shadow-inner bg-[#e5e3df]',
                    className ?? 'h-[500px]',
                )}
            />

            {/* LEGENDA & FILTER PETA INTERAKTIF MULTI-SELECT (Pojok Kiri Bawah, z-[1000] di atas canvas Leaflet) */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-[#EEEEEE] text-xs w-[270px] sm:w-[305px] pointer-events-auto max-h-[85%] overflow-y-auto no-scrollbar">
                {/* Header Legenda & Tombol Reset */}
                <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] mb-2">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#1F6F5F] uppercase tracking-wide">
                            Filter &amp; Legenda Peta
                        </span>
                        {hasAnyFilterActive && (
                            <span className="text-[9px] font-bold bg-[#1F6F5F] text-white px-1.5 py-0.2 rounded-full">
                                {totalActiveFilters} aktif
                            </span>
                        )}
                    </div>
                    {hasAnyFilterActive && onResetFilters && (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* 1. Filter Situasi Api & Asap (Multi-Pilih) */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#262626]/60">
                        <span>Situasi Api (Multi-Pilih)</span>
                        <button
                            type="button"
                            onClick={() => setShowInfoGuide(!showInfoGuide)}
                            className="text-[#1F6F5F] font-bold hover:underline cursor-pointer lowercase first-letter:uppercase"
                        >
                            {showInfoGuide ? '✕ Tutup Info' : 'ℹ️ Panduan Warga'}
                        </button>
                    </div>

                    {/* Expandable Panduan Orang Awam */}
                    {showInfoGuide && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] text-[#1F6F5F] space-y-2 mb-2 animate-fadeIn">
                            <div className="font-bold text-[11px] border-b border-emerald-200 pb-1">
                                📖 Arti Warna Indikator untuk Warga:
                            </div>
                            <div>
                                <strong className="text-[#B91C1C]">🔴 Merah Pekat (Tinggi):</strong> Kobaran api terbuka suhu tinggi & radiasi kuat. Segera evakuasi atau kenakan masker N95, tutup pintu & ventilasi rumah.
                            </div>
                            <div>
                                <strong className="text-[#CA8A04]">🟡 Kuning Pekat (Sedang):</strong> Anomali panas sedang atau bara asap gambut. Kelompok rentan (anak, lansia, asma) disarankan memakai masker medis.
                            </div>
                            <div>
                                <strong className="text-[#15803D]">🟢 Hijau Tua (Rendah):</strong> Titik panas bersuhu rendah atau pantulan panas normal. Udara relatif aman untuk beraktivitas luar.
                            </div>
                        </div>
                    )}

                    {/* Item 1: Tinggi (Merah Pekat) */}
                    {(() => {
                        const isActive = selectedConfidenceLevels.includes('high');
                        return (
                            <button
                                type="button"
                                onClick={() => onToggleConfidenceLevel?.('high')}
                                className={cn(
                                    'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer',
                                    isActive
                                        ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-bold shadow-2xs'
                                        : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                                )}
                                title="Klik untuk menampilkan/menyembunyikan titik api Tinggi"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#B91C1C] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                        {isActive && '✓'}
                                    </span>
                                    <span className="text-[11px]">Tinggi (Merah Pekat)</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white border border-rose-200 text-[#B91C1C]">
                                    {countsByLevel.high}
                                </span>
                            </button>
                        );
                    })()}

                    {/* Item 2: Sedang (Kuning Pekat) */}
                    {(() => {
                        const isActive = selectedConfidenceLevels.includes('nominal');
                        return (
                            <button
                                type="button"
                                onClick={() => onToggleConfidenceLevel?.('nominal')}
                                className={cn(
                                    'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer',
                                    isActive
                                        ? 'bg-yellow-50/70 border-yellow-200 text-yellow-950 font-bold shadow-2xs'
                                        : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                                )}
                                title="Klik untuk menampilkan/menyembunyikan titik api Sedang"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#E5A910] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                        {isActive && '✓'}
                                    </span>
                                    <span className="text-[11px]">Sedang (Kuning Pekat)</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white border border-yellow-200 text-[#854D0E]">
                                    {countsByLevel.nominal}
                                </span>
                            </button>
                        );
                    })()}

                    {/* Item 3: Rendah (Hijau Tua) */}
                    {(() => {
                        const isActive = selectedConfidenceLevels.includes('low');
                        return (
                            <button
                                type="button"
                                onClick={() => onToggleConfidenceLevel?.('low')}
                                className={cn(
                                    'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer',
                                    isActive
                                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold shadow-2xs'
                                        : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                                )}
                                title="Klik untuk menampilkan/menyembunyikan titik api Rendah"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#15803D] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                        {isActive && '✓'}
                                    </span>
                                    <span className="text-[11px]">Rendah (Hijau Tua)</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white border border-emerald-200 text-[#15803D]">
                                    {countsByLevel.low}
                                </span>
                            </button>
                        );
                    })()}

                    {/* Item 4: Rumah Warga & 25km Radius */}
                    {userLocation && onToggleUserHome && (
                        <button
                            type="button"
                            onClick={onToggleUserHome}
                            className={cn(
                                'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all border cursor-pointer pt-1 border-t border-[#EEEEEE]',
                                showUserHome
                                    ? 'bg-[#2FA084]/10 border-[#2FA084]/30 text-[#1F6F5F] font-bold'
                                    : 'bg-[#FAFAFA] border-transparent text-[#262626]/40 opacity-50 line-through',
                            )}
                            title="Klik untuk menyembunyikan/menampilkan marker rumah & radius pantauan"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#2FA084] shrink-0 shadow-xs flex items-center justify-center text-[8px] text-white">
                                    {showUserHome && '✓'}
                                </span>
                                <span className="text-[11px]">Rumah &amp; 25km Radius</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#2FA084]">
                                {showUserHome ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </button>
                    )}
                </div>

                {/* 2. Filter Wilayah Provinsi Kalimantan (Multi-Pilih) */}
                <div className="mt-2.5 pt-2 border-t border-[#EEEEEE]">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#1F6F5F] tracking-wider mb-1.5">
                        <span>Wilayah Provinsi (Multi-Pilih)</span>
                        {selectedProvinces.length > 0 && (
                            <span className="text-[9px] text-neutral-500 font-semibold">
                                {selectedProvinces.length} dipilih
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(PROVINCE_COLORS).map(([provKey, provConfig]) => {
                            const isSelected = selectedProvinces.some(
                                (p) =>
                                    provKey.includes(p.toUpperCase()) ||
                                    p.toUpperCase().includes(provKey),
                            );

                            return (
                                <button
                                    key={provKey}
                                    type="button"
                                    onClick={() => onToggleProvince?.(provConfig.name)}
                                    className={cn(
                                        'flex items-center justify-between px-2 py-1 rounded-md text-[10px] transition-all border cursor-pointer',
                                        isSelected
                                            ? 'bg-white font-bold shadow-xs'
                                            : 'bg-[#FAFAFA] border-[#EEEEEE] text-[#262626]/70 hover:bg-white',
                                    )}
                                    style={{
                                        borderColor: isSelected
                                            ? provConfig.stroke
                                            : '#EEEEEE',
                                        boxShadow: isSelected
                                            ? `0 1px 4px ${provConfig.fill}40`
                                            : undefined,
                                    }}
                                    title={`Klik untuk filter/highlight wilayah ${provConfig.name}`}
                                >
                                    <div className="flex items-center gap-1.5 truncate">
                                        <span
                                            className="w-2.5 h-2.5 rounded-xs shrink-0 flex items-center justify-center text-[7px] text-white font-bold"
                                            style={{
                                                backgroundColor: provConfig.fill,
                                                border: `1px solid ${provConfig.stroke}`,
                                            }}
                                        >
                                            {isSelected && '✓'}
                                        </span>
                                        <span className="truncate">{provConfig.label}</span>
                                    </div>
                                    <span
                                        className="text-[9px] font-mono px-1 rounded"
                                        style={{
                                            color: provConfig.stroke,
                                            backgroundColor: `${provConfig.fill}15`,
                                        }}
                                    >
                                        {countsByProvince[provKey] || 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Keterangan Singkat */}
                <div className="mt-2 pt-1.5 border-t border-[#EEEEEE] text-[9.5px] text-[#262626]/60 flex items-center justify-between">
                    <span>Radius lingkaran titik &prop; FRP (MW)</span>
                    <span className="text-[#1F6F5F] font-semibold">Live FIRMS</span>
                </div>
            </div>
        </div>
    );
}

export default Maps;
