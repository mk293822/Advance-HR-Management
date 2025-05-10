<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DailyTaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Dashboard Routes
    Route::get("/", [DashboardController::class, "index"])->name("dashboard");

    // Upcoming Event Routes
    Route::post("/UpcomingEvent", [DashboardController::class, "event_store"])->name("upcomingEvent.store");
    Route::put("/UpcomingEvent/{id}", [DashboardController::class, "event_update"])->name("upcomingEvent.update");
    Route::delete("/UpcomingEvent/{id}", [DashboardController::class, "event_destroy"])->name("upcomingEvent.destroy");

    // Daily Tasks
    Route::get("/DailyTasks", [DailyTaskController::class, "index"])->name("dailyTasks")->middleware(['role:admin']);

    // Employee Management Routes
    Route::apiResource('employees', EmployeeController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ])->names([
        'index' => 'employees',
        'store' => 'employees.store',
        'update' => 'employees.update',
        'destroy' => 'employees.destroy',
    ]);

    // Employee Management Routes
    Route::apiResource('attendances', AttendanceController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ])->names([
        'index' => 'attendances',
        'store' => 'attendances.store',
        'update' => 'attendances.update',
        'destroy' => 'attendances.destroy',
    ]);

    // Leave Request Management Routes
    Route::get("/LeaveRequests", [LeaveRequestController::class, "index"])->name("leaveRequests");

    // Leave Request Approving Routes
    Route::put('/LeaveRequests/{id}', [LeaveRequestController::class, 'update'])->name("leaveRequests.update");

    // Department Management Routes
    Route::apiResource('departments', DepartmentController::class)->only([
        'index',
        'store',
        'edit',
        'update',
        'destroy'
    ])->names([
        'index' => 'departments',
        'store' => 'departments.store',
        'update' => 'departments.update',
        'destroy' => 'departments.destroy',
        'edit' => 'departments.edit',
    ]);

    // Settings Routes
    Route::get("/Settings", [SettingsController::class, "index"])->name("settings");
});


Route::middleware('auth')->prefix('profile')->group(function () {
    Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
