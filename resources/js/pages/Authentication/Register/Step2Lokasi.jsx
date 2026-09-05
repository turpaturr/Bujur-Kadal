import React, { useState, useEffect, useRef } from 'react';

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'pPsPtyphwMu36vCAyTxK';

export default function Step2Lokasi({ data, setData, errors }) {
    const [searchQuery, setSearchQuery] = useState(data.home_address || '');
    const [suggestions, setSuggestions] = useState([]);
    const [searching, setSearching] = useState(false);
    const [detectingGps, setDetectingGps] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef(null);

    // Debounced geocoding search with MapTiler API
    useEffect(() => {
        if (!searchQuery || searchQuery.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            setSearching(true);
            try {
                // Focus search query around Indonesia / Kalimantan
                const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_KEY}&language=id&country=id&limit=5`;
                const res = await fetch(url);
                const json = await res.json();

                if (json.features && json.features.length > 0) {
                    setSuggestions(json.features);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            } catch (err) {
                console.error('Error fetching MapTiler geocoding:', err);
            } finally {
                setSearching(false);
            }
        }, 400);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery]);

    // Handle selection from autocomplete suggestions
    const handleSelectSuggestion = (feature) => {
        const placeName = feature.place_name || feature.text;
        const [lng, lat] = feature.geometry.coordinates;

        setData((prev) => ({
            ...prev,
            home_address: placeName,
            home_latitude: parseFloat(lat.toFixed(7)),
            home_longitude: parseFloat(lng.toFixed(7)),
        }));

        setSearchQuery(placeName);
        setShowSuggestions(false);
    };

    // Handle Browser GPS Geolocation + Reverse Geocoding
    const handleDetectCurrentLocation = () => {
        setGpsError(null);

        if (!navigator.geolocation) {
            setGpsError('Browser Anda tidak mendukung deteksi lokasi otomatis.');
            return;
        }

        setDetectingGps(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setData((prev) => ({
                    ...prev,
                    home_latitude: parseFloat(lat.toFixed(7)),
                    home_longitude: parseFloat(lng.toFixed(7)),
                }));

                // Reverse geocoding to retrieve readable Indonesian address
                try {
                    const reverseUrl = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}&language=id`;
                    const res = await fetch(reverseUrl);
                    const json = await res.json();

                    if (json.features && json.features.length > 0) {
                        const address = json.features[0].place_name;
                        setData((prev) => ({ ...prev, home_address: address }));
                        setSearchQuery(address);
                    }
                } catch (e) {
                    console.warn('Reverse geocoding failed, using coordinates only:', e);
                } finally {
                    setDetectingGps(false);
                }
            },
            (err) => {
                setDetectingGps(false);
                if (err.code === 1) {
                    setGpsError('Izin akses lokasi ditolak. Harap izinkan GPS pada browser atau cari alamat secara manual.');
                } else {
                    setGpsError('Gagal mendeteksi lokasi GPS. Silakan gunakan pencarian alamat.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const hasCoordinates = data.home_latitude && data.home_longitude;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <span className="w-2 h-6 bg-emerald-600 rounded-full mr-2.5"></span>
                    Lokasi Rumah & Pemetaan Geocoding
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                    Titik koordinat akurat dibutuhkan oleh <strong className="text-emerald-700 dark:text-emerald-400">Fire Tracker BorneoCare</strong> untuk menghitung jarak titik api (hotspot) dalam radius bahaya 5 km dan menentukan rute evakuasi terdekat ke safe zone.
                </p>
            </div>

            {/* GPS Auto-Detect Button */}
            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    type="button"
                    onClick={handleDetectCurrentLocation}
                    disabled={detectingGps}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                    {detectingGps ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Membaca GPS Perangkat...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Gunakan Titik GPS Rumah Saat Ini
                        </>
                    )}
                </button>
            </div>

            {gpsError && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
                    {gpsError}
                </div>
            )}

            {/* Input Alamat dengan Autocomplete MapTiler Geocoding */}
            <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="home_address" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Cari / Masukkan Alamat Rumah <span className="text-rose-500">*</span>
                    </label>
                    {searching && (
                        <span className="text-[11px] font-medium text-emerald-600 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1"></span>
                            Mencari di MapTiler...
                        </span>
                    )}
                </div>

                <div className="relative">
                    <input
                        id="home_address"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setData('home_address', e.target.value);
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        placeholder="Contoh: Jl. Pahlawan No. 12, Samarinda, Kalimantan Timur"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                        <div className="p-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                            Pilih Lokasi dari MapTiler Geocoding:
                        </div>
                        {suggestions.map((item, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectSuggestion(item)}
                                className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs text-slate-700 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/50 flex items-start space-x-2 transition-colors"
                            >
                                <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <div>
                                    <div className="font-semibold text-slate-900 dark:text-white">{item.text}</div>
                                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">{item.place_name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {errors.home_address && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.home_address}</p>
                )}
            </div>

            {/* Koordinat Latitude & Longitude Preview */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Latitude (Garis Lintang) <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={data.home_latitude || ''}
                        onChange={(e) => setData('home_latitude', parseFloat(e.target.value) || '')}
                        placeholder="-0.501234"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60 text-slate-800 dark:text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    {errors.home_latitude && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.home_latitude}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                        Longitude (Garis Bujur) <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={data.home_longitude || ''}
                        onChange={(e) => setData('home_longitude', parseFloat(e.target.value) || '')}
                        placeholder="117.152345"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60 text-slate-800 dark:text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    {errors.home_longitude && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.home_longitude}</p>
                    )}
                </div>
            </div>

            {/* Live Map Preview via MapTiler Static Map API */}
            {hasCoordinates ? (
                <div className="rounded-2xl overflow-hidden border border-emerald-300/80 dark:border-emerald-800 shadow-md bg-white dark:bg-zinc-900 animate-fadeIn">
                    <div className="relative aspect-[21/9] sm:aspect-[2/1] w-full bg-slate-100 dark:bg-zinc-800">
                        <img
                            src={`https://api.maptiler.com/maps/streets-v2/static/${data.home_longitude},${data.home_latitude},15/600x300.png?key=${MAPTILER_KEY}&markers=${data.home_longitude},${data.home_latitude},red`}
                            alt="Pratinjau Lokasi Rumah MapTiler"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200 dark:border-emerald-800 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                            Koordinat Titik Rumah Terkunci
                        </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="text-xs text-slate-700 dark:text-zinc-300">
                            <span className="font-bold text-slate-900 dark:text-white">Siap Terhubung dengan Fire Tracker:</span>{' '}
                            Sistem akan memindai hotspot asap Karhutla dalam radius <strong>5 KM</strong> dari titik ini.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-800/20 text-center">
                    <svg className="w-8 h-8 mx-auto text-slate-300 dark:text-zinc-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Peta pratinjau akan muncul di sini setelah Anda memilih alamat atau mengklik tombol deteksi GPS.
                    </p>
                </div>
            )}
        </div>
    );
}
