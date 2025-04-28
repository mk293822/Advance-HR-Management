<?php

namespace App\Http\Controllers;

use App\Enums\ApprovingEnum;
use App\Enums\AttendanceEnum;
use App\Enums\LeaveTypeEnum;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $attendances = Attendance::orderByDesc('date')->paginate(100);

        $attendances_datas = AttendanceResource::collection(Attendance::orderByDesc('date')->paginate(100))->toArray($request);

        return Inertia::render('Admin/Attendance', [
            'attendances' => $attendances_datas,
            'links' => $attendances->linkCollection(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $userid = Auth::id();
        $validatedData = $request->validate([
            'status' => 'required|string',
            'date' => 'nullable|date',
            'check_out' => 'nullable|date_format:H:i:s',
            'check_in' => 'nullable|date_format:H:i:s',
            'remark' => 'nullable|string',
        ]);

        $attendance = Attendance::findOrFail($id);

        $attendance->update($validatedData);

        $today = Carbon::today()->timezone('Asia/Yangon');

        if($attendance->status === AttendanceEnum::LEAVE->value){

            $leaveRequest = LeaveRequest::where('attendance_id', $attendance->id)->first();
            if ($leaveRequest) {
                $leaveRequest->update([
                    'user_id' => $userid,
                    'attendance_id' => $attendance->id,
                    'start_date' => $today,
                    'end_date' => $today,
                    'employee_id' => $attendance->employee_id,
                    'leave_type' => LeaveTypeEnum::CASUAL->value,
                ]);
            } else {
                LeaveRequest::create([
                    'user_id' => $userid,
                    'attendance_id' => $attendance->id,
                    'start_date' => $today,
                    'end_date' => $today,
                    'employee_id' => $attendance->employee_id,
                    'leave_type' => LeaveTypeEnum::CASUAL->value,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => (new AttendanceResource($attendance))->toArray($request)
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
