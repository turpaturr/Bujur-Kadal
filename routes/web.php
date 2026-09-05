<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\WildfireController;
use Illuminate\Support\Facades\Route;

// 1. Landing Page (Welcome)
Route::inertia('/', 'Welcome')->name('home');

// 2. Guest Authentication Flow (Login & Register)
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register/step-1', [RegisterController::class, 'validateStep1'])->name('register.step1');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::inertia('/dashboard', 'Dashboard')->name('dashboard');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/api/wildfire/hotspots', [WildfireController::class, 'hotspots'])
        ->name('wildfire.hotspots');
});
