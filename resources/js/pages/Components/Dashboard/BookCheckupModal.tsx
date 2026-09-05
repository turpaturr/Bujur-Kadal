import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import type { ClinicData } from './Maps/markers';

interface FamilyMemberOption {
    id: number;
    name: string;
    role: string;
    is_head?: boolean;
    is_vulnerable?: boolean;
    vulnerability_category?: string | null;
}

interface BookCheckupModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinic: ClinicData | null;
    familyMembers?: FamilyMemberOption[];
    defaultPatientName?: string;
}

export default function BookCheckupModal({
    isOpen,
    onClose,
    clinic,
    familyMembers = [],
    defaultPatientName = '',
}: BookCheckupModalProps) {
    const [patientName, setPatientName] = useState(defaultPatientName);
    const [patientRole, setPatientRole] = useState('Kepala Keluarga');
    const [checkupDate, setCheckupDate] = useState('');
    const [checkupTime, setCheckupTime] = useState('09:00');
    const [symptoms, setSymptoms] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Tanggal minimum hari ini
    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (isOpen) {
            // Set default date besok atau hari ini jika masih pagi
            const d = new Date();
            d.setDate(d.getDate() + 1);
            setCheckupDate(d.toISOString().split('T')[0]);

            if (familyMembers.length > 0) {
                const head = familyMembers.find((m) => m.is_head) || familyMembers[0];
                setPatientName(head.name);
                setPatientRole(head.role);
            } else if (defaultPatientName) {
                setPatientName(defaultPatientName);
                setPatientRole('Kepala Keluarga');
            }
            setSymptoms('');
            setErrorMsg(null);
        }
    }, [isOpen, familyMembers, defaultPatientName]);

    if (!isOpen || !clinic) return null;

    const handleSelectMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        const member = familyMembers.find((m) => m.id === selectedId);
        if (member) {
            setPatientName(member.name);
            setPatientRole(member.role);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!patientName.trim()) {
            setErrorMsg('Silakan tentukan nama anggota keluarga yang akan diperiksa.');
            return;
        }

        if (!checkupDate) {
            setErrorMsg('Silakan pilih tanggal jadwal kunjungan.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            '/checkup-reservations',
            {
                clinic_id: clinic.id,
                clinic_name: clinic.name,
                clinic_address: clinic.addr ?? null,
                patient_name: patientName,
                patient_role: patientRole,
                checkup_date: checkupDate,
                checkup_time: checkupTime,
                symptoms: symptoms.trim() || 'Pemeriksaan kesehatan rutin / antisipasi dampak asap karhutla.',
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    const firstError = Object.values(errs)[0];
                    setErrorMsg(firstError || 'Gagal mengirim permohonan reservasi. Periksa input Anda.');
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header Modal */}
                <div className="bg-gradient-to-r from-[#1F6F5F] to-[#2FA084] p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.5 2h7v6.5H22v7h-6.5V22h-7v-6.5H2v-7h6.5V2z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                                    Reservasi Fasilitas Kesehatan
                                </span>
                                <h3 className="font-display text-base sm:text-lg font-bold leading-tight">
                                    Buat Jadwal Medical Checkup
                                </h3>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Badge Info Faskes */}
                    <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                            <span className="font-bold text-white block truncate">{clinic.name}</span>
                            <span className="text-[11px] text-emerald-100 truncate block">
                                {clinic.addr || 'Posko Siaga ISPA se-Kalimantan'}
                            </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-800/60 text-emerald-200 text-[10px] font-bold shrink-0 border border-emerald-400/30">
                            Buka / Siaga
                        </span>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Pilihan Pasien / Anggota Keluarga */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Pilih Anggota Keluarga yang Diperiksa <span className="text-rose-500">*</span>
                        </label>
                        {familyMembers.length > 0 ? (
                            <select
                                onChange={handleSelectMember}
                                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] outline-hidden bg-gray-50"
                            >
                                {familyMembers.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} ({m.role}{m.is_vulnerable ? ' · Prioritas Rentan' : ''})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Nama Lengkap Pasien"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] outline-hidden"
                                required
                            />
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                            Daftarkan lansia, balita, atau penderita gangguan pernapasan untuk pemeriksaan lebih dini.
                        </p>
                    </div>

                    {/* Baris Tanggal & Jam */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Tanggal Kunjungan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                min={todayStr}
                                value={checkupDate}
                                onChange={(e) => setCheckupDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] outline-hidden"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Jam Kunjungan <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={checkupTime}
                                onChange={(e) => setCheckupTime(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] outline-hidden bg-white"
                                required
                            >
                                <option value="08:00">08:00 WITA (Pagi)</option>
                                <option value="09:00">09:00 WITA (Pagi)</option>
                                <option value="10:00">10:00 WITA (Pagi)</option>
                                <option value="11:00">11:00 WITA (Siang)</option>
                                <option value="13:00">13:00 WITA (Siang)</option>
                                <option value="14:00">14:00 WITA (Siang)</option>
                                <option value="15:00">15:00 WITA (Sore)</option>
                            </select>
                        </div>
                    </div>

                    {/* Catatan / Gejala Keluhan */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Keluhan / Gejala Kesehatan (Opsional)
                        </label>
                        <textarea
                            rows={3}
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Contoh: Sesak napas ringan karena kabut asap, batuk berdahak 3 hari, atau checkup rutin paru..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] outline-hidden resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2FA084] hover:bg-[#1F6F5F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Mengirim Reservasi...</span>
                                </>
                            ) : (
                                <>
                                    <span>Kirim Permintaan Reservasi</span>
                                    <span>&rarr;</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
