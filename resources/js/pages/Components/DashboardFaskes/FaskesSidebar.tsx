import { Link } from '@inertiajs/react';
import { 
    HeartPulse, 
    LogOut, 
    X 
} from '@/pages/Components/Dashboard/Icons';

export type FaskesMenuType = 'triage';

interface FaskesSidebarProps {
    activeMenu: FaskesMenuType;
    onMenuChange: (menu: FaskesMenuType) => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    faskesName: string;
    pendingReservationsCount?: number;
}

export default function FaskesSidebar({
    activeMenu,
    onMenuChange,
    isMobileOpen,
    onCloseMobile,
    faskesName,
    pendingReservationsCount = 0,
}: FaskesSidebarProps) {
    const navItems = [
        { id: 'triage', label: 'Reservasi & Triage', icon: HeartPulse, badge: pendingReservationsCount },
    ] as const;

    const baseClasses = "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-[#EEEEEE] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0";
    const mobileClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";

    return (
        <>
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                    onClick={onCloseMobile}
                />
            )}

            <aside className={`${baseClasses} ${mobileClasses} flex flex-col h-full`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-[#EEEEEE]">
                    <span className="font-display text-xl font-bold text-[#1F6F5F]">
                        BorneoCare <span className="text-sm font-normal text-amber-500">Faskes</span>
                    </span>
                    <button 
                        onClick={onCloseMobile}
                        className="lg:hidden text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4 border-b border-[#EEEEEE] bg-amber-50/50">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Lokasi Anda</p>
                    <p className="font-bold text-amber-800 text-sm leading-tight">{faskesName}</p>
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
                                            onMenuChange(item.id as FaskesMenuType);
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
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </Link>
                </div>
            </aside>
        </>
    );
}

