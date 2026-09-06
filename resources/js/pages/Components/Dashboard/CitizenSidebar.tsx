import { Link, usePage } from '@inertiajs/react';
import {
    MapPin,
    Mailbox,
    Users,
    LogOut,
    X,
    RefreshCw
} from '@/pages/Components/Dashboard/Icons';

interface CitizenSidebarProps {
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    userName: string;
    inboxCount: number;
    onOpenInbox?: () => void;
    onResetMap: () => void;
}

export default function CitizenSidebar({
    isMobileOpen,
    onCloseMobile,
    userName,
    inboxCount = 0,
    onOpenInbox,
    onResetMap
}: CitizenSidebarProps) {
    const currentUrl = usePage().url;
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
                        BorneoCare <span className="text-sm font-normal text-emerald-500">Warga</span>
                    </span>
                    <button
                        onClick={onCloseMobile}
                        className="lg:hidden text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4 border-b border-[#EEEEEE] bg-emerald-50/50">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pengguna Terdaftar</p>
                    <p className="font-bold text-[#1F6F5F] text-sm leading-tight truncate">{userName}</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        <li>
                            <Link href="/dashboard" onClick={onCloseMobile} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentUrl === '/dashboard' ? 'bg-[#1F6F5F] text-white' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-white" />
                                    <span>Beranda Pantauan</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/reservations" onClick={onCloseMobile} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentUrl === '/reservations' ? 'bg-[#1F6F5F] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} cursor-pointer`}>
                                <div className="flex items-center gap-3">
                                    <Mailbox className="w-5 h-5 text-gray-400" />
                                    <span>Kotak Masuk Faskes</span>
                                </div>
                                {inboxCount > 0 && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                                        {inboxCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link href="/family" onClick={onCloseMobile} className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentUrl === '/family' ? 'bg-[#1F6F5F] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} cursor-pointer`}>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <span>Anggota Keluarga</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    onResetMap();
                                    onCloseMobile();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer mt-4 border border-gray-200"
                            >
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="w-5 h-5 text-gray-400" />
                                    <span>Reset Filter Peta</span>
                                </div>
                            </button>
                        </li>
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

