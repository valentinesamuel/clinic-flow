import { Patient } from '@/types/patient.types';
import { calculateAge } from '@/data/patients';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, UserCheck, Phone, Mail } from 'lucide-react';
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
  const age = calculateAge(patient.dateOfBirth);
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

  const paymentBadgeVariant = {
    cash: 'secondary',
    hmo: 'default',
    corporate: 'outline',
  } as const;

  const genderIcon = patient.gender === 'male' ? '♂' : patient.gender === 'female' ? '♀' : '⚧';

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
          <p className="text-xs text-muted-foreground">
            {patient.mrn} • {age} yrs {genderIcon}
          </p>
        </div>
        <Badge variant={paymentBadgeVariant[patient.paymentType]} className="text-xs">
          {patient.paymentType === 'hmo' ? patient.hmoDetails?.providerName : patient.paymentType}
        </Badge>
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
              <p className="text-sm text-muted-foreground">
                {patient.mrn}
              </p>
            </div>
            <Badge variant={paymentBadgeVariant[patient.paymentType]}>
              {patient.paymentType === 'hmo' ? patient.hmoDetails?.providerName : patient.paymentType.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {genderIcon} {age} years
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {patient.phone}
            </span>
            {patient.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {patient.email}
              </span>
            )}
          </div>
          
          {patient.bloodGroup !== 'unknown' && (
            <Badge variant="outline" className="mt-2 text-xs">
              Blood Type: {patient.bloodGroup}
            </Badge>
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
