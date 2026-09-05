import type L from 'leaflet';
import type { ConfidenceLevel } from '@/hooks/useWildfireData';

export const NASA_API_KEY: string =
    (import.meta.env.NASA_API_KEY as string | undefined) ??
    (import.meta.env.VITE_NASA_API_KEY as string | undefined) ??
    '';

/** Batas wilayah koordinat Pulau Kalimantan (Borneo) diperluas agar auto-pan popup tidak terpotong */
export const KALIMANTAN_BOUNDS: L.LatLngBoundsExpression = [
    [-8.5, 104.0], // Barat Daya (ruang leluasa ke arah Laut Jawa & Selat Karimata)
    [11.5, 124.0], // Timur Laut (ruang leluasa ke arah Laut Sulu & Laut Cina Selatan)
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
 * Palet Warna Indikator Situasi Karhutla & Asap:
 * - Rendah = Hijau Tua (#15803D)
 * - Sedang = Kuning Pekat (#E5A910)
 * - Tinggi = Merah Pekat (#B91C1C)
 */
export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
    high: '#B91C1C',    // Merah Pekat (Potensi Bahaya Karhutla Tinggi)
    nominal: '#E5A910', // Kuning Pekat (Waspada Asap & Bara Gambut)
    low: '#15803D',     // Hijau Tua (Rendah & Relatif Aman)
};

export const CONFIDENCE_FILL_OPACITY: Record<ConfidenceLevel, number> = {
    high: 0.90,
    nominal: 0.75,
    low: 0.65,
};

/**
 * Standar Minimum Suhu & Penjelasan Informatif Valid (Tanpa Overclaim):
 * - Tinggi: Suhu >= 70°C atau FRP >= 12 MW
 * - Sedang: Suhu 60°C - 69.9°C atau FRP 5.0 - 11.9 MW
 * - Rendah: Suhu < 60°C dan FRP < 5.0 MW
 */
export const CONFIDENCE_DESCRIPTIONS: Record<
    ConfidenceLevel,
    { title: string; subtitle: string; desc: string; advice: string }
> = {
    high: {
        title: 'Potensi Kebakaran Tinggi (Merah)',
        subtitle: 'Anomali Panas Ekstrem (≥ 70°C / FRP ≥ 12 MW)',
        desc: 'Suhu permukaan tanah terdeteksi ≥ 70°C atau radiasi panas FRP sangat kuat (≥ 12 MW). Mengindikasikan potensi kebakaran tajuk atau kobaran api nyata yang membahayakan.',
        advice: 'Waspada tinggi jika berada di sekitar lokasi. Tutup ventilasi bila tercium asap, kenakan masker N95, dan segera laporkan ke posko.',
    },
    nominal: {
        title: 'Potensi Kebakaran Sedang (Kuning)',
        subtitle: 'Anomali Suhu Sedang (60°C – 69.9°C)',
        desc: 'Suhu permukaan tanah 60°C – 69.9°C atau radiasi sedang (5.0 – 11.9 MW). Berpotensi merupakan bara di lapisan tanah gambut (smoldering) atau sisa pembersihan lahan.',
        advice: 'Kondisi perlu dipantau. Warga rentan (lansia, anak-anak, penderita asma) disarankan bersiap masker jika mulai tercium asap.',
    },
    low: {
        title: 'Potensi Kebakaran Rendah (Hijau)',
        subtitle: 'Suhu Hangat / Terkendali (< 60°C)',
        desc: 'Suhu permukaan tanah di bawah 60°C dengan radiasi minimal (< 5.0 MW). Merupakan anomali termal ringan atau panas permukaan normal dengan risiko kebakaran rendah.',
        advice: 'Udara dan lingkungan relatif aman. Aktivitas luar ruangan warga dapat dilakukan secara normal.',
    },
};

