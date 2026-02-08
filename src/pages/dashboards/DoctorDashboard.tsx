import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Stethoscope,
  TestTube,
  Pill,
  Clock,
  User,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Play,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getTodaysAppointments } from '@/data/appointments';
import { getQueueByType } from '@/data/queue';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { useToast } from '@/hooks/use-toast';

// Mock lab results and prescription data
const labResults = [
  { id: 1, patient: 'Kunle Adeyemi', test: 'Blood Panel', urgent: true },
  { id: 2, patient: 'Amina Yusuf', test: 'Urinalysis', urgent: false },
  { id: 3, patient: 'Olu Taiwo', test: 'Lipid Profile', urgent: false },
];

const prescriptionRenewals = [
  { id: 1, patient: 'Bola Ogundimu', medication: 'Metformin 500mg', daysLeft: 3 },
  { id: 2, patient: 'Sade Akinyemi', medication: 'Lisinopril 10mg', daysLeft: 5 },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { actions } = useDashboardActions('doctor');
  const { toast } = useToast();
  
  const todaysAppointments = getTodaysAppointments();
  const doctorQueue = getQueueByType('doctor');
  const waitingCount = doctorQueue.filter(e => e.status === 'waiting').length;
  const completedCount = doctorQueue.filter(e => e.status === 'completed').length;
  
  // Get first waiting patient
  const nextPatient = doctorQueue.find(e => e.status === 'waiting');

  const handleViewAllAppointments = () => {
    navigate('/doctor/appointments');
  };

  const handleSeePatient = (patientId: string) => {
    navigate('/doctor/queue');
  };

  const handleViewLabResult = () => {
    toast({
      title: 'Coming Soon',
      description: 'Lab result viewing will be available in a future update.',
    });
  };

  return (
    <DashboardLayout allowedRoles={['doctor']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Today's schedule and pending tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={actions.startConsultation}>
              <Stethoscope className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Quick Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={actions.startConsultation}>
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Start Consultation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={actions.orderLabTest}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Order Lab Test
                </DropdownMenuItem>
                <DropdownMenuItem onClick={actions.writePrescription}>
                  <Pill className="h-4 w-4 mr-2" />
                  Write Prescription
                </DropdownMenuItem>
                <DropdownMenuItem onClick={actions.patientHistory}>
                  <User className="h-4 w-4 mr-2" />
                  Patient History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today's Patients</CardDescription>
              <CardTitle className="text-2xl">{todaysAppointments.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{waitingCount} in queue, {completedCount} completed</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleViewLabResult}>
            <CardHeader className="pb-2">
              <CardDescription>Pending Lab Results</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                3
                <Badge variant="destructive" className="text-xs">1 urgent</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Click to review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Prescription Renewals</CardDescription>
              <CardTitle className="text-2xl">2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-orange-600 dark:text-orange-400">Due within 5 days</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate('/doctor/queue')}
          >
            <CardHeader className="pb-2">
              <CardDescription>Next Patient</CardDescription>
              <CardTitle className="text-lg truncate">
                {nextPatient?.patientName || 'No patients waiting'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {nextPatient ? `${nextPatient.reasonForVisit}` : 'Queue is empty'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Today's Appointments</CardTitle>
                <CardDescription>{todaysAppointments.length} scheduled</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleViewAllAppointments}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysAppointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleSeePatient(apt.patientId)}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground truncate">{apt.reasonForVisit}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{apt.scheduledTime}</p>
                    <Badge
                      variant={apt.status === 'checked_in' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {apt.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {apt.status === 'checked_in' && (
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        navigate('/doctor/queue');
                      }}>
                        <Play className="h-3.5 w-3.5 mr-1" />
                        See
                      </Button>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
              {todaysAppointments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lab Results & Prescriptions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Pending Lab Results
                </CardTitle>
                <Badge variant="secondary">{labResults.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {labResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={handleViewLabResult}
                  >
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {result.patient}
                        {result.urgent && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{result.test}</p>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Prescription Renewals
                </CardTitle>
                <Badge variant="secondary">{prescriptionRenewals.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptionRenewals.map((rx) => (
                  <div
                    key={rx.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={actions.writePrescription}
                  >
                    <div>
                      <p className="font-medium">{rx.patient}</p>
                      <p className="text-sm text-muted-foreground">{rx.medication}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={rx.daysLeft <= 3 ? 'destructive' : 'secondary'}>
                        {rx.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
