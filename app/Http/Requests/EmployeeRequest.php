<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class EmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
         return [
            'name'            => 'required|string|max:255',
            'password'        => 'required|string|min:8', // assuming password_confirmation field exists
            'first_name'      => 'required|string|max:255',
            'last_name'       => 'required|string|max:255',
            'phone'           => 'nullable|string', // Change to a more specific regex for phone numbers if needed
            'gender'          => 'nullable|string|in:Male,Female', // Example for gender options
            'date_of_birth'   => 'required|date|before:' . Carbon::now()->timezone('Asia/Yangon')->subYears(18)->toDateString(),
            'address'         => 'nullable|string|max:500',
            'department_id'   => 'required|string|exists:departments,id', // assuming you have a 'departments' table
            'role_id'         => 'required|string|exists:roles,id', // role should exist in the roles table
            'position_id'     => 'required|string|exists:positions,id', // assuming positions table
            'date_hired'      => 'required|date|before_or_equal:today',
            'salary'          => 'required|numeric|min:0',
            'status'          => 'required|in:Active,Inactive,Suspended,Pending', // assuming these are the valid statuses
        ];
    }
}
