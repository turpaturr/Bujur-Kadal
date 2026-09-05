<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\CheckupReservation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the main user dashboard with family members and health profiles.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $familyMembers = [];
        if ($user && $user->family_id) {
            $familyMembers = User::with('healthProfile')
                ->where('family_id', $user->family_id)
                ->orderByRaw("CASE WHEN role = 'kepala_keluarga' THEN 1 WHEN role = 'anggota' THEN 2 ELSE 3 END")
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'nik_masked' => $member->nik_masked ?? (strlen((string) $member->nik) === 64 ? '6472••••••••'.substr((string) $member->id, -4) : $member->nik),
                        'role' => $member->role->value,
                        'birth_date' => $member->birth_date?->format('Y-m-d'),
                        'gender' => $member->gender,
                        'occupation' => $member->occupation,
                        'is_head' => $member->role === UserRole::KepalaKeluarga,
                        'health_profile' => $member->healthProfile ? [
                            'is_vulnerable' => (bool) $member->healthProfile->is_vulnerable,
                            'vulnerability_category' => $member->healthProfile->vulnerability_category ?? ($member->healthProfile->is_vulnerable ? 'penyakit_bawaan' : 'tidak_rentan'),
                            'comorbidity_notes' => $member->healthProfile->comorbidity_notes,
                        ] : null,
                    ];
                });
        }

        $userReservations = [];
        if ($user) {
            $userReservations = CheckupReservation::where(function ($q) use ($user) {
                $q->where('user_id', $user->id);
                if ($user->family_id) {
                    $q->orWhere('family_id', $user->family_id);
                }
            })
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($r) {
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
                        'created_at_raw' => $r->created_at?->toISOString(),
                    ];
                });
        }

        return Inertia::render('Dashboard', [
            'familyMembers' => $familyMembers,
            'isHeadOfFamily' => $user?->role === UserRole::KepalaKeluarga,
            'hasCompletedFamilyDocs' => count($familyMembers) > 1,
            'userReservations' => $userReservations,
        ]);
    }
}
