import { useCallback, useEffect, useRef, useState } from 'react';

/** Cache TTL: 10 menit */
const CACHE_TTL_MS = 10 * 60 * 1000;

export type ConfidenceLevel = 'high' | 'nominal' | 'low';
export type SensorSource = 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'MODIS_NRT';

/**
 * 3 Kategori Pengelompokan Anomali Termal Spasial:
 * 1. active_fire: 🔥 Kebakaran Aktif (Kobaran api menyala terbuka terkonfirmasi)
 * 2. smoke_peat: 💨 Potensi Asap & Gambut (Bara gambut membara bawah tanah / penghasil kabut asap pekat)
 * 3. heat_anomaly: ☀️ Panas Berlebih (Anomali suhu panas permukaan / vegetasi kering rawan api)
 */
export type HotspotCategory = 'active_fire' | 'smoke_peat' | 'heat_anomaly';

export interface CategoryMetadata {
    key: HotspotCategory;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
}

export const HOTSPOT_CATEGORIES: Record<HotspotCategory, CategoryMetadata> = {
    active_fire: {
        key: 'active_fire',
        title: 'Potensi Tinggi',
        subtitle: 'Suhu Sangat Panas',
        description:
            'Titik anomali termal bersuhu sangat tinggi dengan radiasi kuat, menandakan potensi tinggi terjadinya kebakaran lahan atau vegetasi kering.',
        icon: '🔥',
        color: '#B91C1C',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
    },
    smoke_peat: {
        key: 'smoke_peat',
        title: 'Potensi Sedang',
        subtitle: 'Suhu Panas Sedang',
        description:
            'Titik anomali termal sedang atau bara bawah tanah gambut yang berpotensi menghasilkan asap jika terpapar angin.',
        icon: '🟡',
        color: '#E5A910',
        badgeBg: 'bg-yellow-50',
        badgeText: 'text-yellow-800',
        badgeBorder: 'border-yellow-200',
    },
    heat_anomaly: {
        key: 'heat_anomaly',
        title: 'Potensi Rendah',
        subtitle: 'Suhu Hangat / Terkendali',
        description:
            'Anomali suhu termal ringan permukaan tanah. Potensi kebakaran tergolong rendah dan situasi lingkungan terkendali.',
        icon: '🟢',
        color: '#15803D',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-800',
        badgeBorder: 'border-emerald-200',
    },
};

/**
 * Standar Ambang Batas Logis Suhu Permukaan & Radiasi Termal untuk Karhutla Tropis:
 *
 * 1. POTENSI TINGGI (Merah Pekat):
 *    - VIIRS (375m): Suhu Permukaan >= 70.0°C ATAU FRP >= 12.0 MW
 *    - MODIS (1000m): Suhu Permukaan >= 45.0°C ATAU FRP >= 15.0 MW
 *    -> Panas ekstrem & kobaran api aktif.
 *
 * 2. POTENSI SEDANG (Kuning Pekat):
 *    - VIIRS (375m): Suhu Permukaan 60.0°C - 69.9°C ATAU FRP 5.0 - 11.9 MW
 *    - MODIS (1000m): Suhu Permukaan 36.0°C - 44.9°C ATAU FRP 6.0 - 14.9 MW
 *    -> Anomali panas sedang / bara tanah gambut (smoldering).
 *
 * 3. POTENSI RENDAH (Hijau Tua):
 *    - VIIRS (375m): Suhu Permukaan < 60.0°C DAN FRP < 5.0 MW
 *    - MODIS (1000m): Suhu Permukaan < 36.0°C DAN FRP < 6.0 MW
 *    -> Anomali termal ringan / suhu hangat normal terkendali.
 */
export function determineConfidenceLevel(
    brightnessKelvin: number,
    frp: number,
    source: SensorSource = 'VIIRS_SNPP',
): ConfidenceLevel {
    const tempCelsius = brightnessKelvin > 0 ? brightnessKelvin - 273.15 : 0;
    const isModis = source === 'MODIS_NRT';

    if (isModis) {
        if (tempCelsius >= 45 || frp >= 15) {
            return 'high';
        }
        if (tempCelsius >= 36 || frp >= 6) {
            return 'nominal';
        }
        return 'low';
    }

    // VIIRS SNPP / NOAA-20
    if (tempCelsius >= 70 || frp >= 12) {
        return 'high';
    }
    if (tempCelsius >= 60 || frp >= 5) {
        return 'nominal';
    }
    return 'low';
}

/**
 * Pemetaan 1-ke-1 yang selaras penuh antara confidence level, kategori, dan warna:
 * - 'high'    <==> 'active_fire'  <==> 🔴 Potensi Tinggi (Merah Pekat)
 * - 'nominal' <==> 'smoke_peat'   <==> 🟡 Potensi Sedang (Kuning Pekat)
 * - 'low'     <==> 'heat_anomaly' <==> 🟢 Potensi Rendah (Hijau Tua)
 */
export function classifyHotspot(confidenceLevel: ConfidenceLevel): HotspotCategory {
    switch (confidenceLevel) {
        case 'high':
            return 'active_fire';
        case 'nominal':
            return 'smoke_peat';
        case 'low':
        default:
            return 'heat_anomaly';
    }
}

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
    /** Kategori ramah pengguna */
    category: HotspotCategory;
    acquisitionDate: string;
    acquisitionTime: string;
    satellite: string;
    source: SensorSource;
    /** Nama provinsi Kalimantan (jika terdeteksi) */
    province: string | null;
    /** Deteksi Siang ('D') atau Malam ('N') */
    daynight: 'D' | 'N';
}

export interface ProvinceDetail {
    name: string;
    shortName: string;
    count: number;
    totalFrp: number;
    avgFrp: number;
    maxFrp: number;
    percentage: number;
    activeFireCount: number;
    smokePeatCount: number;
    heatAnomalyCount: number;
    center: [number, number];
    zoom: number;
}

export interface WildfireStats {
    total: number;
    byProvince: Record<string, number>;
    provinceDetails: ProvinceDetail[];
    byConfidence: Record<ConfidenceLevel, number>;
    byCategory: {
        active_fire: number;
        smoke_peat: number;
        heat_anomaly: number;
    };
    bySensor: Record<SensorSource, number>;
    byDayNight: {
        day: number;
        night: number;
    };
    totalFrp: number;
    avgFrp: number;
    maxFrp: number;
    maxFrpLocation: {
        latitude: number;
        longitude: number;
        province: string | null;
        frp: number;
    } | null;
    hazeRiskLevel: 'Aman' | 'Waspada' | 'Tinggi' | 'Kritis';
    mostAffectedProvince: string | null;
    highConfidencePercentage: number;
}

export interface WildfireData {
    hotspots: WildfireHotspot[];
    stats: WildfireStats;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refresh: () => void;
}

/** Batas bounding box per provinsi Kalimantan untuk klasifikasi titik api */
export const PROVINCE_CONFIG: Array<{
    name: string;
    shortName: string;
    latMin: number;
    latMax: number;
    lonMin: number;
    lonMax: number;
    center: [number, number];
    zoom: number;
}> = [
    {
        name: 'Kalimantan Barat',
        shortName: 'Kalbar',
        latMin: -3.1,
        latMax: 2.1,
        lonMin: 108.0,
        lonMax: 114.3,
        center: [-0.0263, 109.3425],
        zoom: 7,
    },
    {
        name: 'Kalimantan Tengah',
        shortName: 'Kalteng',
        latMin: -4.5,
        latMax: -0.2,
        lonMin: 111.0,
        lonMax: 116.0,
        center: [-1.6815, 113.3824],
        zoom: 7,
    },
    {
        name: 'Kalimantan Selatan',
        shortName: 'Kalsel',
        latMin: -4.5,
        latMax: -1.2,
        lonMin: 114.3,
        lonMax: 117.0,
        center: [-3.0926, 115.2838],
        zoom: 8,
    },
    {
        name: 'Kalimantan Timur',
        shortName: 'Kaltim',
        latMin: -2.0,
        latMax: 3.5,
        lonMin: 114.5,
        lonMax: 119.2,
        center: [0.5387, 116.4194],
        zoom: 7,
    },
    {
        name: 'Kalimantan Utara',
        shortName: 'Kaltara',
        latMin: 2.5,
        latMax: 7.5,
        lonMin: 114.5,
        lonMax: 119.5,
        center: [3.0731, 116.0414],
        zoom: 7,
    },
];

function detectProvince(lat: number, lon: number): string | null {
    for (const prov of PROVINCE_CONFIG) {
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

const SENSOR_PARAM: Record<SensorSource, string> = {
    VIIRS_SNPP: 'VIIRS_SNPP_NRT',
    VIIRS_NOAA20: 'VIIRS_NOAA20_NRT',
    MODIS_NRT: 'MODIS_NRT',
};

/**
 * Parse CSV response dari NASA FIRMS.
 */
function parseFirmsCsv(csv: string, source: SensorSource): WildfireHotspot[] {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const idx = (name: string) => headers.indexOf(name);

    const latIdx = idx('latitude');
    const lonIdx = idx('longitude');
    const brightIdx =
        idx('bright_ti4') !== -1 ? idx('bright_ti4') : idx('brightness');
    const frpIdx = idx('frp');
    const confIdx = idx('confidence');
    const dateIdx = idx('acq_date');
    const timeIdx = idx('acq_time');
    const satIdx = idx('satellite');
    const daynightIdx = idx('daynight');

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
        const rawBrightness = brightIdx !== -1 ? parseFloat(cols[brightIdx]) : 0;
        const rawTi5 = idx('bright_ti5') !== -1 ? parseFloat(cols[idx('bright_ti5')]) : 0;
        let brightness = isNaN(rawBrightness) ? 0 : rawBrightness;
        // Penjagaan nilai anomali awan dingin (< 273.15 K) di iklim khatulistiwa
        if (brightness < 273.15) {
            brightness = !isNaN(rawTi5) && rawTi5 >= 273.15 ? rawTi5 : 298.15;
        }

        const rawFrp = frpIdx !== -1 ? parseFloat(cols[frpIdx]) : 0;
        const frp = isNaN(rawFrp) ? 0 : Math.max(0, rawFrp);
        const daynightRaw =
            daynightIdx !== -1 ? cols[daynightIdx]?.trim().toUpperCase() : 'D';
        const daynight: 'D' | 'N' = daynightRaw === 'N' ? 'N' : 'D';

        // Tentukan tingkat potensi kebakaran berdasarkan standar minimum suhu & radiasi termal
        const confidenceLevel = determineConfidenceLevel(brightness, frp, source);
        const category = classifyHotspot(confidenceLevel);

        hotspots.push({
            id: `${source}-${i}-${lat.toFixed(4)}-${lon.toFixed(4)}`,
            latitude: lat,
            longitude: lon,
            brightness,
            frp,
            confidence,
            confidenceLevel,
            category,
            acquisitionDate: dateIdx !== -1 ? cols[dateIdx].trim() : '',
            acquisitionTime: timeIdx !== -1 ? cols[timeIdx].trim() : '',
            satellite: satIdx !== -1 ? cols[satIdx].trim() : '',
            source,
            province: detectProvince(lat, lon),
            daynight,
        });
    }

    return hotspots;
}

interface CacheEntry {
    data: WildfireHotspot[];
    timestamp: number;
}

const cache: Record<string, CacheEntry> = {};

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
    const total = hotspots.length;
    const byProvince: Record<string, number> = {};
    const frpByProvince: Record<
        string,
        {
            totalFrp: number;
            maxFrp: number;
            activeFireCount: number;
            smokePeatCount: number;
            heatAnomalyCount: number;
        }
    > = {};

    const byConfidence: Record<ConfidenceLevel, number> = {
        high: 0,
        nominal: 0,
        low: 0,
    };

    const byCategory = {
        active_fire: 0,
        smoke_peat: 0,
        heat_anomaly: 0,
    };

    const bySensor: Record<SensorSource, number> = {
        VIIRS_SNPP: 0,
        VIIRS_NOAA20: 0,
        MODIS_NRT: 0,
    };

    const byDayNight = {
        day: 0,
        night: 0,
    };

    let totalFrp = 0;
    let maxFrp = 0;
    let maxFrpLocation: WildfireStats['maxFrpLocation'] = null;

    for (const h of hotspots) {
        const prov = h.province ?? 'Luar Batas';
        byProvince[prov] = (byProvince[prov] ?? 0) + 1;

        if (!frpByProvince[prov]) {
            frpByProvince[prov] = {
                totalFrp: 0,
                maxFrp: 0,
                activeFireCount: 0,
                smokePeatCount: 0,
                heatAnomalyCount: 0,
            };
        }
        frpByProvince[prov].totalFrp += h.frp;
        if (h.frp > frpByProvince[prov].maxFrp) {
            frpByProvince[prov].maxFrp = h.frp;
        }

        if (h.category === 'active_fire') {
            frpByProvince[prov].activeFireCount++;
        } else if (h.category === 'smoke_peat') {
            frpByProvince[prov].smokePeatCount++;
        } else {
            frpByProvince[prov].heatAnomalyCount++;
        }

        byConfidence[h.confidenceLevel]++;
        byCategory[h.category]++;
        bySensor[h.source]++;

        if (h.daynight === 'N') {
            byDayNight.night++;
        } else {
            byDayNight.day++;
        }

        totalFrp += h.frp;
        if (h.frp > maxFrp) {
            maxFrp = h.frp;
            maxFrpLocation = {
                latitude: h.latitude,
                longitude: h.longitude,
                province: h.province,
                frp: h.frp,
            };
        }
    }

    const avgFrp = total > 0 ? Number((totalFrp / total).toFixed(1)) : 0;
    totalFrp = Number(totalFrp.toFixed(1));
    maxFrp = Number(maxFrp.toFixed(1));

    // Siapkan detail per provinsi
    const provinceDetails: ProvinceDetail[] = PROVINCE_CONFIG.map((cfg) => {
        const count = byProvince[cfg.name] ?? 0;
        const provData = frpByProvince[cfg.name];
        const provFrp = provData?.totalFrp ?? 0;
        const pMaxFrp = provData?.maxFrp ?? 0;
        return {
            name: cfg.name,
            shortName: cfg.shortName,
            count,
            totalFrp: Number(provFrp.toFixed(1)),
            avgFrp: count > 0 ? Number((provFrp / count).toFixed(1)) : 0,
            maxFrp: Number(pMaxFrp.toFixed(1)),
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            activeFireCount: provData?.activeFireCount ?? 0,
            smokePeatCount: provData?.smokePeatCount ?? 0,
            heatAnomalyCount: provData?.heatAnomalyCount ?? 0,
            center: cfg.center,
            zoom: cfg.zoom,
        };
    }).sort((a, b) => b.count - a.count);

    const mostAffectedProvince =
        provinceDetails[0]?.count > 0 ? provinceDetails[0].name : null;

    // Tingkat Risiko Asap (Haze Risk Level)
    let hazeRiskLevel: WildfireStats['hazeRiskLevel'] = 'Aman';
    if (byCategory.active_fire >= 50 || byCategory.smoke_peat >= 100 || totalFrp >= 3000) {
        hazeRiskLevel = 'Kritis';
    } else if (byCategory.active_fire >= 15 || byCategory.smoke_peat >= 40 || totalFrp >= 1000) {
        hazeRiskLevel = 'Tinggi';
    } else if (byCategory.active_fire >= 5 || byCategory.smoke_peat >= 15 || totalFrp >= 200) {
        hazeRiskLevel = 'Waspada';
    }

    const highConfidencePercentage =
        total > 0 ? Math.round((byConfidence.high / total) * 100) : 0;

    return {
        total,
        byProvince,
        provinceDetails,
        byConfidence,
        byCategory,
        bySensor,
        byDayNight,
        totalFrp,
        avgFrp,
        maxFrp,
        maxFrpLocation,
        hazeRiskLevel,
        mostAffectedProvince,
        highConfidencePercentage,
    };
}

export interface UseWildfireDataOptions {
    enabledSensors?: SensorSource[];
    dayRange?: number;
}

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

            // Urutkan titik api berdasarkan FRP (paling intens di atas)
            const sorted = allHotspots.sort((a, b) => b.frp - a.frp);

            // Deduplikasi yang berdekatan
            const unique = sorted.filter((h, i) => {
                return !sorted.slice(0, i).some(
                    (prev) =>
                        Math.abs(prev.latitude - h.latitude) < 0.008 &&
                        Math.abs(prev.longitude - h.longitude) < 0.008,
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
