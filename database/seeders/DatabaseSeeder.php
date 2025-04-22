<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Position;
use App\Models\UpcomingEvents;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            RolePermissionSeeder::class,
        ]);

        $departmentNames = [
            'Human Resources',
            'Marketing',
            'Finance',
            'Engineering',
            'Sales',
            'Product Management',
            'Operations',
            'IT Support',
            'Customer Service',
            'Research and Development',
        ];

        $departments = Department::factory()
            ->count(count($departmentNames))
            ->sequence(fn($sequence) => [
                'name' => $departmentNames[$sequence->index],
            ])
            ->create();

        $positions = [
            'Software Engineer',
            'Project Manager',
            'HR Manager',
            'Data Scientist',
            'Product Manager',
            'Sales Representative',
            'Marketing Specialist',
            'Graphic Designer',
            'UX/UI Designer',
            'Business Analyst',
            'System Administrator',
            'Database Administrator',
            'Network Engineer',
            'Front-End Developer',
            'Back-End Developer',
            'Full-Stack Developer',
            'Mobile Developer',
            'Quality Assurance Tester',
            'Content Writer',
            'SEO Specialist',
        ];

        Position::factory()
            ->count(count($positions))
            ->sequence(fn($sequence) => ["name" => $positions[$sequence->index]])
            ->create();

        User::factory()->create([
            'name' => 'minkhant',
            'email' => 'mkt293822@gmail.com',
            'role_id' => Role::where('name', 'Admin')->first()->id,
        ]);

        $user = User::factory(50)->create();

        $employee_ids = User::inRandomOrder()
            ->limit(count($departmentNames))
            ->pluck('employee_id')
            ->toArray();

        $departments->each(function ($dep, $index) use ($employee_ids) {
            $dep->update([
                'header_id' => $employee_ids[$index],
            ]);
        });

        UpcomingEvents::factory(20)->create();

        Attendance::factory(10)
            ->count(count($user))
            ->sequence(fn($sequence) => ["user_id" => $user[$sequence->index]->id])
            ->create();

        LeaveRequest::factory(20)->create();
    }
}
