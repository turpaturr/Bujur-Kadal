<?php

use App\Enums\SafeZoneType;
use App\Enums\SosStatus;
use App\Enums\UserRole;
use App\Models\Family;
use App\Models\HealthProfile;
use App\Models\SafeZone;
use App\Models\SosRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('family can be created and has many users', function () {
    $family = Family::factory()->create([
        'no_kk' => '6201010101010001',
    ]);

    $user1 = User::factory()->forFamily($family)->create([
        'role' => UserRole::KepalaKeluarga,
    ]);

    $user2 = User::factory()->forFamily($family)->create([
        'role' => UserRole::Anggota,
    ]);

    expect($family->users)->toHaveCount(2)
        ->and($user1->family->id)->toBe($family->id)
        ->and($user1->role)->toBe(UserRole::KepalaKeluarga);
});

test('user authenticates with pin and casts attributes properly', function () {
    $user = User::factory()->create([
        'pin' => '654321',
        'home_latitude' => -1.26916000,
        'home_longitude' => 116.82526400,
        'role' => UserRole::KepalaKeluarga,
    ]);

    expect(Hash::check('654321', $user->pin))->toBeTrue()
        ->and($user->getAuthPasswordName())->toBe('pin')
        ->and($user->role)->toBe(UserRole::KepalaKeluarga)
        ->and($user->home_latitude)->toEqualWithDelta(-1.26916000, 0.0001)
        ->and($user->home_longitude)->toEqualWithDelta(116.82526400, 0.0001);
});

test('health profile belongs to user with vulnerability flags', function () {
    $user = User::factory()->create();

    $healthProfile = HealthProfile::factory()->vulnerable('Riwayat Asma Akut')->create([
        'user_id' => $user->id,
    ]);

    expect($healthProfile->user->id)->toBe($user->id)
        ->and($healthProfile->is_vulnerable)->toBeTrue()
        ->and($healthProfile->comorbidity_notes)->toBe('Riwayat Asma Akut')
        ->and($user->fresh()->healthProfile->id)->toBe($healthProfile->id);
});

test('safe zone supports types and availability scope', function () {
    SafeZone::factory()->create([
        'name' => 'RSUD AWS Samarinda',
        'type' => SafeZoneType::RumahSakit,
        'capacity_left' => 50,
        'latitude' => -0.4912,
        'longitude' => 117.1492,
    ]);

    SafeZone::factory()->create([
        'name' => 'Posko Penuh',
        'type' => SafeZoneType::PoskoRelawan,
        'capacity_left' => 0,
    ]);

    $availableZones = SafeZone::available()->get();

    expect($availableZones)->toHaveCount(1)
        ->and($availableZones->first()->type)->toBe(SafeZoneType::RumahSakit);
});

test('sos request links to user and filters active requests', function () {
    $user = User::factory()->create();

    $activeSos = SosRequest::factory()->pending()->create([
        'user_id' => $user->id,
        'latitude' => -1.26916000,
        'longitude' => 116.82526400,
    ]);

    SosRequest::factory()->create([
        'user_id' => $user->id,
        'status' => SosStatus::Resolved,
    ]);

    $activeRequests = SosRequest::active()->get();

    expect($activeRequests)->toHaveCount(1)
        ->and($activeRequests->first()->id)->toBe($activeSos->id)
        ->and($activeSos->user->id)->toBe($user->id)
        ->and($user->fresh()->sosRequests)->toHaveCount(2);
});

test('deleting a user cascades to health profile and sos requests', function () {
    $user = User::factory()->create();

    HealthProfile::factory()->create(['user_id' => $user->id]);
    SosRequest::factory()->create(['user_id' => $user->id]);

    expect(HealthProfile::where('user_id', $user->id)->count())->toBe(1)
        ->and(SosRequest::where('user_id', $user->id)->count())->toBe(1);

    $user->delete();

    expect(HealthProfile::where('user_id', $user->id)->count())->toBe(0)
        ->and(SosRequest::where('user_id', $user->id)->count())->toBe(0);
});

test('deleting a family nullifies user family_id without deleting user', function () {
    $family = Family::factory()->create();
    $user = User::factory()->forFamily($family)->create();

    $family->delete();

    expect($user->fresh()->family_id)->toBeNull();
});
