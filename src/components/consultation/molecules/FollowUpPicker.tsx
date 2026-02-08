import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FollowUpPickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  readOnly?: boolean;
}

export function FollowUpPicker({ value, onChange, readOnly }: FollowUpPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value) : undefined;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={readOnly}
            className={cn("justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {value ? format(new Date(value), 'PPP') : 'Select follow-up date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? date.toISOString().split('T')[0] : null);
              setOpen(false);
            }}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {value && !readOnly && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange(null)}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
