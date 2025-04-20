<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UpcomingEvents extends Model
{
    /** @use HasFactory<\Database\Factories\UpcomingEventsFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'start_date',
        'end_date',
        'description',
        'created_by',
        'updated_by',
    ];
}
