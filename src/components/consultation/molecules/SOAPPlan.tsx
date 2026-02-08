import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SOAPSectionHeader } from '../atoms/SOAPSectionHeader';
import { SectionLockOverlay } from '../atoms/SectionLockOverlay';
import { FollowUpPicker } from './FollowUpPicker';
import { ClipboardList, FlaskConical, Pill, Calendar } from 'lucide-react';

interface SOAPPlanProps {
  treatmentPlan: string;
  onChange: (value: string) => void;
  locked: boolean;
  prescriptionCount: number;
  labOrderCount: number;
  onAddPrescription: () => void;
  onAddLabOrder: () => void;
  followUpDate: string | null;
  onFollowUpChange: (date: string | null) => void;
  readOnly?: boolean;
}

export function SOAPPlan({
  treatmentPlan,
  onChange,
  locked,
  prescriptionCount,
  labOrderCount,
  onAddPrescription,
  onAddLabOrder,
  followUpDate,
  onFollowUpChange,
  readOnly,
}: SOAPPlanProps) {
  return (
    <SectionLockOverlay locked={locked && !readOnly}>
      <Card>
        <CardHeader className="pb-3">
          <SOAPSectionHeader
            icon={<ClipboardList className="h-4 w-4 text-purple-500" />}
            title="Plan"
            description="Treatment plan and orders"
            locked={locked && !readOnly}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="treatment-plan">Treatment Plan *</Label>
            {readOnly ? (
              <p className="text-sm text-muted-foreground">{treatmentPlan}</p>
            ) : (
              <Textarea
                id="treatment-plan"
                value={treatmentPlan}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Describe the treatment plan, medications, procedures, patient education..."
                rows={4}
                disabled={locked}
              />
            )}
          </div>

          {!readOnly && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onAddLabOrder}
                disabled={locked}
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                Order Lab Tests
                {labOrderCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {labOrderCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddPrescription}
                disabled={locked}
              >
                <Pill className="h-4 w-4 mr-2" />
                Write Prescription
                {prescriptionCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {prescriptionCount}
                  </Badge>
                )}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Follow-up Date</Label>
            {readOnly ? (
              followUpDate ? (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(followUpDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No follow-up scheduled</p>
              )
            ) : (
              <FollowUpPicker value={followUpDate} onChange={onFollowUpChange} readOnly={locked} />
            )}
          </div>
        </CardContent>
      </Card>
    </SectionLockOverlay>
  );
}
