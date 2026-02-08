import { ChevronDown, CreditCard, FileCheck, Receipt, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

interface QuickActionsDropdownProps {
  onRecordPayment: () => void;
  onSubmitClaim: () => void;
  onGenerateReceipt: () => void;
  onDailyReport: () => void;
}

export function QuickActionsDropdown({
  onRecordPayment,
  onSubmitClaim,
  onGenerateReceipt,
  onDailyReport,
}: QuickActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Quick Actions
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Billing</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onRecordPayment}>
            <CreditCard className="mr-2 h-4 w-4" />
            Record Payment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSubmitClaim}>
            <FileCheck className="mr-2 h-4 w-4" />
            Submit Claim
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Reports</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onGenerateReceipt}>
            <Receipt className="mr-2 h-4 w-4" />
            Generate Receipt
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDailyReport}>
            <DollarSign className="mr-2 h-4 w-4" />
            Daily Report
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
