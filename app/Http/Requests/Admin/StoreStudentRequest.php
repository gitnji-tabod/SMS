<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole(UserRole::SuperAdmin) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:30'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'program_id' => [
                'required',
                'integer',
                Rule::exists('programs', 'id')->where(
                    fn ($query) => $query->where('department_id', $this->integer('department_id')),
                ),
            ],
            'admission_year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'level' => ['required', 'integer', 'min:1', 'max:8'],
        ];
    }
}
