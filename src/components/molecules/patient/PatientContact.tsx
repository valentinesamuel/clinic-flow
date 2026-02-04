import { cn } from '@/lib/utils';
import { Patient } from '@/types/patient.types';
import { PhoneNumber } from '@/components/atoms/display';
import { Mail, MapPin } from 'lucide-react';

interface PatientContactProps {
  patient: Patient;
  showAddress?: boolean;
  showEmail?: boolean;
  compact?: boolean;
  className?: string;
}

export function PatientContact({
  patient,
  showAddress = true,
  showEmail = true,
  compact = false,
  className,
}: PatientContactProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <PhoneNumber phone={patient.phone} showIcon />
        {patient.email && (
          <>
            <span className="text-muted-foreground">•</span>
            <a
              href={`mailto:${patient.email}`}
              className="text-sm text-primary hover:underline"
            >
              {patient.email}
            </a>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <PhoneNumber phone={patient.phone} showIcon />
        {patient.altPhone && (
          <span className="text-muted-foreground">
            / <PhoneNumber phone={patient.altPhone} />
          </span>
        )}
      </div>

      {showEmail && patient.email && (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a
            href={`mailto:${patient.email}`}
            className="text-sm text-primary hover:underline"
          >
            {patient.email}
          </a>
        </div>
      )}

      {showAddress && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            {patient.address}
            {patient.lga && `, ${patient.lga}`}
            {patient.state && `, ${patient.state}`}
          </span>
        </div>
      )}
    </div>
  );
}
