<?php

use App\Enums\UserRole;
use App\Models\Family;
use App\Models\HealthProfile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

test('step 1 validates valid nik and no_kk with mock dukcapil', function () {
    $response = $this->postJson(route('register.step1'), [
        'no_kk' => '6472010101010001',
        'nik' => '6472011508950001', // Valid Kaltim Samarinda NIK
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'valid' => true,
                'province' => 'Kalimantan Timur',
            ],
        ]);
});

test('step 1 rejects invalid nik structure or wrong digit length', function () {
    $response = $this->postJson(route('register.step1'), [
        'no_kk' => '12345',
        'nik' => '6472019908950001', // Invalid day 99
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['no_kk', 'nik']);
});

test('full 5-step registration creates family, user, health profile and logs in', function () {
    $payload = [
        'no_kk' => '6472010101010002',
        'nik' => '6472012010920003',
        'name' => 'Budi Santoso',
        'home_address' => 'Jl. Pangeran Antasari No. 45, Samarinda Ulu',
        'home_latitude' => -0.49482300,
        'home_longitude' => 117.13579100,
        'role' => UserRole::KepalaKeluarga->value,
        'is_vulnerable' => true,
        'comorbidity_notes' => 'Riwayat Asma Kronis sejak 2018',
        'whatsapp_number' => '081234567890',
        'pin' => '889900',
    ];

    $response = $this->post(route('register.store'), $payload);

    $response->assertRedirect(route('dashboard'));

    // Assert Family created
    $family = Family::where('no_kk', '6472010101010002')->first();
    expect($family)->not->toBeNull();

    // Assert User created and associated
    $user = User::where('nik', '6472012010920003')->first();
    expect($user)->not->toBeNull()
        ->and($user->family_id)->toBe($family->id)
        ->and($user->name)->toBe('Budi Santoso')
        ->and($user->role)->toBe(UserRole::KepalaKeluarga)
        ->and(Hash::check('889900', $user->pin))->toBeTrue();

    // Assert Health Profile created
    $profile = HealthProfile::where('user_id', $user->id)->first();
    expect($profile)->not->toBeNull()
        ->and($profile->is_vulnerable)->toBeTrue()
        ->and($profile->comorbidity_notes)->toBe('Riwayat Asma Kronis sejak 2018');

    // Assert user is authenticated
    expect(Auth::id())->toBe($user->id);
});

test('registration rejects duplicate nik', function () {
    User::factory()->create(['nik' => '6472012010920009']);

    $response = $this->postJson(route('register.store'), [
        'no_kk' => '6472010101010009',
        'nik' => '6472012010920009',
        'name' => 'Duplikat NIK',
        'home_address' => 'Jl. Mulawarman',
        'home_latitude' => -0.501,
        'home_longitude' => 117.140,
        'role' => UserRole::Anggota->value,
        'is_vulnerable' => false,
        'whatsapp_number' => '081122334455',
        'pin' => '123456',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['nik']);
});

test('rapid login with nik and 6-digit pin succeeds', function () {
    $user = User::factory()->create([
        'nik' => '6472011005880005',
        'pin' => '654321', // cast hashes this
    ]);

    $response = $this->post(route('login.store'), [
        'nik' => '6472011005880005',
        'pin' => '654321',
    ]);

    $response->assertRedirect(route('dashboard'));
    expect(Auth::id())->toBe($user->id);
});

test('login fails with incorrect pin', function () {
    User::factory()->create([
        'nik' => '6472011005880006',
        'pin' => '654321',
    ]);

    $response = $this->from(route('login'))->post(route('login.store'), [
        'nik' => '6472011005880006',
        'pin' => '111111',
    ]);

    $response->assertSessionHasErrors(['nik']);
    expect(Auth::check())->toBeFalse();
});

test('authenticated user can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect('/');
    expect(Auth::check())->toBeFalse();
});
