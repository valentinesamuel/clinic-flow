import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Patient } from '@/types/patient.types';
import { PatientNumber, GenderShort, BloodTypeDisplay } from '@/components/atoms/display';
import { calculateAge } from '@/constants/designSystem';

interface PatientQuickInfoProps {
  patient: Patient;
  showPhoto?: boolean;
  showMrn?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PatientQuickInfo({
  patient,
  showPhoto = true,
  showMrn = true,
  size = 'md',
  className,
}: PatientQuickInfoProps) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const age = calculateAge(patient.dateOfBirth);

  const avatarSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const nameSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showPhoto && (
        <Avatar className={avatarSizes[size]}>
          <AvatarImage src={patient.photoUrl} alt={fullName} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <span className={cn('font-semibold text-foreground', nameSizes[size])}>
          {fullName}
        </span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {showMrn && <PatientNumber number={patient.mrn} size="sm" />}
          <span>•</span>
          <span>{age}yrs</span>
          <span>•</span>
          <GenderShort gender={patient.gender} />
          {patient.bloodGroup !== 'unknown' && (
            <>
              <span>•</span>
              <BloodTypeDisplay bloodGroup={patient.bloodGroup} size="sm" showIcon={false} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
