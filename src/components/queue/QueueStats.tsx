// QueueStats - Queue statistics summary display

import { Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { QueueType } from '@/types/patient.types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QueueStatsProps {
  queueType?: QueueType;
  waiting: number;
  inProgress: number;
  completed: number;
  avgWaitTime: number;
  emergencyCount?: number;
  className?: string;
}

export function QueueStats({
  queueType,
  waiting,
  inProgress,
  completed,
  avgWaitTime,
  emergencyCount = 0,
  className,
}: QueueStatsProps) {
  const stats = [
    {
      label: 'Waiting',
      value: waiting,
      icon: Users,
      className: 'text-amber-600 bg-amber-500/10',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: TrendingUp,
      className: 'text-primary bg-primary/10',
    },
    {
      label: 'Completed',
      value: completed,
      icon: Users,
      className: 'text-green-600 bg-green-500/10',
    },
    {
      label: 'Avg Wait',
      value: `${avgWaitTime}m`,
      icon: Clock,
      className: avgWaitTime > 30 ? 'text-destructive bg-destructive/10' : 'text-muted-foreground bg-muted',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      {stats.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', stat.className)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {emergencyCount > 0 && (
        <Card className="border-destructive bg-destructive/5 col-span-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-destructive text-destructive-foreground animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-destructive">{emergencyCount} Emergency Patient{emergencyCount > 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground">Requires immediate attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Compact inline version for headers
export function QueueStatsInline({
  waiting,
  avgWaitTime,
  emergencyCount = 0,
}: {
  waiting: number;
  avgWaitTime: number;
  emergencyCount?: number;
}) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{waiting}</span>
        <span className="text-muted-foreground">waiting</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className={cn('font-medium', avgWaitTime > 30 && 'text-destructive')}>
          ~{avgWaitTime}m
        </span>
        <span className="text-muted-foreground">avg wait</span>
      </div>
      {emergencyCount > 0 && (
        <div className="flex items-center gap-1.5 text-destructive">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span className="font-medium">{emergencyCount} emergency</span>
        </div>
      )}
    </div>
  );
}
