<?php

namespace App\Http\Resources;

use App\Models\User;
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
        $header = User::where('employee_id', $this->header_id)->first();
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'header' => $header ?  [
                'full_name' => $header->full_name,
                'employee_id' => $header->employee_id,
            ] : null,
            'employees_count' => $this->employees->count(),
            'participants' => $this->employees->map(fn($emp) => [
                'employee_id' => $emp->employee_id,
                'full_name' => $emp->full_name,
            ])->toArray(),
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
