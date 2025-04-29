<?php

namespace App\Observers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DepartmentObserver
{

    public function deleting(Department $department): void
    {
        $users = User::where('department_id', $department->id)->get();

        foreach ($users as $user) {
            $user->department_id = null;
            $user->save();
        }
    }


    public function updated(Department $department)
    {
        try {
            $users = User::where('department_id', $department->id)->get();
            $updatedEmployees = collect($department->participants); // Assuming participants is updated

            DB::beginTransaction();
            // Unassign users who are no longer in the updated list
            $users->each(function ($oldUser) use ($updatedEmployees) {
                if (!$updatedEmployees->contains('employee_id', $oldUser->employee_id)) {
                    $oldUser->department_id = null;
                    $oldUser->save();
                }
            });

            // Assign department_id to new users (or reassign existing ones)
            $updatedEmployees->each(function ($participant) use ($department) {
                // Check if already exists in old users
                if (!$department->users->contains('employee_id', $participant['employee_id'])) {
                    $user = User::where('employee_id', $participant['employee_id'])->first();
                    if ($user) {
                        $user->department_id = $department->id;
                        $user->save();
                    }
                }
            });

            // Update the Header of the Department
            User::where('employee_id', $department->header_id)->update([
                'department_id' => $department->id
            ]);
            DB::commit();
        } catch (\Exception $e) {
            // Handle exception
            DB::rollBack();
            throw $e;
        }
    }


}
