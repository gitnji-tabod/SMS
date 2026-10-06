import { Head, router } from '@inertiajs/react';
import { CalendarDays, Clock3, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { view as timetableView } from '@/routes/timetable';

const weekDays = [
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
];

const selectClassName = 'border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

type Entry = {
    id: number;
    course: { code: string; name: string };
    lecturer: string | null;
    day_of_week: number;
    start_time: string;
    end_time: string;
    room: string;
    status: 'published';
};

type Props = {
    entries: Entry[];
    academicYears: string[];
    terms: string[];
    currentAcademicYear: string;
    currentTerm: string;
    audience: string;
};

export default function TimetableView({ entries, academicYears, terms, currentAcademicYear, currentTerm, audience }: Props) {
    const changeSemester = (academicYear: string, term: string) => {
        router.get(timetableView.url({ query: { academic_year: academicYear, term } }), {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title={audience} />
            <div className="flex flex-1 flex-col gap-8 bg-stone-50/70 p-4 sm:p-6 lg:p-8 dark:bg-stone-950/30">
                <header className="flex flex-col justify-between gap-5 border-b border-stone-200 pb-7 sm:flex-row sm:items-end dark:border-stone-800">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-400">
                            <CalendarDays className="size-4" />
                            Academic calendar
                        </div>
                        <h1 className="font-serif text-3xl tracking-tight text-stone-900 dark:text-stone-100">{audience}</h1>
                        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Published classes for the selected semester.</p>
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="grid gap-1.5">
                            <Label htmlFor="viewer-year" className="text-[10px] font-semibold tracking-wide text-stone-500 uppercase">Academic year</Label>
                            <select id="viewer-year" value={currentAcademicYear} onChange={(event) => changeSemester(event.target.value, currentTerm)} className={selectClassName}>
                                {academicYears.map((year) => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="viewer-term" className="text-[10px] font-semibold tracking-wide text-stone-500 uppercase">Semester</Label>
                            <select id="viewer-term" value={currentTerm} onChange={(event) => changeSemester(currentAcademicYear, event.target.value)} className={selectClassName}>
                                {terms.map((term) => <option key={term} value={term}>{term}</option>)}
                            </select>
                        </div>
                    </div>
                </header>

                <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-5 dark:border-stone-800">
                        <div>
                            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">{currentTerm} · {currentAcademicYear}</h2>
                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{entries.length} published {entries.length === 1 ? 'class' : 'classes'}</p>
                        </div>
                        <Badge variant="secondary">Published</Badge>
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
                                            <div key={entry.id} className="border-l-2 border-teal-500 bg-white p-3 shadow-[0_1px_2px_rgba(28,25,23,0.05)] dark:bg-stone-900">
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
        </>
    );
}

TimetableView.layout = {
    breadcrumbs: [
        {
            title: 'Timetable',
            href: timetableView(),
        },
    ],
};
