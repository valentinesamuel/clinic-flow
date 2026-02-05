import { format } from 'date-fns';
import {
  FileCheck,
  User,
  Shield,
  Receipt,
  FileText,
  Clock,
  AlertTriangle,
  Send,
  Edit,
  Printer,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { HMOClaim, ClaimStatus, ClaimDocument } from '@/types/billing.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClaimVersionHistory } from '@/components/billing/molecules/claim/ClaimVersionHistory';
import { cn } from '@/lib/utils';

interface ClaimDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: HMOClaim | null;
  onEdit?: () => void;
  onSubmit?: () => void;
  onResubmit?: () => void;
  onMarkPaid?: () => void;
  onViewBill?: () => void;
  onPrint?: () => void;
  onDelete?: () => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const statusConfig: Record<ClaimStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  draft: { label: 'Draft', variant: 'secondary', icon: <Edit className="h-3 w-3" /> },
  submitted: { label: 'Submitted', variant: 'default', icon: <Send className="h-3 w-3" /> },
  processing: { label: 'Processing', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
  approved: { label: 'Approved', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
  denied: { label: 'Denied', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
  paid: { label: 'Paid', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
};

export function ClaimDetailsDrawer({
  open,
  onOpenChange,
  claim,
  onEdit,
  onSubmit,
  onResubmit,
  onMarkPaid,
  onViewBill,
  onPrint,
  onDelete,
}: ClaimDetailsDrawerProps) {
  if (!claim) return null;

  const statusCfg = statusConfig[claim.status];
  const canEdit = claim.status === 'draft';
  const canSubmit = claim.status === 'draft';
  const canResubmit = claim.status === 'denied';
  const canMarkPaid = claim.status === 'approved';
  const canDelete = claim.status === 'draft';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Claim Details</p>
              <SheetTitle className="text-xl">{claim.claimNumber}</SheetTitle>
            </div>
            <Badge variant={statusCfg.variant} className="gap-1">
              {statusCfg.icon}
              {statusCfg.label}
            </Badge>
          </div>
          {claim.submittedAt && (
            <p className="text-sm text-muted-foreground mt-2">
              Submitted: {format(new Date(claim.submittedAt), 'dd MMM yyyy, h:mm a')}
            </p>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-5">
            {/* Patient Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Patient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{claim.patientName}</p>
                <p className="text-sm text-muted-foreground">ID: {claim.patientId}</p>
              </CardContent>
            </Card>

            {/* HMO Provider */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  HMO Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="text-sm font-medium">{claim.hmoProviderName}</span>
                </div>
                {claim.policyNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Policy</span>
                    <span className="text-sm font-mono">{claim.policyNumber}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Enrollment</span>
                  <span className="text-sm font-mono">{claim.enrollmentId}</span>
                </div>
                {claim.preAuthCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pre-Auth</span>
                    <span className="text-sm font-mono">{claim.preAuthCode}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linked Bill */}
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onViewBill}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  Linked Bill
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{claim.billId}</span>
                  <span className="text-sm font-medium">{formatCurrency(claim.claimAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Amounts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  Claim Amounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Claimed Amount</span>
                  <span className="text-sm font-medium">{formatCurrency(claim.claimAmount)}</span>
                </div>
                {claim.approvedAmount !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Approved Amount</span>
                    <span className={cn(
                      "text-sm font-medium",
                      claim.approvedAmount < claim.claimAmount && "text-warning"
                    )}>
                      {formatCurrency(claim.approvedAmount)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            {claim.documents.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Documents ({claim.documents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {claim.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Version History */}
            {claim.versions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Version History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClaimVersionHistory versions={claim.versions} currentVersion={claim.currentVersion} />
                </CardContent>
              </Card>
            )}

            {/* Denial Reason */}
            {claim.status === 'denied' && claim.denialReason && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    Denial Reason
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{claim.denialReason}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t bg-muted/30 space-y-2">
          {canSubmit && onSubmit && (
            <Button className="w-full" onClick={onSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Submit Claim
            </Button>
          )}
          {canEdit && onEdit && (
            <Button variant="outline" className="w-full" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Claim
            </Button>
          )}
          {canResubmit && onResubmit && (
            <Button className="w-full" onClick={onResubmit}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Resubmit Claim
            </Button>
          )}
          {canMarkPaid && onMarkPaid && (
            <Button className="w-full" onClick={onMarkPaid}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
          {claim.status === 'paid' && onPrint && (
            <Button variant="outline" className="w-full" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Claim
            </Button>
          )}
          {canDelete && onDelete && (
            <Button variant="destructive" className="w-full" onClick={onDelete}>
              Delete Draft
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
