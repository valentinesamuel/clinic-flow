import { format } from 'date-fns';
import { 
  Activity, 
  AlertTriangle, 
  FileText, 
  Calendar,
  User
} from 'lucide-react';
import { Patient, QueueEntry } from '@/types/patient.types';
import { VitalSigns } from '@/types/clinical.types';
import { getConsultationsByPatient } from '@/data/consultations';

// Molecule components
import { PatientQuickInfo } from '@/components/molecules/patient/PatientQuickInfo';
import { PatientContact } from '@/components/molecules/patient/PatientContact';
import { PatientInsurance } from '@/components/molecules/patient/PatientInsurance';
import { PatientAllergyList } from '@/components/molecules/patient/PatientAllergyList';
import { PatientConditionList } from '@/components/molecules/patient/PatientConditionList';

// Other components
import { VitalSignsCard } from '@/components/clinical/VitalSignsCard';
import { PriorityBadge } from '@/components/atoms/display/PriorityBadge';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const recentConsultations = getConsultationsByPatient(patient.id).slice(0, 3);
  const hasAlerts = patient.allergies.length > 0 || patient.chronicConditions.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start gap-4">
            <PatientQuickInfo 
              patient={patient} 
              showBloodType 
              avatarSize="lg"
            />
            {queueEntry?.priority && queueEntry.priority !== 'normal' && (
              <PriorityBadge priority={queueEntry.priority} />
            )}
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
              <CardContent>
                <PatientContact patient={patient} />
              </CardContent>
            </Card>

            {/* Insurance Info */}
            <PatientInsurance patient={patient} />

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

            {/* Medical Alerts */}
            {hasAlerts && (
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
                      <PatientAllergyList allergies={patient.allergies} />
                    </div>
                  )}
                  {patient.chronicConditions.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Chronic Conditions</p>
                      <PatientConditionList conditions={patient.chronicConditions} />
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
