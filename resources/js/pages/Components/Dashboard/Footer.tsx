export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[#EEEEEE] bg-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#262626]/70">
                <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-[#1F6F5F]">
                        Borneo<span className="text-[#2FA084]">Care</span>
                    </span>
                    <span>&bull;</span>
                    <span>Platform Spasial Konservasi & Karhutla Kalimantan</span>
                </div>
                <div className="text-[#262626]/60 text-[11px] flex items-center gap-2">
                    <span>Didukung Citra Satelit NASA EOSDIS, GIBS & FIRMS NRT</span>
                </div>
            </div>
        </footer>
    );
}
