import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getEcho } from '@/echo';
import { showReservationNotificationAlert } from '@/utils/alerts';
import {
    CitizenSidebar,
    UserReservationInboxModal,
    type UserReservationItem,
} from '@/pages/Components/Dashboard';
import { AdminTopBar } from '@/pages/Components/DashboardAdmin';

interface PageProps {
    auth?: { user?: { id?: number; name?: string } | null };
    userReservations?: UserReservationItem[];
    unreadReservationsCount?: number;
    [key: string]: unknown;
}

export default function Reservations() {
    const { auth, userReservations = [], unreadReservationsCount = 0 } = usePage<PageProps>().props;
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [localReservations, setLocalReservations] = useState(userReservations);

    useEffect(() => {
        setLocalReservations(userReservations);
        if (unreadReservationsCount > 0) {
            router.post('/checkup-reservations/mark-as-read', {}, { preserveScroll: true, preserveState: true });
        }
    }, [userReservations, unreadReservationsCount]);

    useEffect(() => {
        const userId = auth?.user?.id;
        if (!userId) return;

        const echo = getEcho();
        let channel: any = null;

        if (echo) {
            channel = echo.channel(`user-reservations.${userId}`);
            channel.listen(
                '.reservation.updated',
                (data: { reservation: { id: number; status: string; admin_notes?: string } }) => {
                    if (data?.reservation) {
                        setLocalReservations((prev) =>
                            prev.map((r) =>
                                r.id === data.reservation.id
                                    ? {
                                          ...r,
                                          status: data.reservation.status,
                                          admin_notes: data.reservation.admin_notes ?? r.admin_notes,
                                          is_read: false,
                                      }
                                    : r,
                            ),
                        );
                        showReservationNotificationAlert();
                    }
                },
            );
        }

        return () => {
            if (channel && echo) {
                echo.leaveChannel(`user-reservations.${userId}`);
            }
        };
    }, [auth?.user?.id]);

    return (
        <>
            <Head title="Kotak Masuk Faskes - BorneoCare" />
            <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                <CitizenSidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                    userName={auth?.user?.name ?? 'Warga'}
                    inboxCount={unreadReservationsCount}
                    onResetMap={() => undefined}
                />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <AdminTopBar onOpenMobile={() => setIsMobileSidebarOpen(true)} title="Kotak Masuk Faskes" />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl space-y-6">
                            <UserReservationInboxModal
                                isOpen
                                mode="page"
                                onClose={() => router.visit('/dashboard')}
                                reservations={localReservations}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
