import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import Step1Kependudukan from './Step1Kependudukan';
import Step2Lokasi from './Step2Lokasi';
import Step4Kredensial from './Step4Kredensial';

const STEPS = [
    { number: 1, title: 'Kependudukan', short: 'KK & NIK Kepala Keluarga' },
    { number: 2, title: 'Lokasi Rumah', short: 'Alamat & Peta Spasial' },
    { number: 3, title: 'PIN Keluarga', short: 'WhatsApp & PIN 6-Digit' },
];

export default function RegisterIndex() {
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors, clearErrors, setError } = useForm({
        no_kk: '',
        nik: '',
        name: '',
        birth_date: '',
        gender: 'laki-laki',
        occupation: '',
        home_address: '',
        home_latitude: '',
        home_longitude: '',
        whatsapp_number: '',
        pin: '',
    });

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!data.no_kk || data.no_kk.length !== 16) {
                setError('no_kk', 'Nomor KK harus 16 digit angka.');
                return false;
            }
            if (!data.nik || data.nik.length !== 16) {
                setError('nik', 'NIK Kepala Keluarga harus 16 digit angka.');
                return false;
            }
            if (!data.name || data.name.trim() === '') {
                setError('name', 'Nama lengkap Kepala Keluarga wajib diisi.');
                return false;
            }
        } else if (currentStep === 2) {
            if (!data.home_address || data.home_address.trim() === '') {
                setError('home_address', 'Alamat rumah wajib diisi atau dicari lewat peta.');
                return false;
            }
            if (!data.home_latitude || !data.home_longitude) {
                setError('home_latitude', 'Titik koordinat harus ditentukan untuk aktivasi Fire Tracker.');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        clearErrors();
        if (validateCurrentStep()) {
            if (currentStep < STEPS.length) {
                setCurrentStep((prev) => prev + 1);
            }
        }
    };

    const handlePrev = () => {
        clearErrors();
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        if (!data.whatsapp_number || data.whatsapp_number.length < 8) {
            setError('whatsapp_number', 'Nomor WhatsApp darurat keluarga wajib diisi.');
            return;
        }
        if (!data.pin || data.pin.length !== 6) {
            setError('pin', 'PIN 6-digit keluarga harus terdiri dari tepat 6 angka.');
            return;
        }
        post('/register', {
            onError: (err) => {
                if (err.no_kk || err.nik || err.name) {
                    setCurrentStep(1);
                } else if (err.home_address || err.home_latitude || err.home_longitude) {
                    setCurrentStep(2);
                } else if (err.whatsapp_number || err.pin) {
                    setCurrentStep(3);
                }
            },
        });
    };

    return (
        <>
            <Head title="Registrasi Warga - BorneoCare" />

            {/* Canvas Latar Belakang Putih Bersih */}
            <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
                {/* Ambient Decorative Shapes bernuansa palet Accent dan Surface */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/15 blur-2xl pointer-events-none"></div>
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-3xl bg-surface rotate-45 pointer-events-none"></div>
                <div className="absolute top-1/4 -left-12 w-32 h-32 rounded-full bg-primary/10 blur-xl pointer-events-none"></div>

                {/* Main Split Card Container */}
                <div className="relative z-10 w-full max-w-5xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(31,111,95,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] border border-surface">

                    {/* LEFT PANEL: Gradient Banner (Primary -> Primary Dark) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-primary via-primary-dark to-[#175246] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative subtle patterns */}
                        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-3xl rotate-12 pointer-events-none"></div>
                        <div className="absolute bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-2xl -rotate-12 pointer-events-none"></div>

                        {/* Brand Logo Top Left */}
                        <div className="relative z-10 flex items-center space-x-3">
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

                        {/* Centered Welcome Back Section */}
                        <div className="relative z-10 py-10 lg:py-0 text-center my-auto">
                            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3 leading-tight">
                                Welcome Back!
                            </h2>
                            <p className="text-surface text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-8 font-normal font-sans">
                                Sudah terdaftar dalam sistem BorneoCare? Masuk langsung menggunakan NIK dan PIN Keluarga Anda.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block px-10 py-3 rounded-full border-2 border-white text-white font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-white hover:text-primary-dark transition-all shadow-md hover:shadow-xl active:scale-95"
                            >
                                SIGN IN
                            </Link>
                        </div>

                        {/* Step Progress Tracker on Side Banner */}
                        <div className="relative z-10 pt-6 border-t border-white/20">
                            <div className="flex items-center justify-between text-xs text-white mb-2 font-sans">
                                <span className="font-semibold text-surface">Langkah Registrasi</span>
                                <span className="font-bold text-accent">{currentStep} / {STEPS.length}</span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-accent h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                                    style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-[11px] text-surface font-medium font-sans">
                                Tahap: {STEPS[currentStep - 1].title} ({STEPS[currentStep - 1].short})
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Form Area (White Background) */}
                    <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
                        <div>
                            {/* Heading */}
                            <div className="text-center mb-6">
                                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
                                    Daftar Akun Keluarga
                                </h1>
                                <p className="mt-1 text-xs text-neutral-500 font-sans">
                                    Khusus Kepala Keluarga & Integrasi Titik Evakuasi Spasial
                                </p>

                                {/* Stepper Dots */}
                                <div className="flex items-center justify-center space-x-2 mt-4">
                                    {STEPS.map((step) => {
                                        const isCurrent = currentStep === step.number;
                                        const isPast = currentStep > step.number;
                                        return (
                                            <div
                                                key={step.number}
                                                className={`transition-all duration-300 rounded-full ${
                                                    isCurrent
                                                        ? 'w-8 h-2.5 bg-primary'
                                                        : isPast
                                                        ? 'w-2.5 h-2.5 bg-accent'
                                                        : 'w-2.5 h-2.5 bg-surface'
                                                }`}
                                            ></div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Multi-step Child Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="transition-all duration-300 font-sans">
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
                                        <Step4Kredensial
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                        />
                                    )}
                                </div>

                                {/* Navigation Actions (Pill Buttons sesuai tema Primary / Primary Dark) */}
                                <div className="mt-8 pt-6 border-t border-surface flex items-center justify-between font-sans">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        disabled={currentStep === 1}
                                        className={`inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                            currentStep === 1
                                                ? 'text-neutral-300 cursor-not-allowed'
                                                : 'text-primary-dark hover:bg-surface active:scale-95'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back
                                    </button>

                                    {currentStep < STEPS.length ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-dark active:scale-95 shadow-lg shadow-primary/25 transition-all focus:outline-none"
                                        >
                                            Next Step
                                            <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-dark active:scale-95 shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Sign Up Now
                                                    <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
