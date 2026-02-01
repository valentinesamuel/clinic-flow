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
  AlertCircle,
} from 'lucide-react';

// Mock appointments
const appointments = [
  { id: 1, patient: 'Adaobi Eze', time: '09:00 AM', reason: 'Follow-up: Hypertension', status: 'waiting' },
  { id: 2, patient: 'Emeka Okafor', time: '09:30 AM', reason: 'New Consultation', status: 'waiting' },
  { id: 3, patient: 'Fatima Bello', time: '10:00 AM', reason: 'Lab Result Review', status: 'upcoming' },
  { id: 4, patient: 'Chidi Nwankwo', time: '10:30 AM', reason: 'Prescription Renewal', status: 'upcoming' },
  { id: 5, patient: 'Ngozi Adekunle', time: '11:00 AM', reason: 'General Checkup', status: 'upcoming' },
];

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
  return (
    <DashboardLayout allowedRoles={['doctor']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Today's schedule and pending tasks</p>
          </div>
          <Button>
            <Stethoscope className="h-4 w-4 mr-2" />
            Start Consultation
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today's Patients</CardDescription>
              <CardTitle className="text-2xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">2 in queue, 5 completed</p>
            </CardContent>
          </Card>
          <Card>
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
              <p className="text-xs text-warning">Due within 5 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Next Patient</CardDescription>
              <CardTitle className="text-lg truncate">Adaobi Eze</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">09:00 AM - Follow-up</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Today's Appointments</CardTitle>
                <CardDescription>{appointments.length} scheduled</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{apt.patient}</p>
                    <p className="text-sm text-muted-foreground truncate">{apt.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{apt.time}</p>
                    <Badge
                      variant={apt.status === 'waiting' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {apt.status}
                    </Badge>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
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
                    className="flex items-center justify-between p-3 rounded-lg border"
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
                    className="flex items-center justify-between p-3 rounded-lg border"
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Stethoscope className="h-5 w-5 mb-2" />
                <span className="text-xs">Start Consultation</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <TestTube className="h-5 w-5 mb-2" />
                <span className="text-xs">Order Lab Test</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Pill className="h-5 w-5 mb-2" />
                <span className="text-xs">Write Prescription</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <User className="h-5 w-5 mb-2" />
                <span className="text-xs">Patient History</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
