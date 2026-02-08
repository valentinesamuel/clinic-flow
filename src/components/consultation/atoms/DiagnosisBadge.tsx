import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosisBadgeProps {
  code: string;
  description: string;
  isPrimary: boolean;
  onRemove?: () => void;
  onSetPrimary?: () => void;
  readOnly?: boolean;
}

export function DiagnosisBadge({ code, description, isPrimary, onRemove, onSetPrimary, readOnly }: DiagnosisBadgeProps) {
  return (
    <Badge
      variant={isPrimary ? 'default' : 'secondary'}
      className={cn(
        "flex items-center gap-1 text-xs max-w-[280px]",
        readOnly ? "py-0.5 px-1.5" : "py-1 px-2 gap-1.5",
        isPrimary && "bg-primary"
      )}
    >
      {!readOnly && onSetPrimary && (
        <button
          type="button"
          onClick={onSetPrimary}
          className="shrink-0 hover:opacity-80"
          title={isPrimary ? 'Primary diagnosis' : 'Set as primary'}
        >
          <Star className={cn("h-3 w-3", isPrimary ? "fill-current" : "opacity-50")} />
        </button>
      )}
      <span className="font-mono">{code}</span>
      <span className="truncate">{description}</span>
      {!readOnly && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 hover:opacity-80 ml-1"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
