import { format } from 'date-fns';
import { EpisodeTimelineEvent } from '@/types/episode.types';
import { cn } from '@/lib/utils';
import {
  Receipt,
  Stethoscope,
  FlaskConical,
  Pill,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';

interface EpisodeTimelineProps {
  events: EpisodeTimelineEvent[];
}

const eventIcons: Record<EpisodeTimelineEvent['eventType'], React.ReactNode> = {
  created: <Plus className="h-3.5 w-3.5" />,
  bill_created: <Receipt className="h-3.5 w-3.5" />,
  consultation: <Stethoscope className="h-3.5 w-3.5" />,
  lab_ordered: <FlaskConical className="h-3.5 w-3.5" />,
  lab_results: <FlaskConical className="h-3.5 w-3.5" />,
  prescription: <Pill className="h-3.5 w-3.5" />,
  follow_up: <Calendar className="h-3.5 w-3.5" />,
  bill_updated: <Receipt className="h-3.5 w-3.5" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5" />,
  auto_completed: <Clock className="h-3.5 w-3.5" />,
};

const eventColors: Record<EpisodeTimelineEvent['eventType'], string> = {
  created: 'bg-primary text-primary-foreground',
  bill_created: 'bg-blue-500 text-white',
  consultation: 'bg-green-500 text-white',
  lab_ordered: 'bg-amber-500 text-white',
  lab_results: 'bg-green-500 text-white',
  prescription: 'bg-purple-500 text-white',
  follow_up: 'bg-cyan-500 text-white',
  bill_updated: 'bg-blue-500 text-white',
  completed: 'bg-green-600 text-white',
  auto_completed: 'bg-muted-foreground text-background',
};

export function EpisodeTimeline({ events }: EpisodeTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-0">
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center shrink-0',
                eventColors[event.eventType]
              )}
            >
              {eventIcons[event.eventType]}
            </div>
            {index < sortedEvents.length - 1 && (
              <div className="w-0.5 flex-1 bg-border min-h-[24px]" />
            )}
          </div>
          <div className="pb-4 pt-0.5">
            <p className="text-sm font-medium">{event.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{event.actorName}</span>
              <span>·</span>
              <span>
                {format(new Date(event.timestamp), 'dd MMM yyyy, h:mm a')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
