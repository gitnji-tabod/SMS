<?php

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\Department;
use App\Models\TimetableEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createTimetableFixture(): array
{
    $department = Department::create(['name' => 'School of Computing', 'code' => 'SCI']);
    $course = Course::create([
        'department_id' => $department->id,
        'code' => 'CSC101',
        'name' => 'Foundations of Computer Science',
        'credit_units' => 3,
    ]);
    $otherCourse = Course::create([
        'department_id' => $department->id,
        'code' => 'CSC202',
        'name' => 'Data Structures',
        'credit_units' => 4,
    ]);
    $lecturer = User::factory()->create(['role' => UserRole::Lecturer]);
    $admin = User::factory()->create(['role' => UserRole::SuperAdmin]);

    return [$course, $otherCourse, $lecturer, $admin];
}

test('only super admins can access the timetable builder', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);

    $this->actingAs($student)
        ->get(route('admin.timetable.index'))
        ->assertForbidden();
});

test('the timetable builder scopes entries to the selected semester', function () {
    [$course, , $lecturer, $admin] = createTimetableFixture();

    TimetableEntry::create([
        'academic_year' => '2026/2027',
        'term' => 'Fall',
        'course_id' => $course->id,
        'lecturer_id' => $lecturer->id,
        'day_of_week' => 1,
        'start_time' => '09:00',
        'end_time' => '10:30',
        'room' => 'Science 204',
        'status' => 'published',
    ]);

    TimetableEntry::create([
        'academic_year' => '2026/2027',
        'term' => 'Spring',
        'course_id' => $course->id,
        'lecturer_id' => $lecturer->id,
        'day_of_week' => 2,
        'start_time' => '11:00',
        'end_time' => '12:30',
        'room' => 'Science 205',
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.timetable.index', [
        'academic_year' => '2026/2027',
        'term' => 'Spring',
    ]));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/timetable/index')
        ->where('currentTerm', fn (string $term): bool => $term === 'Spring')
        ->has('entries', 1),
    );
});

test('students can view published timetable entries', function () {
    [$course, , $lecturer] = createTimetableFixture();
    $student = User::factory()->create(['role' => UserRole::Student]);

    TimetableEntry::create([
        'academic_year' => '2026/2027',
        'term' => 'Fall',
        'course_id' => $course->id,
        'lecturer_id' => $lecturer->id,
        'day_of_week' => 1,
        'start_time' => '09:00',
        'end_time' => '10:30',
        'room' => 'Science 204',
        'status' => 'published',
    ]);

    $response = $this->actingAs($student)->get(route('timetable.view'));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('timetable/view')
        ->where('audience', fn (string $audience): bool => $audience === 'Student timetable')
        ->has('entries', 1),
    );
});

test('lecturers only see their assigned published timetable entries', function () {
    [$course, $otherCourse, $lecturer] = createTimetableFixture();
    $otherLecturer = User::factory()->create(['role' => UserRole::Lecturer]);

    foreach ([
        ['course_id' => $course->id, 'lecturer_id' => $lecturer->id, 'room' => 'Science 204'],
        ['course_id' => $otherCourse->id, 'lecturer_id' => $otherLecturer->id, 'room' => 'Science 205'],
    ] as $index => $slot) {
        TimetableEntry::create([
            'academic_year' => '2026/2027',
            'term' => 'Fall',
            'course_id' => $slot['course_id'],
            'lecturer_id' => $slot['lecturer_id'],
            'day_of_week' => $index + 1,
            'start_time' => '09:00',
            'end_time' => '10:30',
            'room' => $slot['room'],
            'status' => 'published',
        ]);
    }

    $response = $this->actingAs($lecturer)->get(route('timetable.view'));

    $response->assertInertia(fn (Assert $page) => $page
        ->where('audience', fn (string $audience): bool => $audience === 'Teaching timetable')
        ->has('entries', 1),
    );
});

test('super admins can create a timetable entry', function () {
    [$course, , $lecturer, $admin] = createTimetableFixture();

    $response = $this->actingAs($admin)->post(route('admin.timetable.store'), [
        'academic_year' => '2026/2027',
        'term' => 'Fall',
        'course_id' => $course->id,
        'lecturer_id' => $lecturer->id,
        'day_of_week' => 1,
        'start_time' => '09:00',
        'end_time' => '10:30',
        'room' => 'Science 204',
        'status' => 'published',
    ]);

    $response->assertRedirect(route('admin.timetable.index', absolute: false));
    expect(TimetableEntry::query()->count())->toBe(1);
});

test('timetable creation rejects overlapping room bookings', function () {
    [$course, $otherCourse, $lecturer, $admin] = createTimetableFixture();

    TimetableEntry::create([
        'academic_year' => '2026/2027',
        'term' => 'Fall',
        'course_id' => $course->id,
        'lecturer_id' => $lecturer->id,
        'day_of_week' => 1,
        'start_time' => '09:00',
        'end_time' => '10:30',
        'room' => 'Science 204',
        'status' => 'published',
    ]);

    $response = $this->actingAs($admin)->from(route('admin.timetable.index'))->post(route('admin.timetable.store'), [
        'academic_year' => '2026/2027',
        'term' => 'Fall',
        'course_id' => $otherCourse->id,
        'lecturer_id' => null,
        'day_of_week' => 1,
        'start_time' => '10:00',
        'end_time' => '11:00',
        'room' => 'Science 204',
        'status' => 'draft',
    ]);

    $response->assertSessionHasErrors('room');
    expect(TimetableEntry::query()->count())->toBe(1);
});
