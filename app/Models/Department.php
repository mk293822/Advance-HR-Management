<?php

namespace App\Models;

use App\Observers\DepartmentObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(DepartmentObserver::class)]
class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'header_id',
        'status'
    ];

    public function employees()
    {
        return $this->hasMany(User::class, 'department_id');
    }

    public function getEditDataAttribute()
    {
        return [
            'name' => $this->name,
            'header_id' => $this->header_id,
            'description' => $this->description,
            'status' => $this->status,
            'participants' => $this->employees->map(function ($employee) {
                return [
                    'full_name' => $employee->full_name,
                    'employee_id' => $employee->employee_id,
                ];
            }),
        ];
    }
}
