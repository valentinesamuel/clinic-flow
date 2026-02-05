import { format } from 'date-fns';
import { ClaimVersion, ClaimStatus } from '@/types/billing.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClaimVersionHistoryProps {
  versions: ClaimVersion[];
  currentVersion: number;
}

const statusLabels: Record<ClaimStatus, string> = {
  draft: 'Draft Created',
  submitted: 'Submitted',
  processing: 'Processing',
  approved: 'Approved',
  denied: 'Denied',
  paid: 'Paid',
};

const statusColors: Record<ClaimStatus, string> = {
  draft: 'bg-muted',
  submitted: 'bg-primary',
  processing: 'bg-secondary',
  approved: 'bg-green-500',
  denied: 'bg-destructive',
  paid: 'bg-green-600',
};

export function ClaimVersionHistory({ versions, currentVersion }: ClaimVersionHistoryProps) {
  // Sort versions in descending order (newest first)
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-border" />

      <div className="space-y-4">
        {sortedVersions.map((version, index) => {
          const isCurrent = version.version === currentVersion;
          
          return (
            <div key={version.version} className="relative flex gap-4 pl-6">
              {/* Timeline dot */}
              <div
                className={cn(
                  'absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-background',
                  statusColors[version.status]
                )}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">v{version.version}</span>
                  <Badge variant={isCurrent ? 'default' : 'outline'} className="text-xs">
                    {statusLabels[version.status]}
                  </Badge>
                  {isCurrent && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(version.changedAt), 'dd MMM yyyy, h:mm a')}
                  {version.changedByName && ` • ${version.changedByName}`}
                </p>
                {version.notes && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    "{version.notes}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
