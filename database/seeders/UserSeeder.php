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
        // =========================================================================
        // KELUARGA 1: SAMARINDA, KALIMANTAN TIMUR (No. KK: 6472010101010001)
        // =========================================================================
        $familySamarinda = Family::firstOrCreate([
            'no_kk' => '6472010101010001',
        ]);

        // 1. Akun Kepala Keluarga
        // NIK: 6472010101900001 | PIN: 123456
        $userBudi = User::updateOrCreate(
            ['nik' => '6472010101900001'],
            [
                'family_id' => $familySamarinda->id,
                'name' => 'Budi Pratama (Kepala Keluarga)',
                'birth_date' => '1990-01-01',
                'gender' => 'laki-laki',
                'occupation' => 'Wiraswasta / Pegawai Swasta',
                'whatsapp_number' => '81234567890',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Pangeran Antasari No. 12, Samarinda Ulu, Kota Samarinda, Kalimantan Timur',
                'home_latitude' => -0.49482300,
                'home_longitude' => 117.13579100,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userBudi->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'penyakit_bawaan',
                'comorbidity_notes' => 'Riwayat Asma Kronis & Alergi Asap Debu Pekat',
            ]
        );

        // 2. Akun Anggota Keluarga - Istri (Ibu Hamil)
        // NIK: 6472011504950002 | PIN: 123456
        $userSiti = User::updateOrCreate(
            ['nik' => '6472011504950002'],
            [
                'family_id' => $familySamarinda->id,
                'name' => 'Siti Rahma (Istri)',
                'birth_date' => '1995-04-15',
                'gender' => 'perempuan',
                'occupation' => 'Ibu Rumah Tangga / Guru',
                'whatsapp_number' => '81298765432',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Jl. Pangeran Antasari No. 12, Samarinda Ulu, Kota Samarinda, Kalimantan Timur',
                'home_latitude' => -0.49482300,
                'home_longitude' => 117.13579100,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userSiti->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'ibu_hamil',
                'comorbidity_notes' => 'Hamil Trimester 2, Memerlukan Kualitas Udara Bersih Bebas PM2.5',
            ]
        );

        // 3. Akun Anggota Keluarga - Anak Balita (Sangat Rentan)
        // NIK: 6472012108230007 | PIN: 123456
        $userRayyan = User::updateOrCreate(
            ['nik' => '6472012108230007'],
            [
                'family_id' => $familySamarinda->id,
                'name' => 'Rayyan Al-Fatih (Anak Balita)',
                'birth_date' => '2023-08-21',
                'gender' => 'laki-laki',
                'occupation' => 'Belum Bekerja (Balita)',
                'whatsapp_number' => '81234567890',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Jl. Pangeran Antasari No. 12, Samarinda Ulu, Kota Samarinda, Kalimantan Timur',
                'home_latitude' => -0.49482300,
                'home_longitude' => 117.13579100,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userRayyan->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'balita',
                'comorbidity_notes' => 'Balita Usia 3 Tahun, Paru-paru Sensitif Asap Karhutla',
            ]
        );

        // 4. Akun Anggota Keluarga - Nenek (Lansia Rentan)
        // NIK: 6472015012560008 | PIN: 123456
        $userAminah = User::updateOrCreate(
            ['nik' => '6472015012560008'],
            [
                'family_id' => $familySamarinda->id,
                'name' => 'Nenek Aminah (Lansia)',
                'birth_date' => '1956-12-10',
                'gender' => 'perempuan',
                'occupation' => 'Pensiunan',
                'whatsapp_number' => '81234567890',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Jl. Pangeran Antasari No. 12, Samarinda Ulu, Kota Samarinda, Kalimantan Timur',
                'home_latitude' => -0.49482300,
                'home_longitude' => 117.13579100,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userAminah->id],
            [
                'is_vulnerable' => true,
                'vulnerability_category' => 'lansia',
                'comorbidity_notes' => 'Lansia 69 Tahun, Riwayat Hipertensi dan Gangguan Saluran Pernapasan',
            ]
        );

        // =========================================================================
        // KELUARGA 2: PALANGKA RAYA, KALIMANTAN TENGAH (No. KK: 6271010202020002)
        // =========================================================================
        $familyPalangka1 = Family::firstOrCreate([
            'no_kk' => '6271010202020002',
        ]);

        // 3. Akun Pendatang / Relawan Lapangan (Non-Rentan)
        // NIK: 6271012005980003 | PIN: 123456
        $userAhmad = User::updateOrCreate(
            ['nik' => '6271012005980003'],
            [
                'family_id' => $familyPalangka1->id,
                'name' => 'Ahmad Fauzi (Anggota Keluarga)',
                'whatsapp_number' => '82155667788',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Posko Relawan Siaga Karhutla, Jl. Tjilik Riwut Km 2, Palangka Raya, Kalimantan Tengah',
                'home_latitude' => -2.21610000,
                'home_longitude' => 113.91660000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userAhmad->id],
            [
                'is_vulnerable' => false,
                'comorbidity_notes' => 'Relawan Lapangan Tanggap Darurat & Distribusi Masker N95',
            ]
        );

        // =========================================================================
        // KELUARGA 3: PALANGKA RAYA, KALIMANTAN TENGAH (No. KK: 6271010303030003)
        // =========================================================================
        $familyPalangka2 = Family::firstOrCreate([
            'no_kk' => '6271010303030003',
        ]);

        // 4. Akun Lansia Sangat Rentan (Prioritas Evakuasi Oksigen Murni)
        // NIK: 6271010503550004 | PIN: 123456
        $userSyahrani = User::updateOrCreate(
            ['nik' => '6271010503550004'],
            [
                'family_id' => $familyPalangka2->id,
                'name' => 'Haji Syahrani (Lansia Rentan)',
                'whatsapp_number' => '81344556677',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. RTA Milono Km 4.5, Pahandut, Palangka Raya, Kalimantan Tengah',
                'home_latitude' => -2.22850000,
                'home_longitude' => 113.92100000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userSyahrani->id],
            [
                'is_vulnerable' => true,
                'comorbidity_notes' => 'Lansia 71 Tahun, Riwayat PPOK / ISPA Akut, Membutuhkan Tabung Oksigen Siaga',
            ]
        );

        // =========================================================================
        // KELUARGA 4: PONTIANAK, KALIMANTAN BARAT (No. KK: 6171010404040004)
        // =========================================================================
        $familyPontianak = Family::firstOrCreate([
            'no_kk' => '6171010404040004',
        ]);

        // 5. Akun Ibu Hamil Trimester 3 (Kelompok Rentan Kabut Asap)
        // NIK: 6171011010910005 | PIN: 123456
        $userDewi = User::updateOrCreate(
            ['nik' => '6171011010910005'],
            [
                'family_id' => $familyPontianak->id,
                'name' => 'Dewi Lestari (Ibu Hamil)',
                'whatsapp_number' => '85233445566',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Gajah Mada No. 88, Benua Melayu Darat, Kota Pontianak, Kalimantan Barat',
                'home_latitude' => -0.03450000,
                'home_longitude' => 109.34250000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userDewi->id],
            [
                'is_vulnerable' => true,
                'comorbidity_notes' => 'Ibu Hamil Trimester 3, Alergi Debu dan Asap Pekat Karhutla',
            ]
        );

        // =========================================================================
        // AKUN ADMINISTRATOR / PETUGAS SIAGA (Email & Password)
        // =========================================================================
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
