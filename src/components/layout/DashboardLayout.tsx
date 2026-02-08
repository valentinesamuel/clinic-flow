import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user.types';
import { AppSidebar } from './AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppHeader } from './AppHeader';
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const route = user.role === 'hospital_admin' ? '/hospital-admin' : user.role === 'clinical_lead' ? '/clinical-lead' : user.role === 'lab_tech' ? '/lab-tech' : `/${user.role}`;
    return <Navigate to={route} replace />;
  }

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <div className="hidden md:block fixed top-4 right-4 z-50">
          <SyncStatusIndicator />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
