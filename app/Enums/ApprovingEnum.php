<?php

namespace App\Enums;

enum ApprovingEnum: string
{
    case PENDING = 'pending';
    case REJECTED = 'rejected';
    case APPROVED = 'approved';
}
