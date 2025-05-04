<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\UserResource;
use App\Services\EmployeeService;
use Exception;
use Illuminate\Http\Request;
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
    public function store(EmployeeRequest $request, EmployeeService $service)
    {
        $employee = $service->createEmployee($request);

        // Return a response or redirect
        return response()->json([
            'status' => 'success',
            'message' => 'Employee Created Successfully',
            'data' => (new UserResource($employee))->toArray($request),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeRequest $request, string $id, EmployeeService $service)
    {
        $employee = $service->updateEmployee($request, $id);
        // Return a response or redirect
        return response()->json([
            'status' => 'success',
            'message' => 'Employee Updated Successfully',
            'data' => (new UserResource($employee))->toArray($request),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id, EmployeeService $service)
    {
        $service->deleteEmployee($request, $id);
        // Return a response or redirect
        return response()->json([
            'status' => 'success',
            'message' => 'Employee Deleted Successfully',
        ], 200);
    }
}
