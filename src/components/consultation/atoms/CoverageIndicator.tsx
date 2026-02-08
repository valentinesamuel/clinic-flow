import { CoverageStatus } from '@/types/financial.types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CoverageIndicatorProps {
  status: CoverageStatus;
}

const config: Record<CoverageStatus, { color: string; label: string }> = {
  covered: { color: 'bg-green-500', label: 'Fully covered by HMO' },
  partial: { color: 'bg-yellow-500', label: 'Partially covered (copay applies)' },
  not_covered: { color: 'bg-red-500', label: 'Not covered' },
};

export function CoverageIndicator({ status }: CoverageIndicatorProps) {
  const { color, label } = config[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-block h-2 w-2 rounded-full shrink-0', color)} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
