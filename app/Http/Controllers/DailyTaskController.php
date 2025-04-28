<?php

namespace App\Http\Controllers;

use App\Enums\ApprovingEnum;
use App\Enums\AttendanceEnum;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Resources\UpcomingEventResource;
use App\Http\Resources\UserResource;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\UpcomingEvents;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DailyTaskController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today()->timezone('Asia/Yangon');
        $time = now()->timezone('Asia/Yangon')->addMinutes(10);
        // Attendances
        $attendances = Cache::remember('attendances_today', $time, function () use ($today, $request) {
            return AttendanceResource::collection(Attendance::where('date', $today->format('Y-m-d'))
                        ->orderByDesc('date')
                        ->get())->toArray($request);
        });

        // Leave requests
        $leave_requests = Cache::remember('leave_requests_today', $time, function () use ($today, $request) {
            return LeaveRequestResource::collection(LeaveRequest::where('start_date', $today)
                        ->where('status', ApprovingEnum::PENDING->value)->get())->toArray($request);
        });

        // Birthday users

        $users = Cache::remember('all_birthday_users', $time, function () use ($today) {
            return User::whereNotNull('date_of_birth') // Optional: only users with DOB
                        ->get()
                        ->filter(function ($user) use ($today) {
                            return Carbon::parse($user->date_of_birth)->format('m-d') == $today->format('m-d');
                        });
        });

        $upcoming_events = Cache::remember('today_upcoming_events', $time, function () use ($today, $request) {
            return UpcomingEventResource::collection(UpcomingEvents::whereBetween('start_date', [$today->format('Y-m-d'), $today->endOfWeek()->format('Y-m-d')])
                        ->orderBy('start_date')
                        ->get())->toArray($request);
        });

        $birthday_users = Cache::remember('birthday_users_today', $time, function () use ($users, $request) {
            return UserResource::collection($users)->toArray($request);
        });

        return Inertia::render('Admin/DailyTask', [
            'attendances' => $attendances,
            'leave_requests' => $leave_requests,
            'birthday_users' => $birthday_users,
            'upcoming_events' => $upcoming_events,
        ]);
    }

    public function store(Request $request)
    {
        // Store daily task logic
    }

    public function update(Request $request, $id)
    {
        // Update daily task logic
    }

    public function destroy($id)
    {
        // Delete daily task logic
    }
}
