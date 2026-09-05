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
}

export default function ProvinceFilter({
    selectedProvince,
    onSelect,
    countsByProvince = {},
    totalCount,
}: ProvinceFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Seluruh Borneo */}
            <button
                type="button"
                onClick={() => onSelect(null)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedProvince === null
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
