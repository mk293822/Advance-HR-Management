<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Enums\ApprovingEnum;
use App\Enums\UserStatusEnum;
use App\Http\Resources\UpcomingEventResource;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\LeaveRequest;
use App\Models\UpcomingEvents;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }

    public function getPendingApprovals()
    {
        // Pending Tasks - Cache
        $pending_leave_requests = $this->handleCache->remember('pending_leave_requests_dashboard', null, function () {
            return LeaveRequest::where('status', ApprovingEnum::PENDING->value)->count(); // Cache the count directly
        });

        $pending_employees = $this->handleCache->remember('pending_employees_dashboard', null, function () {
            return User::where('status', UserStatusEnum::Pending->value)->count(); // Cache the count directly
        });

        $pending_departments = $this->handleCache->remember('pending_departments_dashboard', null, function () {
            return Department::where('status', UserStatusEnum::Pending->value)->count(); // Cache the count directly
        });

        $pending_approvals = [
            'leave_requests_count' => $pending_leave_requests,
            'employees_count' => $pending_employees,
            'departments_count' => $pending_departments,
        ];

        return $pending_approvals;
    }

    public function getRecentLeaveRequests($request)
    {
         // Recent Leave Requests - Cache
        $leave_requests = $this->handleCache->remember('recent_leave_requests_dashboard',  null, function () use ($request) {
            return LeaveRequest::whereYear('start_date', now()->year)
                ->whereMonth('start_date', now()->month)
                ->orderByDesc('start_date')
                ->limit(10)
                ->get()
                ->map(function ($req) {
                    return [
                        'employee_name' => $req->user->full_name,
                        'status' => $req->status,
                        'start_date' => $req->start_date,
                        'end_date' => $req->end_date,
                    ];
                })
                ->toArray(); // Ensure toArray() is called here to store as an array
        });

        return $leave_requests;
    }

    public function getUpcomingEvents($request)
    {

        $event_type = $request->query('event_type', 'upcoming');

        // Upcoming Events - Cache
        return $this->handleCache->remember('upcoming_events_dashboard_' . $event_type,  null, function () use ($request, $event_type) {
            if ($event_type === 'upcoming') {
                return UpcomingEventResource::collection(UpcomingEvents::where('end_date', '>=', Carbon::today()->timezone('Asia/Yangon')->format('Y-m-d'))->orderBy('start_date')->get())->toArray($request); // Ensure toArray() is called here
            }
            return UpcomingEventResource::collection(UpcomingEvents::orderBy('start_date')->get())->toArray($request); // Ensure toArray() is called here
        });
    }

    public function getAllAttendances(string $chart_type)
    {
        $chart_type = $chart_type ?? 'day';
        // Attendance tracking - Cache
        $all_attendances = $this->handleCache->remember('all_attendances_dashboard',  null, function () {
            return Attendance::whereYear('date', now()->year)
                ->orderByDesc('date')
                ->get()
                ->toArray(); // Convert to array before caching
        });

        $attendances = [];

        if ($chart_type === 'day') {
            $attendances = collect($all_attendances)->filter(function ($item) {
                $date = $item['date'];
                $start = now()->startOfMonth()->toDateString();
                $end = now()->endOfMonth()->toDateString();
                return $date >= $start && $date <= $end;
            });
        } elseif ($chart_type === 'month') {
            $attendances = $all_attendances;
        }

        $attendances = $this->handleCache->remember("attendances_dashboard_{$chart_type}", null, function() use($attendances){
            return collect($attendances)->map(function ($att) {
                    return [
                        'status' => $att['status'], // Access array element directly
                        'date' => $att['date']      // Access array element directly
                    ];
                })->toArray();
        });


        return $attendances;
    }


    public function getCounts()
    {
        $employee_count = $this->handleCache->remember('employee_count_dashboard',  null, function () {
            return User::count();
        });

        $department_count = $this->handleCache->remember('department_count_dashboard',  null, function () {
            return Department::count();
        });

        $leave_request_count = $this->handleCache->remember('leave_request_count_dashboard',  null, function () {
            return LeaveRequest::count();
        });

        return [
            'employee_count' => $employee_count,
            'department_count' => $department_count,
            'leave_request_count' => $leave_request_count,
        ];
    }


}
