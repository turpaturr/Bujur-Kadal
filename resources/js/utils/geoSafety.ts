import type { WildfireHotspot } from '@/hooks/useWildfireData';

export interface UserLocation {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string | null;
}

export interface NearestHotspotInfo {
    hotspot: WildfireHotspot;
    distanceKm: number;
    direction: string;
}

export interface UserSafetyAnalysis {
    hasLocation: boolean;
    userLocation: UserLocation | null;
    status: 'safe' | 'warning' | 'danger';
    statusLabel: string;
    statusColor: string;
    statusBadgeBg: string;
    statusBorder: string;
    hotspotsWithin10Km: number;
    hotspotsWithin25Km: number;
    hotspotsWithin50Km: number;
    nearestHotspot: NearestHotspotInfo | null;
    summaryText: string;
    recommendation: string;
}

/**
 * Menghitung jarak garis lurus (great-circle distance) dalam kilometer
 * menggunakan rumus Haversine.
 */
export function calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const R = 6371; // Radius bumi dalam km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
}

/**
 * Menghitung arah mata angin relatif dari titik 1 ke titik 2.
 */
export function getCompassDirection(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): string {
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const angle = (Math.atan2(dLon, dLat) * 180) / Math.PI;
    const normalized = (angle + 360) % 360;

    if (normalized >= 337.5 || normalized < 22.5) return 'Utara';
    if (normalized >= 22.5 && normalized < 67.5) return 'Timur Laut';
    if (normalized >= 67.5 && normalized < 112.5) return 'Timur';
    if (normalized >= 112.5 && normalized < 157.5) return 'Tenggara';
    if (normalized >= 157.5 && normalized < 202.5) return 'Selatan';
    if (normalized >= 202.5 && normalized < 247.5) return 'Barat Daya';
    if (normalized >= 247.5 && normalized < 292.5) return 'Barat';
    return 'Barat Laut';
}

/**
 * Menghitung jarak (Haversine) dan status keselamatan pengguna terhadap
 * sebaran titik anomali termal / potensi kebakaran satelit NASA FIRMS.
 */
export function analyzeUserSafety(
    location: UserLocation | null,
    hotspots: WildfireHotspot[],
): UserSafetyAnalysis {
    if (
        !location ||
        location.latitude === null ||
        location.latitude === undefined ||
        location.longitude === null ||
        location.longitude === undefined ||
        isNaN(Number(location.latitude)) ||
        isNaN(Number(location.longitude))
    ) {
        return {
            hasLocation: false,
            userLocation: null,
            status: 'safe',
            statusLabel: 'Lokasi Belum Disetel',
            statusColor: '#2FA084',
            statusBadgeBg: 'bg-[#2FA084]/15',
            statusBorder: 'border-[#2FA084]/30',
            hotspotsWithin10Km: 0,
            hotspotsWithin25Km: 0,
            hotspotsWithin50Km: 0,
            nearestHotspot: null,
            summaryText: 'Koordinat tempat tinggal belum disetel pada akun Anda.',
            recommendation: 'Atur koordinat tempat tinggal untuk memantau radius bahaya karhutla otomatis.',
        };
    }

    const uLat = Number(location.latitude);
    const uLon = Number(location.longitude);

    let within5 = 0;
    let within15 = 0;
    let within25 = 0;
    let nearest: NearestHotspotInfo | null = null;
    let hasHighConfidenceDanger = false;

    for (const h of hotspots) {
        const dist = calculateDistanceKm(uLat, uLon, h.latitude, h.longitude);

        if (dist <= 5) {
            within5++;
            if (h.confidenceLevel === 'high') {
                hasHighConfidenceDanger = true;
            }
        }
        if (dist <= 15) within15++;
        if (dist <= 25) within25++;

        if (!nearest || dist < nearest.distanceKm) {
            nearest = {
                hotspot: h,
                distanceKm: dist,
                direction: getCompassDirection(uLat, uLon, h.latitude, h.longitude),
            };
        }
    }

    if (within5 > 0 && hasHighConfidenceDanger) {
        return {
            hasLocation: true,
            userLocation: { ...location, latitude: uLat, longitude: uLon },
            status: 'danger',
            statusLabel: 'BAHAYA KARHUTLA (RADIUS 5KM)',
            statusColor: '#ef4444',
            statusBadgeBg: 'bg-rose-500/15 text-rose-700',
            statusBorder: 'border-rose-300',
            hotspotsWithin10Km: within5, // reuse property for compatibility
            hotspotsWithin25Km: within25,
            hotspotsWithin50Km: 0,
            nearestHotspot: nearest,
            summaryText: `PERINGATAN DARURAT: Terdeteksi titik api berpotensi TINGGI (KARHUTLA) dalam radius sangat dekat (< 5 km) dari kediaman Anda!`,
            recommendation: 'Segera lakukan evakuasi ke fasilitas kesehatan terdekat jika asap mulai pekat. Tekan tombol "Cari Rute ke Faskes Terdekat" di peta.',
        };
    }

    if (within15 > 0) {
        return {
            hasLocation: true,
            userLocation: { ...location, latitude: uLat, longitude: uLon },
            status: 'warning',
            statusLabel: 'STATUS WASPADA',
            statusColor: '#f97316',
            statusBadgeBg: 'bg-amber-500/15 text-amber-800',
            statusBorder: 'border-amber-300',
            hotspotsWithin10Km: within15,
            hotspotsWithin25Km: within25,
            hotspotsWithin50Km: 0,
            nearestHotspot: nearest,
            summaryText: `Terdeteksi ${within15} titik anomali suhu dalam radius 15 km dari rumah Anda. Titik terdekat berjarak ${nearest?.distanceKm ?? '-'} km arah ${nearest?.direction ?? '-'}.`,
            recommendation: 'Kualitas udara berpotensi menurun terbawa hembusan angin. Hindari aktivitas fisik berat di luar dan pantau arah pergerakan asap.',
        };
    }

    return {
        hasLocation: true,
        userLocation: { ...location, latitude: uLat, longitude: uLon },
        status: 'safe',
        statusLabel: 'LINGKUNGAN AMAN',
        statusColor: '#2FA084',
        statusBadgeBg: 'bg-[#2FA084]/15 text-[#1F6F5F]',
        statusBorder: 'border-[#2FA084]/30',
        hotspotsWithin10Km: 0,
        hotspotsWithin25Km: within25,
        hotspotsWithin50Km: 0,
        nearestHotspot: nearest,
        summaryText: `Kondisi sekitar kediaman Anda aman. Tidak terdeteksi ancaman karhutla tingkat tinggi dalam radius bahaya 5 km.${nearest ? ` Titik terdekat berjarak ${nearest.distanceKm} km arah ${nearest.direction}.` : ''}`,
        recommendation: 'Ventilasi udara dapat dibuka normal. Pantau terus peta pantauan satelit secara berkala.',
    };
}
