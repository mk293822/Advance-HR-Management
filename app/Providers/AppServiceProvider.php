<?php

namespace App\Providers;

use App\Jobs\DailyTaskAutomation;
use App\Models\Department;
use App\Observers\DepartmentObserver;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        // Schdules
        Schedule::job(new DailyTaskAutomation())
            ->everySecond()
            // ->dailyAt('08:00')
            // ->timezone('Asia/Yangon')
            ->onSuccess(function () {
                echo 'DailyTaskAutomation job executed successfully.';
            })
            ->onFailure(function () {
                echo 'DailyTaskAutomation job failed.';
            });

        Vite::prefetch(concurrency: 3);
        Department::observe(DepartmentObserver::class);
    }
}
