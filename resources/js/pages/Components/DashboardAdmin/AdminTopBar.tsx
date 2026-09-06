import { Menu } from '@/pages/Components/Dashboard/Icons';

interface AdminTopBarProps {
    onOpenMobile: () => void;
    title: string;
}

export default function AdminTopBar({ onOpenMobile, title }: AdminTopBarProps) {
    return (
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-[#EEEEEE] lg:hidden">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenMobile}
                    className="p-2 -ml-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none cursor-pointer"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="font-display text-lg font-bold text-[#1F6F5F] truncate">
                    {title}
                </span>
            </div>
        </header>
    );
}

