import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  ClipboardList,
  Stethoscope,
  Activity,
  Receipt,
  CreditCard,
  FileCheck,
  Calendar,
  TestTube,
  MoreHorizontal,
  Home,
  Pill,
} from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const mobileNavByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Patients', href: '/admin/patients', icon: Users },
    { title: 'Staff', href: '/admin/staff', icon: UserCog },
    { title: 'Reports', href: '/admin/reports', icon: FileText },
    { title: 'More', href: '/admin/more', icon: MoreHorizontal },
  ],
  doctor: [
    { title: 'Dashboard', href: '/doctor', icon: LayoutDashboard },
    { title: 'Queue', href: '/doctor/queue', icon: ClipboardList },
    { title: 'Patients', href: '/doctor/patients', icon: Users },
    { title: 'Rx', href: '/doctor/prescriptions', icon: Pill },
    { title: 'More', href: '/doctor/more', icon: MoreHorizontal },
  ],
  nurse: [
    { title: 'Dashboard', href: '/nurse', icon: LayoutDashboard },
    { title: 'Triage', href: '/nurse/triage', icon: Stethoscope },
    { title: 'Queue', href: '/nurse/queue', icon: ClipboardList },
    { title: 'Vitals', href: '/nurse/vitals', icon: Activity },
    { title: 'More', href: '/nurse/more', icon: MoreHorizontal },
  ],
  billing: [
    { title: 'Dashboard', href: '/billing', icon: LayoutDashboard },
    { title: 'Bills', href: '/billing/bills', icon: Receipt },
    { title: 'Claims', href: '/billing/claims', icon: FileCheck },
    { title: 'Payments', href: '/billing/payments', icon: CreditCard },
    { title: 'More', href: '/billing/more', icon: MoreHorizontal },
  ],
  patient: [
    { title: 'Home', href: '/patient', icon: Home },
    { title: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { title: 'Results', href: '/patient/results', icon: TestTube },
    { title: 'Bills', href: '/patient/bills', icon: Receipt },
    { title: 'More', href: '/patient/more', icon: MoreHorizontal },
  ],
};

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const navItems = mobileNavByRole[user.role];
  
  const isActive = (href: string) => {
    const baseRoute = `/${user.role}`;
    if (href === baseRoute) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <ul className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors',
                  active 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-6 w-6 mb-1', active && 'text-primary')} />
                <span className={cn(
                  'text-[10px]',
                  active && 'font-medium'
                )}>
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
