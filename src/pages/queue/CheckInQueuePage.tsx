// CheckInQueuePage - Receptionist check-in queue view

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, Filter, Clock, UserPlus, RefreshCw } from 'lucide-react';
import { Appointment } from '@/types/clinical.types';
import { getTodaysAppointments, markNoShow } from '@/data/appointments';
import { getQueueByType } from '@/data/queue';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { CheckInModal } from '@/components/queue/CheckInModal';
import { AppointmentBookingModal } from '@/components/appointments/AppointmentBookingModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type StatusFilter = 'all' | 'pending' | 'checked_in' | 'completed';

export default function CheckInQueuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get today's appointments
  const appointments = useMemo(() => {
    let result = getTodaysAppointments();
    
    // Filter by status
    if (statusFilter === 'pending') {
      result = result.filter(a => ['scheduled', 'confirmed'].includes(a.status));
    } else if (statusFilter === 'checked_in') {
      result = result.filter(a => a.status === 'checked_in');
    } else if (statusFilter === 'completed') {
      result = result.filter(a => ['completed', 'cancelled', 'no_show'].includes(a.status));
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.patientName.toLowerCase().includes(query) ||
        a.patientMrn.toLowerCase().includes(query)
      );
    }
    
    // Sort by time
    result.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    
    return result;
  }, [statusFilter, searchQuery, refreshKey]);

  // Get check-in queue stats
  const checkInQueue = getQueueByType('check_in');
  const pendingCount = getTodaysAppointments().filter(a => 
    ['scheduled', 'confirmed'].includes(a.status)
  ).length;

  const handleCheckIn = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCheckInModalOpen(true);
  };

  const handleNoShow = (appointment: Appointment) => {
    markNoShow(appointment.id);
    toast({
      title: 'Marked as No Show',
      description: `${appointment.patientName} has been marked as no show`,
    });
    setRefreshKey(k => k + 1);
  };

  const handleViewProfile = (patientId: string) => {
    const baseRoute = user?.role === 'receptionist' ? '/receptionist' : '/cmo';
    navigate(`${baseRoute}/patients/${patientId}`);
  };

  const handleCheckInSuccess = () => {
    setRefreshKey(k => k + 1);
  };

  const baseRoute = user?.role === 'receptionist' ? '/receptionist' : 
                   user?.role === 'cmo' ? '/cmo' : 
                   user?.role === 'clinical_lead' ? '/clinical-lead' : '';

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Check-In Queue</h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button onClick={() => setBookingModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {getTodaysAppointments().filter(a => a.status === 'checked_in').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Checked In</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {getTodaysAppointments().filter(a => a.status === 'completed').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getTodaysAppointments().length}</p>
                  <p className="text-xs text-muted-foreground">Total Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or MRN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <TabsList>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="checked_in">Checked In</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Appointments */}
            <ScrollArea className="h-[calc(100vh-380px)]">
              <div className="space-y-3 pr-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No appointments found</p>
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCheckIn={handleCheckIn}
                      onNoShow={handleNoShow}
                      onViewProfile={handleViewProfile}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Sidebar - Walk-ins and Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`${baseRoute}/patients/new`)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register New Patient
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setBookingModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Walk-In Appointment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Currently in Triage</CardTitle>
              </CardHeader>
              <CardContent>
                {getQueueByType('triage').filter(q => q.status === 'waiting').length === 0 ? (
                  <p className="text-sm text-muted-foreground">No patients in triage queue</p>
                ) : (
                  <div className="space-y-2">
                    {getQueueByType('triage').filter(q => q.status === 'waiting').slice(0, 3).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{entry.patientName}</p>
                          <p className="text-xs text-muted-foreground">{entry.reasonForVisit}</p>
                        </div>
                        <Badge variant="outline">#{entry.queueNumber}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CheckInModal
        open={checkInModalOpen}
        onOpenChange={setCheckInModalOpen}
        appointment={selectedAppointment}
        onSuccess={handleCheckInSuccess}
      />

      <AppointmentBookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />
    </DashboardLayout>
  );
}
