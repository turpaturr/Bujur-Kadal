import { Link } from '@inertiajs/react';
import { 
    MapPin, 
    List, 
    HeartPulse, 
    Building, 
    LogOut, 
    X 
} from '@/pages/Components/Dashboard/Icons';

export type AdminMenuType = 'maps' | 'citizens' | 'triage' | 'facilities';

interface AdminSidebarProps {
    activeMenu: AdminMenuType;
    onMenuChange: (menu: AdminMenuType) => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    pendingReservationsCount?: number;
}

export default function AdminSidebar({
    activeMenu,
    onMenuChange,
    isMobileOpen,
    onCloseMobile,
    pendingReservationsCount = 0,
}: AdminSidebarProps) {
    const navItems = [
        { id: 'maps', label: 'Monitoring Spasial', icon: MapPin },
        { id: 'citizens', label: 'Daftar Warga & Keluarga', icon: List },
        { id: 'triage', label: 'Reservasi Checkup Faskes', icon: HeartPulse, badge: pendingReservationsCount },
        { id: 'facilities', label: 'Manajemen Faskes', icon: Building },
    ] as const;

    const baseClasses = "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-[#EEEEEE] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0";
    const mobileClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                    onClick={onCloseMobile}
                />
            )}

            <aside className={`${baseClasses} ${mobileClasses} flex flex-col h-full`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-[#EEEEEE]">
                    <span className="font-display text-xl font-bold text-[#1F6F5F]">
                        BorneoCare <span className="text-sm font-normal text-gray-500">Admin</span>
                    </span>
                    <button 
                        onClick={onCloseMobile}
                        className="lg:hidden text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeMenu === item.id;
                            const hasBadge = 'badge' in item && Boolean(item.badge && item.badge > 0);
                            
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            onMenuChange(item.id);
                                            onCloseMobile();
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                            isActive 
                                                ? 'bg-[#1F6F5F] text-white' 
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                            <span>{item.label}</span>
                                        </div>
                                        {hasBadge && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                isActive ? 'bg-white text-[#1F6F5F]' : 'bg-amber-500 text-white animate-pulse'
                                            }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-[#EEEEEE]">
                    <Link
                        href="/admin/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </Link>
                </div>
            </aside>
        </>
    );
}

