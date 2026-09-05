import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export interface AdminReservationItem {
    id: number;
    clinic_id: string;
    clinic_name: string;
    clinic_address?: string | null;
    patient_name: string;
    patient_role?: string | null;
    checkup_date: string;
    checkup_time: string;
    symptoms?: string | null;
    status: 'pending' | 'approved' | 'rejected' | string;
    admin_notes?: string | null;
    created_at?: string;
    user?: {
        id: number;
        name: string;
        no_kk?: string | null;
        home_address?: string | null;
        whatsapp_number?: string | null;
        whatsapp_link?: string | null;
    };
}

interface CheckupReservationsViewProps {
    reservations?: AdminReservationItem[];
}

export default function CheckupReservationsView({
    reservations = [],
}: CheckupReservationsViewProps) {
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeActionId, setActiveActionId] = useState<number | null>(null);
    const [actionNotes, setActionNotes] = useState<Record<number, string>>({});
    const [isProcessing, setIsProcessing] = useState<number | null>(null);

    // Counts
    const pendingCount = reservations.filter((r) => r.status === 'pending').length;
    const approvedCount = reservations.filter((r) => r.status === 'approved').length;
    const rejectedCount = reservations.filter((r) => r.status === 'rejected').length;

    // Filter and search
    const filteredReservations = reservations.filter((r) => {
        if (filterStatus !== 'all' && r.status !== filterStatus) {
            return false;
        }
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const patient = (r.patient_name || '').toLowerCase();
            const clinic = (r.clinic_name || '').toLowerCase();
            const head = (r.user?.name || '').toLowerCase();
            const nokk = (r.user?.no_kk || '').toLowerCase();
            return (
                patient.includes(query) ||
                clinic.includes(query) ||
                head.includes(query) ||
                nokk.includes(query)
            );
        }
        return true;
    });

    const handleNoteChange = (id: number, text: string) => {
        setActionNotes((prev) => ({
            ...prev,
            [id]: text,
        }));
    };

    const handleApprove = (id: number) => {
        const note = actionNotes[id] ?? '';
        setIsProcessing(id);
        router.post(
            `/admin/checkup-reservations/${id}/approve`,
            { admin_notes: note },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(null);
                    setActiveActionId(null);
                },
            }
        );
    };

    const handleReject = (id: number) => {
        const note = actionNotes[id] ?? '';
        if (!note.trim()) {
            const confirmWithout = confirm(
                'Anda belum mengisi alasan penolakan. Berikan alasan penolakan agar warga mengetahui alasan jadwal tidak tersedia. Tetap tolak tanpa catatan?'
            );
            if (!confirmWithout) return;
        }

        setIsProcessing(id);
        router.post(
            `/admin/checkup-reservations/${id}/reject`,
            { admin_notes: note },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(null);
                    setActiveActionId(null);
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Title & Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2FA084]/15 text-[#1F6F5F] border border-[#2FA084]/25">
                            <span className="w-2 h-2 rounded-full bg-[#2FA084] animate-pulse"></span>
                            Faskes Mitra Satgas Karhutla
                        </span>
                        {pendingCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-bounce">
                                {pendingCount} Menunggu Konfirmasi
                            </span>
                        )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1F6F5F] font-display mt-1">
                        Reservasi Medical Checkup &amp; Faskes
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Tinjau antrean reservasi warga terdampak asap karhutla, cek ketersediaan slot nakes/dokter, lalu terima atau tolak jadwal dengan transparan.
                    </p>
                </div>

                {/* Filter Status Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold shrink-0">
                    <button
                        type="button"
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            filterStatus === 'all'
                                ? 'bg-white text-[#1F6F5F] shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Semua ({reservations.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('pending')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                            filterStatus === 'pending'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-amber-800 hover:bg-amber-100'
                        }`}
                    >
                        <span>Menunggu</span>
                        {pendingCount > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                filterStatus === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
                            }`}>
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('approved')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            filterStatus === 'approved'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-emerald-800 hover:bg-emerald-100'
                        }`}
                    >
                        Disetujui ({approvedCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus('rejected')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            filterStatus === 'rejected'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-rose-800 hover:bg-rose-100'
                        }`}
                    >
                        Ditolak ({rejectedCount})
                    </button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reservasi</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{reservations.length}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Warga dari berbagai faskes</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 shadow-xs">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Perlu Tindakan</span>
                    <div className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</div>
                    <div className="text-[11px] text-amber-600/80 mt-0.5">Menunggu konfirmasi admin</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Jadwal Disetujui</span>
                    <div className="text-2xl font-bold text-emerald-700 mt-1">{approvedCount}</div>
                    <div className="text-[11px] text-emerald-600/80 mt-0.5">Siap dilayani di faskes</div>
                </div>
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 shadow-xs">
                    <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Jadwal Ditolak</span>
                    <div className="text-2xl font-bold text-rose-700 mt-1">{rejectedCount}</div>
                    <div className="text-[11px] text-rose-600/80 mt-0.5">Jadwal penuh / dialihkan</div>
                </div>
            </div>

            {/* Search Box */}
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari pasien, faskes, nama kepala keluarga, atau nomor KK..."
                    className="w-full px-4 py-2.5 pl-10 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2FA084]/40 focus:border-[#2FA084]"
                />
                <svg
                    className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-2.5 text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                        ✕ Bersihkan
                    </button>
                )}
            </div>

            {/* Reservation List */}
            {filteredReservations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 text-base">Tidak Ada Antrean Reservasi</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                        {searchQuery
                            ? `Tidak ada hasil untuk pencarian "${searchQuery}".`
                            : 'Belum ada permintaan reservasi medical checkup dengan status ini.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReservations.map((item) => {
                        const isPending = item.status === 'pending';
                        const isApproved = item.status === 'approved';
                        const isRejected = item.status === 'rejected';
                        const isThisProcessing = isProcessing === item.id;
                        const currentNote = actionNotes[item.id] !== undefined ? actionNotes[item.id] : (item.admin_notes ?? '');

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                                    isPending
                                        ? 'border-amber-300 ring-2 ring-amber-400/20'
                                        : isApproved
                                          ? 'border-emerald-200'
                                          : 'border-rose-200 opacity-90'
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    {/* Left Content: Details */}
                                    <div className="space-y-3 flex-1">
                                        {/* Badges & Clinic Info */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Status Badge */}
                                            {isPending && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                                    Menunggu Konfirmasi Admin
                                                </span>
                                            )}
                                            {isApproved && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Jadwal Disetujui
                                                </span>
                                            )}
                                            {isRejected && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Jadwal Ditolak
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                                🏥 {item.clinic_name}
                                            </span>

                                            {item.created_at && (
                                                <span className="text-[11px] text-gray-400 font-medium">
                                                    Diajukan {item.created_at}
                                                </span>
                                            )}
                                        </div>

                                        {/* Main Patient & Schedule Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                            {/* Patient Box */}
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                                                    Pasien yang Diperiksa
                                                </div>
                                                <div className="text-base font-bold text-gray-900 mt-0.5 flex items-center gap-2">
                                                    <span>{item.patient_name}</span>
                                                    <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-[#2FA084]/15 text-[#1F6F5F]">
                                                        {item.patient_role || 'Anggota Keluarga'}
                                                    </span>
                                                </div>
                                                {item.user && (
                                                    <div className="mt-2 text-xs text-gray-600 space-y-0.5 border-t border-gray-200/60 pt-1.5">
                                                        <div>Kepala Keluarga: <strong>{item.user.name}</strong></div>
                                                        {item.user.home_address && (
                                                            <div className="truncate" title={item.user.home_address}>
                                                                Alamat: {item.user.home_address}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Schedule Box */}
                                            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                                <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">
                                                    Jadwal Kunjungan Diminta
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                                                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{item.checkup_date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                                                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{item.checkup_time} WITA</span>
                                                    </div>
                                                </div>

                                                {item.clinic_address && (
                                                    <div className="mt-2 text-xs text-gray-500 truncate" title={item.clinic_address}>
                                                        📍 {item.clinic_address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Symptoms / Complaints */}
                                        {item.symptoms && (
                                            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs">
                                                <span className="font-bold text-amber-900">Keluhan Gejala &amp; Riwayat:</span>
                                                <p className="text-gray-700 mt-0.5 leading-relaxed">{item.symptoms}</p>
                                            </div>
                                        )}

                                        {/* Existing Admin Notes (if already decided) */}
                                        {item.admin_notes && !isPending && (
                                            <div className={`p-3 rounded-xl border text-xs ${
                                                isApproved ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                                            }`}>
                                                <span className="font-bold">Catatan Otoritas Faskes:</span>
                                                <p className="mt-0.5 leading-relaxed">{item.admin_notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Content: Action Panel (Terima / Tolak) */}
                                    <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-4 flex flex-col justify-between">
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                    Tindakan Otoritas
                                                </span>
                                                {item.user?.whatsapp_link && (
                                                    <a
                                                        href={item.user.whatsapp_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <span>WA Warga &nearr;</span>
                                                    </a>
                                                )}
                                            </div>

                                            {/* Note input for decisions */}
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                                    Catatan / Instruksi ke Warga:
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={currentNote}
                                                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                                                    placeholder={
                                                        isPending
                                                            ? 'Contoh: Hadir di loket 2 lantai 1 / Jadwal penuh mohon reschedule...'
                                                            : 'Perbarui catatan keputusan...'
                                                    }
                                                    disabled={isThisProcessing}
                                                    className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2FA084] disabled:bg-gray-100"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons: Terima (Approve) / Tolak (Reject) */}
                                        <div className="mt-3.5 space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(item.id)}
                                                    disabled={isThisProcessing}
                                                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                                                        isApproved
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                            : 'bg-[#059669] hover:bg-[#047857] text-white active:scale-98'
                                                    }`}
                                                >
                                                    {isThisProcessing ? (
                                                        <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    <span>{isApproved ? 'Perbarui' : 'Terima'}</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleReject(item.id)}
                                                    disabled={isThisProcessing}
                                                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                                                        isRejected
                                                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                                            : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-98'
                                                    }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span>{isRejected ? 'Perbarui' : 'Tolak'}</span>
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-gray-400 text-center">
                                                Status dan catatan akan dikirim langsung ke notifikasi inbox warga.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
