import { Link, usePage } from '@inertiajs/react';

interface NavbarProps {
    onReset?: () => void;
    lastUpdated?: Date | null;
    onOpenInbox?: () => void;
    inboxCount?: number;
}

export default function Navbar({
    onReset,
    lastUpdated,
    onOpenInbox,
    inboxCount = 0,
}: NavbarProps) {
    const { auth } = usePage<{ auth?: { user?: { name?: string; nik?: string } } }>().props;

    return (
        <header className="sticky top-0 z-[9999] bg-white/95 backdrop-blur-md border-b border-[#EEEEEE] shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity group">
                    <div className="w-10 h-10 rounded-xl bg-[#2FA084] flex items-center justify-center text-white shadow-sm font-bold transition-transform group-hover:scale-105">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-display text-xl font-bold text-[#1F6F5F] tracking-tight">
                                Borneo<span className="text-[#2FA084]">Care</span>
                            </span>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#2FA084]/10 text-[#1F6F5F] rounded border border-[#2FA084]/20">
                                Live
                            </span>
                        </div>
                        <span className="hidden sm:block text-[11px] text-[#262626]/70 leading-none">
                            Sistem Monitoring Karhutla & Satelit Borneo
                        </span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5">
                    <Link
                        href="/"
                        className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1F6F5F] hover:bg-[#EEEEEE] border border-[#EEEEEE] transition-colors"
                    >
                        Beranda
                    </Link>

                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EEEEEE]/80 text-[#1F6F5F] border border-[#EEEEEE]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6FCF97] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2FA084]"></span>
                        </span>
                        <span>NASA FIRMS Satelit</span>
                    </div>

                    {lastUpdated && (
                        <span className="hidden lg:inline-block text-[11px] text-[#262626]/60">
                            Sinkron: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}

                    {onReset && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1F6F5F] hover:bg-[#2FA084]/10 border border-[#2FA084]/30 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5 text-[#2FA084]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Reset Peta</span>
                        </button>
                    )}

                    {/* Tombol Lonceng / Kotak Masuk Notifikasi Reservasi */}
                    {onOpenInbox && (
                        <button
                            type="button"
                            onClick={onOpenInbox}
                            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F6F5F] hover:bg-[#2FA084]/15 border border-[#2FA084]/30 bg-[#2FA084]/10 transition-all cursor-pointer shadow-2xs"
                            title="Buka Kotak Masuk Notifikasi Reservasi Medical Checkup"
                        >
                            <svg className="w-4 h-4 text-[#1F6F5F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="hidden sm:inline">Inbox Faskes</span>
                            {inboxCount > 0 && (
                                <span className="flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                                    {inboxCount}
                                </span>
                            )}
                        </button>
                    )}

                    {/* User profile & Logout */}
                    {auth?.user && (
                        <div className="flex items-center gap-2 pl-2 border-l border-[#EEEEEE]">
                            <span className="hidden lg:block text-xs font-bold text-[#1F6F5F] max-w-[120px] truncate">
                                {auth.user.name}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                                title="Keluar dari akun"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Keluar</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
