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
        <div className="space-y-4 font-sans">
            {/* Pilihan Peran Keluarga */}
            <div>
                <label className="block text-xs font-semibold text-primary-dark mb-2">
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
                                        ? 'bg-accent/15 border-2 border-primary shadow-xs'
                                        : 'bg-surface border-2 border-transparent hover:border-primary/40'
                                }`}
                            >
                                <div className="text-xs font-bold text-primary-dark">
                                    {r.title}
                                </div>
                                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    isSelected
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-neutral-600'
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
            <div className="p-4 rounded-2xl bg-surface/80 border border-surface">
                <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.is_vulnerable}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setData('is_vulnerable', checked);
                            if (!checked) setData('comorbidity_notes', '');
                        }}
                        className="w-4 h-4 mt-0.5 rounded border-surface text-primary focus:ring-primary shrink-0"
                    />
                    <div>
                        <div className="text-xs font-bold text-primary-dark flex items-center">
                            Kerentanan Pernapasan / Komorbiditas
                            <span className="ml-2 px-2 py-0.5 text-[9px] rounded-md bg-rose-100 text-rose-700 font-bold uppercase">
                                Prioritas Evakuasi
                            </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                            Centang bila ada anggota keluarga pengidap asma, lansia, balita, atau ibu hamil.
                        </p>
                    </div>
                </label>

                {data.is_vulnerable && (
                    <div className="mt-3 pt-3 border-t border-surface space-y-2.5 animate-fadeIn">
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
                                                ? 'bg-primary text-white shadow-xs'
                                                : 'bg-white text-neutral-600 border border-surface hover:border-primary/50'
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
                            className="w-full px-3.5 py-2 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 text-xs border border-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
