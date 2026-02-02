import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, roleMetadata, roleCategories } from '@/types/user.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, ShieldCheck, User, Clipboard, CreditCard, Users, TestTube, Pill, Building, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const roleIcons: Record<UserRole, typeof User> = {
  cmo: ShieldCheck, hospital_admin: Building, clinical_lead: UserCog, doctor: Stethoscope, nurse: Clipboard, receptionist: Users, billing: CreditCard, pharmacist: Pill, lab_tech: TestTube, patient: User,
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showDemo, setShowDemo] = useState(true);

  const handleDemoLogin = (role: UserRole) => {
    login(role);
    const route = role === 'hospital_admin' ? '/hospital-admin' : role === 'clinical_lead' ? '/clinical-lead' : role === 'lab_tech' ? '/lab-tech' : `/${role}`;
    navigate(route);
  };

  const renderRoleGroup = (title: string, roles: UserRole[], isHybrid = false) => (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        {title}
        {isHybrid && <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>}
      </p>
      {roles.map((role) => {
        const meta = roleMetadata[role];
        const Icon = roleIcons[role];
        return (
          <Button key={role} variant="outline" className="w-full justify-start h-auto py-3" onClick={() => handleDemoLogin(role)}>
            <Icon className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <p className="font-medium">{meta.label}</p>
              <p className="text-xs text-muted-foreground">{meta.description}</p>
            </div>
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">LifeCare Clinic</h1>
          <p className="text-muted-foreground mt-1">Hospital Management System</p>
        </div>

        {showDemo && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Demo Mode</CardTitle>
              <CardDescription>Select a role to explore the dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderRoleGroup('Executive & Administration', roleCategories.executive)}
              {renderRoleGroup('Clinical Staff', roleCategories.clinical)}
              {renderRoleGroup('Support Staff', roleCategories.support)}
              {renderRoleGroup('Hybrid Modules', roleCategories.hybrid, true)}
              {renderRoleGroup('Patient Portal', roleCategories.portal)}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setShowDemo(!showDemo)}>
            {showDemo ? 'Hide demo options' : 'Show demo options'}
          </button>
        </div>
      </div>
    </div>
  );
}
