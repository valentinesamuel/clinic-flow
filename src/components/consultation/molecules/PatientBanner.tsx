import { Patient } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Heart, Thermometer, Activity } from 'lucide-react';
import { differenceInYears } from 'date-fns';

interface PatientBannerProps {
  patient: Patient;
  vitals?: VitalSigns | null;
  compact?: boolean;
}

export function PatientBanner({ patient, vitals, compact }: PatientBannerProps) {
  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

  return (
    <div className="sticky top-0 z-20 bg-background border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-sm">
              {patient.firstName} {patient.lastName}
            </h2>
            <span className="text-xs text-muted-foreground">MRN: {patient.mrn}</span>
            <span className="text-xs text-muted-foreground">
              {age}yr {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'O'}
            </span>
            <Badge variant="outline" className="text-xs capitalize">
              {patient.paymentType}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {patient.allergies.length > 0 && patient.allergies.map((allergy) => (
              <Badge key={allergy} variant="destructive" className="text-[10px] gap-1">
                <AlertTriangle className="h-3 w-3" />
                {allergy}
              </Badge>
            ))}
            {patient.allergies.length === 0 && (
              <span className="text-xs text-muted-foreground">NKDA</span>
            )}
          </div>
        </div>
        {vitals && !compact && (
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
            </span>
            <span className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              {vitals.temperature}°C
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {vitals.pulse} bpm
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
