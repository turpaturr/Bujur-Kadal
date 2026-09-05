import { useState } from 'react';
import { TrendingUp } from '@/pages/Components/Welcome/Icons';

export const KARHUTLA_CHART_DATA = [
    { week: "M1 Agt", hotspots: 120,  ispa: 1400 },
    { week: "M2 Agt", hotspots: 240,  ispa: 2100 },
    { week: "M3 Agt", hotspots: 450,  ispa: 3800 },
    { week: "M4 Agt", hotspots: 680,  ispa: 5200 },
    { week: "M1 Sep", hotspots: 890,  ispa: 7400 },
    { week: "M2 Sep", hotspots: 1150, ispa: 9600 },
];

export default function TrendAnalysis() {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // SVG coordinate calculations for 6 points
    const width = 600;
    const height = 220;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };

    const maxIspa = 10000;
    const points = KARHUTLA_CHART_DATA.map((d, i) => {
        const x = padding.left + (i / (KARHUTLA_CHART_DATA.length - 1)) * (width - padding.left - padding.right);
        // Normalize ispa to height
        const yIspa = height - padding.bottom - (d.ispa / maxIspa) * (height - padding.top - padding.bottom);
        // Normalize hotspots (scale 0-1400)
        const yHotspots = height - padding.bottom - (d.hotspots / 1400) * (height - padding.top - padding.bottom);
        return { x, yIspa, yHotspots, data: d };
    });

    // Area path string for ISPA
    const ispaLinePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yIspa}`).join(' ');
    const ispaAreaPath = `${ispaLinePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    // Line path for hotspots
    const hotspotsLinePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yHotspots}`).join(' ');
    const hotspotsAreaPath = `${hotspotsLinePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

    return (
        <section id="analisis" className="mt-20">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#14967F]">
                        <TrendingUp className="h-3.5 w-3.5" /> Analisis Tren Musiman
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#095D7E] sm:text-3xl">
                        Eskalasi Karhutla &amp; Kasus ISPA
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Korelasi mingguan titik panas dengan lonjakan infeksi saluran pernapasan.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-[#14967F]" />
                        <span className="font-medium text-foreground">Kasus ISPA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-[#095D7E]" />
                        <span className="font-medium text-foreground">Titik Panas</span>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-[#CCECEE] bg-white dark:bg-card p-4 sm:p-6 shadow-xs relative">
                {/* Tooltip Overlay */}
                {activePoint && (
                    <div
                        className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full bg-white dark:bg-zinc-900 border border-[#CCECEE] shadow-md rounded-xl px-3 py-2 text-xs"
                        style={{
                            left: `${(activePoint.x / width) * 100}%`,
                            top: '30px',
                        }}
                    >
                        <div className="font-bold text-[#095D7E]">{activePoint.data.week}</div>
                        <div className="text-[#14967F] font-semibold">
                            ISPA: {activePoint.data.ispa.toLocaleString()} kasus
                        </div>
                        <div className="text-[#095D7E] font-medium">
                            Hotspots: {activePoint.data.hotspots} titik
                        </div>
                    </div>
                )}

                <div className="w-full h-[280px]">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-full overflow-visible"
                    >
                        <defs>
                            <linearGradient id="ispaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#14967F" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#14967F" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="hotspotGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#095D7E" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#095D7E" stopOpacity="0.0" />
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
                                        x={padding.left - 8}
                                        y={y + 3}
                                        textAnchor="end"
                                        className="text-[9px] fill-slate-400 font-mono"
                                    >
                                        {(maxIspa * ratio).toLocaleString()}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area Paths */}
                        <path d={ispaAreaPath} fill="url(#ispaGrad)" />
                        <path d={hotspotsAreaPath} fill="url(#hotspotGrad)" />

                        {/* Lines */}
                        <path
                            d={ispaLinePath}
                            fill="none"
                            stroke="#14967F"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                        <path
                            d={hotspotsLinePath}
                            fill="none"
                            stroke="#095D7E"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                            strokeLinecap="round"
                        />

                        {/* Interactive Data Points & X-Labels */}
                        {points.map((p, i) => (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                className="cursor-pointer"
                            >
                                {/* Invisible hover target */}
                                <rect
                                    x={p.x - 20}
                                    y={padding.top}
                                    width={40}
                                    height={height - padding.top - padding.bottom}
                                    fill="transparent"
                                />

                                {/* Points on ISPA line */}
                                <circle
                                    cx={p.x}
                                    cy={p.yIspa}
                                    r={hoveredIdx === i ? 6 : 4}
                                    fill="#FFFFFF"
                                    stroke="#14967F"
                                    strokeWidth="2.5"
                                />

                                {/* Points on Hotspot line */}
                                <circle
                                    cx={p.x}
                                    cy={p.yHotspots}
                                    r={hoveredIdx === i ? 5 : 3.5}
                                    fill="#FFFFFF"
                                    stroke="#095D7E"
                                    strokeWidth="2"
                                />

                                {/* X-axis Label */}
                                <text
                                    x={p.x}
                                    y={height - 15}
                                    textAnchor="middle"
                                    className={`text-[11px] font-medium transition-colors ${
                                        hoveredIdx === i
                                            ? 'fill-[#14967F] font-bold'
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
        </section>
    );
}
