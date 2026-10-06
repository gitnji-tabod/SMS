import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, CalendarDays, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index, show } from '@/routes/admin/students';

type Props = {
    student: {
        id: number;
        name: string;
        email: string;
        phone: string;
        matric_number: string;
        department: { name: string; code: string };
        program: { name: string; code: string; duration_years: number };
        admission_year: number;
        level: number;
        status: string;
        role: string;
        must_change_password: boolean;
        email_verified_at: string | null;
        created_at: string | null;
    };
};

export default function StudentShow({ student }: Props) {
    return (
        <>
            <Head title={`${student.name} · Student profile`} />
            <div className="flex flex-1 flex-col gap-8 bg-stone-50/70 p-4 sm:p-6 lg:p-8 dark:bg-stone-950/30">
                <header className="flex flex-col gap-5 border-b border-stone-200 pb-7 dark:border-stone-800">
                    <Button asChild variant="ghost" className="w-fit px-0 text-stone-600 hover:bg-transparent hover:text-teal-700 dark:text-stone-400 dark:hover:text-teal-400">
                        <Link href={index()}>
                            <ArrowLeft />
                            Back to student registry
                        </Link>
                    </Button>
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="flex items-start gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                {student.name.split(' ').map((name) => name[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-xs font-semibold tracking-wide text-teal-700 dark:text-teal-400">{student.matric_number}</span>
                                    <Badge variant="outline" className="border-teal-200 text-teal-700 dark:border-teal-800 dark:text-teal-300">{student.status}</Badge>
                                </div>
                                <h1 className="font-serif text-3xl tracking-tight text-stone-900 dark:text-stone-100">{student.name}</h1>
                                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{student.program.name} · Level {student.level}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-fit">
                            <ShieldCheck />
                            Account actions
                        </Button>
                    </div>
                </header>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-center gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
                            <UserRound className="size-5 text-teal-700 dark:text-teal-400" />
                            <div>
                                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Student information</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Identity and contact details</p>
                            </div>
                        </div>
                        <dl className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                            <Detail label="Full name" value={student.name} />
                            <Detail label="Matric number" value={student.matric_number} mono />
                            <Detail label="Email address" value={student.email} icon={<Mail />} />
                            <Detail label="Phone number" value={student.phone} icon={<Phone />} />
                            <Detail label="Admission year" value={String(student.admission_year)} icon={<CalendarDays />} />
                            <Detail label="Current level" value={`Level ${student.level}`} icon={<BookOpen />} />
                        </dl>
                    </section>

                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-center gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
                            <BookOpen className="size-5 text-teal-700 dark:text-teal-400" />
                            <div>
                                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Academic placement</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Current university structure</p>
                            </div>
                        </div>
                        <dl className="mt-6 space-y-5">
                            <Detail label="Department" value={`${student.department.code} · ${student.department.name}`} />
                            <Detail label="Program" value={`${student.program.code} · ${student.program.name}`} />
                            <Detail label="Program duration" value={`${student.program.duration_years} years`} />
                        </dl>
                    </section>

                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-center gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
                            <ShieldCheck className="size-5 text-teal-700 dark:text-teal-400" />
                            <div>
                                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Account status</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Authentication and access details</p>
                            </div>
                        </div>
                        <dl className="mt-6 space-y-5">
                            <Detail label="Account role" value={student.role.replace('_', ' ')} />
                            <Detail label="Email verification" value={student.email_verified_at ? `Verified ${student.email_verified_at}` : 'Not verified'} />
                            <Detail label="Password status" value={student.must_change_password ? 'Temporary password · change required' : 'Password updated'} />
                            <Detail label="Account created" value={student.created_at ?? 'Unknown'} />
                        </dl>
                    </section>
                </div>
            </div>
        </>
    );
}

function Detail({ label, value, icon, mono = false }: { label: string; value: string; icon?: React.ReactNode; mono?: boolean }) {
    return (
        <div>
            <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
            <dd className={`mt-1 flex items-center gap-2 text-sm text-stone-800 dark:text-stone-200 ${mono ? 'font-mono text-teal-700 dark:text-teal-400' : ''}`}>
                {icon && <span className="text-stone-400 [&>svg]:size-4">{icon}</span>}
                {value}
            </dd>
        </div>
    );
}

StudentShow.layout = ({ student }: Props) => ({
    breadcrumbs: [
        { title: 'Student registry', href: index() },
        { title: student.name, href: show(student.id) },
    ],
});
