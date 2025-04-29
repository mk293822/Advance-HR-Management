<?php

namespace App\Actions;

use App\Enums\AttendanceEnum;
use App\Enums\LeaveTypeEnum;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class RecordAttendance
{
    public function __construct()
    {
        //
    }

    public function update($id, $validatedData)
    {
        DB::beginTransaction();

        try {
            $attendance = Attendance::findOrFail($id);
            $attendance->update($validatedData);

            $today = Carbon::today()->timezone('Asia/Yangon');

            if ($attendance->status === AttendanceEnum::LEAVE->value) {
                $user = User::where('employee_id', $attendance->employee_id)->firstOrFail();

                LeaveRequest::updateOrCreate(
                    ['attendance_id' => $attendance->id],
                    [
                        'user_id' => $user->id,
                        'start_date' => $today,
                        'end_date' => $today,
                        'employee_id' => $attendance->employee_id,
                        'leave_type' => LeaveTypeEnum::CASUAL->value,
                    ]
                );
            } else {
                LeaveRequest::where('attendance_id', $attendance->id)->delete();
            }

            DB::commit();
            return $attendance;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
