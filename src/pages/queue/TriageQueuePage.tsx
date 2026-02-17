// TriageQueuePage - Nurse triage queue management

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RefreshCw, Stethoscope } from 'lucide-react';
import { QueueEntry } from '@/types/patient.types';
import { useQueueByType } from '@/hooks/queries/useQueueQueries';
import { useUpdateQueueEntry } from '@/hooks/mutations/useQueueMutations';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QueueBoard } from '@/components/queue/QueueBoard';
import { TriagePanel } from '@/components/queue/TriagePanel';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { PAGINATION } from '@/constants/designSystem';

export default function TriageQueuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedEntry, setSelectedEntry] = useState<QueueEntry | null>(null);
  const [triagePanelOpen, setTriagePanelOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.defaultPageSize);

  // Get triage queue entries
  const triageQueue = useMemo(() => {
    return getQueueByType('triage');
  }, [refreshKey]);

  // Calculate pagination
  const totalPages = Math.ceil(triageQueue.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQueue = triageQueue.slice(startIndex, startIndex + itemsPerPage);

  const stats = getQueueStats('triage');

  const handleStart = (entry: QueueEntry) => {
    startQueueEntry(entry.id, user?.id);
    setSelectedEntry(entry);
    setTriagePanelOpen(true);
    setRefreshKey(k => k + 1);
  };

  const handleComplete = () => {
    setTriagePanelOpen(false);
    setSelectedEntry(null);
    setRefreshKey(k => k + 1);
    toast({
      title: 'Triage Completed',
      description: 'Patient has been moved to the doctor queue.',
    });
  };

  const handleViewHistory = (patientId: string) => {
    const baseRoute = user?.role === 'nurse' ? '/nurse' : '/clinical-lead';
    navigate(`${baseRoute}/patients/${patientId}`);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="h-6 w-6" />
              Triage Queue
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Queue Board */}
        <QueueBoard
          entries={paginatedQueue}
          title="Patients Awaiting Triage"
          onStart={handleStart}
          onViewHistory={handleViewHistory}
          columns={[
            { id: 'waiting', title: 'Waiting for Triage', className: 'bg-amber-50 dark:bg-amber-950/20' },
            { id: 'in_progress', title: 'Triage In Progress', className: 'bg-blue-50 dark:bg-blue-950/20' },
            { id: 'completed', title: 'Sent to Doctor', className: 'bg-green-50 dark:bg-green-950/20' },
          ]}
        />

        {/* Pagination */}
        <QueuePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={triageQueue.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Triage Panel Sheet */}
      <Sheet open={triagePanelOpen} onOpenChange={setTriagePanelOpen}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Patient Triage</SheetTitle>
          </SheetHeader>
          {selectedEntry && (
            <TriagePanel
              entry={selectedEntry}
              onComplete={handleComplete}
              onCancel={() => {
                setTriagePanelOpen(false);
                setSelectedEntry(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
