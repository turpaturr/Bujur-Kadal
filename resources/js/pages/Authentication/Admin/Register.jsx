import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function AdminRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registrasi Administrator - BorneoCare Command Center" />

            {/* Canvas Container Background */}
            <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
                {/* Ambient Decorative Shapes */}
                <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/15 blur-2xl pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-3xl bg-surface rotate-45 pointer-events-none" />
                <div className="absolute top-1/2 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />

                {/* Main Split Card */}
                <div className="relative z-10 w-full max-w-4xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(31,111,95,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] border border-surface">
                    {/* LEFT PANEL: Form Area */}
                    <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white order-2 lg:order-1">
                        <div>
                            {/* Heading */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary-dark text-[11px] font-bold tracking-wide uppercase mb-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    Pendaftaran Petugas Satgas
                                </div>
                                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
                                    Registrasi Administrator
                                </h1>
                                <p className="mt-1 text-xs text-neutral-500 font-sans">
                                    Daftarkan akun resmi pengelola tanggap darurat bencana
                                </p>
                            </div>

                            {/* Security Notice */}
                            <div className="mb-5 p-3.5 rounded-2xl bg-surface/80 border border-surface text-xs text-primary-dark flex items-start space-x-2.5">
                                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-[11px] leading-tight font-medium font-sans">
                                    <strong>Akses Administrator:</strong> Akun ini memiliki hak akses memantau hotspot karhutla, verifikasi safe zone, dan manajemen tanggap bencana.
                                </span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                {/* Input Nama Lengkap */}
                                <div>
                                    <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 mb-1">
                                        Nama Lengkap Petugas / Administrator <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: Mayor Inf. Hendra Wijaya"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.name}</p>
                                    )}
                                </div>

                                {/* Input Email */}
                                <div>
                                    <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 mb-1">
                                        Email Kedinasan / Resmi <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="hendra@satgas.borneocare.id"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.email}</p>
                                    )}
                                </div>

                                {/* Grid Password & Konfirmasi */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Input Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-xs font-semibold text-neutral-700 mb-1">
                                            Password <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Min. 8 karakter"
                                                className="w-full pl-10 pr-14 py-2.5 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-bold text-primary hover:text-primary-dark uppercase"
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Input Konfirmasi Password */}
                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-xs font-semibold text-neutral-700 mb-1">
                                            Ulangi Password <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Ulangi password"
                                                className="w-full pl-10 pr-14 py-2.5 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-bold text-primary hover:text-primary-dark uppercase"
                                            >
                                                {showConfirmPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.name || !data.email || !data.password || !data.password_confirmation}
                                        className="w-full inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-dark active:scale-95 shadow-lg shadow-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Mendaftarkan...
                                            </>
                                        ) : (
                                            'Daftar Sebagai Administrator'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Bottom Cross-links */}
                            <div className="mt-6 pt-4 border-t border-surface flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500">
                                <Link
                                    href="/login"
                                    className="text-neutral-500 hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
                                >
                                    ← Kembali ke Portal Warga
                                </Link>
                                <Link
                                    href="/admin/login"
                                    className="font-bold text-primary hover:text-primary-dark hover:underline transition-colors"
                                >
                                    Sudah punya akun admin? Masuk →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Palette Gradient Banner */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-[#175246] via-primary-dark to-primary text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden order-1 lg:order-2">
                        {/* Decorative background shapes */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-3xl -rotate-12 pointer-events-none" />
                        <div className="absolute bottom-10 -right-8 w-32 h-32 bg-white/10 rounded-2xl rotate-12 pointer-events-none" />

                        {/* Brand Logo Top */}
                        <div className="relative z-10 flex items-center space-x-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <span className="font-display text-xl font-bold tracking-tight text-white">
                                    Borneo<span className="text-accent">Care</span>
                                </span>
                                <span className="block text-[10px] uppercase tracking-widest text-accent font-medium font-sans">
                                    Command Center
                                </span>
                            </div>
                        </div>

                        {/* Centered Sign In Callout */}
                        <div className="relative z-10 py-10 lg:py-0 my-auto text-center">
                            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3 leading-tight">
                                Halo, Petugas!
                            </h2>
                            <p className="text-surface/90 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-8 font-normal font-sans">
                                Sudah memiliki akun Administrator atau Satgas Lapangan terverifikasi? Masuk langsung ke Command Center.
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-block px-10 py-3 rounded-full border-2 border-white text-white font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-white hover:text-primary-dark transition-all shadow-md hover:shadow-xl active:scale-95"
                            >
                                MASUK ADMIN
                            </Link>
                        </div>

                        {/* Hotline Darurat */}
                        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-center space-x-3 text-[11px] text-white/75">
                            <span>Kanal Satgas Siaga:</span>
                            <span className="font-bold text-white">BPBD & Damkar Karhutla</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

