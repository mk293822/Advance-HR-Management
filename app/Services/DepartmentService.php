<?php

namespace App\Services;

use App\Actions\HandleCache;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\DB;

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

    public function create($request)
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

            return $department;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update($request, $id)
    {

        try {
            DB::beginTransaction();

            $this->handleCache->clear([
                'departments_page' . $request->page,
                'department_links_page_' . $request->page,
                'users_department',
                'header_ids_department',
                'pending_departments_dashboard',
                'department_count_dashboard',
                'all_departments_employee',
                'all_employees_employee_page'
            ]);

            $validatedData = $request->validated();
            $department = Department::findOrFail($id);

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

            $updatedEmployees = collect($validatedData['participants']);

            $users = User::where('department_id', $department->id)->get();


            // Unassign users who are no longer in the updated list
            $users->each(function ($oldUser) use ($updatedEmployees) {
                if (!$updatedEmployees->contains('employee_id', $oldUser->employee_id)) {
                    $oldUser->department_id = null;
                    $oldUser->save();
                }
            });

            // Assign department_id to new users
            $updatedEmployees->each(function ($participant) use ($department) {
                $user = User::where('employee_id', $participant['employee_id'])->first();
                if ($user && $user->department_id !== $department->id) {
                    $user->department_id = $department->id;
                    $user->save();
                }
            });

            DB::commit();

            return [$department, $unset_header];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
