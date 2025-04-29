<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceRequest extends FormRequest
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
              'status' => 'required|string',
            'date' => 'nullable|date',
            'check_out' => 'nullable|date_format:H:i:s',
            'check_in' => 'nullable|date_format:H:i:s',
            'remark' => 'nullable|string',
        ];
    }
}
