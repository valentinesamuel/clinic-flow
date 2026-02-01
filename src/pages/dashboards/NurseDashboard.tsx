import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Stethoscope,
  Activity,
  Clock,
  User,
  ChevronRight,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react';

// Mock queue data
const patientQueue = [
  { id: 1, patient: 'Chukwudi Ibe', waitTime: 45, priority: 'high', vitalsComplete: false },
  { id: 2, patient: 'Funke Adeola', waitTime: 32, priority: 'normal', vitalsComplete: false },
  { id: 3, patient: 'Ibrahim Musa', waitTime: 20, priority: 'normal', vitalsComplete: true },
  { id: 4, patient: 'Yetunde Bakare', waitTime: 15, priority: 'low', vitalsComplete: false },
  { id: 5, patient: 'Obinna Okeke', waitTime: 8, priority: 'normal', vitalsComplete: false },
];

const triageSummary = {
  processed: 23,
  urgent: 4,
  pending: 8,
};

const pendingVitals = [
  { id: 1, patient: 'Amaka Nwobi', room: 'Room 3' },
  { id: 2, patient: 'Dayo Ogunleye', room: 'Room 5' },
  { id: 3, patient: 'Halima Abdullahi', room: 'Waiting Area' },
];

const shiftInfo = {
  currentShift: 'Morning (6AM - 2PM)',
  timeRemaining: '3h 45m',
  nextBreak: '30 mins',
};

export default function NurseDashboard() {
  return (
    <DashboardLayout allowedRoles={['nurse']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nurse Dashboard</h1>
            <p className="text-muted-foreground">{shiftInfo.currentShift}</p>
          </div>
          <Button>
            <Stethoscope className="h-4 w-4 mr-2" />
            Start Triage
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Patients Processed</CardDescription>
              <CardTitle className="text-2xl">{triageSummary.processed}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Today's triage count</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Urgent Cases</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {triageSummary.urgent}
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-destructive">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Vitals</CardDescription>
              <CardTitle className="text-2xl">{pendingVitals.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Awaiting recording</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Shift Remaining</CardDescription>
              <CardTitle className="text-2xl">{shiftInfo.timeRemaining}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Next break: {shiftInfo.nextBreak}</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Queue */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Patient Queue
                </CardTitle>
                <CardDescription>{patientQueue.length} patients waiting</CardDescription>
              </div>
              <Button variant="outline" size="sm">Refresh</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patientQueue.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    patient.priority === 'high' 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium flex items-center gap-2">
                      {patient.patient}
                      {patient.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {patient.vitalsComplete ? 'Vitals recorded' : 'Needs vitals'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={patient.waitTime > 30 ? 'text-destructive font-medium' : ''}>
                        {patient.waitTime} min
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Vitals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Pending Vitals
              </CardTitle>
              <Badge variant="secondary">{pendingVitals.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingVitals.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.patient}</p>
                      <p className="text-sm text-muted-foreground">{patient.room}</p>
                    </div>
                  </div>
                  <Button size="sm">Record Vitals</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Stethoscope className="h-5 w-5 mb-2" />
                <span className="text-xs">Start Triage</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Activity className="h-5 w-5 mb-2" />
                <span className="text-xs">Record Vitals</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <ClipboardList className="h-5 w-5 mb-2" />
                <span className="text-xs">View Queue</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <User className="h-5 w-5 mb-2" />
                <span className="text-xs">Patient Search</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
