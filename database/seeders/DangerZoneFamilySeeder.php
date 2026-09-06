<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Family;
use App\Models\HealthProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DangerZoneFamilySeeder extends Seeder
{
    public function run(): void
    {
        $familyDanger = Family::firstOrCreate([
            'no_kk' => '6112010101010009',
        ]);

        $dangerLat = -0.48900000;
        $dangerLng = 109.55900000;
        $dangerAddress = 'Dusun Mekar Sari RT 04 / RW 02, Desa Rasau Jaya Tiga, Kec. Rasau Jaya, Kab. Kubu Raya, Kalimantan Barat (Zona Bahaya Asap & Karhutla)';

        $userBambang = User::updateOrCreate(
            ['nik' => '6112010101850001'],
            [
                'family_id' => $familyDanger->id,
                'name' => 'Bambang Wijaya (Kepala Keluarga)',
                'nik_masked' => '6112••••••••0001',
                'birth_date' => '1985-01-10',
                'gender' => 'laki-laki',
                'occupation' => 'Petani Lahan Gambut',
                'whatsapp_number' => '81255550001',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => $dangerAddress,
                'home_latitude' => $dangerLat,
                'home_longitude' => $dangerLng,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userBambang->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'penyakit_bawaan',
                'comorbidity_notes' => 'Riwayat Asma Akut, Mengalami Batuk Berdahak Akibat Asap Pekat Gambut',
            ]
        );

        $userDewi = User::updateOrCreate(
            ['nik' => '6112011205900002'],
            [
                'family_id' => $familyDanger->id,
                'name' => 'Dewi Lestari (Istri)',
                'nik_masked' => '6112••••••••0002',
                'birth_date' => '1990-05-12',
                'gender' => 'perempuan',
                'occupation' => 'Ibu Rumah Tangga',
                'whatsapp_number' => '81255550002',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => $dangerAddress,
                'home_latitude' => $dangerLat,
                'home_longitude' => $dangerLng,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userDewi->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'ibu_hamil',
                'comorbidity_notes' => 'Ibu Hamil Trimester 3 (Usia Kandungan 32 Minggu), Butuh Ruang Bersih Bebas Partikulat PM2.5',
            ]
        );

        $userKevin = User::updateOrCreate(
            ['nik' => '6112012002220003'],
            [
                'family_id' => $familyDanger->id,
                'name' => 'Kevin Wijaya (Anak Balita)',
                'nik_masked' => '6112••••••••0003',
                'birth_date' => '2022-02-20',
                'gender' => 'laki-laki',
                'occupation' => 'Balita',
                'whatsapp_number' => '81255550001',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => $dangerAddress,
                'home_latitude' => $dangerLat,
                'home_longitude' => $dangerLng,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userKevin->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'balita',
                'comorbidity_notes' => 'Balita 2 Tahun, Menunjukkan Gejala Sesak Napas ISPA Ringan, Butuh Suplementasi Oksigen & Masker Khusus',
            ]
        );

        $userMbah = User::updateOrCreate(
            ['nik' => '6112010107520004'],
            [
                'family_id' => $familyDanger->id,
                'name' => 'Mbah Slamet (Lansia)',
                'nik_masked' => '6112••••••••0004',
                'birth_date' => '1952-07-01',
                'gender' => 'laki-laki',
                'occupation' => 'Pensiunan / Petani',
                'whatsapp_number' => '81255550001',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => $dangerAddress,
                'home_latitude' => $dangerLat,
                'home_longitude' => $dangerLng,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userMbah->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'lansia',
                'comorbidity_notes' => 'Lansia 72 Tahun, Komorbid PPOK (Penyakit Paru Obstruktif Kronis), Prioritas Utama Evakuasi Penjemputan',
            ]
        );
    }
}
