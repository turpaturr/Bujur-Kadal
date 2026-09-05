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
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4 font-sans sm:p-6 lg:p-10">
                {/* Ambient Decorative Shapes sesuai palet Accent dan Surface */}
                <div className="bg-accent/15 pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-2xl"></div>
                <div className="bg-surface pointer-events-none absolute -top-16 -right-16 h-64 w-64 rotate-45 rounded-3xl"></div>
                <div className="bg-primary/10 pointer-events-none absolute top-1/2 -right-10 h-24 w-24 rounded-full blur-xl"></div>

                {/* Main Split Card */}
                <div className="border-surface relative z-10 grid min-h-[560px] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[32px] border bg-white shadow-[0_20px_50px_rgba(31,111,95,0.12)] lg:grid-cols-12">
                    {/* LEFT PANEL: Form Area (Sign In Section) */}
                    <div className="order-2 flex flex-col justify-between bg-white p-6 sm:p-10 lg:order-1 lg:col-span-7 lg:p-12">
                        <div>
                            {/* Heading */}
                            <div className="mb-8 text-center">
                                <h1 className="font-display text-primary-dark text-2xl font-bold tracking-tight sm:text-3xl">
                                    Sign in to BorneoCare
                                </h1>
                                <p className="mt-1.5 font-sans text-xs text-neutral-500">
                                    Akses Cepat Tanggap Darurat & Mitigasi Kabut
                                    Asap
                                </p>
                            </div>

                            {/* Emergency Notice Pill */}
                            <div className="bg-surface/80 border-surface text-primary-dark mb-6 flex items-center space-x-2.5 rounded-2xl border p-3 text-xs">
                                <div className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white shadow-xs">
                                    <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-sans text-[11px] leading-tight font-medium">
                                    <strong>Akses Cepat:</strong> Masuk langsung
                                    dengan NIK KTP & PIN 6-digit tanpa password
                                    rumit.
                                </span>
                            </div>

                            {/* Akun Uji Coba / Demo Seeder */}
                            <div className="mb-6 rounded-2xl border border-[#CCECEE] bg-[#F1F9FF] p-3 text-xs">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#095D7E]">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#14967F]"></span>
                                        Akun Demo (Klik untuk Isi Cepat):
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-500">
                                        PIN: 123456
                                    </span>
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
                                        className="group cursor-pointer rounded-xl border border-[#CCECEE] bg-white px-2.5 py-1.5 text-left text-[11px] shadow-2xs transition-all hover:border-[#14967F]"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">
                                            Budi Pratama
                                        </p>
                                        <p className="text-[10px] font-medium text-rose-500">
                                            Kepala Keluarga (Rentan)
                                        </p>
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
                                        className="group cursor-pointer rounded-xl border border-[#CCECEE] bg-white px-2.5 py-1.5 text-left text-[11px] shadow-2xs transition-all hover:border-[#14967F]"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">
                                            Siti Rahma
                                        </p>
                                        <p className="text-[10px] font-medium text-emerald-600">
                                            Anggota (Non-Rentan)
                                        </p>
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
                                        className="group cursor-pointer rounded-xl border border-[#CCECEE] bg-white px-2.5 py-1.5 text-left text-[11px] shadow-2xs transition-all hover:border-[#14967F]"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">
                                            Ahmad Fauzi
                                        </p>
                                        <p className="text-[10px] font-medium text-sky-600">
                                            Relawan / Pendatang
                                        </p>
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
                                        className="group cursor-pointer rounded-xl border border-[#CCECEE] bg-white px-2.5 py-1.5 text-left text-[11px] shadow-2xs transition-all hover:border-[#14967F]"
                                    >
                                        <p className="font-bold text-[#095D7E] group-hover:text-[#14967F]">
                                            Haji Syahrani
                                        </p>
                                        <p className="text-[10px] font-medium text-amber-600">
                                            Lansia (Sangat Rentan)
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Input NIK */}
                                <div>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="nik"
                                            type="text"
                                            maxLength={16}
                                            inputMode="numeric"
                                            autoFocus
                                            value={data.nik}
                                            onChange={(e) =>
                                                setData(
                                                    'nik',
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            placeholder="16 Digit NIK Anda"
                                            className="bg-surface focus:ring-primary focus:border-primary w-full rounded-xl border border-transparent py-3.5 pr-16 pl-11 font-mono text-xs tracking-wide text-neutral-800 placeholder-neutral-400 transition-all focus:ring-2 focus:outline-none sm:text-sm"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 font-mono text-[10px] text-neutral-400">
                                            {data.nik?.length || 0}/16
                                        </span>
                                    </div>
                                    {errors.nik && (
                                        <p className="mt-1 text-[11px] font-medium text-rose-500">
                                            {errors.nik}
                                        </p>
                                    )}
                                </div>

                                {/* Input PIN 6-Digit */}
                                <div>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="pin"
                                            type={showPin ? 'text' : 'password'}
                                            maxLength={6}
                                            inputMode="numeric"
                                            value={data.pin}
                                            onChange={(e) =>
                                                setData(
                                                    'pin',
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                            placeholder="PIN 6-Digit Darurat"
                                            className="bg-surface focus:ring-primary focus:border-primary w-full rounded-xl border border-transparent py-3.5 pr-20 pl-11 text-center font-mono text-xs tracking-widest text-neutral-800 placeholder-neutral-400 transition-all focus:ring-2 focus:outline-none sm:text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPin(!showPin)}
                                            className="text-primary hover:text-primary-dark absolute inset-y-0 right-0 flex items-center pr-4 text-[10px] font-bold tracking-wider uppercase"
                                        >
                                            {showPin ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {errors.pin && (
                                        <p className="mt-1 text-[11px] font-medium text-rose-500">
                                            {errors.pin}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Device */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex cursor-pointer items-center text-xs text-neutral-500">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    'remember',
                                                    e.target.checked,
                                                )
                                            }
                                            className="border-surface text-primary focus:ring-primary h-4 w-4 rounded"
                                        />
                                        <span className="ml-2 text-[11px] text-neutral-600">
                                            Ingat perangkat ini
                                        </span>
                                    </label>
                                </div>

                                {/* Pill Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            data.nik.length !== 16 ||
                                            data.pin.length !== 6
                                        }
                                        className="bg-primary hover:bg-primary-dark shadow-primary/25 inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {processing ? (
                                            <>
                                                <svg
                                                    className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Memverifikasi...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Portal Khusus Petugas / Administrator */}
                            <div className="mt-4 text-center">
                                <Link
                                    href="/admin/login"
                                    className="text-primary hover:text-primary-dark inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
                                >
                                    <span>
                                        Masuk sebagai Administrator / Petugas
                                        Satgas
                                    </span>
                                    <span>→</span>
                                </Link>
                            </div>

                            {/* Hotline Darurat Footer */}
                            <div className="border-surface mt-6 flex items-center justify-center space-x-3 border-t pt-4 text-[11px] text-neutral-400">
                                <span>Panggilan Darurat:</span>
                                <a
                                    href="tel:112"
                                    className="text-primary-dark font-bold hover:underline"
                                >
                                    112 (Siaga)
                                </a>
                                <span>&bull;</span>
                                <a
                                    href="tel:113"
                                    className="text-primary font-bold hover:underline"
                                >
                                    113 (Damkar)
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Palette Gradient Banner (Primary -> Primary Dark) */}
                    <div className="from-primary via-primary-dark relative order-1 flex flex-col justify-between overflow-hidden bg-gradient-to-br to-[#175246] p-8 text-white sm:p-10 lg:order-2 lg:col-span-5">
                        {/* Decorative shapes */}
                        <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 -rotate-12 rounded-3xl bg-white/10"></div>
                        <div className="pointer-events-none absolute -right-8 bottom-10 h-32 w-32 rotate-12 rounded-2xl bg-white/10"></div>

                        {/* Brand Logo Top */}
                        <div className="relative z-10 flex items-center space-x-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/30 bg-white/20 shadow-inner backdrop-blur-md">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <span className="font-display text-xl font-bold tracking-tight text-white">
                                    Borneo
                                    <span className="text-accent">Care</span>
                                </span>
                                <span className="text-accent block font-sans text-[10px] font-medium tracking-widest uppercase">
                                    Health Mitigation
                                </span>
                            </div>
                        </div>

                        {/* Centered Sign Up Callout */}
                        <div className="relative z-10 my-auto py-10 text-center lg:py-0">
                            <h2 className="font-display mb-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
                                Halo, Warga!
                            </h2>
                            <p className="text-surface mx-auto mb-8 max-w-xs font-sans text-xs leading-relaxed font-normal sm:text-sm">
                                Belum mendaftarkan rumah atau anggota keluarga?
                                Daftarkan diri Anda sekarang untuk perlindungan
                                mitigasi kabut asap dan rute evakuasi safe zone.
                            </p>
                            <Link
                                href="/register"
                                className="hover:text-primary-dark inline-block rounded-full border-2 border-white px-10 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-white hover:shadow-xl active:scale-95 sm:text-sm"
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
