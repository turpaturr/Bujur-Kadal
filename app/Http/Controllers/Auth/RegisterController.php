<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\Step1RegisterRequest;
use App\Models\Family;
use App\Models\HealthProfile;
use App\Models\User;
use App\Services\DukcapilService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * Show the registration form page.
     */
    public function create(): Response
    {
        return Inertia::render('Authentication/Register/Index');
    }

    /**
     * Validate Step 1 (No. KK and NIK with mock Dukcapil verification).
     */
    public function validateStep1(Step1RegisterRequest $request, DukcapilService $dukcapilService): JsonResponse
    {
        $result = $dukcapilService->validate(
            (string) $request->validated('nik'),
            (string) $request->validated('no_kk')
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Data kependudukan terverifikasi di Dukcapil.',
            'data' => $result,
        ]);
    }

    /**
     * Handle the complete 5-step registration request.
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            // Find or register the Family record by No. KK
            $family = Family::firstOrCreate([
                'no_kk' => $validated['no_kk'],
            ]);

            // Create User associated with family
            $user = User::create([
                'family_id' => $family->id,
                'nik' => $validated['nik'],
                'name' => $validated['name'],
                'whatsapp_number' => $validated['whatsapp_number'],
                'pin' => $validated['pin'], // User model cast 'pin' => 'hashed' automatically hashes
                'role' => $validated['role'],
                'home_address' => $validated['home_address'],
                'home_latitude' => $validated['home_latitude'],
                'home_longitude' => $validated['home_longitude'],
            ]);

            // Create User Health Profile
            HealthProfile::create([
                'user_id' => $user->id,
                'is_vulnerable' => (bool) $validated['is_vulnerable'],
                'comorbidity_notes' => $validated['comorbidity_notes'] ?? null,
            ]);

            return $user;
        });

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }
}
