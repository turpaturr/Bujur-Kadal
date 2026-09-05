<?php

namespace App\Enums;

enum UserRole: string
{
    case KepalaKeluarga = 'kepala_keluarga';
    case Anggota = 'anggota';
    case Pendatang = 'pendatang';
}
