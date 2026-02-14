import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getPrescriptionById, dispensePrescription } from '@/data/prescriptions';
import { getPatientById } from '@/data/patients';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Pill,
  Send,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ArrowLeftRight,
  ClipboardList,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { getStaffById } from '@/data/staff';
import { DispensedItem, SubstitutionType } from '@/types/clinical.types';

type PrescriptionStatus = 'pending' | 'dispensed' | 'partially_dispensed' | 'cancelled';

interface DispenseFormItem {
  index: number;
  drugName: string;
  dosage: string;
  prescribedQuantity: number;
  dispenseQuantity: number;
  isSelected: boolean;
  isSubstituted: boolean;
  substitutedDrugName?: string;
  substitutionType?: SubstitutionType;
  substitutionReason?: string;
}

export default function PrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [refreshKey, setRefreshKey] = useState(0);
  const [showDispenseDialog, setShowDispenseDialog] = useState(false);
  const [showSubstituteDialog, setShowSubstituteDialog] = useState(false);
  const [substituteItemIndex, setSubstituteItemIndex] = useState<number | null>(null);
  const [dispenseFormItems, setDispenseFormItems] = useState<DispenseFormItem[]>([]);
  const [pharmacistNotes, setPharmacistNotes] = useState('');

  // Substitution form state
  const [substitutionType, setSubstitutionType] = useState<SubstitutionType>('generic');
  const [substituteDrugName, setSubstituteDrugName] = useState('');
  const [substitutionReason, setSubstitutionReason] = useState('');
  const [substitutePharmacistNotes, setSubstitutePharmacistNotes] = useState('');

  const prescription = useMemo(() => {
    return id ? getPrescriptionById(id) : null;
  }, [id, refreshKey]);

  const patient = prescription ? getPatientById(prescription.patientId) : null;
  const doctorName = prescription?.doctorName ?? 'Unknown';

  const basePath = user
    ? user.role === 'hospital_admin'
      ? '/hospital-admin'
      : user.role === 'clinical_lead'
      ? '/clinical-lead'
      : `/${user.role}`
    : '';

  const handleBack = () => {
    navigate(`${basePath}/prescriptions`);
  };

  const handleDispenseClick = () => {
    if (!prescription) return;

    // Initialize form items
    const formItems: DispenseFormItem[] = prescription.items.map((item, index) => ({
      index,
      drugName: item.drugName,
      dosage: item.dosage,
      prescribedQuantity: item.quantity,
      dispenseQuantity: item.quantity,
      isSelected: true,
      isSubstituted: false,
    }));

    setDispenseFormItems(formItems);
    setPharmacistNotes('');
    setShowDispenseDialog(true);
  };

  const handleSubstituteClick = (index: number) => {
    setSubstituteItemIndex(index);
    setSubstitutionType('generic');
    setSubstituteDrugName('');
    setSubstitutionReason('');
    setSubstitutePharmacistNotes('');
    setShowSubstituteDialog(true);
  };

  const handleConfirmSubstitution = () => {
    if (!substituteDrugName.trim() || !substitutionReason.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (substituteItemIndex !== null) {
      setDispenseFormItems((items) =>
        items.map((item, idx) =>
          idx === substituteItemIndex
            ? {
                ...item,
                isSubstituted: true,
                substitutedDrugName: substituteDrugName,
                substitutionType,
                substitutionReason,
              }
            : item
        )
      );
    }

    setShowSubstituteDialog(false);
    toast({
      title: 'Substitution Recorded',
      description: `${substituteDrugName} will be dispensed instead.`,
    });
  };

  const handleDispense = (dispenseAll: boolean) => {
    if (!prescription || !user) return;

    const itemsToDispense = dispenseAll
      ? dispenseFormItems.map((item) => ({ ...item, isSelected: true, dispenseQuantity: item.prescribedQuantity }))
      : dispenseFormItems.filter((item) => item.isSelected);

    if (itemsToDispense.length === 0) {
      toast({
        title: 'No Items Selected',
        description: 'Please select at least one item to dispense.',
        variant: 'destructive',
      });
      return;
    }

    const dispensedItems: DispensedItem[] = itemsToDispense.map((item) => ({
      drugName: item.drugName,
      dispensedDrugName: item.isSubstituted ? item.substitutedDrugName : undefined,
      substitutionType: item.isSubstituted ? item.substitutionType : undefined,
      substitutionReason: item.isSubstituted ? item.substitutionReason : undefined,
      pharmacistNotes: pharmacistNotes || undefined,
      prescribedQuantity: item.prescribedQuantity,
      dispensedQuantity: item.dispenseQuantity,
      isSubstituted: item.isSubstituted,
    }));

    const result = dispensePrescription(prescription.id, dispensedItems, user.id, user.name);

    if (result) {
      setRefreshKey((k) => k + 1);
      setShowDispenseDialog(false);
      toast({
        title: 'Prescription Dispensed',
        description: `Successfully dispensed ${dispensedItems.length} item(s).`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to dispense prescription.',
        variant: 'destructive',
      });
    }
  };

  const getStatusVariant = (status: PrescriptionStatus): 'default' | 'secondary' | 'success' | 'destructive' => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'dispensed':
        return 'success';
      case 'partially_dispensed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: PrescriptionStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'dispensed':
        return 'Dispensed';
      case 'partially_dispensed':
        return 'Partially Dispensed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (!prescription || !patient) {
    return (
      <DashboardLayout allowedRoles={['doctor', 'pharmacist', 'cmo', 'hospital_admin', 'cashier', 'receptionist']}>
        <div className="space-y-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prescriptions
          </Button>
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Prescription not found</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const pharmacist = prescription.dispensedBy ? getStaffById(prescription.dispensedBy) : null;
  const isPharmacist = user?.role === 'pharmacist';
  const canDispense = isPharmacist && (prescription.status === 'pending' || prescription.status === 'partially_dispensed');
  const isDispensed = prescription.status === 'dispensed' || prescription.status === 'partially_dispensed';

  return (
    <DashboardLayout allowedRoles={['doctor', 'pharmacist']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Prescription Details</h1>
              <p className="text-muted-foreground">Prescription ID: {prescription.id}</p>
            </div>
          </div>
          {canDispense && (
            <Button onClick={handleDispenseClick}>
              <Pill className="w-4 h-4 mr-2" />
              Dispense
            </Button>
          )}
        </div>

        {/* Patient and Prescription Info */}
        <div className={`grid grid-cols-1 ${pharmacist ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRN</p>
                <p className="font-medium">{patient.mrn}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">
                  {format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Prescription Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Prescribing Doctor</p>
                <p className="font-medium">{doctorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Prescribed</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(prescription.prescribedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(prescription.status)}>
                    {getStatusLabel(prescription.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="font-medium">
                  {prescription.items.reduce((sum, item) => sum + item.quantity, 0)} units
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dispensing Pharmacist */}
          {pharmacist && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Dispensing Pharmacist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{pharmacist.name}</p>
                </div>
                {pharmacist.licenseNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">License Number</p>
                    <p className="font-medium">{pharmacist.licenseNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{pharmacist.department}</p>
                </div>
                {prescription.dispensedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dispensed At</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(prescription.dispensedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Prescription Items */}
        <Card>
          <CardHeader>
            <CardTitle>Prescribed Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Prescribed Qty</TableHead>
                    {isDispensed && <TableHead className="text-right">Dispensed Qty</TableHead>}
                    {isDispensed && <TableHead>Substituted</TableHead>}
                    <TableHead>Instructions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescription.items.map((item, index) => {
                    const dispensedItem = prescription.dispensedItems?.find((di) => di.drugName === item.drugName);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.drugName}</TableCell>
                        <TableCell>{item.dosage}</TableCell>
                        <TableCell>{item.frequency}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        {isDispensed && (
                          <TableCell className="text-right">
                            {dispensedItem?.dispensedQuantity ?? '-'}
                          </TableCell>
                        )}
                        {isDispensed && (
                          <TableCell>
                            {dispensedItem?.isSubstituted ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <ArrowLeftRight className="w-3 h-3 mr-1" />
                                  {dispensedItem.dispensedDrugName}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="max-w-[300px]">
                          {item.instructions || (
                            <span className="text-muted-foreground italic">No special instructions</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {prescription.notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-medium mb-2">Additional Notes</h3>
                  <p className="text-sm text-muted-foreground">{prescription.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Audit Trail */}
        {prescription.auditLog && prescription.auditLog.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Dispensing Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {prescription.auditLog.map((entry, index) => {
                  const Icon =
                    entry.action === 'dispensed'
                      ? Pill
                      : entry.action === 'substituted'
                      ? ArrowLeftRight
                      : entry.action === 'partially_dispensed'
                      ? AlertCircle
                      : XCircle;

                  const isLast = index === prescription.auditLog!.length - 1;

                  return (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-medium">
                          {entry.action.charAt(0).toUpperCase() +
                            entry.action.slice(1).replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">{entry.details}</p>
                        <p className="text-xs text-muted-foreground">
                          by {entry.performedByName} at {format(new Date(entry.performedAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {(() => {
                const events = [];
                const prescribedDate = new Date(prescription.prescribedAt);
                const sentToPharmacyDate = new Date(prescribedDate.getTime() + 5 * 60 * 1000);

                // 1. Prescribed - always present
                events.push({
                  title: 'Prescribed',
                  timestamp: prescribedDate,
                  icon: FileText,
                  completed: true,
                  actor: `by ${doctorName}`,
                });

                // 2. Sent to Pharmacy - always present
                events.push({
                  title: 'Sent to Pharmacy',
                  timestamp: sentToPharmacyDate,
                  icon: Send,
                  completed: true,
                });

                // 3. Dispensing Started - if dispensed or partially dispensed
                if (prescription.status === 'dispensed' || prescription.status === 'partially_dispensed') {
                  const dispensedDate = new Date(prescription.dispensedAt!);
                  const dispensingStartedDate = new Date(dispensedDate.getTime() - 10 * 60 * 1000);

                  events.push({
                    title: 'Dispensing Started',
                    timestamp: dispensingStartedDate,
                    icon: Pill,
                    completed: true,
                  });

                  // 4. Dispensed or Partially Dispensed
                  events.push({
                    title: prescription.status === 'partially_dispensed' ? 'Partially Dispensed' : 'Dispensed',
                    timestamp: dispensedDate,
                    icon: CheckCircle,
                    completed: true,
                  });
                } else if (prescription.status === 'cancelled') {
                  // 5. Cancelled
                  events.push({
                    title: 'Cancelled',
                    timestamp: new Date(), // Using current time as we don't have cancelledAt
                    icon: XCircle,
                    completed: true,
                  });
                }

                return events.map((event, index) => {
                  const Icon = event.icon;
                  const isLast = index === events.length - 1;

                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-2 rounded-full ${
                            event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.timestamp, 'MMM dd, yyyy HH:mm')}
                        </p>
                        {event.actor && <p className="text-xs text-muted-foreground">{event.actor}</p>}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {!isPharmacist && (
            <p className="text-sm text-muted-foreground flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Read-only view
            </p>
          )}
        </div>
      </div>

      {/* Dispense Dialog */}
      <Dialog open={showDispenseDialog} onOpenChange={setShowDispenseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dispense Prescription</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Patient Info */}
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="font-medium">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-sm text-muted-foreground">MRN: {patient.mrn}</p>
            </div>

            {/* Items to Dispense */}
            <div className="space-y-3">
              {dispenseFormItems.map((item, index) => (
                <div key={index} className="border p-4 rounded-md space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={item.isSelected}
                      onCheckedChange={(checked) =>
                        setDispenseFormItems((items) =>
                          items.map((i, idx) => (idx === index ? { ...i, isSelected: checked === true } : i))
                        )
                      }
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {item.isSubstituted ? (
                              <>
                                <span className="line-through text-muted-foreground">{item.drugName}</span>
                                <ArrowLeftRight className="inline w-4 h-4 mx-2" />
                                <span>{item.substitutedDrugName}</span>
                                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                                  Swapped
                                </Badge>
                              </>
                            ) : (
                              item.drugName
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.dosage}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleSubstituteClick(index)}>
                          Substitute
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label className="text-sm text-muted-foreground">
                            Prescribed: {item.prescribedQuantity}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`qty-${index}`} className="text-sm">
                            Dispense:
                          </Label>
                          <Input
                            id={`qty-${index}`}
                            type="number"
                            min={0}
                            max={item.prescribedQuantity}
                            value={item.dispenseQuantity}
                            onChange={(e) =>
                              setDispenseFormItems((items) =>
                                items.map((i, idx) =>
                                  idx === index
                                    ? { ...i, dispenseQuantity: parseInt(e.target.value) || 0 }
                                    : i
                                )
                              )
                            }
                            className="w-24"
                          />
                        </div>
                      </div>

                      {item.isSubstituted && (
                        <div className="bg-blue-50 p-3 rounded text-sm space-y-1">
                          <p>
                            <span className="font-medium">Type:</span>{' '}
                            {item.substitutionType === 'generic' ? 'Generic' : 'Therapeutic'}
                          </p>
                          <p>
                            <span className="font-medium">Reason:</span> {item.substitutionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pharmacist Notes */}
            <div className="space-y-2">
              <Label htmlFor="pharmacist-notes">Pharmacist Notes (Optional)</Label>
              <Textarea
                id="pharmacist-notes"
                placeholder="Add any additional notes..."
                value={pharmacistNotes}
                onChange={(e) => setPharmacistNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDispenseDialog(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => handleDispense(false)}>
              Dispense Selected
            </Button>
            <Button onClick={() => handleDispense(true)}>Dispense All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Substitution Dialog */}
      <Dialog open={showSubstituteDialog} onOpenChange={setShowSubstituteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Drug Substitution —{' '}
              {substituteItemIndex !== null ? dispenseFormItems[substituteItemIndex]?.drugName : ''}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Substitution Type */}
            <div className="space-y-3">
              <Label>Substitution Type</Label>
              <RadioGroup value={substitutionType} onValueChange={(v) => setSubstitutionType(v as SubstitutionType)}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="generic" id="generic" />
                  <div className="flex-1">
                    <Label htmlFor="generic" className="font-medium cursor-pointer">
                      Generic
                    </Label>
                    <p className="text-sm text-muted-foreground">Same active ingredient, different brand</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="therapeutic" id="therapeutic" />
                  <div className="flex-1">
                    <Label htmlFor="therapeutic" className="font-medium cursor-pointer">
                      Therapeutic
                    </Label>
                    <p className="text-sm text-muted-foreground">Different drug, same therapeutic class</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Substitute Drug Name */}
            <div className="space-y-2">
              <Label htmlFor="substitute-drug-name">
                Substitute Drug Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="substitute-drug-name"
                placeholder="Enter substitute drug name"
                value={substituteDrugName}
                onChange={(e) => setSubstituteDrugName(e.target.value)}
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="substitution-reason">
                Reason for Substitution <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="substitution-reason"
                placeholder="Explain why this substitution is necessary..."
                value={substitutionReason}
                onChange={(e) => setSubstitutionReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Pharmacist Notes */}
            <div className="space-y-2">
              <Label htmlFor="substitute-pharmacist-notes">Pharmacist Notes (Optional)</Label>
              <Textarea
                id="substitute-pharmacist-notes"
                placeholder="Add any additional notes..."
                value={substitutePharmacistNotes}
                onChange={(e) => setSubstitutePharmacistNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubstituteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubstitution}>Confirm Substitution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
