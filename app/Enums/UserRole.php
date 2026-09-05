<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case User = 'user';
    case KepalaKeluarga = 'kepala_keluarga';
    case Anggota = 'anggota';
    case Pendatang = 'pendatang';

    /**
     * Get human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::User => 'Pengguna Umum',
            self::KepalaKeluarga => 'Kepala Keluarga',
            self::Anggota => 'Anggota Keluarga',
            self::Pendatang => 'Pendatang / Tamu',
        };
    }
}
