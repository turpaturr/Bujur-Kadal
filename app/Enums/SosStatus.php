<?php

namespace App\Enums;

enum SosStatus: string
{
    case Pending = 'pending';
    case Evacuating = 'evacuating';
    case Resolved = 'resolved';
    case FalseAlarm = 'false_alarm';
}
