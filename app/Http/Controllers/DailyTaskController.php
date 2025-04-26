<?php

namespace App\Http\Controllers;

use App\Enums\ApprovingEnum;
use App\Enums\AttendanceEnum;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Resources\UserResource;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DailyTaskController extends Controller
{
    public function index(Request $request)
    {
        // Attendances
        $attendances = AttendanceResource::collection(Attendance::where('date', today())
            ->orderByDesc('date')
            ->get())->toArray(request());

        // Leave requests
        $leave_requests = LeaveRequestResource::collection(LeaveRequest::where('start_date', today())
            ->where('status', ApprovingEnum::PENDING->value)->get())->toArray($request);

        // Birthday users
        $today = Carbon::today()->timezone('Asia/Yangon');

        $users = User::whereNotNull('date_of_birth') // Optional: only users with DOB
            ->get()
            ->filter(function ($user) use ($today) {
                return Carbon::parse($user->date_of_birth)->format('m-d') == $today->format('m-d');
            });

        $birthday_users = UserResource::collection($users)->toArray($request);

        return Inertia::render('Admin/DailyTask', [
            'attendances' => $attendances,
            'leave_requests' => $leave_requests,
            'birthday_users' => $birthday_users,
        ]);
    }

    public function store(Request $request)
    {
        // Store daily task logic
    }

    public function update(Request $request, $id)
    {
        // Update daily task logic
    }

    public function destroy($id)
    {
        // Delete daily task logic
    }
}
