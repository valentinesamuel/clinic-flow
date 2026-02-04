import { cn } from '@/lib/utils';
import { PAGINATION } from '@/constants/designSystem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PageSizeSelectorProps {
  value: number;
  options?: readonly number[] | number[];
  onChange: (size: number) => void;
  className?: string;
}

export function PageSizeSelector({
  value,
  options = PAGINATION.pageSizeOptions,
  onChange,
  className,
}: PageSizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="text-muted-foreground whitespace-nowrap">Show</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground whitespace-nowrap">per page</span>
    </div>
  );
}
