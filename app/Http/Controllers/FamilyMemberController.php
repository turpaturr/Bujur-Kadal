<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\AddFamilyMemberRequest;
use App\Models\HealthProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FamilyMemberController extends Controller
{
    /**
     * Store a newly added family member under the authenticated Kepala Keluarga's family.
     */
    public function store(AddFamilyMemberRequest $request): RedirectResponse
    {
        $headUser = $request->user();
        $validated = $request->validated();

        DB::transaction(function () use ($headUser, $validated) {
            $isVulnerable = $validated['vulnerability_category'] !== 'tidak_rentan';

            // Create Member User inheriting family_id, house coordinates, and family PIN
            $member = User::create([
                'family_id' => $headUser->family_id,
                'nik' => $validated['nik'],
                'name' => $validated['name'],
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'occupation' => $validated['occupation'],
                'whatsapp_number' => $headUser->whatsapp_number,
                'pin' => $headUser->pin, // Uses hashed PIN already on the head user so member can log in with family PIN!
                'role' => UserRole::Anggota,
                'home_address' => $headUser->home_address,
                'home_latitude' => $headUser->home_latitude,
                'home_longitude' => $headUser->home_longitude,
            ]);

            // Create Health Profile
            HealthProfile::create([
                'user_id' => $member->id,
                'is_vulnerable' => $isVulnerable,
                'vulnerability_category' => $validated['vulnerability_category'],
                'comorbidity_notes' => $validated['comorbidity_notes'] ?? null,
            ]);
        });

        return back()->with('success', 'Anggota keluarga berhasil ditambahkan ke dalam sistem proteksi.');
    }

    /**
     * Remove a family member from the family.
     */
    public function destroy(Request $request, User $member): RedirectResponse
    {
        $headUser = $request->user();

        // Security check: must be Kepala Keluarga in the same family and cannot delete self
        if (
            $headUser->role !== UserRole::KepalaKeluarga ||
            $member->family_id !== $headUser->family_id ||
            $member->id === $headUser->id
        ) {
            abort(403, 'Anda tidak memiliki hak akses untuk menghapus anggota keluarga ini.');
        }

        DB::transaction(function () use ($member) {
            $member->healthProfile()?->delete();
            $member->delete();
        });

        return back()->with('success', 'Data anggota keluarga berhasil dihapus.');
    }
}
