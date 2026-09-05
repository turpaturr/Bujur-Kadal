import React, { useState, useMemo } from 'react';
import { KALIMANTAN_CLINICS, type ClinicItem } from '@/data/kalimantanClinics';

export default function FacilitiesView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 15;

    // Filter clinics based on search
    const filteredClinics = useMemo(() => {
        if (!searchQuery.trim()) return KALIMANTAN_CLINICS;
        const q = searchQuery.toLowerCase();
        return KALIMANTAN_CLINICS.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                (c.addr && c.addr.toLowerCase().includes(q))
        );
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredClinics.length / pageSize);
    const paginatedClinics = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredClinics.slice(start, start + pageSize);
    }, [filteredClinics, page]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header & Metrik Singkat */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#1F6F5F] font-display">
                        Jaringan Fasilitas Kesehatan &amp; Posko Oksigen
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Pusat data rujukan 1.848 Puskesmas, Rumah Sakit, dan Klinik se-Pulau Kalimantan
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                        1.848 Faskes Terdata di Peta
                    </span>
                </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#EEEEEE] shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Total Jaringan Faskes
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#1F6F5F] font-mono">1.848</span>
                        <span className="text-xs text-gray-500 font-medium">Titik Aktif</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Tersebar di 5 Provinsi Kalimantan</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EEEEEE] shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Kesiapsiagaan ISPA
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-600 font-mono">100%</span>
                        <span className="text-xs text-emerald-700 font-medium">Tersinkronisasi</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Terhubung ke satelit pemantau asap</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EEEEEE] shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Layanan Gawat Darurat
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-purple-600 font-mono">24 Jam</span>
                        <span className="text-xs text-purple-700 font-medium">IGD &amp; Oksigen</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Protokol darurat bencana karhutla</p>
                </div>
            </div>

            {/* Pencarian & Tabel Faskes */}
            <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden shadow-xs">
                <div className="p-4 border-b border-[#EEEEEE] bg-[#FAFAFA] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Cari nama Puskesmas / Klinik / Alamat..."
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#1F6F5F] focus:ring-1 focus:ring-[#1F6F5F]"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        Menampilkan {filteredClinics.length.toLocaleString('id-ID')} Fasilitas
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAFAFA] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-[#EEEEEE]">
                            <tr>
                                <th className="px-4 py-3">Nama Faskes</th>
                                <th className="px-4 py-3">Alamat / Wilayah</th>
                                <th className="px-4 py-3">Koordinat GPS</th>
                                <th className="px-4 py-3">Status Kesiapan ISPA</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedClinics.map((clinic) => (
                                <tr key={clinic.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                            <span>{clinic.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                        {clinic.addr ?? 'Kalimantan, Indonesia'}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[11px] text-gray-500">
                                        {clinic.lat.toFixed(4)}, {clinic.lng.toFixed(4)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            Siaga Oksigen &amp; Obat
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[#1F6F5F] font-bold hover:underline cursor-pointer"
                                        >
                                            <span>Buka Maps</span>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-3 border-t border-[#EEEEEE] bg-[#FAFAFA] flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                            Halaman {page} dari {totalPages}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 cursor-pointer"
                            >
                                Sebelumnya
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 cursor-pointer"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
