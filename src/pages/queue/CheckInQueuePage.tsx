// CheckInQueuePage - Redesigned with professional table and pagination

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, Clock, UserPlus, RefreshCw, Users, CheckCircle, Calendar } from 'lucide-react';
import { Appointment } from '@/types/clinical.types';
import { getTodaysAppointments, markNoShow } from '@/data/appointments';
import { getQueueByType } from '@/data/queue';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentTable } from '@/components/appointments/AppointmentTable';
import { CheckInModal } from '@/components/queue/CheckInModal';
import { AppointmentBookingModal } from '@/components/appointments/AppointmentBookingModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PAGINATION } from '@/constants/designSystem';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.defaultPageSize);

  // Get today's appointments
  const allAppointments = useMemo(() => getTodaysAppointments(), [refreshKey]);
  
  const appointments = useMemo(() => {
    let result = [...allAppointments];
    
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
  }, [allAppointments, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    pending: allAppointments.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length,
    checkedIn: allAppointments.filter(a => a.status === 'checked_in').length,
    completed: allAppointments.filter(a => a.status === 'completed').length,
    total: allAppointments.length,
  }), [allAppointments]);

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
    setCheckInModalOpen(false);
    setSelectedAppointment(null);
    setRefreshKey(k => k + 1);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card 
            className={`cursor-pointer transition-colors ${statusFilter === 'pending' ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
            onClick={() => setStatusFilter('pending')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-colors ${statusFilter === 'checked_in' ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
            onClick={() => setStatusFilter('checked_in')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.checkedIn}</p>
                  <p className="text-sm text-muted-foreground">Checked In</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-colors ${statusFilter === 'completed' ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
            onClick={() => setStatusFilter('completed')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-colors ${statusFilter === 'all' ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
            onClick={() => setStatusFilter('all')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Appointments Table */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search and Filters */}
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
              <div className="flex gap-2">
                {(['pending', 'checked_in', 'completed', 'all'] as StatusFilter[]).map((filter) => (
                  <Button
                    key={filter}
                    variant={statusFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(filter)}
                    className="capitalize"
                  >
                    {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Appointments Table */}
            <AppointmentTable
              appointments={appointments}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              onCheckIn={handleCheckIn}
              onNoShow={handleNoShow}
              onViewPatient={handleViewProfile}
            />
          </div>

          {/* Sidebar - Quick Actions */}
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`${baseRoute}/appointments`)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Appointments
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Triage Queue</CardTitle>
              </CardHeader>
              <CardContent>
                {getQueueByType('triage').filter(q => q.status === 'waiting').length === 0 ? (
                  <p className="text-sm text-muted-foreground">No patients in triage queue</p>
                ) : (
                  <div className="space-y-2">
                    {getQueueByType('triage').filter(q => q.status === 'waiting').slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{entry.patientName}</p>
                          <p className="text-xs text-muted-foreground truncate">{entry.reasonForVisit}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 ml-2">
                          #{entry.queueNumber}
                        </Badge>
                      </div>
                    ))}
                    {getQueueByType('triage').filter(q => q.status === 'waiting').length > 5 && (
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        +{getQueueByType('triage').filter(q => q.status === 'waiting').length - 5} more
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Doctor Queue</CardTitle>
              </CardHeader>
              <CardContent>
                {getQueueByType('doctor').filter(q => q.status === 'waiting').length === 0 ? (
                  <p className="text-sm text-muted-foreground">No patients waiting for doctor</p>
                ) : (
                  <div className="space-y-2">
                    {getQueueByType('doctor').filter(q => q.status === 'waiting').slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{entry.patientName}</p>
                          <p className="text-xs text-muted-foreground truncate">{entry.reasonForVisit}</p>
                        </div>
                        <Badge 
                          variant={entry.priority === 'emergency' ? 'destructive' : 'outline'} 
                          className="shrink-0 ml-2"
                        >
                          #{entry.queueNumber}
                        </Badge>
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
