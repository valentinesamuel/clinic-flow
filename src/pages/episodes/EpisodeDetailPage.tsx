import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EpisodeDetailView } from '@/components/billing/organisms/episode/EpisodeDetailView';
import { useEpisodes } from '@/hooks/queries/useEpisodeQueries';
import { Episode } from '@/types/episode.types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EpisodeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: episodesData = [] } = useEpisodes();
  const episode: Episode | undefined = id ? (episodesData as Episode[]).find((e: Episode) => e.id === id) : undefined;

  if (!episode) {
    return (
      <DashboardLayout allowedRoles={['receptionist', 'cashier', 'hospital_admin', 'cmo', 'doctor']}>
        <div className="p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Episode Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The episode you are looking for does not exist.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['receptionist', 'cashier', 'hospital_admin', 'cmo', 'doctor']}>
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Episodes
        </Button>

        <EpisodeDetailView episode={episode} />
      </div>
    </DashboardLayout>
  );
}
