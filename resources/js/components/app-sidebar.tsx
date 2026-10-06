import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, GraduationCap, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as academicIndex } from '@/routes/admin/academic';
import { index as studentsIndex } from '@/routes/admin/students';
import { index as timetableIndex } from '@/routes/admin/timetable';
import { view as timetableView } from '@/routes/timetable';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(auth.user.role === 'super_admin'
            ? [
                  {
                      title: 'Academic catalog',
                      href: academicIndex.url(),
                      icon: GraduationCap,
                  },
                  {
                      title: 'Student registry',
                      href: studentsIndex.url(),
                      icon: GraduationCap,
                  },
                  {
                      title: 'Timetable builder',
                      href: timetableIndex.url(),
                      icon: CalendarDays,
                  },
              ]
            : []),
                ...(auth.user.role === 'student' || auth.user.role === 'lecturer'
                        ? [
                                    {
                                            title: 'My timetable',
                                            href: timetableView.url(),
                                            icon: CalendarDays,
                                    },
                            ]
                        : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
