<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\UserResource;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use illuminate\Support\Str;

class EmployeeService
{
    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }

    public function getPaginationLinks($request)
    {
        return $this->handleCache->remember('employee_links_page_' . $request->page, null, function () {
            return User::orderByDesc('created_at')->paginate(100)->linkCollection();
        });
    }

    public function getEmployees($request)
    {
        return $this->handleCache->remember('all_employees_employee_page' . $request->page, null, function () use ($request) {
            return UserResource::collection(User::orderByDesc('created_at')->paginate(100))->toArray($request); // Cache the result of the collection conversion
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

    // CRUD Operations

    public function createEmployee($request)
    {
        $this->handleCache->clear([
            'all_employees_employee_page' . $request->page,
            'employee_links_page_' . $request->page,
            'all_departments_employee',
            'all_roles_employee',
            'all_birthday_users',
            'birthday_users_today',
            'all_positions_employee',
            'pending_employees_dashboard'
        ]);

        $validated = $request->validated();

        $validatedEmail = Validator::make($request->only('email'), [
            'email'  => 'required|email|unique:users,email|max:255',
        ])->validate();

        $directory = 'avatars/' . Str::random(32);
        Storage::makeDirectory($directory);

        // Generate a fake image and store it in the directory
        $validated['avatar'] = $validated['avatar']->store($directory, 'public');

        $validated['email'] = $validatedEmail['email'];

        $validated['password'] = bcrypt($validated['password']);
        $validated['email_verified_at'] = now();
        $validated['remember_token'] = null;
        $validated['employee_id'] = 'EMP-' . str_pad(User::count() + 1, 3, '0', STR_PAD_LEFT);

        // Create the employee
        return User::create($validated);
    }

    public function updateEmployee($request, $id)
    {
        $this->handleCache->clear([
            'all_employees_employee_page' . $request->page,
            'employee_links_page_' . $request->page,
            'all_departments_employee',
            'all_roles_employee',
            'all_birthday_users',
            'birthday_users_today',
            'all_positions_employee',
            'pending_employees_dashboard'
        ]);

        $validated = $request->validated();

        $directory = 'avatars/' . Str::random(32);
        Storage::makeDirectory($directory);

        // Generate a fake image and store it in the directory
        $validated['avatar'] = $validated['avatar']->store($directory, 'public');

        $validatedEmail = Validator::make($request->only('email'), [
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($id),
            ],
        ])->validate();

        // Correctly assign the email field from the validated email result
        $validated['email'] = $validatedEmail['email'];

        // Find the employee by ID
        $employee = User::findOrFail($id);


        if (!Hash::check($validated['password'], $employee->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password does not match.'],
            ]);
        }

        // Update the employee
        $employee->update($validated);

        return $employee;
    }

    public function deleteEmployee($request, $id)
    {
        $this->handleCache->clear([
            'all_employees_employee_page' . $request->page,
            'employee_links_page_' . $request->page,
            'all_departments_employee',
            'all_roles_employee',
            'all_birthday_users',
            'birthday_users_today',
            'all_positions_employee',
            'pending_employees_dashboard'
        ]);
        // Find the employee by ID
        DB::beginTransaction();
        try {
            $employee = User::findOrFail($id);

            if ($employee->avatar && Storage::disk('public')->exists($employee->avatar)) {
                Storage::disk('public')->delete($employee->avatar);

                // Optionally delete the directory if it's specific to this user
                $directory = dirname($employee->avatar);
                Storage::disk('public')->deleteDirectory($directory);
            }

            Department::where('header_id', $employee->employee_id)->first()->update([
                'header_id' => null,
            ]);

            Attendance::where('employee_id', $employee->employee_id)->delete();

            // Delete the employee
            $employee->delete();
            DB::commit();
        } catch (Exceptions $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
