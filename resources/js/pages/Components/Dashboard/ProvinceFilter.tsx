export interface ProvinceItem {
    name: string;
    shortName: string;
    center: [number, number];
    zoom: number;
}

export const BORNEO_PROVINCES: ProvinceItem[] = [
    {
        name: 'Kalimantan Barat',
        shortName: 'Kalbar',
        center: [-0.0263, 109.3425],
        zoom: 7,
    },
    {
        name: 'Kalimantan Tengah',
        shortName: 'Kalteng',
        center: [-1.6815, 113.3824],
        zoom: 7,
    },
    {
        name: 'Kalimantan Selatan',
        shortName: 'Kalsel',
        center: [-3.0926, 115.2838],
        zoom: 8,
    },
    {
        name: 'Kalimantan Timur',
        shortName: 'Kaltim',
        center: [0.5387, 116.4194],
        zoom: 7,
    },
    {
        name: 'Kalimantan Utara',
        shortName: 'Kaltara',
        center: [3.0731, 116.0414],
        zoom: 7,
    },
];

interface ProvinceFilterProps {
    selectedProvince: string | null;
    onSelect: (province: ProvinceItem | null) => void;
    countsByProvince?: Record<string, number>;
    totalCount?: number;
    hasUserHome?: boolean;
    isHomeSelected?: boolean;
    onSelectHome?: () => void;
    userSafetyStatus?: 'safe' | 'warning' | 'danger';
}

export default function ProvinceFilter({
    selectedProvince,
    onSelect,
    countsByProvince = {},
    totalCount,
    hasUserHome = false,
    isHomeSelected = false,
    onSelectHome,
    userSafetyStatus = 'safe',
}: ProvinceFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Lokasi Rumah Pengguna */}
            {hasUserHome && onSelectHome && (
                <button
                    type="button"
                    onClick={onSelectHome}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isHomeSelected
                            ? 'bg-[#1F6F5F] text-white shadow-xs font-bold ring-2 ring-[#2FA084]/40'
                            : 'bg-white text-[#1F6F5F] hover:bg-[#EEEEEE] border border-[#EEEEEE]'
                    }`}
                >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            userSafetyStatus === 'danger'
                                ? 'bg-rose-500 animate-ping'
                                : userSafetyStatus === 'warning'
                                  ? 'bg-amber-500 animate-pulse'
                                  : 'bg-[#2FA084]'
                        }`}
                    />
                    <span>📍 Rumah Saya</span>
                </button>
            )}

            {/* Tombol Seluruh Borneo */}
            <button
                type="button"
                onClick={() => onSelect(null)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedProvince === null && !isHomeSelected
                        ? 'bg-[#2FA084] text-white shadow-xs font-bold'
                        : 'bg-[#EEEEEE] text-[#1F6F5F] hover:bg-[#2FA084]/15'
                }`}
            >
                <span>Seluruh Borneo</span>
                {totalCount !== undefined && totalCount > 0 && (
                    <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            selectedProvince === null
                                ? 'bg-white/20 text-white'
                                : 'bg-white text-[#1F6F5F] border border-[#EEEEEE]'
                        }`}
                    >
                        {totalCount.toLocaleString('id-ID')}
                    </span>
                )}
            </button>

            {/* Tombol 5 Provinsi */}
            {BORNEO_PROVINCES.map((prov) => {
                const count = countsByProvince[prov.name] ?? 0;
                const isSelected = selectedProvince === prov.name;

                return (
                    <button
                        key={prov.name}
                        type="button"
                        onClick={() => onSelect(prov)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                                ? 'bg-[#2FA084] text-white shadow-xs font-bold'
                                : 'bg-[#EEEEEE] text-[#1F6F5F] hover:bg-[#2FA084]/15'
                        }`}
                    >
                        <span>{prov.shortName}</span>
                        {count > 0 && (
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                    isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-white text-[#1F6F5F] border border-[#EEEEEE]'
                                }`}
                            >
                                {count.toLocaleString('id-ID')}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
