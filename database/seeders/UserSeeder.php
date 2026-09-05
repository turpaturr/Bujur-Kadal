<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Family;
use App\Models\HealthProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Keluarga Dummy
        $family = Family::firstOrCreate([
            'no_kk' => '6472010101010001',
        ]);

        // 2. Buat User Utama untuk Pengujian Login
        // NIK: 6472010101900001 | PIN: 123456
        $userKepala = User::updateOrCreate(
            ['nik' => '6472010101900001'],
            [
                'family_id' => $family->id,
                'name' => 'Budi Pratama (Kepala Keluarga)',
                'whatsapp_number' => '81234567890',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Pangeran Antasari No. 12, Samarinda Ulu, Kalimantan Timur',
                'home_latitude' => -0.49482300,
                'home_longitude' => 117.13579100,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userKepala->id],
            [
                'is_vulnerable' => true,
                'comorbidity_notes' => 'Riwayat Asma Kronis & Terdapat Balita 3 Tahun (Prioritas Evakuasi Oksigen)',
            ]
        );

        // 3. Buat User Anggota Keluarga (Non-Rentan)
        // NIK: 6472011504950002 | PIN: 123456
        $userAnggota = User::updateOrCreate(
            ['nik' => '6472011504950002'],
            [
                'family_id' => $family->id,
                'name' => 'Siti Rahma (Anggota Keluarga)',
                'whatsapp_number' => '81298765432',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Jl. Pangeran Antasari No. 12, Samarinda Ulu, Kalimantan Timur',
                'home_latitude' => -0.49482300,
                'home_longitude' => 117.13579100,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userAnggota->id],
            [
                'is_vulnerable' => false,
                'comorbidity_notes' => null,
            ]
        );
    }
}
