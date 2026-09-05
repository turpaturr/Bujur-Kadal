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

        // 1. Akun Kepala Keluarga (Rentan - Riwayat Asma & Ada Balita)
        // NIK: 6472010101900001 | PIN: 123456
        $userBudi = User::updateOrCreate(
            ['nik' => '6472010101900001'],
            [
                'family_id' => $familySamarinda->id,
                'name' => 'Budi Pratama (Kepala Keluarga)',
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
                'comorbidity_notes' => 'Riwayat Asma Kronis & Terdapat Balita 3 Tahun (Prioritas Evakuasi Oksigen)',
            ]
        );

        // 2. Akun Anggota Keluarga (Non-Rentan / Sehat)
        // NIK: 6472011504950002 | PIN: 123456
        $userSiti = User::updateOrCreate(
            ['nik' => '6472011504950002'],
            [
                'family_id' => $familySamarinda->id,
                'name' => 'Siti Rahma (Anggota Keluarga)',
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
                'is_vulnerable' => false,
                'comorbidity_notes' => null,
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
                'name' => 'Ahmad Fauzi (Relawan / Pendatang)',
                'whatsapp_number' => '82155667788',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Pendatang,
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
        // KELUARGA 5: BALIKPAPAN, KALIMANTAN TIMUR (No. KK: 6471010505050005)
        // =========================================================================
        $familyBalikpapan = Family::firstOrCreate([
            'no_kk' => '6471010505050005',
        ]);

        // 6. Akun Kepala Keluarga (Rentan - Penyakit Jantung)
        // NIK: 6471011507800006 | PIN: 123456
        $userRizal = User::updateOrCreate(
            ['nik' => '6471011507800006'],
            [
                'family_id' => $familyBalikpapan->id,
                'name' => 'Rizal Maulana (Kepala Keluarga)',
                'whatsapp_number' => '81122334455',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. MT Haryono No. 45, Damai, Kota Balikpapan, Kalimantan Timur',
                'home_latitude' => -1.26750000,
                'home_longitude' => 116.82890000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userRizal->id],
            [
                'is_vulnerable' => true,
                'comorbidity_notes' => 'Riwayat Penyakit Jantung dan Hipertensi, Membutuhkan Obat Rutin',
            ]
        );

        // =========================================================================
        // KELUARGA 6: BANJARMASIN, KALIMANTAN SELATAN (No. KK: 6371010606060006)
        // =========================================================================
        $familyBanjarmasin = Family::firstOrCreate([
            'no_kk' => '6371010606060006',
        ]);

        // 7. Akun Kepala Keluarga (Non-Rentan)
        // NIK: 6371012202840007 | PIN: 123456
        $userFajar = User::updateOrCreate(
            ['nik' => '6371012202840007'],
            [
                'family_id' => $familyBanjarmasin->id,
                'name' => 'Fajar Hidayat (Kepala Keluarga)',
                'whatsapp_number' => '81266778899',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Ahmad Yani Km 5, Pemurus Baru, Kota Banjarmasin, Kalimantan Selatan',
                'home_latitude' => -3.31940000,
                'home_longitude' => 114.59080000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userFajar->id],
            [
                'is_vulnerable' => false,
                'comorbidity_notes' => null,
            ]
        );

        // =========================================================================
        // KELUARGA 7: BANJARBARU, KALIMANTAN SELATAN (No. KK: 6372010707070007)
        // =========================================================================
        $familyBanjarbaru = Family::firstOrCreate([
            'no_kk' => '6372010707070007',
        ]);

        // 8. Akun Kepala Keluarga (Rentan - Disabilitas Mobilitas)
        // NIK: 6372010901770008 | PIN: 123456
        $userNadia = User::updateOrCreate(
            ['nik' => '6372010901770008'],
            [
                'family_id' => $familyBanjarbaru->id,
                'name' => 'Nadia Permata (Kepala Keluarga)',
                'whatsapp_number' => '81377889900',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Trikora No. 21, Guntung Manggis, Kota Banjarbaru, Kalimantan Selatan',
                'home_latitude' => -3.44220000,
                'home_longitude' => 114.83650000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userNadia->id],
            [
                'is_vulnerable' => true,
                'comorbidity_notes' => 'Penyandang Disabilitas Mobilitas, Membutuhkan Bantuan Saat Evakuasi',
            ]
        );

        // =========================================================================
        // KELUARGA 8: TARAKAN, KALIMANTAN UTARA (No. KK: 6571010808080008)
        // =========================================================================
        $familyTarakan = Family::firstOrCreate([
            'no_kk' => '6571010808080008',
        ]);

        // 9. Akun Kepala Keluarga (Non-Rentan)
        // NIK: 6571011805880009 | PIN: 123456
        $userYusuf = User::updateOrCreate(
            ['nik' => '6571011805880009'],
            [
                'family_id' => $familyTarakan->id,
                'name' => 'Yusuf Kurniawan (Kepala Keluarga)',
                'whatsapp_number' => '82188990011',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Mulawarman No. 17, Karang Anyar, Kota Tarakan, Kalimantan Utara',
                'home_latitude' => 3.30070000,
                'home_longitude' => 117.63340000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userYusuf->id],
            [
                'is_vulnerable' => false,
                'comorbidity_notes' => null,
            ]
        );

        // =========================================================================
        // KELUARGA 9: BONTANG, KALIMANTAN TIMUR (No. KK: 6474010909090009)
        // =========================================================================
        $familyBontang = Family::firstOrCreate([
            'no_kk' => '6474010909090009',
        ]);

        // 10. Akun Kepala Keluarga (Rentan - Anak Kecil)
        // NIK: 6474012503900010 | PIN: 123456
        $userLina = User::updateOrCreate(
            ['nik' => '6474012503900010'],
            [
                'family_id' => $familyBontang->id,
                'name' => 'Lina Marlina (Kepala Keluarga)',
                'whatsapp_number' => '85299001122',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Awang Long No. 9, Bontang Baru, Kota Bontang, Kalimantan Timur',
                'home_latitude' => 0.13330000,
                'home_longitude' => 117.50000000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userLina->id],
            [
                'is_vulnerable' => true,
                'comorbidity_notes' => 'Memiliki Anak Usia 2 Tahun, Prioritas Evakuasi Keluarga dengan Balita',
            ]
        );

        // =========================================================================
        // KELUARGA 10: SINGKAWANG, KALIMANTAN BARAT (No. KK: 6172011010100010)
        // =========================================================================
        $familySingkawang = Family::firstOrCreate([
            'no_kk' => '6172011010100010',
        ]);

        // 11. Akun Kepala Keluarga (Non-Rentan)
        // NIK: 6172011206820011 | PIN: 123456
        $userHendra = User::updateOrCreate(
            ['nik' => '6172011206820011'],
            [
                'family_id' => $familySingkawang->id,
                'name' => 'Hendra Wijaya (Kepala Keluarga)',
                'whatsapp_number' => '81100112233',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Jl. Diponegoro No. 31, Pasiran, Kota Singkawang, Kalimantan Barat',
                'home_latitude' => 0.90700000,
                'home_longitude' => 108.98720000,
            ]
        );

        HealthProfile::updateOrCreate(
            ['user_id' => $userHendra->id],
            [
                'is_vulnerable' => false,
                'comorbidity_notes' => null,
            ]
        );
    }
}
