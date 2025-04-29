<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\UserResource;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\User;
use App\Services\EmployeeService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, EmployeeService $employeeService)
    {

        $all_employees = $employeeService->getEmployees($request);

        $all_departments = $employeeService->getDepartments($request);

        $all_roles = $employeeService->getRoles();

        $all_positions = $employeeService->getPositions();

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
    public function store(EmployeeRequest $request)
    {

        $this->handleCache->clear([
            'all_employees_employee',
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

        $validated['email'] = $validatedEmail['email'];

        $validated['password'] = bcrypt($validated['password']);
        $validated['email_verified_at'] = now();
        $validated['remember_token'] = null;
        $validated['employee_id'] = 'EMP-' . str_pad(User::count() + 1, 3, '0', STR_PAD_LEFT);

        // Create the employee
        $employee = User::create($validated);

        if(!$employee){
            throw new Exception('Fail to Create Employee');
        }

        // Return a response or redirect
        return response()->json([
            'status' => 'success',
            'data' => (new UserResource($employee))->toArray($request),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeRequest $request, string $id)
    {
         $this->handleCache->clear([
            'all_employees_employee',
            'all_departments_employee',
            'all_roles_employee',
            'all_birthday_users',
            'birthday_users_today',
            'all_positions_employee',
            'pending_employees_dashboard'
        ]);

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
         $this->handleCache->clear([
            'all_employees_employee',
            'all_departments_employee',
            'all_roles_employee',
            'all_birthday_users',
            'birthday_users_today',
            'all_positions_employee',
            'pending_employees_dashboard',
            'employee_count_dashboard'
        ]);
        // Find the employee by ID
        DB::beginTransaction();
        try {
            $employee = User::findOrFail($id);

            Department::where('header_id', $employee->employee_id)->first()->update([
                'header_id' => null,
            ]);

            Attendance::where('employee_id', $employee->employee_id)->delete();

            // Delete the employee
            $employee->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        // Return a response or redirect
        return response()->json([
            'status' => 'success',
        ], 200);
    }
}
