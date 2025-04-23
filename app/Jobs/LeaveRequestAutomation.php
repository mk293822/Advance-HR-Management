<?php

namespace App\Jobs;

use App\Enums\ApprovingEnum;
use App\Models\LeaveRequest;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;

class LeaveRequestAutomation implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get all leave requests where end date is before today and status is pending
        $leaveRequests = LeaveRequest::where('end_date', '<', Carbon::today())
            ->where('status', ApprovingEnum::PENDING->value)
            ->get();

        // Update status to rejected for all expired leave requests
        foreach ($leaveRequests as $request) {
            $request->status = ApprovingEnum::REJECTED->value;
            $request->save();
        }
    }
}
