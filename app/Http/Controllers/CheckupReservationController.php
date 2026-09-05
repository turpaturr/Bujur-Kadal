<?php

namespace App\Http\Controllers;

use App\Events\CheckupReservationCreated;
use App\Models\CheckupReservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CheckupReservationController extends Controller
{
    /**
     * Menyimpan permohonan reservasi jadwal medical checkup baru dari pengguna.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'clinic_id' => ['required', 'string'],
            'clinic_name' => ['required', 'string', 'max:255'],
            'clinic_address' => ['nullable', 'string', 'max:500'],
            'patient_name' => ['required', 'string', 'max:255'],
            'patient_role' => ['nullable', 'string', 'max:100'],
            'checkup_date' => ['required', 'date', 'after_or_equal:today'],
            'checkup_time' => ['required', 'string', 'max:20'],
            'symptoms' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();

        $reservation = CheckupReservation::create([
            'user_id' => $user->id,
            'family_id' => $user->family_id,
            'clinic_id' => $validated['clinic_id'],
            'clinic_name' => $validated['clinic_name'],
            'clinic_address' => $validated['clinic_address'] ?? null,
            'patient_name' => $validated['patient_name'],
            'patient_role' => $validated['patient_role'] ?? 'Kepala Keluarga',
            'checkup_date' => $validated['checkup_date'],
            'checkup_time' => $validated['checkup_time'],
            'symptoms' => $validated['symptoms'] ?? null,
            'status' => 'pending',
            'is_read' => true,
        ]);

        broadcast(new CheckupReservationCreated($reservation->load(['user.family'])))->toOthers();

        return back()->with('success', 'Permohonan reservasi jadwal pemeriksaan berhasil dikirim! Pihak faskes akan meninjau jadwal Anda.');
    }

    /**
     * Menandai seluruh notifikasi reservasi pengguna sebagai telah dibaca.
     */
    public function markAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();

        CheckupReservation::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back();
    }
}
