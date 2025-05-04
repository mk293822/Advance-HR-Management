<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Enums\ApprovingEnum;
use App\Http\Resources\LeaveRequestResource;
use App\Models\LeaveRequest;

class LeaveRequestService
{

    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }

    public function getLeaveRequests($request)
    {
        return $this->handleCache->remember('leave_requests', null, function () use ($request) {
            return LeaveRequestResource::collection(
                      LeaveRequest::orderByDesc('start_date')->get()
                )->toArray($request); // Cache the result of the collection conversion
        });
    }

    public function update($request, $id)
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

        return $leaveRequest;
    }
}
