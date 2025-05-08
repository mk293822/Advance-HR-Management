<?php

namespace App\Jobs;

use App\Actions\HandleCache;
use App\Enums\ApprovingEnum;
use App\Enums\AttendanceEnum;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\UpcomingEvents;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
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

            // Leave Request Approve Automation
            $leaveRequests = LeaveRequest::where('end_date', '<', Carbon::today())
                ->where('status', ApprovingEnum::PENDING->value)
                ->get();

            foreach ($leaveRequests as $request) {
                $request->status = ApprovingEnum::REJECTED->value;
                $request->save();
            }

            DB::commit();

            Cache::flush();
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the exception
            Log::error('DailyTaskAutomation Job Failed: ' . $e->getMessage());
        }
    }
}
