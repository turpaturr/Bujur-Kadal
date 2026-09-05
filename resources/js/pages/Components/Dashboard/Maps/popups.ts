import type { WildfireHotspot } from '@/hooks/useWildfireData';
import type { UserLocation, UserSafetyAnalysis } from '@/utils/geoSafety';
import {
    CONFIDENCE_COLORS,
    CONFIDENCE_DESCRIPTIONS,
} from './constants';
import type { RegisteredUserLocation } from './types';

export function formatTime(acqTime: string): string {
    if (!acqTime || acqTime.length < 3) {
        return acqTime || '-';
    }
    const padded = acqTime.padStart(4, '0');
    return `${padded.slice(0, 2)}:${padded.slice(2)} UTC`;
}

/** Popup HTML untuk Titik Anomali Termal Satelit NASA */
export function buildHotspotPopupHtml(hotspot: WildfireHotspot): string {
    const info = CONFIDENCE_DESCRIPTIONS[hotspot.confidenceLevel];
    const color = CONFIDENCE_COLORS[hotspot.confidenceLevel];
    const tempCelsius = (hotspot.brightness - 273.15).toFixed(1);
    const tempKelvin = hotspot.brightness.toFixed(1);

    return `
        <div style="font-family: 'Figtree', sans-serif; font-size: 11.5px; min-width: 250px; max-width: 285px; max-height: 380px; overflow-y: auto; line-height: 1.35; color: #262626; padding-right: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 5px; margin-bottom: 7px;">
                <div style="display: flex; align-items: center; gap: 5px; font-weight: 800; color: ${color}; font-size: 12.5px;">
                    <span>Titik Anomali Termal</span>
                </div>
                <span style="font-size: 9.5px; font-weight: 800; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}40;">
                    ${info.title}
                </span>
            </div>

            <!-- Kartu Info Suhu Permukaan -->
            <div style="background: ${color}12; border-radius: 8px; padding: 6px 9px; margin-bottom: 7px; border: 1px solid ${color}30; display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <div style="font-size: 9.5px; font-weight: 700; color: #555; text-transform: uppercase;">Suhu Permukaan:</div>
                    <div style="font-size: 15px; font-weight: 800; color: ${color}; font-family: monospace;">
                        ${tempCelsius}&deg;C <span style="font-size: 10.5px; font-weight: 600; color: #666;">(${tempKelvin} K)</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 9.5px; font-weight: 700; color: #555; text-transform: uppercase;">Radiasi (FRP):</div>
                    <div style="font-size: 13px; font-weight: 800; color: #d97706; font-family: monospace;">
                        ${hotspot.frp > 0 ? hotspot.frp.toFixed(1) + ' MW' : '0.0 MW'}
                    </div>
                </div>
            </div>

            <div style="background: #FAFAFA; border-radius: 6px; padding: 6px 8px; margin-bottom: 7px; border-left: 3px solid ${color}; font-size: 10.5px;">
                <div style="font-weight: 700; color: #1F6F5F; margin-bottom: 2px;">${info.subtitle}</div>
                <div style="color: #555; line-height: 1.3;">${info.desc}</div>
                <div style="margin-top: 4px; font-weight: 600; color: ${color}; font-size: 9.5px;">
                    <span style="font-weight: 800; text-transform: uppercase;">Mitigasi:</span> ${info.advice}
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
                <tr>
                    <td style="color: #666; padding: 2px 0;">Koordinat:</td>
                    <td style="font-weight: 600; text-align: right; font-family: monospace;">${hotspot.latitude.toFixed(4)}&deg;, ${hotspot.longitude.toFixed(4)}&deg;</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Provinsi:</td>
                    <td style="font-weight: 600; text-align: right; color: #1F6F5F;">${hotspot.province ?? 'Kalimantan'}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Waktu Satelit:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.acquisitionDate} (${formatTime(hotspot.acquisitionTime)})</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Sensor Satelit:</td>
                    <td style="font-weight: 600; text-align: right;">${hotspot.satellite} &middot; ${hotspot.source.replace('_NRT', '')}</td>
                </tr>
            </table>
            <div style="margin-top: 5px; padding-top: 4px; border-top: 1px dashed #EEEEEE; font-size: 9px; color: #888; text-align: center;">
                *Data bersumber dari radiasi termal satelit NASA (Brightness Temp °C), bukan kamera visual langsung.
            </div>
        </div>
    `;
}

/** Popup HTML untuk Tempat Tinggal Warga Terdaftar (Khusus Otoritas / Admin) */
export function buildRegisteredUserPopupHtml(household: RegisteredUserLocation): string {
    const isVulnerable = household.is_vulnerable;
    const accentColor = isVulnerable ? '#7C3AED' : '#0D9488';
    const statusBg = isVulnerable ? '#F5F3FF' : '#F0FDF4';
    const statusBorder = isVulnerable ? '#DDD6FE' : '#BBF7D0';
    const statusText = isVulnerable ? '#6D28D9' : '#047857';
    const badgeLabel = isVulnerable
        ? `Prioritas Rentan (${household.vulnerable_count} Jiwa)`
        : 'Keluarga Non-Rentan';

    const membersListHtml =
        household.members && household.members.length > 0
            ? `
        <div style="margin-top: 7px; margin-bottom: 7px;">
            <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 4px;">
                Anggota Keluarga (${household.members.length}):
            </div>
            <div style="max-height: 110px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 2px;">
                ${household.members
                    .map(
                        (m) => `
                    <div style="background: ${m.is_vulnerable ? '#FEF2F2' : '#F8FAFC'}; border: 1px solid ${m.is_vulnerable ? '#FECACA' : '#E2E8F0'}; border-radius: 5px; padding: 4px 6px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 700; font-size: 10.5px; color: ${m.is_vulnerable ? '#991B1B' : '#1E293B'};">${m.name}</span>
                            <span style="font-size: 8.5px; font-weight: 600; padding: 1px 5px; border-radius: 3px; background: ${m.is_vulnerable ? '#FEE2E2' : '#E2E8F0'}; color: ${m.is_vulnerable ? '#B91C1C' : '#475569'}; text-transform: capitalize;">
                                ${m.role === 'kepala_keluarga' ? 'Kepala Keluarga' : 'Anggota'}
                            </span>
                        </div>
                        ${m.comorbidity_notes ? `<div style="font-size: 9px; color: ${m.is_vulnerable ? '#B91C1C' : '#64748B'}; margin-top: 2px; line-height: 1.25;">${m.comorbidity_notes}</div>` : ''}
                    </div>
                `,
                    )
                    .join('')}
            </div>
        </div>
        `
            : '';

    const whatsappBtn = household.whatsapp_link
        ? `
        <a href="${household.whatsapp_link}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: #16A34A; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 11px; padding: 6px 10px; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); margin-top: 7px; transition: background 0.2s;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Hubungi via WhatsApp (${household.whatsapp_number ?? '-'})</span>
        </a>
        `
        : '';

    return `
        <div style="font-family: 'Figtree', sans-serif; font-size: 11.5px; min-width: 250px; max-width: 285px; max-height: 400px; overflow-y: auto; line-height: 1.35; color: #262626; padding-right: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 5px; margin-bottom: 7px;">
                <div style="font-weight: 800; color: ${accentColor}; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em;">
                    Kediaman Warga Terdata
                </div>
                <span style="font-size: 9px; font-weight: 800; background: ${statusBg}; color: ${statusText}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${statusBorder};">
                    ${badgeLabel}
                </span>
            </div>

            <div style="margin-bottom: 5px;">
                <div style="font-size: 13.5px; font-weight: 800; color: #1F6F5F; line-height: 1.25;">
                    ${household.name}
                </div>
                <div style="font-size: 10.5px; color: #64748B; margin-top: 1px;">
                    Total Penghuni: <strong style="color: #1E293B;">${household.total_members} Jiwa</strong>
                </div>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px; margin-bottom: 6px; font-size: 10.5px;">
                <div style="color: #334155; line-height: 1.3;">
                    ${household.home_address || 'Alamat tidak tercatat'}
                </div>
                <div style="font-family: monospace; font-size: 9.5px; color: #64748B; margin-top: 3px;">
                    ${household.latitude.toFixed(4)}°, ${household.longitude.toFixed(4)}°
                </div>
            </div>

            ${membersListHtml}
            ${whatsappBtn}
        </div>
    `;
}

/** Popup HTML untuk Kediaman Pribadi Pengguna (Warga yang sedang login) */
export function buildUserHomePopupHtml(
    userLocation: UserLocation,
    userSafety: UserSafetyAnalysis | null,
    statusColor: string,
    statusLabel: string,
): string {
    const lat = Number(userLocation.latitude);
    const lng = Number(userLocation.longitude);

    return `
        <div style="font-family: 'Figtree', sans-serif; font-size: 12px; min-width: 230px; line-height: 1.4; color: #262626;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 5px; font-weight: 800; color: #1F6F5F; font-size: 13px;">
                    <span>Lokasi Tempat Tinggal</span>
                </div>
                <span style="font-size: 10px; font-weight: 700; background: ${statusColor}18; color: ${statusColor}; padding: 2px 6px; border-radius: 4px;">
                    ${statusLabel}
                </span>
            </div>
            <div style="margin-bottom: 4px; font-weight: 700; color: #1F6F5F;">
                ${userLocation.name ?? 'Warga Terdaftar'}
            </div>
            ${userLocation.address ? `<div style="font-size: 11px; color: #666; margin-bottom: 8px;">${userLocation.address}</div>` : ''}
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; border-top: 1px solid #EEEEEE; padding-top: 6px;">
                <tr>
                    <td style="color: #666; padding: 2px 0;">Koordinat:</td>
                    <td style="font-weight: 600; text-align: right; font-family: monospace;">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Titik Api dlm 25 km:</td>
                    <td style="font-weight: 700; text-align: right; color: ${statusColor};">${userSafety?.hotspotsWithin25Km ?? 0} Titik</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 2px 0;">Titik Api Terdekat:</td>
                    <td style="font-weight: 700; text-align: right; color: #1F6F5F;">${userSafety?.nearestHotspot ? `${userSafety.nearestHotspot.distanceKm} km (${userSafety.nearestHotspot.direction})` : 'Aman (>50 km)'}</td>
                </tr>
            </table>
        </div>
    `;
}

