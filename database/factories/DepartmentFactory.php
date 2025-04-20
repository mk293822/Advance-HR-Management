<?php

namespace Database\Factories;

use App\Enums\UserStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Department>
 */
class DepartmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {


        return [
            'description' => $this->faker->sentence,
            'head' => $this->faker->name,
            'status' => $this->faker->randomElement(UserStatusEnum::cases())->value,
        ];
    }
}
