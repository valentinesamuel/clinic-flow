// CheckInModal - Multi-step check-in flow for receptionists

import { useState } from 'react';
import { format } from 'date-fns';
import { User, Shield, AlertTriangle, Check, Clock } from 'lucide-react';
import { Appointment } from '@/types/clinical.types';
import { Patient, QueueType, QueuePriority } from '@/types/patient.types';
import { usePatient } from '@/hooks/queries/usePatientQueries';
import { useUpdateAppointment } from '@/hooks/mutations/useAppointmentMutations';
import { useAddToQueue } from '@/hooks/mutations/useQueueMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

type Step = 'verify' | 'insurance' | 'queue';

export function CheckInModal({ open, onOpenChange, appointment, onSuccess }: CheckInModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('verify');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [verified, setVerified] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);
  const [destination, setDestination] = useState<'triage' | 'doctor'>('triage');
  const [priority, setPriority] = useState<QueuePriority>('normal');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load patient data when modal opens
  useState(() => {
    if (appointment) {
      const patientData = getPatientById(appointment.patientId);
      setPatient(patientData || null);
    }
  });

  const handleNext = () => {
    if (step === 'verify') {
      if (patient?.paymentType === 'hmo') {
        setStep('insurance');
      } else {
        setStep('queue');
      }
    } else if (step === 'insurance') {
      setStep('queue');
    }
  };

  const handleBack = () => {
    if (step === 'insurance') {
      setStep('verify');
    } else if (step === 'queue') {
      if (patient?.paymentType === 'hmo') {
        setStep('insurance');
      } else {
        setStep('verify');
      }
    }
  };

  const handleSubmit = async () => {
    if (!appointment || !patient) return;

    setIsSubmitting(true);

    try {
      // Update appointment status
      checkInAppointment(appointment.id);

      // Add to queue
      const queueType: QueueType = destination === 'doctor' ? 'doctor' : 'triage';
      addToQueue({
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientMrn: patient.mrn,
        queueType,
        priority,
        reasonForVisit: appointment.reasonForVisit,
        assignedTo: destination === 'doctor' ? appointment.doctorId : undefined,
        notes: notes || undefined,
      });

      toast({
        title: 'Patient Checked In',
        description: `${patient.firstName} ${patient.lastName} added to ${destination === 'doctor' ? 'Doctor' : 'Triage'} queue`,
      });

      // Reset and close
      setStep('verify');
      setVerified(false);
      setInsuranceVerified(false);
      setDestination('triage');
      setPriority('normal');
      setNotes('');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check in patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment) return null;

  const renderStep = () => {
    switch (step) {
      case 'verify':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
              <p className="text-sm text-muted-foreground">{appointment.patientMrn}</p>
            </div>

            {patient && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{patient.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Type:</span>
                  <Badge variant="outline" className="capitalize">{patient.paymentType}</Badge>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <input
                type="checkbox"
                id="verify-identity"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="h-5 w-5 rounded border-input"
              />
              <Label htmlFor="verify-identity" className="flex-1 cursor-pointer">
                I have verified the patient's identity
              </Label>
            </div>
          </div>
        );

      case 'insurance':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">HMO Verification</h3>
                <p className="text-sm text-muted-foreground">{patient?.hmoDetails?.providerName}</p>
              </div>
            </div>

            {patient?.hmoDetails && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <span>{patient.hmoDetails.planType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Enrollment ID:</span>
                  <span>{patient.hmoDetails.enrollmentId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span>{format(new Date(patient.hmoDetails.expiryDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Co-pay:</span>
                  <span>₦{patient.hmoDetails.copayAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Simulated verification status */}
            <div className={cn(
              'flex items-center gap-3 p-4 rounded-lg',
              patient?.hmoDetails?.isActive 
                ? 'bg-green-500/10 border border-green-200' 
                : 'bg-destructive/10 border border-destructive/20'
            )}>
              {patient?.hmoDetails?.isActive ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-700">HMO Status: Active</p>
                    <p className="text-sm text-green-600">Coverage verified successfully</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">HMO Status: Inactive</p>
                    <p className="text-sm text-destructive">Please verify payment method</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <input
                type="checkbox"
                id="verify-insurance"
                checked={insuranceVerified}
                onChange={(e) => setInsuranceVerified(e.target.checked)}
                className="h-5 w-5 rounded border-input"
              />
              <Label htmlFor="verify-insurance" className="flex-1 cursor-pointer">
                I have verified the insurance status
              </Label>
            </div>
          </div>
        );

      case 'queue':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Queue Destination</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Where should this patient go next?
              </p>
              <RadioGroup value={destination} onValueChange={(v) => setDestination(v as typeof destination)}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent/50">
                  <RadioGroupItem value="triage" id="triage" />
                  <Label htmlFor="triage" className="flex-1 cursor-pointer">
                    <span className="font-medium">Triage Queue</span>
                    <p className="text-sm text-muted-foreground">Patient needs vitals recorded first</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent/50 mt-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor" className="flex-1 cursor-pointer">
                    <span className="font-medium">Doctor Queue</span>
                    <p className="text-sm text-muted-foreground">Skip triage, go directly to {appointment.doctorName}</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as QueuePriority)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Any special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1.5"
              />
            </div>

            {priority === 'emergency' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Emergency Priority</p>
                  <p>Patient will be moved to the front of the queue.</p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'verify':
        return verified;
      case 'insurance':
        return insuranceVerified;
      case 'queue':
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Check In Patient</DialogTitle>
          <DialogDescription>
            {step === 'verify' && 'Verify patient identity'}
            {step === 'insurance' && 'Verify insurance coverage'}
            {step === 'queue' && 'Assign to queue'}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {['verify', 'insurance', 'queue'].map((s, i) => {
            if (s === 'insurance' && patient?.paymentType !== 'hmo') return null;
            const isActive = s === step;
            const isPast = 
              (step === 'insurance' && s === 'verify') ||
              (step === 'queue' && (s === 'verify' || (s === 'insurance' && patient?.paymentType === 'hmo')));
            
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && !(s === 'insurance' && patient?.paymentType !== 'hmo') && (
                  <div className={cn('h-px w-8', isPast || isActive ? 'bg-primary' : 'bg-muted')} />
                )}
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                  isActive ? 'bg-primary text-primary-foreground' :
                  isPast ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  {isPast ? <Check className="h-4 w-4" /> : i + 1}
                </div>
              </div>
            );
          })}
        </div>

        {renderStep()}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {step !== 'verify' && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step !== 'queue' ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex-1 sm:flex-none">
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 sm:flex-none">
              {isSubmitting ? 'Checking In...' : 'Complete Check-In'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
