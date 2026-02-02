import { useState } from 'react';
import { Patient } from '@/types/patient.types';
import { calculateAge } from '@/data/patients';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  
  const age = calculateAge(patient.dateOfBirth);
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
  const genderIcon = patient.gender === 'male' ? '♂' : patient.gender === 'female' ? '♀' : '⚧';

  const copyMrn = async () => {
    await navigator.clipboard.writeText(patient.mrn);
    setCopiedMrn(true);
    toast({ title: 'Copied!', description: 'Patient number copied to clipboard.' });
    setTimeout(() => setCopiedMrn(false), 2000);
  };

  const paymentBadgeVariant = {
    cash: 'secondary',
    hmo: 'default',
    corporate: 'outline',
  } as const;

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
                  <Check className="h-3 w-3 text-green-500" />
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
              variant={paymentBadgeVariant[patient.paymentType]}
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
          <Card className="border-destructive/50 bg-destructive/10">
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
            <div className="grid gap-4 md:grid-cols-2">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{patient.phone}</span>
                  </div>
                  {patient.altPhone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alt. Phone</span>
                      <span>{patient.altPhone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{patient.email}</span>
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

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{patient.address}</p>
                  <p>{patient.lga}, {patient.state}</p>
                  <p>{patient.nationality}</p>
                </CardContent>
              </Card>

              {/* Next of Kin */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Next of Kin
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
                    <a href={`tel:${patient.nextOfKin.phone}`} className="hover:text-primary">
                      {patient.nextOfKin.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment & Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Type</span>
                    <Badge variant={paymentBadgeVariant[patient.paymentType]}>
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
                        <span>{format(new Date(patient.hmoDetails.expiryDate), 'dd/MM/yyyy')}</span>
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

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs - Placeholders */}
          <TabsContent value="history">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-1">Medical History</h3>
                <p className="text-sm">No consultations recorded yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-1">Vital Signs</h3>
                <p className="text-sm">No vital signs recorded yet.</p>
                <Button variant="outline" className="mt-4">
                  Record Vitals
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-1">Appointments</h3>
                <p className="text-sm">No appointments scheduled.</p>
                {onBookAppointment && (
                  <Button onClick={onBookAppointment} className="mt-4">
                    Schedule Appointment
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-1">Prescriptions</h3>
                <p className="text-sm">No prescriptions found.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-1">Lab Results</h3>
                <p className="text-sm">No lab results available.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-1">Billing</h3>
                <p className="text-sm">No billing history.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
