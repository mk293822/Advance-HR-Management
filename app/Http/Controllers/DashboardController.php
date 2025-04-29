<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Http\Requests\UpcomingEventRequest;
use App\Http\Resources\UpcomingEventResource;
use App\Models\UpcomingEvents;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class DashboardController extends Controller
{

    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request, DashboardService $service)
    {

        $chart_type = $request->query('chart', 'day');

        $pending_approvals = $service->getPendingApprovals();
        $leave_requests = $service->getRecentLeaveRequests($request);
        $upcoming_events = $service->getUpcomingEvents($request);
        $attendances = $service->getAllAttendances($chart_type);
        $counts = $service->getCounts();

        return Inertia::render("Admin/Dashboard", array_merge(
            $counts,
            [
            'pending_approvals' => $pending_approvals,
            'leave_requests' => $leave_requests,
            'upcoming_events' => $upcoming_events,
            'attendances' => $attendances,
            'chart_type' => $chart_type,
            ]
        ));
    }



    /**
     * Upcoming Event Section
     */
    public function event_store(UpcomingEventRequest $request)
    {
        $this->handleCache->clear(['upcoming_events_dashboard', 'today_upcoming_events']);

        $user = Auth::user();
        $validate = $request->validated();

        $validate['created_by'] = $user->id;
        $validate['updated_by'] = $user->id;

        $event = UpcomingEvents::create($validate);

        if (!$event) {
            throw new \Exception('Failed to create event.');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Event created successfully',
            'data' => (new UpcomingEventResource($event))->toArray($request),
        ], 200);
    }

    public function event_update(UpcomingEventRequest $request, string $id)
    {

        $this->handleCache->clear(['upcoming_events_dashboard', 'today_upcoming_events']);

        $user = Auth::user();
        $event = UpcomingEvents::findOrFail($id);

        $validate = $request->validated();

        $validate['updated_by'] = $user->id;

        $event->update($validate);

        return response()->json([
            'status' => 'success',
            'message' => 'Event updated successfully',
            'data' => (new UpcomingEventResource($event))->toArray($request),
        ], 200);
    }

    public function event_destroy(string $id)
    {
        $this->handleCache->clear(['upcoming_events_dashboard', 'today_upcoming_events']);

        $event = UpcomingEvents::findOrFail($id);

        $event->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Event deleted successfully',
        ], 200);
    }
}
