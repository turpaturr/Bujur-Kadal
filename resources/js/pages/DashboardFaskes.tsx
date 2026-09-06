import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { getEcho } from '@/echo';
import { CheckupReservationsView, type AdminReservationItem, AdminTopBar } from '@/pages/Components/DashboardAdmin';
import FaskesSidebar from '@/pages/Components/DashboardFaskes/FaskesSidebar';
import { HeartPulse, LogOut, X, Menu } from '@/pages/Components/Dashboard/Icons';
import { showAdminNewReservationAlert } from '@/utils/alerts';

interface DashboardFaskesProps {
    faskesName?: string;
    reservations?: AdminReservationItem[];
    pendingReservationsCount?: number;
}

export default function DashboardFaskes({
    faskesName = "Fasilitas Kesehatan",
    reservations = [],
    pendingReservationsCount = 0,
}: DashboardFaskesProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
    // State Real-Time Reservasi
    const [localReservations, setLocalReservations] = useState<AdminReservationItem[]>(reservations);
    const [localPendingCount, setLocalPendingCount] = useState<number>(pendingReservationsCount);

    useEffect(() => {
        setLocalReservations(reservations);
        setLocalPendingCount(pendingReservationsCount);
    }, [reservations, pendingReservationsCount]);

    // Reverb WebSocket Listener & Polling Fallback
    useEffect(() => {
        const echo = getEcho();
        let channel: any = null;

        if (echo) {
            // Sebaiknya channel ini nantinya dipisah per faskes, tapi untuk sekarang kita gunakan global admin-reservations
            channel = echo.channel('admin-reservations');
            channel.listen('.reservation.created', (data: { reservation: AdminReservationItem }) => {
                if (data?.reservation) {
                    setLocalReservations((prev) => [data.reservation, ...prev.filter((r) => r.id !== data.reservation.id)]);
                    setLocalPendingCount((prev) => prev + 1);
                    showAdminNewReservationAlert(data.reservation.patient_name, data.reservation.clinic_name);
                }
            });
            channel.listen('.reservation.updated', (data: { reservation: { id: number; status: string; admin_notes?: string } }) => {
                if (data?.reservation) {
                    setLocalReservations((prev) =>
                        prev.map((r) =>
                            r.id === data.reservation.id
                                ? { ...r, status: data.reservation.status, admin_notes: data.reservation.admin_notes ?? r.admin_notes }
                                : r,
                        ),
                    );
                    router.reload({ only: ['pendingReservationsCount', 'reservations'] });
                }
            });
        }

        const interval = setInterval(() => {
            router.reload({ only: ['reservations', 'pendingReservationsCount'] });
        }, 8000);

        return () => {
            clearInterval(interval);
            if (channel && echo) {
                echo.leaveChannel('admin-reservations');
            }
        };
    }, []);

    const [activeMenu, setActiveMenu] = useState<'triage'>('triage');

    return (
        <>
            <Head title={`Dashboard ${faskesName} - BorneoCare`} />

            <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                <FaskesSidebar
                    activeMenu={activeMenu}
                    onMenuChange={setActiveMenu}
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                    faskesName={faskesName}
                    pendingReservationsCount={localPendingCount}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminTopBar
                        onOpenMobile={() => setIsMobileSidebarOpen(true)}
                        title="Triage Faskes"
                    />

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                        <CheckupReservationsView reservations={localReservations} />
                    </main>
                </div>
            </div>
        </>
    );
}

