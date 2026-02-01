import { useState } from 'react';
import { CloudOff, Cloud, RefreshCw, AlertCircle, Check, X } from 'lucide-react';
import { useSync, SyncStatus } from '@/contexts/SyncContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusConfig: Record<SyncStatus, {
  icon: typeof Cloud;
  label: string;
  description: string;
  className: string;
  iconClassName: string;
}> = {
  online: {
    icon: Check,
    label: 'Online',
    description: 'All changes saved',
    className: 'bg-success/10 text-success border-success/20',
    iconClassName: 'text-success',
  },
  syncing: {
    icon: RefreshCw,
    label: 'Syncing',
    description: 'Saving changes...',
    className: 'bg-syncing/10 text-syncing border-syncing/20',
    iconClassName: 'text-syncing animate-spin-slow',
  },
  offline: {
    icon: CloudOff,
    label: 'Offline',
    description: 'Working offline',
    className: 'bg-offline/10 text-offline border-offline/20',
    iconClassName: 'text-offline',
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    description: 'Cannot sync - check internet',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    iconClassName: 'text-destructive',
  },
};

export function SyncStatusIndicator() {
  const { status, pendingChanges, lastSyncTime, setStatus } = useSync();
  const [isOpen, setIsOpen] = useState(false);
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-10 w-10 rounded-full border transition-colors',
            config.className
          )}
          aria-label={`Sync status: ${config.label}`}
        >
          <Icon className={cn('h-5 w-5', config.iconClassName)} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              config.className
            )}>
              <Icon className={cn('h-5 w-5', config.iconClassName)} />
            </div>
            <div>
              <p className="font-medium">{config.label}</p>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
          
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last sync</span>
              <span className="font-medium">{formatLastSync(lastSyncTime)}</span>
            </div>
            {pendingChanges > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending changes</span>
                <span className="font-medium text-offline">{pendingChanges}</span>
              </div>
            )}
          </div>

          {/* Demo controls - for testing */}
          <div className="border-t pt-3">
            <p className="mb-2 text-xs text-muted-foreground">Demo: Change status</p>
            <div className="flex flex-wrap gap-1">
              {(['online', 'syncing', 'offline', 'error'] as SyncStatus[]).map((s) => (
                <Button
                  key={s}
                  variant={status === s ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setStatus(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
