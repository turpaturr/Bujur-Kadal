import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon default Leaflet untuk bundler Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Shortcut kota-kota utama di Kalimantan untuk kemudahan navigasi warga
const CITY_PRESETS = [
    { name: 'Samarinda', lat: -0.4948, lng: 117.1358, zoom: 13 },
    { name: 'Balikpapan', lat: -1.242, lng: 116.894, zoom: 13 },
    { name: 'Palangka Raya', lat: -2.2161, lng: 113.9166, zoom: 13 },
    { name: 'Pontianak', lat: -0.0345, lng: 109.3425, zoom: 13 },
    { name: 'Banjarmasin', lat: -3.3194, lng: 114.5908, zoom: 13 },
];

export default function Step2Lokasi({ data, setData, errors }) {
    const [searchQuery, setSearchQuery] = useState(data.home_address || '');
    const [suggestions, setSuggestions] = useState([]);
    const [searching, setSearching] = useState(false);
    const [detectingGps, setDetectingGps] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const radiusCircleRef = useRef(null);
    const debounceTimer = useRef(null);
    const reverseDebounceTimer = useRef(null);

    // Default koordinat awal (Balikpapan/Samarinda jika belum ada koordinat tersimpan)
    const initialLat = data.home_latitude ? parseFloat(data.home_latitude) : -1.242;
    const initialLng = data.home_longitude ? parseFloat(data.home_longitude) : 116.894;
    const hasCoordinates = Boolean(data.home_latitude && data.home_longitude);

    // 1. Inisialisasi Peta Leaflet Interaktif
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        // Inisialisasi peta dengan Tile OpenStreetMap
        const map = L.map(mapContainerRef.current, {
            center: [initialLat, initialLng],
            zoom: hasCoordinates ? 15 : 11,
            zoomControl: true,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            subdomains: ['a', 'b', 'c'],
        }).addTo(map);

        // Icon kustom berbentuk Pin Rumah dengan pulsing beacon
        const homeDivIcon = L.divIcon({
            className: 'custom-home-pin',
            html: `
                <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
                    <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(47, 160, 132, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                    <div style="position: relative; width: 30px; height: 30px; border-radius: 50%; background: #1F6F5F; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 14px; color: white;">
                        🏠
                    </div>
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20],
        });

        // Marker rumah yang bisa digeser (draggable) untuk presisi maksimal
        const marker = L.marker([initialLat, initialLng], {
            icon: homeDivIcon,
            draggable: true,
            autoPan: true,
        }).addTo(map);

        marker.bindPopup(
            '<div style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #1F6F5F; text-align: center;">📍 Posisi Rumah Anda<br/><span style="font-size: 10px; color: #666; font-weight: normal;">(Bisa digeser untuk presisi)</span></div>'
        );

        // Lingkaran radius 5 km (Fire Tracker & Evacuation Buffer)
        const radiusCircle = L.circle([initialLat, initialLng], {
            radius: 5000,
            color: '#2FA084',
            fillColor: '#2FA084',
            fillOpacity: 0.12,
            weight: 2,
            dashArray: '5, 8',
        }).addTo(map);

        markerRef.current = marker;
        radiusCircleRef.current = radiusCircle;
        mapInstanceRef.current = map;

        // EVENT: Saat marker selesai digeser oleh user
        marker.on('dragend', () => {
            const pos = marker.getLatLng();
            radiusCircle.setLatLng(pos);
            updateCoordinates(pos.lat, pos.lng, true);
        });

        // EVENT: Saat user klik di sembarang tempat di peta
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            radiusCircle.setLatLng([lat, lng]);
            updateCoordinates(lat, lng, true);
        });

        // Pastikan Leaflet menghitung ulang ukuran container agar tidak ada area abu-abu
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => {
            clearTimeout(timer);
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // 2. Fungsi memperbarui koordinat & reverse geocoding ke nama jalan
    const updateCoordinates = (lat, lng, shouldReverseGeocode = true) => {
        const roundedLat = parseFloat(lat.toFixed(7));
        const roundedLng = parseFloat(lng.toFixed(7));

        setData((prev) => ({
            ...prev,
            home_latitude: roundedLat,
            home_longitude: roundedLng,
        }));

        if (shouldReverseGeocode) {
            triggerReverseGeocode(roundedLat, roundedLng);
        }
    };

    // 3. Reverse geocoding (OpenStreetMap Nominatim) untuk mengisi nama alamat otomatis
    const triggerReverseGeocode = (lat, lng) => {
        if (reverseDebounceTimer.current) {
            clearTimeout(reverseDebounceTimer.current);
        }

        reverseDebounceTimer.current = setTimeout(async () => {
            setIsReverseGeocoding(true);
            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
                const res = await fetch(url, {
                    headers: {
                        'Accept-Language': 'id',
                    },
                });
                const json = await res.json();

                if (json && json.display_name) {
                    const formatted = json.display_name;
                    setData((prev) => ({
                        ...prev,
                        home_address: formatted,
                    }));
                    setSearchQuery(formatted);
                }
            } catch (err) {
                console.warn('Gagal melakukan reverse geocoding Nominatim:', err);
            } finally {
                setIsReverseGeocoding(false);
            }
        }, 500);
    };

    // 4. Pencarian alamat (Forward Geocoding via Nominatim)
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
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery
                )}&countrycodes=id&limit=5&addressdetails=1`;
                const res = await fetch(url, {
                    headers: {
                        'Accept-Language': 'id',
                    },
                });
                const list = await res.json();

                if (Array.isArray(list) && list.length > 0) {
                    setSuggestions(list);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            } catch (err) {
                console.error('Error fetching geocoding suggestions:', err);
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

    // 5. User memilih salah satu saran alamat dari autocomplete
    const handleSelectSuggestion = (item) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const address = item.display_name;

        setData((prev) => ({
            ...prev,
            home_address: address,
            home_latitude: parseFloat(lat.toFixed(7)),
            home_longitude: parseFloat(lng.toFixed(7)),
        }));

        setSearchQuery(address);
        setShowSuggestions(false);

        // Arahkan peta & pindahkan marker ke titik yang dipilih
        if (mapInstanceRef.current && markerRef.current && radiusCircleRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
            markerRef.current.setLatLng([lat, lng]);
            radiusCircleRef.current.setLatLng([lat, lng]);
        }
    };

    // 6. Deteksi Lokasi Otomatis via GPS Browser
    const handleDetectCurrentLocation = () => {
        setGpsError(null);

        if (!navigator.geolocation) {
            setGpsError('Browser Anda tidak mendukung deteksi lokasi otomatis.');
            return;
        }

        setDetectingGps(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                updateCoordinates(lat, lng, true);

                if (mapInstanceRef.current && markerRef.current && radiusCircleRef.current) {
                    mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
                    markerRef.current.setLatLng([lat, lng]);
                    radiusCircleRef.current.setLatLng([lat, lng]);
                }

                setDetectingGps(false);
            },
            (err) => {
                setDetectingGps(false);
                if (err.code === 1) {
                    setGpsError('Izin akses lokasi ditolak oleh browser. Silakan cari atau klik langsung di peta.');
                } else {
                    setGpsError('Gagal mendeteksi lokasi GPS. Silakan tentukan titik di peta.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // 7. Shortcut melompat ke kota-kota utama Kalimantan
    const handleJumpToCity = (city) => {
        if (mapInstanceRef.current && markerRef.current && radiusCircleRef.current) {
            mapInstanceRef.current.flyTo([city.lat, city.lng], city.zoom, { duration: 1.2 });
            markerRef.current.setLatLng([city.lat, city.lng]);
            radiusCircleRef.current.setLatLng([city.lat, city.lng]);
            updateCoordinates(city.lat, city.lng, true);
        }
    };

    return (
        <div className="space-y-3 font-sans">
            {/* Input Pencarian Alamat & Tombol GPS */}
            <div className="relative">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
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
                        placeholder="Ketik alamat jalan / cari lokasi..."
                        className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-surface text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"
                    />

                    <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center gap-1">
                        {isReverseGeocoding && (
                            <span className="text-[10px] text-primary animate-pulse font-medium mr-1 hidden sm:inline">
                                Membaca...
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleDetectCurrentLocation}
                            disabled={detectingGps}
                            className="px-2.5 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold hover:bg-primary-dark transition-all flex items-center shadow-xs cursor-pointer"
                            title="Gunakan GPS Perangkat Saya"
                        >
                            {detectingGps ? (
                                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1 animate-ping"></span>
                                    Lokasi Saya
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-30 mt-1.5 w-full bg-white border border-surface rounded-2xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                        <div className="p-2 text-[10px] uppercase font-bold text-neutral-400 bg-surface/50 border-b border-surface">
                            Pilih Lokasi yang Sesuai:
                        </div>
                        {suggestions.map((item, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectSuggestion(item)}
                                className="w-full text-left px-3.5 py-2 hover:bg-accent/15 text-xs text-neutral-700 border-b border-surface/50 flex items-start space-x-2 transition-colors cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-neutral-900 text-[11px] truncate">
                                        {item.name || item.display_name.split(',')[0]}
                                    </div>
                                    <div className="text-[10px] text-neutral-500 line-clamp-1">
                                        {item.display_name}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {errors.home_address && (
                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.home_address}</p>
                )}
            </div>

            {/* Shortcut Tombol Kota Cepat (Pills) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[10px]">
                <span className="text-neutral-400 font-medium shrink-0">Lompat:</span>
                {CITY_PRESETS.map((city) => (
                    <button
                        key={city.name}
                        type="button"
                        onClick={() => handleJumpToCity(city)}
                        className="px-2 py-0.5 rounded-full bg-surface hover:bg-primary/15 hover:text-primary-dark text-neutral-600 font-medium transition-colors shrink-0 cursor-pointer"
                    >
                        📍 {city.name}
                    </button>
                ))}
            </div>

            {gpsError && (
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 text-[11px] border border-amber-200">
                    {gpsError}
                </div>
            )}

            {/* Wadah Peta Leaflet Interaktif yang Siap Digeser & Diklik */}
            <div className="rounded-2xl overflow-hidden border border-primary/30 shadow-xs bg-white">

                {/* Kontainer Peta Leaflet */}
                <div className="relative w-full h-[240px] sm:h-[270px]">
                    <div ref={mapContainerRef} className="w-full h-full z-0" />

                    {/* Badge Overlay: Status Koordinat */}
                    <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-primary-dark shadow-xs border border-primary/30 flex items-center pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-1.5"></span>
                        {data.home_latitude && data.home_longitude ? 'Koordinat Terkunci' : 'Menunggu Titik Peta'}
                    </div>
                </div>

                {/* Footer Bar: Koordinat Presisi & Label Sistem Keamanan */}
                <div className="p-2.5 bg-surface/80 text-[11px] text-primary-dark flex flex-wrap items-center justify-between gap-2 border-t border-surface">
                    <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px]">
                        <span className="font-semibold text-neutral-500">Lat:</span>
                        <span className="font-bold text-neutral-800">{data.home_latitude || '-'}</span>
                        <span className="text-neutral-400 mx-1">|</span>
                        <span className="font-semibold text-neutral-500">Lng:</span>
                        <span className="font-bold text-neutral-800">{data.home_longitude || '-'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2FA084]"></span>
                        <span className="font-bold text-[9px] sm:text-[10px] uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded shadow-2xs">
                            FIRE TRACKER 5KM READY
                        </span>
                    </div>
                </div>
            </div>

            {errors.home_latitude && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.home_latitude}</p>
            )}
        </div>
    );
}
