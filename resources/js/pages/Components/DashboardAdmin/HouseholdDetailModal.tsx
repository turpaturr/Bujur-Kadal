import React, { useMemo } from 'react';
import type { RegisteredUserLocation, RegisteredFamilyMember } from '@/pages/Components/Dashboard/Maps';
import { Home, Users, ShieldAlert, PhoneCall, X, MapPin, HeartPulse } from '@/pages/Components/Dashboard/Icons';
import type { WildfireHotspot } from '@/hooks/useWildfireData';

interface HouseholdDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    household: RegisteredUserLocation | null;
    hotspots?: WildfireHotspot[];
    onFocusMap?: (household: RegisteredUserLocation) => void;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function calculateAge(birthDateString?: string | null): number | null {
    if (!birthDateString) return null;
    const birth = new Date(birthDateString);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age >= 0 ? age : null;
}

function getVulnerabilityBadge(member: RegisteredFamilyMember): {
    label: string;
    bg: string;
    text: string;
    border: string;
    level: 'high' | 'medium' | 'low';
} {
    const cat = member.vulnerability_category;
    if (cat === 'ibu_hamil') {
        return { label: 'Ibu Hamil', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', level: 'high' };
    }
    if (cat === 'balita') {
        return { label: 'Balita (< 4 th)', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', level: 'high' };
    }
    if (cat === 'lansia') {
        return { label: 'Lansia (> 60 th)', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', level: 'high' };
    }
    if (cat === 'penyakit_bawaan') {
        return { label: 'Penyakit Bawaan', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', level: 'high' };
    }
    if (cat === 'anak_anak') {
        return { label: 'Anak-anak (4-10 th)', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', level: 'medium' };
    }
    if (member.is_vulnerable) {
        return { label: 'Rentan', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', level: 'high' };
    }
    return { label: 'Normal / Sehat', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', level: 'low' };
}

export default function HouseholdDetailModal({
    isOpen,
    onClose,
    household,
    hotspots = [],
    onFocusMap,
}: HouseholdDetailModalProps) {
    if (!isOpen || !household) return null;

    const isVulnerable = household.is_vulnerable;
    const members = household.members ?? [];

    const isInDangerZone = useMemo(() => {
        if (!household.latitude || !household.longitude || hotspots.length === 0) return false;
        const lat = Number(household.latitude);
        const lng = Number(household.longitude);
        for (const h of hotspots) {
            if (h.confidenceLevel === 'high' && getDistanceInKm(lat, lng, h.latitude, h.longitude) <= 5) {
                return true;
            }
        }
        return false;
    }, [household, hotspots]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#EEEEEE] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEEEEE] bg-[#FAFAFA]">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${isVulnerable ? 'bg-rose-600' : 'bg-[#1F6F5F]'}`}>
                            <Home className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-display text-base sm:text-lg font-bold text-[#1F6F5F]">
                                    {household.name}
                                </h3>
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                                        isVulnerable
                                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}
                                >
                                    {isVulnerable
                                        ? `Prioritas Rentan (${household.vulnerable_count} Jiwa)`
                                        : 'Non-Rentan'}
                                </span>
                            </div>
                            <p className="text-xs text-[#262626]/60">
                                Total Penghuni: <strong className="text-[#262626]">{household.total_members} Jiwa</strong>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Tutup Modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Alamat & Titik Koordinat */}
                    <div className="rounded-xl border border-[#EEEEEE] bg-[#FAFAFA] p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F6F5F] uppercase tracking-wider">
                                    <MapPin className="w-3.5 h-3.5 text-[#2FA084]" />
                                    <span>Alamat Tempat Tinggal:</span>
                                </div>
                                <p className="text-xs text-[#262626] leading-relaxed">
                                    {household.home_address || 'Alamat belum tercatat di database.'}
                                </p>
                            </div>

                            {onFocusMap && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onFocusMap(household);
                                        onClose();
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-white border border-[#EEEEEE] text-[#1F6F5F] hover:bg-[#1F6F5F] hover:text-white transition-all text-xs font-bold shrink-0 shadow-2xs cursor-pointer flex items-center gap-1"
                                >
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Fokus Peta</span>
                                </button>
                            )}
                        </div>

                        <div className="pt-2 border-t border-[#EEEEEE] flex items-center justify-between text-[11px] font-mono text-[#262626]/70">
                            <span>Latitude: <strong>{Number(household.latitude).toFixed(5)}°</strong></span>
                            <span>Longitude: <strong>{Number(household.longitude).toFixed(5)}°</strong></span>
                        </div>
                    </div>

                    {/* Kontak Cepat Kepala Keluarga */}
                    <div className="flex flex-wrap gap-2.5">
                        {household.whatsapp_link ? (
                            <a
                                href={household.whatsapp_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                                </svg>
                                <span>Hubungi via WhatsApp ({household.whatsapp_number})</span>
                            </a>
                        ) : (
                            <span className="text-xs text-neutral-400 italic">
                                Nomor WhatsApp belum tercatat.
                            </span>
                        )}

                        {household.whatsapp_number && (
                            <a
                                href={`tel:${household.whatsapp_number}`}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                            >
                                <PhoneCall className="w-3.5 h-3.5 text-gray-600" />
                                <span>Panggil Telepon</span>
                            </a>
                        )}
                    </div>

                    {/* Instruksi Taktis Evakuasi jika Rentan */}
                    {isVulnerable && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-900 space-y-1">
                            <div className="font-extrabold flex items-center gap-1.5 text-rose-800">
                                <ShieldAlert className="w-4 h-4 text-rose-600" />
                                <span>Instruksi Khusus Petugas Posko:</span>
                            </div>
                            <p className="leading-relaxed text-[11px]">
                                Rumah ini dihuni oleh <strong className="text-rose-700">{household.vulnerable_count} anggota keluarga berisiko tinggi</strong> (Ibu Hamil / Balita / Lansia / Komorbid). Bila jarak titik api mendekat ke radius &lt; 10 km atau ISPU memburuk, prioritaskan evakuasi ke <strong>Posko Ruang Oksigen (Oxygen Shelter)</strong> terdekat.
                            </p>
                        </div>
                    )}

                    {/* Komposisi Seluruh Anggota Keluarga */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#1F6F5F]" />
                                <h4 className="text-xs font-bold text-[#1F6F5F] uppercase tracking-wider">
                                    Daftar Anggota Keluarga ({members.length} Jiwa)
                                </h4>
                            </div>
                            <span className="text-[11px] text-[#262626]/60">
                                Rincian profil kerentanan &amp; catatan medis
                            </span>
                        </div>

                        {members.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {members.map((m) => {
                                    const vBadge = getVulnerabilityBadge(m);
                                    const age = calculateAge(m.birth_date);
                                    const isHead = m.role === 'Kepala Keluarga' || m.is_head;

                                    return (
                                        <div
                                            key={m.id}
                                            className={`rounded-xl border p-3.5 space-y-2 transition-all ${
                                                m.is_vulnerable
                                                    ? 'bg-rose-50/50 border-rose-200'
                                                    : 'bg-white border-[#EEEEEE]'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="font-bold text-xs text-[#262626]">
                                                        {m.name}
                                                    </div>
                                                    <div className="text-[10px] text-[#262626]/60 mt-0.5">
                                                        <span className={isHead ? 'font-bold text-[#1F6F5F]' : ''}>
                                                            {isHead ? 'Kepala Keluarga' : 'Anggota Keluarga'}
                                                        </span>
                                                        {m.gender ? ` · ${m.gender}` : ''}
                                                        {age !== null ? ` · ${age} Tahun` : ''}
                                                    </div>
                                                </div>

                                                <span
                                                    className={`px-2 py-0.5 rounded text-[9.5px] font-bold border shrink-0 ${vBadge.bg} ${vBadge.text} ${vBadge.border}`}
                                                >
                                                    {vBadge.label}
                                                </span>
                                            </div>

                                            {m.occupation && (
                                                <div className="text-[10.5px] text-[#262626]/70">
                                                    Pekerjaan: <span className="font-medium text-[#262626]">{m.occupation}</span>
                                                </div>
                                            )}

                                            {m.nik_masked && (
                                                <div className="text-[10px] font-mono text-[#262626]/50">
                                                    NIK: {m.nik_masked}
                                                </div>
                                            )}

                                            {m.comorbidity_notes && (
                                                <div className="rounded-lg bg-white/90 border border-rose-200 p-2 text-[10.5px] text-rose-800 space-y-0.5">
                                                    <div className="font-bold flex items-center gap-1 text-[10px] text-rose-700">
                                                        <HeartPulse className="w-3 h-3 text-rose-600" />
                                                        <span>Catatan Penyakit / Komorbid:</span>
                                                    </div>
                                                    <p className="leading-snug italic">{m.comorbidity_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-400 italic">
                                Belum ada rincian anggota keluarga yang didaftarkan.
                            </p>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#EEEEEE] bg-[#FAFAFA]">
                    <div className="flex items-center gap-3">
                        {isInDangerZone ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (isVulnerable) {
                                        alert(`Evakuasi Darurat (Penjemputan Langsung) telah diinstruksikan untuk keluarga ${household.name}. Tim medis sedang dikerahkan karena terdapat anggota keluarga rentan di radius bahaya.`);
                                    } else {
                                        alert(`Instruksi Evakuasi Mandiri ke Fasilitas Kesehatan terdekat telah dikirimkan ke perangkat ${household.name} (Radius Bahaya).`);
                                    }
                                    onClose();
                                }}
                                className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                                    isVulnerable 
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                                }`}
                            >
                                <ShieldAlert className="w-4 h-4" />
                                {isVulnerable ? 'Kirim Tim Penjemputan' : 'Instruksi Ke Faskes'}
                            </button>
                        ) : (
                            <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                                <ShieldAlert className="w-4 h-4" />
                                Lokasi Aman
                            </div>
                        )}
                        <span className="hidden sm:inline-block text-[11px] text-[#262626]/50">
                            Data terverifikasi oleh Kepala Keluarga &amp; Dukcapil
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition-colors cursor-pointer shrink-0"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
