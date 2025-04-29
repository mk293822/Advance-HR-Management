<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Resources\UpcomingEventResource;
use App\Http\Resources\UserResource;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\UpcomingEvents;
use App\Models\User;
use Illuminate\Support\Carbon;

class DailyTaskService
{

    public $handleCache;
    public $today;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
        $this->today = Carbon::today()->timezone('Asia/Yangon');
    }

    public function getAttendances($request)
    {
        return $this->handleCache->remember('attendances_today', null, function () use ($request) {
            return AttendanceResource::collection(Attendance::where('date', $this->today->format('Y-m-d'))
                        ->orderByDesc('date')
                        ->get())->toArray($request);
        });
    }

    public function getLeaveRequests($request)
    {
        return $this->handleCache->remember('leave_requests_today', null, function () use ($request) {
            return LeaveRequestResource::collection(LeaveRequest::where('start_date', $this->today)->get())->toArray($request);
        });
    }

    public function getBirthdayUsers($request)
    {
        $users = $this->handleCache->remember('all_birthday_users', null, function () {
            return User::whereNotNull('date_of_birth') // Optional: only users with DOB
                        ->get()
                        ->filter(function ($user) {
                            return Carbon::parse($user->date_of_birth)->format('m-d') == $this->today->format('m-d');
                        });
        });

        $birthday_users = $this->handleCache->remember('birthday_users_today', null, function () use ($users, $request) {
            return UserResource::collection($users)->toArray($request);
        });

        return $birthday_users;
    }

    public function getUpcomingEvents($request)
    {
         return $this->handleCache->remember('today_upcoming_events', null, function () use ($request) {
            return UpcomingEventResource::collection(UpcomingEvents::whereBetween('start_date', [$this->today->format('Y-m-d'), $this->today->endOfWeek()->format('Y-m-d')])
                        ->orderBy('start_date')
                        ->get())->toArray($request);
        });
    }
}
