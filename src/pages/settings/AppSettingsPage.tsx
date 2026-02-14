import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun, description: 'Always use light mode' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark mode' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Follow device preference' },
] as const;

export default function AppSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">Choose how the application looks</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {themeOptions.map(({ value, label, icon: Icon, description }) => (
              <Card
                key={value}
                className={cn(
                  'cursor-pointer transition-colors hover:border-primary',
                  theme === value && 'border-primary bg-primary/5'
                )}
                onClick={() => setTheme(value)}
              >
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <Icon className={cn('h-6 w-6', theme === value && 'text-primary')} />
                  <span className="font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
