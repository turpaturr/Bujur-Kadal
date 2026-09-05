import React, { useState } from 'react';

export default function Step1Kependudukan({ data, setData, errors, clearErrors }) {
    const [verifying, setVerifying] = useState(false);
    const [dukcapilResult, setDukcapilResult] = useState(null);
    const [dukcapilError, setDukcapilError] = useState(null);

    const handleVerifyDukcapil = async () => {
        setDukcapilError(null);
        setDukcapilResult(null);

        if (!data.no_kk || data.no_kk.length !== 16) {
            setDukcapilError('Nomor KK harus 16 digit angka sebelum diverifikasi.');
            return;
        }

        if (!data.nik || data.nik.length !== 16) {
            setDukcapilError('NIK harus 16 digit angka sebelum diverifikasi.');
            return;
        }

        setVerifying(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/register/step-1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    no_kk: data.no_kk,
                    nik: data.nik,
                }),
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setDukcapilResult(result.data);
                clearErrors('no_kk', 'nik');
            } else {
                setDukcapilError(result.message || result.errors?.nik?.[0] || result.errors?.no_kk?.[0] || 'Verifikasi Dukcapil gagal.');
            }
        } catch (err) {
            setDukcapilError('Gagal menghubungi server verifikasi kependudukan.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <span className="w-2 h-6 bg-emerald-600 rounded-full mr-2.5"></span>
                    Identitas Kependudukan (Dukcapil)
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                    Sistem memvalidasi NIK dan Nomor KK secara otomatis untuk memastikan data warga Borneo terdaftar secara resmi dalam sistem evakuasi.
                </p>
            </div>

            {/* Input No. KK */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="no_kk" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Nomor Kartu Keluarga (KK) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                        {data.no_kk?.length || 0}/16 digit
                    </span>
                </div>
                <div className="relative">
                    <input
                        id="no_kk"
                        type="text"
                        maxLength={16}
                        value={data.no_kk}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setData('no_kk', val);
                            setDukcapilResult(null);
                        }}
                        placeholder="Contoh: 6472010101010001"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm tracking-wide"
                    />
                </div>
                {errors.no_kk && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.no_kk}</p>
                )}
            </div>

            {/* Input NIK */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="nik" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                        {data.nik?.length || 0}/16 digit
                    </span>
                </div>
                <div className="relative">
                    <input
                        id="nik"
                        type="text"
                        maxLength={16}
                        value={data.nik}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setData('nik', val);
                            setDukcapilResult(null);
                        }}
                        placeholder="Contoh: 6472011508950001"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm tracking-wide"
                    />
                </div>
                {errors.nik && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.nik}</p>
                )}
            </div>

            {/* Tombol Validasi Mock Dukcapil */}
            <div className="flex items-center justify-between pt-1">
                <button
                    type="button"
                    onClick={handleVerifyDukcapil}
                    disabled={verifying || (data.nik?.length !== 16 || data.no_kk?.length !== 16)}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-300/60 dark:border-emerald-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                    {verifying ? (
                        <>
                            <svg className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Memverifikasi Dukcapil...
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verifikasi Dukcapil Sekarang
                        </>
                    )}
                </button>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
                    Format NIK & KK standar Kemendagri
                </span>
            </div>

            {/* Hasil Verifikasi Sukses */}
            {dukcapilResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 animate-fadeIn">
                    <div className="flex items-start">
                        <div className="p-1.5 rounded-lg bg-emerald-600 text-white mr-3 mt-0.5 shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                Terverifikasi Resmi di Database Kependudukan
                            </h4>
                            <p className="mt-1 text-xs text-emerald-700/90 dark:text-emerald-400">
                                {dukcapilResult.province} &bull; {dukcapilResult.regency}
                            </p>
                            <p className="text-[10px] text-emerald-600/75 dark:text-emerald-500 mt-0.5">
                                Kode verifikasi sinkron dengan server mitigasi bencana BorneoCare.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Pesan Error Dukcapil */}
            {dukcapilError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{dukcapilError}</span>
                    </div>
                </div>
            )}

            {/* Input Nama Lengkap */}
            <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
                {errors.name && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.name}</p>
                )}
            </div>
        </div>
    );
}
