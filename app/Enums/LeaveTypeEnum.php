<?php

namespace App\Enums;

enum LeaveTypeEnum: string
{
    case SICK = 'Sick';
    case CASUAL = 'Casual';
    case ANNUAL = 'Annual';
}
