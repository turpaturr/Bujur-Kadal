<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

test('admin register page can be rendered', function () {
    $response = $this->get(route('admin.register'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page->component('Authentication/Admin/Register'));
});

test('admin registration creates user with admin role and logs in', function () {
    $payload = [
        'name' => 'Kapten Satgas Udara',
        'email' => 'satgas.udara@borneocare.id',
        'password' => 'BorneoSiaga2026!',
        'password_confirmation' => 'BorneoSiaga2026!',
    ];

    $response = $this->post(route('admin.register.store'), $payload);

    $response->assertRedirect(route('admin.dashboard'));

    $user = User::where('email', 'satgas.udara@borneocare.id')->first();
    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('Kapten Satgas Udara')
        ->and($user->role)->toBe(UserRole::Admin)
        ->and($user->isAdmin())->toBeTrue()
        ->and($user->isUser())->toBeFalse()
        ->and(Hash::check('BorneoSiaga2026!', $user->password))->toBeTrue();

    expect(Auth::id())->toBe($user->id);
});

test('admin registration rejects duplicate email', function () {
    User::factory()->admin()->create(['email' => 'existing.admin@borneocare.id']);

    $response = $this->postJson(route('admin.register.store'), [
        'name' => 'Admin Baru',
        'email' => 'existing.admin@borneocare.id',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('admin registration rejects mismatched password confirmation', function () {
    $response = $this->postJson(route('admin.register.store'), [
        'name' => 'Admin Test',
        'email' => 'test.admin@borneocare.id',
        'password' => 'password123',
        'password_confirmation' => 'different456',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('admin login page can be rendered', function () {
    $response = $this->get(route('admin.login'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page->component('Authentication/Admin/Login'));
});

test('admin login with valid email and password succeeds', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'pusdalops@borneocare.id',
        'password' => 'SatgasAman123',
    ]);

    $response = $this->post(route('admin.login.store'), [
        'email' => 'pusdalops@borneocare.id',
        'password' => 'SatgasAman123',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    expect(Auth::id())->toBe($admin->id);
});

test('admin login fails with incorrect password', function () {
    User::factory()->admin()->create([
        'email' => 'pusdalops@borneocare.id',
        'password' => 'SatgasAman123',
    ]);

    $response = $this->from(route('admin.login'))->post(route('admin.login.store'), [
        'email' => 'pusdalops@borneocare.id',
        'password' => 'wrongpassword',
    ]);

    $response->assertSessionHasErrors(['email']);
    expect(Auth::check())->toBeFalse();
});

test('admin login rejects regular citizen user accounts', function () {
    // Create citizen user who has email & password set but role is citizen
    User::factory()->create([
        'name' => 'Warga Biasa',
        'email' => 'warga.biasa@gmail.com',
        'password' => 'warga12345',
        'role' => UserRole::KepalaKeluarga,
    ]);

    $response = $this->from(route('admin.login'))->post(route('admin.login.store'), [
        'email' => 'warga.biasa@gmail.com',
        'password' => 'warga12345',
    ]);

    $response->assertSessionHasErrors(['email']);
    expect(Auth::check())->toBeFalse();
});

test('authenticated admin can logout through admin logout route', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.logout'));

    $response->assertRedirect(route('admin.login'));
    expect(Auth::check())->toBeFalse();
});

test('admin dashboard can be rendered for authenticated admin', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
});

test('non-admin user is blocked by admin middleware from admin routes', function () {
    $warga = User::factory()->create([
        'role' => UserRole::Anggota,
    ]);

    $response = $this->actingAs($warga)->post(route('admin.logout'));

    $response->assertForbidden();

    $dashboardResponse = $this->actingAs($warga)->get(route('admin.dashboard'));

    $dashboardResponse->assertForbidden();
});
