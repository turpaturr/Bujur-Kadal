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
}

export default function ProvinceFilter({
    selectedProvince,
    onSelect,
}: ProvinceFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <button
                type="button"
                onClick={() => onSelect(null)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedProvince === null
                        ? 'bg-[#14967F] text-white shadow-xs'
                        : 'bg-[#CCECEE]/50 text-[#095D7E] hover:bg-[#CCECEE]'
                }`}
            >
                Seluruh Borneo
            </button>
            {BORNEO_PROVINCES.map((prov) => (
                <button
                    key={prov.name}
                    type="button"
                    onClick={() => onSelect(prov)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedProvince === prov.name
                            ? 'bg-[#14967F] text-white shadow-xs'
                            : 'bg-[#CCECEE]/50 text-[#095D7E] hover:bg-[#CCECEE]'
                    }`}
                >
                    {prov.shortName}
                </button>
            ))}
        </div>
    );
}
