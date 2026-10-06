import { Form, Head, router } from '@inertiajs/react';
import { CalendarDays, Clock3, MapPin, Plus, Users } from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store } from '@/routes/admin/timetable';

const weekDays = [
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
];

const selectClassName = 'border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

type Course = {
    id: number;
    code: string;
    name: string;
};

type Lecturer = {
    id: number;
    name: string;
};

type TimetableEntry = {
    id: number;
    academic_year: string;
    term: string;
    course: Course;
    lecturer: string | null;
    day_of_week: number;
    start_time: string;
    end_time: string;
    room: string;
    status: 'draft' | 'published';
};

type Props = {
    courses: Course[];
    lecturers: Lecturer[];
    entries: TimetableEntry[];
    academicYears: string[];
    terms: string[];
    currentAcademicYear: string;
    currentTerm: string;
};

export default function TimetableIndex({ courses, lecturers, entries, academicYears, terms, currentAcademicYear, currentTerm }: Props) {
    const changeSemester = (academicYear: string, term: string) => {
        router.get(index.url({ query: { academic_year: academicYear, term } }), {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Timetable builder" />
            <div className="flex flex-1 flex-col gap-8 bg-stone-50/70 p-4 sm:p-6 lg:p-8 dark:bg-stone-950/30">
                <header className="flex flex-col justify-between gap-5 border-b border-stone-200 pb-7 sm:flex-row sm:items-end dark:border-stone-800">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-400">
                            <CalendarDays className="size-4" />
                            Academic operations
                        </div>
                        <h1 className="font-serif text-3xl tracking-tight text-stone-900 dark:text-stone-100">Timetable builder</h1>
                        <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
                            Place courses, rooms, and lecturers into a schedule with conflict checks before publishing.
                        </p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="semester-year" className="text-[10px] font-semibold tracking-wide text-stone-500 uppercase">Academic year</Label>
                                <select id="semester-year" value={currentAcademicYear} onChange={(event) => changeSemester(event.target.value, currentTerm)} className={selectClassName}>
                                    {academicYears.map((year) => <option key={year} value={year}>{year}</option>)}
                                </select>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="semester-term" className="text-[10px] font-semibold tracking-wide text-stone-500 uppercase">Semester</Label>
                                <select id="semester-term" value={currentTerm} onChange={(event) => changeSemester(currentAcademicYear, event.target.value)} className={selectClassName}>
                                    {terms.map((term) => <option key={term} value={term}>{term}</option>)}
                                </select>
                            </div>
                        </div>
                        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
                            <span className="size-2 rounded-full bg-teal-500" />
                            {entries.filter((entry) => entry.status === 'published').length} published slots
                        </Badge>
                    </div>
                </header>

                <div className="grid gap-6 xl:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.8fr)]">
                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-start gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                <Plus className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Add timetable slot</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Conflicts are checked when you save.</p>
                            </div>
                        </div>

                        <Form {...store.form()} className="mt-6 space-y-5">
                            {({ errors, processing }) => (
                                <>
                                    <input type="hidden" name="academic_year" value={currentAcademicYear} />
                                    <input type="hidden" name="term" value={currentTerm} />
                                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                                        <Field label="Course" error={errors.course_id}>
                                            <select name="course_id" className={selectClassName} required>
                                                <option value="">Select course</option>
                                                {courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}
                                            </select>
                                        </Field>
                                        <Field label="Lecturer" error={errors.lecturer_id}>
                                            <select name="lecturer_id" className={selectClassName}>
                                                <option value="">Assign lecturer later</option>
                                                {lecturers.map((lecturer) => <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>)}
                                            </select>
                                        </Field>
                                        <Field label="Day" error={errors.day_of_week}>
                                            <select name="day_of_week" defaultValue="1" className={selectClassName} required>
                                                {weekDays.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}
                                            </select>
                                        </Field>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Starts" error={errors.start_time}>
                                                <Input name="start_time" type="time" defaultValue="09:00" required />
                                            </Field>
                                            <Field label="Ends" error={errors.end_time}>
                                                <Input name="end_time" type="time" defaultValue="10:00" required />
                                            </Field>
                                        </div>
                                        <Field label="Room" error={errors.room}>
                                            <Input name="room" placeholder="e.g. Science 204" required />
                                        </Field>
                                        <Field label="Visibility" error={errors.status}>
                                            <select name="status" defaultValue="published" className={selectClassName} required>
                                                <option value="published">Publish immediately</option>
                                                <option value="draft">Save as draft</option>
                                            </select>
                                        </Field>
                                    </div>
                                    <Button type="submit" disabled={processing} className="w-full bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500">
                                        {processing ? 'Saving slot...' : 'Add to timetable'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </section>

                    <section className="min-w-0 border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex flex-col justify-between gap-2 border-b border-stone-100 pb-5 sm:flex-row sm:items-end dark:border-stone-800">
                            <div>
                                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Weekly planner</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{currentTerm} · {currentAcademicYear} · Published timetable</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-teal-500" /> Published</span>
                                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400" /> Draft</span>
                            </div>
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-5">
                            {weekDays.map((day) => {
                                const dayEntries = entries.filter((entry) => entry.day_of_week === day.value);

                                return (
                                    <div key={day.value} className="min-h-64 border border-stone-200 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-950/40">
                                        <div className="border-b border-stone-200 px-3 py-3 dark:border-stone-800">
                                            <p className="text-xs font-semibold text-stone-900 sm:hidden dark:text-stone-100">{day.short}</p>
                                            <p className="hidden text-xs font-semibold text-stone-900 sm:block dark:text-stone-100">{day.label}</p>
                                            <p className="mt-1 text-[10px] text-stone-500">{dayEntries.length} {dayEntries.length === 1 ? 'class' : 'classes'}</p>
                                        </div>
                                        <div className="space-y-2 p-2">
                                            {dayEntries.map((entry) => (
                                                <div key={entry.id} className={`border-l-2 bg-white p-3 shadow-[0_1px_2px_rgba(28,25,23,0.05)] dark:bg-stone-900 ${entry.status === 'published' ? 'border-teal-500' : 'border-amber-400'}`}>
                                                    <p className="font-mono text-[10px] font-semibold text-teal-700 dark:text-teal-400">{entry.course.code}</p>
                                                    <p className="mt-1 text-xs font-semibold leading-snug text-stone-900 dark:text-stone-100">{entry.course.name}</p>
                                                    <p className="mt-3 flex items-center gap-1 text-[10px] text-stone-500"><Clock3 className="size-3" /> {entry.start_time}–{entry.end_time}</p>
                                                    <p className="mt-1 flex items-center gap-1 text-[10px] text-stone-500"><MapPin className="size-3" /> {entry.room}</p>
                                                    {entry.lecturer && <p className="mt-1 flex items-center gap-1 text-[10px] text-stone-500"><Users className="size-3" /> {entry.lecturer}</p>}
                                                </div>
                                            ))}
                                            {dayEntries.length === 0 && <p className="py-8 text-center text-[10px] text-stone-400">No classes</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

TimetableIndex.layout = {
    breadcrumbs: [
        {
            title: 'Timetable builder',
            href: index(),
        },
    ],
};
