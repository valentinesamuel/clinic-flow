// TriagePanel - Nurse triage form with vitals entry

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { User, AlertTriangle, Heart, Thermometer, Activity, Wind, Droplets, Scale, Ruler, Save } from 'lucide-react';
import { QueueEntry, Patient, QueuePriority } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { usePatient } from '@/hooks/queries/usePatientQueries';
import { useVitalsByPatient } from '@/hooks/queries/useVitalQueries';
import { useCreateVitals } from '@/hooks/mutations/useVitalMutations';
import { useUpdateQueueEntry } from '@/hooks/mutations/useQueueMutations';
import { useDoctors } from '@/hooks/queries/useStaffQueries';
import { isVitalAbnormal, calculateBMI, getBMICategory } from '@/utils/vitalUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface TriagePanelProps {
  entry: QueueEntry;
  onComplete: () => void;
  onCancel: () => void;
}

interface VitalsFormData {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  temperature: string;
  pulse: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
}

const initialVitals: VitalsFormData = {
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  temperature: '',
  pulse: '',
  respiratoryRate: '',
  oxygenSaturation: '',
  weight: '',
  height: '',
};

export function TriagePanel({ entry, onComplete, onCancel }: TriagePanelProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<VitalsFormData>(initialVitals);
  const [chiefComplaint, setChiefComplaint] = useState(entry.reasonForVisit);
  const [symptomDuration, setSymptomDuration] = useState('');
  const [painScale, setPainScale] = useState<string>('');
  const [priority, setPriority] = useState<QueuePriority>(entry.priority);
  const [priorityReason, setPriorityReason] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('usr-004');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousVitals, setPreviousVitals] = useState<VitalSigns[]>([]);

  const { data: patientData } = usePatient(entry.patientId);
  const { data: vitalsHistory } = useVitalsByPatient(entry.patientId);
  const { data: doctorsData } = useDoctors();
  const createVitals = useCreateVitals();
  const updateQueue = useUpdateQueueEntry();

  const doctors = doctorsData ?? [];

  // Load patient data
  useEffect(() => {
    setPatient(patientData || null);

    if (patientData && vitalsHistory) {
      const history = vitalsHistory.sort((a, b) =>
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      );
      setPreviousVitals(history);

      // Pre-fill height from previous if available
      if (history.length > 0) {
        setVitals(prev => ({
          ...prev,
          height: String(history[0].height),
        }));
      }
    }
  }, [patientData, vitalsHistory]);

  // Calculate BMI if weight and height are provided
  const bmi = vitals.weight && vitals.height 
    ? calculateBMI(parseFloat(vitals.weight), parseFloat(vitals.height))
    : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  // Check for abnormal values
  const getAbnormalStatus = (field: string, value: string) => {
    if (!value) return null;
    return isVitalAbnormal(field, parseFloat(value));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!vitals.bloodPressureSystolic || !vitals.bloodPressureDiastolic ||
        !vitals.temperature || !vitals.pulse || !vitals.respiratoryRate ||
        !vitals.oxygenSaturation || !vitals.weight || !vitals.height) {
      toast({
        title: 'Missing Vitals',
        description: 'Please fill in all vital signs before completing triage.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save vitals
      await createVitals.mutateAsync({
        patientId: entry.patientId,
        recordedBy: user?.id || 'usr-005',
        recordedAt: new Date().toISOString(),
        bloodPressureSystolic: parseFloat(vitals.bloodPressureSystolic),
        bloodPressureDiastolic: parseFloat(vitals.bloodPressureDiastolic),
        temperature: parseFloat(vitals.temperature),
        pulse: parseFloat(vitals.pulse),
        respiratoryRate: parseFloat(vitals.respiratoryRate),
        oxygenSaturation: parseFloat(vitals.oxygenSaturation),
        weight: parseFloat(vitals.weight),
        height: parseFloat(vitals.height),
        bmi: bmi || 0,
        notes: notes || undefined,
      });

      // Update queue entry
      await updateQueue.mutateAsync({
        id: entry.id,
        updates: {
          priority,
          status: 'waiting',
          queueType: 'doctor',
          assignedTo: selectedDoctor,
        },
      });

      toast({
        title: 'Triage Complete',
        description: `${entry.patientName} has been moved to the doctor queue.`,
      });

      onComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete triage. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel - Patient Context */}
      <div className="lg:w-1/3 space-y-4">
        {/* Patient Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{entry.patientName}</h3>
                <p className="text-sm text-muted-foreground">{entry.patientMrn}</p>
              </div>
            </div>

            {patient && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="capitalize">{patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Group:</span>
                  <span>{patient.bloodGroup}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Allergies & Conditions */}
        {patient && (patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {patient.allergies.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">Allergies:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {patient.chronicConditions.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Chronic Conditions:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.chronicConditions.map((condition, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Previous Vitals */}
        {previousVitals.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Previous Vitals</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-xs text-muted-foreground mb-2">
                {format(new Date(previousVitals[0].recordedAt), 'MMM d, yyyy HH:mm')}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>BP: {previousVitals[0].bloodPressureSystolic}/{previousVitals[0].bloodPressureDiastolic}</div>
                <div>Temp: {previousVitals[0].temperature}°C</div>
                <div>Pulse: {previousVitals[0].pulse}</div>
                <div>O₂: {previousVitals[0].oxygenSaturation}%</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Panel - Triage Form */}
      <div className="lg:w-2/3">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Vital Signs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Blood Pressure */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-destructive" />
                      Systolic (mmHg)
                    </Label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={vitals.bloodPressureSystolic}
                      onChange={(e) => setVitals(v => ({ ...v, bloodPressureSystolic: e.target.value }))}
                      className={cn(
                        'mt-1',
                        getAbnormalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic)?.abnormal && 'border-destructive'
                      )}
                    />
                  </div>
                  <div>
                    <Label>Diastolic (mmHg)</Label>
                    <Input
                      type="number"
                      placeholder="80"
                      value={vitals.bloodPressureDiastolic}
                      onChange={(e) => setVitals(v => ({ ...v, bloodPressureDiastolic: e.target.value }))}
                      className={cn(
                        'mt-1',
                        getAbnormalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic)?.abnormal && 'border-destructive'
                      )}
                    />
                  </div>
                </div>

                {/* Temperature & Pulse */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      Temperature (°C)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={vitals.temperature}
                      onChange={(e) => setVitals(v => ({ ...v, temperature: e.target.value }))}
                      className={cn(
                        'mt-1',
                        getAbnormalStatus('temperature', vitals.temperature)?.abnormal && 'border-destructive'
                      )}
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Pulse (bpm)
                    </Label>
                    <Input
                      type="number"
                      placeholder="72"
                      value={vitals.pulse}
                      onChange={(e) => setVitals(v => ({ ...v, pulse: e.target.value }))}
                      className={cn(
                        'mt-1',
                        getAbnormalStatus('pulse', vitals.pulse)?.abnormal && 'border-destructive'
                      )}
                    />
                  </div>
                </div>

                {/* Respiratory Rate & O2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      Respiratory Rate
                    </Label>
                    <Input
                      type="number"
                      placeholder="16"
                      value={vitals.respiratoryRate}
                      onChange={(e) => setVitals(v => ({ ...v, respiratoryRate: e.target.value }))}
                      className={cn(
                        'mt-1',
                        getAbnormalStatus('respiratoryRate', vitals.respiratoryRate)?.abnormal && 'border-destructive'
                      )}
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      O₂ Saturation (%)
                    </Label>
                    <Input
                      type="number"
                      placeholder="98"
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals(v => ({ ...v, oxygenSaturation: e.target.value }))}
                      className={cn(
                        'mt-1',
                        getAbnormalStatus('oxygenSaturation', vitals.oxygenSaturation)?.abnormal && 'border-destructive'
                      )}
                    />
                  </div>
                </div>

                {/* Weight & Height */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Weight (kg)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="70"
                      value={vitals.weight}
                      onChange={(e) => setVitals(v => ({ ...v, weight: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Height (cm)
                    </Label>
                    <Input
                      type="number"
                      placeholder="170"
                      value={vitals.height}
                      onChange={(e) => setVitals(v => ({ ...v, height: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>BMI</Label>
                    <div className="mt-1 h-10 flex items-center px-3 rounded-md border bg-muted">
                      {bmi ? (
                        <span className={cn(
                          'font-medium',
                          bmiCategory === 'Underweight' && 'text-amber-600',
                          bmiCategory === 'Normal' && 'text-green-600',
                          bmiCategory === 'Overweight' && 'text-amber-600',
                          bmiCategory === 'Obese' && 'text-destructive'
                        )}>
                          {bmi.toFixed(1)} ({bmiCategory})
                        </span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chief Complaint */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Chief Complaint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Presenting Complaint</Label>
                  <Textarea
                    placeholder="Describe the patient's main complaint..."
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Symptom Duration</Label>
                    <Select value={symptomDuration} onValueChange={setSymptomDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1h">Less than 1 hour</SelectItem>
                        <SelectItem value="1-6h">1-6 hours</SelectItem>
                        <SelectItem value="6-24h">6-24 hours</SelectItem>
                        <SelectItem value="1-3d">1-3 days</SelectItem>
                        <SelectItem value="3-7d">3-7 days</SelectItem>
                        <SelectItem value=">7d">More than 7 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pain Scale (0-10)</Label>
                    <Select value={painScale} onValueChange={setPainScale}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority & Assignment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Priority & Queue Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority Level</Label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as QueuePriority)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Assign to Doctor</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {priority !== 'normal' && (
                  <div>
                    <Label>Priority Reason</Label>
                    <Input
                      placeholder="Reason for priority elevation..."
                      value={priorityReason}
                      onChange={(e) => setPriorityReason(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label>Notes for Doctor (Optional)</Label>
                  <Textarea
                    placeholder="Additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pb-4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Completing...' : 'Complete Triage'}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
