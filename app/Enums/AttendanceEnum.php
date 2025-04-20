<?php

namespace App\Enums;

enum AttendanceEnum: string
{
    case PRESENT = 'present';
    case ABSENT = 'absent';
    case LEAVE = 'leave';
    case LATE = 'late';
    case HALF_DAY = 'half_day';
}
