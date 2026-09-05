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

        return Inertia::render('DashboardAdmin', [
            'adminStats' => $adminStats,
        ]);
    }
}

