import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { GraduationCap, Plus, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, show as studentShow, store } from '@/routes/admin/students';

type Department = {
    id: number;
    name: string;
    code: string;
};

type Program = Department & {
    department_id: number;
};

type Student = {
    id: number;
    name: string;
    email: string;
    matric_number: string;
    department: string;
    program: string;
    level: number;
    status: string;
};

type Props = {
    departments: Department[];
    programs: Program[];
    students: {
        data: Student[];
    };
};

export default function StudentsIndex({ departments, programs, students }: Props) {
    const [departmentId, setDepartmentId] = useState('');
    const availablePrograms = programs.filter(
        (program) => program.department_id === Number(departmentId),
    );

    return (
        <>
            <Head title="Student registry" />
            <div className="flex flex-1 flex-col gap-8 bg-stone-50/70 p-4 sm:p-6 lg:p-8 dark:bg-stone-950/30">
                <header className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-7 sm:flex-row sm:items-end dark:border-stone-800">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-400">
                            <GraduationCap className="size-4" />
                            Academic records
                        </div>
                        <h1 className="font-serif text-3xl tracking-tight text-stone-900 dark:text-stone-100">
                            Student registry
                        </h1>
                        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                            Register students, assign their academic identity, and manage enrollment records.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="w-fit">
                        <a href={index.url()}>
                            <ShieldCheck />
                            Registry access
                        </a>
                    </Button>
                </header>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-start gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                <Plus className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Register a student</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">A temporary password will be sent from the student phone number.</p>
                            </div>
                        </div>

                        <Form {...store.form()} className="mt-6 space-y-5">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="grid gap-2 sm:col-span-2">
                                            <Label htmlFor="name">Full name</Label>
                                            <Input id="name" name="name" placeholder="e.g. Ada Okafor" required />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input id="email" name="email" type="email" placeholder="student@northbridge.edu" required />
                                            <InputError message={errors.email} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone number</Label>
                                            <Input id="phone" name="phone" placeholder="0800 000 0000" required />
                                            <InputError message={errors.phone} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="department_id">Department</Label>
                                            <select
                                                id="department_id"
                                                name="department_id"
                                                required
                                                value={departmentId}
                                                onChange={(event) => setDepartmentId(event.target.value)}
                                                className="border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            >
                                                <option value="">Select department</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.id}>
                                                        {department.code} · {department.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.department_id} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="program_id">Program</Label>
                                            <select
                                                id="program_id"
                                                name="program_id"
                                                required
                                                disabled={!departmentId}
                                                className="border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
                                            >
                                                <option value="">Select program</option>
                                                {availablePrograms.map((program) => (
                                                    <option key={program.id} value={program.id}>
                                                        {program.code} · {program.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.program_id} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="admission_year">Admission year</Label>
                                            <Input id="admission_year" name="admission_year" type="number" defaultValue={new Date().getFullYear()} min="2000" max="2100" required />
                                            <InputError message={errors.admission_year} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="level">Level</Label>
                                            <select
                                                id="level"
                                                name="level"
                                                defaultValue="1"
                                                className="border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                                                    <option key={level} value={level}>Level {level}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.level} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 border-t border-stone-100 pt-5 dark:border-stone-800">
                                        <p className="text-xs text-stone-500 dark:text-stone-400">Matric number is generated after registration.</p>
                                        <Button type="submit" disabled={processing} className="bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500">
                                            {processing ? 'Registering...' : 'Register student'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </section>

                    <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-5 dark:border-stone-800">
                            <div>
                                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Registered students</h2>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Recent student records across the university.</p>
                            </div>
                            <Badge variant="secondary">{students.data.length} shown</Badge>
                        </div>
                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[620px] text-left text-sm">
                                <thead className="text-xs text-stone-500 dark:text-stone-400">
                                    <tr className="border-b border-stone-100 dark:border-stone-800">
                                        <th className="pb-3 pr-4 font-medium">Student</th>
                                        <th className="pb-3 pr-4 font-medium">Matric number</th>
                                        <th className="pb-3 pr-4 font-medium">Program</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                    {students.data.map((student) => (
                                        <tr key={student.id}>
                                            <td className="py-4 pr-4">
                                                <Link href={studentShow(student.id)} className="font-medium text-teal-700 hover:underline dark:text-teal-400">{student.name}</Link>
                                                <p className="mt-1 text-xs text-stone-500">{student.email}</p>
                                            </td>
                                            <td className="py-4 pr-4 font-mono text-xs text-teal-700 dark:text-teal-400">
                                                <Link href={studentShow(student.id)} className="hover:underline">{student.matric_number}</Link>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <p className="text-stone-700 dark:text-stone-300">{student.program}</p>
                                                <p className="mt-1 text-xs text-stone-500">{student.department} · Level {student.level}</p>
                                            </td>
                                            <td className="py-4"><Badge variant="outline" className="border-teal-200 text-teal-700 dark:border-teal-800 dark:text-teal-300">{student.status}</Badge></td>
                                        </tr>
                                    ))}
                                    {students.data.length === 0 && (
                                        <tr><td colSpan={4} className="py-12 text-center text-sm text-stone-500">No students registered yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Student registry',
            href: index(),
        },
    ],
};
