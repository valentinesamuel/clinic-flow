// CashierDashboardPage - Page wrapper for CashierDashboard

import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CashierDashboard } from '@/components/billing/organisms/cashier-station/CashierDashboard';
import { CashierStation } from '@/types/cashier.types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useState } from 'react';
import { CodePaymentProcessor } from '@/components/billing/organisms/billing-codes/CodePaymentProcessor';
import { useToast } from '@/hooks/use-toast';

interface CashierDashboardPageProps {
  station?: CashierStation;
}

export default function CashierDashboardPage({ station = 'main' }: CashierDashboardPageProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCodeProcessor, setShowCodeProcessor] = useState(false);

  const handleCodePaymentComplete = () => {
    toast({
      title: 'Payment Processed',
      description: 'Billing code payment completed successfully',
    });
  };

  return (
    <DashboardLayout allowedRoles={['billing', 'hospital_admin', 'cmo']}>
      <div className="space-y-6">
        {/* Header with Code Lookup */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/billing')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Cashier Dashboard
              </h1>
            </div>
          </div>
          <Button onClick={() => setShowCodeProcessor(true)} variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Process Billing Code
          </Button>
        </div>

        <CashierDashboard station={station} />
      </div>

      {/* Code Payment Processor */}
      <CodePaymentProcessor
        open={showCodeProcessor}
        onOpenChange={setShowCodeProcessor}
        onComplete={handleCodePaymentComplete}
      />
    </DashboardLayout>
  );
}
