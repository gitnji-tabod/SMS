<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTimetableEntryRequest;
use App\Models\Course;
use App\Models\TimetableEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class TimetableController extends Controller
{
    public function index(Request $request): Response
    {
        $academicYears = ['2026/2027', '2027/2028'];
        $terms = ['Fall', 'Spring', 'Summer'];
        $academicYear = $request->string('academic_year')->toString();
        $term = $request->string('term')->toString();

        if (! in_array($academicYear, $academicYears, true)) {
            $academicYear = $academicYears[0];
        }

        if (! in_array($term, $terms, true)) {
            $term = $terms[0];
        }

        return Inertia::render('admin/timetable/index', [
            'courses' => Course::query()
                ->where('is_active', true)
                ->orderBy('code')
                ->get(['id', 'code', 'name']),
            'lecturers' => User::query()
                ->where('role', UserRole::Lecturer->value)
                ->orderBy('name')
                ->get(['id', 'name']),
            'entries' => TimetableEntry::query()
                ->where('academic_year', $academicYear)
                ->where('term', $term)
                ->with(['course:id,code,name', 'lecturer:id,name'])
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get()
                ->map(fn (TimetableEntry $entry) => [
                    'id' => $entry->id,
                    'academic_year' => $entry->academic_year,
                    'term' => $entry->term,
                    'course' => [
                        'code' => $entry->course->code,
                        'name' => $entry->course->name,
                    ],
                    'lecturer' => $entry->lecturer?->name,
                    'day_of_week' => $entry->day_of_week,
                    'start_time' => substr($entry->start_time, 0, 5),
                    'end_time' => substr($entry->end_time, 0, 5),
                    'room' => $entry->room,
                    'status' => $entry->status,
                ]),
            'academicYears' => $academicYears,
            'terms' => $terms,
            'currentAcademicYear' => $academicYear,
            'currentTerm' => $term,
        ]);
    }

    public function store(StoreTimetableEntryRequest $request): RedirectResponse
    {
        TimetableEntry::create($request->validated());

        return to_route('admin.timetable.index')->with('status', 'Timetable entry created.');
    }

    public function view(Request $request): Response
    {
        [$academicYears, $terms, $academicYear, $term] = $this->semesterContext($request);
        $user = $request->user();
        $lecturerId = $user?->hasRole(UserRole::Lecturer) ? $user->id : null;

        return Inertia::render('timetable/view', [
            'entries' => $this->entries($academicYear, $term, $lecturerId, publishedOnly: true),
            'academicYears' => $academicYears,
            'terms' => $terms,
            'currentAcademicYear' => $academicYear,
            'currentTerm' => $term,
            'audience' => $user?->hasRole(UserRole::Lecturer) ? 'Teaching timetable' : 'Student timetable',
        ]);
    }

    private function semesterContext(Request $request): array
    {
        $academicYears = ['2026/2027', '2027/2028'];
        $terms = ['Fall', 'Spring', 'Summer'];
        $academicYear = $request->string('academic_year')->toString();
        $term = $request->string('term')->toString();

        return [
            $academicYears,
            $terms,
            in_array($academicYear, $academicYears, true) ? $academicYear : $academicYears[0],
            in_array($term, $terms, true) ? $term : $terms[0],
        ];
    }

    private function entries(string $academicYear, string $term, ?int $lecturerId = null, bool $publishedOnly = false): Collection
    {
        $query = TimetableEntry::query()
            ->where('academic_year', $academicYear)
            ->where('term', $term)
            ->when($publishedOnly, fn (Builder $query) => $query->where('status', 'published'))
            ->when($lecturerId, fn (Builder $query) => $query->where('lecturer_id', $lecturerId))
            ->with(['course:id,code,name', 'lecturer:id,name'])
            ->orderBy('day_of_week')
            ->orderBy('start_time');

        return $query->get()->map(fn (TimetableEntry $entry) => [
            'id' => $entry->id,
            'course' => [
                'code' => $entry->course->code,
                'name' => $entry->course->name,
            ],
            'lecturer' => $entry->lecturer?->name,
            'day_of_week' => $entry->day_of_week,
            'start_time' => substr($entry->start_time, 0, 5),
            'end_time' => substr($entry->end_time, 0, 5),
            'room' => $entry->room,
            'status' => $entry->status,
        ]);
    }
}
