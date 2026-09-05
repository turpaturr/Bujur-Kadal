import React from 'react';

const ROLES = [
    {
        id: 'kepala_keluarga',
        title: 'Kepala Keluarga',
        description: 'Penanggung jawab utama rumah tangga & komando evakuasi keluarga',
        badge: 'Koordinator',
    },
    {
        id: 'anggota',
        title: 'Anggota Keluarga',
        description: 'Anggota keluarga yang tercantum dalam Kartu Keluarga',
        badge: 'Warga',
    },
    {
        id: 'pendatang',
        title: 'Pendatang / Tamu',
        description: 'Tinggal sementara atau singgah di zona mitigasi bencana',
        badge: 'Residen',
    },
];

const QUICK_COMORBIDITIES = [
    'Riwayat Asma Kronis',
    'Terdapat Balita (<5 Tahun)',
    'Terdapat Lansia (>60 Tahun)',
    'Ibu Hamil',
    'PPOK (Paru Obstruktif)',
    'Alergi Asap/Debu Berat',
];

export default function Step3RoleKesehatan({ data, setData, errors }) {
    const handleAddComorbidityChip = (chip) => {
        const currentNotes = data.comorbidity_notes ? data.comorbidity_notes.split(', ').map(s => s.trim()) : [];
        if (currentNotes.includes(chip)) {
            const filtered = currentNotes.filter(item => item !== chip);
            setData('comorbidity_notes', filtered.join(', '));
        } else {
            const updated = [...currentNotes, chip];
            setData('comorbidity_notes', updated.join(', '));
        }
    };

    const selectedChips = data.comorbidity_notes ? data.comorbidity_notes.split(', ').map(s => s.trim()) : [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <span className="w-2 h-6 bg-emerald-600 rounded-full mr-2.5"></span>
                    Peran Keluarga & Kerentanan Kesehatan (ISPA)
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                    Data kesehatan krusial untuk menentukan <strong>Prioritas Evakuasi</strong>. Warga rentan mendapatkan rute tercepat dan peringatan dini saat titik api mendekat.
                </p>
            </div>

            {/* Pemilihan Peran */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2.5">
                    Peran Anda di Rumah Ini <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ROLES.map((r) => {
                        const isSelected = data.role === r.id;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setData('role', r.id)}
                                className={`p-4 rounded-2xl border text-left transition-all relative ${
                                    isSelected
                                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 dark:border-emerald-500 shadow-sm'
                                        : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800/40'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {r.title}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                        isSelected
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300'
                                    }`}>
                                        {r.badge}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                                    {r.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
                {errors.role && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.role}</p>
                )}
            </div>

            {/* Checkbox Kerentanan ISPA */}
            <div className="pt-2">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/40">
                    <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.is_vulnerable}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setData('is_vulnerable', checked);
                                if (!checked) {
                                    setData('comorbidity_notes', '');
                                }
                            }}
                            className="w-5 h-5 mt-0.5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
                        />
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center">
                                Ada Anggota Keluarga Rentan Asap / Komorbiditas Pernapasan
                                <span className="ml-2 px-2 py-0.5 text-[10px] rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold uppercase">
                                    Prioritas Evakuasi
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                Centang jika ada anggota keluarga pengidap asma, balita, lansia, atau ibu hamil yang membutuhkan pasokan oksigen saat kabut asap tebal.
                            </p>
                        </div>
                    </label>

                    {/* Form Catatan Komorbiditas (Muncul jika is_vulnerable dicentang) */}
                    {data.is_vulnerable && (
                        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-zinc-700 animate-fadeIn space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Pilih Cepat Kondisi Komorbiditas:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {QUICK_COMORBIDITIES.map((chip) => {
                                        const isChipSelected = selectedChips.includes(chip);
                                        return (
                                            <button
                                                key={chip}
                                                type="button"
                                                onClick={() => handleAddComorbidityChip(chip)}
                                                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                                                    isChipSelected
                                                        ? 'bg-rose-600 text-white shadow-sm'
                                                        : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:border-slate-300'
                                                }`}
                                            >
                                                {isChipSelected ? '✓ ' : '+ '}
                                                {chip}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="comorbidity_notes" className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                    Catatan Riwayat Kesehatan Tambahan
                                </label>
                                <textarea
                                    id="comorbidity_notes"
                                    rows={3}
                                    value={data.comorbidity_notes}
                                    onChange={(e) => setData('comorbidity_notes', e.target.value)}
                                    placeholder="Contoh: Balita 3 tahun alergi asap, lansia membutuhkan tabung oksigen cadangan..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                                />
                                {errors.comorbidity_notes && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.comorbidity_notes}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
