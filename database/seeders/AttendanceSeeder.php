<?php

namespace Database\Seeders;

use App\Enums\AttendanceEnum;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $startDate = Carbon::createFromDate(2025, 1, 1);
        $endDate = Carbon::createFromDate(2025, 4, 25);
        $users = User::all();

        // Weighted status pool: more "present", fewer others
        $statusPool = array_merge(
            array_fill(0, 80, AttendanceEnum::PRESENT->value),
            array_fill(0, 5, AttendanceEnum::LATE->value),
            array_fill(0, 5, AttendanceEnum::HALF_DAY->value),
            array_fill(0, 5, AttendanceEnum::LEAVE->value),
            array_fill(0, 5, AttendanceEnum::ABSENT->value)
        );

        foreach ($users as $user) {
            $date = $startDate->copy();

            while ($date <= $endDate) {
                $status = collect($statusPool)->random();

                $checkIn = null;
                $checkOut = null;

                if (in_array($status, ['present', 'late', 'half_day'])) {
                    $checkIn = $date->copy()->setTime(rand(8, 9), rand(0, 59));
                    $checkOut = $date->copy()->setTime(rand(17, 18), rand(0, 59));
                }

                $attendance = Attendance::create([
                    'employee_id' => $user->employee_id,
                    'date' => $date->toDateString(),
                    'status' => $status,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'remarks' => rand(0, 3) ? null : 'Auto generated',
                ]);

                if ($status === 'leave') {
                    LeaveRequest::factory()->create([
                        'attendance_id' => $attendance,
                        'user_id' => $user->id,
                        'employee_id' => $user->employee_id,
                    ]);
                }

                $date->addDay();
            }
        }
    }
}
