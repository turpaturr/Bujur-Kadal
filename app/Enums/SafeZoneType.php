<?php

namespace App\Enums;

enum SafeZoneType: string
{
    case Puskesmas = 'puskesmas';
    case PoskoRelawan = 'posko_relawan';
    case RumahSakit = 'rumah_sakit';
}
