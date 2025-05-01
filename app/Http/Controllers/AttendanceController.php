<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Actions\RecordAttendance;
use App\Http\Requests\AttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Services\AttendanceService;
use Illuminate\Http\Request;
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
            'recent_leave_requests_dashboard',
            'pending_leave_requests_dashboard',
            'leave_requests',
            'all_attendances_dashboard',
            'attendances_dashboard_day',
            'attendances_dashboard_month',
        ]);

        $validatedData = $request->validated();

        $attendance = $recordAttendance->update($id, $validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Attendance updated successfully',
            'data' => (new AttendanceResource($attendance))->toArray($request)
        ], 200);
    }


}
