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

            {/* Canvas Container Latar Belakang Putih Bersih */}
            <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
                {/* Ambient Decorative Shapes sesuai palet Accent dan Surface */}
                <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/15 blur-2xl pointer-events-none"></div>
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-3xl bg-surface rotate-45 pointer-events-none"></div>
                <div className="absolute top-1/2 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl pointer-events-none"></div>

                {/* Main Split Card */}
                <div className="relative z-10 w-full max-w-4xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(31,111,95,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px] border border-surface">
                    
                    {/* LEFT PANEL: Form Area (Sign In Section) */}
                    <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white order-2 lg:order-1">
                        <div>
                            {/* Heading */}
                            <div className="text-center mb-8">
                                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
                                    Sign in to BorneoCare
                                </h1>
                                <p className="mt-1.5 text-xs text-neutral-500 font-sans">
                                    Akses Cepat Tanggap Darurat & Mitigasi Kabut Asap
                                </p>
                            </div>

                            {/* Emergency Notice Pill */}
                            <div className="mb-6 p-3 rounded-2xl bg-surface/80 border border-surface text-xs text-primary-dark flex items-center space-x-2.5">
                                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-[11px] leading-tight font-medium font-sans">
                                    <strong>Akses Cepat:</strong> Masuk langsung dengan NIK KTP & PIN 6-digit tanpa password rumit.
                                </span>
                            </div>

                            {/* Akun Uji Coba / Demo Seeder */}
                            <div className="mb-6 p-3 rounded-2xl bg-[#F1F9FF] border border-[#CCECEE] text-xs">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-[#095D7E] flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#14967F] animate-pulse"></span>
                                        Akun Demo (Klik untuk Isi Cepat):
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">PIN: 123456</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                nik: '6472010101900001',
                                                pin: '123456',
                                            }));
                                        }}
                                        className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-[#CCECEE] hover:border-[#14967F] text-[11px] transition-all group shadow-2xs cursor-pointer"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">Budi Pratama</p>
                                        <p className="text-[10px] text-rose-500 font-medium">Kepala Keluarga (Rentan)</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                nik: '6472011504950002',
                                                pin: '123456',
                                            }));
                                        }}
                                        className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-[#CCECEE] hover:border-[#14967F] text-[11px] transition-all group shadow-2xs cursor-pointer"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">Siti Rahma</p>
                                        <p className="text-[10px] text-emerald-600 font-medium">Anggota (Non-Rentan)</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                nik: '6271012005980003',
                                                pin: '123456',
                                            }));
                                        }}
                                        className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-[#CCECEE] hover:border-[#14967F] text-[11px] transition-all group shadow-2xs cursor-pointer"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">Ahmad Fauzi</p>
                                        <p className="text-[10px] text-sky-600 font-medium">Relawan / Pendatang</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                nik: '6271010503550004',
                                                pin: '123456',
                                            }));
                                        }}
                                        className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-[#CCECEE] hover:border-[#14967F] text-[11px] transition-all group shadow-2xs cursor-pointer"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">Haji Syahrani</p>
                                        <p className="text-[10px] text-amber-600 font-medium">Lansia (Sangat Rentan)</p>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                            inputMode="numeric"
                                            autoFocus
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder="16 Digit NIK Anda"
                                            className="w-full pl-11 pr-16 py-3.5 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary font-mono tracking-wide"
                                        />
                                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] text-neutral-400 font-mono">
                                            {data.nik?.length || 0}/16
                                        </span>
                                    </div>
                                    {errors.nik && (
                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.nik}</p>
                                    )}
                                </div>

                                {/* Input PIN 6-Digit */}
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
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
                                            placeholder="PIN 6-Digit Darurat"
                                            className="w-full pl-11 pr-20 py-3.5 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary font-mono tracking-widest text-center"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPin(!showPin)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] font-bold text-primary hover:text-primary-dark uppercase tracking-wider"
                                        >
                                            {showPin ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {errors.pin && (
                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.pin}</p>
                                    )}
                                </div>

                                {/* Remember Device */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center text-xs text-neutral-500 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-surface text-primary focus:ring-primary"
                                        />
                                        <span className="ml-2 text-[11px] text-neutral-600">Ingat perangkat ini</span>
                                    </label>
                                </div>

                                {/* Pill Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing || data.nik.length !== 16 || data.pin.length !== 6}
                                        className="w-full inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-dark active:scale-95 shadow-lg shadow-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Memverifikasi...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Hotline Darurat Footer */}
                            <div className="mt-8 pt-4 border-t border-surface flex items-center justify-center space-x-3 text-[11px] text-neutral-400">
                                <span>Panggilan Darurat:</span>
                                <a href="tel:112" className="font-bold text-primary-dark hover:underline">112 (Siaga)</a>
                                <span>&bull;</span>
                                <a href="tel:113" className="font-bold text-primary hover:underline">113 (Damkar)</a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Palette Gradient Banner (Primary -> Primary Dark) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-primary via-primary-dark to-[#175246] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden order-1 lg:order-2">
                        {/* Decorative shapes */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-3xl -rotate-12 pointer-events-none"></div>
                        <div className="absolute bottom-10 -right-8 w-32 h-32 bg-white/10 rounded-2xl rotate-12 pointer-events-none"></div>

                        {/* Brand Logo Top */}
                        <div className="relative z-10 flex items-center space-x-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <span className="font-display text-xl font-bold tracking-tight text-white">Borneo<span className="text-accent">Care</span></span>
                                <span className="block text-[10px] uppercase tracking-widest text-accent font-medium font-sans">Health Mitigation</span>
                            </div>
                        </div>

                        {/* Centered Sign Up Callout */}
                        <div className="relative z-10 py-10 lg:py-0 text-center my-auto">
                            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3 leading-tight">
                                Halo, Warga!
                            </h2>
                            <p className="text-surface text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-8 font-normal font-sans">
                                Belum mendaftarkan rumah atau anggota keluarga? Daftarkan diri Anda sekarang untuk perlindungan mitigasi kabut asap dan rute evakuasi safe zone.
                            </p>
                            <Link
                                href="/register"
                                className="inline-block px-10 py-3 rounded-full border-2 border-white text-white font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-white hover:text-primary-dark transition-all shadow-md hover:shadow-xl active:scale-95"
                            >
                                SIGN UP
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
