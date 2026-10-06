import { Form, Head } from '@inertiajs/react';
import { BookOpen, Building2, Layers3 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/admin/academic';
import { store as departmentStore } from '@/routes/admin/academic/departments';
import { store as programStore } from '@/routes/admin/academic/programs';
import { store as courseStore } from '@/routes/admin/academic/courses';

type Program = {
    id: number;
    name: string;
    code: string;
    duration_years: number;
};

type Course = {
    id: number;
    name: string;
    code: string;
    credit_units: number;
    is_active: boolean;
};

type Department = {
    id: number;
    name: string;
    code: string;
    programs_count: number;
    courses_count: number;
    programs: Program[];
    courses: Course[];
};

type Props = {
    departments: Department[];
};

export default function AcademicIndex({ departments: departmentList }: Props) {
    return (
        <>
            <Head title="Academic catalog" />
            <div className="flex flex-1 flex-col gap-8 bg-stone-50/70 p-4 sm:p-6 lg:p-8 dark:bg-stone-950/30">
                <header className="border-b border-stone-200 pb-7 dark:border-stone-800">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-400">
                        <Layers3 className="size-4" />
                        Central administration
                    </div>
                    <h1 className="font-serif text-3xl tracking-tight text-stone-900 dark:text-stone-100">Academic catalog</h1>
                    <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
                        Shape the academic structure that powers enrollment, teaching assignments, and student records.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-3">
                    <CatalogForm title="New department" icon={<Building2 />} action={departmentStore.form()} fields={['name', 'code']} labels={['Department name', 'Department code']} />
                    <CatalogForm title="New program" icon={<Layers3 />} action={programStore.form()} fields={['department_id', 'name', 'code', 'duration_years']} labels={['Department ID', 'Program name', 'Program code', 'Duration in years']} departmentList={departmentList} />
                    <CatalogForm title="New course" icon={<BookOpen />} action={courseStore.form()} fields={['department_id', 'name', 'code', 'credit_units']} labels={['Department ID', 'Course name', 'Course code', 'Credit units']} departmentList={departmentList} />
                </div>

                <section className="border border-stone-200 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-5 dark:border-stone-800">
                        <div>
                            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Department structure</h2>
                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Programs and courses currently available for enrollment.</p>
                        </div>
                        <span className="text-xs font-medium text-teal-700 dark:text-teal-400">{departmentList.length} departments</span>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {departmentList.map((department) => (
                            <div key={department.id} className="border border-stone-200 p-4 dark:border-stone-800">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">{department.code}</p>
                                        <h3 className="mt-1 font-medium text-stone-900 dark:text-stone-100">{department.name}</h3>
                                    </div>
                                    <span className="text-xs text-stone-500">{department.programs_count} programs</span>
                                </div>
                                <div className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
                                    <div className="flex flex-wrap gap-2">
                                        {department.programs.map((program) => (
                                            <span key={program.id} className="rounded-md bg-teal-50 px-2 py-1 font-medium text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                                                {program.code} · {program.name}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="mt-3 font-medium text-stone-700 dark:text-stone-300">
                                        {department.courses_count} courses
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {department.courses.map((course) => (
                                            <div key={course.id} className="flex items-center justify-between gap-3">
                                                <span>{course.code} · {course.name}</span>
                                                <span className="shrink-0">{course.credit_units} credits</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {departmentList.length === 0 && <p className="py-8 text-sm text-stone-500">No departments created yet.</p>}
                    </div>
                </section>
            </div>
        </>
    );
}

function CatalogForm({
    title,
    icon,
    action,
    fields,
    labels,
    departmentList = [],
}: {
    title: string;
    icon: React.ReactNode;
    action: { action: string; method: 'post' };
    fields: string[];
    labels: string[];
    departmentList?: Department[];
}) {
    return (
        <section className="border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
                <div className="flex size-9 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">{icon}</div>
                <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
            </div>
            <Form {...action} className="mt-5 space-y-4">
                {({ errors, processing }) => (
                    <>
                        {fields.map((field, fieldIndex) => (
                            <div key={field} className="grid gap-2">
                                <Label htmlFor={field}>{labels[fieldIndex]}</Label>
                                {field === 'department_id' ? (
                                    <select id={field} name={field} required className="border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                        <option value="">Select department</option>
                                        {departmentList.map((department) => <option key={department.id} value={department.id}>{department.code} · {department.name}</option>)}
                                    </select>
                                ) : (
                                    <Input id={field} name={field} type={field.includes('years') || field === 'credit_units' ? 'number' : 'text'} required placeholder={labels[fieldIndex]} />
                                )}
                                <InputError message={errors[field]} />
                            </div>
                        ))}
                        <Button type="submit" disabled={processing} className="w-full bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500">
                            {processing ? 'Saving...' : `Create ${title.replace('New ', '').toLowerCase()}`}
                        </Button>
                    </>
                )}
            </Form>
        </section>
    );
}

AcademicIndex.layout = {
    breadcrumbs: [
        {
            title: 'Academic catalog',
            href: index(),
        },
    ],
};
