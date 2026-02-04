import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GENDERS } from '@/constants/designSystem';
import { Gender } from '@/types/patient.types';

interface GenderSelectorProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: Gender;
  onValueChange?: (value: Gender) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const GenderSelector = forwardRef<HTMLDivElement, GenderSelectorProps>(
  (
    {
      label,
      error,
      helperText,
      value,
      onValueChange,
      disabled,
      orientation = 'horizontal',
      className,
    },
    ref
  ) => {
    return (
      <div className="space-y-2" ref={ref}>
        {label && (
          <Label className={cn(error && 'text-destructive')}>{label}</Label>
        )}
        <RadioGroup
          value={value}
          onValueChange={onValueChange as (value: string) => void}
          disabled={disabled}
          className={cn(
            'flex',
            orientation === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2',
            className
          )}
        >
          {GENDERS.map((gender) => (
            <div key={gender.value} className="flex items-center space-x-2">
              <RadioGroupItem value={gender.value} id={`gender-${gender.value}`} />
              <Label
                htmlFor={`gender-${gender.value}`}
                className="font-normal cursor-pointer"
              >
                {gender.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

GenderSelector.displayName = 'GenderSelector';
