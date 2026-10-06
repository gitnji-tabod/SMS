import { Head, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BookOpen,
    CalendarDays,
    ChevronRight,
    CircleDollarSign,
    GraduationCap,
    MoreHorizontal,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

const roleCopy = {
    super_admin: {
        label: 'University administration',
        greeting: 'Good morning, Alex.',
        description: 'Here is the pulse of Northbridge University for the Fall 2026 semester.',
    },
    student: {
        label: 'Student workspace',
        greeting: 'Good morning, Ada.',
        description: 'Your courses, upcoming classes, assignments, and university updates in one place.',
    },
    lecturer: {
        label: 'Teaching workspace',
        greeting: 'Good morning, Dr. Mensah.',
        description: 'Your teaching schedule, course rosters, and academic tasks for today.',
    },
    admin_assistant: {
        label: 'Academic services',
        greeting: 'Good morning, Jordan.',
        description: 'Keep student records, documents, and administrative tasks moving forward.',
    },
    bursar: {
        label: 'Finance office',
        greeting: 'Good morning, Morgan.',
        description: 'Monitor fee collection, installment plans, receipts, and outstanding balances.',
    },
} as const;

const roleSnapshot = {
    super_admin: {
        title: 'University control room',
        description: 'The areas currently needing central administration.',
        items: [
            ['Departments', '8', '2 programs awaiting review'],
            ['Courses', '146', '12 need lecturer assignment'],
            ['Students', '4,286', '18 pending applications'],
        ],
    },
    student: {
        title: 'Your semester at a glance',
        description: 'Stay ahead of classes, coursework, and academic progress.',
        items: [
            ['Enrolled courses', '6', '18 credit units this semester'],
            ['Upcoming classes', '3', 'Next class at 09:00 today'],
            ['Assignments due', '2', 'Nearest deadline in 3 days'],
        ],
    },
    lecturer: {
        title: 'Teaching overview',
        description: 'Your classes and the students who depend on your teaching.',
        items: [
            ['Assigned courses', '4', '2 classes scheduled today'],
            ['Students', '186', 'Across your active rosters'],
            ['Pending grading', '23', 'Submissions awaiting review'],
        ],
    },
    admin_assistant: {
        title: 'Records and documents',
        description: 'Keep student documentation complete, verified, and easy to find.',
        items: [
            ['Pending documents', '32', 'Awaiting review or upload'],
            ['Compiled files', '418', 'Student records completed'],
            ['Needs attention', '7', 'Missing required documents'],
        ],
    },
    bursar: {
        title: 'Finance office overview',
        description: 'Track installments, receipts, and the university collection position.',
        items: [
            ['Collected this term', '$182.4k', '76% of target'],
            ['Installments due', '84', 'Due within the next 7 days'],
            ['Outstanding balance', '$57.8k', 'Across 312 students'],
        ],
    },
} as const;

const metrics = [
    {
        label: 'Active students',
        value: '4,286',
        change: '+8.2%',
        detail: 'vs. last semester',
        icon: Users,
        tone: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    },
    {
        label: 'Faculty members',
        value: '312',
        change: '+4.6%',
        detail: 'across 8 schools',
        icon: GraduationCap,
        tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
        label: 'Attendance rate',
        value: '94.8%',
        change: '+1.4%',
        detail: 'this academic year',
        icon: CalendarDays,
        tone: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    },
    {
        label: 'Fee collection',
        value: '$182.4k',
        change: '76%',
        detail: 'of term target',
        icon: CircleDollarSign,
        tone: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    },
];

const schedule = [
    { time: '09:00', course: 'Advanced Statistics', room: 'Science 204', code: 'STAT 302' },
    { time: '11:30', course: 'Modern Political Theory', room: 'Humanities 118', code: 'POLI 210' },
    { time: '14:00', course: 'Introduction to Design', room: 'Arts Studio 2', code: 'DES 101' },
];

const tasks = [
    { label: 'Review 18 pending applications', type: 'Admissions', tone: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300' },
    { label: 'Approve faculty leave requests', type: 'People', tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    { label: 'Publish midterm examination schedule', type: 'Academic', tone: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300' },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const copy = roleCopy[auth.user.role as keyof typeof roleCopy] ?? roleCopy.student;
    const snapshot = roleSnapshot[auth.user.role as keyof typeof roleSnapshot] ?? roleSnapshot.student;

    return (
        <>
            <Head title={`${copy.label} dashboard`} />
            <div className="flex flex-1 flex-col gap-8 overflow-x-auto bg-stone-50/70 p-4 sm:p-6 lg:p-8 dark:bg-stone-950/30">
                <header className="flex flex-col justify-between gap-5 border-b border-stone-200 pb-7 sm:flex-row sm:items-end dark:border-stone-800">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-400">
                            <span className="h-2 w-2 rounded-full bg-teal-500" />
                            {copy.label}
                        </div>
                        <h1 className="font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
                            {copy.greeting}
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-stone-600 dark:text-stone-400">
                            {copy.description}
                        </p>
                    </div>
                    <Button className="w-fit bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500">
                        <ArrowUpRight />
                        View reports
                    </Button>
                </header>

                <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{snapshot.title}</p>
                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{snapshot.description}</p>
                        </div>
                        <span className="text-xs font-medium text-teal-700 dark:text-teal-400">Fall 2026 semester</span>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        {snapshot.items.map(([label, value, detail]) => (
                            <div key={label} className="border-l-2 border-teal-500 pl-4">
                                <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
                                <p className="mt-1 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">{value}</p>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-500">{detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="University metrics">
                    {metrics.map(({ label, value, change, detail, icon: Icon, tone }) => (
                        <div key={label} className="border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04)] dark:border-stone-800 dark:bg-stone-900">
                            <div className="flex items-start justify-between gap-4">
                                <div className={`flex size-10 items-center justify-center rounded-lg ${tone}`}>
                                    <Icon className="size-5" />
                                </div>
                                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">{change}</span>
                            </div>
                            <p className="mt-5 text-sm text-stone-500 dark:text-stone-400">{label}</p>
                            <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">{value}</p>
                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-500">{detail}</p>
                        </div>
                    ))}
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Enrollment overview</p>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Student headcount by school · Fall 2026</p>
                            </div>
                            <Button variant="ghost" size="icon" aria-label="More enrollment options">
                                <MoreHorizontal />
                            </Button>
                        </div>
                        <div className="mt-8 flex h-48 items-end gap-3 border-b border-l border-stone-200 px-3 pb-0 sm:gap-6 dark:border-stone-700">
                            {[62, 74, 68, 83, 78, 91, 86, 96].map((height, index) => (
                                <div key={index} className="group flex h-full flex-1 flex-col justify-end gap-2">
                                    <div className="relative w-full rounded-t-sm bg-teal-600 transition-colors group-hover:bg-teal-500 dark:bg-teal-500 dark:group-hover:bg-teal-400" style={{ height: `${height}%` }}>
                                        <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[10px] font-semibold text-stone-600 group-hover:block dark:text-stone-300">{Math.round(height * 42.86)}</span>
                                    </div>
                                    <span className="text-center text-[10px] font-medium text-stone-500">{['Arts', 'Bus', 'Comp', 'Edu', 'Eng', 'Law', 'Med', 'Sci'][index]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                            <span className="size-2 rounded-full bg-teal-600 dark:bg-teal-500" />
                            4,286 enrolled students
                            <span className="ml-auto font-medium text-teal-700 dark:text-teal-400">+8.2% year on year</span>
                        </div>
                    </section>

                    <section className="border border-stone-200 bg-stone-900 p-5 text-stone-100 sm:p-6 dark:border-stone-800 dark:bg-stone-800">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold">Today on campus</p>
                                <p className="mt-1 text-xs text-stone-400">Your schedule · October 6</p>
                            </div>
                            <CalendarDays className="size-5 text-amber-300" />
                        </div>
                        <div className="mt-6 divide-y divide-stone-700">
                            {schedule.map(({ time, course, room, code }) => (
                                <div key={code} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                    <span className="w-12 pt-0.5 text-xs font-semibold text-amber-300">{time}</span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{course}</p>
                                        <p className="mt-1 text-xs text-stone-400">{room} · {code}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="mt-5 h-auto p-0 text-xs text-amber-300 hover:bg-transparent hover:text-amber-200">
                            Open full calendar <ChevronRight />
                        </Button>
                    </section>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Action queue</p>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Items that need your attention</p>
                            </div>
                            <Badge variant="secondary">3 open</Badge>
                        </div>
                        <div className="mt-5 divide-y divide-stone-100 dark:divide-stone-800">
                            {tasks.map(({ label, type, tone }) => (
                                <div key={label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="size-2 shrink-0 rounded-full bg-amber-500" />
                                    <p className="min-w-0 flex-1 text-sm text-stone-700 dark:text-stone-300">{label}</p>
                                    <Badge variant="outline" className={tone}>{type}</Badge>
                                    <ChevronRight className="size-4 shrink-0 text-stone-400" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Campus bulletin</p>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Latest university updates</p>
                            </div>
                            <BookOpen className="size-5 text-teal-700 dark:text-teal-400" />
                        </div>
                        <div className="mt-5 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Library hours extended during midterms</p>
                                <p className="mt-1 text-xs text-stone-500">Academic services · 2 hours ago</p>
                            </div>
                            <div className="border-t border-stone-100 pt-4 dark:border-stone-800">
                                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Research grant applications now open</p>
                                <p className="mt-1 text-xs text-stone-500">Office of research · Yesterday</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
