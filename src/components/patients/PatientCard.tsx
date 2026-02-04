// PatientCard - Refactored to use atomic components

import { Patient } from '@/types/patient.types';
import { calculateAge } from '@/data/patients';

// Atomic components
import { PatientNumber } from '@/components/atoms/display/PatientNumber';
import { PatientAge } from '@/components/atoms/display/PatientAge';
import { GenderIcon } from '@/components/atoms/display/GenderIcon';
import { PhoneNumber } from '@/components/atoms/display/PhoneNumber';
import { InsuranceBadge } from '@/components/atoms/display/InsuranceBadge';
import { BloodTypeDisplay } from '@/components/atoms/display/BloodTypeDisplay';

// UI components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
  onCheckIn?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function PatientCard({
  patient,
  onClick,
  onCheckIn,
  showActions = true,
  compact = false,
}: PatientCardProps) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

  if (compact) {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors",
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={patient.photoUrl} alt={`${patient.firstName} ${patient.lastName}`} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {patient.firstName} {patient.lastName}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <PatientNumber number={patient.mrn} size="sm" />
            <span>•</span>
            <PatientAge dateOfBirth={patient.dateOfBirth} />
            <GenderIcon gender={patient.gender} size="sm" />
          </div>
        </div>
        <InsuranceBadge 
          paymentType={patient.paymentType}
          hmoName={patient.hmoDetails?.providerName}
        />
      </div>
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={patient.photoUrl} alt={`${patient.firstName} ${patient.lastName}`} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">
                {patient.firstName} {patient.middleName ? `${patient.middleName} ` : ''}{patient.lastName}
              </h3>
              <PatientNumber number={patient.mrn} size="sm" />
            </div>
            <InsuranceBadge 
              paymentType={patient.paymentType}
              hmoName={patient.hmoDetails?.providerName}
            />
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <PatientAge dateOfBirth={patient.dateOfBirth} />
              <GenderIcon gender={patient.gender} showLabel size="sm" />
            </div>
            <PhoneNumber phone={patient.phone} />
          </div>
          
          {patient.bloodGroup !== 'unknown' && (
            <div className="mt-2">
              <BloodTypeDisplay bloodGroup={patient.bloodGroup} size="sm" />
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex flex-col gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {onCheckIn && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckIn();
                }}
                title="Check In"
              >
                <UserCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
