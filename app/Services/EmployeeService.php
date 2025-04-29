<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\UserResource;
use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use Spatie\Permission\Models\Role;

class EmployeeService
{
    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }

    public function getEmployees($request)
    {
        return $this->handleCache->remember('all_employees_employee', null, function () use ($request) {
            return UserResource::collection(User::all())->toArray($request); // Cache the result of the collection conversion
        });
    }

    public function getDepartments($request)
    {
        return $this->handleCache->remember('all_departments_employee', null, function () use ($request) {
            return DepartmentResource::collection(Department::all())->toArray($request);
        });
    }

    public function getRoles()
    {
        return $this->handleCache->remember('all_roles_employee', null, function () {
            return Role::all()->toArray(fn($role) => [
                 'id' => $role->id,
                 'name' => $role->name,
            ]);
        });
    }

    public function getPositions()
    {
        return $this->handleCache->remember('all_positions_employee', null, function () {
            return Position::all()->toArray(fn($position) => [
                 'id' => $position->id,
                 'name' => $position->name,
            ]);
        });
    }

}
