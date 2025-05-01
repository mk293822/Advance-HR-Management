<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;

class DepartmentService
{

    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }

    public function getPaginationLinks($request)
    {
        return $this->handleCache->remember('department_links_page_' . $request->page, null, function () {
            return Department::orderByDesc('created_at')->paginate(100)->linkCollection();
        });
    }

    public function getDepartments($request)
    {
        return $this->handleCache->remember('departments_page' . $request->page, null, function () use ($request) {
            return DepartmentResource::collection(Department::orderByDesc('created_at')->paginate(100))->toArray($request); // Cache the result of the collection conversion
        });
    }

    public function getUsers()
    {
        return $this->handleCache->remember('users_department', null, function () {
                return User::all()->map(fn($user) => [
                    'full_name' => $user->full_name,
                    'employee_id' => $user->employee_id
                ])->toArray(); // Cache the mapped user data
            });
    }

    public function getHeaderIds()
    {
        return $this->handleCache->remember('header_ids_department', null, function () {
                return Department::all()->pluck('header_id')->toArray(); // Cache the header_ids
            });
    }
}
