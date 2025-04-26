<?php

namespace App\Jobs;

use App\Enums\ApprovingEnum;
use App\Enums\AttendanceEnum;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DailyTaskAutomation implements ShouldQueue
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
        try {
            // Leave Request Approve Automation
            $leaveRequests = LeaveRequest::where('end_date', '<', Carbon::today())
                ->where('status', ApprovingEnum::PENDING->value)
                ->get();

            foreach ($leaveRequests as $request) {
                $request->status = ApprovingEnum::REJECTED->value;
                $request->save();
            }

            // Create daily Attendances for all users
            $users = User::all();
            $today = Carbon::today()->timezone('Asia/Yangon')->format('Y-m-d');
            $todayAttendances = Attendance::whereDate('date', $today)->get();

            DB::beginTransaction();

            foreach ($users as $user) {
                $userAttendanceExists = $todayAttendances->contains('employee_id', $user->employee_id);

                if (!$userAttendanceExists) {
                    Attendance::create([
                        'employee_id' => $user->employee_id,
                        'date' => $today,
                        'status' => AttendanceEnum::ABSENT->value,
                        'check_in' => null,
                        'check_out' => null,
                        'remarks' => null,
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            // Log the exception
            Log::error('DailyTaskAutomation Job Failed: ' . $e->getMessage());
        }
    }
}
