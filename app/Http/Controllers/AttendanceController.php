<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Actions\RecordAttendance;
use App\Enums\ApprovingEnum;
use App\Enums\AttendanceEnum;
use App\Enums\LeaveTypeEnum;
use App\Http\Requests\AttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\AttendanceService;
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
    public function index(Request $request, AttendanceService $attendanceService)
    {

        $attendances_datas = $attendanceService->getAttendances($request);

        $paginationLinks = $attendanceService->getPaginationLinks($request);

        return Inertia::render('Admin/Attendance', [
            'attendances' => $attendances_datas,
            'links' => $paginationLinks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AttendanceRequest $request, string $id, HandleCache $handleCache, RecordAttendance $recordAttendance)
    {
        $handleCache->clear([
            'attendances_page_' . $request->page,
            'attendance_links_page_' . $request->page,
            'attendances_today',
            'leave_requests_today',
            'leave_request_count_dashboard',
            'all_attendances_dashboard',
            'recent_leave_requests_dashboard',
            'pending_leave_requests_dashboard',
            'leave_requests',
            'attendances_dashboard'
        ]);

        $validatedData = $request->validated();

        $attendance = $recordAttendance->update($id, $validatedData);

        return response()->json([
            'status' => 'success',
            'data' => (new AttendanceResource($attendance))->toArray($request)
        ], 200);
    }


}
