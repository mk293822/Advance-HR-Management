<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
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
            'description' => $this->description,
            'header_id' => $this->header_id,
            'employees_count' => $this->employees->count(),
            'participants' => $this->employees->map(fn($emp) => [
                'employee_id' => $emp->employee_id,
                'full_name' => $emp->first_name . ' ' . $emp->last_name,
            ])->toArray(),
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
