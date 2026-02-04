import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

interface PatientNumberProps {
  number: string;
  size?: 'sm' | 'md' | 'lg';
  copyable?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg font-semibold',
};

export function PatientNumber({
  number,
  size = 'md',
  copyable = false,
  className,
}: PatientNumberProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = number;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [number]);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-primary',
        sizeStyles[size],
        copyable && 'cursor-pointer hover:text-primary/80 group',
        className
      )}
      onClick={copyable ? handleCopy : undefined}
      title={copyable ? 'Click to copy' : undefined}
    >
      {number}
      {copyable && (
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </span>
      )}
    </span>
  );
}
