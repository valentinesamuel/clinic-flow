// Receptionist Dashboard - Registration, Scheduling, Queue

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
  AlertCircle,
} from 'lucide-react';
import { getTodaysAppointments } from '@/data/appointments';
import { getQueueByType, getWaitingCount, calculateWaitTime } from '@/data/queue';
import { getDoctors } from '@/data/staff';

export default function ReceptionistDashboard() {
  const todaysAppointments = getTodaysAppointments();
  const checkInQueue = getQueueByType('check_in');
  const doctors = getDoctors();

  const getWaitTimeColor = (minutes: number) => {
    if (minutes < 20) return 'text-green-600';
    if (minutes < 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout allowedRoles={['receptionist']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reception Dashboard</h1>
            <p className="text-muted-foreground">Registration, scheduling & queue management</p>
          </div>
          <Button className="gap-2">
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
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
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

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Check-in Queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getWaitingCount('check_in')}</p>
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
              <p className="text-2xl font-bold">28</p>
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
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Registered</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Appointments awaiting check-in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysAppointments
                .filter(a => ['scheduled', 'confirmed'].includes(a.status))
                .slice(0, 5)
                .map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                      <p className="text-sm font-medium">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.scheduledTime} • {apt.doctorName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{apt.appointmentType}</Badge>
                      <Button size="sm">Check In</Button>
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
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Walk-in Queue
              </CardTitle>
              <CardDescription>Patients waiting for check-in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkInQueue.map((entry) => {
                const waitMinutes = calculateWaitTime(entry.checkInTime);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold">#{entry.queueNumber}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{entry.patientName}</p>
                        <p className="text-xs text-muted-foreground">{entry.reasonForVisit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getWaitTimeColor(waitMinutes)}`}>
                        {waitMinutes} min
                      </p>
                      <Button size="sm" variant="outline">Process</Button>
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
    </DashboardLayout>
  );
}
