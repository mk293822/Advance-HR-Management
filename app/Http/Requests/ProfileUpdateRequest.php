<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'first_name'      => 'required|string|max:255',
            'last_name'       => 'required|string|max:255',
            'phone'           => 'nullable|string', // Change to a more specific regex for phone numbers if needed
            'gender'          => 'nullable|string|in:Male,Female', // Example for gender options
            'date_of_birth'   => 'required|date|before:' . Carbon::now()->timezone('Asia/Yangon')->subYears(18)->toDateString(),
            'address'         => 'nullable|string|max:500',
            'department_id'   => 'required|exists:departments,id', // assuming you have a 'departments' table
            'role_id'         => 'required|exists:roles,id', // role should exist in the roles table
            'position_id'     => 'required|exists:positions,id', // assuming positions table
            'date_hired'      => 'required|date|before_or_equal:today',
            'salary'          => 'required|numeric|min:0',
            'status'          => 'required|in:Active,Inactive,Suspended,Pending',
            'avatar'          => 'nullable'
        ];
    }
}
