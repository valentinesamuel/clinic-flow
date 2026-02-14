import { useState } from 'react';
import { Episode } from '@/types/episode.types';
import { getTimelineForEpisode, updateEpisode, completeEpisode } from '@/data/episodes';
import { getBillById } from '@/data/bills';
import { getConsultationById } from '@/data/consultations';
import { getLabOrderById } from '@/data/lab-orders';
import { getPrescriptionById } from '@/data/prescriptions';
import { getClaimById } from '@/data/claims';
import { EpisodeBadge } from '@/components/atoms/display/EpisodeBadge';
import { EpisodeTimerBadge } from '@/components/atoms/display/EpisodeTimerBadge';
import { EpisodeTimeline } from '@/components/billing/molecules/episode/EpisodeTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ExternalLink,
  Edit2,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [billDrawerOpen, setBillDrawerOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    notes: episode.notes || '',
    provisionalDiagnosis: episode.provisionalDiagnosis || '',
    finalDiagnosis: episode.finalDiagnosis || '',
  });

  const basePath = user
    ? user.role === 'hospital_admin'
      ? '/hospital-admin'
      : user.role === 'clinical_lead'
        ? '/clinical-lead'
        : user.role === 'lab_tech'
          ? '/lab-tech'
          : `/${user.role}`
    : '';

  const handleEditEpisode = () => {
    updateEpisode(episode.id, editForm);
    toast({
      title: 'Episode Updated',
      description: 'Episode has been updated successfully.',
    });
    setShowEditDialog(false);
  };

  const handleCompleteEpisode = () => {
    completeEpisode(episode.id);
    toast({
      title: 'Episode Completed',
      description: 'Episode has been marked as completed.',
    });
    setShowCompleteDialog(false);
  };

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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditForm({
                      notes: episode.notes || '',
                      provisionalDiagnosis: episode.provisionalDiagnosis || '',
                      finalDiagnosis: episode.finalDiagnosis || '',
                    });
                    setShowEditDialog(true);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Episode
                </Button>
                {(episode.status === 'active' || episode.status === 'pending_results') && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowCompleteDialog(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Episode
                  </Button>
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
                      {episode.billIds.map((billId) => {
                        const bill = getBillById(billId);
                        return (
                          <div
                            key={billId}
                            className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{bill?.billNumber || billId}</p>
                                {bill && (
                                  <p className="text-xs text-muted-foreground">
                                    {bill.items.length} items • {bill.department}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {bill && (
                                  <>
                                    <Badge variant="outline" className="text-xs">{bill.status}</Badge>
                                    <span className="text-sm font-medium">{formatCurrency(bill.total)}</span>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedBillId(billId);
                                    setBillDrawerOpen(true);
                                  }}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                      {episode.consultationIds.map((consultId) => {
                        const consult = getConsultationById(consultId);
                        return (
                          <div
                            key={consultId}
                            className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">
                                  {consult?.chiefComplaint || consultId}
                                </p>
                                {consult && (
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(consult.createdAt), 'dd MMM yyyy')} • {consult.diagnosis?.[0] || 'No diagnosis'}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {consult?.status && (
                                  <Badge variant="outline" className="text-xs">{consult.status}</Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => navigate(`${basePath}/consultations/${consultId}`)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                      {episode.labOrderIds.map((labId) => {
                        const labOrder = getLabOrderById(labId);
                        return (
                          <div
                            key={labId}
                            className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">
                                  {labOrder?.tests.map(t => t.testName).join(', ') || labId}
                                </p>
                                {labOrder && (
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(labOrder.orderedAt), 'dd MMM yyyy')} • Dr. {labOrder.doctorName.replace('Dr. ', '')}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {labOrder && (
                                  <>
                                    <Badge
                                      variant={labOrder.priority === 'stat' ? 'destructive' : 'outline'}
                                      className="text-xs"
                                    >
                                      {labOrder.priority}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">{labOrder.status}</Badge>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => navigate(`${basePath}/lab-results/${labId}`)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                      {episode.prescriptionIds.map((prescId) => {
                        const rx = getPrescriptionById(prescId);
                        return (
                          <div
                            key={prescId}
                            className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">
                                  {rx ? `${rx.items.length} drug${rx.items.length > 1 ? 's' : ''}` : prescId}
                                </p>
                                {rx && (
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(rx.prescribedAt), 'dd MMM yyyy')} • {rx.items.map(i => i.drugName.split(' ')[0]).join(', ')}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {rx && (
                                  <Badge variant="outline" className="text-xs">{rx.status}</Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => navigate(`${basePath}/prescriptions/${prescId}`)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                      {episode.claimIds.map((claimId) => {
                        const claim = getClaimById(claimId);
                        return (
                          <div
                            key={claimId}
                            className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">
                                  {claim?.claimNumber || claimId}
                                </p>
                                {claim && (
                                  <p className="text-xs text-muted-foreground">
                                    {claim.hmoProviderName} • {claim.patientName}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {claim && (
                                  <>
                                    <Badge variant="outline" className="text-xs">{claim.status}</Badge>
                                    <span className="text-sm font-medium">{formatCurrency(claim.claimAmount)}</span>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => navigate(`${basePath}/billing/claims/${claimId}`)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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

      {/* Bill Detail Drawer */}
      <Sheet open={billDrawerOpen} onOpenChange={setBillDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Bill Details</SheetTitle>
          </SheetHeader>
          {(() => {
            const bill = selectedBillId ? getBillById(selectedBillId) : null;
            if (!bill) return <p className="text-sm text-muted-foreground py-4">Bill not found</p>;
            return (
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{bill.billNumber}</span>
                  <Badge variant="outline">{bill.status}</Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{bill.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(bill.createdAt), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-2">Line Items</h4>
                  <div className="space-y-2">
                    {bill.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                        <div>
                          <p>{item.description}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(bill.total)}</span>
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Edit Episode Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Episode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Enter episode notes..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provisionalDiagnosis">Provisional Diagnosis</Label>
              <Input
                id="provisionalDiagnosis"
                value={editForm.provisionalDiagnosis}
                onChange={(e) => setEditForm({ ...editForm, provisionalDiagnosis: e.target.value })}
                placeholder="Enter provisional diagnosis..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalDiagnosis">Final Diagnosis</Label>
              <Input
                id="finalDiagnosis"
                value={editForm.finalDiagnosis}
                onChange={(e) => setEditForm({ ...editForm, finalDiagnosis: e.target.value })}
                placeholder="Enter final diagnosis..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditEpisode}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Episode AlertDialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Episode</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to complete this episode? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCompleteEpisode}>
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
