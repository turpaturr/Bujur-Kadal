        // =========================================================================
        // KELUARGA 11: SAMPIT, KALTENG (DEKAT LOKASI RAWAN KARHUTLA)
        // Koordinat: -2.5333, 112.9500
        // =========================================================================
        $familySampit1 = Family::firstOrCreate(['no_kk' => '6272011111110011']);

        // 12. Kepala Keluarga (Rentan)
        $userSampit1 = User::updateOrCreate(
            ['nik' => '6272011111110012'],
            [
                'family_id' => $familySampit1->id,
                'name' => 'Pak Joko (Area Karhutla)',
                'birth_date' => '1970-05-10',
                'gender' => 'laki-laki',
                'occupation' => 'Petani',
                'whatsapp_number' => '81200000012',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Desa Baamang, Kotawaringin Timur',
                'home_latitude' => -2.5333,
                'home_longitude' => 112.9500,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userSampit1->id], ['is_vulnerable' => true, 'comorbidity_notes' => 'Asma kronis']);

        // 13. Istri (Rentan)
        $userSampit2 = User::updateOrCreate(
            ['nik' => '6272011111110013'],
            [
                'family_id' => $familySampit1->id,
                'name' => 'Ibu Wati (Area Karhutla)',
                'birth_date' => '1975-08-15',
                'gender' => 'perempuan',
                'occupation' => 'Ibu Rumah Tangga',
                'whatsapp_number' => '81200000013',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Desa Baamang, Kotawaringin Timur',
                'home_latitude' => -2.5334,
                'home_longitude' => 112.9501,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userSampit2->id], ['is_vulnerable' => true, 'comorbidity_notes' => 'Ibu Hamil']);

        // 14. Anak (Rentan)
        $userSampit3 = User::updateOrCreate(
            ['nik' => '6272011111110014'],
            [
                'family_id' => $familySampit1->id,
                'name' => 'Budi Kecil (Area Karhutla)',
                'birth_date' => '2020-11-20',
                'gender' => 'laki-laki',
                'occupation' => 'Balita',
                'whatsapp_number' => '81200000014',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Desa Baamang, Kotawaringin Timur',
                'home_latitude' => -2.5332,
                'home_longitude' => 112.9499,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userSampit3->id], ['is_vulnerable' => true, 'vulnerability_category' => 'balita', 'comorbidity_notes' => 'Balita usia 5 tahun']);

        // 15. Tetangga 1
        $familySampit2 = Family::firstOrCreate(['no_kk' => '6272011111110015']);
        $userSampit4 = User::updateOrCreate(
            ['nik' => '6272011111110015'],
            [
                'family_id' => $familySampit2->id,
                'name' => 'Agus (Area Karhutla)',
                'birth_date' => '1985-02-02',
                'gender' => 'laki-laki',
                'occupation' => 'Pedagang',
                'whatsapp_number' => '81200000015',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Desa Baamang Hilir, Kotawaringin Timur',
                'home_latitude' => -2.5330,
                'home_longitude' => 112.9502,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userSampit4->id], ['is_vulnerable' => false]);

        // 16. Tetangga 2
        $userSampit5 = User::updateOrCreate(
            ['nik' => '6272011111110016'],
            [
                'family_id' => $familySampit2->id,
                'name' => 'Ani (Area Karhutla)',
                'birth_date' => '1990-09-09',
                'gender' => 'perempuan',
                'occupation' => 'Pegawai',
                'whatsapp_number' => '81200000016',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Desa Baamang Hilir, Kotawaringin Timur',
                'home_latitude' => -2.5330,
                'home_longitude' => 112.9502,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userSampit5->id], ['is_vulnerable' => false]);

        // =========================================================================
        // 5 ORANG LAINNYA DI AREA AMAN (BALIKPAPAN)
        // =========================================================================
        $familyBalikpapan2 = Family::firstOrCreate(['no_kk' => '6471011111110017']);

        // 17. Aman 1
        $userAman1 = User::updateOrCreate(
            ['nik' => '6471011111110017'],
            [
                'family_id' => $familyBalikpapan2->id,
                'name' => 'Ridwan (Aman)',
                'whatsapp_number' => '81200000017',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Gunung Samarinda, Balikpapan',
                'home_latitude' => -1.2400,
                'home_longitude' => 116.8500,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userAman1->id], ['is_vulnerable' => false]);

        // 18. Aman 2
        $userAman2 = User::updateOrCreate(
            ['nik' => '6471011111110018'],
            [
                'family_id' => $familyBalikpapan2->id,
                'name' => 'Rina (Aman)',
                'whatsapp_number' => '81200000018',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Gunung Samarinda, Balikpapan',
                'home_latitude' => -1.2401,
                'home_longitude' => 116.8501,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userAman2->id], ['is_vulnerable' => true, 'comorbidity_notes' => 'Hipertensi']);

        // 19. Aman 3
        $familyBalikpapan3 = Family::firstOrCreate(['no_kk' => '6471011111110019']);
        $userAman3 = User::updateOrCreate(
            ['nik' => '6471011111110019'],
            [
                'family_id' => $familyBalikpapan3->id,
                'name' => 'Arief (Aman)',
                'whatsapp_number' => '81200000019',
                'pin' => Hash::make('123456'),
                'role' => UserRole::KepalaKeluarga,
                'home_address' => 'Sepinggan, Balikpapan',
                'home_latitude' => -1.2600,
                'home_longitude' => 116.8900,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userAman3->id], ['is_vulnerable' => false]);

        // 20. Aman 4
        $userAman4 = User::updateOrCreate(
            ['nik' => '6471011111110020'],
            [
                'family_id' => $familyBalikpapan3->id,
                'name' => 'Sari (Aman)',
                'whatsapp_number' => '81200000020',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Sepinggan, Balikpapan',
                'home_latitude' => -1.2601,
                'home_longitude' => 116.8901,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userAman4->id], ['is_vulnerable' => false]);

        // 21. Aman 5
        $userAman5 = User::updateOrCreate(
            ['nik' => '6471011111110021'],
            [
                'family_id' => $familyBalikpapan3->id,
                'name' => 'Deni (Aman)',
                'whatsapp_number' => '81200000021',
                'pin' => Hash::make('123456'),
                'role' => UserRole::Anggota,
                'home_address' => 'Sepinggan, Balikpapan',
                'home_latitude' => -1.2599,
                'home_longitude' => 116.8899,
            ]
        );
        HealthProfile::updateOrCreate(['user_id' => $userAman5->id], ['is_vulnerable' => false]);
