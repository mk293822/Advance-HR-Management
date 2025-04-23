<?php

namespace Database\Factories;

use App\Enums\ApprovingEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Random start date in the past 5 months
        $startDate = $this->faker->dateTimeBetween('-5 months', 'now');
        // End date is 1–5 days after start date
        $endDate = (clone $startDate)->modify('+' . rand(1, 5) . ' days');

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'leave_type' => $this->faker->randomElement(['Sick', 'Casual', 'Annual']),
            'reason' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(ApprovingEnum::cases()),
            'approved_by' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
