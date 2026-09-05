import { Link, usePage } from "@inertiajs/react";

interface NavbarProps {
    onReset?: () => void;
}

export default function Navbar({ onReset }: NavbarProps) {
    const { auth } = usePage<{ auth?: { user?: { name?: string; nik?: string } } }>().props;

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#CCECEE] shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo & Brand (Click to Landing Page) */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="w-9 h-9 rounded-xl bg-[#14967F] flex items-center justify-center text-white shadow-xs font-bold">
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
                        <span className="font-display text-lg font-bold text-[#095D7E] tracking-tight">
                            Borneo<span className="text-[#14967F]">Care</span>
                        </span>
                        <span className="hidden sm:block text-[11px] text-[#262626]/70 leading-none">
                            Monitoring Hutan & Titik Panas
                        </span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5">
                    <Link
                        href="/"
                        className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-[#095D7E] hover:bg-[#CCECEE]/40 border border-[#095D7E]/20 transition-colors"
                    >
                        Beranda
                    </Link>

                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#CCECEE]/60 text-[#095D7E] border border-[#095D7E]/20">
                        <span className="w-2 h-2 rounded-full bg-[#14967F] animate-pulse" />
                        Live Satelit
                    </span>

                    {onReset && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#095D7E] hover:bg-[#CCECEE]/40 border border-[#095D7E]/20 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Peta
                        </button>
                    )}

                    {/* User profile & Logout */}
                    {auth?.user && (
                        <div className="flex items-center gap-2 pl-2 border-l border-[#CCECEE]">
                            <span className="hidden lg:block text-xs font-bold text-[#095D7E] max-w-[120px] truncate">
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
