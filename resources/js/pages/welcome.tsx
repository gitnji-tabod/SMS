import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="SHIBUST" />
            <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-6 lg:px-8">
                    <Link href={login()} className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold tracking-widest text-white">S</span>
                        <span className="hidden text-sm font-semibold tracking-[0.16em] text-teal-300 sm:block">SHIBUST</span>
                    </Link>
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Button asChild variant="outline" className="border-stone-700 bg-transparent text-stone-100 hover:bg-stone-800 hover:text-white">
                                <Link href={dashboard()}>Dashboard <ArrowRight /></Link>
                            </Button>
                        ) : (
                            <>
                                <Link href={login()} className="px-3 py-2 text-sm text-stone-300 hover:text-white">Log in</Link>
                                <Button asChild className="bg-amber-400 text-stone-950 hover:bg-amber-300">
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16 lg:px-8 lg:py-24">
                    <div className="grid w-full gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <section>
                            <p className="mb-6 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
                                <span className="size-2 rounded-full bg-amber-300" />
                                Student management platform
                            </p>
                            <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl">
                                Solidarity Higher Institute of Business Science and Technology
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-400">
                                One connected place for students, lecturers, academic services, finance, and university leadership.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button asChild size="lg" className="bg-teal-500 text-stone-950 hover:bg-teal-400">
                                    <Link href={login()}>Enter the portal <ArrowRight /></Link>
                                </Button>
                            </div>
                        </section>

                        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" aria-label="University portal areas">
                            <PortalCard icon={<GraduationCap />} title="Academic life" detail="Courses, timetables, assignments, and student progress." />
                            <PortalCard icon={<Building2 />} title="University operations" detail="People, records, finance, and central administration." />
                        </section>
                    </div>
                </main>

                <footer className="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-stone-500 lg:px-8">
                    SHIBUST · Solidarity Higher Institute of Business Science and Technology
                </footer>
            </div>
        </>
    );
}

function PortalCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
    return (
        <div className="border border-stone-800 bg-stone-900/70 p-5">
            <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-teal-950 text-teal-300">{icon}</div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">{detail}</p>
        </div>
    );
}
