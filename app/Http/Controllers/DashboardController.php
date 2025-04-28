<?php

namespace App\Http\Controllers;

use App\Enums\ApprovingEnum;
use App\Http\Resources\UpcomingEventResource;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\LeaveRequest;
use App\Models\UpcomingEvents;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;


class DashboardController extends Controller
{


    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $time = now()->timezone('Asia/Yangon')->addMinutes(10);

        // Pending Tasks - Cache
        $pending_leave_requests = Cache::remember('pending_leave_requests_dashboard', $time, function () {
            return LeaveRequest::where('status', ApprovingEnum::PENDING->value)->count(); // Cache the count directly
        });
        $pending_employees = Cache::remember('pending_employees_dashboard', $time, function () {
            return User::where('status', ApprovingEnum::PENDING->value)->count(); // Cache the count directly
        });
        $pending_departments = Cache::remember('pending_departments_dashboard', $time, function () {
            return Department::where('status', ApprovingEnum::PENDING->value)->count(); // Cache the count directly
        });

        $pending_approvals = [
            'leave_requests_count' => $pending_leave_requests,
            'employees_count' => $pending_employees,
            'departments_count' => $pending_departments,
        ];

        // Recent Leave Requests - Cache
        $leave_requests = Cache::remember('recent_leave_requests_dashboard', $time, function () use ($request) {
            return LeaveRequest::whereYear('start_date', now()->year)
                ->whereMonth('start_date', now()->month)
                ->orderByDesc('start_date')
                ->limit(10)
                ->get()
                ->map(function ($req) {
                    return [
                        'employee_name' => $req->user->first_name . " " . $req->user->last_name,
                        'status' => $req->status,
                        'start_date' => $req->start_date,
                        'end_date' => $req->end_date,
                    ];
                })
                ->toArray(); // Ensure toArray() is called here to store as an array
        });

        // Upcoming Events - Cache
        $upcoming_events = Cache::remember('upcoming_events_dashboard', $time, function () use ($request) {
            return UpcomingEventResource::collection(UpcomingEvents::orderBy('start_date')->get())->toArray($request); // Ensure toArray() is called here
        });

        // Attendance tracking - Cache
        $all_attendances = Cache::remember('all_attendances_dashboard', $time, function () {
            return Attendance::whereYear('date', now()->year)
                ->orderByDesc('date')
                ->get()
                ->toArray(); // Convert to array before caching
        });

        $chart_type = $request->query('chart', 'day');
        $attendances = [];

        if ($chart_type === 'day') {
            $attendances = collect($all_attendances)->whereBetween('date', [
                now()->startOfMonth()->toDateString(),
                now()->endOfMonth()->toDateString()
            ]);
        } elseif ($chart_type === 'month') {
            $attendances = $all_attendances;
        }

        $attendances = collect($attendances)->map(function ($att) {
            return [
                'status' => $att['status'], // Access array element directly
                'date' => $att['date']      // Access array element directly
            ];
        })->toArray();

        return Inertia::render("Admin/Dashboard", [
            'employee_count' => Cache::remember('employee_count_dashboard', $time, function () {
                return User::count();
            }),
            'department_count' => Cache::remember('department_count_dashboard', $time, function () {
                return Department::count();
            }),
            'leave_request_count' => Cache::remember('leave_request_count_dashboard', $time, function () {
                return LeaveRequest::count();
            }),
            'pending_approvals' => $pending_approvals,
            'leave_requests' => $leave_requests,
            'upcoming_events' => $upcoming_events,
            'attendances' => $attendances,
            'chart_type' => $chart_type
        ]);
    }



    /**
     * Upcoming Event Section
     */
    public function event_store(Request $request)
    {
        Cache::forget('upcoming_events_dashboard');
        Cache::forget('today_upcoming_events');


        $user = Auth::user();
        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string|max:1000',
        ]);

        $validate['created_by'] = $user->id;
        $validate['updated_by'] = $user->id;

        $event = UpcomingEvents::create($validate);

        if (!$event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Event creation failed',
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Event created successfully',
            'data' => (new UpcomingEventResource($event))->toArray($request),
        ]);
    }

    public function event_update(Request $request, string $id)
    {
        Cache::forget('upcoming_events_dashboard');
        $user = Auth::user();
        $event = UpcomingEvents::find($id);

        if (!$event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Event not found',
            ], 404);
        }

        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string|max:1000',
        ]);

        $validate['updated_by'] = $user->id;

        $event->update($validate);

        return response()->json([
            'status' => 'success',
            'message' => 'Event updated successfully',
            'data' => (new UpcomingEventResource($event))->toArray($request),
        ]);
    }

    public function event_destroy(string $id)
    {
        Cache::forget('upcoming_events_dashboard');
        $event = UpcomingEvents::find($id);

        if (!$event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Event not found',
            ], 404);
        }

        $event->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Event deleted successfully',
        ]);
    }
}
