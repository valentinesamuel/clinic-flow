import { Episode, EpisodeTimelineEvent } from '@/types/episode.types';
import { getTimelineForEpisode } from '@/data/episodes';
import { EpisodeBadge } from '@/components/atoms/display/EpisodeBadge';
import { EpisodeTimerBadge } from '@/components/atoms/display/EpisodeTimerBadge';
import { EpisodeTimeline } from '@/components/billing/molecules/episode/EpisodeTimeline';
import { EpisodeSummaryCard } from '@/components/billing/molecules/episode/EpisodeSummaryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Receipt,
  Stethoscope,
  FlaskConical,
  Pill,
  FileCheck,
  Lock,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import { format } from 'date-fns';

interface EpisodeDetailViewProps {
  episode: Episode;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EpisodeDetailView({ episode }: EpisodeDetailViewProps) {
  const timeline = getTimelineForEpisode(episode.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-2xl">{episode.patientName}</CardTitle>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-sm text-muted-foreground">
                  {episode.episodeNumber}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  MRN: {episode.patientMrn}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <EpisodeBadge status={episode.status} />
                <EpisodeTimerBadge episode={episode} />
                {episode.isLockedForAudit && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Locked
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-right">
                Created {format(new Date(episode.createdAt), 'dd MMM yyyy, h:mm a')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Financial Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Billed</p>
              <p className="text-2xl font-bold">{formatCurrency(episode.totalBilled)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(episode.totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p
                className={`text-2xl font-bold ${
                  episode.totalBalance > 0 ? 'text-destructive' : 'text-green-600'
                }`}
              >
                {formatCurrency(episode.totalBalance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Section */}
      {(episode.provisionalDiagnosis || episode.finalDiagnosis) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Diagnosis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {episode.provisionalDiagnosis && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Provisional Diagnosis
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm">{episode.provisionalDiagnosis}</p>
                  {episode.provisionalDiagnosisCode && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {episode.provisionalDiagnosisCode}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {episode.finalDiagnosis && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Final Diagnosis
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm">{episode.finalDiagnosis}</p>
                  {episode.finalDiagnosisCode && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {episode.finalDiagnosisCode}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Tabbed Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Episode Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bills" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="bills" className="text-xs">
                    Bills
                  </TabsTrigger>
                  <TabsTrigger value="consultations" className="text-xs">
                    Consults
                  </TabsTrigger>
                  <TabsTrigger value="lab" className="text-xs">
                    Lab
                  </TabsTrigger>
                  <TabsTrigger value="pharmacy" className="text-xs">
                    Pharmacy
                  </TabsTrigger>
                  <TabsTrigger value="claims" className="text-xs">
                    Claims
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bills" className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Receipt className="h-4 w-4" />
                    <span>
                      {episode.billIds.length}{' '}
                      {episode.billIds.length === 1 ? 'Bill' : 'Bills'}
                    </span>
                  </div>
                  {episode.billIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No bills found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {episode.billIds.map((billId) => (
                        <div
                          key={billId}
                          className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                        >
                          <p className="text-sm font-medium font-mono">{billId}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="consultations" className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Stethoscope className="h-4 w-4" />
                    <span>
                      {episode.consultationIds.length}{' '}
                      {episode.consultationIds.length === 1
                        ? 'Consultation'
                        : 'Consultations'}
                    </span>
                  </div>
                  {episode.consultationIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No consultations found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {episode.consultationIds.map((consultId) => (
                        <div
                          key={consultId}
                          className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                        >
                          <p className="text-sm font-medium font-mono">{consultId}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="lab" className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <FlaskConical className="h-4 w-4" />
                    <span>
                      {episode.labOrderIds.length}{' '}
                      {episode.labOrderIds.length === 1 ? 'Lab Order' : 'Lab Orders'}
                    </span>
                  </div>
                  {episode.labOrderIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No lab orders found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {episode.labOrderIds.map((labId) => (
                        <div
                          key={labId}
                          className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                        >
                          <p className="text-sm font-medium font-mono">{labId}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pharmacy" className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Pill className="h-4 w-4" />
                    <span>
                      {episode.prescriptionIds.length}{' '}
                      {episode.prescriptionIds.length === 1
                        ? 'Prescription'
                        : 'Prescriptions'}
                    </span>
                  </div>
                  {episode.prescriptionIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No prescriptions found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {episode.prescriptionIds.map((prescId) => (
                        <div
                          key={prescId}
                          className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                        >
                          <p className="text-sm font-medium font-mono">{prescId}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="claims" className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <FileCheck className="h-4 w-4" />
                    <span>
                      {episode.claimIds.length}{' '}
                      {episode.claimIds.length === 1 ? 'Claim' : 'Claims'}
                    </span>
                  </div>
                  {episode.claimIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No claims found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {episode.claimIds.map((claimId) => (
                        <div
                          key={claimId}
                          className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                        >
                          <p className="text-sm font-medium font-mono">{claimId}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Notes Section */}
          {episode.notes && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {episode.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Follow-up Info */}
          {episode.followUpScheduled && episode.followUpDate && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Follow-up Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(episode.followUpDate), 'EEEE, dd MMM yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(episode.followUpDate), 'h:mm a')}
                    </p>
                  </div>
                  {episode.followUpUsed && (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar - Timeline */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <EpisodeTimeline events={timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
