<?php

namespace App\Http\Controllers;

use App\Services\DailyTaskService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyTaskController extends Controller
{
    public function index(Request $request, DailyTaskService $dailyTaskService)
    {
        // Attendances
        $attendances = $dailyTaskService->getAttendances($request);

        // Leave requests
        $leave_requests = $dailyTaskService->getLeaveRequests($request);

        // Upcoming events
        $upcoming_events = $dailyTaskService->getUpcomingEvents($request);

        // Birthday users
        $birthday_users = $dailyTaskService->getBirthdayUsers($request);

        return Inertia::render('Admin/DailyTask', [
            'attendances' => $attendances,
            'leave_requests' => $leave_requests,
            'birthday_users' => $birthday_users,
            'upcoming_events' => $upcoming_events,
        ]);
    }

}
