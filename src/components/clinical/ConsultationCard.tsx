import { useState } from 'react';
import { Consultation } from '@/types/clinical.types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronUp, 
  Stethoscope, 
  FileText, 
  Pill, 
  FlaskConical,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ConsultationCardProps {
  consultation: Consultation;
  doctorName?: string;
  defaultExpanded?: boolean;
  onViewPrescription?: (prescriptionId: string) => void;
  onViewLabResults?: (labOrderIds: string[]) => void;
}

export function ConsultationCard({
  consultation,
  doctorName,
  defaultExpanded = false,
  onViewPrescription,
  onViewLabResults,
}: ConsultationCardProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const consultationDate = new Date(consultation.createdAt);
  const isUrgent = consultation.chiefComplaint.toLowerCase().includes('emergency') ||
    consultation.chiefComplaint.toLowerCase().includes('urgent') ||
    consultation.chiefComplaint.toLowerCase().includes('acute');

  return (
    <Card className={cn(
      "transition-all",
      isUrgent && "border-destructive/50"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-2 w-2 rounded-full mt-2",
                  isUrgent ? "bg-destructive" : "bg-primary"
                )} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {format(consultationDate, 'dd MMM yyyy')}
                    </span>
                    {isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {consultation.chiefComplaint}
                  </p>
                  {doctorName && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <User className="h-3 w-3" />
                      {doctorName}
                    </div>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <Separator />

            {/* Diagnosis */}
            <div>
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                Diagnosis
              </h4>
              <div className="flex flex-wrap gap-2">
                {consultation.diagnosis.map((d, i) => (
                  <Badge key={i} variant="secondary">
                    {d}
                    {consultation.icdCodes[i] && (
                      <span className="ml-1 text-muted-foreground">
                        ({consultation.icdCodes[i]})
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* History of Present Illness */}
            <div>
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                History of Present Illness
              </h4>
              <p className="text-sm text-muted-foreground">
                {consultation.historyOfPresentIllness}
              </p>
            </div>

            {/* Physical Examination */}
            <div>
              <h4 className="text-sm font-medium mb-2">Physical Examination</h4>
              <p className="text-sm text-muted-foreground">
                {consultation.physicalExamination}
              </p>
            </div>

            {/* Treatment Plan */}
            <div>
              <h4 className="text-sm font-medium mb-2">Treatment Plan</h4>
              <p className="text-sm text-muted-foreground">
                {consultation.treatmentPlan}
              </p>
            </div>

            {/* Follow-up Date */}
            {consultation.followUpDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Follow-up:</span>
                <span className="font-medium">
                  {format(new Date(consultation.followUpDate), 'dd MMM yyyy')}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {consultation.prescriptionId && onViewPrescription && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewPrescription(consultation.prescriptionId!)}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  View Prescription
                </Button>
              )}
              {consultation.labOrderIds.length > 0 && onViewLabResults && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewLabResults(consultation.labOrderIds)}
                >
                  <FlaskConical className="h-4 w-4 mr-2" />
                  View Lab Results
                </Button>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
