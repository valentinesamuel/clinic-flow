import { Card, CardContent } from '@/components/ui/card';
import { EpisodeBadge } from '@/components/atoms/display/EpisodeBadge';
import { EpisodeTimerBadge } from '@/components/atoms/display/EpisodeTimerBadge';
import { Episode } from '@/types/episode.types';
import { Receipt, Stethoscope, FlaskConical, Pill, FileCheck } from 'lucide-react';

interface EpisodeSummaryCardProps {
  episode: Episode;
  onClick?: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EpisodeSummaryCard({ episode, onClick }: EpisodeSummaryCardProps) {
  return (
    <Card
      className={onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{episode.episodeNumber}</p>
            <p className="font-medium">{episode.patientName}</p>
            <p className="text-xs text-muted-foreground">{episode.patientMrn}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <EpisodeBadge status={episode.status} />
            <EpisodeTimerBadge episode={episode} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-muted-foreground">Billed</p>
            <p className="font-medium">{formatCurrency(episode.totalBilled)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Paid</p>
            <p className="font-medium text-green-600">{formatCurrency(episode.totalPaid)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Balance</p>
            <p className={`font-medium ${episode.totalBalance > 0 ? 'text-destructive' : 'text-green-600'}`}>
              {formatCurrency(episode.totalBalance)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Receipt className="h-3 w-3" />
            {episode.billIds.length}
          </span>
          <span className="flex items-center gap-1">
            <Stethoscope className="h-3 w-3" />
            {episode.consultationIds.length}
          </span>
          <span className="flex items-center gap-1">
            <FlaskConical className="h-3 w-3" />
            {episode.labOrderIds.length}
          </span>
          <span className="flex items-center gap-1">
            <Pill className="h-3 w-3" />
            {episode.prescriptionIds.length}
          </span>
          <span className="flex items-center gap-1">
            <FileCheck className="h-3 w-3" />
            {episode.claimIds.length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
