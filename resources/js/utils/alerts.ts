import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/**
 * Custom styled Swal instance conforming to BorneoCare UI design system.
 */
export const AppSwal = Swal.mixin({
    confirmButtonColor: '#1F6F5F',
    cancelButtonColor: '#E5E7EB',
    customClass: {
        popup: 'font-sans rounded-2xl p-6 shadow-2xl border border-gray-100',
        title: 'font-display text-xl font-bold text-[#1F6F5F]',
        htmlContainer: 'text-sm text-[#262626]/80',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-sm bg-[#1F6F5F] hover:bg-[#2FA084] text-white shadow-xs cursor-pointer',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-xs cursor-pointer',
    },
    buttonsStyling: true,
});

/**
 * Real-time Toast notification popup for live WebSocket events.
 */
export const ToastSwal = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    customClass: {
        popup: 'font-sans rounded-2xl p-4 shadow-xl border border-gray-100 bg-white/95 backdrop-blur-md',
        title: 'font-display text-sm font-bold text-[#1F6F5F]',
        htmlContainer: 'text-xs text-[#262626]/80 mt-0.5',
    },
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

/**
 * 1. Dipanggil saat user warga berhasil mengirimkan permohonan reservasi ke pihak admin.
 */
export const showReservationSubmittedAlert = () => {
    return AppSwal.fire({
        icon: 'success',
        title: 'Pengajuan Berhasil Terkirim!',
        text: 'tunggu yak! ajukan anda telah terkirim dan lagi diproses.',
        confirmButtonText: 'Oke, Mengerti',
    });
};

/**
 * 2. Dipanggil di sisi user saat faskes/admin selesai memproses (menyetujui atau menolak).
 */
export const showReservationNotificationAlert = (clinicName?: string) => {
    return ToastSwal.fire({
        icon: 'info',
        title: 'hey! ada notif tuh!',
        text: clinicName
            ? `Status reservasi di ${clinicName} telah diperbarui.`
            : 'Pihak faskes telah memperbarui status permohonan reservasi Anda.',
        didOpen: (toast) => {
            toast.style.cursor = 'pointer';
            toast.onclick = () => {
                window.location.href = '/reservations';
            };
        },
    });
};

/**
 * 3. Dipanggil di sisi admin/faskes saat ada ajuan baru dari warga masuk via Reverb.
 */
export const showAdminNewReservationAlert = (patientName?: string, clinicName?: string) => {
    return ToastSwal.fire({
        icon: 'info',
        title: 'hey! seorang warga telah mengirimkan ajuan tuh',
        text: patientName
            ? `Pengajuan jadwal baru dari ${patientName}${clinicName ? ` (${clinicName})` : ''}`
            : 'Ada pengajuan jadwal medical checkup baru yang perlu ditinjau.',
    });
};

/**
 * 4. Dipanggil di sisi admin/faskes saat ajuan telah berhasil disetujui atau ditolak.
 */
export const showAdminResponseSentAlert = () => {
    return AppSwal.fire({
        icon: 'success',
        title: 'Terkirim!',
        text: 'respon mu telah terkirim ke user!',
        confirmButtonText: 'Sip',
        timer: 3000,
        timerProgressBar: true,
    });
};
