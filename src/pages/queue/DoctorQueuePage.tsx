// DoctorQueuePage - Refactored to use atomic components and QueueContext

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { QueueEntry, Patient } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { getQueueByType, startQueueEntry, completeQueueEntry, transferQueue, getQueueStats } from '@/data/queue';
import { getPatientById } from '@/data/patients';
import { getVitalsByPatient } from '@/data/vitals';
import { getDoctors } from '@/data/staff';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PAGINATION } from '@/constants/designSystem';

// Refactored components using atomic design
import { QueueTable } from '@/components/queue/QueueTable';
import { QueueStatsInline } from '@/components/queue/QueueStats';
import { PatientDrawer } from '@/components/patients/PatientDrawer';

// UI components
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function DoctorQueuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedEntry, setSelectedEntry] = useState<QueueEntry | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedVitals, setSelectedVitals] = useState<VitalSigns | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.defaultPageSize);

  // Get doctor queue entries (assigned to current user)
  const doctorQueue = useMemo(() => {
    const allDoctorQueue = getQueueByType('doctor');
    // Filter for current doctor if user is a doctor
    if (user?.role === 'doctor') {
      return allDoctorQueue.filter(e => e.assignedTo === user.id || !e.assignedTo);
    }
    return allDoctorQueue;
  }, [user, refreshKey]);

  const stats = getQueueStats('doctor');
  const doctors = getDoctors();

  // Load patient details when entry is selected
  const handleSelectEntry = (entry: QueueEntry) => {
    setSelectedEntry(entry);
    const patient = getPatientById(entry.patientId);
    setSelectedPatient(patient || null);
    
    if (patient) {
      const vitals = getVitalsByPatient(patient.id);
      setSelectedVitals(vitals.length > 0 ? vitals[0] : null);
    } else {
      setSelectedVitals(null);
    }
    setDrawerOpen(true);
  };

  const handleStart = (entry: QueueEntry) => {
    startQueueEntry(entry.id, user?.id);
    handleSelectEntry(entry);
    setRefreshKey(k => k + 1);
    toast({
      title: 'Consultation Started',
      description: `Started consultation with ${entry.patientName}`,
    });
  };

  const handleComplete = () => {
    if (selectedEntry) {
      completeQueueEntry(selectedEntry.id);
      setSelectedEntry(null);
      setSelectedPatient(null);
      setSelectedVitals(null);
      setDrawerOpen(false);
      setRefreshKey(k => k + 1);
      toast({
        title: 'Consultation Completed',
        description: `Completed consultation with ${selectedEntry.patientName}`,
      });
    }
  };

  const handleTransfer = (entry: QueueEntry) => {
    setSelectedEntry(entry);
    setTransferDialogOpen(true);
  };

  const confirmTransfer = () => {
    if (selectedEntry && transferTarget) {
      transferQueue(selectedEntry.id, transferTarget);
      setTransferDialogOpen(false);
      setTransferTarget('');
      setSelectedEntry(null);
      setSelectedPatient(null);
      setDrawerOpen(false);
      setRefreshKey(k => k + 1);
      toast({
        title: 'Patient Transferred',
        description: `Patient transferred to another doctor.`,
      });
    }
  };

  const handleViewProfile = (patientId: string) => {
    const baseRoute = user?.role === 'doctor' ? '/doctor' : 
                     user?.role === 'clinical_lead' ? '/clinical-lead' : '/cmo';
    navigate(`${baseRoute}/patients/${patientId}`);
  };

  const handleStartConsultation = () => {
    if (selectedEntry && selectedPatient) {
      if (selectedEntry.status === 'waiting') {
        handleStart(selectedEntry);
      }
      navigate(`/doctor/consultation?patientId=${selectedPatient.id}&queueEntryId=${selectedEntry.id}`);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Patient Queue</h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <QueueStatsInline
              waiting={stats.waiting}
              avgWaitTime={stats.avgWaitTime}
              emergencyCount={stats.emergencyCount}
            />
            <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Queue Table - using refactored component with atomic design */}
        <QueueTable
          entries={doctorQueue}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={handleSelectEntry}
          onStart={handleStart}
          onViewHistory={handleViewProfile}
          onTransfer={handleTransfer}
          selectedEntryId={selectedEntry?.id}
        />
      </div>

      {/* Patient Context Drawer - using refactored component with molecules */}
      <PatientDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        patient={selectedPatient}
        queueEntry={selectedEntry}
        vitals={selectedVitals}
        onStartConsultation={handleStartConsultation}
        onViewFullProfile={() => selectedPatient && handleViewProfile(selectedPatient.id)}
        onComplete={selectedEntry?.status === 'in_progress' ? handleComplete : undefined}
      />

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Patient</DialogTitle>
            <DialogDescription>
              Transfer {selectedEntry?.patientName} to another doctor
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={transferTarget} onValueChange={setTransferTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor..." />
              </SelectTrigger>
              <SelectContent>
                {doctors.filter(d => d.id !== user?.id).map(doc => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmTransfer} disabled={!transferTarget}>
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
