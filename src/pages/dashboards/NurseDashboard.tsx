import { useNavigate } from 'react-router-dom';
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
import { useQueueByType } from '@/hooks/queries/useQueueQueries';
import { calculateWaitTime } from '@/utils/queueUtils';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { QueueEntry } from '@/types/queue.types';

export default function NurseDashboard() {
  const navigate = useNavigate();
  const { actions } = useDashboardActions('nurse');

  const { data: triageQueue = [] } = useQueueByType('triage');
  const waitingPatients = (triageQueue as QueueEntry[]).filter((e: QueueEntry) => e.status === 'waiting');
  const inProgressPatients = (triageQueue as QueueEntry[]).filter((e: QueueEntry) => e.status === 'in_progress');

  const triageSummary = {
    processed: (triageQueue as QueueEntry[]).filter((e: QueueEntry) => e.status === 'completed').length,
    urgent: (triageQueue as QueueEntry[]).filter((e: QueueEntry) => e.priority === 'emergency').length,
    pending: waitingPatients.length,
  };

  const shiftInfo = {
    currentShift: 'Morning (6AM - 2PM)',
    timeRemaining: '3h 45m',
    nextBreak: '30 mins',
  };

  const getWaitTimeColor = (minutes: number) => {
    if (minutes < 15) return '';
    if (minutes < 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-destructive font-medium';
  };

  return (
    <DashboardLayout allowedRoles={['nurse']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nurse Dashboard</h1>
            <p className="text-muted-foreground">{shiftInfo.currentShift}</p>
          </div>
          <Button onClick={actions.startTriage}>
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
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={actions.startTriage}
          >
            <CardHeader className="pb-2">
              <CardDescription>Urgent Cases</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {triageSummary.urgent}
                {triageSummary.urgent > 0 && <AlertTriangle className="h-5 w-5 text-destructive" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-destructive">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={actions.startTriage}
          >
            <CardHeader className="pb-2">
              <CardDescription>Pending Triage</CardDescription>
              <CardTitle className="text-2xl">{waitingPatients.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Awaiting assessment</p>
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
                  Triage Queue
                </CardTitle>
                <CardDescription>{waitingPatients.length} patients waiting</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={actions.viewQueue}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {waitingPatients.slice(0, 5).map((patient) => {
                const waitMinutes = calculateWaitTime(patient.checkInTime);
                return (
                  <div
                    key={patient.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/nurse/triage')}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      patient.priority === 'emergency' 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium flex items-center gap-2">
                        {patient.patientName}
                        {patient.priority === 'emergency' && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                        {patient.priority === 'high' && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">High</Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {patient.reasonForVisit}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={getWaitTimeColor(waitMinutes)}>
                          {waitMinutes} min
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                );
              })}
              {waitingPatients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No patients waiting for triage</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        {inProgressPatients.length > 0 && (
          <Card className="border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Currently in Triage
                </CardTitle>
                <Badge>{inProgressPatients.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inProgressPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.patientName}</p>
                        <p className="text-sm text-muted-foreground">{patient.reasonForVisit}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => navigate('/nurse/triage')}>
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col"
                onClick={actions.startTriage}
              >
                <Stethoscope className="h-5 w-5 mb-2" />
                <span className="text-xs">Start Triage</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col"
                onClick={actions.recordVitals}
              >
                <Activity className="h-5 w-5 mb-2" />
                <span className="text-xs">Record Vitals</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col"
                onClick={actions.viewQueue}
              >
                <ClipboardList className="h-5 w-5 mb-2" />
                <span className="text-xs">View Queue</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col"
                onClick={actions.viewPatients}
              >
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
