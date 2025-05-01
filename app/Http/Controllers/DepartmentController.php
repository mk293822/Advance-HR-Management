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

        $header_ids = $service->getHeaderIds();

        $users = $service->getUsers();

        $pagination_links = $service->getPaginationLinks($request);

        return Inertia::render("Admin/Department", [
            'departments' => $departments,
            'users' => $users,
            'header_ids' => $header_ids,
            'pagination_links' => $pagination_links,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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

        DB::beginTransaction();
        try {

            $validatedData = $request->validated();

            // Checking participants and header are already in a department
            $header_ids = Department::pluck('header_id')->toArray();

            if (in_array($validatedData['header_id'], $header_ids)) {
                $validatedData['header_id'] = null;
            }

            $conflictingParticipants = collect($validatedData['participants'])
                ->filter(fn($p) => in_array($p['employee_id'], $header_ids));

            if ($conflictingParticipants->isNotEmpty()) {
                $validatedData['header_id'] = null;
            }

            $department = Department::create($validatedData);

            collect($validatedData['participants'])->map(function ($participant) use ($department) {
                User::where("employee_id", $participant['employee_id'])->update([
                    'department_id' => $department->id
                ]);
            });

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
             throw $e;
        }


        return response()->json([
            'status' => 'success',
            'data' => (new DepartmentResource($department))->toArray($request)
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
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
        // Validate the request data
        $validatedData = $request->validated();

        // Find the department, or fail if not found
        $department = Department::findOrFail($id);

         // Update the department (observer will handle the logic for participants and header_id)
        $department->update($validatedData);


        // Handle department header
        if (isset($validatedData['header_id'])) {
            // Update the Header of the Department
            User::where('employee_id', $department->header_id)->update([
                'department_id' => $department->id
            ]);

            // Unset the header if it conflicts with another department
            $unset_header = Department::where('id', '!=', $department->id)
                ->where('header_id', $department->header_id)
                ->first();

            if ($unset_header) {
                $unset_header->header_id = null;
                $unset_header->save();
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => (new DepartmentResource($department))->toArray($request),
            'unset_header' => $unset_header?->id
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
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
        ], 200);
    }
}
