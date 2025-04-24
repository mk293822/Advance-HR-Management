<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use Illuminate\Http\Request;
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
        $validatedData = $request->validate([
            'status' => 'required|string',
            'date' => 'required|date',
            'check_out' => 'nullable|date_format:H:i:s',
            'check_in' => 'nullable|date_format:H:i:s',
            'remark' => 'nullable|string',
        ]);

        $attendance = Attendance::findOrFail($id);

        $attendance->update($validatedData);

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
