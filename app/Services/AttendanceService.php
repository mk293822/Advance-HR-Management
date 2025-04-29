<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;

class AttendanceService
{

    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }

    public function getAttendances($request)
    {
        return $this->handleCache->remember('attendances_page_' . $request->page, null, function () use ($request) {
            return AttendanceResource::collection(Attendance::orderByDesc('date')->paginate(100))->toArray($request);
        });
    }

    public function getPaginationLinks($request)
    {
        return $this->handleCache->remember('attendance_links_page_' . $request->page, null, function () use ($request) {
            return Attendance::orderByDesc('date')->paginate(100)->linkCollection();
        });
    }
}
