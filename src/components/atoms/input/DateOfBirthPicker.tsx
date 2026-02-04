import { forwardRef, useMemo } from 'react';
import { format, differenceInYears, isAfter, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, User } from 'lucide-react';

interface DateOfBirthPickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  showAgePreview?: boolean;
  maxDate?: Date;
  minAge?: number;
  className?: string;
}

export const DateOfBirthPicker = forwardRef<
  HTMLButtonElement,
  DateOfBirthPickerProps
>(
  (
    {
      label,
      error,
      helperText,
      value,
      onValueChange,
      placeholder = 'Select date of birth',
      disabled,
      showAgePreview = true,
      maxDate = new Date(),
      minAge = 0,
      className,
    },
    ref
  ) => {
    const age = useMemo(() => {
      if (!value || !isValid(value)) return null;
      return differenceInYears(new Date(), value);
    }, [value]);

    const isFutureDate = value && isAfter(value, maxDate);
    const isTooYoung = age !== null && age < minAge;

    return (
      <div className="space-y-2">
        {label && (
          <Label className={cn(error && 'text-destructive')}>{label}</Label>
        )}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                ref={ref}
                variant="outline"
                disabled={disabled}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                  (error || isFutureDate || isTooYoung) &&
                    'border-destructive focus:ring-destructive',
                  className
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value && isValid(value) ? (
                  format(value, 'dd/MM/yyyy')
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={onValueChange}
                disabled={(date) => isAfter(date, maxDate)}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
          {showAgePreview && age !== null && (
            <div className="flex items-center gap-1 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground min-w-[80px]">
              <User className="h-4 w-4" />
              <span className="font-medium">{age}</span>
              <span>yrs</span>
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {isFutureDate && !error && (
          <p className="text-xs text-destructive">
            Date of birth cannot be in the future
          </p>
        )}
        {isTooYoung && !error && (
          <p className="text-xs text-destructive">
            Patient must be at least {minAge} years old
          </p>
        )}
        {!error && !isFutureDate && !isTooYoung && helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

DateOfBirthPicker.displayName = 'DateOfBirthPicker';
