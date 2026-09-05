import type {
    ConfidenceLevel,
    SensorSource,
    WildfireData,
    WildfireStats,
} from '@/hooks/useWildfireData';

interface WildfirePanelProps {
    wildfire: WildfireData;
    enabledSensors: SensorSource[];
    onToggleSensor: (sensor: SensorSource) => void;
}

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
    high: 'Tinggi',
    nominal: 'Sedang',
    low: 'Rendah',
};

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
    high: 'bg-red-500',
    nominal: 'bg-orange-400',
    low: 'bg-yellow-400',
};

const CONFIDENCE_TEXT_COLORS: Record<ConfidenceLevel, string> = {
    high: 'text-red-600',
    nominal: 'text-orange-500',
    low: 'text-yellow-600',
};

const SENSOR_LABELS: Record<SensorSource, string> = {
    VIIRS_SNPP: 'VIIRS Suomi-NPP',
    VIIRS_NOAA20: 'VIIRS NOAA-20',
    MODIS_NRT: 'MODIS NRT',
};

const BORNEO_PROVINCES = [
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
];

function formatLastUpdated(date: Date | null): string {
    if (!date) {
        return '-';
    }
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    });
}

function ProvinceRow({
    name,
    count,
    total,
}: {
    name: string;
    count: number;
    total: number;
}) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2">
            <span className="w-36 shrink-0 truncate text-xs text-[#262626]/70">
                {name.replace('Kalimantan ', 'Kal. ')}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#CCECEE]/60">
                <div
                    className="h-full rounded-full bg-[#14967F] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-bold text-[#262626]">
                {count}
            </span>
        </div>
    );
}

function getSeverityLabel(stats: WildfireStats): {
    label: string;
    color: string;
} {
    const { high, nominal } = stats.byConfidence;
    if (high >= 20 || stats.total >= 100) {
        return { label: 'KRITIS', color: 'text-red-600' };
    }
    if (high >= 5 || nominal >= 20 || stats.total >= 30) {
        return { label: 'WASPADA', color: 'text-orange-500' };
    }
    if (stats.total > 0) {
        return { label: 'PANTAU', color: 'text-yellow-600' };
    }
    return { label: 'AMAN', color: 'text-emerald-600' };
}

export default function WildfirePanel({
    wildfire,
    enabledSensors,
    onToggleSensor,
}: WildfirePanelProps) {
    const { stats, isLoading, error, lastUpdated, refresh } = wildfire;
    const severity = getSeverityLabel(stats);

    return (
        <div className="overflow-hidden rounded-2xl border border-[#CCECEE] bg-white shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#CCECEE] px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <span className="text-lg">🔥</span>
                    <div>
                        <h2 className="text-sm font-bold text-[#095D7E]">
                            Wildfire Tracker — Kalimantan
                        </h2>
                        <p className="text-xs text-[#262626]/60">
                            Data titik api aktif · NASA FIRMS
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Severity badge */}
                    {!isLoading && !error && (
                        <span
                            className={`rounded-full border border-current px-2.5 py-0.5 text-xs font-bold ${severity.color}`}
                        >
                            {severity.label}
                        </span>
                    )}

                    {/* Status badge */}
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isLoading
                                ? 'bg-slate-100 text-slate-500'
                                : error
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-emerald-50 text-emerald-700'
                        }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                isLoading
                                    ? 'animate-pulse bg-slate-400'
                                    : error
                                      ? 'bg-red-400'
                                      : 'animate-pulse bg-emerald-500'
                            }`}
                        />
                        {isLoading
                            ? 'Memuat...'
                            : error
                              ? 'Error'
                              : 'Live Data'}
                    </span>

                    {/* Refresh button */}
                    <button
                        type="button"
                        onClick={refresh}
                        disabled={isLoading}
                        title="Perbarui data"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#095D7E]/20 text-[#095D7E] transition-colors hover:bg-[#CCECEE]/40 disabled:opacity-40"
                    >
                        <svg
                            className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-0 divide-y divide-[#CCECEE]/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {/* Kolom 1: Statistik Utama */}
                <div className="px-4 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#095D7E]">
                        Ringkasan Hari Ini
                    </p>

                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-4 animate-pulse rounded bg-[#CCECEE]/60"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-lg bg-red-50 p-3">
                            <p className="text-xs text-red-600">{error}</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 flex items-end gap-1">
                                <span className="text-4xl font-bold text-[#262626]">
                                    {stats.total}
                                </span>
                                <span className="mb-1 text-xs text-[#262626]/60">
                                    titik api
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                {(
                                    ['high', 'nominal', 'low'] as ConfidenceLevel[]
                                ).map((level) => (
                                    <div
                                        key={level}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <span
                                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${CONFIDENCE_COLORS[level]}`}
                                        />
                                        <span className="text-[#262626]/70">
                                            {CONFIDENCE_LABELS[level]}
                                        </span>
                                        <span
                                            className={`ml-auto font-bold ${CONFIDENCE_TEXT_COLORS[level]}`}
                                        >
                                            {stats.byConfidence[level]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-xs text-[#262626]/50">
                                Diperbarui: {formatLastUpdated(lastUpdated)}
                            </p>
                        </>
                    )}
                </div>

                {/* Kolom 2: Per Provinsi */}
                <div className="px-4 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#095D7E]">
                        Sebaran per Provinsi
                    </p>

                    {isLoading ? (
                        <div className="space-y-3">
                            {BORNEO_PROVINCES.map((p) => (
                                <div
                                    key={p}
                                    className="h-3 animate-pulse rounded bg-[#CCECEE]/60"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <p className="text-xs text-[#262626]/50">
                            Data tidak tersedia
                        </p>
                    ) : (
                        <div className="space-y-2.5">
                            {BORNEO_PROVINCES.map((name) => (
                                <ProvinceRow
                                    key={name}
                                    name={name}
                                    count={stats.byProvince[name] ?? 0}
                                    total={stats.total}
                                />
                            ))}
                            {(stats.byProvince['Tidak Diketahui'] ?? 0) >
                                0 && (
                                <ProvinceRow
                                    name="Tidak Diketahui"
                                    count={
                                        stats.byProvince['Tidak Diketahui']
                                    }
                                    total={stats.total}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Kolom 3: Toggle Sensor & Legend */}
                <div className="px-4 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#095D7E]">
                        Sensor Aktif
                    </p>

                    <div className="mb-4 space-y-2">
                        {(
                            [
                                'VIIRS_SNPP',
                                'VIIRS_NOAA20',
                                'MODIS_NRT',
                            ] as SensorSource[]
                        ).map((sensor) => {
                            const isEnabled = enabledSensors.includes(sensor);
                            return (
                                <label
                                    key={sensor}
                                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[#CCECEE] px-3 py-2 transition-colors hover:bg-[#CCECEE]/20"
                                >
                                    <span className="text-xs font-medium text-[#262626]">
                                        {SENSOR_LABELS[sensor]}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {!isLoading &&
                                            !error &&
                                            isEnabled && (
                                                <span className="text-xs text-[#262626]/50">
                                                    {wildfire.stats.bySensor[
                                                        sensor
                                                    ] ?? 0}
                                                </span>
                                            )}
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={isEnabled}
                                            onClick={() =>
                                                onToggleSensor(sensor)
                                            }
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                                isEnabled
                                                    ? 'bg-[#14967F]'
                                                    : 'bg-slate-200'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                                    isEnabled
                                                        ? 'translate-x-4'
                                                        : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#095D7E]">
                        Legenda
                    </p>
                    <div className="space-y-1.5">
                        {(
                            ['high', 'nominal', 'low'] as ConfidenceLevel[]
                        ).map((level) => (
                            <div
                                key={level}
                                className="flex items-center gap-2 text-xs"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                >
                                    <circle
                                        cx="7"
                                        cy="7"
                                        r="6"
                                        className={
                                            level === 'high'
                                                ? 'fill-red-500'
                                                : level === 'nominal'
                                                  ? 'fill-orange-400'
                                                  : 'fill-yellow-400'
                                        }
                                        fillOpacity="0.85"
                                    />
                                </svg>
                                <span className="text-[#262626]/70">
                                    Confidence {CONFIDENCE_LABELS[level]}
                                </span>
                            </div>
                        ))}
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#262626]/50">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                            >
                                <circle
                                    cx="7"
                                    cy="7"
                                    r="4"
                                    fill="none"
                                    stroke="#6b7280"
                                    strokeWidth="1.5"
                                />
                                <circle
                                    cx="7"
                                    cy="7"
                                    r="7"
                                    fill="none"
                                    stroke="#6b7280"
                                    strokeWidth="0.5"
                                />
                            </svg>
                            Ukuran ∝ FRP (Fire Radiative Power)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

