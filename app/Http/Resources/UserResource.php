<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = false;
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'employee_id' => $this->employee_id,
            'department' => (new DepartmentResource($this->department))->toArray($request), // Assuming a relationship with Department
            'position' => $this->position->toArray(fn($position) => [
                'id' => $position->id,
                'name' => $position->name,
            ]),
            'role' => $this->role->toArray(fn($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ]),
            'date_of_birth' => $this->date_of_birth,
            'address' => $this->address,
            'status' => $this->status,
            'date_hired' => $this->date_hired,
            'salary' => $this->salary,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
