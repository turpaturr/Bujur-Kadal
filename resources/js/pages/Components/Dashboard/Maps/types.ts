import type {
    ConfidenceLevel,
    WildfireHotspot,
} from '@/hooks/useWildfireData';
import type { UserLocation, UserSafetyAnalysis } from '@/utils/geoSafety';

export interface RegisteredFamilyMember {
    id: number;
    name: string;
    role: string;
    is_head?: boolean;
    gender?: string | null;
    birth_date?: string | null;
    occupation?: string | null;
    nik_masked?: string | null;
    is_vulnerable: boolean;
    vulnerability_category?: string | null;
    comorbidity_notes?: string | null;
}

export interface RegisteredUserLocation {
    id: number;
    family_id?: number | null;
    name: string;
    head_name?: string | null;
    no_kk?: string | null;
    whatsapp_number?: string | null;
    whatsapp_link?: string | null;
    home_address?: string | null;
    latitude: number;
    longitude: number;
    is_vulnerable: boolean;
    total_members: number;
    vulnerable_count: number;
    members?: RegisteredFamilyMember[];
}

export interface MapsProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    apiKey?: string;
    wildfireHotspots?: WildfireHotspot[];
    selectedHotspot?: WildfireHotspot | null;
    onHotspotSelect?: (hotspot: WildfireHotspot | null) => void;
    userLocation?: UserLocation | null;
    userSafety?: UserSafetyAnalysis | null;
    onFocusHome?: () => void;
    // Filter Provinsi (Multi-Select)
    selectedProvinces?: string[];
    onToggleProvince?: (provinceName: string) => void;
    // Filter Level Confidence (Multi-Select)
    selectedConfidenceLevels?: ConfidenceLevel[];
    onToggleConfidenceLevel?: (level: ConfidenceLevel) => void;
    // Toggle Layer Rumah Warga Pribadi
    showUserHome?: boolean;
    onToggleUserHome?: () => void;
    // Reset Filter
    onResetFilters?: () => void;
    // Data & Pengaturan Lokasi Warga Terdaftar (Khusus Admin / Komando)
    registeredUsers?: RegisteredUserLocation[];
    selectedUserLocation?: RegisteredUserLocation | null;
    onSelectUserLocation?: (user: RegisteredUserLocation | null) => void;
    showRegisteredUsers?: boolean;
    onToggleRegisteredUsers?: () => void;
}

