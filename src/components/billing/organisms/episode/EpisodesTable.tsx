import { Episode, EpisodeStatus } from '@/types/episode.types';
import { EpisodeBadge } from '@/components/atoms/display/EpisodeBadge';
import { EpisodeTimerBadge } from '@/components/atoms/display/EpisodeTimerBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface EpisodesTableProps {
  episodes: Episode[];
  onRowClick: (episode: Episode) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EpisodesTable({ episodes, onRowClick }: EpisodesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Episode #</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Billed</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {episodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No episodes found.
              </TableCell>
            </TableRow>
          ) : (
            episodes.map((episode) => (
              <TableRow
                key={episode.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onRowClick(episode)}
              >
                <TableCell className="font-medium">
                  <button
                    className="text-primary hover:underline font-mono"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(episode);
                    }}
                  >
                    {episode.episodeNumber}
                  </button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{episode.patientName}</p>
                    <p className="text-sm text-muted-foreground">{episode.patientMrn}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <EpisodeBadge status={episode.status} />
                    <EpisodeTimerBadge episode={episode} />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">
                      {format(new Date(episode.createdAt), 'dd MMM yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(episode.createdAt), 'h:mm a')}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">
                      {format(new Date(episode.expiresAt), 'dd MMM yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(episode.expiresAt), 'h:mm a')}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(episode.totalBilled)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-medium ${
                      episode.totalBalance > 0 ? 'text-destructive' : 'text-green-600'
                    }`}
                  >
                    {formatCurrency(episode.totalBalance)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
