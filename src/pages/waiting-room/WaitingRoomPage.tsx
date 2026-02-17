// WaitingRoomPage - Receptionist waiting room management

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { RefreshCw, Users, Search, Phone, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { useToast } from '@/hooks/use-toast';
import { useQueueByType } from '@/hooks/queries/useQueueQueries';
import { useUpdateQueueEntry } from '@/hooks/mutations/useQueueMutations';
import { calculateWaitTime } from '@/data/queue';
import { QueueEntry, QueuePriority } from '@/types/patient.types';
import { PAGINATION } from '@/constants/designSystem';

export default function WaitingRoomPage() {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.defaultPageSize);
  const [cancelTarget, setCancelTarget] = useState<QueueEntry | null>(null);
  const [cancelInput, setCancelInput] = useState('');

  const { data: checkInQueue } = useQueueByType('check_in');
  const updateQueue = useUpdateQueueEntry();

  // Get check-in queue entries
  const waitingPatients = useMemo(() => {
    let filtered = (checkInQueue ?? []).filter(
      entry => entry.status === 'waiting'
    );

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        entry =>
          entry.patientName.toLowerCase().includes(lowerSearch) ||
          entry.patientMrn.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort: emergency first, then by wait time (longest first)
    filtered.sort((a, b) => {
      if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
      if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
      if (a.priority === 'high' && b.priority === 'normal') return -1;
      if (b.priority === 'high' && a.priority === 'normal') return 1;

      // Sort by wait time (longest first)
      const waitA = calculateWaitTime(a.checkInTime);
      const waitB = calculateWaitTime(b.checkInTime);
      return waitB - waitA;
    });

    return filtered;
  }, [checkInQueue, searchTerm, refreshKey]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allWaiting = waitingPatients;
    const waitTimes = allWaiting.map(entry => calculateWaitTime(entry.checkInTime));
    const avgWaitTime = waitTimes.length > 0
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
      : 0;
    const longestWait = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;

    return {
      totalWaiting: allWaiting.length,
      avgWaitTime,
      longestWait,
    };
  }, [waitingPatients]);

  // Pagination
  const totalPages = Math.ceil(waitingPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = waitingPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleCallPatient = (entry: QueueEntry) => {
    toast({
      title: 'Calling Patient',
      description: `Calling ${entry.patientName}...`,
    });
  };

  const handleCancelClick = (entry: QueueEntry) => {
    setCancelTarget(entry);
    setCancelInput('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      await updateQueue.mutateAsync({
        entryId: cancelTarget.id,
        updates: { status: 'cancelled' },
      });
      setRefreshKey(k => k + 1);
      toast({
        title: 'Appointment Cancelled',
        description: `Cancelled appointment for ${cancelTarget.patientName}`,
        variant: 'destructive',
      });
      setCancelTarget(null);
      setCancelInput('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment',
        variant: 'destructive',
      });
    }
  };

  const getPriorityBadge = (priority: QueuePriority) => {
    switch (priority) {
      case 'emergency':
        return <Badge variant="destructive">Emergency</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-orange-500">High Priority</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const formatWaitTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    toast({
      title: 'Refreshed',
      description: 'Waiting room has been refreshed',
    });
  };

  return (
    <DashboardLayout allowedRoles={['receptionist']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Waiting Room
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Waiting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalWaiting}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatWaitTime(stats.avgWaitTime)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Longest Wait
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {formatWaitTime(stats.longestWait)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or MRN..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient Cards */}
        {paginatedPatients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No patients waiting</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPatients.map((entry) => {
                const waitTime = calculateWaitTime(entry.checkInTime);
                const isLongWait = waitTime > 60;

                return (
                  <Card
                    key={entry.id}
                    className={`${
                      entry.priority === 'emergency'
                        ? 'border-destructive border-2'
                        : isLongWait
                        ? 'border-orange-500'
                        : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {entry.patientName}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {entry.patientMrn}
                          </p>
                        </div>
                        {getPriorityBadge(entry.priority)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Check-in:</span>
                          <p className="font-medium">
                            {format(new Date(entry.checkInTime), 'HH:mm')}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Wait time:</span>
                          <p className={`font-medium ${isLongWait ? 'text-orange-500' : ''}`}>
                            {formatWaitTime(waitTime)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Reason:</span>
                        <p className="text-sm font-medium mt-1">{entry.reasonForVisit}</p>
                      </div>

                      {entry.notes && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Notes:</span>
                          <p className="text-sm mt-1">{entry.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleCallPatient(entry)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call Patient
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelClick(entry)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {waitingPatients.length > 0 && (
              <QueuePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={waitingPatients.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => { if (!open) { setCancelTarget(null); setCancelInput(''); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Patient Visit</AlertDialogTitle>
            <AlertDialogDescription>
              Type <span className="font-bold">CANCEL</span> to confirm removing{' '}
              <span className="font-semibold">{cancelTarget?.patientName}</span> from the waiting room.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Type CANCEL to confirm"
            value={cancelInput}
            onChange={(e) => setCancelInput(e.target.value)}
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setCancelTarget(null); setCancelInput(''); }}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelInput.toLowerCase() !== 'cancel'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
