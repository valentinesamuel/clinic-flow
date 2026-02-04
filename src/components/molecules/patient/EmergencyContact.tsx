import { cn } from '@/lib/utils';
import { Patient } from '@/types/patient.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, User } from 'lucide-react';
import { PhoneNumber } from '@/components/atoms/display';

interface EmergencyContactProps {
  patient: Patient;
  showCard?: boolean;
  className?: string;
}

export function EmergencyContact({
  patient,
  showCard = true,
  className,
}: EmergencyContactProps) {
  const { nextOfKin } = patient;

  if (!nextOfKin) {
    return (
      <span className="text-sm text-muted-foreground">
        No emergency contact on file
      </span>
    );
  }

  const content = (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{nextOfKin.name}</span>
        <span className="text-muted-foreground">({nextOfKin.relationship})</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <PhoneNumber phone={nextOfKin.phone} />
      </div>
      {nextOfKin.address && (
        <p className="text-sm text-muted-foreground pl-6">{nextOfKin.address}</p>
      )}
    </div>
  );

  if (!showCard) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
