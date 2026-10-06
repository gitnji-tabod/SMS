<?php

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\Program;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createAcademicStructure(): array
{
    $department = Department::create([
        'name' => 'School of Humanities and Information Business',
        'code' => 'SHIB',
    ]);

    $program = Program::create([
        'department_id' => $department->id,
        'name' => 'Software Engineering',
        'code' => 'SWE',
        'duration_years' => 4,
    ]);

    return [$department, $program];
}

test('only super admins can access the student registry', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);

    $this->actingAs($student)
        ->get(route('admin.students.index'))
        ->assertForbidden();
});

test('students with a temporary password are sent to security settings', function () {
    $student = User::factory()->create([
        'role' => UserRole::Student,
        'must_change_password' => true,
    ]);

    $this->actingAs($student)
        ->get(route('dashboard'))
        ->assertRedirect(route('security.edit', absolute: false));
});

test('super admins can view a student detail page', function () {
    [$department, $program] = createAcademicStructure();
    $admin = User::factory()->create(['role' => UserRole::SuperAdmin]);
    $studentUser = User::factory()->create(['role' => UserRole::Student]);
    $student = Student::create([
        'user_id' => $studentUser->id,
        'department_id' => $department->id,
        'program_id' => $program->id,
        'matric_number' => 'SHIB01SWE',
        'phone' => '08001234567',
        'admission_year' => 2026,
        'level' => 1,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.students.show', $student));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/students/show')
        ->where('student.matric_number', 'SHIB01SWE')
        ->where('student.program.code', 'SWE'),
    );
});

test('super admins can register a student with a generated matric number', function () {
    [$department, $program] = createAcademicStructure();
    $admin = User::factory()->create(['role' => UserRole::SuperAdmin]);

    $response = $this->actingAs($admin)->post(route('admin.students.store'), [
        'name' => 'Ada Okafor',
        'email' => 'ada@example.com',
        'phone' => '08001234567',
        'department_id' => $department->id,
        'program_id' => $program->id,
        'admission_year' => 2026,
        'level' => 1,
    ]);

    $response->assertRedirect(route('admin.students.index', absolute: false));

    $student = Student::query()->with('user')->firstOrFail();

    expect($student->matric_number)->toBe('SHIB01SWE')
        ->and($student->user->role)->toBe(UserRole::Student)
        ->and($student->user->must_change_password)->toBeTrue()
        ->and(Hash::check('08001234567', $student->user->password))->toBeTrue();
});

test('student registration rejects a program from another department', function () {
    [$department] = createAcademicStructure();
    $otherDepartment = Department::create(['name' => 'School of Law', 'code' => 'LAW']);
    $otherProgram = Program::create([
        'department_id' => $otherDepartment->id,
        'name' => 'Law',
        'code' => 'LAW',
        'duration_years' => 5,
    ]);
    $admin = User::factory()->create(['role' => UserRole::SuperAdmin]);

    $response = $this->actingAs($admin)->from(route('admin.students.index'))->post(route('admin.students.store'), [
        'name' => 'Ada Okafor',
        'email' => 'ada@example.com',
        'phone' => '08001234567',
        'department_id' => $department->id,
        'program_id' => $otherProgram->id,
        'admission_year' => 2026,
        'level' => 1,
    ]);

    $response->assertSessionHasErrors('program_id');
    expect(Student::query()->count())->toBe(0);
});
