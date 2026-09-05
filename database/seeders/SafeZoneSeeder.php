<?php

namespace Database\Seeders;

use App\Enums\SafeZoneType;
use App\Models\SafeZone;
use Illuminate\Database\Seeder;

class SafeZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $safeZones = [
            // Safe Zones di Samarinda & Sekitarnya (Kalimantan Timur)
            [
                'name' => 'RSUD Abdul Wahab Sjahranie (AWS)',
                'type' => SafeZoneType::RumahSakit,
                'latitude' => -0.48514100,
                'longitude' => 117.14389100,
                'capacity_left' => 150,
            ],
            [
                'name' => 'Puskesmas Segiri Samarinda',
                'type' => SafeZoneType::Puskesmas,
                'latitude' => -0.49080000,
                'longitude' => 117.15120000,
                'capacity_left' => 45,
            ],
            [
                'name' => 'Posko Relawan Karhutla & Oksigen Samarinda Ulu',
                'type' => SafeZoneType::PoskoRelawan,
                'latitude' => -0.49560000,
                'longitude' => 117.13250000,
                'capacity_left' => 80,
            ],
            [
                'name' => 'Puskesmas Palaran Samarinda Seberang',
                'type' => SafeZoneType::Puskesmas,
                'latitude' => -0.56230000,
                'longitude' => 117.17210000,
                'capacity_left' => 30,
            ],
            [
                'name' => 'RSUD Inche Abdoel Moeis Samarinda Seberang',
                'type' => SafeZoneType::RumahSakit,
                'latitude' => -0.53720000,
                'longitude' => 117.12640000,
                'capacity_left' => 90,
            ],

            // Safe Zones di Balikpapan
            [
                'name' => 'RSUD Dr. Kanujoso Djatiwibowo Balikpapan',
                'type' => SafeZoneType::RumahSakit,
                'latitude' => -1.22870000,
                'longitude' => 116.86210000,
                'capacity_left' => 120,
            ],
            [
                'name' => 'Puskesmas Klandasan Ilir Balikpapan',
                'type' => SafeZoneType::Puskesmas,
                'latitude' => -1.27210000,
                'longitude' => 116.83450000,
                'capacity_left' => 40,
            ],
            [
                'name' => 'Posko Siaga Karhutla BPBD Balikpapan Utara',
                'type' => SafeZoneType::PoskoRelawan,
                'latitude' => -1.20540000,
                'longitude' => 116.87890000,
                'capacity_left' => 65,
            ],

            // Safe Zones di Palangka Raya (Kalimantan Tengah - Wilayah Rawan Karhutla Gambut)
            [
                'name' => 'RSUD Doris Sylvanus Palangka Raya',
                'type' => SafeZoneType::RumahSakit,
                'latitude' => -2.21040000,
                'longitude' => 113.92150000,
                'capacity_left' => 110,
            ],
            [
                'name' => 'Puskesmas Pahandut Palangka Raya',
                'type' => SafeZoneType::Puskesmas,
                'latitude' => -2.21850000,
                'longitude' => 113.92840000,
                'capacity_left' => 50,
            ],
            [
                'name' => 'Posko Relawan Evakuasi Kabut Asap Sabaru',
                'type' => SafeZoneType::PoskoRelawan,
                'latitude' => -2.27410000,
                'longitude' => 113.93120000,
                'capacity_left' => 70,
            ],
        ];

        foreach ($safeZones as $zone) {
            SafeZone::updateOrCreate(
                ['name' => $zone['name']],
                $zone
            );
        }
    }
}
