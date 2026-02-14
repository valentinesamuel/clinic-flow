import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EpisodesTable } from '@/components/billing/organisms/episode/EpisodesTable';
import { EpisodeCreationModal } from '@/components/billing/organisms/episode/EpisodeCreationModal';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { getEpisodesPaginated, createEpisode } from '@/data/episodes';
import { EpisodeStatus } from '@/types/episode.types';
import { Search, Activity, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const statusTabs: { value: EpisodeStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending_results', label: 'Pending' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'completed', label: 'Completed' },
  { value: 'auto_completed', label: 'Auto-Completed' },
];

export default function EpisodeListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EpisodeStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showCreation, setShowCreation] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: episodes, total, totalPages } = getEpisodesPaginated(
    currentPage,
    pageSize,
    {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
    }
  );

  const baseRoute = user
    ? user.role === 'hospital_admin'
      ? '/hospital-admin'
      : user.role === 'clinical_lead'
        ? '/clinical-lead'
        : user.role === 'lab_tech'
          ? '/lab-tech'
          : `/${user.role}`
    : '';

  const handleRowClick = (episode: { id: string }) => {
    navigate(`${baseRoute}/episodes/${episode.id}`);
  };

  const handleCreate = (data: { patientId: string; patientName: string; patientMrn: string; notes?: string }) => {
    createEpisode({
      episodeNumber: `EP-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      patientMrn: data.patientMrn,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      billIds: [],
      consultationIds: [],
      labOrderIds: [],
      prescriptionIds: [],
      claimIds: [],
      totalBilled: 0,
      totalPaid: 0,
      totalBalance: 0,
      isLockedForAudit: false,
      notes: data.notes,
    });
    toast({
      title: 'Episode Created',
      description: `New episode created for ${data.patientName}`,
    });
    setShowCreation(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <DashboardLayout allowedRoles={['receptionist', 'cashier', 'hospital_admin', 'cmo', 'doctor']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Patient Episodes
            </h1>
            <p className="text-muted-foreground">
              Track end-to-end patient care episodes
            </p>
          </div>
          <Button onClick={() => setShowCreation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Episode
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-xl text-primary">
                {episodes.filter(e => e.status === 'active').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Results</CardDescription>
              <CardTitle className="text-xl text-amber-600">
                {episodes.filter(e => e.status === 'pending_results').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Follow-up</CardDescription>
              <CardTitle className="text-xl text-purple-600">
                {episodes.filter(e => e.status === 'follow_up').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-xl text-green-600">
                {episodes.filter(e => ['completed', 'auto_completed'].includes(e.status)).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Episodes
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search episodes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as EpisodeStatus | 'all');
                setCurrentPage(1);
              }}
              className="mb-4"
            >
              <TabsList className="flex-wrap">
                {statusTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <EpisodesTable episodes={episodes} onRowClick={handleRowClick} />

            <div className="flex items-center justify-between mt-4">
              <QueuePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <EpisodeCreationModal
        open={showCreation}
        onOpenChange={setShowCreation}
        onComplete={handleCreate}
      />
    </DashboardLayout>
  );
}
