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
                    console.warn('Reverse geocoding failed:', e);
                } finally {
                    setDetectingGps(false);
                }
            },
            (err) => {
                setDetectingGps(false);
                if (err.code === 1) {
                    setGpsError('Izin akses lokasi ditolak. Silakan cari alamat secara manual.');
                } else {
                    setGpsError('Gagal mendeteksi lokasi GPS.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const hasCoordinates = data.home_latitude && data.home_longitude;

    return (
        <div className="space-y-4">
            {/* Input Alamat dengan Icon & MapTiler Geocoding */}
            <div className="relative">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
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
                        placeholder="Search Address (Ketik Alamat Rumah...)"
                        className="w-full pl-11 pr-24 py-3 rounded-xl bg-[#EEEEEE] text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA084] transition-all border border-transparent focus:border-[#2FA084]"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                        <button
                            type="button"
                            onClick={handleDetectCurrentLocation}
                            disabled={detectingGps}
                            className="px-2.5 py-1.5 rounded-lg bg-[#2FA084] text-white text-[10px] font-bold hover:bg-[#1F6F5F] transition-all flex items-center shadow-xs"
                            title="Deteksi Titik GPS Otomatis"
                        >
                            {detectingGps ? (
                                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF97] mr-1 animate-ping"></span>
                                    GPS Saya
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-20 mt-1.5 w-full bg-white border border-[#EEEEEE] rounded-2xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                        <div className="p-2 text-[10px] uppercase font-bold text-slate-400 bg-[#EEEEEE]/50 border-b border-[#EEEEEE]">
                            Pilih Alamat dari MapTiler:
                        </div>
                        {suggestions.map((item, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectSuggestion(item)}
                                className="w-full text-left px-4 py-2.5 hover:bg-[#6FCF97]/15 text-xs text-slate-700 border-b border-[#EEEEEE] flex items-start space-x-2 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5 text-[#2FA084] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <div>
                                    <div className="font-semibold text-slate-900">{item.text}</div>
                                    <div className="text-[10px] text-slate-400 line-clamp-1">{item.place_name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {errors.home_address && (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.home_address}</p>
                )}
            </div>

            {gpsError && (
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-[11px]">
                    {gpsError}
                </div>
            )}

            {/* Live Map Preview via MapTiler Static Map API */}
            {hasCoordinates ? (
                <div className="rounded-2xl overflow-hidden border border-[#2FA084]/40 shadow-sm bg-white animate-fadeIn">
                    <div className="relative aspect-[21/9] w-full bg-[#EEEEEE]">
                        <img
                            src={`https://api.maptiler.com/maps/streets-v2/static/${data.home_longitude},${data.home_latitude},15/600x240.png?key=${MAPTILER_KEY}&markers=${data.home_longitude},${data.home_latitude},red`}
                            alt="MapTiler Preview"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-[#1F6F5F] shadow-xs border border-[#2FA084]/30 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2FA084] animate-pulse mr-1"></span>
                            Koordinat Terkunci
                        </div>
                    </div>
                    <div className="p-2.5 bg-[#EEEEEE] text-[11px] text-[#1F6F5F] flex items-center justify-between">
                        <span className="font-mono font-medium">Lat: {data.home_latitude}, Lng: {data.home_longitude}</span>
                        <span className="font-bold text-[10px] uppercase tracking-wider bg-[#2FA084] text-white px-2 py-0.5 rounded">Fire Tracker 5KM Ready</span>
                    </div>
                </div>
            ) : (
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#EEEEEE] bg-[#EEEEEE]/50 text-center text-xs text-slate-400">
                    Ketik nama jalan di atas atau klik tombol <strong>GPS Saya</strong> untuk memetakan koordinat evakuasi.
                </div>
            )}
        </div>
    );
}
