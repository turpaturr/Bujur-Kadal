<?php

use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\AdminRegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\WildfireController;
use Illuminate\Support\Facades\Route;

// 1. Landing Page (Welcome)
Route::inertia('/', 'Welcome')->name('home');

// 2. Guest Authentication Flow - Warga (Login & Register via NIK & PIN)
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register/step-1', [RegisterController::class, 'validateStep1'])->name('register.step1');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

// 3. Administrator Authentication Flow (Login & Register via Email & Password)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'create'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'store'])->name('login.store');
        Route::get('/register', [AdminRegisterController::class, 'create'])->name('register');
        Route::post('/register', [AdminRegisterController::class, 'store'])->name('register.store');
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::inertia('/dashboard', 'Admin/Dashboard')->name('dashboard');
        Route::post('/logout', [AdminLoginController::class, 'destroy'])->name('logout');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Family Member Management (Kepala Keluarga)
    Route::post('/family/members', [FamilyMemberController::class, 'store'])->name('family.members.store');
    Route::delete('/family/members/{member}', [FamilyMemberController::class, 'destroy'])->name('family.members.destroy');

    Route::get('/api/wildfire/hotspots', [WildfireController::class, 'hotspots'])
        ->name('wildfire.hotspots');
});
