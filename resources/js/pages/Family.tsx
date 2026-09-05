import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    CitizenSidebar,
    FamilyMemberModal,
    FamilyMemberTable,
    type FamilyMemberItem,
} from '@/pages/Components/Dashboard';
import { AdminTopBar } from '@/pages/Components/DashboardAdmin';

interface PageProps {
    auth?: { user?: { name?: string } | null };
    familyMembers?: FamilyMemberItem[];
    isHeadOfFamily?: boolean;
    [key: string]: unknown;
}

export default function Family() {
    const { auth, familyMembers = [], isHeadOfFamily = false } = usePage<PageProps>().props;
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMemberItem | null>(null);

    const openAddMember = () => {
        setEditingMember(null);
        setIsAddMemberOpen(true);
    };

    return (
        <>
            <Head title="Anggota Keluarga - BorneoCare" />
            <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-[#262626] antialiased">
                <CitizenSidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                    userName={auth?.user?.name ?? 'Warga'}
                    inboxCount={0}
                    onResetMap={() => undefined}
                />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <AdminTopBar onOpenMobile={() => setIsMobileSidebarOpen(true)} title="Status Anggota Keluarga" />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl space-y-6">
                            <div className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-xs">
                                <p className="text-xs font-bold uppercase tracking-wider text-[#2FA084]">Perlindungan Keluarga</p>
                                <h1 className="mt-1 font-display text-2xl font-bold text-[#1F6F5F]">Status Anggota Keluarga & Protokol Mitigasi ISPA</h1>
                                <p className="mt-1 max-w-3xl text-sm text-[#262626]/70">Kelola profil kerentanan, indikator bahaya medis, dan panduan taktis perlindungan terhadap kabut asap Karhutla.</p>
                            </div>
                            <section className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-xs">
                                <FamilyMemberTable
                                    members={familyMembers}
                                    isHeadOfFamily={isHeadOfFamily}
                                    onOpenAddModal={openAddMember}
                                    onOpenEditModal={(member) => {
                                        setEditingMember(member);
                                        setIsAddMemberOpen(true);
                                    }}
                                />
                            </section>
                        </div>
                    </main>
                </div>
                <FamilyMemberModal
                    isOpen={isAddMemberOpen}
                    onClose={() => setIsAddMemberOpen(false)}
                    editingMember={editingMember}
                />
            </div>
        </>
    );
}
