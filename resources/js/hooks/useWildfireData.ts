import { useCallback, useEffect, useRef, useState } from 'react';

/** Cache TTL: 10 menit */
const CACHE_TTL_MS = 10 * 60 * 1000;

export type ConfidenceLevel = 'high' | 'nominal' | 'low';
export type SensorSource = 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'MODIS_NRT';

export interface WildfireHotspot {
    id: string;
    latitude: number;
    longitude: number;
    /** Brightness temperature (Kelvin) */
    brightness: number;
    /** Fire Radiative Power (MW) */
    frp: number;
    /** String confidence mentah dari API */
    confidence: string;
    confidenceLevel: ConfidenceLevel;
    acquisitionDate: string;
    acquisitionTime: string;
    satellite: string;
    source: SensorSource;
    /** Nama provinsi Kalimantan (jika terdeteksi) */
    province: string | null;
}

export interface WildfireStats {
    total: number;
    byProvince: Record<string, number>;
    byConfidence: Record<ConfidenceLevel, number>;
    bySensor: Record<SensorSource, number>;
}

export interface WildfireData {
    hotspots: WildfireHotspot[];
    stats: WildfireStats;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refresh: () => void;
}

/** Batas bounding box sederhana per provinsi Kalimantan */
const PROVINCE_BOUNDS: Array<{
    name: string;
    latMin: number;
    latMax: number;
    lonMin: number;
    lonMax: number;
}> = [
    {
        name: 'Kalimantan Barat',
        latMin: -3.1,
        latMax: 2.1,
        lonMin: 108.0,
        lonMax: 114.5,
    },
    {
        name: 'Kalimantan Tengah',
        latMin: -4.5,
        latMax: -0.2,
        lonMin: 111.0,
        lonMax: 116.7,
    },
    {
        name: 'Kalimantan Selatan',
        latMin: -4.5,
        latMax: -1.2,
        lonMin: 114.5,
        lonMax: 117.0,
    },
    {
        name: 'Kalimantan Timur',
        latMin: -2.5,
        latMax: 4.2,
        lonMin: 113.5,
        lonMax: 119.0,
    },
    {
        name: 'Kalimantan Utara',
        latMin: 2.5,
        latMax: 7.5,
        lonMin: 114.5,
        lonMax: 119.5,
    },
];

function detectProvince(lat: number, lon: number): string | null {
    for (const prov of PROVINCE_BOUNDS) {
        if (
            lat >= prov.latMin &&
            lat <= prov.latMax &&
            lon >= prov.lonMin &&
            lon <= prov.lonMax
        ) {
            return prov.name;
        }
    }
    return null;
}

function parseConfidenceLevel(confidence: string): ConfidenceLevel {
    const lower = confidence.toLowerCase().trim();
    if (lower === 'h' || lower === 'high') {
        return 'high';
    }
    if (lower === 'l' || lower === 'low') {
        return 'low';
    }
    const num = parseInt(lower, 10);
    if (!isNaN(num)) {
        if (num >= 80) {
            return 'high';
        }
        if (num >= 30) {
            return 'nominal';
        }
        return 'low';
    }
    return 'nominal';
}

/** Map SensorSource ke query param yang diterima backend */
const SENSOR_PARAM: Record<SensorSource, string> = {
    VIIRS_SNPP: 'VIIRS_SNPP_NRT',
    VIIRS_NOAA20: 'VIIRS_NOAA20_NRT',
    MODIS_NRT: 'MODIS_NRT',
};

/**
 * Parse CSV response dari NASA FIRMS.
 * Header kolom bervariasi antar sensor; kita deteksi secara dinamis.
 */
function parseFirmsCsv(
    csv: string,
    source: SensorSource,
): WildfireHotspot[] {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const idx = (name: string) => headers.indexOf(name);

    const latIdx = idx('latitude');
    const lonIdx = idx('longitude');
    // VIIRS pakai bright_ti4, MODIS pakai brightness
    const brightIdx =
        idx('bright_ti4') !== -1 ? idx('bright_ti4') : idx('brightness');
    const frpIdx = idx('frp');
    const confIdx = idx('confidence');
    const dateIdx = idx('acq_date');
    const timeIdx = idx('acq_time');
    const satIdx = idx('satellite');

    if (latIdx === -1 || lonIdx === -1) {
        return [];
    }

    const hotspots: WildfireHotspot[] = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 4) {
            continue;
        }

        const lat = parseFloat(cols[latIdx]);
        const lon = parseFloat(cols[lonIdx]);
        if (isNaN(lat) || isNaN(lon)) {
            continue;
        }

        const confidence = confIdx !== -1 ? cols[confIdx].trim() : 'n';
        const brightness =
            brightIdx !== -1 ? parseFloat(cols[brightIdx]) : 0;
        const frp = frpIdx !== -1 ? parseFloat(cols[frpIdx]) : 0;

        hotspots.push({
            id: `${source}-${i}-${lat.toFixed(4)}-${lon.toFixed(4)}`,
            latitude: lat,
            longitude: lon,
            brightness: isNaN(brightness) ? 0 : brightness,
            frp: isNaN(frp) ? 0 : frp,
            confidence,
            confidenceLevel: parseConfidenceLevel(confidence),
            acquisitionDate: dateIdx !== -1 ? cols[dateIdx].trim() : '',
            acquisitionTime: timeIdx !== -1 ? cols[timeIdx].trim() : '',
            satellite: satIdx !== -1 ? cols[satIdx].trim() : '',
            source,
            province: detectProvince(lat, lon),
        });
    }

    return hotspots;
}

interface CacheEntry {
    data: WildfireHotspot[];
    timestamp: number;
}

const cache: Record<string, CacheEntry> = {};

/**
 * Fetch data dari proxy Laravel (menghindari CORS NASA FIRMS).
 * Route: GET /api/wildfire/hotspots?sensor=VIIRS_SNPP_NRT&days=1
 */
async function fetchSensorData(
    source: SensorSource,
    dayRange: number,
): Promise<WildfireHotspot[]> {
    const cacheKey = `${source}-${dayRange}`;
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
    }

    const params = new URLSearchParams({
        sensor: SENSOR_PARAM[source],
        days: String(dayRange),
    });

    const response = await fetch(`/api/wildfire/hotspots?${params.toString()}`, {
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
            error?: string;
        };
        throw new Error(
            body.error ?? `HTTP ${response.status} dari /api/wildfire/hotspots`,
        );
    }

    const json = (await response.json()) as { csv?: string; error?: string };

    if (json.error) {
        throw new Error(json.error);
    }

    const hotspots = parseFirmsCsv(json.csv ?? '', source);
    cache[cacheKey] = { data: hotspots, timestamp: Date.now() };
    return hotspots;
}

function computeStats(hotspots: WildfireHotspot[]): WildfireStats {
    const byProvince: Record<string, number> = {};
    const byConfidence: Record<ConfidenceLevel, number> = {
        high: 0,
        nominal: 0,
        low: 0,
    };
    const bySensor: Record<SensorSource, number> = {
        VIIRS_SNPP: 0,
        VIIRS_NOAA20: 0,
        MODIS_NRT: 0,
    };

    for (const h of hotspots) {
        const prov = h.province ?? 'Tidak Diketahui';
        byProvince[prov] = (byProvince[prov] ?? 0) + 1;
        byConfidence[h.confidenceLevel]++;
        bySensor[h.source]++;
    }

    return { total: hotspots.length, byProvince, byConfidence, bySensor };
}

export interface UseWildfireDataOptions {
    /** Sensor yang diaktifkan, default: VIIRS SNPP + NOAA-20 */
    enabledSensors?: SensorSource[];
    /** Jumlah hari ke belakang, default: 1 */
    dayRange?: number;
}

/**
 * Hook untuk fetch dan mengelola data titik api NASA FIRMS.
 * Data diambil melalui proxy Laravel untuk menghindari CORS.
 *
 * @example
 * ```tsx
 * const { hotspots, stats, isLoading } = useWildfireData();
 * ```
 */
export function useWildfireData({
    enabledSensors = ['VIIRS_SNPP', 'VIIRS_NOAA20'],
    dayRange = 1,
}: UseWildfireDataOptions = {}): WildfireData {
    const [hotspots, setHotspots] = useState<WildfireHotspot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const sensorsKey = enabledSensors.join(',');

    const fetchData = useCallback(async () => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        try {
            const results = await Promise.allSettled(
                enabledSensors.map((sensor) =>
                    fetchSensorData(sensor, dayRange),
                ),
            );

            const allHotspots: WildfireHotspot[] = [];
            const errors: string[] = [];

            for (const result of results) {
                if (result.status === 'fulfilled') {
                    allHotspots.push(...result.value);
                } else {
                    errors.push(
                        result.reason instanceof Error
                            ? result.reason.message
                            : String(result.reason),
                    );
                }
            }

            // Deduplicate titik yang sangat berdekatan (± 0.01°)
            const unique = allHotspots.filter((h, i) => {
                return !allHotspots.slice(0, i).some(
                    (prev) =>
                        Math.abs(prev.latitude - h.latitude) < 0.01 &&
                        Math.abs(prev.longitude - h.longitude) < 0.01,
                );
            });

            setHotspots(unique);
            setLastUpdated(new Date());

            if (errors.length > 0 && allHotspots.length === 0) {
                setError(errors.join('; '));
            } else if (errors.length > 0) {
                console.warn('[useWildfireData] Partial errors:', errors);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sensorsKey, dayRange]);

    useEffect(() => {
        void fetchData();
        return () => {
            abortRef.current?.abort();
        };
    }, [fetchData]);

    const stats = computeStats(hotspots);

    return {
        hotspots,
        stats,
        isLoading,
        error,
        lastUpdated,
        refresh: fetchData,
    };
}
