// AppointmentBookingModal - Full appointment booking form

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, User, Clock, AlertCircle } from 'lucide-react';
import { Appointment, AppointmentType, AppointmentInput } from '@/types/clinical.types';
import { Patient } from '@/types/patient.types';
import { usePatientSearch, usePatient } from '@/hooks/queries/usePatientQueries';
import { useDoctors } from '@/hooks/queries/useStaffQueries';
import { useAppointments } from '@/hooks/queries/useAppointmentQueries';
import { useCreateAppointment } from '@/hooks/mutations/useAppointmentMutations';
import { TimeSlotPicker } from './TimeSlotPicker';
import { DoctorSelector } from './DoctorSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AppointmentBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPatientId?: string;
  initialDate?: Date;
  initialTime?: string;
  onSuccess?: (appointment: Appointment) => void;
}

const appointmentTypes: { value: AppointmentType; label: string; duration: number }[] = [
  { value: 'consultation', label: 'Consultation', duration: 30 },
  { value: 'follow_up', label: 'Follow-up', duration: 30 },
  { value: 'procedure', label: 'Procedure', duration: 60 },
  { value: 'lab_only', label: 'Lab Only', duration: 15 },
  { value: 'emergency', label: 'Emergency', duration: 45 },
];

export function AppointmentBookingModal({
  open,
  onOpenChange,
  initialPatientId,
  initialDate,
  initialTime,
  onSuccess,
}: AppointmentBookingModalProps) {
  const { toast } = useToast();

  // Form state
  const [step, setStep] = useState(1);
  const [patientSearch, setPatientSearch] = useState('');

  // Fetch patient by ID if provided
  const { data: initialPatient } = usePatient(initialPatientId || '');

  // Fetch patient search results
  const { data: patientSearchResults } = usePatientSearch(patientSearch);
  const searchResults = patientSearchResults || [];

  // Fetch doctors
  const { data: doctorsData } = useDoctors();
  const doctors = doctorsData || [];

  // Fetch all appointments for time slot checking
  const { data: appointmentsData } = useAppointments();
  const appointments = appointmentsData || [];

  // Create appointment mutation
  const createAppointmentMutation = useCreateAppointment();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate || new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(initialTime);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('consultation');
  const [duration, setDuration] = useState(30);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'emergency'>('normal');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientPopoverOpen, setPatientPopoverOpen] = useState(false);

  // Load initial patient if provided
  useEffect(() => {
    if (initialPatient) {
      setSelectedPatient(initialPatient);
      setStep(2);
    }
  }, [initialPatient]);

  // Update duration when type changes
  useEffect(() => {
    const typeConfig = appointmentTypes.find(t => t.value === appointmentType);
    if (typeConfig) {
      setDuration(typeConfig.duration);
    }
  }, [appointmentType]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearch('');
    setPatientPopoverOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !selectedDate || !selectedTime || !selectedDoctorId || !reasonForVisit) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const doctor = doctors.find(d => d.id === selectedDoctorId);

      const appointmentData: AppointmentInput = {
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientMrn: selectedPatient.mrn,
        doctorId: selectedDoctorId,
        doctorName: doctor?.name || 'Unknown Doctor',
        appointmentType,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        scheduledTime: selectedTime,
        duration,
        reasonForVisit,
        notes: notes || undefined,
      };

      const newAppointment = await createAppointmentMutation.mutateAsync(appointmentData);

      toast({
        title: 'Appointment Booked',
        description: `Appointment scheduled for ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime}`,
      });

      onSuccess?.(newAppointment);
      onOpenChange(false);

      // Reset form
      setStep(1);
      setSelectedPatient(null);
      setSelectedDate(new Date());
      setSelectedTime(undefined);
      setSelectedDoctorId('');
      setAppointmentType('consultation');
      setReasonForVisit('');
      setNotes('');
      setPriority('normal');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment for a patient
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Patient Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Patient</Label>
            
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.mrn} • {selectedPatient.phone}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPatient(null);
                    setStep(1);
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Popover open={patientPopoverOpen} onOpenChange={setPatientPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Search for a patient...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search by name, MRN, or phone..."
                      value={patientSearch}
                      onValueChange={setPatientSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {patientSearch.length < 2 
                          ? 'Type at least 2 characters to search...'
                          : 'No patients found.'
                        }
                      </CommandEmpty>
                      <CommandGroup>
                        {searchResults.map((patient) => (
                          <CommandItem
                            key={patient.id}
                            onSelect={() => handlePatientSelect(patient)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {patient.firstName} {patient.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {patient.mrn} • {patient.phone}
                                </p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Step 2: Appointment Details */}
          {selectedPatient && (
            <>
              {/* Date & Doctor Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !selectedDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Doctor</Label>
                  <DoctorSelector
                    value={selectedDoctorId}
                    onSelect={(id) => setSelectedDoctorId(id)}
                    date={selectedDate}
                  />
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && selectedDoctorId && (
                <div className="space-y-2">
                  <Label>Time</Label>
                  <TimeSlotPicker
                    date={selectedDate}
                    doctorId={selectedDoctorId}
                    duration={duration}
                    selectedTime={selectedTime}
                    existingAppointments={appointments}
                    onSelect={setSelectedTime}
                  />
                </div>
              )}

              {/* Type & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <Select
                    value={appointmentType}
                    onValueChange={(v) => setAppointmentType(v as AppointmentType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} ({type.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <Label>Reason for Visit *</Label>
                <Textarea
                  placeholder="Describe the reason for this appointment..."
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  placeholder="Any additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Warning for emergency */}
              {priority === 'emergency' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Emergency Appointment</p>
                    <p>This will be marked as an emergency and prioritized accordingly.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPatient || !selectedDate || !selectedTime || !selectedDoctorId || !reasonForVisit || isSubmitting}
          >
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
