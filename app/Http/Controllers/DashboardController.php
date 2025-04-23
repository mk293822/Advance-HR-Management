<?php

namespace App\Http\Controllers;

use App\Enums\ApprovingEnum;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Resources\UpcomingEventResource;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\LeaveRequest;
use App\Models\UpcomingEvents;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Pest\Laravel\json;

class DashboardController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Pending Tasks
        $pending_approvals = LeaveRequest::where('status', ApprovingEnum::PENDING->value);

        // Recent Leave Requests
        $leave_requests = LeaveRequest::whereYear('start_date', now()->year)
            ->whereMonth('start_date', now()->month)
            ->orderByDesc('start_date')
            ->limit(10)
            ->get()
            ->map(function ($req) {
                return [
                    'employee_name' => $req->user->name,
                    'status' => $req->status,
                    'start_date' => $req->start_date,
                    'end_date' => $req->end_date,
                ];
            })
            ->toArray();


        // Upcoming Events
        $upcoming_events = UpcomingEventResource::collection(UpcomingEvents::orderBy('start_date')->get())->toArray($request);

        // Attendance tracking
        $all_attendances = Attendance::whereYear('date', now()->year)
            ->orderByDesc('date')
            ->get();

        $chart_type = $request->query('chart', 'day');
        $attendances = [];

        if ($chart_type === 'day') {
            $attendances = $all_attendances->whereBetween('date', [
                now()->startOfMonth()->toDateString(),
                now()->endOfMonth()->toDateString()
            ]);
        } elseif ($chart_type === 'month') {
            $attendances = $all_attendances;
        }

        $attendances = collect($attendances)->map(function ($att) {
            return [
                'status' => $att->status,
                'date' => $att->date
            ];
        })->toArray();


        return Inertia::render("Admin/Dashboard", [
            'employee_count' => User::count(),
            'department_count' => Department::count(),
            'leave_request_count' => LeaveRequest::count(),
            'pending_approval_count' => $pending_approvals->count(),
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
