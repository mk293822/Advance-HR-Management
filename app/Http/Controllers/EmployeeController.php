<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEmployeeRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\UserResource;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $time = now()->timezone('Asia/Yangon')->addMinutes(10);

        $all_employees = Cache::remember('all_employees_employee', $time, function () use ($request) {
            return UserResource::collection(User::all())->toArray($request); // Cache the result of the collection conversion
        });

        $all_departments = Cache::remember('all_departments_employee', $time, function () use ($request) {
            return DepartmentResource::collection(Department::all())->toArray($request);
        });

        $all_roles = Cache::remember('all_roles_employee', $time, function () {
            return Role::all()->toArray(fn($role) => [
                 'id' => $role->id,
                 'name' => $role->name,
            ]);
        });

        $all_positions = Cache::remember('all_positions_employee', $time, function () {
            return Position::all()->toArray(fn($position) => [
                 'id' => $position->id,
                 'name' => $position->name,
            ]);
        });

        return Inertia::render("Admin/Employee", [
            "all_employees" => $all_employees,
            "all_departments" => $all_departments,
            "all_roles" => $all_roles,
            "all_positions" => $all_positions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateEmployeeRequest $request)
    {
        Cache::forget('all_employees_employee');
        Cache::forget('all_departments_employee');
        Cache::forget('all_roles_employee');
        Cache::forget('all_birthday_users');
        Cache::forget('birthday_users_today');
        Cache::forget('all_positions_employee');
        Cache::forget('pending_employees_dashboard');



        $validated = $request->validated();

        $validatedEmail = Validator::make($request->only('email'), [
            'email'  => 'required|email|unique:users,email|max:255',
        ])->validate();

        $validated['email'] = $validatedEmail['email'];

        $validated['password'] = bcrypt($validated['password']);
        $validated['email_verified_at'] = now();
        $validated['remember_token'] = null;
        $validated['employee_id'] = 'EMP-' . str_pad(User::count() + 1, 3, '0', STR_PAD_LEFT);

        // Create the employee
        $employee = User::create($validated);

        // Return a response or redirect
        return response()->json([
            'status' => 'success',
            'data' => (new UserResource($employee))->toArray($request),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CreateEmployeeRequest $request, string $id)
    {
         Cache::forget('all_employees_employee');
        Cache::forget('all_departments_employee');
        Cache::forget('all_roles_employee');
        Cache::forget('all_birthday_users');
        Cache::forget('birthday_users_today');
        Cache::forget('all_positions_employee');
        Cache::forget('pending_employees_dashboard');

        $validated = $request->validated();

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
        // Return a response or redirect
        return response()->json([
            'status' => 'success',
            'data' => (new UserResource($employee))->toArray($request),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         Cache::forget('all_employees_employee');
        Cache::forget('all_departments_employee');
        Cache::forget('all_roles_employee');
        Cache::forget('all_birthday_users');
        Cache::forget('birthday_users_today');
        Cache::forget('all_positions_employee');
        Cache::forget('pending_employees_dashboard');
        Cache::forget('employee_count_dashboard');
        // Find the employee by ID
        $employee = User::findOrFail($id);

        Department::where('header_id', $employee->employee_id)->first()->update([
            'header_id' => null,
        ]);

        Attendance::where('employee_id', $employee->employee_id)->delete();

        // Delete the employee
        $employee->delete();

        // Return a response or redirect
        return response()->json([
            'status' => 'success',
        ]);
    }
}
