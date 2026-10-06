<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Course;
use App\Models\Department;
use App\Models\Program;
use App\Models\Student;
use App\Models\TimetableEntry;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $departments = collect([
            ['name' => 'School of Humanities and Information Business', 'code' => 'SHIB'],
            ['name' => 'School of Computing and Informatics', 'code' => 'SCI'],
            ['name' => 'School of Business and Economics', 'code' => 'BUS'],
            ['name' => 'School of Engineering', 'code' => 'ENG'],
        ])->mapWithKeys(function (array $data): array {
            $department = Department::query()->firstOrCreate(
                ['code' => $data['code']],
                ['name' => $data['name']],
            );

            return [$department->code => $department];
        });

        $programs = collect([
            ['department' => 'SHIB', 'name' => 'Software Engineering', 'code' => 'SWE', 'duration_years' => 4],
            ['department' => 'SCI', 'name' => 'Computer Science', 'code' => 'CSC', 'duration_years' => 4],
            ['department' => 'BUS', 'name' => 'Business Administration', 'code' => 'BIZ', 'duration_years' => 4],
            ['department' => 'ENG', 'name' => 'Electrical Engineering', 'code' => 'EEE', 'duration_years' => 5],
        ])->mapWithKeys(function (array $data) use ($departments): array {
            $program = Program::query()->firstOrCreate(
                ['code' => $data['code']],
                [
                    'department_id' => $departments[$data['department']]->id,
                    'name' => $data['name'],
                    'duration_years' => $data['duration_years'],
                ],
            );

            return [$program->code => $program];
        });

        foreach ([
            ['department' => 'SHIB', 'code' => 'SWE101', 'name' => 'Introduction to Software Engineering', 'credit_units' => 3],
            ['department' => 'SHIB', 'code' => 'SWE201', 'name' => 'Web Application Architecture', 'credit_units' => 3],
            ['department' => 'SCI', 'code' => 'CSC101', 'name' => 'Foundations of Computer Science', 'credit_units' => 3],
            ['department' => 'SCI', 'code' => 'CSC202', 'name' => 'Data Structures and Algorithms', 'credit_units' => 4],
            ['department' => 'BUS', 'code' => 'BIZ101', 'name' => 'Principles of Management', 'credit_units' => 3],
            ['department' => 'ENG', 'code' => 'EEE101', 'name' => 'Circuit Analysis', 'credit_units' => 4],
        ] as $course) {
            Course::query()->firstOrCreate(
                ['code' => $course['code']],
                [
                    'department_id' => $departments[$course['department']]->id,
                    'name' => $course['name'],
                    'credit_units' => $course['credit_units'],
                ],
            );
        }

        User::query()->firstOrCreate([
            'email' => 'admin@northbridge.edu',
        ], [
            'name' => 'Central Administrator',
            'password' => 'password',
            'role' => UserRole::SuperAdmin,
            'email_verified_at' => now(),
        ]);

        foreach ([
            ['name' => 'Dr. Kofi Mensah', 'email' => 'lecturer@northbridge.edu', 'role' => UserRole::Lecturer],
            ['name' => 'Jordan Cole', 'email' => 'assistant@northbridge.edu', 'role' => UserRole::AdminAssistant],
            ['name' => 'Morgan Lee', 'email' => 'bursar@northbridge.edu', 'role' => UserRole::Bursar],
            ['name' => 'Ada Okafor', 'email' => 'student@northbridge.edu', 'role' => UserRole::Student],
        ] as $account) {
            $user = User::query()->firstOrCreate(['email' => $account['email']], [
                'name' => $account['name'],
                'password' => 'password',
                'role' => $account['role'],
                'email_verified_at' => now(),
            ]);

            if ($account['role'] === UserRole::Student) {
                Student::query()->firstOrCreate([
                    'user_id' => $user->id,
                ], [
                    'department_id' => $departments['SHIB']->id,
                    'program_id' => $programs['SWE']->id,
                    'matric_number' => 'SHIB01SWE',
                    'phone' => '08001234567',
                    'admission_year' => 2026,
                    'level' => 1,
                ]);
            }
        }

        $lecturer = User::query()->where('email', 'lecturer@northbridge.edu')->firstOrFail();

        foreach ([
            ['course' => 'SWE101', 'day' => 1, 'start' => '09:00', 'end' => '10:30', 'room' => 'Science 204'],
            ['course' => 'CSC101', 'day' => 2, 'start' => '11:00', 'end' => '12:30', 'room' => 'Technology 102'],
            ['course' => 'BIZ101', 'day' => 4, 'start' => '14:00', 'end' => '15:30', 'room' => 'Business 110'],
        ] as $slot) {
            TimetableEntry::query()->firstOrCreate([
                'academic_year' => '2026/2027',
                'term' => 'Fall',
                'course_id' => Course::query()->where('code', $slot['course'])->value('id'),
                'day_of_week' => $slot['day'],
                'start_time' => $slot['start'],
            ], [
                'lecturer_id' => $lecturer->id,
                'end_time' => $slot['end'],
                'room' => $slot['room'],
                'status' => 'published',
            ]);
        }

        foreach ([
            ['name' => 'Samuel Mensah', 'email' => 'samuel.student@northbridge.edu', 'department' => 'SCI', 'program' => 'CSC', 'matric' => 'SCI01CSC', 'phone' => '08001234568'],
            ['name' => 'Lina Bello', 'email' => 'lina.student@northbridge.edu', 'department' => 'BUS', 'program' => 'BIZ', 'matric' => 'BUS01BIZ', 'phone' => '08001234569'],
        ] as $student) {
            $user = User::query()->firstOrCreate(['email' => $student['email']], [
                'name' => $student['name'],
                'password' => 'password',
                'role' => UserRole::Student,
                'email_verified_at' => now(),
            ]);

            Student::query()->firstOrCreate(['user_id' => $user->id], [
                'department_id' => $departments[$student['department']]->id,
                'program_id' => $programs[$student['program']]->id,
                'matric_number' => $student['matric'],
                'phone' => $student['phone'],
                'admission_year' => 2026,
                'level' => 1,
            ]);
        }
    }
}
