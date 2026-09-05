<?php

namespace App\Services;

class DukcapilService
{
    /**
     * Known Kalimantan province codes.
     *
     * @var array<string, string>
     */
    protected const PROVINCES = [
        '61' => 'Kalimantan Barat',
        '62' => 'Kalimantan Tengah',
        '63' => 'Kalimantan Selatan',
        '64' => 'Kalimantan Timur',
        '65' => 'Kalimantan Utara',
    ];

    /**
     * Validate NIK format and birthdate structure.
     *
     * @return array{valid: bool, message?: string, province?: string, regency?: string}
     */
    public function validateNik(string $nik): array
    {
        $nik = trim($nik);

        if (! preg_match('/^[0-9]{16}$/', $nik)) {
            return [
                'valid' => false,
                'message' => 'NIK harus berupa 16 digit angka numerik valid.',
            ];
        }

        // Validate birthdate component inside NIK: DDMMYY (digits 7-12, 0-indexed 6..11)
        $day = (int) substr($nik, 6, 2);
        $month = (int) substr($nik, 8, 2);

        // In Indonesian NIK, female birth day has 40 added (i.e. 41..71)
        $actualDay = $day > 40 ? $day - 40 : $day;

        if ($actualDay < 1 || $actualDay > 31 || $month < 1 || $month > 12) {
            return [
                'valid' => false,
                'message' => 'Struktur NIK tidak sesuai dengan data kependudukan (format tanggal lahir tidak valid).',
            ];
        }

        $provinceCode = substr($nik, 0, 2);
        $province = self::PROVINCES[$provinceCode] ?? 'Wilayah Indonesia';
        $regencyCode = substr($nik, 2, 2);

        return [
            'valid' => true,
            'province' => $province,
            'regency' => "Wilayah {$provinceCode}.{$regencyCode}",
        ];
    }

    /**
     * Validate NIK and No. KK with mock Dukcapil verification.
     *
     * @return array{valid: bool, message?: string, province?: string, regency?: string, verified_at?: string}
     */
    public function validate(string $nik, string $noKk): array
    {
        $nikCheck = $this->validateNik($nik);
        if (! $nikCheck['valid']) {
            return $nikCheck;
        }

        $noKk = trim($noKk);
        if (! preg_match('/^[0-9]{16}$/', $noKk)) {
            return [
                'valid' => false,
                'message' => 'Nomor Kartu Keluarga (KK) harus berupa 16 digit angka numerik valid.',
            ];
        }

        return [
            'valid' => true,
            'province' => $nikCheck['province'],
            'regency' => $nikCheck['regency'],
            'verified_at' => now()->toISOString(),
        ];
    }
}
