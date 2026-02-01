import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  TestTube,
  Pill,
  Receipt,
  User,
  Clock,
  MapPin,
  Download,
  ChevronRight,
} from 'lucide-react';

// Mock patient data
const upcomingAppointment = {
  date: 'Monday, Feb 3, 2026',
  time: '10:00 AM',
  doctor: 'Dr. Chukwuemeka Nwosu',
  location: 'Room 4, General Consultation',
  type: 'Follow-up Visit',
};

const recentLabResults = [
  { id: 1, test: 'Complete Blood Count', date: 'Jan 28, 2026', status: 'available' },
  { id: 2, test: 'Lipid Profile', date: 'Jan 25, 2026', status: 'available' },
  { id: 3, test: 'Fasting Blood Sugar', date: 'Jan 20, 2026', status: 'available' },
];

const currentPrescriptions = [
  { id: 1, medication: 'Metformin 500mg', dosage: 'Twice daily with meals', refillsLeft: 2 },
  { id: 2, medication: 'Lisinopril 10mg', dosage: 'Once daily in the morning', refillsLeft: 1 },
];

const outstandingBill = {
  amount: 35000,
  dueDate: 'Feb 10, 2026',
  description: 'Consultation + Lab Tests',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PatientDashboard() {
  return (
    <DashboardLayout allowedRoles={['patient']}>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your health summary</p>
        </div>

        {/* Upcoming Appointment */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold text-lg">{upcomingAppointment.date}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{upcomingAppointment.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{upcomingAppointment.doctor}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{upcomingAppointment.location}</span>
              </div>
              <Badge variant="secondary" className="mt-2">{upcomingAppointment.type}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Reschedule</Button>
              <Button className="flex-1">Get Directions</Button>
            </div>
          </CardContent>
        </Card>

        {/* Lab Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Lab Results
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLabResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{result.test}</p>
                    <p className="text-sm text-muted-foreground">{result.date}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-3 rounded-lg border"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{rx.medication}</p>
                      <p className="text-sm text-muted-foreground">{rx.dosage}</p>
                    </div>
                    <Badge variant={rx.refillsLeft <= 1 ? 'destructive' : 'secondary'}>
                      {rx.refillsLeft} refills left
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                Request Refill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Bill */}
        <Card className="border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(outstandingBill.amount)}</p>
                <p className="text-sm text-muted-foreground">Due: {outstandingBill.dueDate}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{outstandingBill.description}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">View Details</Button>
              <Button className="flex-1">Pay Now</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2">
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-xs">Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <TestTube className="h-5 w-5 mb-2" />
                <span className="text-xs">View Results</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Pill className="h-5 w-5 mb-2" />
                <span className="text-xs">My Medications</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col">
                <Receipt className="h-5 w-5 mb-2" />
                <span className="text-xs">Pay Bills</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
