import React, { useState } from 'react';

export default function Step4Kredensial({ data, setData, errors }) {
    const [showPin, setShowPin] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <span className="w-2 h-6 bg-emerald-600 rounded-full mr-2.5"></span>
                    Kontak & PIN Akses Cepat Darurat
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                    Gunakan <strong>Nomor WhatsApp</strong> aktif untuk menerima siaran bahaya kabut asap dan buat <strong>PIN 6-digit</strong> untuk masuk kilat ke aplikasi saat situasi darurat tanpa password rumit.
                </p>
            </div>

            {/* Input WhatsApp */}
            <div>
                <label htmlFor="whatsapp_number" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
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
                        placeholder="81234567890"
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono tracking-wide"
                    />
                </div>
                {errors.whatsapp_number && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.whatsapp_number}</p>
                )}
                <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                    Format nomor Indonesia tanpa awalan 0 atau +62 (contoh: 81234567890).
                </p>
            </div>

            {/* Input PIN 6-Digit */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="pin" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Buat PIN Darurat (6-Digit Angka) <span className="text-rose-500">*</span>
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
                        placeholder="••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base font-mono tracking-widest text-center"
                    />
                </div>
                {errors.pin && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.pin}</p>
                )}
                <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                    PIN ini akan digunakan bersama NIK Anda untuk login cepat saat situasi bahaya bencana.
                </p>
            </div>

            {/* Ringkasan Data Registrasi */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-xs space-y-2.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-700/80 pb-2">
                    <span>Ringkasan Pendaftaran Warga</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                        Langkah Terakhir
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                        <span className="text-slate-400 block">Nama / NIK:</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{data.name || '-'} ({data.nik || '-'})</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block">No. KK:</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{data.no_kk || '-'}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-slate-400 block">Koordinat Rumah:</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            {data.home_latitude ? `${data.home_latitude}, ${data.home_longitude}` : 'Belum ditentukan'}
                        </span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-slate-400 block">Prioritas Evakuasi:</span>
                        <span className={`font-semibold ${data.is_vulnerable ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-zinc-300'}`}>
                            {data.is_vulnerable ? `Ya (Rentan: ${data.comorbidity_notes || 'Komorbiditas tercatat'})` : 'Standar (Tidak Ada Komorbiditas Khusus)'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
