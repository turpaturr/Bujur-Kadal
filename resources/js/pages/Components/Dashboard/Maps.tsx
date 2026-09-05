import { useEffect, useRef } from 'react';
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

// Mengambil API Key dari .env (NASA_API_KEY)
export const NASA_API_KEY: string =
    (import.meta.env.NASA_API_KEY as string | undefined) ??
    (import.meta.env.VITE_NASA_API_KEY as string | undefined) ??
    '';

/** Warna marker berdasarkan confidence level */
const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
    high: '#ef4444',    // merah
    nominal: '#f97316', // oranye
    low: '#eab308',     // kuning
};

const CONFIDENCE_FILL_OPACITY: Record<ConfidenceLevel, number> = {
    high: 0.85,
    nominal: 0.75,
    low: 0.65,
};

function formatTime(acqTime: string): string {
    if (!acqTime || acqTime.length < 3) {
        return acqTime;
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
        <div style="font-family:system-ui,sans-serif;font-size:12px;min-width:180px;line-height:1.5">
            <div style="font-weight:700;font-size:13px;color:${color};margin-bottom:6px;display:flex;align-items:center;gap:4px;">
                🔥 Titik Api Aktif
            </div>
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="color:#555;padding:2px 0">Koordinat</td>
                    <td style="font-weight:600;padding:2px 0 2px 8px">${hotspot.latitude.toFixed(4)}°, ${hotspot.longitude.toFixed(4)}°</td>
                </tr>
                <tr>
                    <td style="color:#555;padding:2px 0">Tanggal</td>
                    <td style="font-weight:600;padding:2px 0 2px 8px">${hotspot.acquisitionDate}</td>
                </tr>
                <tr>
                    <td style="color:#555;padding:2px 0">Waktu</td>
                    <td style="font-weight:600;padding:2px 0 2px 8px">${formatTime(hotspot.acquisitionTime)}</td>
                </tr>
                <tr>
                    <td style="color:#555;padding:2px 0">Satelit</td>
                    <td style="font-weight:600;padding:2px 0 2px 8px">${hotspot.satellite} (${hotspot.source})</td>
                </tr>
                <tr>
                    <td style="color:#555;padding:2px 0">FRP</td>
                    <td style="font-weight:600;padding:2px 0 2px 8px">${isNaN(hotspot.frp) ? '-' : hotspot.frp.toFixed(1)} MW</td>
                </tr>
                <tr>
                    <td style="color:#555;padding:2px 0">Confidence</td>
                    <td style="font-weight:600;padding:2px 0 2px 8px">${levelLabel[hotspot.confidenceLevel]} (${hotspot.confidence})</td>
                </tr>
                ${hotspot.province ? `<tr><td style="color:#555;padding:2px 0">Provinsi</td><td style="font-weight:600;padding:2px 0 2px 8px">${hotspot.province}</td></tr>` : ''}
            </table>
        </div>
    `;
}

export interface MapsProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    apiKey?: string;
    showStatusBadge?: boolean;
    /** Data hotspot aktif dari useWildfireData */
    wildfireHotspots?: WildfireHotspot[];
}

export function Maps({
    center = [0.9619, 114.5548],
    zoom = 6,
    className,
    apiKey = NASA_API_KEY,
    wildfireHotspots = [],
}: MapsProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const hotspotLayerRef = useRef<L.LayerGroup | null>(null);

    // Inisialisasi peta — hanya sekali
    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        // Cegah inisialisasi ulang jika container sudah memiliki instance map
        if (
            mapInstanceRef.current ||
            (
                mapContainerRef.current as HTMLDivElement & {
                    _leaflet_id?: number;
                }
            )._leaflet_id
        ) {
            return;
        }

        // Inisialisasi peta Leaflet
        const map = L.map(mapContainerRef.current, {
            center,
            zoom,
            zoomControl: true,
        });
        mapInstanceRef.current = map;

        // 1. Base Layer: OpenStreetMap (OSM)
        const osmLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
        );
        osmLayer.addTo(map);

        // 2. Base Layer: NASA GIBS (Global Imagery Browse Services - True Color)
        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const gibsDate = yesterday.toISOString().split('T')[0];

        const nasaGibsLayer = L.tileLayer(
            `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
            {
                maxZoom: 9,
                attribution:
                    'Imagery &copy; <a href="https://earthdata.nasa.gov/gibs">NASA EOSDIS GIBS</a>',
            },
        );

        const baseLayers: Record<string, L.TileLayer> = {
            OpenStreetMap: osmLayer,
            'NASA Satelit (GIBS)': nasaGibsLayer,
        };

        const overlayLayers: Record<string, L.Layer> = {};

        // 3. Overlay Layer: NASA FIRMS WMS (tile-based sebagai fallback visual)
        if (apiKey) {
            const nasaFirmsLayer = L.tileLayer.wms(
                `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/${apiKey}/`,
                {
                    layers: 'fires_viirs_snpp',
                    format: 'image/png',
                    transparent: true,
                    attribution:
                        'Active Fires &copy; <a href="https://firms.modaps.eosdis.nasa.gov/">NASA FIRMS</a>',
                },
            );

            overlayLayers['FIRMS WMS (tile)'] = nasaFirmsLayer;
        }

        // 4. Layer group untuk hotspot CircleMarker (diisi terpisah)
        const hotspotLayer = L.layerGroup();
        hotspotLayer.addTo(map);
        hotspotLayerRef.current = hotspotLayer;
        overlayLayers['🔥 Hotspot Aktif (API)'] = hotspotLayer;

        // Tambahkan layer control
        L.control
            .layers(baseLayers, overlayLayers, { position: 'topright' })
            .addTo(map);

        // Resize otomatis agar render tiles tidak terpotong
        const resizeTimeout = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => {
            clearTimeout(resizeTimeout);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                hotspotLayerRef.current = null;
            }
        };
    }, [center, zoom, apiKey]);

    // Update CircleMarker setiap kali data hotspot berubah
    useEffect(() => {
        const layer = hotspotLayerRef.current;
        if (!layer) {
            return;
        }

        layer.clearLayers();

        for (const hotspot of wildfireHotspots) {
            const color = CONFIDENCE_COLORS[hotspot.confidenceLevel];
            const fillOpacity =
                CONFIDENCE_FILL_OPACITY[hotspot.confidenceLevel];

            // Radius proporsional dengan FRP (min 5, max 14)
            const radius = Math.min(14, Math.max(5, 5 + (hotspot.frp / 20)));

            const marker = L.circleMarker(
                [hotspot.latitude, hotspot.longitude],
                {
                    radius,
                    color,
                    fillColor: color,
                    fillOpacity,
                    weight: 1.5,
                    opacity: 1,
                },
            );

            marker.bindPopup(buildPopupHtml(hotspot), {
                maxWidth: 260,
                className: 'wildfire-popup',
            });

            layer.addLayer(marker);
        }
    }, [wildfireHotspots]);

    return (
        <div
            className={cn(
                'relative w-full h-[500px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-zinc-800',
                className,
            )}
        >
            {/* Map Container */}
            <div ref={mapContainerRef} className="h-full w-full" />
        </div>
    );
}

export default Maps;
