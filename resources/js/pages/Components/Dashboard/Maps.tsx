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

/** Warna marker hotspot berdasarkan level confidence */
const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
    high: '#ef4444',    // Merah intens
    nominal: '#f97316', // Oranye
    low: '#eab308',     // Kuning
};

const CONFIDENCE_FILL_OPACITY: Record<ConfidenceLevel, number> = {
    high: 0.85,
    nominal: 0.70,
    low: 0.55,
};

function formatTime(acqTime: string): string {
    if (!acqTime || acqTime.length < 3) {
        return acqTime || '-';
    }
    const padded = acqTime.padStart(4, '0');
    return `${padded.slice(0, 2)}:${padded.slice(2)} UTC`;
}

function buildPopupHtml(hotspot: WildfireHotspot): string {
    const levelLabel: Record<ConfidenceLevel, string> = {
        high: '🔴 Tinggi',
        nominal: '🟠 Sedang',
        low: '🟡 Rendah',
    };
    const color = CONFIDENCE_COLORS[hotspot.confidenceLevel];

    return `
        <div style="font-family: 'Figtree', sans-serif; font-size: 12px; min-width: 220px; line-height: 1.4; color: #262626;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 4px; font-weight: 700; color: ${color}; font-size: 13px;">
                    <span>🔥 Titik Api Aktif</span>
                </div>
                <span style="font-size: 10px; font-weight: 700; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px;">
                    ${levelLabel[hotspot.confidenceLevel]}
                </span>
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
                    <td style="color: #666; padding: 2px 0;">Energi Api (FRP):</td>
                    <td style="font-weight: 700; text-align: right; color: #d97706;">${hotspot.frp > 0 ? hotspot.frp.toFixed(1) + ' MW' : '-'}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Waktu Akuisisi:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.acquisitionDate} (${formatTime(hotspot.acquisitionTime)})</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Satelit / Sensor:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.satellite} · ${hotspot.source.replace('_NRT', '')}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Fase Deteksi:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.daynight === 'N' ? '🌙 Malam Hari' : '☀️ Siang Hari'}</td>
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
    const [filterConfidence, setFilterConfidence] = useState<'all' | 'high'>('all');
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

        const filtered =
            filterConfidence === 'high'
                ? wildfireHotspots.filter((h) => h.confidenceLevel === 'high')
                : wildfireHotspots;

        for (const hotspot of filtered) {
            const color = CONFIDENCE_COLORS[hotspot.confidenceLevel];
            const fillOpacity = CONFIDENCE_FILL_OPACITY[hotspot.confidenceLevel];

            // Ukuran proporsional dengan FRP: min 4.5px, max 13px
            const radius = Math.min(13, Math.max(4.5, 4.5 + hotspot.frp / 25));

            const marker = L.circleMarker(
                [hotspot.latitude, hotspot.longitude],
                {
                    radius,
                    color: hotspot.confidenceLevel === 'high' ? '#b91c1c' : color,
                    fillColor: color,
                    fillOpacity,
                    weight: hotspot.confidenceLevel === 'high' ? 2 : 1,
                    opacity: 0.9,
                },
            );

            marker.bindPopup(buildPopupHtml(hotspot), {
                maxWidth: 280,
                className: 'wildfire-popup-custom',
            });

            layer.addLayer(marker);
        }
    }, [wildfireHotspots, filterConfidence]);

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

    const renderedCount =
        filterConfidence === 'high'
            ? wildfireHotspots.filter((h) => h.confidenceLevel === 'high').length
            : wildfireHotspots.length;

    return (
        <div
            className={cn(
                'relative w-full h-[520px] rounded-2xl overflow-hidden border border-[#EEEEEE] shadow-sm z-0',
                className,
            )}
        >
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Top Left Floating HUD: Basemap Switcher & Confidence Filter */}
            <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
                {/* Basemap Switcher */}
                <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#EEEEEE] shadow-xs flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveBasemap('osm')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            activeBasemap === 'osm'
                                ? 'bg-[#2FA084] text-white shadow-xs font-bold'
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
                                ? 'bg-[#2FA084] text-white shadow-xs font-bold'
                                : 'text-[#1F6F5F] hover:bg-[#EEEEEE]'
                        }`}
                    >
                        Satelit NASA
                    </button>
                </div>

                {/* Filter Confidence Toggle */}
                <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#EEEEEE] shadow-xs flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setFilterConfidence('all')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            filterConfidence === 'all'
                                ? 'bg-[#1F6F5F] text-white font-bold'
                                : 'text-[#1F6F5F] hover:bg-[#EEEEEE]'
                        }`}
                    >
                        Semua ({wildfireHotspots.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterConfidence('high')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            filterConfidence === 'high'
                                ? 'bg-red-600 text-white font-bold'
                                : 'text-red-700 hover:bg-red-50'
                        }`}
                    >
                        🔴 Akurasi Tinggi
                    </button>
                </div>
            </div>

            {/* Top Right Floating HUD: Live Count Pill */}
            <div className="absolute top-3 right-3 z-[1000] hidden sm:block">
                <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#EEEEEE] shadow-xs flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-bold text-[#1F6F5F]">
                        {renderedCount.toLocaleString('id-ID')} Titik Api Tampil
                    </span>
                </div>
            </div>

            {/* Bottom Left Floating Legend */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#EEEEEE] shadow-xs max-w-[210px] text-xs">
                <div className="font-bold text-[#1F6F5F] mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wider">
                    <span>Legenda Api</span>
                    <span className="text-[10px] text-[#262626]/50">VIIRS/MODIS</span>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 ring-1 ring-red-600"></span>
                        <span className="text-[#262626]/80 text-[11px]">Tinggi (Confidence ≥80%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                        <span className="text-[#262626]/80 text-[11px]">Sedang (Nominal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0"></span>
                        <span className="text-[#262626]/80 text-[11px]">Rendah</span>
                    </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-[#EEEEEE] text-[10px] text-[#262626]/60">
                    Radius lingkaran ∝ Radiasi Api (FRP MW)
                </div>
            </div>
        </div>
    );
}

export default Maps;

