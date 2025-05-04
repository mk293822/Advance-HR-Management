<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Http\Requests\DepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use App\Services\DepartmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class DepartmentController extends Controller
{

    public $handleCache;

    public function __construct()
    {
        $this->handleCache = new HandleCache();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, DepartmentService $service)
    {

        $departments = $service->getDepartments($request);

        $pagination_links = $service->getPaginationLinks($request);

        return Inertia::render("Admin/Department", [
            'departments' => $departments,
            'pagination_links' => $pagination_links,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DepartmentRequest $request, DepartmentService $service)
    {
        $department = $service->create($request);

        return response()->json([
            'status' => 'success',
            'message' => 'Department created successfully',
            'data' => (new DepartmentResource($department))->toArray($request)
        ], 200);
    }


    public function edit(string $id, DepartmentService $service)
    {
        $department = Department::findOrFail($id);

        $users = $service->getUsers();

        $header_ids = $service->getHeaderIds();

        return response()->json([
            'status' => 'success',
            'message' => 'Department retrieved successfully',
            'users' => $users,
            'department' => $department->editData,
            'header_ids' => $header_ids,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DepartmentRequest $request, string $id, DepartmentService $service)
    {

        [$department, $unset_header] = $service->update($request, $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Department updated successfully',
            'data' => (new DepartmentResource($department))->toArray($request),
            'unset_header' => $unset_header?->id
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DepartmentRequest $request, string $id)
    {

        $this->handleCache->clear([
            'departments_page' . $request->page,
            'department_links_page_' . $request->page,
            'users_department',
            'header_ids_department',
            'pending_departments_dashboard',
            'department_count_dashboard',
            'all_departments_employee',
        ]);

        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Department deleted successfully',
        ], 200);
    }
}
