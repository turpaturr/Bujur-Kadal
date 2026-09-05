import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface FamilyMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export type VulnerabilityType =
    | 'ibu_hamil'
    | 'balita'
    | 'anak_anak'
    | 'penyakit_bawaan'
    | 'lansia'
    | 'tidak_rentan';

interface VulnerabilityOption {
    id: VulnerabilityType;
    label: string;
    sublabel: string;
    level: 'kritis' | 'sedang' | 'rendah';
    badge: string;
    badgeColor: string;
}

const VULNERABILITY_OPTIONS: VulnerabilityOption[] = [
    {
        id: 'ibu_hamil',
        label: 'Ibu Hamil',
        sublabel: 'Sensitif terhadap partikel racun PM2.5',
        level: 'kritis',
        badge: 'Bahaya Tinggi (In Danger)',
        badgeColor: 'bg-[#B91C1C]/15 text-[#B91C1C] border-[#B91C1C]/30',
    },
    {
        id: 'balita',
        label: 'Balita (< 4 Tahun)',
        sublabel: 'Saluran pernapasan dalam tahap perkembangan',
        level: 'kritis',
        badge: 'Bahaya Tinggi (In Danger)',
        badgeColor: 'bg-[#B91C1C]/15 text-[#B91C1C] border-[#B91C1C]/30',
    },
    {
        id: 'lansia',
        label: 'Lansia (> 60 Tahun)',
        sublabel: 'Penurunan kapasitas imun & daya tahan paru-paru',
        level: 'kritis',
        badge: 'Bahaya Tinggi (In Danger)',
        badgeColor: 'bg-[#B91C1C]/15 text-[#B91C1C] border-[#B91C1C]/30',
    },
    {
        id: 'penyakit_bawaan',
        label: 'Penyakit Bawaan / Komorbid',
        sublabel: 'Pengidap asma kronis, PPOK, bronkitis, atau jantung',
        level: 'kritis',
        badge: 'Prioritas Oksigen',
        badgeColor: 'bg-[#B91C1C]/15 text-[#B91C1C] border-[#B91C1C]/30',
    },
    {
        id: 'anak_anak',
        label: 'Anak-anak (4 - 10 Tahun)',
        sublabel: 'Aktivitas fisik tinggi & rentan iritasi asap pekat',
        level: 'sedang',
        badge: 'Waspada (Sedang)',
        badgeColor: 'bg-[#E5A910]/15 text-[#B45309] border-[#E5A910]/30',
    },
    {
        id: 'tidak_rentan',
        label: 'Normal / Sehat',
        sublabel: 'Usia produktif tanpa riwayat penyakit pernapasan',
        level: 'rendah',
        badge: 'Risiko Rendah',
        badgeColor: 'bg-[#15803D]/15 text-[#15803D] border-[#15803D]/30',
    },
];

export default function FamilyMemberModal({ isOpen, onClose }: FamilyMemberModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        birth_date: '',
        gender: 'laki-laki' as 'laki-laki' | 'perempuan',
        occupation: '',
        vulnerability_category: 'tidak_rentan' as VulnerabilityType,
        comorbidity_notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const validate = () => {
        const errs: Record<string, string> = {};

        if (!formData.name.trim()) errs.name = 'Nama lengkap anggota keluarga wajib diisi.';
        if (!formData.nik.trim()) {
            errs.nik = 'NIK anggota keluarga wajib diisi.';
        } else if (formData.nik.length !== 16 || !/^\d{16}$/.test(formData.nik)) {
            errs.nik = 'NIK harus terdiri dari tepat 16 digit angka.';
        }
        if (!formData.birth_date) {
            errs.birth_date = 'Tanggal lahir wajib ditentukan.';
        }
        if (!formData.occupation.trim()) {
            errs.occupation = 'Pekerjaan anggota keluarga wajib diisi.';
        }
        if (
            formData.vulnerability_category === 'penyakit_bawaan' &&
            !formData.comorbidity_notes.trim()
        ) {
            errs.comorbidity_notes =
                'Mohon jelaskan rincian penyakit bawaan (misal: Asma sejak 2020).';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        router.post('/family/members', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                setFormData({
                    name: '',
                    nik: '',
                    birth_date: '',
                    gender: 'laki-laki',
                    occupation: '',
                    vulnerability_category: 'tidak_rentan',
                    comorbidity_notes: '',
                });
                setErrors({});
                onClose();
            },
            onError: (errs) => {
                setSubmitting(false);
                setErrors(errs as Record<string, string>);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn font-sans">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EEEEEE] overflow-hidden my-8">
                {/* Modal Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-[#1F6F5F] to-[#2FA084] text-white flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-white/20 text-white">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </span>
                            <h3 className="font-display text-lg font-bold tracking-tight">
                                Tambah Anggota Keluarga
                            </h3>
                        </div>
                        <p className="mt-1 text-xs text-white/80">
                            Setiap anggota keluarga akan tercatat dalam pemetaan mitigasi kerentanan ISPA dan mewarisi PIN login keluarga.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4.5 max-h-[calc(85vh-120px)] overflow-y-auto">
                    {/* 1. Nama Lengkap & NIK */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-bold text-[#1F6F5F] mb-1.5">
                                Nama Lengkap Anggota <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: Siti Rahma / Rayyan"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEEEEE]/50 border border-[#EEEEEE] text-xs sm:text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#2FA084] focus:bg-white transition-all"
                            />
                            {errors.name && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#1F6F5F] mb-1.5">
                                NIK Anggota (16 Digit) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                maxLength={16}
                                value={formData.nik}
                                onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                                placeholder="16 Digit NIK KTP / KIA"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEEEEE]/50 border border-[#EEEEEE] text-xs sm:text-sm text-[#262626] font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-[#2FA084] focus:bg-white transition-all"
                            />
                            {errors.nik && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.nik}</p>}
                        </div>
                    </div>

                    {/* 2. Tanggal Lahir & Jenis Kelamin */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-bold text-[#1F6F5F] mb-1.5">
                                Tanggal Lahir <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEEEEE]/50 border border-[#EEEEEE] text-xs sm:text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#2FA084] focus:bg-white transition-all"
                            />
                            {errors.birth_date && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.birth_date}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#1F6F5F] mb-1.5">
                                Jenis Kelamin <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'laki-laki' })}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        formData.gender === 'laki-laki'
                                            ? 'bg-[#1F6F5F] text-white border-[#1F6F5F] shadow-xs font-bold'
                                            : 'bg-[#EEEEEE]/50 text-[#262626] border-[#EEEEEE] hover:bg-[#EEEEEE]'
                                    }`}
                                >
                                    Laki-laki
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'perempuan' })}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        formData.gender === 'perempuan'
                                            ? 'bg-[#1F6F5F] text-white border-[#1F6F5F] shadow-xs font-bold'
                                            : 'bg-[#EEEEEE]/50 text-[#262626] border-[#EEEEEE] hover:bg-[#EEEEEE]'
                                    }`}
                                >
                                    Perempuan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Pekerjaan (Input Teks Mandiri) */}
                    <div>
                        <label className="block text-xs font-bold text-[#1F6F5F] mb-1.5">
                            Pekerjaan / Aktivitas Utama <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            placeholder="Contoh: Petani Kebun / Pelajar SMA / Ibu Rumah Tangga / Balita"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEEEEE]/50 border border-[#EEEEEE] text-xs sm:text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#2FA084] focus:bg-white transition-all"
                        />
                        {errors.occupation && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.occupation}</p>}
                    </div>

                    {/* 4. Kategori Kerentanan (Dengan Indikator Warna Bahaya) */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-[#1F6F5F]">
                                Kategori Kerentanan Terhadap Asap Karhutla <span className="text-rose-500">*</span>
                            </label>
                            <span className="text-[10px] text-[#262626]/60">Tentukan tingkat kerentanan fisik</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {VULNERABILITY_OPTIONS.map((opt) => {
                                const isSelected = formData.vulnerability_category === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, vulnerability_category: opt.id })}
                                        className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                                            isSelected
                                                ? 'border-[#1F6F5F] bg-[#2FA084]/10 shadow-xs'
                                                : 'border-[#EEEEEE] bg-white hover:border-[#2FA084]/40'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <span className="text-xs font-bold text-[#1F6F5F]">
                                                {opt.label}
                                            </span>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                                                {opt.badge}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#262626]/70 leading-tight">
                                            {opt.sublabel}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 5. Detail Penyakit Bawaan (Jika memilih Penyakit Bawaan) */}
                    {formData.vulnerability_category === 'penyakit_bawaan' && (
                        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 animate-fadeIn">
                            <label className="block text-xs font-bold text-rose-800 mb-1">
                                Rincian Penyakit Bawaan / Komorbiditas <span className="text-rose-500">*</span>
                            </label>
                            <p className="text-[11px] text-rose-700/80 mb-2">
                                Jelaskan diagnosis atau riwayat pernapasan yang dialami (misal: Asma sejak 2020, membutuhkan nebulizer, PPOK, atau kelainan jantung).
                            </p>
                            <textarea
                                rows={2}
                                value={formData.comorbidity_notes}
                                onChange={(e) => setFormData({ ...formData, comorbidity_notes: e.target.value })}
                                placeholder="Tuliskan catatan medis atau obat darurat yang digunakan..."
                                className="w-full p-2.5 rounded-xl bg-white border border-rose-200 text-xs text-[#262626] focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            {errors.comorbidity_notes && (
                                <p className="mt-1 text-[11px] text-rose-600 font-medium">
                                    {errors.comorbidity_notes}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Catatan Kredensial Login */}
                    <div className="p-3 rounded-2xl bg-[#EEEEEE]/70 border border-[#EEEEEE] flex items-center gap-2.5 text-xs text-[#1F6F5F]">
                        <svg className="w-4 h-4 shrink-0 text-[#2FA084]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.5m6.5 4A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-[11px] leading-tight">
                            <strong>Akses Mandiri:</strong> Anggota keluarga ini dapat login mandiri menggunakan NIK mereka dan PIN Keluarga yang telah dibuat oleh Kepala Keluarga.
                        </span>
                    </div>

                    {/* Modal Actions */}
                    <div className="pt-3 border-t border-[#EEEEEE] flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-[#262626]/70 hover:bg-[#EEEEEE] transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2FA084] text-white hover:bg-[#1F6F5F] transition-all text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {submitting ? (
                                <>
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Simpan Anggota Keluarga</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
