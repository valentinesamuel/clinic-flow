import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, FlaskConical, Pill } from 'lucide-react';
import { ProtocolBundle } from '@/types/financial.types';

interface ProtocolBundleCardProps {
  bundle: ProtocolBundle;
  onApply: (bundle: ProtocolBundle) => void;
  isApplied: boolean;
}

export function ProtocolBundleCard({ bundle, onApply, isApplied }: ProtocolBundleCardProps) {
  return (
    <Card className={isApplied ? 'border-primary bg-primary/5' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{bundle.name}</CardTitle>
          <Button
            size="sm"
            variant={isApplied ? 'secondary' : 'default'}
            onClick={() => onApply(bundle)}
            disabled={isApplied}
          >
            {isApplied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Applied
              </>
            ) : (
              'Apply Bundle'
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{bundle.description}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {bundle.icd10Codes.map((code) => (
            <Badge key={code} variant="outline" className="font-mono text-[10px]">
              {code}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {bundle.labTests.length > 0 && (
          <div>
            <p className="text-xs font-medium flex items-center gap-1 mb-1">
              <FlaskConical className="h-3 w-3" />
              Lab Tests
            </p>
            <div className="flex flex-wrap gap-1">
              {bundle.labTests.map((test) => (
                <Badge key={test.testCode} variant="secondary" className="text-[10px]">
                  {test.testName}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {bundle.medications.length > 0 && (
          <div>
            <p className="text-xs font-medium flex items-center gap-1 mb-1">
              <Pill className="h-3 w-3" />
              Medications
            </p>
            <div className="flex flex-wrap gap-1">
              {bundle.medications.map((med, i) => (
                <Badge key={i} variant="secondary" className="text-[10px]">
                  {med.drugName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
