import { useState } from 'react';
import { Patient } from '@/types/patient.types';
import { calculateAge } from '@/utils/patientUtils';
import { useVitals } from '@/hooks/queries/useVitalQueries';
import { useConsultationsByPatient } from '@/hooks/queries/useConsultationQueries';
import { useAppointments } from '@/hooks/queries/useAppointmentQueries';
import { usePrescriptionsByPatient } from '@/hooks/queries/usePrescriptionQueries';
import { useLabOrdersByPatient } from '@/hooks/queries/useLabQueries';
import { useBills } from '@/hooks/queries/useBillQueries';
import { useStaff } from '@/hooks/queries/useStaffQueries';
import { VitalSigns, Consultation, Appointment, Prescription, LabOrder } from '@/types/clinical.types';
import { Bill } from '@/types/billing.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  CreditCard,
  AlertTriangle,
  Pill,
  Activity,
  FileText,
  Receipt,
  Edit,
  UserCheck,
  Copy,
  Check,
  Droplets,
  Heart,
  FlaskConical,
  Clock,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

// Clinical components
import { VitalSignsCard } from '@/components/clinical/VitalSignsCard';
import { VitalsEntryModal } from '@/components/clinical/VitalsEntryModal';
import { VitalsTrendChart } from '@/components/clinical/VitalsTrendChart';
import { ConsultationCard } from '@/components/clinical/ConsultationCard';
import { ActivityTimeline } from '@/components/patients/ActivityTimeline';
import { VitalSigns } from '@/types/clinical.types';

interface PatientProfileProps {
  patient: Patient;
  onEdit?: () => void;
  onCheckIn?: () => void;
  onBookAppointment?: () => void;
}

export function PatientProfile({
  patient,
  onEdit,
  onCheckIn,
  onBookAppointment,
}: PatientProfileProps) {
  const { toast } = useToast();
  const [copiedMrn, setCopiedMrn] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitals, setVitals] = useState<VitalSigns[]>([]);

  // Fetch data via hooks
  const { data: vitalsData = [] } = useVitals({ patientId: patient.id });
  const consultationsData = useConsultationsByPatient(patient.id);
  const consultations = (consultationsData.data || []) as Consultation[];
  const appointmentsData = useAppointments({ patientId: patient.id });
  const allAppointments = (appointmentsData.data || []) as Appointment[];
  const prescriptionsData = usePrescriptionsByPatient(patient.id);
  const prescriptions = (prescriptionsData.data || []) as Prescription[];
  const labOrdersData = useLabOrdersByPatient(patient.id);
  const labOrders = (labOrdersData.data || []) as LabOrder[];
  const billsData = useBills({ patientId: patient.id });
  const bills = (billsData.data || []) as Bill[];

  const age = calculateAge(patient.dateOfBirth);
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
  const genderIcon = patient.gender === 'male' ? '♂' : patient.gender === 'female' ? '♀' : '⚧';

  // Derived data
  const vitalsFromData = vitalsData as VitalSigns[];
  const latestVitals = vitalsFromData.length > 0 ? [...vitalsFromData].sort((a: VitalSigns, b: VitalSigns) =>
    new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  )[0] : null;
  const patientAppointments = allAppointments.filter((a: Appointment) => a.patientId === patient.id);
  const upcomingAppointments = patientAppointments.filter((a: Appointment) =>
    isAfter(new Date(`${a.scheduledDate}T${a.scheduledTime}`), new Date()) &&
    !['cancelled', 'completed'].includes(a.status)
  );
  const pastAppointments = patientAppointments.filter((a: Appointment) =>
    isBefore(new Date(`${a.scheduledDate}T${a.scheduledTime}`), new Date()) ||
    a.status === 'completed'
  );
  const activePrescriptions = prescriptions.filter((p: Prescription) => p.status === 'dispensed' || p.status === 'pending');
  const pendingLabs = labOrders.filter((l: LabOrder) => l.status !== 'completed' && l.status !== 'cancelled');
  const completedLabs = labOrders.filter((l: LabOrder) => l.status === 'completed');
  const outstandingBalance = bills.reduce((sum: number, b: Bill) => sum + (b.balance || 0), 0);

  const copyMrn = async (): Promise<void> => {
    await navigator.clipboard.writeText(patient.mrn);
    setCopiedMrn(true);
    toast({ title: 'Copied!', description: 'Patient number copied to clipboard.' });
    setTimeout(() => setCopiedMrn(false), 2000);
  };

  const handleVitalsRecorded = (newVitals: VitalSigns): void => {
    setVitals((prev: VitalSigns[]) => [newVitals, ...prev]);
  };

  const paymentBadgeVariant: Record<string, 'secondary' | 'default' | 'outline'> = {
    cash: 'secondary',
    hmo: 'default',
    corporate: 'outline',
  };

  const getStaffName = (staffId: string): string => {
    // In a real app, this would use the useStaff hook
    // For now, return a placeholder
    return 'Staff Member';
  };

  // Check for HMO expiry warning
  const hmoExpiryWarning = patient.hmoDetails?.expiryDate && 
    isBefore(new Date(patient.hmoDetails.expiryDate), addDays(new Date(), 30));

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Left Sidebar */}
      <div className="space-y-4">
        {/* Patient Summary Card */}
        <Card className="sticky top-4">
          <CardContent className="pt-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={patient.photoUrl} alt={`${patient.firstName} ${patient.lastName}`} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-mono text-sm text-muted-foreground">{patient.mrn}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyMrn}>
                {copiedMrn ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            
            <h2 className="text-xl font-bold mb-2">
              {patient.firstName} {patient.middleName ? `${patient.middleName} ` : ''}{patient.lastName}
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{age} years</span>
              <span>•</span>
              <span>{genderIcon} {patient.gender}</span>
              {patient.bloodGroup !== 'unknown' && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3 w-3" /> {patient.bloodGroup}
                  </span>
                </>
              )}
            </div>
            
            <Badge
              variant={paymentBadgeVariant[patient.paymentType] as 'secondary' | 'default' | 'outline'}
              className="mb-4"
            >
              {patient.paymentType === 'hmo' 
                ? patient.hmoDetails?.providerName 
                : patient.paymentType.toUpperCase()}
            </Badge>

            <Separator className="my-4" />

            {/* Quick Info */}
            <div className="space-y-3 text-left">
              <a href={`tel:${patient.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {patient.phone}
              </a>
              {patient.email && (
                <a href={`mailto:${patient.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {patient.email}
                </a>
              )}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{patient.address}, {patient.state}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Action Buttons */}
            <div className="space-y-2">
              {onBookAppointment && (
                <Button onClick={onBookAppointment} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              )}
              {onCheckIn && (
                <Button variant="outline" onClick={onCheckIn} className="w-full">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Check In
                </Button>
              )}
              {onEdit && (
                <Button variant="ghost" onClick={onEdit} className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Alerts */}
        {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Medical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.allergies.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Allergies</p>
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
                  <p className="text-xs font-medium text-muted-foreground mb-1">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.chronicConditions.map((condition, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Last Visit</p>
                      {consultations.length > 0 ? (
                        <>
                          <p className="text-lg font-semibold">
                            {format(new Date(consultations[0].createdAt), 'dd MMM yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(consultations[0].createdAt), { addSuffix: true })}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Never visited</p>
                      )}
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Next Appointment</p>
                      {upcomingAppointments.length > 0 ? (
                        <>
                          <p className="text-lg font-semibold">
                            {format(new Date(upcomingAppointments[0].scheduledDate), 'dd MMM')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {upcomingAppointments[0].scheduledTime} - {upcomingAppointments[0].doctorName}
                          </p>
                        </>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">None scheduled</p>
                          {onBookAppointment && (
                            <Button size="sm" variant="outline" onClick={onBookAppointment}>
                              <Plus className="h-3 w-3 mr-1" />
                              Book
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className={cn(outstandingBalance > 0 && "border-destructive/50")}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Outstanding Balance</p>
                      <p className={cn(
                        "text-lg font-semibold",
                        outstandingBalance > 0 && "text-destructive"
                      )}>
                        ₦{outstandingBalance.toLocaleString()}
                      </p>
                      {outstandingBalance > 0 && (
                        <Button size="sm" variant="outline" className="mt-2 text-xs">
                          Pay Now
                        </Button>
                      )}
                    </div>
                    <Receipt className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Activity Timeline */}
              <ActivityTimeline patientId={patient.id} limit={5} />

              {/* Information Cards */}
              <div className="space-y-4">
                {/* Contact Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <a href={`tel:${patient.phone}`} className="hover:text-primary">{patient.phone}</a>
                    </div>
                    {patient.altPhone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alt. Phone</span>
                        <a href={`tel:${patient.altPhone}`} className="hover:text-primary">{patient.altPhone}</a>
                      </div>
                    )}
                    {patient.email && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <a href={`mailto:${patient.email}`} className="hover:text-primary">{patient.email}</a>
                      </div>
                    )}
                    {patient.occupation && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Occupation</span>
                        <span>{patient.occupation}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Next of Kin */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span>{patient.nextOfKin.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Relationship</span>
                      <span>{patient.nextOfKin.relationship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <a href={`tel:${patient.nextOfKin.phone}`} className="hover:text-primary flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patient.nextOfKin.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance */}
                <Card className={cn(hmoExpiryWarning && "border-yellow-500/50")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment & Insurance
                      {hmoExpiryWarning && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-[10px]">
                          Expires Soon
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Type</span>
                      <Badge variant={paymentBadgeVariant[patient.paymentType] as 'secondary' | 'default' | 'outline'}>
                        {patient.paymentType.toUpperCase()}
                      </Badge>
                    </div>
                    {patient.hmoDetails && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Provider</span>
                          <span>{patient.hmoDetails.providerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Enrollment ID</span>
                          <span className="font-mono text-xs">{patient.hmoDetails.enrollmentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expiry</span>
                          <span className={cn(hmoExpiryWarning && "text-yellow-600 font-medium")}>
                            {format(new Date(patient.hmoDetails.expiryDate), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Co-pay</span>
                          <span>₦{patient.hmoDetails.copayAmount.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="history" className="space-y-4">
            {consultations.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Consultation History</h3>
                  <Badge variant="outline">{consultations.length} consultations</Badge>
                </div>
                <div className="space-y-4">
                  {consultations.map((consultation: Consultation, index: number) => (
                    <ConsultationCard
                      key={consultation.id}
                      consultation={consultation}
                      doctorName={getStaffName(consultation.doctorId)}
                      defaultExpanded={index === 0}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-1">No Consultations Yet</h3>
                  <p className="text-sm">Patient history will appear here after their first visit.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Vital Signs Tab */}
          <TabsContent value="vitals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Vital Signs</h3>
              <Button onClick={() => setShowVitalsModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
            </div>

            {latestVitals ? (
              <>
                <VitalSignsCard
                  vitals={latestVitals}
                  showRecordedBy
                  recordedByName={getStaffName(latestVitals.recordedBy)}
                />

                <VitalsTrendChart vitals={vitalsFromData} patientId={patient.id} />

                {/* Vitals History Table */}
                {vitalsFromData.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Vitals History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>BP</TableHead>
                            <TableHead>Temp</TableHead>
                            <TableHead>Pulse</TableHead>
                            <TableHead>O₂</TableHead>
                            <TableHead>BMI</TableHead>
                            <TableHead>Recorded By</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vitalsFromData.slice(0, 10).map((v: VitalSigns) => (
                            <TableRow key={v.id}>
                              <TableCell className="text-xs">
                                {format(new Date(v.recordedAt), 'dd MMM yyyy')}
                              </TableCell>
                              <TableCell>
                                {v.bloodPressureSystolic}/{v.bloodPressureDiastolic}
                              </TableCell>
                              <TableCell>{v.temperature}°C</TableCell>
                              <TableCell>{v.pulse} bpm</TableCell>
                              <TableCell>{v.oxygenSaturation}%</TableCell>
                              <TableCell>{v.bmi.toFixed(1)}</TableCell>
                              <TableCell className="text-xs">
                                {getStaffName(v.recordedBy)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-1">No Vital Signs Recorded</h3>
                  <p className="text-sm mb-4">Record the patient's first vital signs.</p>
                  <Button onClick={() => setShowVitalsModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Vitals
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            {upcomingAppointments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Upcoming Appointments</h4>
                {upcomingAppointments.map((apt: Appointment) => (
                  <Card key={apt.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{format(new Date(apt.scheduledDate), 'dd')}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(apt.scheduledDate), 'MMM')}</p>
                          </div>
                          <div>
                            <p className="font-medium">{apt.doctorName}</p>
                            <p className="text-sm text-muted-foreground">{apt.scheduledTime} • {apt.reasonForVisit}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {pastAppointments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Past Appointments</h4>
                {pastAppointments.slice(0, 5).map((apt: Appointment) => (
                  <Card key={apt.id} className="bg-muted/30">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">{format(new Date(apt.scheduledDate), 'dd MMM yyyy')} • {apt.doctorName}</p>
                          <p className="text-xs text-muted-foreground">{apt.reasonForVisit}</p>
                        </div>
                        <Badge variant="outline">{apt.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {patientAppointments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-1">No Appointments</h3>
                  <p className="text-sm mb-4">Schedule the patient's first appointment.</p>
                  {onBookAppointment && (
                    <Button onClick={onBookAppointment}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4">
            {activePrescriptions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Active Prescriptions</h4>
                {activePrescriptions.map((rx: Prescription) => (
                  <Card key={rx.id} className="border-l-4 border-l-green-500">
                    <CardContent className="py-4">
                      <div className="space-y-2">
                        {rx.items.map((item, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{item.drugName} {item.dosage}</p>
                              <p className="text-sm text-muted-foreground">{item.frequency} - {item.duration}</p>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                          </div>
                        ))}
                        <Separator />
                        <p className="text-xs text-muted-foreground">
                          Prescribed by {rx.doctorName} on {format(new Date(rx.prescribedAt), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {prescriptions.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-1">No Prescriptions</h3>
                  <p className="text-sm">Prescriptions will appear here after consultations.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Lab Results Tab */}
          <TabsContent value="lab" className="space-y-4">
            {pendingLabs.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Pending Tests
                </h4>
                {pendingLabs.map((lab: LabOrder) => (
                  <Card key={lab.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lab.tests.map(t => t.testName).join(', ')}</p>
                          <p className="text-sm text-muted-foreground">
                            Ordered {format(new Date(lab.orderedAt), 'dd MMM yyyy')} by {lab.doctorName}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          {lab.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {completedLabs.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Completed Results</h4>
                {completedLabs.map((lab: LabOrder) => (
                  <Card key={lab.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{lab.tests.map(t => t.testName).join(', ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(lab.completedAt || lab.orderedAt), 'dd MMM yyyy')}
                          </p>
                        </div>
                        <Badge variant="default">Completed</Badge>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Normal Range</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lab.tests.map((test, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{test.testName}</TableCell>
                              <TableCell className={cn(test.isAbnormal && "text-destructive font-medium")}>
                                {test.result} {test.unit}
                              </TableCell>
                              <TableCell className="text-muted-foreground">{test.normalRange}</TableCell>
                              <TableCell>
                                {test.isAbnormal ? (
                                  <Badge variant="destructive" className="text-xs">Abnormal</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">Normal</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {labOrders.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-1">No Lab Results</h3>
                  <p className="text-sm">Lab results will appear here when tests are ordered.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4">
            {outstandingBalance > 0 && (
              <Card className="border-destructive bg-destructive/5">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                      <p className="text-2xl font-bold text-destructive">₦{outstandingBalance.toLocaleString()}</p>
                    </div>
                    <Button>Pay Now</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {bills.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bills.map((bill: Bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-mono text-xs">{bill.billNumber}</TableCell>
                          <TableCell>{format(new Date(bill.createdAt), 'dd MMM yyyy')}</TableCell>
                          <TableCell>₦{bill.total.toLocaleString()}</TableCell>
                          <TableCell>₦{bill.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={bill.status === 'paid' ? 'default' : bill.status === 'partial' ? 'secondary' : 'outline'}
                              className={cn(
                                bill.status === 'pending' && "text-destructive border-destructive"
                              )}
                            >
                              {bill.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-1">No Billing History</h3>
                  <p className="text-sm">Invoices will appear here after services are rendered.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Vitals Entry Modal */}
      <VitalsEntryModal
        patientId={patient.id}
        patientName={`${patient.firstName} ${patient.lastName}`}
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        onSuccess={handleVitalsRecorded}
      />
    </div>
  );
}
