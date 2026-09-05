import { useEffect, useRef, useState } from 'react';
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

/** Warna marker hotspot berdasarkan kategori ramah pengguna */
const CATEGORY_COLORS: Record<string, string> = {
    active_fire: '#ef4444',  // Merah intens (Api menyala)
    smoke_peat: '#f97316',   // Oranye (Bara gambut penghasil asap)
    heat_anomaly: '#eab308', // Kuning (Panas ekstrem)
};

const CATEGORY_FILL_OPACITY: Record<string, number> = {
    active_fire: 0.85,
    smoke_peat: 0.75,
    heat_anomaly: 0.60,
};

function buildPopupHtml(hotspot: WildfireHotspot): string {
    const isFire = hotspot.category === 'active_fire';
    const isPeat = hotspot.category === 'smoke_peat';

    const categoryTitle = isFire
        ? 'Kebakaran Aktif'
        : isPeat
          ? 'Potensi Asap & Gambut'
          : 'Suhu Panas Ekstrem';

    const badgeText = isFire
        ? 'Bahaya Api Nyata'
        : isPeat
          ? 'Pemicu Kabut Asap'
          : 'Lahan Rawan Kering';

    const intensity = hotspot.frp >= 15
        ? 'Tinggi / Kuat'
        : hotspot.frp >= 5
          ? 'Sedang'
          : 'Awal / Ringan';

    const advice = isFire
        ? 'Hindari mendekati area titik kebakaran. Prioritaskan keselamatan keluarga.'
        : isPeat
          ? 'Waspada kepulan kabut asap tebal. Tutup ventilasi rumah & gunakan masker jika bau menyengat.'
          : 'Suhu permukaan sangat terik. Waspada percikan api dan jangan membakar lahan.';

    const color = CATEGORY_COLORS[hotspot.category] ?? '#ef4444';

    return `
        <div style="font-family: 'Figtree', sans-serif; font-size: 12px; min-width: 230px; line-height: 1.4; color: #262626;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 8px;">
                <span style="font-weight: 700; color: ${color}; font-size: 13px;">
                    ${categoryTitle}
                </span>
                <span style="font-size: 10px; font-weight: 700; background: ${color}18; color: ${color}; padding: 2px 6px; border-radius: 6px;">
                    ${badgeText}
                </span>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 8px;">
                <tr>
                    <td style="color: #666; padding: 2px 0;">Wilayah:</td>
                    <td style="font-weight: 700; text-align: right; color: #1F6F5F;">${hotspot.province ?? 'Kalimantan'}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Kekuatan Api:</td>
                    <td style="font-weight: 700; text-align: right; color: ${color};">${intensity}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Waktu Pantau:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.daynight === 'N' ? '🌙 Malam Hari' : '☀️ Siang Hari'}</td>
                </tr>
            </table>
            <div style="background: #F9FAFB; border: 1px solid #EEEEEE; border-radius: 8px; padding: 6px 8px; font-size: 10.5px; color: #4B5563; line-height: 1.35;">
                <strong style="color: #1F6F5F;">Tips Warga:</strong> ${advice}
            </div>
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
}

export function Maps({
    center = [0.9619, 114.5548],
    zoom = 6,
    className,
    apiKey = NASA_API_KEY,
    wildfireHotspots = [],
    selectedHotspot = null,
}: MapsProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const hotspotLayerRef = useRef<L.LayerGroup | null>(null);
    const [activeBasemap, setActiveBasemap] = useState<'osm' | 'nasa'>('osm');
    const osmLayerRef = useRef<L.TileLayer | null>(null);
    const nasaLayerRef = useRef<L.TileLayer | null>(null);

    // 1. Inisialisasi Peta Leaflet (hanya sekali)
    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        if (mapInstanceRef.current) {
            return;
        }

        // Buat map instance dengan preferCanvas: true untuk akselerasi performa ribuan titik
        const map = L.map(mapContainerRef.current, {
            center,
            zoom,
            zoomControl: false,
            preferCanvas: true,
        });
        mapInstanceRef.current = map;

        // Custom Zoom Control di kiri bawah
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Base Layer 1: OpenStreetMap
        const osmLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 18,
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
                maxZoom: 9,
                attribution: 'NASA EOSDIS GIBS',
            },
        );
        nasaLayerRef.current = nasaLayer;

        // Layer group titik api
        const hotspotLayer = L.layerGroup();
        hotspotLayer.addTo(map);
        hotspotLayerRef.current = hotspotLayer;

        const resizeTimeout = setTimeout(() => {
            map.invalidateSize();
        }, 150);

        return () => {
            clearTimeout(resizeTimeout);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                hotspotLayerRef.current = null;
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
    }, [center[0], center[1], zoom]);

    // 3. Toggle Basemap
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

    // 4. Render Titik Api (CircleMarker)
    useEffect(() => {
        const layer = hotspotLayerRef.current;
        if (!layer) {
            return;
        }

        layer.clearLayers();

        for (const hotspot of wildfireHotspots) {
            const color = CATEGORY_COLORS[hotspot.category] ?? '#ef4444';
            const fillOpacity = CATEGORY_FILL_OPACITY[hotspot.category] ?? 0.75;

            // Ukuran proporsional dengan intensitas api: min 4.5px, max 11px
            const radius = Math.min(11, Math.max(4.5, 4.5 + hotspot.frp / 25));

            const marker = L.circleMarker(
                [hotspot.latitude, hotspot.longitude],
                {
                    radius,
                    color: hotspot.category === 'active_fire' ? '#b91c1c' : color,
                    fillColor: color,
                    fillOpacity,
                    weight: hotspot.category === 'active_fire' ? 2 : 1,
                    opacity: 0.9,
                },
            );

            marker.bindPopup(buildPopupHtml(hotspot), {
                maxWidth: 260,
                className: 'wildfire-popup-custom',
            });

            layer.addLayer(marker);
        }
    }, [wildfireHotspots]);

    // 5. FlyTo jika hotspot spesifik dipilih dari list
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedHotspot) {
            return;
        }
        map.flyTo([selectedHotspot.latitude, selectedHotspot.longitude], 11, {
            duration: 1.2,
        });
    }, [selectedHotspot]);

    return (
        <div
            className={cn(
                'relative w-full h-[520px] rounded-2xl overflow-hidden border border-[#EEEEEE] shadow-xs z-0',
                className,
            )}
        >
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Top Left Floating HUD: Basemap Switcher */}
            <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2">
                <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#EEEEEE] shadow-2xs flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveBasemap('osm')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            activeBasemap === 'osm'
                                ? 'bg-[#2FA084] text-white shadow-2xs font-bold'
                                : 'text-[#1F6F5F] hover:bg-[#EEEEEE]'
                        }`}
                    >
                        Peta Standar
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveBasemap('nasa')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            activeBasemap === 'nasa'
                                ? 'bg-[#2FA084] text-white shadow-2xs font-bold'
                                : 'text-[#1F6F5F] hover:bg-[#EEEEEE]'
                        }`}
                    >
                        Citra Satelit
                    </button>
                </div>
            </div>

            {/* Top Right Floating HUD: Live Count Pill */}
            <div className="absolute top-3 right-3 z-[1000]">
                <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#EEEEEE] shadow-2xs flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-bold text-[#1F6F5F]">
                        {wildfireHotspots.length.toLocaleString('id-ID')} Titik Terpantau
                    </span>
                </div>
            </div>

            {/* Bottom Left Floating Legend Sederhana Ramah Pengguna */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-[#EEEEEE] shadow-2xs text-xs">
                <div className="font-bold text-[#1F6F5F] mb-1.5 text-[10.5px] uppercase tracking-wider">
                    Tanda Bahaya
                </div>
                <div className="space-y-1.5 text-[11px] text-[#262626]/80">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                        <span>Api Aktif</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                        <span>Asap & Gambut</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                        <span>Panas Ekstrem</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Maps;

