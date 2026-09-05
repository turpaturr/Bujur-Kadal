<?php

namespace App\Http\Controllers;

use App\Enums\SosStatus;
use App\Enums\UserRole;
use App\Models\Family;
use App\Models\SafeZone;
use App\Models\SosRequest;
use App\Models\User;
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

        return Inertia::render('DashboardAdmin', [
            'adminStats' => $adminStats,
            'registeredUsers' => $registeredUsers,
        ]);
    }
}
