// QueueBoard - Refactored to use atomic components

import { useState, useMemo } from 'react';
import { List, LayoutGrid } from 'lucide-react';
import { QueueEntry, QueueStatus } from '@/types/patient.types';

// Atomic and molecule components
import { QueueCard } from './QueueCard';
import { QueueStats } from './QueueStats';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface QueueColumn {
  id: QueueStatus;
  title: string;
  className?: string;
}

interface QueueBoardProps {
  entries: QueueEntry[];
  columns?: QueueColumn[];
  onStart?: (entry: QueueEntry) => void;
  onComplete?: (entry: QueueEntry) => void;
  onTransfer?: (entry: QueueEntry) => void;
  onSkip?: (entry: QueueEntry) => void;
  onViewHistory?: (patientId: string) => void;
  onSelectEntry?: (entry: QueueEntry) => void;
  showVitals?: boolean;
  title?: string;
}

const defaultColumns: QueueColumn[] = [
  { id: 'waiting', title: 'Waiting', className: 'bg-amber-50 dark:bg-amber-950/20' },
  { id: 'in_progress', title: 'In Progress', className: 'bg-blue-50 dark:bg-blue-950/20' },
  { id: 'completed', title: 'Completed', className: 'bg-green-50 dark:bg-green-950/20' },
];

export function QueueBoard({
  entries,
  columns = defaultColumns,
  onStart,
  onComplete,
  onTransfer,
  onSkip,
  onViewHistory,
  onSelectEntry,
  showVitals = false,
  title,
}: QueueBoardProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Calculate stats
  const stats = useMemo(() => {
    const waiting = entries.filter(e => e.status === 'waiting').length;
    const inProgress = entries.filter(e => e.status === 'in_progress').length;
    const completed = entries.filter(e => e.status === 'completed').length;
    const emergency = entries.filter(e => e.priority === 'emergency' && e.status !== 'completed').length;
    
    // Calculate average wait time
    const waitingEntries = entries.filter(e => e.status === 'waiting');
    const avgWaitTime = waitingEntries.length > 0
      ? Math.round(waitingEntries.reduce((sum, e) => {
          const waitMinutes = Math.floor((Date.now() - new Date(e.checkInTime).getTime()) / 60000);
          return sum + waitMinutes;
        }, 0) / waitingEntries.length)
      : 0;
    
    return { waiting, inProgress, completed, avgWaitTime, emergency };
  }, [entries]);

  // Group entries by status and sort by priority then check-in time
  const groupedEntries = useMemo(() => {
    const groups: Record<QueueStatus, QueueEntry[]> = {
      waiting: [],
      in_progress: [],
      completed: [],
      cancelled: [],
      no_show: [],
    };
    
    entries.forEach(entry => {
      if (groups[entry.status]) {
        groups[entry.status].push(entry);
      }
    });
    
    // Sort each group
    const priorityOrder = { emergency: 0, high: 1, normal: 2 };
    Object.keys(groups).forEach(status => {
      groups[status as QueueStatus].sort((a, b) => {
        // First by priority
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // Then by check-in time
        return new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime();
      });
    });
    
    return groups;
  }, [entries]);

  if (viewMode === 'list') {
    const allSorted = [...entries]
      .filter(e => e.status !== 'completed' && e.status !== 'cancelled')
      .sort((a, b) => {
        const priorityOrder = { emergency: 0, high: 1, normal: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime();
      });

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Board
            </Button>
          </div>
        </div>

        {/* Stats */}
        <QueueStats
          waiting={stats.waiting}
          inProgress={stats.inProgress}
          completed={stats.completed}
          avgWaitTime={stats.avgWaitTime}
          emergencyCount={stats.emergency}
        />

        {/* List View */}
        <div className="space-y-3">
          {allSorted.map((entry, index) => (
            <QueueCard
              key={entry.id}
              entry={entry}
              position={index + 1}
              showVitals={showVitals}
              onStart={onStart}
              onComplete={onComplete}
              onTransfer={onTransfer}
              onSkip={onSkip}
              onViewHistory={onViewHistory}
              onClick={onSelectEntry ? () => onSelectEntry(entry) : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Stats */}
      <QueueStats
        waiting={stats.waiting}
        inProgress={stats.inProgress}
        completed={stats.completed}
        avgWaitTime={stats.avgWaitTime}
        emergencyCount={stats.emergency}
      />

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(column => {
          const columnEntries = groupedEntries[column.id] || [];
          
          return (
            <div
              key={column.id}
              className={cn('rounded-lg p-3', column.className)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{column.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {columnEntries.length}
                </span>
              </div>
              
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-3 pr-2">
                  {columnEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No patients
                    </div>
                  ) : (
                    columnEntries.map((entry, index) => (
                      <QueueCard
                        key={entry.id}
                        entry={entry}
                        position={column.id === 'waiting' ? index + 1 : undefined}
                        variant="compact"
                        showVitals={showVitals && column.id !== 'completed'}
                        showActions={column.id !== 'completed'}
                        onStart={onStart}
                        onComplete={onComplete}
                        onTransfer={onTransfer}
                        onSkip={onSkip}
                        onViewHistory={onViewHistory}
                        onClick={onSelectEntry ? () => onSelectEntry(entry) : undefined}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
}
