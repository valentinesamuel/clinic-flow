import { format } from 'date-fns';
import { 
  User, 
  Activity, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Droplets,
  CreditCard,
  X
} from 'lucide-react';
import { Patient, QueueEntry } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { calculateAge } from '@/data/patients';
import { getConsultationsByPatient } from '@/data/consultations';
import { VitalSignsCard } from '@/components/clinical/VitalSignsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PatientDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  queueEntry?: QueueEntry | null;
  vitals?: VitalSigns | null;
  onStartConsultation?: () => void;
  onViewFullProfile?: () => void;
  onComplete?: () => void;
}

export function PatientDrawer({
  open,
  onOpenChange,
  patient,
  queueEntry,
  vitals,
  onStartConsultation,
  onViewFullProfile,
  onComplete,
}: PatientDrawerProps) {
  if (!patient) return null;

  const age = calculateAge(patient.dateOfBirth);
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
  const recentConsultations = getConsultationsByPatient(patient.id).slice(0, 3);

  const priorityConfig = {
    normal: { label: 'Normal', variant: 'secondary' as const },
    high: { label: 'High Priority', variant: 'default' as const },
    emergency: { label: 'Emergency', variant: 'destructive' as const },
  };

  const priority = queueEntry?.priority
    ? priorityConfig[queueEntry.priority] 
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src={patient.photoUrl} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <SheetTitle className="text-xl">
                  {patient.firstName} {patient.lastName}
                </SheetTitle>
                {priority && (
                  <Badge variant={priority.variant} className="shrink-0">
                    {priority.variant === 'destructive' && (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {priority.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                {patient.mrn}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span>{age} years</span>
                <span>•</span>
                <span className="capitalize">{patient.gender}</span>
                {patient.bloodGroup && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {patient.bloodGroup}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-5">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {(patient.address || patient.lga) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {patient.lga && patient.state 
                        ? `${patient.lga}, ${patient.state}` 
                        : patient.address}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={patient.paymentType === 'hmo' ? 'default' : 'secondary'}>
                    {patient.paymentType === 'hmo' 
                      ? patient.hmoDetails?.providerName 
                      : patient.paymentType.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Reason for Visit */}
            {queueEntry && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Reason for Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{queueEntry.reasonForVisit}</p>
                  {queueEntry.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      {queueEntry.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Alerts */}
            {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    Medical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patient.allergies.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-1.5">
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
                      <p className="text-xs text-muted-foreground mb-2">Chronic Conditions</p>
                      <div className="flex flex-wrap gap-1.5">
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

            {/* Latest Vitals */}
            {vitals && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Latest Vitals
                    <span className="text-xs text-muted-foreground font-normal ml-auto">
                      {format(new Date(vitals.recordedAt), 'MMM d, h:mm a')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VitalSignsCard vitals={vitals} compact />
                </CardContent>
              </Card>
            )}

            {/* Recent Consultations */}
            {recentConsultations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Recent Visits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentConsultations.map(con => (
                      <div key={con.id} className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium text-sm">{con.diagnosis[0]}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(con.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t bg-muted/30 space-y-2">
          {queueEntry?.status === 'waiting' && onStartConsultation && (
            <Button className="w-full" size="lg" onClick={onStartConsultation}>
              <Activity className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
          )}
          {queueEntry?.status === 'in_progress' && (
            <>
              {onStartConsultation && (
                <Button className="w-full" size="lg" onClick={onStartConsultation}>
                  <FileText className="h-4 w-4 mr-2" />
                  Open Consultation
                </Button>
              )}
              {onComplete && (
                <Button variant="outline" className="w-full" onClick={onComplete}>
                  Complete & Discharge
                </Button>
              )}
            </>
          )}
          {onViewFullProfile && (
            <Button variant="outline" className="w-full" onClick={onViewFullProfile}>
              <User className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
