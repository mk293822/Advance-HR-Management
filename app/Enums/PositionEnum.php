<?php

// app/Enums/Position.php
namespace App\Enums;

enum Position: string
{
    case SOFTWARE_ENGINEER = 'Software Engineer';
    case MARKETING_MANAGER = 'Marketing Manager';
    case ACCOUNTANT = 'Accountant';
    case SALES_EXECUTIVE = 'Sales Executive';
    case CUSTOMER_SUPPORT = 'Customer Support Representative';
    case HR_SPECIALIST = 'HR Specialist';
    case PROJECT_MANAGER = 'Project Manager';
}
