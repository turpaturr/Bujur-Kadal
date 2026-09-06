import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    ShieldAlert,
    PhoneCall,
    MapPin,
    Check,
    Clock,
    HeartPulse,
    Users
} from '@/pages/Components/Dashboard/Icons';
import { AppSwal } from '@/utils/alerts';

export interface EvacuationMissionItem {
    id: number;
    user_id: number;
    family_id?: number | null;
    family_name: string;
    head_name: string;
    whatsapp_number?: string | null;
    address?: string | null;
    latitude: number;
    longitude: number;
    vulnerable_members_count: number;
    total_members_count: number;
    safe_zone_name: string;
    status: 'waiting_team' | 'in_transit' | 'completed' | string;
    status_notes?: string | null;
    team_assigned_at?: string | null;
    in_transit_at?: string | null;
    completed_at?: string | null;
    updated_at?: string;
}

interface EvacuationTrackingViewProps {
    missions: EvacuationMissionItem[];
    onFocusMap?: (lat: number, lng: number) => void;
}

export default function EvacuationTrackingView({
    missions = [],
    onFocusMap,
}: EvacuationTrackingViewProps) {
    const [selectedMissionId, setSelectedMissionId] = useState<number | null>(
        missions[0]?.id ?? null
    );

    // Otomatis pilih misi pertama jika list berubah atau baru
    useEffect(() => {
        if (!selectedMissionId && missions.length > 0) {
            setSelectedMissionId(missions[0].id);
        }
    }, [missions, selectedMissionId]);

    const activeMission = missions.find((m) => m.id === selectedMissionId) ?? missions[0];

    // Auto-advance demo (~10 detik total: 0s -> 4s -> 10s)
    useEffect(() => {
        if (!activeMission) return;

        let timer: any = null;

        if (activeMission.status === 'waiting_team') {
            // Berpindah ke 'in_transit' dalam 4 detik
            timer = setTimeout(() => {
                router.post(
                    `/admin/evacuations/${activeMission.id}/progress`,
                    { status: 'in_transit' },
                    { preserveScroll: true }
                );
            }, 4000);
        } else if (activeMission.status === 'in_transit') {
            // Berpindah ke 'completed' dalam 6 detik
            timer = setTimeout(() => {
                router.post(
                    `/admin/evacuations/${activeMission.id}/progress`,
                    { status: 'completed' },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            AppSwal.fire({
                                icon: 'success',
                                title: 'Evakuasi Berhasil Selesai!',
                                text: `Seluruh keluarga ${activeMission.family_name} telah tiba dengan selamat di Posko Ruang Oksigen!`,
                                timer: 3500,
                                timerProgressBar: true,
                            });
                        },
                    }
                );
            }, 6000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [activeMission?.id, activeMission?.status]);

    const handleManualStep = (mission: EvacuationMissionItem, nextStep: 'in_transit' | 'completed') => {
        router.post(
            `/admin/evacuations/${mission.id}/progress`,
            { status: nextStep },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (nextStep === 'completed') {
                        AppSwal.fire({
                            icon: 'success',
                            title: 'Evakuasi Selesai!',
                            text: 'Keluarga telah tiba di shelter ruang oksigen.',
                            timer: 3000,
                            timerProgressBar: true,
                        });
                    }
                },
            }
        );
    };

    if (missions.length === 0) {
        return (
            <div className="rounded-2xl border border-[#EEEEEE] bg-white p-12 text-center shadow-xs">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-3">
                    🛡️
                </div>
                <h3 className="font-display text-lg font-bold text-gray-800">
                    Tidak Ada Misi Evakuasi Aktif
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                    Semua warga saat ini berada di zona aman atau telah selesai dievakuasi. Saat tim penjemputan dikerahkan melalui peta sebaran, pelacakan live timeline resi akan muncul di sini.
                </p>
            </div>
        );
    }

    const currentStepIndex = 
        activeMission.status === 'completed' ? 3 :
        activeMission.status === 'in_transit' ? 2 : 1;

    return (
        <div className="space-y-6">
            {/* Header Title Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#1F6F5F] font-display">
                        Monitoring Evakuasi &amp; Tracking Real-Time
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Pantau pergerakan armada penjemputan darurat dan status keselamatan keluarga rentan secara real-time.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                        Live Real-Time
                    </span>

                    {/* Tab Switcher jika ada lebih dari 1 misi */}
                    {missions.length > 1 && (
                        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs">
                            {missions.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setSelectedMissionId(m.id)}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        activeMission.id === m.id
                                            ? 'bg-white text-[#1F6F5F] shadow-xs'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    #{m.id} {m.head_name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Kartu Utama Resi Evakuasi */}
            <div className="rounded-2xl border border-[#EEEEEE] bg-white shadow-xs overflow-hidden">
                {/* Clean White Resi Header Bar */}
                <div className="p-5 sm:p-6 border-b border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1F6F5F] border border-emerald-200/80 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                            🚑
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1F6F5F]">
                                    NO. RESI EVAKUASI: #EVAC-{String(activeMission.id).padStart(4, '0')}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                                    activeMission.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : activeMission.status === 'in_transit'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                                            : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                }`}>
                                    {activeMission.status === 'completed' ? '✓ Tiba di Shelter Oksigen' :
                                     activeMission.status === 'in_transit' ? '⚡ Sedang Menuju Lokasi' :
                                     '🕒 Menunggu Tim Penjemputan'}
                                </span>
                            </div>
                            <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900 mt-1">
                                {activeMission.family_name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {activeMission.address}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        {onFocusMap && (
                            <button
                                type="button"
                                onClick={() => onFocusMap(activeMission.latitude, activeMission.longitude)}
                                className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#1F6F5F] border border-[#EEEEEE] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                                <MapPin className="w-3.5 h-3.5 text-[#2FA084]" />
                                <span>Lihat di Peta</span>
                            </button>
                        )}
                        {activeMission.whatsapp_number && (
                            <a
                                href={`https://wa.me/62${activeMission.whatsapp_number.replace(/^0/, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Hubungi Warga</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Resi Package Delivery Timeline (Visual Stepper Bebas Tabrakan Teks) */}
                <div className="p-6 sm:p-8 border-b border-[#EEEEEE] bg-[#FAFAFA]">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            {/* Garis Penghubung Stepper: Posisi tepat pada pusat vertikal lingkaran (h-12 -> top: 24px) */}
                            <div className="absolute top-6 left-12 right-12 -translate-y-1/2 h-1 bg-gray-200 z-0">
                                <div
                                    className="h-full bg-[#1F6F5F] transition-all duration-700 ease-in-out"
                                    style={{
                                        width:
                                            currentStepIndex === 1 ? '0%' :
                                            currentStepIndex === 2 ? '50%' : '100%',
                                    }}
                                />
                            </div>

                            {/* Tiga Node Stepper Berjajar Rapi */}
                            <div className="grid grid-cols-3 relative z-10">
                                {/* Node 1: Menunggu Tim */}
                                <div className="flex flex-col items-center text-center px-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition-all ${
                                        currentStepIndex >= 1
                                            ? 'bg-[#1F6F5F] text-white ring-4 ring-emerald-100'
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    }`}>
                                        {currentStepIndex > 1 ? <Check className="w-5 h-5 stroke-[2.5]" /> : '1'}
                                    </div>
                                    <div className="mt-3.5 space-y-0.5">
                                        <div className="font-display font-bold text-xs sm:text-sm text-gray-900">
                                            Menunggu Tim
                                        </div>
                                        <div className="text-[11px] text-gray-500 leading-tight">
                                            Penugasan armada &amp; nakes posko
                                        </div>
                                        {activeMission.team_assigned_at && (
                                            <div className="font-mono text-[10px] text-gray-400 pt-0.5">
                                                {activeMission.team_assigned_at}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Node 2: Proses Evakuasi */}
                                <div className="flex flex-col items-center text-center px-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition-all ${
                                        currentStepIndex >= 2
                                            ? 'bg-[#1F6F5F] text-white ring-4 ring-emerald-100'
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    }`}>
                                        {currentStepIndex > 2 ? <Check className="w-5 h-5 stroke-[2.5]" /> : '2'}
                                    </div>
                                    <div className="mt-3.5 space-y-0.5">
                                        <div className="font-display font-bold text-xs sm:text-sm text-gray-900">
                                            Proses Evakuasi
                                        </div>
                                        <div className="text-[11px] text-gray-500 leading-tight">
                                            Tim menuju lokasi &amp; jemput warga
                                        </div>
                                        {activeMission.in_transit_at && (
                                            <div className="font-mono text-[10px] text-gray-400 pt-0.5">
                                                {activeMission.in_transit_at}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Node 3: Tiba di Posko Ruang Oksigen */}
                                <div className="flex flex-col items-center text-center px-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition-all ${
                                        currentStepIndex === 3
                                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    }`}>
                                        {currentStepIndex === 3 ? <Check className="w-5 h-5 stroke-[2.5]" /> : '3'}
                                    </div>
                                    <div className="mt-3.5 space-y-0.5">
                                        <div className="font-display font-bold text-xs sm:text-sm text-gray-900">
                                            Tiba di Posko Oksigen
                                        </div>
                                        <div className="text-[11px] text-gray-500 leading-tight">
                                            Warga aman di shelter bebas asap
                                        </div>
                                        {activeMission.completed_at && (
                                            <div className="font-mono text-[10px] text-emerald-600 font-bold pt-0.5">
                                                {activeMission.completed_at} Selesai
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Catatan Terakhir / Live Status Log */}
                        <div className="mt-7 p-4 rounded-xl bg-white border border-[#EEEEEE] flex items-start gap-3 shadow-2xs">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 text-xs">
                                <div className="font-bold text-[#1F6F5F] flex items-center gap-2">
                                    <span>Catatan Petugas &amp; Status Terkini:</span>
                                    <span className="font-normal text-gray-400">· {activeMission.updated_at}</span>
                                </div>
                                <p className="text-gray-600 mt-1 leading-relaxed">
                                    {activeMission.status_notes ?? 'Misi evakuasi sedang diproses petugas satgas.'}
                                </p>
                            </div>

                            {/* Tombol Demo Simulasi Cepat */}
                            {activeMission.status !== 'completed' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (activeMission.status === 'waiting_team') {
                                            handleManualStep(activeMission, 'in_transit');
                                        } else if (activeMission.status === 'in_transit') {
                                            handleManualStep(activeMission, 'completed');
                                        }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-2xs"
                                    title="Klik untuk mempercepat simulasi demo ke langkah berikutnya"
                                >
                                    ⚡ Majukan Step Demo
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rincian Destinasi & Warga */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-white">
                    {/* Kolom 1: Profil Keluarga */}
                    <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#EEEEEE] space-y-2">
                        <div className="flex items-center gap-2 text-[#1F6F5F] font-bold">
                            <Users className="w-4 h-4" />
                            <span>Penghuni Rumah:</span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">{activeMission.head_name}</div>
                            <div className="text-gray-500 mt-0.5">
                                Total: <strong>{activeMission.total_members_count} Jiwa</strong>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px]">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>{activeMission.vulnerable_members_count} Anggota Prioritas Rentan</span>
                        </div>
                    </div>

                    {/* Kolom 2: Lokasi Penjemputan */}
                    <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#EEEEEE] space-y-2">
                        <div className="flex items-center gap-2 text-[#1F6F5F] font-bold">
                            <MapPin className="w-4 h-4" />
                            <span>Titik Koordinat Warga:</span>
                        </div>
                        <p className="text-gray-700 line-clamp-2">
                            {activeMission.address}
                        </p>
                        <div className="font-mono text-[10.5px] text-gray-500">
                            Lat: {activeMission.latitude}, Lng: {activeMission.longitude}
                        </div>
                    </div>

                    {/* Kolom 3: Tujuan Evakuasi */}
                    <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold">
                            <HeartPulse className="w-4 h-4 text-emerald-600" />
                            <span>Posko Evakuasi Tujuan:</span>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">
                            {activeMission.safe_zone_name}
                        </div>
                        <p className="text-[11px] text-emerald-700 leading-relaxed">
                            Dilengkapi filter udara partikulat bebas PM2.5, nebulizer, dan tabung oksigen murni untuk pertolongan pertama gangguan pernapasan kabut asap.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
