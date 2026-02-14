import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { VitalSigns } from '@/types/clinical.types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getVitalStatus, getBMICategory } from './VitalSignsCard';
import { cn } from '@/lib/utils';

const vitalsSchema = z.object({
  bloodPressureSystolic: z.number().min(60).max(250),
  bloodPressureDiastolic: z.number().min(40).max(150),
  temperature: z.number().min(35).max(42),
  pulse: z.number().min(40).max(200),
  respiratoryRate: z.number().min(10).max(40),
  oxygenSaturation: z.number().min(70).max(100),
  weight: z.number().min(1).max(300),
  height: z.number().min(50).max(250),
  notes: z.string().optional(),
});

type VitalsFormData = z.infer<typeof vitalsSchema>;

interface VitalsEntryModalProps {
  patientId: string;
  patientName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (vitals: VitalSigns) => void;
}

export function VitalsEntryModal({ 
  patientId, 
  patientName, 
  isOpen, 
  onClose, 
  onSuccess 
}: VitalsEntryModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedBMI, setCalculatedBMI] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VitalsFormData>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      temperature: undefined,
      pulse: undefined,
      respiratoryRate: undefined,
      oxygenSaturation: undefined,
      weight: undefined,
      height: undefined,
      notes: '',
    },
  });

  const weight = watch('weight');
  const height = watch('height');
  const systolic = watch('bloodPressureSystolic');
  const diastolic = watch('bloodPressureDiastolic');
  const temp = watch('temperature');
  const pulse = watch('pulse');
  const rr = watch('respiratoryRate');
  const o2 = watch('oxygenSaturation');

  // Calculate BMI when weight/height changes
  useEffect(() => {
    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      setCalculatedBMI(Math.round(bmi * 10) / 10);
    } else {
      setCalculatedBMI(null);
    }
  }, [weight, height]);

  const onSubmit = async (data: VitalsFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const heightInMeters = data.height / 100;
      const bmi = data.weight / (heightInMeters * heightInMeters);

      const newVitals: VitalSigns = {
        id: `vit-${Date.now()}`,
        patientId,
        recordedBy: user?.id || 'unknown',
        recordedAt: new Date().toISOString(),
        bloodPressureSystolic: data.bloodPressureSystolic,
        bloodPressureDiastolic: data.bloodPressureDiastolic,
        temperature: data.temperature,
        pulse: data.pulse,
        respiratoryRate: data.respiratoryRate,
        oxygenSaturation: data.oxygenSaturation,
        weight: data.weight,
        height: data.height,
        bmi: Math.round(bmi * 10) / 10,
        notes: data.notes,
      };

      toast({
        title: 'Vitals recorded successfully',
        description: `Vital signs for ${patientName} have been saved.`,
      });

      reset();
      onSuccess(newVitals);
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to record vitals',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (field: string, value: number | undefined) => {
    if (value === undefined) return null;
    const status = getVitalStatus(field as any, value);
    if (status.status === 'normal') return null;
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "text-[10px] ml-2",
          status.status === 'warning' && "text-yellow-600 border-yellow-600",
          status.status === 'critical' && "text-destructive border-destructive"
        )}
      >
        {status.direction?.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Vital Signs</DialogTitle>
          <p className="text-sm text-muted-foreground">Patient: {patientName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label className="flex items-center">
                Blood Pressure (Systolic) *
                {getStatusBadge('bloodPressureSystolic', systolic)}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="120"
                  {...register('bloodPressureSystolic', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">mmHg</span>
              </div>
              {errors.bloodPressureSystolic && (
                <p className="text-sm text-destructive">60-250 mmHg</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Blood Pressure (Diastolic) *
                {getStatusBadge('bloodPressureDiastolic', diastolic)}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="80"
                  {...register('bloodPressureDiastolic', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">mmHg</span>
              </div>
              {errors.bloodPressureDiastolic && (
                <p className="text-sm text-destructive">40-150 mmHg</p>
              )}
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <Label className="flex items-center">
                Temperature *
                {getStatusBadge('temperature', temp)}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  {...register('temperature', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">°C</span>
              </div>
              {errors.temperature && (
                <p className="text-sm text-destructive">35-42°C</p>
              )}
            </div>

            {/* Pulse */}
            <div className="space-y-2">
              <Label className="flex items-center">
                Pulse Rate *
                {getStatusBadge('pulse', pulse)}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="72"
                  {...register('pulse', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">bpm</span>
              </div>
              {errors.pulse && (
                <p className="text-sm text-destructive">40-200 bpm</p>
              )}
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-2">
              <Label className="flex items-center">
                Respiratory Rate *
                {getStatusBadge('respiratoryRate', rr)}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="16"
                  {...register('respiratoryRate', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">/min</span>
              </div>
              {errors.respiratoryRate && (
                <p className="text-sm text-destructive">10-40/min</p>
              )}
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-2">
              <Label className="flex items-center">
                Oxygen Saturation *
                {getStatusBadge('oxygenSaturation', o2)}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="98"
                  {...register('oxygenSaturation', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              {errors.oxygenSaturation && (
                <p className="text-sm text-destructive">70-100%</p>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label>Weight *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="70"
                  {...register('weight', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">kg</span>
              </div>
              {errors.weight && (
                <p className="text-sm text-destructive">1-300 kg</p>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label>Height *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="170"
                  {...register('height', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">cm</span>
              </div>
              {errors.height && (
                <p className="text-sm text-destructive">50-250 cm</p>
              )}
            </div>
          </div>

          {/* Calculated BMI */}
          {calculatedBMI && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calculated BMI</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{calculatedBMI}</span>
                  <Badge 
                    variant="outline"
                    className={cn(
                      getBMICategory(calculatedBMI).status === 'normal' && "text-green-600 border-green-600",
                      getBMICategory(calculatedBMI).status === 'warning' && "text-yellow-600 border-yellow-600",
                      getBMICategory(calculatedBMI).status === 'critical' && "text-destructive border-destructive"
                    )}
                  >
                    {getBMICategory(calculatedBMI).label}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Any additional observations or notes..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Vitals
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
