import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function LoginIndex() {
    const [showPin, setShowPin] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nik: '',
        pin: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('pin'),
        });
    };

    return (
        <>
            <Head title="Masuk Cepat Darurat - BorneoCare" />

            <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-slate-50 to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
                {/* Header Brand */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/30 mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Borneo<span className="text-emerald-600 dark:text-emerald-400">Care</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                        Akses Cepat Tanggap Darurat & Peta Evakuasi Kabut Asap
                    </p>
                </div>

                {/* Main Login Card */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-zinc-900 py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/80 dark:border-zinc-800 rounded-3xl">
                        {/* Emergency Quick Access Banner */}
                        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start space-x-3">
                            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed">
                                <strong className="font-semibold block text-emerald-950 dark:text-emerald-200">
                                    Mode Masuk Kilat Darurat:
                                </strong>
                                Gunakan NIK dan PIN 6-digit yang telah didaftarkan untuk langsung mengakses rute evakuasi & tombol SOS darurat.
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Input NIK */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label htmlFor="nik" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Nomor Induk Kependudukan (NIK)
                                    </label>
                                    <span className="text-[10px] font-mono text-slate-400">
                                        {data.nik?.length || 0}/16
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                    <input
                                        id="nik"
                                        type="text"
                                        maxLength={16}
                                        inputMode="numeric"
                                        autoFocus
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="16 digit NIK Anda"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-mono tracking-wide"
                                    />
                                </div>
                                {errors.nik && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.nik}</p>
                                )}
                            </div>

                            {/* Input PIN 6-Digit */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label htmlFor="pin" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        PIN Darurat (6-Digit Angka)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPin(!showPin)}
                                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                                    >
                                        {showPin ? 'Sembunyikan' : 'Tampilkan'} PIN
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="pin"
                                        type={showPin ? 'text' : 'password'}
                                        maxLength={6}
                                        inputMode="numeric"
                                        value={data.pin}
                                        onChange={(e) => setData('pin', e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="••••••"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-mono tracking-widest text-center"
                                    />
                                </div>
                                {errors.pin && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.pin}</p>
                                )}
                            </div>

                            {/* Remember Device Checkbox */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center text-xs text-slate-600 dark:text-zinc-400 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="ml-2">Ingat perangkat ini untuk evakuasi darurat</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || data.nik.length !== 16 || data.pin.length !== 6}
                                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Memverifikasi Kredensial...
                                    </>
                                ) : (
                                    <>
                                        Masuk ke Dashboard Mitigasi
                                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Emergency Contact Pill Footer */}
                        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800 text-center">
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400 mb-2">
                                Bantuan Darurat & Penyelamatan Langsung:
                            </div>
                            <div className="flex justify-center gap-2">
                                <a
                                    href="tel:112"
                                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-[11px] font-bold border border-rose-200 dark:border-rose-900 flex items-center hover:bg-rose-100 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping mr-1.5"></span>
                                    Darurat 112
                                </a>
                                <a
                                    href="tel:113"
                                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-900 flex items-center hover:bg-amber-100 transition-colors"
                                >
                                    Damkar 113
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Switcher to Registration */}
                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
                        Belum mendaftarkan rumah atau keluarga?{' '}
                        <Link
                            href="/register"
                            className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 hover:underline"
                        >
                            Daftar Warga Baru Sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
