import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Clock,
  Users,
  UserPlus,
  Search,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { useAppointments } from '@/hooks/queries/useAppointmentQueries';
import { useQueueByType } from '@/hooks/queries/useQueueQueries';
import { calculateWaitTime } from '@/data/queue';
import { useDoctors } from '@/hooks/queries/useStaffQueries';
import { usePatientSearch } from '@/hooks/queries/usePatientQueries';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { CheckInModal } from '@/components/queue/CheckInModal';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { actions } = useDashboardActions('receptionist');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const { data: todaysAppointments = [] } = useAppointments();
  const { data: checkInQueue = [] } = useQueueByType('check_in');
  const { data: doctors = [] } = useDoctors();
  const { data: searchResults = [] } = usePatientSearch(searchQuery);

  const waitingCount = (checkInQueue as any[]).filter((e: any) => e.status === 'waiting').length;

  const getWaitTimeColor = (minutes: number) => {
    if (minutes < 20) return 'text-green-600 dark:text-green-400';
    if (minutes < 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleCheckIn = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setCheckInModalOpen(true);
  };

  const handleCheckInComplete = () => {
    setCheckInModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const selectedAppointment = selectedAppointmentId 
    ? todaysAppointments.find(a => a.id === selectedAppointmentId) 
    : null;

  return (
    <DashboardLayout allowedRoles={['receptionist']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reception Dashboard</h1>
            <p className="text-muted-foreground">Registration, scheduling & queue management</p>
          </div>
          <Button className="gap-2" onClick={actions.newPatient}>
            <UserPlus className="h-4 w-4" />
            New Patient
          </Button>
        </div>

        {/* Patient Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search patient by name, MRN, or phone..." 
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-3 border rounded-lg divide-y">
                {searchResults.map((patient) => (
                  <div 
                    key={patient.id}
                    className="flex items-center justify-between p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/receptionist/patients/${patient.id}`)}
                  >
                    <div>
                      <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                      <p className="text-sm text-muted-foreground">{patient.mrn} • {patient.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={patient.paymentType === 'hmo' ? 'default' : 'secondary'}>
                        {patient.paymentType.toUpperCase()}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={actions.viewAppointments}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{todaysAppointments.length}</p>
              <p className="text-xs text-muted-foreground">
                {todaysAppointments.filter(a => a.status === 'checked_in').length} checked in
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={actions.checkIn}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Check-in Queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{waitingCount}</p>
              <p className="text-xs text-muted-foreground">Waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Checked In Today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {todaysAppointments.filter(a => a.status === 'checked_in' || a.status === 'in_progress' || a.status === 'completed').length}
              </p>
              <p className="text-xs text-muted-foreground">Processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Walk-ins Today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{checkInQueue.length}</p>
              <p className="text-xs text-muted-foreground">Registered</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>Appointments awaiting check-in</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={actions.viewAppointments}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysAppointments
                .filter(a => ['scheduled', 'confirmed'].includes(a.status))
                .slice(0, 5)
                .map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-accent/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.scheduledTime} • {apt.doctorName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs shrink-0">{apt.appointmentType.replace('_', ' ')}</Badge>
                      <Button size="sm" onClick={() => handleCheckIn(apt.id)}>
                        Check In
                      </Button>
                    </div>
                  </div>
                ))}
              {todaysAppointments.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending appointments
                </p>
              )}
            </CardContent>
          </Card>

          {/* Check-in Queue */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Walk-in Queue
                  </CardTitle>
                  <CardDescription>Patients waiting for check-in</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={actions.checkIn}>
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkInQueue.slice(0, 5).map((entry) => {
                const waitMinutes = calculateWaitTime(entry.checkInTime);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{entry.queueNumber}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{entry.patientName}</p>
                        <p className="text-xs text-muted-foreground truncate">{entry.reasonForVisit}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-medium ${getWaitTimeColor(waitMinutes)}`}>
                        {waitMinutes} min
                      </p>
                      <Button size="sm" variant="outline" onClick={actions.checkIn}>
                        Process
                      </Button>
                    </div>
                  </div>
                );
              })}
              {checkInQueue.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No patients waiting
                </p>
              )}
            </CardContent>
          </Card>

          {/* Doctor Availability */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Doctor Availability</CardTitle>
              <CardDescription>Current status for queue assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className={`p-4 rounded-lg border ${
                      doctor.isOnDuty ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                      </div>
                      <Badge variant={doctor.isOnDuty ? 'default' : 'secondary'}>
                        {doctor.isOnDuty ? 'Available' : 'Off Duty'}
                      </Badge>
                    </div>
                    {doctor.isOnDuty && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{doctor.shiftStart} - {doctor.shiftEnd}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Check-In Modal */}
      {selectedAppointment && (
        <CheckInModal
          open={checkInModalOpen}
          onOpenChange={setCheckInModalOpen}
          appointment={selectedAppointment}
          onSuccess={handleCheckInComplete}
        />
      )}
    </DashboardLayout>
  );
}
