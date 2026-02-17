import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNigerianStates } from '@/hooks/queries/useReferenceQueries';

interface StateSelectorProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const StateSelector = forwardRef<HTMLButtonElement, StateSelectorProps>(
  (
    {
      label,
      error,
      helperText,
      value,
      onValueChange,
      placeholder = 'Select state',
      disabled,
      className,
    },
    ref
  ) => {
    const { data: nigerianStates = [] } = useNigerianStates();

    return (
      <div className="space-y-2">
        {label && (
          <Label className={cn(error && 'text-destructive')}>{label}</Label>
        )}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            className={cn(
              error && 'border-destructive focus:ring-destructive',
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-popover">
            {(nigerianStates as any[]).map((state: any) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

StateSelector.displayName = 'StateSelector';
