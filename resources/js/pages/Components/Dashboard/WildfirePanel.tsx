import { useState } from 'react';
import type { ProvinceDetail, WildfireData } from '@/hooks/useWildfireData';

interface IconProps {
    className?: string;
}

function PanelIcon({ className }: IconProps) {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 3a7 7 0 0 0-7 7c0 4.5 3.5 7.5 7 11 3.5-3.5 7-6.5 7-11a7 7 0 0 0-7-7Z" />
            <path d="M12 8v5m-2.5 0h5" />
        </svg>
    );
}

const Flame = PanelIcon;
const Wind = PanelIcon;
const Sun = PanelIcon;
const ShieldCheck = PanelIcon;
const HeartPulse = PanelIcon;
const Home = PanelIcon;
const Droplets = PanelIcon;
const PhoneCall = PanelIcon;
const Activity = PanelIcon;

interface WildfirePanelProps {
    wildfire: WildfireData;
    onSelectProvince?: (provinceName: string) => void;
    className?: string;
}

export default function WildfirePanel({
    wildfire,
    onSelectProvince,
    className = '',
}: WildfirePanelProps) {
    const { stats, isLoading, error, refresh } = wildfire;
    const [activeTab, setActiveTab] = useState<'provinces' | 'safety'>('provinces');

    return (
        <div className={`bg-white rounded-2xl border border-[#EEEEEE] shadow-xs flex flex-col overflow-hidden ${className}`}>
            {/* Header Panel */}
            <div className="p-4 border-b border-[#EEEEEE] flex items-center justify-between gap-2">
                <div>
                    <h2 className="font-display text-base font-bold text-[#1F6F5F] tracking-tight">
                        Informasi Wilayah & Tips
                    </h2>
                    <p className="text-[11px] text-[#262626]/60">
                        Status per provinsi & anjuran keselamatan keluarga
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 p-0.5 bg-[#EEEEEE]/80 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setActiveTab('provinces')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'provinces'
                                ? 'bg-white text-[#1F6F5F] shadow-2xs font-bold'
                                : 'text-[#262626]/60 hover:text-[#1F6F5F]'
                        }`}
                    >
                        Provinsi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('safety')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'safety'
                                ? 'bg-white text-[#1F6F5F] shadow-2xs font-bold'
                                : 'text-[#262626]/60 hover:text-[#1F6F5F]'
                        }`}
                    >
                        Tips Sehat
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[460px] sm:max-h-[480px]">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-14 bg-[#EEEEEE]/70 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                        <div className="font-bold mb-1">Gagal Memuat Data Satelit:</div>
                        <div className="text-[11px] mb-3">{error}</div>
                        <button
                            type="button"
                            onClick={refresh}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : activeTab === 'provinces' ? (
                    /* TAB 1: Peringkat 5 Provinsi Kalimantan */
                    <div className="space-y-2.5">
                        <div className="text-[11px] text-[#262626]/60 pb-1">
                            Urutan wilayah dengan titik pantauan terbanyak:
                        </div>

                        {stats.provinceDetails.map((prov: ProvinceDetail, idx: number) => {
                            const isFirst = idx === 0 && prov.count > 0;
                            return (
                                <div
                                    key={prov.name}
                                    className={`p-3 rounded-xl border transition-all ${
                                        isFirst
                                            ? 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                                            : 'bg-white border-[#EEEEEE] hover:border-[#2FA084]/40 hover:bg-[#2FA084]/5'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                isFirst ? 'bg-rose-500 text-white' : 'bg-[#EEEEEE] text-[#1F6F5F]'
                                            }`}>
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <span className="font-bold text-xs text-[#262626]">
                                                    {prov.name}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => onSelectProvince?.(prov.name)}
                                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-[#EEEEEE] text-[#1F6F5F] hover:bg-[#2FA084] hover:text-white hover:border-[#2FA084] transition-colors shadow-2xs"
                                        >
                                            Sorot Peta
                                        </button>
                                    </div>

                                    {/* Progress Bar & Titik */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="font-bold text-[#1F6F5F]">
                                                {prov.count.toLocaleString('id-ID')} Titik
                                            </span>
                                            <span className="text-[10px] text-[#262626]/50">
                                                {prov.percentage}% dari total
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-[#EEEEEE] overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isFirst ? 'bg-rose-500' : 'bg-[#2FA084]'
                                                }`}
                                                style={{ width: `${Math.max(4, prov.percentage)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Rincian Ringkas Tanda Bahaya */}
                                    <div className="mt-2 pt-2 border-t border-[#EEEEEE]/70 flex items-center gap-1.5 text-[10px]">
                                        <span className="text-[#262626]/60">Rincian:</span>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                            <Flame className="w-2.5 h-2.5 text-rose-600" />
                                            <span>{prov.activeFireCount} Api</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold border border-orange-200">
                                            <Wind className="w-2.5 h-2.5 text-orange-600" />
                                            <span>{prov.smokePeatCount} Gambut</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                                            <Sun className="w-2.5 h-2.5 text-amber-600" />
                                            <span>{prov.heatAnomalyCount} Panas</span>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* TAB 2: Tips Sehat & Panduan Warga/Keluarga */
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-[#2FA084]/10 border border-[#2FA084]/20">
                            <h4 className="font-bold text-xs text-[#1F6F5F] flex items-center gap-1.5 mb-1">
                                <ShieldCheck className="w-4 h-4 text-[#1F6F5F]" />
                                <span>Prioritas Keselamatan Keluarga</span>
                            </h4>
                            <p className="text-[11px] text-[#262626]/80 leading-relaxed">
                                Asap dari bara lahan gambut mengandung partikel mikro halus (PM2.5) yang berbahaya bagi pernapasan anak-anak dan orang tua.
                            </p>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-xl border border-[#EEEEEE] bg-white flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Activity className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#262626] text-[11px]">Pakai Masker di Luar</div>
                                    <div className="text-[11px] text-[#262626]/70 leading-snug">
                                        Gunakan masker (N95 atau masker medis) jika tercium bau asap sangit atau jarak pandang mulai berkurang.
                                    </div>
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl border border-[#EEEEEE] bg-white flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Home className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#262626] text-[11px]">Tutup Jendela & Ventilasi</div>
                                    <div className="text-[11px] text-[#262626]/70 leading-snug">
                                        Kabut asap biasanya paling pekat pada pagi dan sore hari. Rapatkan pintu dan jendela rumah.
                                    </div>
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl border border-[#EEEEEE] bg-white flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <HeartPulse className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#262626] text-[11px]">Lindungi Anak-anak & Lansia</div>
                                    <div className="text-[11px] text-[#262626]/70 leading-snug">
                                        Hindari aktivitas olahraga atau bermain di luar ruangan saat indeks kabut asap meningkat.
                                    </div>
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl border border-[#EEEEEE] bg-white flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Droplets className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#262626] text-[11px]">Perbanyak Minum Air Putih</div>
                                    <div className="text-[11px] text-[#262626]/70 leading-snug">
                                        Menjaga kelembapan saluran napas dan membantu tubuh membersihkan partikel debu halus.
                                    </div>
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 flex items-start gap-2.5">
                                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <PhoneCall className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-rose-800 text-[11px]">Lapor Titik Api Terdekat</div>
                                    <div className="text-[11px] text-rose-900/80 leading-snug">
                                        Bila melihat api mendekati pemukiman atau kebun warga, segera hubungi relawan pemadam kebakaran atau BPBD setempat.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
