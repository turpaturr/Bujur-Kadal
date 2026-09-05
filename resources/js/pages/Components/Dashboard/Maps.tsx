import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

import { cn } from '@/lib/utils';

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
    import.meta.env.NASA_API_KEY ||
    import.meta.env.VITE_NASA_API_KEY ||
    '';

export interface MapsProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    apiKey?: string;
    showStatusBadge?: boolean;
}

export function Maps({
    center = [0.9619, 114.5548], 
    zoom = 6,
    className,
    apiKey = NASA_API_KEY,
    showStatusBadge = true,
}: MapsProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        // Cegah inisialisasi ulang jika container sudah memiliki instance map
        if (mapInstanceRef.current || (mapContainerRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) {
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
            'OpenStreetMap': osmLayer,
            'NASA Satelit (GIBS)': nasaGibsLayer,
        };

        const overlayLayers: Record<string, L.Layer> = {};

        // 3. Overlay Layer: NASA FIRMS (WMS Active Fires) menggunakan NASA_API_KEY jika tersedia
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

            overlayLayers['NASA FIRMS Hotspots'] = nasaFirmsLayer;
        }

        // Tambahkan layer control agar pengguna dapat memilih layer peta
        L.control.layers(baseLayers, overlayLayers, { position: 'topright' }).addTo(map);

        // Resize otomatis agar render tiles tidak terpotong
        const resizeTimeout = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => {
            clearTimeout(resizeTimeout);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [center, zoom, apiKey]);

    const isKeyConnected = Boolean(apiKey && apiKey.length > 0);

    return (
        <div
            className={cn(
                'relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm z-0',
                className,
            )}
        >
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Status Badge API NASA - Tanpa menampilkan string API Key */}
            {showStatusBadge && (
                <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CCECEE] shadow-xs text-xs flex items-center gap-2">
                    <span
                        className={cn(
                            'w-2 h-2 rounded-full',
                            isKeyConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500',
                        )}
                    />
                    <span className="font-medium text-[#262626]">
                        Satelit NASA:{' '}
                        {isKeyConnected ? (
                            <span className="text-[#14967F] font-semibold">
                                Terhubung
                            </span>
                        ) : (
                            <span className="text-amber-600 font-semibold">
                                Standby
                            </span>
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}

export default Maps;
