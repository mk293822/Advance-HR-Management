<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Enums\ApprovingEnum;
use App\Http\Requests\LeaveRequestRequest;
use App\Http\Resources\LeaveRequestResource;
use App\Models\LeaveRequest;
use App\Services\LeaveRequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, LeaveRequestService $leaveRequestService)
    {

        $leave_requests = $leaveRequestService->getLeaveRequests($request);

        return Inertia::render("Admin/LeaveRequest", [
            'leave_requests' => $leave_requests,
        ]);
    }

    public function update(LeaveRequestRequest $request, string $id, LeaveRequestService $service)
    {

        $leaveRequest = $service->update($request, $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Leave request updated successfully',
            'data' => (new LeaveRequestResource($leaveRequest))->toArray($request),
        ]);
    }
}
