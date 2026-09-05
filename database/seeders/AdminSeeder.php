<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@borneocare.id'],
            [
                'name' => 'Komandan Satgas Karhutla',
                'password' => Hash::make('admin12345'),
                'role' => UserRole::Admin,
                'family_id' => null,
                'nik' => null,
                'whatsapp_number' => '81199887766',
                'pin' => null,
                'home_address' => 'Pos Komando Penanggulangan Bencana Provinsi Kalimantan',
            ]
        );
    }
}
