<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $departments = DepartmentResource::collection(Department::all())->toArray($request);

        $users = User::all()->map(fn($user) => [
            'full_name' => $user->first_name . ' ' . $user->last_name,
            'employee_id' => $user->employee_id
        ])->toArray();

        return Inertia::render("Admin/Department", [
            'departments' => $departments,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'header_id' => 'required|string|exists:users,employee_id',
            'description' => 'nullable|string|max:500',
            'status' => 'required|string',
            'participants' => 'array',
            'participants.*.employee_id' => 'string|exists:users,employee_id',
            'participants.*.full_name' => 'string'
        ]);

        $department = Department::create($validatedData);

        collect($validatedData['participants'])->map(function ($participant) use ($department) {
            User::where("employee_id", $participant['employee_id'])->update([
                'department_id' => $department->id
            ]);
        });

        return response()->json([
            'satus' => 'success',
            'data' => DepartmentResource::collection(Department::all())->toArray($request)
        ], 201);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'header_id' => 'required|string|exists:users,employee_id',
            'description' => 'nullable|string|max:500',
            'status' => 'required|string',
            'participants' => 'array',
            'participants.*.employee_id' => 'string|exists:users,employee_id',
            'participants.*.full_name' => 'string'
        ]);

        $department = Department::findOrFail($id);
        $users = User::where('department_id', $department->id)->get();
        $department->update($validatedData);

        $updatedEmployees = collect($validatedData['participants']);
        $oldEmployees = $users;
        $departmentId = $department->id;

        // Unassign users who are no longer in the updated list
        $oldEmployees->each(function ($oldUser) use ($updatedEmployees) {
            if (!$updatedEmployees->contains('employee_id', $oldUser->employee_id)) {
                $oldUser->department_id = null;
                $oldUser->save();
            }
        });

        // Assign department_id to new users (or reassign existing ones)
        $updatedEmployees->each(function ($participant) use ($oldEmployees, $departmentId) {
            // Check if already exists in old users
            if ($oldEmployees->contains('employee_id', $participant['employee_id'])) return;

            // Not in old users → new participant
            $user = User::where('employee_id', $participant['employee_id'])->first();
            if ($user) {
                $user->department_id = $departmentId;
                $user->save();
            }
        });

        // Update the Header of the Department
        User::where('employee_id', $department->header_id)->update([
            'department_id' => $department->id
        ]);

        $unset_header = Department::where('id', '!=', $department->id)
            ->where('header_id', $department->header_id)
            ->first();

        if ($unset_header) {
            $unset_header->header_id = null;
            $unset_header->save();
        }
        return response()->json([
            'status' => 'success',
            'data' => (new DepartmentResource($department))->toArray($request),
            'unset_header' => $unset_header->id
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json([
            'status' => 'success',
        ]);
    }
}
