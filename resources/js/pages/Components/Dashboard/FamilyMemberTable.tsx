import React from 'react';
import { router } from '@inertiajs/react';

export interface FamilyMemberItem {
    id: number;
    name: string;
    nik_masked?: string;
    role: string;
    birth_date?: string | null;
    gender?: 'laki-laki' | 'perempuan' | string | null;
    occupation?: string | null;
    is_head: boolean;
    health_profile?: {
        is_vulnerable: boolean;
        vulnerability_category?: string | null;
        comorbidity_notes?: string | null;
    } | null;
}

interface FamilyMemberTableProps {
    members: FamilyMemberItem[];
    isHeadOfFamily: boolean;
    onOpenAddModal: () => void;
    onOpenEditModal: (member: FamilyMemberItem) => void;
}

// Menghitung usia dari tanggal lahir
function calculateAge(birthDateStr?: string | null): number | null {
    if (!birthDateStr) return null;
    const birth = new Date(birthDateStr);
    if (isNaN(birth.getTime())) return null;
    const diffMs = Date.now() - birth.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

// Rekomendasi mitigasi proteksi medis sesuai kategori kerentanan
function getMitigationAdvice(category?: string | null, notes?: string | null): {
    advice: string;
    urgency: 'high' | 'medium' | 'low';
    isDanger: boolean;
} {
    switch (category) {
        case 'ibu_hamil':
            return {
                advice: 'Waspada paparan partikel PM2.5. Siapkan rute evakuasi dini ke Ruang Ramah Oksigen jika AQI memburuk. Wajib kenakan masker respirator N95 saat bepergian.',
                urgency: 'high',
                isDanger: true,
            };
        case 'balita':
            return {
                advice: 'Larang aktivitas di luar ruangan. Pasang filter udara (air purifier) dalam kamar tidur & bersihkan permukaan rumah dari partikel abu karhutla.',
                urgency: 'high',
                isDanger: true,
            };
        case 'lansia':
            return {
                advice: 'Pastikan hidrasi cairan tercukupi. Pasang pemantau saturasi oksigen darah (oximeter) berkala & hindari aktivitas fisik berat di luar rumah.',
                urgency: 'high',
                isDanger: true,
            };
        case 'penyakit_bawaan':
            return {
                advice: notes
                    ? `Siapkan obat pereda/inhaler darurat untuk: ${notes}. Pantau saturasi oksigen dan segera ke faskes bila sesak berlanjut.`
                    : 'Siapkan obat bronkodilator / inhaler cadangan. Hindari paparan langsung asap pekat.',
                urgency: 'high',
                isDanger: true,
            };
        case 'anak_anak':
            return {
                advice: 'Batasi jam bermain luar ruangan saat indeks asap meningkat. Pastikan selalu mengenakan masker anak saat berangkat sekolah.',
                urgency: 'medium',
                isDanger: false,
            };
        default:
            return {
                advice: 'Gunakan masker standar saat berada di luar ruangan. Pantau pembaruan titik panas satelit NASA FIRMS secara berkala.',
                urgency: 'low',
                isDanger: false,
            };
    }
}

export default function FamilyMemberTable({
    members,
    isHeadOfFamily,
    onOpenAddModal,
    onOpenEditModal,
}: FamilyMemberTableProps) {
    const handleDelete = (member: FamilyMemberItem) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data anggota keluarga "${member.name}"?`)) {
            router.delete(`/family/members/${member.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="space-y-4 font-sans">
            {/* Header info & quick summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEE]">
                <div>
                    <h3 className="font-display text-base font-bold text-[#1F6F5F] flex items-center gap-2">
                        <span>Status Anggota Keluarga & Protokol Mitigasi ISPA</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2FA084]/15 text-[#1F6F5F] font-bold">
                            {members.length} Jiwa Terdaftar
                        </span>
                    </h3>
                    <p className="text-xs text-[#262626]/70 mt-0.5">
                        Klasifikasi kerentanan fisik, indikator bahaya medis, dan panduan taktis perlindungan terhadap kabut asap karhutla.
                    </p>
                </div>

                {isHeadOfFamily && (
                    <button
                        type="button"
                        onClick={onOpenAddModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2FA084] text-white hover:bg-[#1F6F5F] transition-all text-xs font-bold shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tambah Anggota</span>
                    </button>
                )}
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#EEEEEE] text-[11px] font-bold text-[#1F6F5F] uppercase tracking-wider bg-[#EEEEEE]/30">
                            <th className="py-3 px-4">Nama & NIK</th>
                            <th className="py-3 px-3">Profil & Usia</th>
                            <th className="py-3 px-3">Pekerjaan</th>
                            <th className="py-3 px-4">Status & Indikator Kerentanan</th>
                            <th className="py-3 px-4">Warning & Rekomendasi Mitigasi Proteksi</th>
                            {isHeadOfFamily && <th className="py-3 px-3 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEEEEE] text-xs">
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-[#262626]/60">
                                    <div className="max-w-md mx-auto space-y-3">
                                        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEEEEE] flex items-center justify-center text-[#1F6F5F]">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="font-bold text-[#1F6F5F]">Belum Ada Anggota Keluarga Terdaftar</p>
                                        <p className="text-[11px] text-[#262626]/70">
                                            Lengkapi data anggota keluarga Anda (balita, anak-anak, lansia, ibu hamil, komorbid) untuk aktivasi perlindungan evakuasi.
                                        </p>
                                        {isHeadOfFamily && (
                                            <button
                                                type="button"
                                                onClick={onOpenAddModal}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2FA084] text-white text-xs font-bold hover:bg-[#1F6F5F] transition-all cursor-pointer shadow-xs"
                                            >
                                                <span>+ Tambah Anggota Pertama Sekarang</span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => {
                                const age = calculateAge(member.birth_date);
                                const category = member.health_profile?.vulnerability_category ?? (member.health_profile?.is_vulnerable ? 'penyakit_bawaan' : 'tidak_rentan');
                                const notes = member.health_profile?.comorbidity_notes;
                                const mitigation = getMitigationAdvice(category, notes);

                                return (
                                    <tr key={member.id} className="hover:bg-[#F6FBF9] transition-colors">
                                        {/* 1. Nama & NIK */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-[#262626] text-sm">
                                                    {member.name}
                                                </div>
                                                {member.is_head ? (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1F6F5F]/10 text-[#1F6F5F] border border-[#1F6F5F]/30">
                                                        Kepala Keluarga
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#EEEEEE] text-[#262626]/70">
                                                        Anggota
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[11px] text-[#262626]/60 font-mono mt-0.5">
                                                NIK: {member.nik_masked || '-'}
                                            </div>
                                        </td>

                                        {/* 2. Profil & Usia */}
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            <div className="font-semibold text-[#262626]">
                                                {age !== null ? `${age} Tahun` : '-'}
                                            </div>
                                            <div className="text-[11px] text-[#262626]/60 capitalize">
                                                {member.gender || 'Tidak dicatat'}
                                            </div>
                                        </td>

                                        {/* 3. Pekerjaan */}
                                        <td className="py-3.5 px-3">
                                            <span className="font-medium text-[#262626]/90">
                                                {member.occupation || '-'}
                                            </span>
                                        </td>

                                        {/* 4. Status & Indikator Warna Kerentanan */}
                                        <td className="py-3.5 px-4">
                                            {mitigation.isDanger ? (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#B91C1C]/15 text-[#B91C1C] border border-[#B91C1C]/30 animate-pulse">
                                                        <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
                                                        IN DANGER! (SANGAT RENTAN)
                                                    </span>
                                                    <div className="text-xs font-bold text-[#B91C1C] capitalize">
                                                        {category.replace('_', ' ')}
                                                    </div>
                                                    {notes && (
                                                        <div className="text-[10px] text-[#B91C1C]/80 font-medium italic">
                                                            &ldquo;{notes}&rdquo;
                                                        </div>
                                                    )}
                                                </div>
                                            ) : category === 'anak_anak' ? (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E5A910]/15 text-[#92400E] border border-[#E5A910]/30">
                                                        <span className="w-2 h-2 rounded-full bg-[#E5A910]" />
                                                        WASPADA (SEDANG)
                                                    </span>
                                                    <div className="text-xs font-semibold text-[#92400E]">
                                                        Anak-anak (4 - 10 Th)
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#15803D]/15 text-[#15803D] border border-[#15803D]/30">
                                                        <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                                                        RISIKO RENDAH (NORMAL)
                                                    </span>
                                                    <div className="text-xs font-medium text-[#15803D]">
                                                        Kondisi Sehat
                                                    </div>
                                                </div>
                                            )}
                                        </td>

                                        {/* 5. Warning & Rekomendasi Mitigasi Proteksi */}
                                        <td className="py-3.5 px-4 max-w-xs">
                                            <div
                                                className={`p-2.5 rounded-xl text-[11px] leading-relaxed border ${
                                                    mitigation.isDanger
                                                        ? 'bg-rose-50/70 border-rose-200 text-rose-800'
                                                        : mitigation.urgency === 'medium'
                                                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                                                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                                }`}
                                            >
                                                {mitigation.advice}
                                            </div>
                                        </td>

                                        {isHeadOfFamily && (
                                            <td className="py-3.5 px-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => onOpenEditModal(member)}
                                                        className="px-2.5 py-1.5 rounded-lg text-[#1F6F5F] hover:bg-[#1F6F5F]/10 transition-all font-semibold text-xs cursor-pointer"
                                                        title="Edit Data Anggota"
                                                    >
                                                        Edit
                                                    </button>
                                                    {!member.is_head && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(member)}
                                                            className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all font-semibold text-xs cursor-pointer"
                                                            title="Hapus Anggota Keluarga"
                                                        >
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
