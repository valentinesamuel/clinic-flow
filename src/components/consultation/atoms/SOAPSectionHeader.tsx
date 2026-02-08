import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SOAPSectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  badge?: string | number;
  locked?: boolean;
}

export function SOAPSectionHeader({ icon, title, description, badge, locked }: SOAPSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1">
        {icon}
        <div>
          <h3 className={cn("font-semibold text-sm", locked && "text-muted-foreground")}>
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
        {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
      </div>
    </div>
  );
}
