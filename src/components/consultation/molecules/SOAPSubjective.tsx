import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SOAPSectionHeader } from '../atoms/SOAPSectionHeader';
import { MessageSquare } from 'lucide-react';

interface SOAPSubjectiveProps {
  chiefComplaint: string;
  onChiefComplaintChange: (value: string) => void;
  hpi: string;
  onHPIChange: (value: string) => void;
  readOnly?: boolean;
}

export function SOAPSubjective({ chiefComplaint, onChiefComplaintChange, hpi, onHPIChange, readOnly }: SOAPSubjectiveProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <SOAPSectionHeader
          icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
          title="Subjective"
          description="Patient's reported symptoms and history"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chief-complaint">Chief Complaint *</Label>
          {readOnly ? (
            <p className="text-sm">{chiefComplaint}</p>
          ) : (
            <Input
              id="chief-complaint"
              value={chiefComplaint}
              onChange={(e) => onChiefComplaintChange(e.target.value)}
              placeholder="Primary reason for visit..."
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="hpi">History of Present Illness *</Label>
          {readOnly ? (
            <p className="text-sm text-muted-foreground">{hpi}</p>
          ) : (
            <Textarea
              id="hpi"
              value={hpi}
              onChange={(e) => onHPIChange(e.target.value)}
              placeholder="Detailed history of current symptoms, onset, duration, associated symptoms..."
              rows={4}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
