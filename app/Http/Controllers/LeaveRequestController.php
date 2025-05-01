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

    public function update(LeaveRequestRequest $request, string $id)
    {

        $this->handleCache->clear([
            'leave_requests',
            'leave_requests_links',
            'leave_requests_today',
            'pending_leave_requests_dashboard',
            'recent_leave_requests_dashboard',
            'leave_request_count_dashboard',
        ]);

        $validatedData = $request->validated();

        if ($validatedData['status'] === 'approved') {
            $validatedData['status'] = ApprovingEnum::APPROVED->value;
        } elseif ($validatedData['status'] === 'rejected') {
            $validatedData['status'] = ApprovingEnum::REJECTED->value;
        } else {
            $validatedData['status'] = ApprovingEnum::PENDING->value;
        }

        $leaveRequest = LeaveRequest::findOrFail($id);

        $leaveRequest->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Leave request updated successfully',
            'data' => (new LeaveRequestResource($leaveRequest))->toArray($request),
        ]);
    }
}
