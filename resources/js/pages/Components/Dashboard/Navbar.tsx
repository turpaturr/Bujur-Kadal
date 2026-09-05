import { Link, usePage } from '@inertiajs/react';

interface NavbarProps {
    onReset?: () => void;
    lastUpdated?: Date | null;
}

export default function Navbar({ onReset, lastUpdated }: NavbarProps) {
    const { auth } = usePage<{
        auth?: {
            user?: { name?: string; nik?: string; role?: string };
            isAdmin?: boolean;
        };
    }>().props;
    const isAdmin = Boolean(auth?.isAdmin || auth?.user?.role === 'admin');

    return (
        <header className="sticky top-0 z-40 border-b border-[#EEEEEE] bg-white/95 shadow-xs backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo & Brand */}
                <Link
                    href="/"
                    className="group flex items-center gap-3 transition-opacity hover:opacity-95"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2FA084] font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                        <svg
                            className="h-5 w-5"
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
                            <span className="font-display text-xl font-bold tracking-tight text-[#1F6F5F]">
                                Borneo
                                <span className="text-[#2FA084]">Care</span>
                            </span>
                            <span className="rounded border border-[#2FA084]/20 bg-[#2FA084]/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[#1F6F5F] uppercase">
                                Live
                            </span>
                        </div>
                        <span className="hidden text-[11px] leading-none text-[#262626]/70 sm:block">
                            Sistem Monitoring Karhutla & Satelit Borneo
                        </span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5">
                    <Link
                        href="/"
                        className="hidden items-center rounded-lg border border-[#EEEEEE] px-3 py-1.5 text-xs font-semibold text-[#1F6F5F] transition-colors hover:bg-[#EEEEEE] md:inline-flex"
                    >
                        Beranda
                    </Link>

                    <div className="hidden items-center gap-1.5 rounded-full border border-[#EEEEEE] bg-[#EEEEEE]/80 px-3 py-1 text-xs font-medium text-[#1F6F5F] sm:inline-flex">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6FCF97] opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2FA084]"></span>
                        </span>
                        <span>NASA FIRMS Satelit</span>
                    </div>

                    {lastUpdated && (
                        <span className="hidden text-[11px] text-[#262626]/60 lg:inline-block">
                            Sinkron:{' '}
                            {lastUpdated.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    )}

                    {onReset && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#2FA084]/30 px-3 py-1.5 text-xs font-semibold text-[#1F6F5F] transition-colors hover:bg-[#2FA084]/10"
                        >
                            <svg
                                className="h-3.5 w-3.5 text-[#2FA084]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            <span>Reset Peta</span>
                        </button>
                    )}

                    {/* User profile & Logout */}
                    {auth?.user && (
                        <div className="flex items-center gap-2 border-l border-[#EEEEEE] pl-2">
                            <div className="hidden items-center gap-1.5 lg:flex">
                                <span className="max-w-[130px] truncate text-xs font-bold text-[#1F6F5F]">
                                    {auth.user.name}
                                </span>
                                {isAdmin ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1F6F5F] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-2xs">
                                        <span className="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />
                                        Satgas Admin
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-[#EEEEEE] px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                                        Warga
                                    </span>
                                )}
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                                title="Keluar dari akun"
                            >
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
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
