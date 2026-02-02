// DoctorQueuePage - Doctor's patient queue with context panel

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RefreshCw, User, Activity, Pill, AlertTriangle, FileText, Play, Clock } from 'lucide-react';
import { QueueEntry, Patient } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { getQueueByType, getQueueByAssignee, startQueueEntry, completeQueueEntry, transferQueue, getQueueStats } from '@/data/queue';
import { getPatientById } from '@/data/patients';
import { getVitalsByPatient } from '@/data/vitals';
import { getConsultationsByPatient } from '@/data/consultations';
import { getDoctors } from '@/data/staff';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QueueCard } from '@/components/queue/QueueCard';
import { QueueStats, QueueStatsInline } from '@/components/queue/QueueStats';
import { VitalSignsCard } from '@/components/clinical/VitalSignsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function DoctorQueuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedEntry, setSelectedEntry] = useState<QueueEntry | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedVitals, setSelectedVitals] = useState<VitalSigns | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleComplete = (entry: QueueEntry) => {
    completeQueueEntry(entry.id);
    setSelectedEntry(null);
    setSelectedPatient(null);
    setSelectedVitals(null);
    setRefreshKey(k => k + 1);
    toast({
      title: 'Consultation Completed',
      description: `Completed consultation with ${entry.patientName}`,
    });
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
      // In a real app, this would navigate to a consultation form
      toast({
        title: 'Starting Consultation',
        description: 'Consultation feature will be implemented in the next module.',
      });
    }
  };

  const recentConsultations = selectedPatient 
    ? getConsultationsByPatient(selectedPatient.id).slice(0, 3)
    : [];

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Queue List */}
        <div className="flex-1 p-4 md:p-6 space-y-4 overflow-hidden">
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

          {/* Queue List */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-3 pr-4">
              {doctorQueue.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No patients in queue</p>
                  <p className="text-muted-foreground">New patients will appear here after triage</p>
                </div>
              ) : (
                doctorQueue.map((entry, index) => (
                  <QueueCard
                    key={entry.id}
                    entry={entry}
                    position={entry.status === 'waiting' ? index + 1 : undefined}
                    showVitals
                    onStart={handleStart}
                    onComplete={handleComplete}
                    onTransfer={handleTransfer}
                    onViewHistory={handleViewProfile}
                    onClick={() => handleSelectEntry(entry)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Context Panel */}
        <div className={cn(
          'w-full lg:w-96 border-l bg-card p-4 overflow-y-auto transition-all',
          selectedEntry ? 'block' : 'hidden lg:block'
        )}>
          {selectedEntry && selectedPatient ? (
            <div className="space-y-4">
              {/* Patient Header */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPatient.mrn}</p>
                </div>
                {selectedEntry.priority === 'emergency' && (
                  <Badge variant="destructive" className="animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Emergency
                  </Badge>
                )}
              </div>

              {/* Quick Info */}
              <Card>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <span className="ml-1 font-medium">
                        {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} yrs
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="ml-1 font-medium capitalize">{selectedPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blood:</span>
                      <span className="ml-1 font-medium">{selectedPatient.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="ml-1 font-medium capitalize">{selectedPatient.paymentType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reason for Visit */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Reason for Visit</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{selectedEntry.reasonForVisit}</p>
                  {selectedEntry.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">{selectedEntry.notes}</p>
                  )}
                </CardContent>
              </Card>

              {/* Allergies & Conditions */}
              {(selectedPatient.allergies.length > 0 || selectedPatient.chronicConditions.length > 0) && (
                <Card className="border-destructive/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {selectedPatient.allergies.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Allergies:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.allergies.map((a, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedPatient.chronicConditions.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Chronic Conditions:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.chronicConditions.map((c, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Latest Vitals */}
              {selectedVitals && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Latest Vitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <VitalSignsCard vitals={selectedVitals} compact />
                  </CardContent>
                </Card>
              )}

              {/* Recent Consultations */}
              {recentConsultations.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Recent Visits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      {recentConsultations.map(con => (
                        <div key={con.id} className="text-sm p-2 rounded bg-muted/50">
                          <p className="font-medium">{con.diagnosis[0]}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(con.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {selectedEntry.status === 'waiting' && (
                  <Button className="w-full" onClick={() => handleStart(selectedEntry)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Consultation
                  </Button>
                )}
                {selectedEntry.status === 'in_progress' && (
                  <>
                    <Button className="w-full" onClick={handleStartConsultation}>
                      <FileText className="h-4 w-4 mr-2" />
                      Open Consultation
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleComplete(selectedEntry)}>
                      Complete & Discharge
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewProfile(selectedPatient.id)}
                >
                  View Full Profile
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a patient to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
