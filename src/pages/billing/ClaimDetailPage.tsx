import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClaimDetailView } from '@/components/billing/organisms/claim-details/ClaimDetailView';
import { ClaimWithdrawalModal } from '@/components/billing/organisms/claim-details/ClaimWithdrawalModal';
import { ClaimEditModal } from '@/components/billing/organisms/claim-submission/ClaimEditModal';
import { getClaimById, updateClaimStatus, submitClaim } from '@/data/claims';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { HMOClaim, WithdrawalReason } from '@/types/billing.types';

export default function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editMode, setEditMode] = useState<'edit' | 'resubmit'>('edit');

  const claim = id ? getClaimById(id) : undefined;

  if (!claim) {
    return (
      <DashboardLayout allowedRoles={['cashier', 'hospital_admin', 'cmo']}>
        <div className="p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Claim Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The claim you are looking for does not exist.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleEdit = () => {
    setEditMode('edit');
    setShowEdit(true);
  };

  const handleSubmit = () => {
    submitClaim(claim.id);
    toast({ title: 'Claim Submitted', description: `${claim.claimNumber} has been submitted` });
  };

  const handleResubmit = () => {
    setEditMode('resubmit');
    setShowEdit(true);
  };

  const handleMarkPaid = () => {
    updateClaimStatus(claim.id, 'paid');
    toast({ title: 'Claim Marked as Paid', description: `${claim.claimNumber} marked as paid` });
  };

  const handleWithdraw = (reason: WithdrawalReason) => {
    updateClaimStatus(claim.id, 'withdrawn');
    toast({ title: 'Claim Withdrawn', description: `${claim.claimNumber} has been withdrawn` });
    setShowWithdrawal(false);
  };

  return (
    <DashboardLayout allowedRoles={['cashier', 'hospital_admin', 'cmo']}>
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Claims
        </Button>

        <ClaimDetailView
          claim={claim}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          onResubmit={handleResubmit}
          onMarkPaid={handleMarkPaid}
          onWithdraw={() => setShowWithdrawal(true)}
        />
      </div>

      <ClaimWithdrawalModal
        open={showWithdrawal}
        onOpenChange={setShowWithdrawal}
        claim={claim}
        onWithdraw={handleWithdraw}
        onRequestRetraction={handleWithdraw}
      />

      {showEdit && (
        <ClaimEditModal
          open={showEdit}
          onOpenChange={setShowEdit}
          claim={claim}
          mode={editMode}
          onSave={(data) => {
            toast({ title: 'Draft Saved', description: `${claim.claimNumber} updated` });
            setShowEdit(false);
          }}
          onSubmit={(data) => {
            toast({ title: editMode === 'resubmit' ? 'Claim Resubmitted' : 'Claim Submitted' });
            setShowEdit(false);
          }}
          onCancel={() => setShowEdit(false)}
        />
      )}
    </DashboardLayout>
  );
}
