import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Send, AlertCircle, Edit, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { MetadataEditor } from '@/components/molecules/lab/MetadataEditor';
import { LabQuickActionsDropdown } from '@/components/molecules/lab/LabQuickActionsDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getLabOrderById, submitLabOrderToDoctor, updateLabTestResults, updateLabOrderStatus } from '@/data/lab-orders';
import { getPatientById } from '@/data/patients';
import { getEpisodesByPatientId } from '@/data/episodes';

export default function LabResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editedResults, setEditedResults] = useState<Record<string, { result: string; techNotes: string; metadata: Record<string, string> }>>({});
  const [showEpisodeDialog, setShowEpisodeDialog] = useState(false);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitConfirmText, setSubmitConfirmText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const basePath = user
    ? user.role === 'hospital_admin'
      ? '/hospital-admin'
      : user.role === 'clinical_lead'
      ? '/clinical-lead'
      : user.role === 'lab_tech'
      ? '/lab-tech'
      : user.role === 'cmo'
      ? '/cmo'
      : user.role === 'cashier'
      ? '/cashier'
      : user.role === 'receptionist'
      ? '/receptionist'
      : `/${user.role}`
    : '';

  const labOrder = useMemo(() => {
    return id ? getLabOrderById(id) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refreshKey]);

  const patient = useMemo(() => {
    return labOrder ? getPatientById(labOrder.patientId) : null;
  }, [labOrder]);

  if (!labOrder || !patient) {
    return (
      <DashboardLayout allowedRoles={['doctor', 'clinical_lead', 'lab_tech', 'cmo', 'hospital_admin', 'cashier', 'receptionist']}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Lab Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The lab order you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate(`${basePath}/lab-results`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lab Results
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isLabTech = user?.role === 'lab_tech';
  const isDoctorOrLead = user?.role === 'doctor' || user?.role === 'clinical_lead';
  const isHmoPatient = patient.paymentType === 'hmo';
  const canSubmitToDoctor = isLabTech && labOrder.status === 'completed' && !labOrder.isSubmittedToDoctor;
  const patientEpisodes = getEpisodesByPatientId(patient.id).filter(e => e.status === 'active' || e.status === 'pending_results');

  const getStatusBadgeVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (
    priority: string
  ): 'default' | 'secondary' | 'destructive' => {
    switch (priority) {
      case 'stat':
        return 'destructive';
      case 'urgent':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handlePrintResults = () => {
    toast({
      title: 'Print Results',
      description: 'Lab results will be printed.',
    });
  };

  const handleRequestRetest = () => {
    toast({
      title: 'Retest Requested',
      description: 'A retest has been requested for this lab order.',
    });
  };

  const handleForwardToSpecialist = () => {
    toast({
      title: 'Forwarded to Specialist',
      description: 'Lab results have been forwarded to a specialist.',
    });
  };

  const handleStartEditing = () => {
    const initial: Record<string, { result: string; techNotes: string; metadata: Record<string, string> }> = {};
    labOrder.tests.forEach(test => {
      const existingMetadata: Record<string, string> = {};
      if (test.metadata) {
        Object.entries(test.metadata).forEach(([k, v]) => {
          if (typeof v === 'string') existingMetadata[k] = v;
        });
      }
      initial[test.testCode] = {
        result: test.result || '',
        techNotes: test.techNotes || '',
        metadata: existingMetadata,
      };
    });
    setEditedResults(initial);
    setIsEditing(true);
  };

  const handleSaveEdits = () => {
    Object.entries(editedResults).forEach(([testCode, updates]) => {
      updateLabTestResults(labOrder.id, testCode, {
        result: updates.result,
        techNotes: updates.techNotes,
        metadata: updates.metadata,
      });
    });
    setIsEditing(false);
    setRefreshKey(k => k + 1);
    toast({
      title: 'Results Updated',
      description: 'Test results have been saved.',
    });
  };

  const handleConfirmSubmit = () => {
    if (submitConfirmText !== 'SUBMIT') return;
    submitLabOrderToDoctor(labOrder.id);
    setShowSubmitDialog(false);
    setSubmitConfirmText('');
    setRefreshKey(k => k + 1);
    toast({
      title: 'Results Sent to Doctor',
      description: `Lab results for ${labOrder.patientName} have been submitted to the doctor.`,
    });
  };

  const handleCompleteLabTest = () => {
    if (!id) return;
    updateLabOrderStatus(id, 'completed');
    setRefreshKey(k => k + 1);
    toast({
      title: 'Lab Test Completed',
      description: `Lab order for ${labOrder.patientName} has been marked as completed.`,
    });
  };

  const handleAddToEpisode = () => {
    if (!selectedEpisodeId) return;
    toast({
      title: 'Added to Episode',
      description: `Lab order linked to episode successfully.`,
    });
    setShowEpisodeDialog(false);
    setSelectedEpisodeId(null);
  };

  const hasTechNotes = labOrder.tests.some((test) => test.techNotes);

  return (
    <DashboardLayout allowedRoles={['doctor', 'clinical_lead', 'lab_tech', 'cmo', 'hospital_admin', 'cashier', 'receptionist']}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Edit Mode Banner */}
        {isEditing && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800">
              <Edit className="h-5 w-5" />
              <span className="font-medium">Edit Mode</span>
              <span className="text-sm">— You are editing test results. Changes will be saved when you click Save.</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveEdits}>Save Changes</Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">MRN: {patient.mrn}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={getStatusBadgeVariant(labOrder.status)}>
                {labOrder.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
              <Badge variant={getPriorityBadgeVariant(labOrder.priority)}>
                {labOrder.priority.toUpperCase()}
              </Badge>
              {labOrder.isSubmittedToDoctor && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Submitted to Doctor
                </Badge>
              )}
              {labOrder.status === 'completed' && !labOrder.isSubmittedToDoctor && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Pending Submission
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap justify-end items-center">
            {isLabTech && !isEditing && (labOrder.status === 'processing' || labOrder.status === 'sample_collected') && (
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleCompleteLabTest}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Lab Test
              </Button>
            )}

            {canSubmitToDoctor && !isEditing && (
              <Button onClick={() => setShowSubmitDialog(true)}>
                <Send className="mr-2 h-4 w-4" />
                Send to Doctor
              </Button>
            )}

            <LabQuickActionsDropdown
              userRole={user?.role || ''}
              labOrderStatus={labOrder.status}
              isSubmittedToDoctor={!!labOrder.isSubmittedToDoctor}
              isHmoPatient={isHmoPatient}
              hasActiveEpisodes={patientEpisodes.length > 0}
              onPrintResults={handlePrintResults}
              onRequestRetest={handleRequestRetest}
              onForwardToSpecialist={handleForwardToSpecialist}
              onAddToEpisode={() => setShowEpisodeDialog(true)}
              onEditResults={handleStartEditing}
            />
          </div>
        </div>

        {/* Lab Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ordered By</p>
                <p className="font-medium">{labOrder.doctorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {format(new Date(labOrder.orderedAt), 'PPp')}
                </p>
              </div>
              {labOrder.completedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed Date</p>
                  <p className="font-medium">
                    {format(new Date(labOrder.completedAt), 'PPp')}
                  </p>
                </div>
              )}
              {labOrder.submittedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Submitted to Doctor</p>
                  <p className="font-medium">
                    {format(new Date(labOrder.submittedAt), 'PPp')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                {labOrder.tests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{test.testName}</h4>
                      <Badge variant="outline">{test.testCode}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Result Value</Label>
                        <Input
                          value={editedResults[test.testCode]?.result || ''}
                          onChange={(e) =>
                            setEditedResults(prev => ({
                              ...prev,
                              [test.testCode]: { ...prev[test.testCode], result: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reference Range</Label>
                        <p className="text-sm mt-1">{test.normalRange || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tech Notes</Label>
                      <Textarea
                        value={editedResults[test.testCode]?.techNotes || ''}
                        onChange={(e) =>
                          setEditedResults(prev => ({
                            ...prev,
                            [test.testCode]: { ...prev[test.testCode], techNotes: e.target.value },
                          }))
                        }
                        rows={2}
                        placeholder="Add technical notes..."
                      />
                    </div>
                    <MetadataEditor
                      metadata={editedResults[test.testCode]?.metadata || {}}
                      onChange={(metadata) =>
                        setEditedResults(prev => ({
                          ...prev,
                          [test.testCode]: { ...prev[test.testCode], metadata },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Test Code</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labOrder.tests.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{test.testName}</TableCell>
                      <TableCell>{test.testCode}</TableCell>
                      <TableCell
                        className={
                          test.isAbnormal ? 'text-red-600 font-semibold' : ''
                        }
                      >
                        {test.result || '-'}
                      </TableCell>
                      <TableCell>{test.unit || '-'}</TableCell>
                      <TableCell>{test.normalRange || '-'}</TableCell>
                      <TableCell>
                        {test.isAbnormal ? (
                          <Badge variant="destructive">Abnormal</Badge>
                        ) : test.result ? (
                          <Badge variant="outline">Normal</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Technical Notes */}
        {hasTechNotes && !isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Technical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {labOrder.tests
                  .filter((test) => test.techNotes)
                  .map((test, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <p className="font-medium text-sm">{test.testName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {test.techNotes}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Metadata */}
        {!isEditing && labOrder.tests.some(t => t.metadata && Object.keys(t.metadata).some(k => typeof t.metadata![k] === 'string')) && (
          <Card>
            <CardHeader>
              <CardTitle>Test Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labOrder.tests
                  .filter(t => t.metadata && Object.keys(t.metadata).some(k => typeof t.metadata![k] === 'string'))
                  .map((test, index) => {
                    const stringMetadata: Record<string, string> = {};
                    if (test.metadata) {
                      Object.entries(test.metadata).forEach(([k, v]) => {
                        if (typeof v === 'string') stringMetadata[k] = v;
                      });
                    }
                    return (
                      <div key={index} className="space-y-2">
                        <p className="text-sm font-medium">{test.testName}</p>
                        <MetadataEditor metadata={stringMetadata} onChange={() => {}} readOnly />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lab Order Notes */}
        {labOrder.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Lab Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{labOrder.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Episode Selector Dialog */}
      <Dialog open={showEpisodeDialog} onOpenChange={setShowEpisodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Episode</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">Select an active episode to link this lab order to:</p>
            {patientEpisodes.map(ep => (
              <label
                key={ep.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedEpisodeId === ep.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name="episode"
                  value={ep.id}
                  checked={selectedEpisodeId === ep.id}
                  onChange={() => setSelectedEpisodeId(ep.id)}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium">{ep.episodeNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(ep.createdAt), 'dd MMM yyyy')} — {ep.provisionalDiagnosis || 'No diagnosis'}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEpisodeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddToEpisode} disabled={!selectedEpisodeId}>
              Link to Episode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit to Doctor Confirmation */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Results to Doctor</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This action is <strong>irreversible</strong>. Once submitted, the results will be visible
                to the doctor and cannot be edited.
              </p>
              <p>Type <strong>SUBMIT</strong> below to confirm:</p>
              <Input
                value={submitConfirmText}
                onChange={(e) => setSubmitConfirmText(e.target.value)}
                placeholder="Type SUBMIT to confirm"
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSubmitConfirmText('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              disabled={submitConfirmText !== 'SUBMIT'}
            >
              Confirm Submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
