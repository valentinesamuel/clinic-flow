// PriceApprovalPage - CMO price approval queue

import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PriceApprovalQueue } from '@/components/billing/organisms/service-pricing/PriceApprovalQueue';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';

export default function PriceApprovalPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout allowedRoles={['cmo']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              Price Approval Queue
            </h1>
            <p className="text-muted-foreground">
              Review and approve service price changes
            </p>
          </div>
        </div>

        <PriceApprovalQueue />
      </div>
    </DashboardLayout>
  );
}
