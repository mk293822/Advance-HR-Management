<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard Routes
    Route::get("/", [DashboardController::class, "index"])->name("dashboard");

    // Upcoming Event Routes
    Route::post("/UpcomingEvent", [DashboardController::class, "event_store"])->name("upcomingEvent.store");
    Route::put("/UpcomingEvent/{id}", [DashboardController::class, "event_update"])->name("upcomingEvent.update");
    Route::delete("/UpcomingEvent/{id}", [DashboardController::class, "event_destroy"])->name("upcomingEvent.destroy");

    // Employee Management Routes
    Route::get("/Employees", [EmployeeController::class, "index"])->name("employees");
    Route::post("/Employees", [EmployeeController::class, "store"])->name("employees.store");
    Route::put("/Employees/{id}", [EmployeeController::class, "update"])->name("employees.update");
    Route::delete("/Employees/{id}", [EmployeeController::class, "destroy"])->name("employees.destroy");

    // Leave Request Management Routes
    Route::get("/LeaveRequests", [LeaveRequestController::class, "index"])->name("leaveRequests");

    // Department Management Routes
    Route::get("/Departments", [DepartmentController::class, "index"])->name("departments");
    Route::post("/Departments", [DepartmentController::class, "store"])->name("departments.store");
    Route::put("/Departments/{id}", [DepartmentController::class, "update"])->name("departments.update");
    Route::delete("/Departments/{id}", [DepartmentController::class, "destroy"])->name("departments.destroy");

    // Settings Routes
    Route::get("/Settings", [SettingsController::class, "index"])->name("settings");
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
