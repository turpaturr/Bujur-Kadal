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

/** Helper untuk memformat badge kerentanan anggota */
function formatVulnerabilityBadge(member: {
    is_vulnerable: boolean;
    vulnerability_category?: string | null;
    comorbidity_notes?: string | null;
}): { label: string; bg: string; text: string; border: string } {
    const cat = member.vulnerability_category;

    if (cat === 'ibu_hamil') {
        return { label: 'Ibu Hamil', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
    }
    if (cat === 'balita') {
        return { label: 'Balita (< 4 th)', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
    }
    if (cat === 'lansia') {
        return { label: 'Lansia (> 60 th)', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
    }
    if (cat === 'penyakit_bawaan') {
        return { label: 'Penyakit Bawaan', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
    }
    if (cat === 'anak_anak') {
        return { label: 'Anak-anak (4-10 th)', bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A' };
    }
    if (member.is_vulnerable) {
        return { label: 'Rentan', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
    }
    return { label: 'Kondisi Sehat', bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' };
}

/** Popup HTML untuk Tempat Tinggal Warga Terdaftar (Khusus Otoritas / Admin) */
export function buildRegisteredUserPopupHtml(household: RegisteredUserLocation): string {
    const isVulnerable = household.is_vulnerable;
    const accentColor = isVulnerable ? '#B91C1C' : '#1F6F5F';
    const statusBg = isVulnerable ? '#FEF2F2' : '#F0FDF4';
    const statusBorder = isVulnerable ? '#FECACA' : '#BBF7D0';
    const statusText = isVulnerable ? '#B91C1C' : '#15803D';

    const statusBadge = isVulnerable
        ? `
        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 800; background: ${statusBg}; color: ${statusText}; padding: 2px 7px; border-radius: 6px; border: 1px solid ${statusBorder};">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #DC2626;"></span>
            PRIORITAS RENTAN (${household.vulnerable_count} Jiwa)
        </span>
        `
        : `
        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 800; background: ${statusBg}; color: ${statusText}; padding: 2px 7px; border-radius: 6px; border: 1px solid ${statusBorder};">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #16A34A;"></span>
            NON-RENTAN (AMAN)
        </span>
        `;

    const membersListHtml =
        household.members && household.members.length > 0
            ? `
        <div style="margin-top: 8px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; letter-spacing: 0.03em;">
                    Daftar Penghuni Rumah (${household.members.length} Jiwa):
                </span>
                <span style="font-size: 9.5px; color: #64748B;">
                    ${household.vulnerable_count > 0 ? `<strong style="color: #DC2626;">${household.vulnerable_count} Rentan</strong>` : 'Semua Sehat'}
                </span>
            </div>

            <div style="max-height: 145px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; padding-right: 2px;">
                ${household.members
                    .map((m) => {
                        const vBadge = formatVulnerabilityBadge(m);
                        const isHead = m.role === 'Kepala Keluarga' || m.is_head;
                        return `
                    <div style="background: ${m.is_vulnerable ? '#FFF1F2' : '#F8FAFC'}; border: 1px solid ${m.is_vulnerable ? '#FECDD3' : '#E2E8F0'}; border-radius: 7px; padding: 5px 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 4px;">
                            <div>
                                <div style="font-weight: 800; font-size: 11px; color: ${m.is_vulnerable ? '#9F1239' : '#0F172A'};">
                                    ${m.name}
                                </div>
                                <div style="font-size: 9.5px; color: #64748B; margin-top: 1px;">
                                    ${isHead ? '<strong style="color: #1F6F5F;">Kepala Keluarga</strong>' : 'Anggota'}
                                    ${m.occupation ? ` &middot; ${m.occupation}` : ''}
                                    ${m.gender ? ` &middot; ${m.gender}` : ''}
                                </div>
                            </div>
                            <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${vBadge.bg}; color: ${vBadge.text}; border: 1px solid ${vBadge.border}; white-space: nowrap;">
                                ${vBadge.label}
                            </span>
                        </div>
                        ${m.comorbidity_notes ? `
                            <div style="font-size: 9.5px; color: #BE123C; background: rgba(255,255,255,0.7); border-radius: 4px; padding: 2px 6px; margin-top: 4px; border-left: 2px solid #E11D48;">
                                <strong>Catatan Medis:</strong> ${m.comorbidity_notes}
                            </div>
                        ` : ''}
                    </div>
                `;
                    })
                    .join('')}
            </div>
        </div>
        `
            : '';

    const whatsappBtn = household.whatsapp_link
        ? `
        <a href="${household.whatsapp_link}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: #15803D; hover:background: #166534; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 11px; padding: 7px 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(21,128,61,0.25); margin-top: 8px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Hubungi WhatsApp (${household.whatsapp_number ?? '-'})</span>
        </a>
        `
        : '';

    return `
        <div style="font-family: 'Figtree', sans-serif; font-size: 11.5px; min-width: 275px; max-width: 320px; max-height: 420px; overflow-y: auto; line-height: 1.35; color: #1E293B; padding-right: 2px;">
            <!-- Header Kartu -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="font-weight: 800; color: ${accentColor}; font-size: 11.5px; display: flex; align-items: center; gap: 4px;">
                    <span>🏠 Kediaman Warga</span>
                </div>
                ${statusBadge}
            </div>

            <!-- Nama Keluarga & No KK -->
            <div style="margin-bottom: 6px;">
                <div style="font-size: 14px; font-weight: 800; color: #0F172A; line-height: 1.25;">
                    ${household.name}
                </div>
                <div style="font-size: 10px; color: #64748B; margin-top: 2px; display: flex; align-items: center; gap: 6px;">
                    ${household.no_kk ? `<span>No. KK: <strong style="color: #334155;">${household.no_kk}</strong></span> &middot; ` : ''}
                    <span>Total: <strong style="color: #0F172A;">${household.total_members} Jiwa</strong></span>
                </div>
            </div>

            <!-- Alamat & Koordinat -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 9px; margin-bottom: 6px; font-size: 10.5px;">
                <div style="color: #334155; line-height: 1.35;">
                    📍 ${household.home_address || 'Alamat tempat tinggal belum terdata'}
                </div>
                <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 9.5px; color: #64748B; margin-top: 4px; padding-top: 4px; border-top: 1px dashed #CBD5E1;">
                    <span>Lat: ${household.latitude.toFixed(5)}°</span>
                    <span>Lng: ${household.longitude.toFixed(5)}°</span>
                </div>
            </div>

            <!-- Daftar Anggota & Kerentanan -->
            ${membersListHtml}

            <!-- Saran Evakuasi Khusus Admin jika Rentan -->
            ${isVulnerable ? `
                <div style="background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 6px; padding: 5px 8px; font-size: 9.5px; color: #991B1B; line-height: 1.3; margin-top: 6px;">
                    <strong>Instruksi Posko:</strong> Rumah ini memiliki penghuni rentan (${household.vulnerable_count} jiwa). Prioritaskan evakuasi ke Posko Shelter Oksigen bila jarak titik api < 10 km.
                </div>
            ` : ''}

            <!-- Tombol Aksi Kontak Cepat -->
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

