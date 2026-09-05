import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface UserReservationItem {
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
    created_at_raw?: string;
}

interface UserReservationInboxModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservations: UserReservationItem[];
}

export default function UserReservationInboxModal({
    isOpen,
    onClose,
    reservations = [],
}: UserReservationInboxModalProps) {
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    if (!isOpen) return null;

    const filteredReservations = reservations.filter((r) => {
        if (filterStatus === 'all') return true;
        return r.status === filterStatus;
    });

    const pendingCount = reservations.filter((r) => r.status === 'pending').length;
    const approvedCount = reservations.filter((r) => r.status === 'approved').length;
    const rejectedCount = reservations.filter((r) => r.status === 'rejected').length;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header Modal */}
                <div className="bg-gradient-to-r from-[#1F6F5F] to-[#2FA084] p-5 text-white shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-lg shadow-2xs">
                                📬
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                                    Kotak Masuk Warga
                                </span>
                                <h3 className="font-display text-lg font-bold leading-tight">
                                    Notifikasi &amp; Riwayat Reservasi Faskes
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

                    {/* Filter Tabs */}
                    <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => setFilterStatus('all')}
                            className={cn(
                                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                                filterStatus === 'all'
                                    ? 'bg-white text-[#1F6F5F] shadow-xs'
                                    : 'bg-white/15 text-white hover:bg-white/25',
                            )}
                        >
                            Semua ({reservations.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus('approved')}
                            className={cn(
                                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                                filterStatus === 'approved'
                                    ? 'bg-emerald-500 text-white shadow-xs'
                                    : 'bg-white/15 text-white hover:bg-white/25',
                            )}
                        >
                            ✓ Disetujui ({approvedCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus('pending')}
                            className={cn(
                                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                                filterStatus === 'pending'
                                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                                    : 'bg-white/15 text-white hover:bg-white/25',
                            )}
                        >
                            ⏳ Menunggu ({pendingCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus('rejected')}
                            className={cn(
                                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                                filterStatus === 'rejected'
                                    ? 'bg-rose-500 text-white shadow-xs'
                                    : 'bg-white/15 text-white hover:bg-white/25',
                            )}
                        >
                            ✕ Ditolak ({rejectedCount})
                        </button>
                    </div>
                </div>

                {/* Body List Notifikasi */}
                <div className="p-5 overflow-y-auto flex-1 space-y-3">
                    {filteredReservations.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3 text-gray-400">
                                📭
                            </div>
                            <h4 className="font-bold text-gray-700 text-sm">Belum Ada Notifikasi Reservasi</h4>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                                Anda belum mengajukan jadwal medical checkup di faskes manapun. Pilih ikon rumah sakit di peta dan klik "Buat Jadwal Medical Checkup".
                            </p>
                        </div>
                    ) : (
                        filteredReservations.map((item) => {
                            const isApproved = item.status === 'approved';
                            const isRejected = item.status === 'rejected';
                            const isPending = item.status === 'pending';

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        'rounded-xl border p-4 transition-all',
                                        isApproved
                                            ? 'bg-emerald-50/60 border-emerald-200'
                                            : isRejected
                                              ? 'bg-rose-50/60 border-rose-200'
                                              : 'bg-amber-50/50 border-amber-200',
                                    )}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/5">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border',
                                                        isApproved
                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                            : isRejected
                                                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                                                              : 'bg-amber-100 text-amber-900 border-amber-300',
                                                    )}
                                                >
                                                    {isApproved
                                                        ? '✓ Reservasi Disetujui (Diterima)'
                                                        : isRejected
                                                          ? '✕ Reservasi Ditolak'
                                                          : '⏳ Menunggu Konfirmasi'}
                                                </span>
                                                <span className="text-[11px] text-gray-500">
                                                    Diajukan {item.created_at ?? 'baru saja'}
                                                </span>
                                            </div>
                                            <h4 className="font-display text-sm font-bold text-gray-900 mt-1">
                                                {item.clinic_name}
                                            </h4>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <div className="text-xs font-bold text-[#1F6F5F]">
                                                📅 {item.checkup_date}
                                            </div>
                                            <div className="text-[11px] font-mono text-gray-600">
                                                ⏰ Pukul {item.checkup_time} WITA
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pasien & Keluhan */}
                                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500 text-[11px] block">Pasien:</span>
                                            <span className="font-bold text-gray-800">
                                                {item.patient_name}{' '}
                                                <span className="text-[10.5px] font-normal text-gray-500">
                                                    ({item.patient_role || 'Anggota'})
                                                </span>
                                            </span>
                                        </div>

                                        {item.symptoms && (
                                            <div>
                                                <span className="text-gray-500 text-[11px] block">Keluhan / Catatan:</span>
                                                <span className="text-gray-700 italic text-[11px] line-clamp-2">
                                                    "{item.symptoms}"
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Catatan Balasan dari Admin / Faskes */}
                                    {item.admin_notes && (
                                        <div
                                            className={cn(
                                                'mt-3 p-2.5 rounded-lg text-xs border flex items-start gap-2',
                                                isApproved
                                                    ? 'bg-white/80 border-emerald-300 text-emerald-900'
                                                    : isRejected
                                                      ? 'bg-white/80 border-rose-300 text-rose-900'
                                                      : 'bg-white/80 border-amber-300 text-amber-950',
                                            )}
                                        >
                                            <span className="text-sm">
                                                {isApproved ? '📋' : isRejected ? 'ℹ️' : '💬'}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <strong className="block text-[11px] font-bold">
                                                    {isApproved
                                                        ? 'Pesan Konfirmasi Petugas Faskes:'
                                                        : isRejected
                                                          ? 'Alasan Penolakan Jadwal:'
                                                          : 'Catatan Petugas:'}
                                                </strong>
                                                <p className="text-[11.5px] mt-0.5 leading-snug">
                                                    {item.admin_notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Modal */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
                    <span>Layanan koordinasi fasilitas kesehatan tanggap bencana ISPA Kalimantan.</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
