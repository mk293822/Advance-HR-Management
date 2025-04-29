<?php

namespace App\Services;

use App\Actions\HandleCache;
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
}
