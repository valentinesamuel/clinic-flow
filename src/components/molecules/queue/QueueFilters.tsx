import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QueueFilters as QueueFiltersType, QueuePriority, PaymentClearanceStatus } from '@/types/queue.types';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface QueueFiltersProps {
  filters: QueueFiltersType;
  onChange: (filters: QueueFiltersType) => void;
  priorityCounts?: Record<QueuePriority | 'all', number>;
  paymentCounts?: Record<PaymentClearanceStatus | 'all', number>;
  showPriority?: boolean;
  showPayment?: boolean;
  showWaitTime?: boolean;
  className?: string;
}

export function QueueFilters({
  filters,
  onChange,
  priorityCounts,
  paymentCounts,
  showPriority = true,
  showPayment = true,
  showWaitTime = false,
  className,
}: QueueFiltersProps) {
  const priorityOptions: FilterOption[] = [
    { value: 'all', label: 'All', count: priorityCounts?.all },
    { value: 'emergency', label: 'Emergency', count: priorityCounts?.emergency },
    { value: 'high', label: 'High', count: priorityCounts?.high },
    { value: 'normal', label: 'Normal', count: priorityCounts?.normal },
  ];

  const paymentOptions: FilterOption[] = [
    { value: 'all', label: 'All', count: paymentCounts?.all },
    { value: 'cleared', label: 'Paid', count: paymentCounts?.cleared },
    { value: 'pending', label: 'Pending', count: paymentCounts?.pending },
    { value: 'hmo_verified', label: 'HMO', count: paymentCounts?.hmo_verified },
  ];

  const waitTimeOptions: FilterOption[] = [
    { value: 'all', label: 'All Wait Times' },
    { value: 'under_20', label: '< 20 min' },
    { value: '20_to_40', label: '20-40 min' },
    { value: 'over_40', label: '> 40 min' },
  ];

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {showPriority && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-1">Priority:</span>
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              variant={filters.priority === option.value || (!filters.priority && option.value === 'all') ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                onChange({
                  ...filters,
                  priority: option.value === 'all' ? undefined : (option.value as QueuePriority),
                })
              }
            >
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1 text-xs opacity-70">({option.count})</span>
              )}
            </Button>
          ))}
        </div>
      )}

      {showPayment && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-1">Payment:</span>
          {paymentOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                filters.paymentStatus === option.value ||
                (!filters.paymentStatus && option.value === 'all')
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() =>
                onChange({
                  ...filters,
                  paymentStatus:
                    option.value === 'all' ? undefined : (option.value as PaymentClearanceStatus),
                })
              }
            >
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1 text-xs opacity-70">({option.count})</span>
              )}
            </Button>
          ))}
        </div>
      )}

      {showWaitTime && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-1">Wait:</span>
          {waitTimeOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                filters.waitTime === option.value ||
                (!filters.waitTime && option.value === 'all')
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() =>
                onChange({
                  ...filters,
                  waitTime:
                    option.value === 'all'
                      ? undefined
                      : (option.value as 'under_20' | '20_to_40' | 'over_40'),
                })
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
