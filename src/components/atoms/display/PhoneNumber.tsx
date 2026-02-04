import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import { formatNigerianPhone } from '@/constants/designSystem';

interface PhoneNumberProps {
  phone: string;
  clickable?: boolean;
  showIcon?: boolean;
  format?: boolean;
  className?: string;
}

export function PhoneNumber({
  phone,
  clickable = true,
  showIcon = false,
  format = true,
  className,
}: PhoneNumberProps) {
  const displayPhone = format ? formatNigerianPhone(phone) : phone;
  const cleanPhone = phone.replace(/\D/g, '');
  const telLink = `tel:${cleanPhone.startsWith('234') ? `+${cleanPhone}` : cleanPhone}`;

  const content = (
    <>
      {showIcon && <Phone className="h-3 w-3" />}
      <span>{displayPhone}</span>
    </>
  );

  if (clickable) {
    return (
      <a
        href={telLink}
        className={cn(
          'inline-flex items-center gap-1 text-primary hover:underline',
          className
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-muted-foreground',
        className
      )}
    >
      {content}
    </span>
  );
}
