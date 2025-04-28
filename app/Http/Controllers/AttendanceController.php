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
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $cacheKey = 'attendances_page_' . $request->page;
        $time = now()->timezone('Asia/Yangon')->addMinutes(10);

        $attendances_datas = Cache::remember($cacheKey,$time, function () use ($request) {
            return AttendanceResource::collection(Attendance::orderByDesc('date')->paginate(100))->toArray($request);
        });

        $paginationLinks = Cache::remember('attendance_links_page_' . $request->page,$time, function () use ($request) {
            return Attendance::orderByDesc('date')->paginate(100)->linkCollection();
        });

        return Inertia::render('Admin/Attendance', [
            'attendances' => $attendances_datas,
            'links' => $paginationLinks,
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
        Cache::forget('attendances_page_' . $request->page);
        Cache::forget('attendance_links_page_' . $request->page);
        Cache::forget('attendances_today');
        Cache::forget('leave_requests_today');
        Cache::forget('leave_request_count_dashboard');
        Cache::forget('all_attendances_dashboard');
        Cache::forget('recent_leave_requests_dashboard');
        Cache::forget('pending_leave_requests_dashboard');

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
