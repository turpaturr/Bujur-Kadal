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
    Route::controller(RegisterController::class)->group(function () {
        Route::get('/register', 'create')->name('register');
        Route::post('/register/step-1', 'validateStep1')->name('register.step1');
        Route::post('/register', 'store')->name('register.store');
    });

    Route::controller(LoginController::class)->group(function () {
        Route::get('/login', 'create')->name('login');
        Route::post('/login', 'store')->name('login.store');
    });
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::controller(AdminLoginController::class)->group(function () {
            Route::get('/login', 'create')->name('login');
            Route::post('/login', 'store')->name('login.store');
        });

        Route::controller(AdminRegisterController::class)->group(function () {
            Route::get('/register', 'create')->name('register');
            Route::post('/register', 'store')->name('register.store');
        });
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/dashboard', [DashboardAdminController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminLoginController::class, 'destroy'])->name('logout');

        // Manajemen Evakuasi Darurat
        Route::prefix('evacuations')
            ->name('evacuations.')
            ->controller(DashboardAdminController::class)
            ->group(function () {
                Route::post('/', 'storeEvacuation')->name('store');
                Route::post('/{mission}/progress', 'progressEvacuation')->name('progress');
            });
    });
});

// Rute Khusus Fasilitas Kesehatan (Faskes) untuk Konfirmasi Reservasi
Route::prefix('faskes')->name('faskes.')->middleware(['auth'])->group(function () {
    Route::prefix('reservations/{reservation}')
        ->name('reservations.')
        ->controller(DashboardAdminController::class)
        ->group(function () {
            Route::post('/approve', 'approveReservation')->name('approve');
            Route::post('/reject', 'rejectReservation')->name('reject');
        });
});

Route::middleware('auth')->group(function () {
    Route::controller(DashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('dashboard');
        Route::get('/family', 'family')->name('family');
        Route::get('/reservations', 'reservations')->name('reservations');
    });

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::prefix('family/members')
        ->name('family.members.')
        ->controller(FamilyMemberController::class)
        ->group(function () {
            Route::post('/', 'store')->name('store');
            Route::put('/{member}', 'update')->name('update');
            Route::delete('/{member}', 'destroy')->name('destroy');
        });

    Route::prefix('checkup-reservations')
        ->name('checkup-reservations.')
        ->controller(CheckupReservationController::class)
        ->group(function () {
            Route::post('/', 'store')->name('store');
            Route::post('/mark-as-read', 'markAsRead')->name('mark-as-read');
        });

    Route::get('/api/wildfire/hotspots', [WildfireController::class, 'hotspots'])
        ->name('wildfire.hotspots');
});
