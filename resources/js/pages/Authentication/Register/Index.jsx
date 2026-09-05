import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import Step1Kependudukan from './Step1Kependudukan';
import Step2Lokasi from './Step2Lokasi';
import Step3RoleKesehatan from './Step3RoleKesehatan';
import Step4Kredensial from './Step4Kredensial';

/**
 * Step configuration for BorneoCare Registration
 */
const STEPS = [
    {
        number: 1,
        title: 'Kependudukan',
        description: 'Verifikasi NIK & No. KK',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
        ),
    },
    {
        number: 2,
        title: 'Lokasi Tempat Tinggal',
        description: 'Alamat & Koordinat Geocoding',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        number: 3,
        title: 'Peran & Kesehatan',
        description: 'Status Keluarga & Kerentanan ISPA',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        number: 4,
        title: 'Kredensial Cepat',
        description: 'No. WhatsApp & PIN 6-Digit',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
];

export default function RegisterIndex() {
    const [currentStep, setCurrentStep] = useState(1);

    // Centralized Inertia form state for all 4 registration steps
    const { data, setData, post, processing, errors, clearErrors, setError } = useForm({
        // Step 1: Kependudukan
        no_kk: '',
        nik: '',
        name: '',

        // Step 2: Lokasi & Geocoding
        home_address: '',
        home_latitude: '',
        home_longitude: '',

        // Step 3: Peran & Kerentanan Kesehatan
        role: 'kepala_keluarga',
        is_vulnerable: false,
        comorbidity_notes: '',

        // Step 4: Kontak & Kredensial Darurat
        whatsapp_number: '',
        pin: '',
    });

    /**
     * Validate current step before advancing
     */
    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!data.no_kk || data.no_kk.length !== 16) {
                setError('no_kk', 'Nomor KK harus 16 digit angka.');
                return false;
            }
            if (!data.nik || data.nik.length !== 16) {
                setError('nik', 'NIK harus 16 digit angka.');
                return false;
            }
            if (!data.name || data.name.trim() === '') {
                setError('name', 'Nama lengkap wajib diisi.');
                return false;
            }
        } else if (currentStep === 2) {
            if (!data.home_address || data.home_address.trim() === '') {
                setError('home_address', 'Alamat rumah wajib diisi atau dicari lewat MapTiler.');
                return false;
            }
            if (!data.home_latitude || !data.home_longitude) {
                setError('home_latitude', 'Titik koordinat harus ditentukan untuk aktivasi Fire Tracker.');
                return false;
            }
        } else if (currentStep === 3) {
            if (!data.role) {
                setError('role', 'Peran dalam keluarga wajib dipilih.');
                return false;
            }
        }
        return true;
    };

    /**
     * Advance to the next step
     */
    const handleNext = () => {
        clearErrors();
        if (validateCurrentStep()) {
            if (currentStep < STEPS.length) {
                setCurrentStep((prev) => prev + 1);
            }
        }
    };

    /**
     * Go back to the previous step
     */
    const handlePrev = () => {
        clearErrors();
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    /**
     * Final submission to Laravel backend
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onError: (err) => {
                // If there are errors in specific steps, guide the user to that step
                if (err.no_kk || err.nik || err.name) {
                    setCurrentStep(1);
                } else if (err.home_address || err.home_latitude || err.home_longitude) {
                    setCurrentStep(2);
                } else if (err.role || err.is_vulnerable || err.comorbidity_notes) {
                    setCurrentStep(3);
                } else if (err.whatsapp_number || err.pin) {
                    setCurrentStep(4);
                }
            },
        });
    };

    return (
        <>
            <Head title="Registrasi Warga - BorneoCare" />

            <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-slate-50 to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Brand */}
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-6">
                    <div className="inline-flex items-center justify-center p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/30 mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Borneo<span className="text-emerald-600 dark:text-emerald-400">Care</span>
                    </h1>
                    <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-zinc-400">
                        Sistem Mitigasi Bencana Karhutla & Tanggap Darurat ISPA
                    </p>
                </div>

                {/* Main Card Container */}
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="bg-white dark:bg-zinc-900 py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/80 dark:border-zinc-800 rounded-3xl">
                        
                        {/* Stepper Progress Bar */}
                        <div className="mb-8">
                            {/* Step Indicator Desktop / Tablet */}
                            <div className="hidden sm:grid grid-cols-4 gap-2">
                                {STEPS.map((step) => {
                                    const isCompleted = currentStep > step.number;
                                    const isCurrent = currentStep === step.number;

                                    return (
                                        <div
                                            key={step.number}
                                            className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all ${
                                                isCurrent
                                                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 dark:border-emerald-500'
                                                    : isCompleted
                                                    ? 'border-slate-200 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-800/40 text-slate-500'
                                                    : 'border-transparent text-slate-400 dark:text-zinc-600'
                                            }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold mb-1.5 transition-colors ${
                                                    isCurrent
                                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                                        : isCompleted
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    step.number
                                                )}
                                            </div>
                                            <span className={`text-xs font-medium text-center line-clamp-1 ${isCurrent ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : ''}`}>
                                                {step.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile Step Header */}
                            <div className="sm:hidden flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold shadow-md shadow-emerald-600/20">
                                        {currentStep}
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                                            Langkah {currentStep} dari {STEPS.length}
                                        </div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                            {STEPS[currentStep - 1].title}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                                    {Math.round((currentStep / STEPS.length) * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit}>
                            {currentStep === 1 && (
                                <Step1Kependudukan
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}

                            {currentStep === 2 && (
                                <Step2Lokasi
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            )}

                            {currentStep === 3 && (
                                <Step3RoleKesehatan
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            )}

                            {currentStep === 4 && (
                                <Step4Kredensial
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            )}

                            {/* Navigation Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    disabled={currentStep === 1}
                                    className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        currentStep === 1
                                            ? 'text-slate-300 dark:text-zinc-700 cursor-not-allowed'
                                            : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Kembali
                                </button>

                                {currentStep < STEPS.length ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                                    >
                                        Lanjutkan
                                        <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Mendaftarkan Warga...
                                            </>
                                        ) : (
                                            <>
                                                Selesaikan & Masuk
                                                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Footer Auth Switcher */}
                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
                        Sudah memiliki akun terdaftar?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 hover:underline"
                        >
                            Masuk Cepat dengan NIK & PIN
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
