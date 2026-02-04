import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NIGERIAN_PHONE_REGEX } from '@/constants/designSystem';

interface NigerianPhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  showPrefix?: boolean;
}

export const NigerianPhoneInput = forwardRef<
  HTMLInputElement,
  NigerianPhoneInputProps
>(
  (
    {
      label,
      error,
      helperText,
      onChange,
      showPrefix = true,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const formatPhoneDisplay = (phone: string): string => {
      // Remove all non-digits
      const digits = phone.replace(/\D/g, '');

      // Handle +234 prefix
      if (digits.startsWith('234')) {
        const rest = digits.slice(3);
        if (rest.length <= 3) return `+234 ${rest}`;
        if (rest.length <= 6) return `+234 ${rest.slice(0, 3)} ${rest.slice(3)}`;
        if (rest.length <= 10)
          return `+234 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
        return `+234 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 10)}`;
      }

      // Handle 0-prefix (local format)
      if (digits.startsWith('0')) {
        if (digits.length <= 4) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
      }

      return phone;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      // Only allow digits, plus sign, and spaces
      const cleaned = rawValue.replace(/[^\d\s+]/g, '');
      onChange?.(cleaned);
    };

    const isValid = value
      ? NIGERIAN_PHONE_REGEX.test(String(value).replace(/\s/g, ''))
      : true;

    return (
      <div className="space-y-2">
        {label && (
          <Label className={cn(error && 'text-destructive')}>{label}</Label>
        )}
        <div className="relative">
          {showPrefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              🇳🇬
            </div>
          )}
          <Input
            ref={ref}
            type="tel"
            inputMode="numeric"
            className={cn(
              showPrefix && 'pl-10',
              error && 'border-destructive focus-visible:ring-destructive',
              !isValid &&
                !isFocused &&
                value &&
                'border-warning focus-visible:ring-warning',
              className
            )}
            value={formatPhoneDisplay(String(value || ''))}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0803 123 4567"
            {...props}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
        {!error && !isValid && !isFocused && value && (
          <p className="text-xs text-warning">
            Please enter a valid Nigerian phone number
          </p>
        )}
      </div>
    );
  }
);

NigerianPhoneInput.displayName = 'NigerianPhoneInput';
