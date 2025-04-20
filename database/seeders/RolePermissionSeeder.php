<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use App\Enums\RoleEnum; // Import the Role enum
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Permission lists
        $permissions = [
            'create-employee',
            'edit-employee',
            'delete-employee',
            'view-employee',
            'manage-department',
            'view-attendance',
            'mark-attendance',
            'edit-attendance',
            'request-leave',
            'approve-leave',
            'view-leave-request',
            'view-salary',
            'generate-salary-slip',
            'edit-salary',
            'manage-roles',
            'manage-permissions',
            'manage-events',
            'view-events',
        ];

        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::create(['name' => $permission]);
        }

        // Create roles from the Role enum
        $admin = Role::create(['name' => RoleEnum::ADMIN->value]);
        $hr_manager = Role::create(['name' => RoleEnum::HR_MANAGER->value]);
        $employee = Role::create(['name' => RoleEnum::EMPLOYEE->value]);
        $supervisor = Role::create(['name' => RoleEnum::SUPERVISOR->value]);
        $intern = Role::create(['name' => RoleEnum::INTERN->value]);

        // Assign permissions to roles
        $admin->syncPermissions(Permission::all());

        $hr_manager->syncPermissions([
            'create-employee',
            'edit-employee',
            'delete-employee',
            'view-employee',
            'manage-department',
            'view-attendance',
            'mark-attendance',
            'edit-attendance',
            'request-leave',
            'approve-leave',
            'view-leave-request',
            'view-salary',
            'generate-salary-slip'
        ]);

        $employee->syncPermissions([
            'view-attendance',
            'request-leave',
            'view-leave-request',
            'view-salary'
        ]);

        $supervisor->syncPermissions([
            'view-employee',
            'view-attendance',
            'mark-attendance',
            'edit-attendance',
            'request-leave',
            'approve-leave',
            'view-leave-request',
            'view-salary'
        ]);

        $intern->syncPermissions([
            'view-attendance',
            'request-leave',
            'view-leave-request'
        ]);
    }
}
