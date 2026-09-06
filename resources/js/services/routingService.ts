import { calculateDistanceKm } from '@/utils/geoSafety';

export interface RouteCoordinate {
    lat: number;
    lng: number;
}

export interface RouteEstimates {
    carMinutes: number;
    motorcycleMinutes: number;
    walkMinutes: number;
}

export interface RouteResult {
    coordinates: [number, number][]; // [lat, lng] untuk Leaflet Polyline
    distanceKm: number;
    distanceText: string;
    durationMinutes: number;
    estimates: RouteEstimates;
    source: 'osrm' | 'haversine_fallback';
}

/**
 * Mengambil rute jalan raya tercepat dari OSRM API (Open Source Routing Machine)
 * dari titik awal (origin) ke titik tujuan (destination).
 */
export async function fetchFastestRoute(
    origin: RouteCoordinate,
    destination: RouteCoordinate,
): Promise<RouteResult> {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`OSRM HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const primaryRoute = data.routes[0];
            const distanceMeters: number = primaryRoute.distance; // dalam meter
            const durationSeconds: number = primaryRoute.duration; // dalam detik

            const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
            const distanceText =
                distanceKm < 1 ? `${Math.round(distanceMeters)} m` : `${distanceKm.toFixed(1)} km`;

            // Estimasi Waktu Tempuh Berbagai Moda
            const carMinutes = Math.max(1, Math.round(durationSeconds / 60));
            // Sepeda motor biasanya 20-30% lebih lincah di kemacetan kota
            const motorcycleMinutes = Math.max(1, Math.round(carMinutes * 0.75));
            // Jalan kaki rata-rata 4.5 km/jam
            const walkMinutes = Math.max(1, Math.round((distanceKm / 4.5) * 60));

            // GeoJSON coordinates dari OSRM berbentuk [lng, lat], balik menjadi [lat, lng] untuk Leaflet
            const rawCoordinates: [number, number][] = primaryRoute.geometry?.coordinates || [];
            const coordinates: [number, number][] = rawCoordinates.map(([lng, lat]) => [lat, lng]);

            return {
                coordinates,
                distanceKm,
                distanceText,
                durationMinutes: carMinutes,
                estimates: {
                    carMinutes,
                    motorcycleMinutes,
                    walkMinutes,
                },
                source: 'osrm',
            };
        }

        throw new Error('No route returned from OSRM');
    } catch (error) {
        console.warn('OSRM routing fetch failed, using haversine fallback:', error);

        // Fallback jika offline atau network gagal: Garis lurus Haversine
        const straightDistKm = calculateDistanceKm(
            origin.lat,
            origin.lng,
            destination.lat,
            destination.lng,
        );

        const distanceText =
            straightDistKm < 1
                ? `${Math.round(straightDistKm * 1000)} m`
                : `${straightDistKm.toFixed(1)} km`;

        const roadFactor = 1.35; // Estimasi jarak jalan vs garis lurus
        const estRoadKm = straightDistKm * roadFactor;
        const carMinutes = Math.max(1, Math.round((estRoadKm / 35) * 60));
        const motorcycleMinutes = Math.max(1, Math.round((estRoadKm / 42) * 60));
        const walkMinutes = Math.max(1, Math.round((estRoadKm / 4.5) * 60));

        return {
            coordinates: [
                [origin.lat, origin.lng],
                [destination.lat, destination.lng],
            ],
            distanceKm: Math.round(estRoadKm * 10) / 10,
            distanceText,
            durationMinutes: carMinutes,
            estimates: {
                carMinutes,
                motorcycleMinutes,
                walkMinutes,
            },
            source: 'haversine_fallback',
        };
    }
}
