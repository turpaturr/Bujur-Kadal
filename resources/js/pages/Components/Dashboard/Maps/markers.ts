import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

import type { WildfireHotspot } from '@/hooks/useWildfireData';
import type { UserLocation, UserSafetyAnalysis } from '@/utils/geoSafety';
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

