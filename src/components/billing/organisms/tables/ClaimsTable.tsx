import { HMOClaim, ClaimStatus } from '@/types/billing.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Send, Eye, Edit, RotateCcw, Printer, XCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ClaimsTableProps {
  claims: HMOClaim[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onSubmit: (claim: HMOClaim) => void;
  onView: (claim: HMOClaim) => void;
  onEdit: (claim: HMOClaim) => void;
  onResubmit: (claim: HMOClaim) => void;
  onMarkPaid: (claim: HMOClaim) => void;
  onRowClick?: (claim: HMOClaim) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusBadge(status: ClaimStatus) {
  const variants: Record<ClaimStatus, { className: string; label: string }> = {
    draft: { className: 'bg-muted text-muted-foreground', label: 'Draft' },
    submitted: { className: 'bg-blue-100 text-blue-700', label: 'Submitted' },
    processing: { className: 'bg-yellow-100 text-yellow-700', label: 'Processing' },
    approved: { className: 'bg-green-100 text-green-700', label: 'Approved' },
    denied: { className: 'bg-red-100 text-red-700', label: 'Denied' },
    paid: { className: 'bg-purple-100 text-purple-700', label: 'Paid' },
  };

  const config = variants[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}

export function ClaimsTable({
  claims,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onSubmit,
  onView,
  onEdit,
  onResubmit,
  onMarkPaid,
  onRowClick,
}: ClaimsTableProps) {
  const allSelected = claims.length > 0 && claims.every((c) => selectedIds.includes(c.id));
  const someSelected = claims.some((c) => selectedIds.includes(c.id)) && !allSelected;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Claim #</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>HMO Provider</TableHead>
            <TableHead className="text-right">Claim Amount</TableHead>
            <TableHead className="text-right">Approved</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No claims found.
              </TableCell>
            </TableRow>
          ) : (
            claims.map((claim) => (
              <TableRow 
                key={claim.id}
                className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={() => onRowClick?.(claim)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(claim.id)}
                    onCheckedChange={(checked) => onSelectOne(claim.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <button
                    onClick={(e) => { e.stopPropagation(); onView(claim); }}
                    className="text-primary hover:underline"
                  >
                    {claim.claimNumber}
                  </button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{claim.patientName}</p>
                    <p className="text-sm text-muted-foreground">{claim.enrollmentId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{claim.hmoProviderName}</p>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(claim.claimAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {claim.approvedAmount ? (
                    <span className="text-green-600 font-medium">
                      {formatCurrency(claim.approvedAmount)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(claim.status)}</TableCell>
                <TableCell>
                  {claim.submittedAt ? format(new Date(claim.submittedAt), 'dd MMM yyyy') : '—'}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {claim.status === 'draft' && (
                        <>
                          <DropdownMenuItem onClick={() => onEdit(claim)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onSubmit(claim)}>
                            <Send className="h-4 w-4 mr-2" />
                            Submit
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => onView(claim)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {claim.status === 'denied' && (
                        <DropdownMenuItem onClick={() => onResubmit(claim)}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Resubmit
                        </DropdownMenuItem>
                      )}
                      {claim.status === 'approved' && (
                        <DropdownMenuItem onClick={() => onMarkPaid(claim)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {claim.status === 'paid' && (
                        <DropdownMenuItem onClick={() => onView(claim)}>
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
