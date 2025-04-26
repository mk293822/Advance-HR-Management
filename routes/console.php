<?php

use App\Jobs\DailyTaskAutomation;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schdules
Schedule::job(new DailyTaskAutomation())
    ->everySecond()
    // ->dailyAt('08:00')
    // ->timezone('Asia/Yangon')
    ->onSuccess(function () {
        echo ('DailyTaskAutomation job executed successfully.');
    })
    ->onFailure(function () {
        echo ('DailyTaskAutomation job failed.');
    });
