<?php

namespace Database\Factories;

use App\Enums\AttendanceEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(AttendanceEnum::cases())->value;

        $check_in = null;
        $check_out = null;

        // If status is present, generate check-in and check-out times
        if ($status === 'present' || $status === 'late') {
            $check_in = $this->faker->time('H:i');
            $check_out = $this->faker->time('H:i');
        }

        // If status is 'half_day', generate only check-in time
        if ($status === 'half_day') {
            $check_in = $this->faker->time('H:i');
        }

        return [
            'date' => $this->faker->date(),
            'status' => $status,
            'check_in' => $check_in,
            'check_out' => $check_out,
            'remarks' => $this->faker->sentence(),
        ];
    }
}
