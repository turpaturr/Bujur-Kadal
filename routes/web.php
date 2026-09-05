<?php

use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\AdminRegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CheckupReservationController;
use App\Http\Controllers\DashboardAdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\WildfireController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register/step-1', [RegisterController::class, 'validateStep1'])->name('register.step1');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'create'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'store'])->name('login.store');
        Route::get('/register', [AdminRegisterController::class, 'create'])->name('register');
        Route::post('/register', [AdminRegisterController::class, 'store'])->name('register.store');
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/dashboard', [DashboardAdminController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminLoginController::class, 'destroy'])->name('logout');

        Route::post('/checkup-reservations/{reservation}/approve', [DashboardAdminController::class, 'approveReservation'])->name('checkup-reservations.approve');
        Route::post('/checkup-reservations/{reservation}/reject', [DashboardAdminController::class, 'rejectReservation'])->name('checkup-reservations.reject');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/family', [DashboardController::class, 'family'])->name('family');
    Route::get('/reservations', [DashboardController::class, 'reservations'])->name('reservations');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::post('/family/members', [FamilyMemberController::class, 'store'])->name('family.members.store');
    Route::put('/family/members/{member}', [FamilyMemberController::class, 'update'])->name('family.members.update');
    Route::delete('/family/members/{member}', [FamilyMemberController::class, 'destroy'])->name('family.members.destroy');

    Route::post('/checkup-reservations', [CheckupReservationController::class, 'store'])->name('checkup-reservations.store');
    Route::post('/checkup-reservations/mark-as-read', [CheckupReservationController::class, 'markAsRead'])->name('checkup-reservations.mark-as-read');

    Route::get('/api/wildfire/hotspots', [WildfireController::class, 'hotspots'])
        ->name('wildfire.hotspots');
});
