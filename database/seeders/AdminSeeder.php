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

        User::updateOrCreate(
            ['email' => 'klinik.hasanka@borneocare.id'],
            [
                'name' => 'Klinik Hasanka',
                'password' => Hash::make('password'),
                'role' => UserRole::Faskes,
                'whatsapp_number' => '81100000001',
                'home_address' => 'Palangka Raya',
                'home_latitude' => -2.24268,
                'home_longitude' => 113.93007,
            ]
        );

        User::updateOrCreate(
            ['email' => 'posyandu.gatra@borneocare.id'],
            [
                'name' => 'Posyandu Gatra Mulya',
                'password' => Hash::make('password'),
                'role' => UserRole::Faskes,
                'whatsapp_number' => '81100000002',
                'home_address' => 'Jalan AMD Gunung Empat, Balikpapan',
                'home_latitude' => -1.22111,
                'home_longitude' => 116.82442,
            ]
        );

        User::updateOrCreate(
            ['email' => 'bidan.setiawati@borneocare.id'],
            [
                'name' => 'Bidan Setiawati',
                'password' => Hash::make('password'),
                'role' => UserRole::Faskes,
                'whatsapp_number' => '81100000003',
                'home_address' => 'Jalan Gunung Slamet, Sampit',
                'home_latitude' => -2.51676,
                'home_longitude' => 112.94675,
            ]
        );
    }
}
