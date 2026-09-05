import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

import type { WildfireHotspot } from '@/hooks/useWildfireData';
import {
    calculateDistanceKm,
    type UserLocation,
    type UserSafetyAnalysis,
} from '@/utils/geoSafety';
import {
    CONFIDENCE_COLORS,
    CONFIDENCE_FILL_OPACITY,
} from './constants';
import {
    buildHotspotPopupHtml,
    buildRegisteredUserPopupHtml,
    buildUserHomePopupHtml,
} from './popups';
import type { RegisteredUserLocation } from './types';

// Inisialisasi icon default Leaflet untuk bundler Vite
export const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/** Membuat CircleMarker untuk Titik Api Satelit NASA */
export function createHotspotMarker(
    hotspot: WildfireHotspot,
    onMarkerClick?: (e: L.LeafletMouseEvent) => void,
): L.CircleMarker {
    const color = CONFIDENCE_COLORS[hotspot.confidenceLevel];
    const fillOpacity = CONFIDENCE_FILL_OPACITY[hotspot.confidenceLevel];
    const radius = Math.min(13, Math.max(4.5, 4.5 + hotspot.frp / 25));

    const marker = L.circleMarker([hotspot.latitude, hotspot.longitude], {
        radius,
        color: hotspot.confidenceLevel === 'high' ? '#7f1d1d' : color,
        fillColor: color,
        fillOpacity,
        weight: hotspot.confidenceLevel === 'high' ? 2 : 1.2,
        opacity: 0.95,
    });

    marker.bindPopup(buildHotspotPopupHtml(hotspot), {
        maxWidth: 295,
        minWidth: 260,
        className: 'wildfire-popup-custom',
        autoPan: true,
        autoPanPaddingTopLeft: L.point(40, 85),
        autoPanPaddingBottomRight: L.point(40, 45),
        keepInView: true,
    });

    if (onMarkerClick) {
        marker.on('click', onMarkerClick);
    }

    return marker;
}

/** Membuat Marker Kediaman Pribadi Pengguna & Radius Keamanan (25km + 10km) */
export function createUserHomeLayers(
    userLocation: UserLocation,
    userSafety: UserSafetyAnalysis | null,
): { homeMarker: L.Marker; circle25km: L.Circle; circle10km: L.Circle } {
    const lat = Number(userLocation.latitude);
    const lng = Number(userLocation.longitude);

    const status = userSafety?.status ?? 'safe';
    const statusColor =
        status === 'danger'
            ? '#B91C1C'
            : status === 'warning'
                ? '#E5A910'
                : '#15803D';

    const statusLabel =
        status === 'danger'
            ? 'BAHAYA KARHUTLA'
            : status === 'warning'
                ? 'STATUS WASPADA'
                : 'LINGKUNGAN AMAN';

    // 1. Outer Radius: 25 km Buffer Lingkungan
    const circle25km = L.circle([lat, lng], {
        radius: 25000,
        color: statusColor,
        fillColor: statusColor,
        fillOpacity: status === 'danger' ? 0.12 : 0.05,
        weight: 2,
        dashArray: '6, 8',
        interactive: false,
    });

    // 2. Inner Radius: 10 km Zona Bahaya Kritis
    const circle10km = L.circle([lat, lng], {
        radius: 10000,
        color: status === 'danger' ? '#B91C1C' : '#E5A910',
        fillColor: status === 'danger' ? '#B91C1C' : '#E5A910',
        fillOpacity: status === 'danger' ? 0.16 : 0.03,
        weight: status === 'danger' ? 2.5 : 1,
        dashArray: '4, 4',
        interactive: false,
    });

    // 3. Marker Rumah Warga (Custom DivIcon SVG Bebas Emoji)
    const homeIcon = L.divIcon({
        className: 'custom-user-home-marker',
        html: `
            <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${statusColor}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: ${statusColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div style="position: absolute; top: 34px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); padding: 2px 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border: 1px solid #EEEEEE; font-family: 'Figtree', sans-serif; font-size: 10px; font-weight: 800; color: #1F6F5F;">
                    Kediaman Anda
                </div>
            </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -22],
    });

    const homeMarker = L.marker([lat, lng], {
        icon: homeIcon,
        zIndexOffset: 2000,
    });

    homeMarker.bindPopup(
        buildUserHomePopupHtml(userLocation, userSafety, statusColor, statusLabel),
        {
            maxWidth: 280,
            className: 'user-home-popup-custom',
        },
    );

    return { homeMarker, circle25km, circle10km };
}

/** Membuat Marker Tempat Tinggal Warga Terdaftar (Khusus Otoritas / Admin) */
export function createRegisteredUserMarker(
    household: RegisteredUserLocation,
    onSelect?: (user: RegisteredUserLocation) => void,
): L.Marker {
    const isVulnerable = household.is_vulnerable;
    const icon = isVulnerable
        ? L.divIcon({
            className: 'custom-registered-user-marker',
            html: `
                <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: #7C3AED; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                    <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: #6D28D9; border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(109,40,217,0.4); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div style="position: absolute; top: -3px; right: -3px; background: #DC2626; color: #ffffff; font-family: monospace; font-size: 9px; font-weight: 800; border-radius: 9999px; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff;" title="Keluarga Rentan">
                        !
                    </div>
                </div>
              `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -20],
        })
        : L.divIcon({
            className: 'custom-registered-user-marker',
            html: `
                <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #0D9488; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(13,148,136,0.35); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div style="position: absolute; top: -3px; right: -3px; background: #0F766E; color: #ffffff; font-family: monospace; font-size: 8.5px; font-weight: 800; border-radius: 9999px; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff;" title="Jumlah Anggota">
                        ${household.total_members}
                    </div>
                </div>
              `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -18],
        });

    const marker = L.marker([Number(household.latitude), Number(household.longitude)], {
        icon,
        zIndexOffset: isVulnerable ? 1500 : 1200,
    });

    marker.bindPopup(buildRegisteredUserPopupHtml(household), {
        maxWidth: 330,
        minWidth: 285,
        className: 'registered-user-popup-custom',
        autoPan: true,
        autoPanPaddingTopLeft: L.point(40, 85),
        autoPanPaddingBottomRight: L.point(40, 45),
        keepInView: true,
    });

    marker.bindTooltip(
        `<div style="font-family: 'Figtree', sans-serif; font-size: 11px; font-weight: 700; color: ${isVulnerable ? '#B91C1C' : '#0F766E'};">
            🏠 ${household.name} (${household.total_members} Jiwa${isVulnerable ? ' &middot; Prioritas Rentan' : ''})
            <div style="font-size: 9.5px; font-weight: 500; color: #64748B; margin-top: 1px;">Klik untuk melihat pop up detail lengkap</div>
        </div>`,
        {
            direction: 'top',
            offset: [0, -18],
        },
    );

    marker.on('click', () => {
        marker.openPopup();
        if (onSelect) {
            onSelect(household);
        }
    });

    return marker;
}

export interface ClinicData {
    id: string;
    name: string;
    lat: number;
    lng: number;
    addr?: string;
    phone?: string;
}

/** Membuat Marker Berikon Rumah Sakit untuk Fasilitas Kesehatan / Klinik Kalimantan */
export function createClinicMarker(
    clinic: ClinicData,
    origin?: { lat: number; lng: number } | null,
    onSelectRoute?: (clinic: ClinicData) => void,
    onBookCheckup?: (clinic: ClinicData) => void,
): L.Marker {
    const hospitalIcon = L.divIcon({
        className: 'custom-clinic-hospital-marker',
        html: `
            <div style="position: relative; width: 18px; height: 18px; background: #ffffff; border: 1.5px solid #059669; border-radius: 4px; box-shadow: 0 1.5px 4px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s ease;" title="${clinic.name.replace(/"/g, '&quot;')}">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#059669" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 2h7v6.5H22v7h-6.5V22h-7v-6.5H2v-7h6.5V2z"/>
                </svg>
            </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -11],
    });

    const marker = L.marker([clinic.lat, clinic.lng], {
        icon: hospitalIcon,
        zIndexOffset: 600,
    });

    const hasOrigin = Boolean(
        origin &&
        origin.lat !== undefined &&
        origin.lng !== undefined &&
        !isNaN(Number(origin.lat)) &&
        !isNaN(Number(origin.lng)) &&
        (Number(origin.lat) !== 0 || Number(origin.lng) !== 0),
    );

    const originParam = hasOrigin ? `&origin=${origin!.lat},${origin!.lng}` : '';
    const mapsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${clinic.lat},${clinic.lng}`;

    let distanceBadge = '';
    let distanceTooltip = '';
    if (hasOrigin) {
        const distKm = calculateDistanceKm(origin!.lat, origin!.lng, clinic.lat, clinic.lng);
        const distFormatted = distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`;
        distanceBadge = `<span style="font-size: 10px; font-weight: 700; color: #047857; background: #ecfdf5; padding: 1.5px 6px; border-radius: 6px; border: 1px solid #a7f3d0; white-space: nowrap;">± ${distFormatted} dari Rumah</span>`;
        distanceTooltip = ` (${distFormatted} dari Rumah)`;
    }

    const popupHtml = `
        <div style="font-family: 'Figtree', sans-serif; min-width: 235px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 4px;">
                <span style="background: #ecfdf5; color: #047857; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; text-transform: uppercase; border: 1px solid #a7f3d0; display: inline-flex; align-items: center; gap: 3px; white-space: nowrap;">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#047857"><path d="M8.5 2h7v6.5H22v7h-6.5V22h-7v-6.5H2v-7h6.5V2z"/></svg>
                    Faskes / RS
                </span>
                ${distanceBadge ? distanceBadge : '<span style="font-size: 10px; font-weight: 600; color: #059669;">Buka / Siaga</span>'}
            </div>
            <h4 style="font-weight: 700; font-size: 13px; color: #1F6F5F; margin: 0 0 4px 0; line-height: 1.3;">
                ${clinic.name}
            </h4>
            ${clinic.addr ? `<p style="font-size: 11px; color: #4b5563; margin: 0 0 6px 0; line-height: 1.3;">${clinic.addr}</p>` : ''}
            ${clinic.phone ? `<p style="font-size: 10.5px; color: #1F6F5F; font-weight: 600; margin: 0 0 6px 0;">Telp: ${clinic.phone}</p>` : ''}
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #374151;">
                <div style="color: #047857; font-weight: 600; margin-bottom: 2px;">
                    • Siaga Oksigen &amp; Nebulizer ISPA
                </div>
                <div style="color: #6b7280;">
                    Pelayanan pertolongan gangguan pernapasan asap
                </div>
            </div>
            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 5px;">
                ${onBookCheckup ? `
                    <button id="btn-book-${clinic.id}" type="button" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: #047857; color: #ffffff; border: none; font-size: 11px; font-weight: 700; padding: 7px 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(4,120,87,0.25); cursor: pointer; transition: background 0.15s ease;">
                        <span>📅 Buat Jadwal Medical Checkup</span>
                    </button>
                ` : ''}
                ${onSelectRoute ? `
                    <button id="btn-route-${clinic.id}" type="button" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: #1F6F5F; color: #ffffff; border: none; font-size: 11px; font-weight: 700; padding: 7px 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(31,111,95,0.25); cursor: pointer;">
                        <span>🚗 Pandu Rute di Peta Ini</span>
                        <span>&rarr;</span>
                    </button>
                ` : ''}
                <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; color: #047857; text-decoration: none; font-size: 10px; font-weight: 600; padding: 4px 6px; border-radius: 6px; background: #ecfdf5; border: 1px solid #a7f3d0;">
                    Buka di Google Maps App &nearr;
                </a>
            </div>
        </div>
    `;

    marker.bindPopup(popupHtml, {
        maxWidth: 280,
        minWidth: 235,
        className: 'clinic-popup-custom',
        autoPan: true,
        autoPanPaddingTopLeft: L.point(40, 85),
        autoPanPaddingBottomRight: L.point(40, 45),
        keepInView: true,
    });

    marker.on('popupopen', () => {
        if (onSelectRoute) {
            const btnRoute = document.getElementById(`btn-route-${clinic.id}`);
            if (btnRoute) {
                btnRoute.onclick = (e) => {
                    e.preventDefault();
                    marker.closePopup();
                    onSelectRoute(clinic);
                };
            }
        }
        if (onBookCheckup) {
            const btnBook = document.getElementById(`btn-book-${clinic.id}`);
            if (btnBook) {
                btnBook.onclick = (e) => {
                    e.preventDefault();
                    marker.closePopup();
                    onBookCheckup(clinic);
                };
            }
        }
    });

    marker.bindTooltip(
        `<div style="font-family: 'Figtree', sans-serif; font-size: 11px; font-weight: 700; color: #065F46;">
            🏥 ${clinic.name}${distanceTooltip}
            <div style="font-size: 9.5px; font-weight: 500; color: #059669; margin-top: 1px;">Siaga Oksigen & Faskes ISPA</div>
        </div>`,
        {
            direction: 'top',
            offset: [0, -11],
            opacity: 0.95,
        },
    );

    return marker;
}


