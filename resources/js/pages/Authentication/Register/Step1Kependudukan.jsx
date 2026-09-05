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
        <div className="space-y-4 font-sans">
            {/* Input Nama Lengkap */}
            <div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Full Name (Nama Lengkap)"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"
                    />
                </div>
                {errors.name && (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.name}</p>
                )}
            </div>

            {/* Input No. KK */}
            <div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
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
                        placeholder="16 Digit No. KK (Kartu Keluarga)"
                        className="w-full pl-11 pr-16 py-3 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary tracking-wide"
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] text-neutral-400 font-mono">
                        {data.no_kk?.length || 0}/16
                    </span>
                </div>
                {errors.no_kk && (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.no_kk}</p>
                )}
            </div>

            {/* Input NIK */}
            <div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                    </div>
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
                        placeholder="16 Digit NIK (KTP)"
                        className="w-full pl-11 pr-16 py-3 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary tracking-wide"
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] text-neutral-400 font-mono">
                        {data.nik?.length || 0}/16
                    </span>
                </div>
                {errors.nik && (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.nik}</p>
                )}
            </div>

            {/* Tombol Verifikasi Cek Dukcapil */}
            <div className="pt-1 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleVerifyDukcapil}
                    disabled={verifying || data.nik?.length !== 16 || data.no_kk?.length !== 16}
                    className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold text-primary-dark bg-surface border border-primary/40 hover:bg-accent/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                    {verifying ? (
                        <>
                            <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifikasi Dukcapil...
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verifikasi Dukcapil Sekarang
                        </>
                    )}
                </button>
                <span className="text-[10px] text-neutral-400">Kemendagri standard</span>
            </div>

            {/* Hasil Verifikasi Sukses */}
            {dukcapilResult && (
                <div className="p-3.5 rounded-2xl bg-accent/15 border border-primary/30 text-xs text-primary-dark flex items-center space-x-2.5 animate-fadeIn">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="leading-tight">
                        <div className="font-bold text-primary-dark">Terverifikasi Dukcapil</div>
                        <div className="text-[11px] text-primary">{dukcapilResult.province} &bull; {dukcapilResult.regency}</div>
                    </div>
                </div>
            )}

            {/* Error Dukcapil */}
            {dukcapilError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {dukcapilError}
                </div>
            )}
        </div>
    );
}
