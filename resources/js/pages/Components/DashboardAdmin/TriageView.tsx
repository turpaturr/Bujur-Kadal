import { useState } from 'react';
import type { RegisteredUserLocation } from '@/pages/Components/Dashboard/Maps';
import type { WildfireHotspot } from '@/hooks/useWildfireData';
import { ShieldAlert, ShieldCheck, HeartPulse, MapPin } from '@/pages/Components/Dashboard/Icons';

interface TriageViewProps {
    registeredUsers: RegisteredUserLocation[];
    hotspots: WildfireHotspot[];
}

// Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

export default function TriageView({ registeredUsers, hotspots }: TriageViewProps) {
    const [handledIds, setHandledIds] = useState<Set<number>>(new Set());

    const toggleHandled = (id: number) => {
        setHandledIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Calculate nearest hotspot for each user and sort by risk
    const triageQueue = registeredUsers.map(user => {
        let nearestDistance = Infinity;
        let nearestHotspot: WildfireHotspot | null = null;

        hotspots.forEach(hotspot => {
            const dist = calculateDistance(user.latitude, user.longitude, hotspot.latitude, hotspot.longitude);
            if (dist < nearestDistance) {
                nearestDistance = dist;
                nearestHotspot = hotspot;
            }
        });

        // Skor risiko sederhana: makin dekat makin tinggi. Jika rentan, skor dikali 2 (atau jarak dianggap lebih dekat)
        const isDanger = nearestDistance < 5;
        const isWarning = nearestDistance >= 5 && nearestDistance <= 15;
        const isSafe = nearestDistance > 15;

        // Weighting for sort: distance - (vulnerable_count * 2)
        const sortScore = nearestDistance - (user.is_vulnerable ? 5 : 0);

        return {
            ...user,
            nearestDistance,
            nearestHotspot,
            isDanger,
            isWarning,
            isSafe,
            sortScore
        };
    }).sort((a, b) => a.sortScore - b.sortScore);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[#1F6F5F] font-display">Triase ISPA & Evakuasi</h2>
                <p className="text-sm text-gray-500 mt-1">Antrean prioritas keluarga berdasarkan jarak dengan titik api aktif terdekat.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {triageQueue.map(item => {
                    const isHandled = handledIds.has(item.id);
                    
                    let statusColor = "bg-green-50 border-green-200";
                    let statusText = "text-green-700";
                    let statusLabel = "Aman (>15km)";
                    
                    if (item.isDanger) {
                        statusColor = "bg-rose-50 border-rose-200";
                        statusText = "text-rose-700";
                        statusLabel = "Kritis (<5km)";
                    } else if (item.isWarning) {
                        statusColor = "bg-amber-50 border-amber-200";
                        statusText = "text-amber-700";
                        statusLabel = "Waspada (5-15km)";
                    }

                    if (isHandled) {
                        statusColor = "bg-gray-50 border-gray-200 opacity-70";
                        statusText = "text-gray-500";
                        statusLabel = "Sudah Ditangani";
                    }

                    return (
                        <div key={item.id} className={`p-4 rounded-xl border ${statusColor} transition-all`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-1" title={item.name}>{item.name}</h3>
                                    <p className={`text-xs font-bold mt-1 ${statusText}`}>
                                        {statusLabel}
                                    </p>
                                </div>
                                {item.is_vulnerable && !isHandled && (
                                    <span className="shrink-0 rounded-full bg-purple-100 p-1.5 text-purple-700" title="Keluarga Rentan">
                                        <HeartPulse className="w-4 h-4" />
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-start gap-2 text-xs text-gray-600">
                                    <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                                    <span>
                                        {item.nearestDistance === Infinity 
                                            ? 'Tidak ada api aktif' 
                                            : <strong>{item.nearestDistance.toFixed(1)} km</strong>}{' '}
                                        dari titik terdekat
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-gray-600">
                                    <ShieldAlert className="w-4 h-4 shrink-0 text-gray-400" />
                                    <span>{item.vulnerable_count} anggota rentan ISPA</span>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleHandled(item.id)}
                                className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                                    isHandled 
                                        ? 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' 
                                        : 'bg-[#1F6F5F] text-white hover:bg-[#16584a]'
                                }`}
                            >
                                {isHandled ? (
                                    <>Batalkan Penanganan</>
                                ) : (
                                    <><ShieldCheck className="w-4 h-4" /> Tandai Sudah Ditangani</>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

