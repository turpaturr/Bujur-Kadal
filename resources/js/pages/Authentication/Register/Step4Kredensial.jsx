import React, { useState } from 'react';

export default function Step4Kredensial({ data, setData, errors }) {
    const [showPin, setShowPin] = useState(false);

    return (
        <div className="space-y-4 font-sans">
            {/* Input WhatsApp */}
            <div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <div className="absolute inset-y-0 left-10 pl-1 flex items-center pointer-events-none text-neutral-500 font-semibold text-xs border-r border-neutral-300 pr-2 my-2">
                        +62
                    </div>
                    <input
                        id="whatsapp_number"
                        type="tel"
                        value={data.whatsapp_number}
                        onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.startsWith('62')) val = val.substring(2);
                            if (val.startsWith('0')) val = val.substring(1);
                            setData('whatsapp_number', val);
                        }}
                        placeholder="81234567890 (No. WhatsApp Darurat)"
                        className="w-full pl-22 pr-4 py-3 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary font-mono tracking-wide"
                    />
                </div>
                {errors.whatsapp_number && (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.whatsapp_number}</p>
                )}
            </div>

            {/* Input PIN 6-Digit Keluarga */}
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
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setData('pin', val);
                        }}
                        placeholder="Buat PIN 6-Digit Keluarga (Angka)"
                        className="w-full pl-11 pr-24 py-3 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary font-mono tracking-widest"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] font-bold text-primary hover:text-primary-dark uppercase tracking-wider"
                    >
                        {showPin ? 'Hide' : 'Show'}
                    </button>
                </div>
                {errors.pin ? (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.pin}</p>
                ) : (
                    <p className="mt-1.5 text-[11px] text-neutral-500 leading-tight">
                        <strong className="text-primary font-semibold">Catatan:</strong> PIN 6-digit ini diset oleh Kepala Keluarga dan berlaku bersama untuk seluruh anggota keluarga saat login menggunakan NIK masing-masing.
                    </p>
                )}
            </div>

            {/* Mini Summary Card */}
            <div className="p-3.5 rounded-2xl bg-surface/80 border border-surface text-[11px] space-y-1.5">
                <div className="font-bold text-primary-dark flex justify-between items-center border-b border-surface pb-1.5">
                    <span>Ringkasan Registrasi Kepala Keluarga</span>
                    <span className="text-[10px] text-primary font-semibold">Siap Disimpan</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                    <span className="text-neutral-400">No. Kartu Keluarga:</span>
                    <span className="font-mono font-medium text-neutral-800">{data.no_kk || '-'}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                    <span className="text-neutral-400">Kepala Keluarga & NIK:</span>
                    <span className="font-medium text-neutral-800">{data.name || '-'} ({data.nik || '-'})</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                    <span className="text-neutral-400">Koordinat Rumah:</span>
                    <span className="font-mono font-semibold text-primary">
                        {data.home_latitude ? `${data.home_latitude}, ${data.home_longitude}` : '-'}
                    </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                    <span className="text-neutral-400">Peran Akun:</span>
                    <span className="font-semibold text-[#1F6F5F]">
                        Kepala Keluarga (Koordinator)
                    </span>
                </div>
            </div>
        </div>
    );
}
