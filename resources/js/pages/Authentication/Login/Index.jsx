import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function LoginIndex({ defaultType = 'warga' }) {
    const [loginType, setLoginType] = useState(defaultType); // 'warga' | 'admin'
    const [showSecret, setShowSecret] = useState(false);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        nik: '',
        pin: '',
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        clearErrors();
        setShowSecret(false);
    }, [loginType]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loginType === 'warga') {
            post('/login', {
                onFinish: () => reset('pin'),
            });
        } else {
            post('/admin/login', {
                onFinish: () => reset('password'),
            });
        }
    };

    return (
        <>
            <Head title="Masuk - BorneoCare" />
            
            {/* Background minimalis dengan subtle radial gradient */}
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA] relative overflow-hidden font-sans">
                
                {/* Subtle soft blobs for depth */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2FA084]/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1F6F5F]/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>

                <div className="w-full max-w-[420px] relative z-10">
                    
                    {/* Header Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1F6F5F] to-[#2FA084] shadow-lg mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">BorneoCare</h1>
                        <p className="text-sm text-gray-500 mt-1">Portal Mitigasi Kesehatan</p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
                        
                        {/* Segmented Control / Toggle */}
                        <div className="flex p-1 bg-gray-50/80 rounded-xl mb-8 border border-gray-100/80">
                            <button
                                type="button"
                                onClick={() => setLoginType('warga')}
                                className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                                    loginType === 'warga'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Warga
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginType('admin')}
                                className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                                    loginType === 'admin'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Admin / Faskes
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {loginType === 'warga' ? (
                                <>
                                    <div className="space-y-1">
                                        <label htmlFor="nik" className="block text-[13px] font-medium text-gray-700">NIK (Nomor Induk Kependudukan)</label>
                                        <input
                                            id="nik"
                                            type="text"
                                            maxLength={16}
                                            inputMode="numeric"
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder="16 Digit NIK"
                                            className={`block w-full px-4 py-3 bg-gray-50 border ${errors.nik ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#2FA084] focus:border-[#2FA084]'} rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all font-mono`}
                                        />
                                        {errors.nik && <p className="text-xs text-red-500 mt-1">{errors.nik}</p>}
                                    </div>
                                    <div className="space-y-1 relative">
                                        <label htmlFor="pin" className="block text-[13px] font-medium text-gray-700">PIN Keluarga</label>
                                        <div className="relative">
                                            <input
                                                id="pin"
                                                type={showSecret ? 'text' : 'password'}
                                                maxLength={6}
                                                inputMode="numeric"
                                                value={data.pin}
                                                onChange={(e) => setData('pin', e.target.value.replace(/[^0-9]/g, ''))}
                                                placeholder="••••••"
                                                className={`block w-full px-4 py-3 bg-gray-50 border ${errors.pin ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#2FA084] focus:border-[#2FA084]'} rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all font-mono tracking-widest`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecret(!showSecret)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[11px] font-bold text-gray-400 hover:text-gray-700 uppercase"
                                            >
                                                {showSecret ? 'Sembunyikan' : 'Tampilkan'}
                                            </button>
                                        </div>
                                        {errors.pin && <p className="text-xs text-red-500 mt-1">{errors.pin}</p>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <label htmlFor="email" className="block text-[13px] font-medium text-gray-700">Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="admin@borneocare.id"
                                            className={`block w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#2FA084] focus:border-[#2FA084]'} rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                                        />
                                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-1 relative">
                                        <label htmlFor="password" className="block text-[13px] font-medium text-gray-700">Password</label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showSecret ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                className={`block w-full px-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#2FA084] focus:border-[#2FA084]'} rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecret(!showSecret)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[11px] font-bold text-gray-400 hover:text-gray-700 uppercase"
                                            >
                                                {showSecret ? 'Sembunyikan' : 'Tampilkan'}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                    </div>
                                </>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#1F6F5F] focus:ring-[#1F6F5F] cursor-pointer"
                                    />
                                    <span className="ml-2 text-[13px] text-gray-500 group-hover:text-gray-700 select-none">
                                        Ingat sesi saya
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-6 py-3.5 px-4 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-[#1F6F5F] to-[#248A73] hover:from-[#19594C] hover:to-[#1F7360] shadow-md shadow-[#2FA084]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2FA084] transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    'Masuk ke Sistem'
                                )}
                            </button>
                        </form>

                        {/* Fast Demo Data Loader */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <p className="text-[11px] font-medium text-gray-400 text-center mb-3">AKUN DEMO CEPAT</p>
                            
                            {loginType === 'warga' ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData({ ...data, nik: '6472010101900001', pin: '123456' })}
                                        className="py-2 px-3 rounded-lg border border-gray-100 hover:border-[#2FA084]/30 hover:bg-[#2FA084]/5 text-center transition-all"
                                    >
                                        <span className="block text-[12px] font-semibold text-gray-800">Budi Pratama</span>
                                        <span className="block text-[10px] text-gray-500">Kepala Keluarga</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData({ ...data, nik: '6472011504950002', pin: '123456' })}
                                        className="py-2 px-3 rounded-lg border border-gray-100 hover:border-[#2FA084]/30 hover:bg-[#2FA084]/5 text-center transition-all"
                                    >
                                        <span className="block text-[12px] font-semibold text-gray-800">Siti Rahma</span>
                                        <span className="block text-[10px] text-gray-500">Anggota Rentan</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setData({ ...data, email: 'admin@borneocare.id', password: 'admin12345' })}
                                    className="w-full py-2 px-3 rounded-lg border border-gray-100 hover:border-[#2FA084]/30 hover:bg-[#2FA084]/5 text-center transition-all"
                                >
                                    <span className="block text-[12px] font-semibold text-gray-800">Akun Administrator</span>
                                    <span className="block text-[10px] text-gray-500">admin@borneocare.id</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {loginType === 'warga' && (
                        <p className="mt-6 text-center text-[13px] text-gray-500">
                            Belum mendaftarkan rumah?{' '}
                            <Link href="/register" className="font-semibold text-[#1F6F5F] hover:text-[#165044] transition-colors">
                                Registrasi Keluarga
                            </Link>
                        </p>
                    )}

                </div>
            </div>
        </>
    );
}
