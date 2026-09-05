import React from 'react';

const ROLES = [
    { id: 'kepala_keluarga', title: 'Kepala Keluarga', badge: 'Koordinator Evakuasi' },
    { id: 'anggota', title: 'Anggota Keluarga', badge: 'Warga' },
    { id: 'pendatang', title: 'Pendatang / Tamu', badge: 'Residen' },
];

const QUICK_COMORBIDITIES = [
    'Riwayat Asma Kronis',
    'Terdapat Balita (<5 Tahun)',
    'Terdapat Lansia (>60 Tahun)',
    'Ibu Hamil',
    'PPOK (Paru Obstruktif)',
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
        <div className="space-y-4">
            {/* Pilihan Peran Keluarga */}
            <div>
                <label className="block text-xs font-semibold text-[#1F6F5F] mb-2">
                    Peran dalam Keluarga <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {ROLES.map((r) => {
                        const isSelected = data.role === r.id;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setData('role', r.id)}
                                className={`p-3 rounded-xl text-left transition-all ${
                                    isSelected
                                        ? 'bg-[#6FCF97]/15 border-2 border-[#2FA084] shadow-xs'
                                        : 'bg-[#EEEEEE] border-2 border-transparent hover:border-[#2FA084]/40'
                                }`}
                            >
                                <div className="text-xs font-bold text-[#1F6F5F]">
                                    {r.title}
                                </div>
                                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    isSelected
                                        ? 'bg-[#2FA084] text-white'
                                        : 'bg-white text-slate-600'
                                }`}>
                                    {r.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {errors.role && (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.role}</p>
                )}
            </div>

            {/* Checkbox Kerentanan Pernapasan / ISPA */}
            <div className="p-4 rounded-2xl bg-[#EEEEEE]/80 border border-[#EEEEEE]">
                <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.is_vulnerable}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setData('is_vulnerable', checked);
                            if (!checked) setData('comorbidity_notes', '');
                        }}
                        className="w-4 h-4 mt-0.5 rounded border-[#EEEEEE] text-[#2FA084] focus:ring-[#2FA084] shrink-0"
                    />
                    <div>
                        <div className="text-xs font-bold text-[#1F6F5F] flex items-center">
                            Kerentanan Pernapasan / Komorbiditas
                            <span className="ml-2 px-2 py-0.5 text-[9px] rounded-md bg-rose-100 text-rose-700 font-bold uppercase">
                                Prioritas Evakuasi
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                            Centang bila ada anggota keluarga pengidap asma, lansia, balita, atau ibu hamil.
                        </p>
                    </div>
                </label>

                {data.is_vulnerable && (
                    <div className="mt-3 pt-3 border-t border-[#EEEEEE] space-y-2.5 animate-fadeIn">
                        <div className="flex flex-wrap gap-1.5">
                            {QUICK_COMORBIDITIES.map((chip) => {
                                const isChipSelected = selectedChips.includes(chip);
                                return (
                                    <button
                                        key={chip}
                                        type="button"
                                        onClick={() => handleAddComorbidityChip(chip)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                                            isChipSelected
                                                ? 'bg-[#2FA084] text-white shadow-xs'
                                                : 'bg-white text-slate-600 border border-[#EEEEEE] hover:border-[#2FA084]/50'
                                        }`}
                                    >
                                        {isChipSelected ? '✓ ' : '+ '}
                                        {chip}
                                    </button>
                                );
                            })}
                        </div>

                        <textarea
                            rows={2}
                            value={data.comorbidity_notes}
                            onChange={(e) => setData('comorbidity_notes', e.target.value)}
                            placeholder="Catatan medis tambahan (opsional)..."
                            className="w-full px-3.5 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-xs border border-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#2FA084] focus:border-[#2FA084]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
