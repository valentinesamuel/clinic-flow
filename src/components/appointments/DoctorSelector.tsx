// DoctorSelector - Doctor selection with availability info

import { useState, useMemo } from 'react';
import { Check, User, Stethoscope, Clock } from 'lucide-react';
import { StaffMember } from '@/types/clinical.types';
import { useDoctors } from '@/hooks/queries/useStaffQueries';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DoctorSelectorProps {
  value?: string;
  onSelect: (doctorId: string, doctor: StaffMember) => void;
  date?: Date;
  showAvailability?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

interface DoctorOption extends StaffMember {
  availableSlots?: number;
}

export function DoctorSelector({
  value,
  onSelect,
  date,
  showAvailability = true,
  placeholder = 'Select doctor...',
  disabled = false,
}: DoctorSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: allDoctors = [] } = useDoctors();

  const doctors = useMemo(() => {
    // In a real app, we'd calculate available slots based on date
    // For now, we'll simulate availability
    return (allDoctors as any[]).map(doc => ({
      ...doc,
      availableSlots: Math.floor(Math.random() * 10) + 1,
    })) as DoctorOption[];
  }, [date, allDoctors]);

  const selectedDoctor = doctors.find(d => d.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          {selectedDoctor ? (
            <div className="flex items-center gap-2 truncate">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="truncate">{selectedDoctor.name}</span>
              {selectedDoctor.specialization && (
                <span className="text-muted-foreground text-xs">
                  ({selectedDoctor.specialization})
                </span>
              )}
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
          <Stethoscope className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search doctors..." />
          <CommandList>
            <CommandEmpty>No doctors found.</CommandEmpty>
            <CommandGroup>
              {doctors.map((doctor) => (
                <CommandItem
                  key={doctor.id}
                  value={doctor.name}
                  onSelect={() => {
                    onSelect(doctor.id, doctor);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{doctor.name}</p>
                        {doctor.isOnDuty && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200 text-xs h-5">
                            On Duty
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doctor.specialization || doctor.department}</span>
                        {showAvailability && doctor.availableSlots !== undefined && (
                          <>
                            <span>•</span>
                            <span className={cn(
                              doctor.availableSlots > 5 ? 'text-green-600' :
                              doctor.availableSlots > 2 ? 'text-amber-600' : 'text-destructive'
                            )}>
                              {doctor.availableSlots} slots
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4 shrink-0',
                      value === doctor.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Simple list variant for booking wizard
export function DoctorList({
  value,
  onSelect,
  showAnyDoctor = true,
}: {
  value?: string;
  onSelect: (doctorId: string | undefined, doctor?: StaffMember) => void;
  showAnyDoctor?: boolean;
}) {
  const { data: doctors = [] } = useDoctors();

  return (
    <div className="space-y-2">
      {showAnyDoctor && (
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className={cn(
            'w-full flex items-center gap-3 p-4 rounded-lg border transition-colors text-left',
            value === undefined
              ? 'border-primary bg-primary/5 ring-2 ring-primary'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          )}
        >
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Stethoscope className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Any Available Doctor</p>
            <p className="text-sm text-muted-foreground">
              First available doctor will be assigned
            </p>
          </div>
        </button>
      )}
      
      {doctors.map((doctor) => (
        <button
          key={doctor.id}
          type="button"
          onClick={() => onSelect(doctor.id, doctor)}
          className={cn(
            'w-full flex items-center gap-3 p-4 rounded-lg border transition-colors text-left',
            value === doctor.id
              ? 'border-primary bg-primary/5 ring-2 ring-primary'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          )}
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium">{doctor.name}</p>
              {doctor.isOnDuty && (
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200 text-xs">
                  On Duty
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {doctor.specialization || doctor.department}
            </p>
            {doctor.shiftStart && doctor.shiftEnd && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>{doctor.shiftStart} - {doctor.shiftEnd}</span>
              </div>
            )}
          </div>
          {value === doctor.id && (
            <Check className="h-5 w-5 text-primary shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}
