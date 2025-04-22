<?php

namespace App\Observers;

use App\Models\Department;
use App\Models\User;

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
}
