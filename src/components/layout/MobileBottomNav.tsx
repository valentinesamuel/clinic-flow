import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, FileText, ClipboardList, Stethoscope, Activity, Receipt, CreditCard, FileCheck, Calendar, TestTube, MoreHorizontal, Home, Pill, Package, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user.types';
import { cn } from '@/lib/utils';

interface NavItem { title: string; href: string; icon: typeof LayoutDashboard; }

const mobileNavByRole: Record<UserRole, NavItem[]> = {
  cmo: [
    { title: 'Dashboard', href: '/cmo', icon: LayoutDashboard },
    { title: 'Patients', href: '/cmo/patients', icon: Users },
    { title: 'Staff', href: '/cmo/staff', icon: UserCog },
    { title: 'Settings', href: '/cmo/settings/permissions', icon: Shield },
    { title: 'More', href: '/cmo/more', icon: MoreHorizontal },
  ],
  hospital_admin: [
    { title: 'Dashboard', href: '/hospital-admin', icon: LayoutDashboard },
    { title: 'Billing', href: '/hospital-admin/billing', icon: Receipt },
    { title: 'Inventory', href: '/hospital-admin/inventory', icon: Package },
    { title: 'Staff', href: '/hospital-admin/staff', icon: UserCog },
    { title: 'More', href: '/hospital-admin/more', icon: MoreHorizontal },
  ],
  clinical_lead: [
    { title: 'Dashboard', href: '/clinical-lead', icon: LayoutDashboard },
    { title: 'Queue', href: '/clinical-lead/queue', icon: ClipboardList },
    { title: 'Lab', href: '/clinical-lead/lab-results', icon: TestTube },
    { title: 'Staff', href: '/clinical-lead/staff', icon: UserCog },
    { title: 'More', href: '/clinical-lead/more', icon: MoreHorizontal },
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
  receptionist: [
    { title: 'Dashboard', href: '/receptionist', icon: LayoutDashboard },
    { title: 'Check-In', href: '/receptionist/check-in', icon: ClipboardList },
    { title: 'Register', href: '/receptionist/register', icon: UserPlus },
    { title: 'Appointments', href: '/receptionist/appointments', icon: Calendar },
    { title: 'More', href: '/receptionist/more', icon: MoreHorizontal },
  ],
  billing: [
    { title: 'Dashboard', href: '/billing', icon: LayoutDashboard },
    { title: 'Bills', href: '/billing/bills', icon: Receipt },
    { title: 'Claims', href: '/billing/claims', icon: FileCheck },
    { title: 'Payments', href: '/billing/payments', icon: CreditCard },
    { title: 'More', href: '/billing/more', icon: MoreHorizontal },
  ],
  pharmacist: [
    { title: 'Dashboard', href: '/pharmacist', icon: LayoutDashboard },
    { title: 'Rx Queue', href: '/pharmacist/prescriptions', icon: Pill },
    { title: 'Stock', href: '/pharmacist/stock', icon: Package },
    { title: 'More', href: '/pharmacist/more', icon: MoreHorizontal },
  ],
  lab_tech: [
    { title: 'Dashboard', href: '/lab-tech', icon: LayoutDashboard },
    { title: 'Samples', href: '/lab-tech/samples', icon: TestTube },
    { title: 'Results', href: '/lab-tech/results', icon: FileText },
    { title: 'More', href: '/lab-tech/more', icon: MoreHorizontal },
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
  const baseRoute = user.role === 'hospital_admin' ? '/hospital-admin' : user.role === 'clinical_lead' ? '/clinical-lead' : user.role === 'lab_tech' ? '/lab-tech' : `/${user.role}`;
  const isActive = (href: string) => { if (href === baseRoute) return location.pathname === href; return location.pathname.startsWith(href); };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <ul className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link to={item.href} className={cn('flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors', active ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                <item.icon className={cn('h-6 w-6 mb-1', active && 'text-primary')} />
                <span className={cn('text-[10px]', active && 'font-medium')}>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
