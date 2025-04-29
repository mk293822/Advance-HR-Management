<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $employee = User::where('employee_id', $this->employee_id)->first();
        return [
            'id' => $this->id,
            'employee' => [
                'full_name' => $employee->full_name,
                'employee_id' => $employee->employee_id
            ],
            'status' => $this->status,
            'date' => $this->date,
            'check_in' => $this->check_in,
            'check_out' => $this->check_out,
            'remark' => $this->remarks,
        ];
    }
}
