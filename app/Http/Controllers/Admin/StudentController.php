<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStudentRequest;
use App\Models\Department;
use App\Models\Program;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function show(Student $student): Response
    {
        $student->load([
            'user:id,name,email,role,must_change_password,email_verified_at,created_at',
            'department:id,name,code',
            'program:id,name,code,duration_years',
        ]);

        return Inertia::render('admin/students/show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'phone' => $student->phone,
                'matric_number' => $student->matric_number,
                'department' => [
                    'name' => $student->department->name,
                    'code' => $student->department->code,
                ],
                'program' => [
                    'name' => $student->program->name,
                    'code' => $student->program->code,
                    'duration_years' => $student->program->duration_years,
                ],
                'admission_year' => $student->admission_year,
                'level' => $student->level,
                'status' => $student->status,
                'role' => $student->user->role->value,
                'must_change_password' => $student->user->must_change_password,
                'email_verified_at' => $student->user->email_verified_at?->toDateString(),
                'created_at' => $student->user->created_at?->toDateString(),
            ],
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('admin/students/index', [
            'departments' => Department::query()->orderBy('name')->get(['id', 'name', 'code']),
            'programs' => Program::query()->orderBy('name')->get(['id', 'department_id', 'name', 'code']),
            'students' => Student::query()
                ->with(['user:id,name,email', 'department:id,name,code', 'program:id,name,code'])
                ->latest()
                ->paginate(10)
                ->through(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'matric_number' => $student->matric_number,
                    'department' => $student->department->code,
                    'program' => $student->program->name,
                    'level' => $student->level,
                    'status' => $student->status,
                ]),
        ]);
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $student = DB::transaction(function () use ($request): Student {
            $department = Department::query()->findOrFail($request->integer('department_id'));
            $program = Program::query()->findOrFail($request->integer('program_id'));
            $sequence = Student::query()
                ->whereBelongsTo($department)
                ->lockForUpdate()
                ->count() + 1;

            $user = User::create([
                'name' => $request->string('name')->toString(),
                'email' => $request->string('email')->toString(),
                'password' => $request->string('phone')->toString(),
                'role' => UserRole::Student,
                'must_change_password' => true,
                'email_verified_at' => now(),
            ]);

            return Student::create([
                'user_id' => $user->id,
                'department_id' => $department->id,
                'program_id' => $program->id,
                'matric_number' => sprintf('%s%02d%s', $department->code, $sequence, $program->code),
                'phone' => $request->string('phone')->toString(),
                'admission_year' => $request->integer('admission_year'),
                'level' => $request->integer('level'),
            ]);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Student {$student->matric_number} registered successfully.",
        ]);

        return to_route('admin.students.index');
    }
}
