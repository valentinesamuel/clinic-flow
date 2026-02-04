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
import { BLOOD_TYPES } from '@/constants/designSystem';
import { Droplet } from 'lucide-react';

interface BloodTypeSelectorProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const BloodTypeSelector = forwardRef<
  HTMLButtonElement,
  BloodTypeSelectorProps
>(
  (
    {
      label,
      error,
      helperText,
      value,
      onValueChange,
      placeholder = 'Select blood type',
      disabled,
      className,
    },
    ref
  ) => {
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
          <SelectContent className="bg-popover">
            {BLOOD_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                <span className="flex items-center gap-2">
                  {type !== 'unknown' && (
                    <Droplet className="h-3 w-3 text-destructive fill-destructive" />
                  )}
                  {type === 'unknown' ? 'Unknown' : type}
                </span>
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

BloodTypeSelector.displayName = 'BloodTypeSelector';
