export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[#CCECEE] bg-white py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#262626]/70">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[#095D7E]">BorneoCare</span>
                    <span>&bull;</span>
                    <span>Monitoring Konservasi Hutan Kalimantan</span>
                </div>
                <div className="text-[#262626]/60 text-[11px]">
                    Didukung data satelit NASA EOSDIS, GIBS & FIRMS
                </div>
            </div>
        </footer>
    );
}
