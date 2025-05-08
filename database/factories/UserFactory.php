<?php

namespace Database\Factories;

use App\Enums\RoleEnum;
use App\Enums\UserStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $directory = 'avatars/' . Str::random(32);
        Storage::makeDirectory($directory);

        // Generate a fake image and store it in the directory
        $fakeFile = UploadedFile::fake()->image('avatar.png');
        $path = $fakeFile->store($directory, 'public');

        return [
            'name' => fake()->userName(),
            'email' => fake()->unique()->safeEmail(),

            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'phone' => $this->faker->phoneNumber,
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'date_of_birth' => $this->faker->date('Y-m-d', '-20 years'),
            'address' => $this->faker->address,
            'avatar' => $path,

            'employee_id' => 'EMP-' . $this->faker->unique()->numerify('###'),
            'position_id' => $this->faker->randomElement(Position::pluck('id')->toArray()),
            'role_id' => $this->faker->randomElement(Role::pluck('id')->toArray()),
            'date_hired' => $this->faker->date('Y-m-d', 'now'),
            'salary' => $this->faker->randomFloat(2, 300000, 1200000),
            'status' => $this->faker->randomElement(UserStatusEnum::cases()),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
