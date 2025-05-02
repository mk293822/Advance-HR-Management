<?php

namespace App\Actions;

use App\Enums\ApprovingEnum;
use App\Enums\AttendanceEnum;
use App\Enums\LeaveTypeEnum;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class RecordAttendance
{


    public function update($id, $validatedData)
    {
        DB::beginTransaction();

        try {
            $attendance = Attendance::findOrFail($id);
            $attendance->update($validatedData);

            $today = Carbon::today()->timezone('Asia/Yangon')->format('Y-m-d');

            $leaveRequest = null;

            if ($attendance->status === AttendanceEnum::LEAVE->value) {
                $user = User::where('employee_id', $attendance->employee_id)->firstOrFail();

                $leaveRequest = LeaveRequest::updateOrCreate(
                    ['attendance_id' => $attendance->id],
                    [
                        'user_id' => $user->id,
                        'start_date' => $today,
                        'end_date' => $today,
                        'employee_id' => $attendance->employee_id,
                        'leave_type' => LeaveTypeEnum::CASUAL->value,
                        'status' => ApprovingEnum::PENDING->value,
                    ]
                );
            } else {
                $leave_Request = LeaveRequest::where('attendance_id', $attendance->id)->first();
                $leaveRequest = $leave_Request;
                if ($leave_Request) {
                    $leave_Request->delete();
                }
            }

            DB::commit();
            return [$attendance, $leaveRequest];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
