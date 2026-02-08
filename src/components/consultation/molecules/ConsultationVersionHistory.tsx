import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { ConsultationVersion, AmendmentReason } from '@/types/consultation.types';
import { format } from 'date-fns';

const REASON_LABELS: Record<AmendmentReason, string> = {
  typo: 'Typo / Minor Correction',
  new_clinical_data: 'New Clinical Data',
  hmo_rejection_fix: 'HMO Rejection Fix',
  other: 'Other',
};

interface ConsultationVersionHistoryProps {
  versions: ConsultationVersion[];
  currentVersion: number;
}

export function ConsultationVersionHistory({ versions, currentVersion }: ConsultationVersionHistoryProps) {
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

  if (versions.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="h-4 w-4" />
          Version History
          <Badge variant="secondary" className="text-xs">
            v{currentVersion}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Current version */}
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="default" className="text-xs">Current (v{currentVersion})</Badge>
          <span className="text-muted-foreground">Active version</span>
        </div>

        <Separator />

        {/* Previous versions */}
        {[...versions].reverse().map(version => (
          <div key={version.version} className="border rounded-md">
            <button
              className="w-full flex items-center justify-between p-2.5 text-left hover:bg-muted/50"
              onClick={() => setExpandedVersion(
                expandedVersion === version.version ? null : version.version
              )}
              type="button"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">v{version.version}</Badge>
                <span className="text-sm">{REASON_LABELS[version.reason]}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(version.amendedAt), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
              {expandedVersion === version.version ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expandedVersion === version.version && (
              <div className="px-2.5 pb-2.5 space-y-2 border-t">
                <div className="pt-2 text-xs text-muted-foreground">
                  Amended by: {version.amendedByName}
                </div>
                {version.reasonDetail && (
                  <div className="text-xs text-muted-foreground">
                    Detail: {version.reasonDetail}
                  </div>
                )}

                <div className="space-y-1.5 text-sm">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Chief Complaint</span>
                    <p className="text-sm">{version.snapshot.chiefComplaint}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Diagnoses</span>
                    <p className="text-sm">
                      {version.snapshot.selectedDiagnoses.map(d =>
                        `${d.description} (${d.code})`
                      ).join('; ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Treatment Plan</span>
                    <p className="text-sm">{version.snapshot.treatmentPlan}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
