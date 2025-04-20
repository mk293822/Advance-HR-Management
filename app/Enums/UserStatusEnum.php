<?php

namespace App\Enums;

enum UserStatusEnum: string
{
    case Active = 'Active';
    case Inactive = 'Inactive';
    case Suspended = 'Suspended';
    case Pending = 'Pending';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'User is active',
            self::Inactive => 'User is inactive',
            self::Suspended => 'User is suspended',
            self::Pending => 'User is pending approval',
        };
    }
}
