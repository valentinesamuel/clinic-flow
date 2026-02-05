import { useLocation, Link } from 'react-router-dom';
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
  Pill,
  Settings,
  LogOut,
  Search,
  Menu,
  Package,
  UserPlus,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationByRole: Record<UserRole, NavGroup[]> = {
  cmo: [
    { label: 'Overview', items: [{ title: 'Dashboard', href: '/cmo', icon: LayoutDashboard }] },
    { label: 'Clinical', items: [
      { title: 'Patients', href: '/cmo/patients', icon: Users },
      { title: 'Appointments', href: '/cmo/appointments', icon: Calendar },
    ]},
    { label: 'Administrative', items: [
      { title: 'Staff', href: '/cmo/staff', icon: UserCog },
      { title: 'Reports', href: '/cmo/reports', icon: FileText },
      { title: 'Billing', href: '/cmo/billing', icon: Receipt },
    ]},
    { label: 'Settings', items: [
      { title: 'Permissions', href: '/cmo/settings/permissions', icon: Shield },
    ]},
  ],
  hospital_admin: [
    { label: 'Overview', items: [{ title: 'Dashboard', href: '/hospital-admin', icon: LayoutDashboard }] },
    { label: 'Finance', items: [
      { title: 'Billing', href: '/hospital-admin/billing', icon: Receipt, badge: 5 },
      { title: 'HMO Claims', href: '/hospital-admin/claims', icon: FileCheck },
    ]},
    { label: 'Operations', items: [
      { title: 'Inventory', href: '/hospital-admin/inventory', icon: Package },
      { title: 'Staff', href: '/hospital-admin/staff', icon: UserCog },
      { title: 'Reports', href: '/hospital-admin/reports', icon: FileText },
    ]},
  ],
  clinical_lead: [
    { label: 'Overview', items: [{ title: 'Dashboard', href: '/clinical-lead', icon: LayoutDashboard }] },
    { label: 'Clinical', items: [
      { title: 'Patient Queue', href: '/clinical-lead/queue', icon: ClipboardList, badge: 8 },
      { title: 'Lab Results', href: '/clinical-lead/lab-results', icon: TestTube, badge: 3 },
    ]},
    { label: 'Staff', items: [
      { title: 'Medical Staff', href: '/clinical-lead/staff', icon: UserCog },
      { title: 'Roster', href: '/clinical-lead/roster', icon: Calendar },
    ]},
  ],
  doctor: [
    { label: 'Clinical', items: [
      { title: 'Dashboard', href: '/doctor', icon: LayoutDashboard },
      { title: 'Patient Queue', href: '/doctor/queue', icon: ClipboardList, badge: 8 },
      { title: 'Patients', href: '/doctor/patients', icon: Users },
      { title: 'Prescriptions', href: '/doctor/prescriptions', icon: Pill },
    ]},
    { label: 'Diagnostics', items: [
      { title: 'Lab Results', href: '/doctor/lab-results', icon: TestTube, badge: 3 },
    ]},
  ],
  nurse: [
    { label: 'Clinical', items: [
      { title: 'Dashboard', href: '/nurse', icon: LayoutDashboard },
      { title: 'Triage', href: '/nurse/triage', icon: Stethoscope, badge: 4 },
      { title: 'Patient Queue', href: '/nurse/queue', icon: ClipboardList },
      { title: 'Vitals', href: '/nurse/vitals', icon: Activity },
    ]},
  ],
  receptionist: [
    { label: 'Reception', items: [
      { title: 'Dashboard', href: '/receptionist', icon: LayoutDashboard },
      { title: 'Check-In Queue', href: '/receptionist/check-in', icon: ClipboardList, badge: 3 },
      { title: 'New Patient', href: '/receptionist/register', icon: UserPlus },
    ]},
    { label: 'Scheduling', items: [
      { title: 'Appointments', href: '/receptionist/appointments', icon: Calendar },
      { title: 'Waiting Room', href: '/receptionist/waiting', icon: Users },
    ]},
  ],
  billing: [
    { label: 'Finance', items: [
      { title: 'Dashboard', href: '/billing', icon: LayoutDashboard },
      { title: 'Bills', href: '/billing/bills', icon: Receipt, badge: 12 },
      { title: 'HMO Claims', href: '/billing/claims', icon: FileCheck, badge: 7 },
      { title: 'Payments', href: '/billing/payments', icon: CreditCard },
    ]},
  ],
  pharmacist: [
    { label: 'Pharmacy', items: [
      { title: 'Dashboard', href: '/pharmacist', icon: LayoutDashboard },
      { title: 'Prescriptions', href: '/pharmacist/prescriptions', icon: Pill, badge: 5 },
      { title: 'Stock', href: '/pharmacist/stock', icon: Package },
    ]},
  ],
  lab_tech: [
    { label: 'Laboratory', items: [
      { title: 'Dashboard', href: '/lab-tech', icon: LayoutDashboard },
      { title: 'Sample Queue', href: '/lab-tech/samples', icon: TestTube, badge: 6 },
      { title: 'Results', href: '/lab-tech/results', icon: FileText },
    ]},
  ],
  patient: [
    { label: 'My Health', items: [
      { title: 'Home', href: '/patient', icon: LayoutDashboard },
      { title: 'Appointments', href: '/patient/appointments', icon: Calendar },
      { title: 'Lab Results', href: '/patient/results', icon: TestTube },
      { title: 'Bills', href: '/patient/bills', icon: Receipt },
    ]},
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  if (!user) return null;
  
  const navigation = navigationByRole[user.role];
  const baseRoute = user.role === 'hospital_admin' ? '/hospital-admin' : user.role === 'clinical_lead' ? '/clinical-lead' : user.role === 'lab_tech' ? '/lab-tech' : `/${user.role}`;
  
  const isActive = (href: string) => {
    if (href === baseRoute) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={cn('hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300', collapsed ? 'w-16' : 'w-60')}>
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-9 w-9 shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
        {!collapsed && <div className="overflow-hidden"><h1 className="font-semibold text-sidebar-foreground truncate">LifeCare Clinic</h1></div>}
      </div>
      
      {!collapsed && (
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9 bg-sidebar-accent border-0" />
          </div>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navigation.map((group) => (
          <div key={group.label}>
            {!collapsed && <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{group.label}</p>}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link to={item.href} className={cn('flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors', 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', active ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' : 'text-sidebar-foreground')} title={collapsed ? item.title : undefined}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (<><span className="flex-1 truncate">{item.title}</span>{item.badge && <Badge variant="secondary" className="h-5 min-w-5 text-xs">{item.badge}</Badge>}</>)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <Link to={`${baseRoute}/settings`} className={cn('flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground', 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors')}>
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button onClick={logout} className={cn('flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground', 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors')}>
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mt-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">{user.name.charAt(0)}</div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
