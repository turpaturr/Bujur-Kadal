<?php

namespace App\Http\Controllers;

use App\Enums\SosStatus;
use App\Enums\UserRole;
use App\Events\CheckupReservationStatusUpdated;
use App\Events\EvacuationMissionUpdated;
use App\Models\CheckupReservation;
use App\Models\EvacuationMission;
use App\Models\Family;
use App\Models\SafeZone;
use App\Models\SosRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardAdminController extends Controller
{
    /**
     * Display the main administrator command center dashboard.
     */
    public function index(Request $request): Response
    {
        $adminStats = [
            'totalUsers' => User::where('role', '!=', UserRole::Admin)->count(),
            'totalFamilies' => Family::count(),
            'activeSosCount' => SosRequest::whereIn('status', [SosStatus::Pending, SosStatus::Evacuating])->count(),
            'safeZonesCount' => SafeZone::count(),
        ];

        $usersWithLocation = User::with(['healthProfile', 'family'])
            ->where('role', '!=', UserRole::Admin)
            ->whereNotNull('home_latitude')
            ->whereNotNull('home_longitude')
            ->get();

        $groupedFamilies = $usersWithLocation->groupBy(function ($user) {
            return $user->family_id ?: 'u_'.$user->id;
        });

        $registeredUsers = [];

        foreach ($groupedFamilies as $groupId => $familyUsers) {
            $head = $familyUsers->firstWhere('role', UserRole::KepalaKeluarga) ?? $familyUsers->first();

            $members = $familyUsers->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'nik_masked' => $u->nik_masked ?? (strlen((string) $u->nik) === 64 ? '6472••••••••'.substr((string) $u->id, -4) : $u->nik),
                    'role' => $u->role === UserRole::KepalaKeluarga ? 'Kepala Keluarga' : 'Anggota Keluarga',
                    'is_head' => $u->role === UserRole::KepalaKeluarga,
                    'birth_date' => $u->birth_date?->format('Y-m-d'),
                    'gender' => $u->gender,
                    'occupation' => $u->occupation,
                    'is_vulnerable' => (bool) ($u->healthProfile?->is_vulnerable ?? false),
                    'vulnerability_category' => $u->healthProfile?->vulnerability_category ?? ($u->healthProfile?->is_vulnerable ? 'penyakit_bawaan' : 'tidak_rentan'),
                    'comorbidity_notes' => $u->healthProfile?->comorbidity_notes,
                ];
            });

            $isVulnerable = $members->contains('is_vulnerable', true);
            $vulnerableCount = $members->where('is_vulnerable', true)->count();

            $wa = $head->whatsapp_number;
            $waLink = null;
            if ($wa) {
                $cleanWa = preg_replace('/[^0-9]/', '', (string) $wa);
                if (str_starts_with($cleanWa, '0')) {
                    $cleanWa = '62'.substr($cleanWa, 1);
                }
                $waLink = "https://wa.me/{$cleanWa}";
            }

            $registeredUsers[] = [
                'id' => is_numeric($groupId) ? (int) $groupId : $head->id,
                'family_id' => $head->family_id,
                'no_kk' => $head->family?->no_kk,
                'name' => $head->family_id ? 'Keluarga '.$head->name : $head->name,
                'head_name' => $head->name,
                'whatsapp_number' => $wa,
                'whatsapp_link' => $waLink,
                'home_address' => $head->home_address,
                'latitude' => (float) $head->home_latitude,
                'longitude' => (float) $head->home_longitude,
                'is_vulnerable' => $isVulnerable,
                'total_members' => $members->count(),
                'vulnerable_count' => $vulnerableCount,
                'members' => $members->values()->toArray(),
            ];
        }

        if ($request->user()->role === UserRole::Faskes) {
            $query = CheckupReservation::with(['user.family', 'user.healthProfile'])
                ->where('clinic_name', $request->user()->name);

            $reservations = $query->orderByRaw("CASE WHEN status = 'pending' THEN 1 WHEN status = 'approved' THEN 2 ELSE 3 END")
                ->orderBy('checkup_date', 'asc')
                ->orderBy('checkup_time', 'asc')
                ->get()
                ->map(function ($r) {
                    $head = $r->user;
                    $cleanWa = preg_replace('/[^0-9]/', '', (string) ($head?->whatsapp_number ?? ''));
                    if (str_starts_with($cleanWa, '0')) {
                        $cleanWa = '62'.substr($cleanWa, 1);
                    }

                    return [
                        'id' => $r->id,
                        'clinic_id' => $r->clinic_id,
                        'clinic_name' => $r->clinic_name,
                        'clinic_address' => $r->clinic_address,
                        'patient_name' => $r->patient_name,
                        'patient_role' => $r->patient_role,
                        'checkup_date' => $r->checkup_date?->format('Y-m-d'),
                        'checkup_time' => $r->checkup_time,
                        'symptoms' => $r->symptoms,
                        'status' => $r->status,
                        'admin_notes' => $r->admin_notes,
                        'created_at' => $r->created_at?->diffForHumans(),
                        'user' => [
                            'id' => $head?->id,
                            'name' => $head?->name,
                            'no_kk' => $head?->family?->no_kk,
                            'home_address' => $head?->home_address,
                            'whatsapp_number' => $head?->whatsapp_number,
                            'whatsapp_link' => $cleanWa ? "https://wa.me/{$cleanWa}" : null,
                        ],
                    ];
                });

            $pendingReservationsCount = CheckupReservation::pending()
                ->where('clinic_name', $request->user()->name)
                ->count();

            return Inertia::render('DashboardFaskes', [
                'faskesName' => $request->user()->name,
                'reservations' => $reservations,
                'pendingReservationsCount' => $pendingReservationsCount,
            ]);
        }

        $evacuationMissions = EvacuationMission::orderBy('id', 'desc')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'user_id' => $m->user_id,
                'family_id' => $m->family_id,
                'family_name' => $m->family_name,
                'head_name' => $m->head_name,
                'whatsapp_number' => $m->whatsapp_number,
                'address' => $m->address,
                'latitude' => (float) $m->latitude,
                'longitude' => (float) $m->longitude,
                'vulnerable_members_count' => $m->vulnerable_members_count,
                'total_members_count' => $m->total_members_count,
                'safe_zone_name' => $m->safe_zone_name,
                'status' => $m->status,
                'status_notes' => $m->status_notes,
                'team_assigned_at' => $m->team_assigned_at?->format('H:i:s'),
                'in_transit_at' => $m->in_transit_at?->format('H:i:s'),
                'completed_at' => $m->completed_at?->format('H:i:s'),
                'updated_at' => $m->updated_at?->diffForHumans() ?? 'Baru saja',
            ]);

        return Inertia::render('DashboardAdmin', [
            'adminStats' => $adminStats,
            'registeredUsers' => $registeredUsers,
            'evacuationMissions' => $evacuationMissions,
        ]);
    }

    /**
     * Mengerahkan tim evakuasi penjemputan darurat untuk keluarga warga di zona bahaya.
     */
    public function storeEvacuation(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'safe_zone_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::with(['family', 'healthProfile'])->findOrFail($validated['user_id']);

        $familyUsers = $user->family_id
            ? User::where('family_id', $user->family_id)->with('healthProfile')->get()
            : collect([$user]);

        $vulnerableCount = $familyUsers->filter(fn ($u) => (bool) ($u->healthProfile?->is_vulnerable ?? false))->count();
        $totalMembers = $familyUsers->count();

        $mission = EvacuationMission::create([
            'user_id' => $user->id,
            'family_id' => $user->family_id,
            'family_name' => $user->family_id ? 'Keluarga '.$user->name : $user->name,
            'head_name' => $user->name,
            'whatsapp_number' => $user->whatsapp_number,
            'address' => $user->home_address,
            'latitude' => $user->home_latitude,
            'longitude' => $user->home_longitude,
            'vulnerable_members_count' => $vulnerableCount,
            'total_members_count' => $totalMembers,
            'safe_zone_name' => $validated['safe_zone_name'] ?? 'Posko Ruang Oksigen (Oxygen Shelter)',
            'status' => 'waiting_team',
            'status_notes' => 'Tim penjemputan darurat & ambulans evakuasi telah ditugaskan ke lokasi kediaman warga.',
            'team_assigned_at' => now(),
        ]);

        broadcast(new EvacuationMissionUpdated($mission));

        return back()->with('success', "Tim evakuasi penjemputan darurat berhasil dikerahkan untuk {$user->name}!");
    }

    /**
     * Memperbarui progress tahapan misi evakuasi (demo real-time timeline stepper).
     */
    public function progressEvacuation(EvacuationMission $mission, Request $request): RedirectResponse
    {
        $step = $request->input('status');

        if ($step === 'in_transit') {
            $mission->update([
                'status' => 'in_transit',
                'in_transit_at' => now(),
                'status_notes' => 'Armada evakuasi sedang melaju cepat di rute menuju rumah warga.',
            ]);
        } elseif ($step === 'completed') {
            $mission->update([
                'status' => 'completed',
                'completed_at' => now(),
                'status_notes' => 'Seluruh anggota keluarga telah dievakuasi & tiba dengan selamat di Posko Ruang Oksigen.',
            ]);
        }

        broadcast(new EvacuationMissionUpdated($mission));

        return back()->with('success', 'Status tahapan evakuasi berhasil diperbarui!');
    }

    /**
     * Menyetujui permohonan reservasi jadwal medical checkup faskes.
     */
    public function approveReservation(CheckupReservation $reservation, Request $request)
    {
        if ($request->user()->role !== UserRole::Faskes) {
            abort(403, 'Aksi ini hanya dapat diproses oleh akun Fasilitas Kesehatan (Faskes) yang berwenang.');
        }

        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:500'],
        ]);

        $reservation->update([
            'status' => 'approved',
            'is_read' => false,
            'admin_notes' => $validated['admin_notes'] ?? 'Jadwal telah dikonfirmasi oleh faskes. Silakan hadir 15 menit sebelum waktu pemeriksaan.',
            'handled_at' => now(),
        ]);

        broadcast(new CheckupReservationStatusUpdated($reservation));

        return back()->with('success', "Reservasi untuk {$reservation->patient_name} di {$reservation->clinic_name} berhasil disetujui.");
    }

    /**
     * Menolak permohonan reservasi jadwal medical checkup faskes.
     */
    public function rejectReservation(CheckupReservation $reservation, Request $request)
    {
        if ($request->user()->role !== UserRole::Faskes) {
            abort(403, 'Aksi ini hanya dapat diproses oleh akun Fasilitas Kesehatan (Faskes) yang berwenang.');
        }

        $validated = $request->validate([
            'admin_notes' => ['required', 'string', 'max:500'],
        ]);

        $reservation->update([
            'status' => 'rejected',
            'is_read' => false,
            'admin_notes' => $validated['admin_notes'],
            'handled_at' => now(),
        ]);

        broadcast(new CheckupReservationStatusUpdated($reservation));

        return back()->with('success', "Reservasi untuk {$reservation->patient_name} di {$reservation->clinic_name} telah ditolak.");
    }
}
