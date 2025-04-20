<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case HR_MANAGER = 'hr_manager';
    case EMPLOYEE = 'employee';
    case SUPERVISOR = 'supervisor';
    case INTERN = 'intern';
}
