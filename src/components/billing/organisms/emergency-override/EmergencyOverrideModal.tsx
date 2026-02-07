// EmergencyOverrideModal - Authorize emergency payment bypass

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Patient } from '@/types/patient.types';
import { EmergencyOverride } from '@/types/cashier.types';
import { AlertTriangle, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmergencyOverrideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient;
  estimatedAmount: number;
  onAuthorize: (override: EmergencyOverride) => void;
}

type OverrideScope = 'consultation' | 'consultation_emergency' | 'full_visit';

const scopeLabels: Record<OverrideScope, { label: string; description: string }> = {
  consultation: {
    label: 'Consultation Only',
    description: 'Covers initial consultation fee only',
  },
  consultation_emergency: {
    label: 'Consultation + Emergency',
    description: 'Covers consultation and emergency procedures',
  },
  full_visit: {
    label: 'Full Visit (All Services)',
    description: 'Covers all services for this visit',
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EmergencyOverrideModal({
  open,
  onOpenChange,
  patient,
  estimatedAmount,
  onAuthorize,
}: EmergencyOverrideModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [reason, setReason] = useState('');
  const [scope, setScope] = useState<OverrideScope>('consultation');
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canAuthorize = ['doctor', 'cmo', 'hospital_admin'].includes(user?.role || '');

  const getScopeAmount = (selectedScope: OverrideScope): number => {
    switch (selectedScope) {
      case 'consultation':
        return 15000;
      case 'consultation_emergency':
        return 30000;
      case 'full_visit':
        return estimatedAmount;
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (reason.length < 20) {
      newErrors.reason = 'Please provide a detailed reason (min 20 characters)';
    }
    if (!confirmed) {
      newErrors.confirmed = 'You must confirm understanding of the audit log';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthorize = () => {
    if (!validate() || !user) return;

    const override: EmergencyOverride = {
      id: `eo-${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      reason,
      scope,
      estimatedAmount: getScopeAmount(scope),
      authorizedBy: user.id,
      authorizedByName: user.name,
      authorizedByRole: user.role,
      authorizedAt: new Date().toISOString(),
      status: 'active',
    };

    toast({
      title: 'Emergency Override Authorized',
      description: `${patient.firstName} ${patient.lastName} can now proceed without payment`,
    });

    onAuthorize(override);
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setScope('consultation');
    setConfirmed(false);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Emergency Payment Override
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">
              {patient.firstName} {patient.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{patient.mrn}</p>
          </div>

          {/* Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Use for life-threatening emergencies only</AlertTitle>
            <AlertDescription>
              This allows treatment without upfront payment. All overrides are
              logged for audit and outstanding amounts will be tracked.
            </AlertDescription>
          </Alert>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Override *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the emergency situation requiring immediate treatment..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/20 characters minimum
            </p>
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason}</p>
            )}
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label>Override Scope *</Label>
            <RadioGroup
              value={scope}
              onValueChange={(v) => setScope(v as OverrideScope)}
            >
              {(Object.keys(scopeLabels) as OverrideScope[]).map((key) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="flex-1 cursor-pointer">
                    <span className="font-medium">{scopeLabels[key].label}</span>
                    <span className="text-muted-foreground ml-2">
                      ({formatCurrency(getScopeAmount(key))})
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {scopeLabels[key].description}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Confirmation */}
          <div className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-lg">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
            />
            <Label htmlFor="confirm" className="text-sm cursor-pointer">
              I understand this override will be logged for audit, and the
              outstanding amount will be tracked on the patient's account.
            </Label>
          </div>
          {errors.confirmed && (
            <p className="text-sm text-destructive">{errors.confirmed}</p>
          )}

          {/* Authorizing Staff */}
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Authorizing:</p>
              <p className="text-sm text-muted-foreground">
                {user?.name} ({user?.role.replace('_', ' ')})
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleAuthorize}
            disabled={!canAuthorize}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Authorize Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
