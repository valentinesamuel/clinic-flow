import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface PatientConditionListProps {
  conditions: string[];
  showCard?: boolean;
  compact?: boolean;
  className?: string;
}

export function PatientConditionList({
  conditions,
  showCard = true,
  compact = false,
  className,
}: PatientConditionListProps) {
  if (!conditions || conditions.length === 0) {
    if (compact) {
      return (
        <span className="text-xs text-muted-foreground">
          No chronic conditions
        </span>
      );
    }
    return (
      <div className={className}>
        <span className="text-sm text-muted-foreground">
          No chronic conditions recorded
        </span>
      </div>
    );
  }

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs text-warning font-medium"
        title={conditions.join(', ')}
      >
        <Activity className="h-3 w-3" />
        {conditions.length} condition{conditions.length !== 1 ? 's' : ''}
      </span>
    );
  }

  const content = (
    <div className="flex flex-wrap gap-1.5">
      {conditions.map((condition, index) => (
        <Badge
          key={index}
          variant="outline"
          className="bg-warning/10 text-warning border-warning/20"
        >
          {condition}
        </Badge>
      ))}
    </div>
  );

  if (!showCard) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-warning" />
          Chronic Conditions
          <span className="text-warning">({conditions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
