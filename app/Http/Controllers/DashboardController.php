<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
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

        return Inertia::render('Dashboard', [
            'familyMembers' => $familyMembers,
            'isHeadOfFamily' => $user?->role === UserRole::KepalaKeluarga,
            'hasCompletedFamilyDocs' => count($familyMembers) > 1,
        ]);
    }
}
