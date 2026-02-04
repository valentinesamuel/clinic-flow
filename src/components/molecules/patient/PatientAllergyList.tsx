import { cn } from '@/lib/utils';
import { AllergyAlert } from '@/components/atoms/display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface PatientAllergyListProps {
  allergies: string[];
  showCard?: boolean;
  compact?: boolean;
  className?: string;
}

export function PatientAllergyList({
  allergies,
  showCard = true,
  compact = false,
  className,
}: PatientAllergyListProps) {
  if (compact) {
    return <AllergyAlert allergies={allergies} compact className={className} />;
  }

  const content = <AllergyAlert allergies={allergies} maxDisplay={10} />;

  if (!showCard) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card
      className={cn(
        allergies.length > 0 && 'border-destructive/50',
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {allergies.length > 0 && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
          Allergies
          {allergies.length > 0 && (
            <span className="text-destructive">({allergies.length})</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
