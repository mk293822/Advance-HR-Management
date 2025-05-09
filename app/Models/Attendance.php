<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;
    protected $fillable = [
        'employee_id',
        'date',
        'status',
        'check_in',
        'check_out',
        'remarks',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
