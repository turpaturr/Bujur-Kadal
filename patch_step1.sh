#!/bin/bash
sed -i -e '/{errors.nik && (/ {
  n
  n
  a\
\
            {/* Input Tanggal Lahir & Jenis Kelamin */}\
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">\
                <div>\
                    <div className="relative">\
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">\
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />\
                            </svg>\
                        </div>\
                        <input\
                            type="date"\
                            value={data.birth_date}\
                            onChange={(e) => setData('\''birth_date'\'', e.target.value)}\
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"\
                        />\
                    </div>\
                    {errors.birth_date && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.birth_date}</p>}\
                </div>\
\
                <div>\
                    <div className="flex bg-surface rounded-xl p-1 border border-transparent focus-within:border-primary transition-all">\
                        <button\
                            type="button"\
                            onClick={() => setData('\''gender'\'', '\''laki-laki'\'')}\
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${data.gender === '\''laki-laki'\'' ? '\''bg-[#2FA084] text-white shadow-xs'\'' : '\''text-neutral-500 hover:bg-neutral-100'\''}`}\
                        >\
                            Laki-laki\
                        </button>\
                        <button\
                            type="button"\
                            onClick={() => setData('\''gender'\'', '\''perempuan'\'')}\
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${data.gender === '\''perempuan'\'' ? '\''bg-[#2FA084] text-white shadow-xs'\'' : '\''text-neutral-500 hover:bg-neutral-100'\''}`}\
                        >\
                            Perempuan\
                        </button>\
                    </div>\
                    {errors.gender && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.gender}</p>}\
                </div>\
            </div>\
\
            {/* Input Pekerjaan */}\
            <div>\
                <div className="relative">\
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">\
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />\
                        </svg>\
                    </div>\
                    <input\
                        type="text"\
                        value={data.occupation}\
                        onChange={(e) => setData('\''occupation'\'', e.target.value)}\
                        placeholder="Pekerjaan Kepala Keluarga"\
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"\
                    />\
                </div>\
                {errors.occupation && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.occupation}</p>}\
            </div>\
}' resources/js/pages/Authentication/Register/Step1Kependudukan.jsx
