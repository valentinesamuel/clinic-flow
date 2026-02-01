import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, ShieldCheck, User, Clipboard, CreditCard, Users } from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; icon: typeof User; description: string }> = {
  admin: {
    label: 'Admin / Director',
    icon: ShieldCheck,
    description: 'Full clinic oversight',
  },
  doctor: {
    label: 'Doctor',
    icon: Stethoscope,
    description: 'Patient consultations',
  },
  nurse: {
    label: 'Nurse',
    icon: Clipboard,
    description: 'Triage & vitals',
  },
  billing: {
    label: 'Front Desk / Billing',
    icon: CreditCard,
    description: 'Payments & claims',
  },
  patient: {
    label: 'Patient',
    icon: Users,
    description: 'View appointments & results',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showDemo, setShowDemo] = useState(true);

  const handleDemoLogin = (role: UserRole) => {
    login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">LifeCare Clinic</h1>
          <p className="text-muted-foreground mt-1">Hospital Management System</p>
        </div>

        {/* Demo Role Selection */}
        {showDemo && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Demo Mode</CardTitle>
              <CardDescription>
                Select a role to explore the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                return (
                  <Button
                    key={role}
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                    onClick={() => handleDemoLogin(role)}
                  >
                    <Icon className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Traditional Login Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Staff Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="email@lifecare.ng"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12">
                Sign In
              </Button>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {}}
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:underline"
                  onClick={() => {}}
                >
                  Contact Admin
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Toggle Demo Mode */}
        <div className="text-center">
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? 'Hide demo options' : 'Show demo options'}
          </button>
        </div>
      </div>
    </div>
  );
}
