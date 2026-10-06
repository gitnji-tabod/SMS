<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use App\Models\TimetableEntry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreTimetableEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole(UserRole::SuperAdmin) ?? false;
    }

    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'regex:/^\d{4}\/\d{4}$/'],
            'term' => ['required', Rule::in(['Fall', 'Spring', 'Summer'])],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'lecturer_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', UserRole::Lecturer->value)),
            ],
            'day_of_week' => ['required', 'integer', 'between:1,5'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
            'room' => ['required', 'string', 'max:80'],
            'status' => ['required', Rule::in(['draft', 'published'])],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($validator->errors()->hasAny(['academic_year', 'term', 'day_of_week', 'start_time', 'end_time', 'room'])) {
                return;
            }

            if ($this->string('start_time')->toString() >= $this->string('end_time')->toString()) {
                $validator->errors()->add('end_time', 'The end time must be after the start time.');

                return;
            }

            $overlap = TimetableEntry::query()
                ->where('academic_year', $this->string('academic_year')->toString())
                ->where('term', $this->string('term')->toString())
                ->where('day_of_week', $this->integer('day_of_week'))
                ->where('start_time', '<', $this->string('end_time')->toString())
                ->where('end_time', '>', $this->string('start_time')->toString());

            if ($overlap->clone()->where('room', $this->string('room')->trim()->toString())->exists()) {
                $validator->errors()->add('room', 'This room is already booked during that time.');
            }

            if ($this->filled('lecturer_id') && $overlap->clone()->where('lecturer_id', $this->integer('lecturer_id'))->exists()) {
                $validator->errors()->add('lecturer_id', 'This lecturer already has a class during that time.');
            }
        }];
    }
}
