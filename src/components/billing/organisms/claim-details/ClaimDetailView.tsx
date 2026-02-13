import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  User,
  Shield,
  Receipt,
  FileText,
  Clock,
  Stethoscope,
  FlaskConical,
  Pill,
  Activity,
  MoreHorizontal,
  AlertCircle,
  Eye,
  FileImage,
} from 'lucide-react';
import { HMOClaim, ClaimDocument } from '@/types/billing.types';
import { getBillById } from '@/data/bills';
import { ClaimVersionHistory } from '@/components/billing/molecules/claim/ClaimVersionHistory';
import { DocumentList } from '@/components/billing/molecules/documents/DocumentList';
import { HMOItemStatusBadge } from '@/components/atoms/display/HMOItemStatusBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Bill } from '@/types/billing.types';

interface ClaimDetailViewProps {
  claim: HMOClaim;
  onEdit?: () => void;
  onSubmit?: () => void;
  onResubmit?: () => void;
  onMarkPaid?: () => void;
  onWithdraw?: () => void;
}

const categoryIcons = {
  consultation: Stethoscope,
  lab: FlaskConical,
  pharmacy: Pill,
  procedure: Activity,
  admission: FileText,
  other: MoreHorizontal,
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: HMOClaim['status']): string => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
    paid: 'bg-emerald-100 text-emerald-800',
    withdrawn: 'bg-gray-100 text-gray-800',
    retracted: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: HMOClaim['status']): string => {
  const labels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    processing: 'Processing',
    approved: 'Approved',
    denied: 'Denied',
    paid: 'Paid',
    withdrawn: 'Withdrawn',
    retracted: 'Retracted',
  };
  return labels[status] || status;
};

export function ClaimDetailView({
  claim,
  onEdit,
  onSubmit,
  onResubmit,
  onMarkPaid,
  onWithdraw,
}: ClaimDetailViewProps) {
  const [linkedBills, setLinkedBills] = useState<Bill[]>([]);
  const [previewDocument, setPreviewDocument] = useState<ClaimDocument | null>(null);

  useEffect(() => {
    if (claim.billIds && claim.billIds.length > 0) {
      const bills = claim.billIds.map(id => getBillById(id)).filter(Boolean) as Bill[];
      setLinkedBills(bills);
    }
  }, [claim.billIds]);

  const renderActionButtons = () => {
    const buttons: JSX.Element[] = [];

    switch (claim.status) {
      case 'draft':
        if (onEdit) {
          buttons.push(
            <Button key="edit" variant="outline" onClick={onEdit}>
              Edit
            </Button>
          );
        }
        if (onSubmit) {
          buttons.push(
            <Button key="submit" onClick={onSubmit}>
              Submit
            </Button>
          );
        }
        break;

      case 'submitted':
      case 'processing':
        if (onWithdraw) {
          buttons.push(
            <Button key="withdraw" variant="destructive" onClick={onWithdraw}>
              Withdraw
            </Button>
          );
        }
        break;

      case 'denied':
        if (onResubmit) {
          buttons.push(
            <Button key="resubmit" onClick={onResubmit}>
              Resubmit
            </Button>
          );
        }
        if (onWithdraw) {
          buttons.push(
            <Button key="withdraw" variant="outline" onClick={onWithdraw}>
              Withdraw
            </Button>
          );
        }
        break;

      case 'approved':
        if (onMarkPaid) {
          buttons.push(
            <Button key="mark-paid" onClick={onMarkPaid}>
              Mark Paid
            </Button>
          );
        }
        if (onWithdraw) {
          buttons.push(
            <Button key="withdraw" variant="outline" onClick={onWithdraw}>
              Withdraw
            </Button>
          );
        }
        break;
    }

    return buttons;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Claim {claim.claimNumber}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {claim.patientName} • {claim.hmoProviderName}
              </p>
            </div>
            <Badge className={cn('text-sm', getStatusColor(claim.status))}>
              {getStatusLabel(claim.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {renderActionButtons()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Patient Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">{claim.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Claim Number</p>
                  <p className="font-medium">{claim.claimNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Service</p>
                  <p className="font-medium">
                    {format(new Date(claim.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Diagnoses Card */}
            {claim.diagnoses && claim.diagnoses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-500" />
                    Diagnoses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {claim.diagnoses.map((diagnosis, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {diagnosis.code}
                            </Badge>
                            {diagnosis.isPrimary && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">
                            {diagnosis.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked Bills Card */}
            {linkedBills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-gray-500" />
                    Linked Bills ({linkedBills.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {linkedBills.map((bill) => (
                    <div key={bill.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{bill.billNumber}</p>
                        <Badge variant="outline">{bill.status}</Badge>
                      </div>

                      <div className="space-y-2">
                        {bill.items.map((item) => {
                          const Icon =
                            categoryIcons[
                              item.category as keyof typeof categoryIcons
                            ] || MoreHorizontal;

                          return (
                            <div
                              key={item.id}
                              className="flex items-start justify-between gap-4 py-1"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <Icon className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {item.quantity} × {formatCurrency(item.unitPrice)}
                                  </p>
                                  {item.hmoStatus && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <HMOItemStatusBadge status={item.hmoStatus} />
                                      <span className="text-xs text-gray-600">
                                        HMO: {formatCurrency(item.hmoCoveredAmount || 0)} /
                                        Patient: {formatCurrency(item.patientLiabilityAmount || 0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                {formatCurrency(item.total)}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between text-sm font-medium pt-2 border-t">
                        <span>Bill Total</span>
                        <span>{formatCurrency(bill.total)}</span>
                      </div>

                      {linkedBills.indexOf(bill) < linkedBills.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Claim Items Card */}
            {claim.items && claim.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    Claim Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {claim.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-4 py-2 border-b last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {formatCurrency(item.claimedAmount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* HMO Provider Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  HMO Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Provider Name</p>
                  <p className="font-medium">{claim.hmoProviderName}</p>
                </div>
                {claim.enrollmentId && (
                  <div>
                    <p className="text-sm text-gray-500">Enrollment ID</p>
                    <p className="font-medium font-mono text-sm">
                      {claim.enrollmentId}
                    </p>
                  </div>
                )}
                {claim.policyNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Policy Number</p>
                    <p className="font-medium font-mono text-sm">
                      {claim.policyNumber}
                    </p>
                  </div>
                )}
                {claim.preAuthCode && (
                  <div>
                    <p className="text-sm text-gray-500">Pre-Authorization Code</p>
                    <p className="font-medium font-mono text-sm">
                      {claim.preAuthCode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Amounts Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-gray-500" />
                  Claim Amounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Claimed Amount</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(claim.claimAmount)}
                  </p>
                </div>
                {claim.approvedAmount !== undefined && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500">Approved Amount</p>
                      <p className="text-2xl font-semibold text-green-600">
                        {formatCurrency(claim.approvedAmount)}
                      </p>
                    </div>
                  </>
                )}
                {claim.status === 'denied' && claim.denialReason && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500">Denial Reason</p>
                      <p className="text-sm text-red-600 mt-1">
                        {claim.denialReason}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Denial Info Card (if denied) */}
            {claim.status === 'denied' && claim.denialReason && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    Claim Denied
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700">{claim.denialReason}</p>
                  {claim.processedAt && claim.status === 'denied' && (
                    <p className="text-xs text-red-600 mt-2">
                      Denied on {format(new Date(claim.processedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents Card */}
            {claim.documents && claim.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DocumentList documents={claim.documents} onPreview={setPreviewDocument} />
                </CardContent>
              </Card>
            )}

            {/* Version History Card */}
            {claim.versions && claim.versions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    Version History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClaimVersionHistory versions={claim.versions} currentVersion={claim.currentVersion} />
                </CardContent>
              </Card>
            )}

            {/* Timestamps Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  Timestamps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium">
                    {format(new Date(claim.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                {claim.submittedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-sm font-medium">
                      {format(new Date(claim.submittedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
                {claim.processedAt && claim.status === 'approved' && (
                  <div>
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-sm font-medium">
                      {format(new Date(claim.processedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
                {claim.processedAt && claim.status === 'paid' && (
                  <div>
                    <p className="text-sm text-gray-500">Paid</p>
                    <p className="text-sm font-medium">
                      {format(new Date(claim.processedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">
                    {format(new Date(claim.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Document Preview
            </DialogTitle>
          </DialogHeader>
          {previewDocument && (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/30">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">{previewDocument.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Preview not available for mock data
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Name</span>
                  <span className="font-medium">{previewDocument.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{previewDocument.type}</span>
                </div>
                {previewDocument.source && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source</span>
                    <span className="font-medium capitalize">{previewDocument.source}</span>
                  </div>
                )}
                {previewDocument.size && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">
                      {previewDocument.size < 1024 * 1024
                        ? `${(previewDocument.size / 1024).toFixed(1)} KB`
                        : `${(previewDocument.size / (1024 * 1024)).toFixed(1)} MB`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded</span>
                  <span className="font-medium">
                    {format(new Date(previewDocument.uploadedAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
