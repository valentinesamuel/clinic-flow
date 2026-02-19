import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import {
  Plus,
  ChevronLeft,
  Calendar as CalendarIcon,
  List,
  LayoutGrid,
  RefreshCw,
  Search,
  ChevronRight,
} from "lucide-react";
import { Appointment } from "@/types/clinical.types";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { AppointmentTable } from "@/components/appointments/AppointmentTable";
import { AppointmentBookingModal } from "@/components/appointments/AppointmentBookingModal";
import { CheckInModal } from "@/components/queue/CheckInModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PAGINATION } from "@/constants/designSystem";
import {
  useCancelAppointment,
  useCheckInAppointment,
  useGetAppointments,
  useUpdateAppointment,
} from "@/api/services/appointment.service";

type ViewMode = "day" | "week" | "list";
type StatusFilter =
  | "all"
  | "scheduled"
  | "checked_in"
  | "completed"
  | "cancelled";

export default function AppointmentListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<Date>();
  const [newTime, setNewTime] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    PAGINATION.defaultPageSize,
  );

  const { data: appointmentsData } = useGetAppointments({
    limit: 10,
  });
  const updateAppointment = useUpdateAppointment();
  const cancelAppointmentMutation = useCancelAppointment();
  const checkInAppointmentMutation = useCheckInAppointment();

  // Get appointments based on view mode
  const appointments = useMemo(() => {
    let result: Appointment[] = [];

    if (viewMode === "day") {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      result = appointmentsData.result.data.filter(
        (a) => a.scheduledDate === dateStr,
      );
    } else if (viewMode === "week") {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      const startStr = format(start, "yyyy-MM-dd");
      const endStr = format(end, "yyyy-MM-dd");
      result = appointmentsData.result.data.filter(
        (a) => a.scheduledDate >= startStr && a.scheduledDate <= endStr,
      );
    } else {
      result = [...appointmentsData.result.data];
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.patientName.toLowerCase().includes(query) ||
          a.patientMrn.toLowerCase().includes(query) ||
          a.doctorName.toLowerCase().includes(query),
      );
    }

    // Sort by date and time
    result.sort((a, b) => {
      const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
      if (dateCompare !== 0) return dateCompare;
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });

    return result;
  }, [
    appointmentsData.result.data,
    viewMode,
    selectedDate,
    statusFilter,
    searchQuery,
    refreshKey,
  ]);

  // Week days for week view
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const navigateDate = (direction: "prev" | "next") => {
    if (viewMode === "day") {
      setSelectedDate(
        direction === "prev"
          ? subDays(selectedDate, 1)
          : addDays(selectedDate, 1),
      );
    } else {
      setSelectedDate(
        direction === "prev"
          ? subDays(selectedDate, 7)
          : addDays(selectedDate, 7),
      );
    }
  };

  const handleCheckIn = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCheckInModalOpen(true);
  };

  const handleCheckInSuccess = () => {
    setCheckInModalOpen(false);
    setSelectedAppointment(null);
    setRefreshKey((k) => k + 1);
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(new Date(appointment.scheduledDate));
    setNewTime(appointment.scheduledTime);
    setRescheduleDialogOpen(true);
  };

  const confirmReschedule = async () => {
    if (selectedAppointment && newDate && newTime) {
      try {
        await updateAppointment.mutateAsync({
          appointmentId: selectedAppointment.id,
          data: {
            scheduledDate: format(newDate, "yyyy-MM-dd"),
            scheduledTime: newTime,
          },
        });
        setRescheduleDialogOpen(false);
        setSelectedAppointment(null);
        setRefreshKey((k) => k + 1);
        toast({
          title: "Appointment Rescheduled",
          description: `Rescheduled to ${format(newDate, "MMMM d, yyyy")} at ${newTime}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reschedule appointment",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (selectedAppointment) {
      try {
        await cancelAppointmentMutation.mutateAsync({
          appointmentId: selectedAppointment.id,
          reason: "Cancelled by staff",
        });
        setCancelDialogOpen(false);
        setSelectedAppointment(null);
        setRefreshKey((k) => k + 1);
        toast({
          title: "Appointment Cancelled",
          description: `Appointment for ${selectedAppointment.patientName} has been cancelled.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel appointment",
          variant: "destructive",
        });
      }
    }
  };

  const handleNoShow = async (appointment: Appointment) => {
    try {
      await updateAppointment.mutateAsync({
        appointmentId: appointment.id,
        data: { status: "no_show" },
      });
      setRefreshKey((k) => k + 1);
      toast({
        title: "Marked as No Show",
        description: `${appointment.patientName} has been marked as no show.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as no show",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (patientId: string) => {
    const baseRoute =
      user?.role === "receptionist"
        ? "/receptionist"
        : user?.role === "doctor"
          ? "/doctor"
          : user?.role === "cmo"
            ? "/cmo"
            : user?.role === "clinical_lead"
              ? "/clinical-lead"
              : "";
    navigate(`${baseRoute}/patients/${patientId}`);
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.filter((a) => a.scheduledDate === dateStr);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">
              Manage and schedule patient appointments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setBookingModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[200px]">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {viewMode === "week"
                    ? `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`
                    : format(selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
          </div>

          {/* View Mode */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
            className="ml-auto"
          >
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-1" />
                List
              </TabsTrigger>
              <TabsTrigger value="day">
                <LayoutGrid className="h-4 w-4 mr-1" />
                Day
              </TabsTrigger>
              <TabsTrigger value="week">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Week
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by patient or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(
              [
                "all",
                "scheduled",
                "checked_in",
                "completed",
                "cancelled",
              ] as StatusFilter[]
            ).map((filter) => (
              <Button
                key={filter}
                variant={statusFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter)}
                className="capitalize"
              >
                {filter === "all" ? "All" : filter.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {viewMode === "week" ? (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayAppointments = getAppointmentsForDay(day);
                return (
                  <div key={day.toISOString()} className="min-h-[400px]">
                    <div
                      className={cn(
                        "text-center p-2 rounded-t-lg font-medium",
                        isToday(day)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <div className="text-xs">{format(day, "EEE")}</div>
                      <div className="text-lg">{format(day, "d")}</div>
                    </div>
                    <ScrollArea className="h-[350px] border rounded-b-lg">
                      <div className="p-1 space-y-1">
                        {dayAppointments.length === 0 ? (
                          <p className="text-xs text-center text-muted-foreground py-4">
                            No appointments
                          </p>
                        ) : (
                          dayAppointments.map((apt) => (
                            <AppointmentCard
                              key={apt.id}
                              appointment={apt}
                              variant="compact"
                              showActions={false}
                              onClick={() => {
                                setSelectedDate(day);
                                setViewMode("day");
                              }}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          ) : viewMode === "list" ? (
            <AppointmentTable
              appointments={appointments}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              onCheckIn={handleCheckIn}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
              onNoShow={handleNoShow}
              onViewPatient={handleViewProfile}
            />
          ) : (
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="space-y-3 pr-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No appointments found</p>
                    <p className="text-muted-foreground">
                      No appointments for {format(selectedDate, "MMMM d, yyyy")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        onCheckIn={handleCheckIn}
                        onReschedule={handleReschedule}
                        onCancel={handleCancel}
                        onNoShow={handleNoShow}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AppointmentBookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        initialDate={selectedDate}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />

      {/* Check-In Modal */}
      {selectedAppointment && (
        <CheckInModal
          open={checkInModalOpen}
          onOpenChange={setCheckInModalOpen}
          appointment={selectedAppointment}
          onSuccess={handleCheckInSuccess}
        />
      )}

      {/* Reschedule Dialog */}
      <Dialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for {selectedAppointment?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </div>
            <Select value={newTime} onValueChange={setNewTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time..." />
              </SelectTrigger>
              <SelectContent>
                {[
                  "08:00",
                  "08:30",
                  "09:00",
                  "09:30",
                  "10:00",
                  "10:30",
                  "11:00",
                  "11:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                ].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmReschedule} disabled={!newDate || !newTime}>
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the appointment for{" "}
              {selectedAppointment?.patientName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
