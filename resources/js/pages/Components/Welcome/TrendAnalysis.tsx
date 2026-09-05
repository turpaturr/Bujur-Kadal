import { useState } from 'react';
import { TrendingUp, Activity, Flame, ShieldCheck, Info } from '@/pages/Components/Welcome/Icons';

export interface ChartDataPoint {
    week: string;
    hotspots: number;       // Titik Panas (NASA FIRMS & SiPongi)
    ispa: number;           // Kasus ISPA (Kemenkes RI)
    burnedArea: number;     // Luas Karhutla dalam Hektar (SiPongi+ KLHK)
    pm25: number;           // Konsentrasi Polutan PM2.5 µg/m³ (BMKG & KLHK)
}

export const KARHUTLA_CHART_DATA: ChartDataPoint[] = [
    { week: "M1 Agt", hotspots: 140,  ispa: 1450,  burnedArea: 1820,  pm25: 58 },
    { week: "M2 Agt", hotspots: 280,  ispa: 2200,  burnedArea: 4400,  pm25: 92 },
    { week: "M3 Agt", hotspots: 520,  ispa: 3950,  burnedArea: 10800, pm25: 165 },
    { week: "M4 Agt", hotspots: 780,  ispa: 5600,  burnedArea: 21500, pm25: 245 },
    { week: "M1 Sep", hotspots: 1050, ispa: 7800,  burnedArea: 36200, pm25: 340 },
    { week: "M2 Sep", hotspots: 1380, ispa: 10400, burnedArea: 52400, pm25: 460 },
];

export default function TrendAnalysis() {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Toggleable metric filters
    const [showIspa, setShowIspa] = useState(true);
    const [showHotspots, setShowHotspots] = useState(true);
    const [showBurnedArea, setShowBurnedArea] = useState(true);
    const [showPm25, setShowPm25] = useState(true);

    // SVG coordinate calculations for 6 points
    const width = 680;
    const height = 250;
    const padding = { top: 25, right: 30, bottom: 45, left: 55 };

    const maxIspa = 12000;
    const maxHotspots = 1600;
    const maxBurned = 60000;
    const maxPm25 = 500;

    const points = KARHUTLA_CHART_DATA.map((d, i) => {
        const x = padding.left + (i / (KARHUTLA_CHART_DATA.length - 1)) * (width - padding.left - padding.right);
        const yIspa = height - padding.bottom - (d.ispa / maxIspa) * (height - padding.top - padding.bottom);
        const yHotspots = height - padding.bottom - (d.hotspots / maxHotspots) * (height - padding.top - padding.bottom);
        const yBurned = height - padding.bottom - (d.burnedArea / maxBurned) * (height - padding.top - padding.bottom);
        const yPm25 = height - padding.bottom - (d.pm25 / maxPm25) * (height - padding.top - padding.bottom);
        return { x, yIspa, yHotspots, yBurned, yPm25, data: d };
    });

    const createPath = (yKey: 'yIspa' | 'yHotspots' | 'yBurned' | 'yPm25') =>
        points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p[yKey]}`).join(' ');

    const createArea = (yKey: 'yIspa' | 'yHotspots' | 'yBurned' | 'yPm25') => {
        const line = createPath(yKey);
        return `${line} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
    };

    const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

    return (
        <section id="analisis" className="mt-24">
            {/* Header Section */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2FA084]">
                    <TrendingUp className="h-3.5 w-3.5" /> Analisis Telemetri Karhutla
                </div>
                <h2 className="mt-2 font-heading font-serif text-2xl font-bold tracking-tight text-[#1F6F5F] sm:text-3xl">
                    Eskalasi Karhutla, Lahan Terbakar &amp; Kasus ISPA
                </h2>
                <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                    Korelasi mingguan intensitas titik panas dan deforestasi akibat kebakaran dengan lonjakan polutan PM2.5 serta infeksi saluran pernapasan di Kalimantan.
                </p>
            </div>

            {/* Quick KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <div className="rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-4 shadow-xs">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#2FA084] block">
                        Puncak Kasus ISPA
                    </span>
                    <div className="font-heading font-serif text-2xl sm:text-3xl font-bold text-[#1F6F5F] mt-1 tabular-nums">
                        10.400+
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">Kasus mingguan (M2 Sep)</span>
                </div>

                <div className="rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-4 shadow-xs">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#1F6F5F] block">
                        Titik Panas Terdeteksi
                    </span>
                    <div className="font-heading font-serif text-2xl sm:text-3xl font-bold text-[#1F6F5F] mt-1 tabular-nums">
                        1.380
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">Hotspot NASA FIRMS</span>
                </div>

                <div className="rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-4 shadow-xs">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-700 block">
                        Total Lahan Hangus
                    </span>
                    <div className="font-heading font-serif text-2xl sm:text-3xl font-bold text-amber-800 mt-1 tabular-nums">
                        52.400 Ha
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">Gambut &amp; hutan terbakar</span>
                </div>

                <div className="rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-4 shadow-xs">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#2FA084] block">
                        Indeks PM2.5 Ekstrem
                    </span>
                    <div className="font-heading font-serif text-2xl sm:text-3xl font-bold text-[#1F6F5F] mt-1 tabular-nums">
                        460 µg/m³
                    </div>
                    <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Kategori Sangat Berbahaya</span>
                </div>
            </div>

            {/* Interactive SVG Chart Container */}
            <div className="rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-4 sm:p-6 shadow-xs relative">
                {/* Header di dalam Card: Judul & Filter Toggles */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EEEEEE] pb-4 mb-4">
                    <div>
                        <span className="text-xs font-semibold text-[#1F6F5F] block">
                            Kurva Tren &amp; Korelasi Mingguan
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            Pilih metrik di samping untuk menyesuaikan tampilan grafik
                        </span>
                    </div>

                    {/* Filter Toggles di dalam Card */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setShowIspa(!showIspa)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                                showIspa
                                    ? 'bg-[#2FA084]/15 border-[#2FA084] text-[#1F6F5F] font-semibold'
                                    : 'border-[#EEEEEE] text-muted-foreground opacity-60 hover:opacity-100'
                            }`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#2FA084]" />
                            Kasus ISPA
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowHotspots(!showHotspots)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                                showHotspots
                                    ? 'bg-[#1F6F5F]/15 border-[#1F6F5F] text-[#1F6F5F] font-semibold'
                                    : 'border-[#EEEEEE] text-muted-foreground opacity-60 hover:opacity-100'
                            }`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1F6F5F]" />
                            Titik Panas
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowBurnedArea(!showBurnedArea)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                                showBurnedArea
                                    ? 'bg-amber-500/15 border-amber-600 text-amber-800 font-semibold'
                                    : 'border-[#EEEEEE] text-muted-foreground opacity-60 hover:opacity-100'
                            }`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                            Lahan Terbakar (Ha)
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowPm25(!showPm25)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                                showPm25
                                    ? 'bg-[#6FCF97]/25 border-[#2FA084] text-[#1F6F5F] font-semibold'
                                    : 'border-[#EEEEEE] text-muted-foreground opacity-60 hover:opacity-100'
                            }`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#6FCF97] border border-[#2FA084]" />
                            Polusi PM2.5
                        </button>
                    </div>
                </div>
                {/* Tooltip Overlay */}
                {activePoint && (
                    <div
                        className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full bg-[#1F6F5F] text-white border border-white/20 shadow-xl rounded-2xl p-3 text-xs w-64"
                        style={{
                            left: `${(activePoint.x / width) * 100}%`,
                            top: '25px',
                        }}
                    >
                        <div className="font-heading font-serif font-bold text-sm text-[#6FCF97] border-b border-white/20 pb-1 mb-2">
                            Periode {activePoint.data.week} (Puncak Siklus)
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                            {showIspa && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80">Kasus ISPA:</span>
                                    <span className="font-bold text-[#6FCF97]">
                                        {activePoint.data.ispa.toLocaleString()} jiwa
                                    </span>
                                </div>
                            )}
                            {showHotspots && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80">Titik Panas:</span>
                                    <span className="font-bold text-white">
                                        {activePoint.data.hotspots} titik
                                    </span>
                                </div>
                            )}
                            {showBurnedArea && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80">Lahan Terbakar:</span>
                                    <span className="font-bold text-amber-300">
                                        {activePoint.data.burnedArea.toLocaleString()} Ha
                                    </span>
                                </div>
                            )}
                            {showPm25 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80">Partikel PM2.5:</span>
                                    <span className="font-bold text-[#6FCF97]">
                                        {activePoint.data.pm25} µg/m³
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="w-full h-[300px]">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-full overflow-visible"
                    >
                        <defs>
                            <linearGradient id="ispaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2FA084" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#2FA084" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="burnedGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#D97706" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        {[0.25, 0.5, 0.75, 1].map((ratio) => {
                            const y = height - padding.bottom - ratio * (height - padding.top - padding.bottom);
                            return (
                                <g key={ratio}>
                                    <line
                                        x1={padding.left}
                                        y1={y}
                                        x2={width - padding.right}
                                        y2={y}
                                        stroke="#E2E8F0"
                                        strokeDasharray="4 4"
                                    />
                                    <text
                                        x={padding.left - 10}
                                        y={y + 3}
                                        textAnchor="end"
                                        className="text-[9px] fill-slate-400 font-mono"
                                    >
                                        {Math.round(ratio * 100)}%
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area Fill for Burned Area */}
                        {showBurnedArea && (
                            <path d={createArea('yBurned')} fill="url(#burnedGrad)" />
                        )}

                        {/* Area Fill for ISPA */}
                        {showIspa && (
                            <path d={createArea('yIspa')} fill="url(#ispaGrad)" />
                        )}

                        {/* 1. Line: Lahan Terbakar (Ha) */}
                        {showBurnedArea && (
                            <path
                                d={createPath('yBurned')}
                                fill="none"
                                stroke="#D97706"
                                strokeWidth="2.5"
                                strokeDasharray="5 3"
                                strokeLinecap="round"
                            />
                        )}

                        {/* 2. Line: Kasus ISPA */}
                        {showIspa && (
                            <path
                                d={createPath('yIspa')}
                                fill="none"
                                stroke="#2FA084"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        )}

                        {/* 3. Line: Titik Panas */}
                        {showHotspots && (
                            <path
                                d={createPath('yHotspots')}
                                fill="none"
                                stroke="#1F6F5F"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        )}

                        {/* 4. Line: PM2.5 */}
                        {showPm25 && (
                            <path
                                d={createPath('yPm25')}
                                fill="none"
                                stroke="#6FCF97"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        )}

                        {/* Interactive Data Points & Hover Targets */}
                        {points.map((p, i) => (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                className="cursor-pointer"
                            >
                                {/* Invisible hover target column */}
                                <rect
                                    x={p.x - 25}
                                    y={padding.top}
                                    width={50}
                                    height={height - padding.top - padding.bottom}
                                    fill="transparent"
                                />

                                {/* Burned Area circle */}
                                {showBurnedArea && (
                                    <circle
                                        cx={p.x}
                                        cy={p.yBurned}
                                        r={hoveredIdx === i ? 6 : 4}
                                        fill="#FFFFFF"
                                        stroke="#D97706"
                                        strokeWidth="2.5"
                                    />
                                )}

                                {/* ISPA circle */}
                                {showIspa && (
                                    <circle
                                        cx={p.x}
                                        cy={p.yIspa}
                                        r={hoveredIdx === i ? 6.5 : 4.5}
                                        fill="#FFFFFF"
                                        stroke="#2FA084"
                                        strokeWidth="3"
                                    />
                                )}

                                {/* Hotspots circle */}
                                {showHotspots && (
                                    <circle
                                        cx={p.x}
                                        cy={p.yHotspots}
                                        r={hoveredIdx === i ? 5.5 : 3.5}
                                        fill="#FFFFFF"
                                        stroke="#1F6F5F"
                                        strokeWidth="2.5"
                                    />
                                )}

                                {/* PM2.5 circle */}
                                {showPm25 && (
                                    <circle
                                        cx={p.x}
                                        cy={p.yPm25}
                                        r={hoveredIdx === i ? 5 : 3}
                                        fill="#FFFFFF"
                                        stroke="#6FCF97"
                                        strokeWidth="2"
                                    />
                                )}

                                {/* X-axis Label */}
                                <text
                                    x={p.x}
                                    y={height - 15}
                                    textAnchor="middle"
                                    className={`text-[11px] font-medium transition-colors ${
                                        hoveredIdx === i
                                            ? 'fill-[#2FA084] font-bold'
                                            : 'fill-slate-500'
                                    }`}
                                >
                                    {p.data.week}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* Official Data Sources Accordion / Citation Box */}
            <div className="mt-5 rounded-2xl border border-[#EEEEEE] bg-white dark:bg-card p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-[#2FA084]" />
                    <h4 className="font-heading font-serif text-sm font-bold text-[#1F6F5F]">
                        Transparansi &amp; Sumber Data Resmi Karhutla Kalimantan
                    </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Data di atas dihimpun secara terintegrasi dari instansi resmi pemerintah dan satelit internasional untuk mengawal keakuratan analisis korelasi dampak kesehatan:
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#EEEEEE]/60 border border-[#EEEEEE]">
                        <span className="font-semibold text-[#1F6F5F] block">1. SiPongi+ KLHK</span>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Sistem Informasi Karhutla Kementerian Lingkungan Hidup dan Kehutanan (Data agregasi luas lahan terbakar &amp; sebaran hotspot).
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#EEEEEE]/60 border border-[#EEEEEE]">
                        <span className="font-semibold text-[#1F6F5F] block">2. NASA FIRMS</span>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Fire Information for Resource Management System dengan sensor satelit MODIS (Terra/Aqua) dan VIIRS (SNPP/NOAA-20).
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#EEEEEE]/60 border border-[#EEEEEE]">
                        <span className="font-semibold text-[#1F6F5F] block">3. Kemenkes &amp; Dinkes</span>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Surveilans epidemiologi kasus ISPA mingguan dari seluruh Puskesmas dan Rumah Sakit di 5 Provinsi Kalimantan.
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#EEEEEE]/60 border border-[#EEEEEE]">
                        <span className="font-semibold text-[#1F6F5F] block">4. BMKG &amp; SPKU</span>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Stasiun Pemantau Kualitas Udara (SPKU) otomatis KLHK &amp; BMKG untuk konsentrasi debu mikroskopis PM2.5.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
