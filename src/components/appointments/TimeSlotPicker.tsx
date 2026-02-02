// TimeSlotPicker - Available time slots grid for appointment booking

import { useMemo } from 'react';
import { format, parse, addMinutes, isBefore, isEqual } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types/clinical.types';

interface TimeSlotPickerProps {
  date: Date;
  doctorId: string;
  duration?: number;
  selectedTime?: string;
  existingAppointments?: Appointment[];
  onSelect: (time: string) => void;
  startHour?: number;
  endHour?: number;
  breakStart?: string;
  breakEnd?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  isPast: boolean;
}

export function TimeSlotPicker({
  date,
  doctorId,
  duration = 30,
  selectedTime,
  existingAppointments = [],
  onSelect,
  startHour = 8,
  endHour = 17,
  breakStart = '13:00',
  breakEnd = '14:00',
}: TimeSlotPickerProps) {
  const slots = useMemo(() => {
    const result: TimeSlot[] = [];
    const now = new Date();
    const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
    
    const dayStart = new Date(date);
    dayStart.setHours(startHour, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(endHour, 0, 0, 0);
    
    const breakStartTime = parse(breakStart, 'HH:mm', date);
    const breakEndTime = parse(breakEnd, 'HH:mm', date);
    
    // Get appointments for this doctor on this date
    const dateStr = format(date, 'yyyy-MM-dd');
    const doctorAppointments = existingAppointments.filter(
      apt => apt.doctorId === doctorId && 
             apt.scheduledDate === dateStr &&
             !['cancelled', 'no_show'].includes(apt.status)
    );
    
    let current = new Date(dayStart);
    
    while (isBefore(current, dayEnd)) {
      const timeStr = format(current, 'HH:mm');
      const slotEnd = addMinutes(current, duration);
      
      // Check if slot is during break
      const isDuringBreak = 
        (isBefore(current, breakEndTime) || isEqual(current, breakEndTime)) && 
        isBefore(breakStartTime, slotEnd);
      
      // Check if slot is in the past
      const isPast = isToday && isBefore(current, now);
      
      // Check if slot conflicts with existing appointment
      const hasConflict = doctorAppointments.some(apt => {
        const aptStart = parse(apt.scheduledTime, 'HH:mm', date);
        const aptEnd = addMinutes(aptStart, apt.duration);
        return (
          (isBefore(current, aptEnd) || isEqual(current, aptEnd)) && 
          isBefore(aptStart, slotEnd)
        );
      });
      
      result.push({
        time: timeStr,
        available: !isDuringBreak && !isPast && !hasConflict,
        isPast,
      });
      
      current = addMinutes(current, duration);
    }
    
    return result;
  }, [date, doctorId, duration, existingAppointments, startHour, endHour, breakStart, breakEnd]);

  // Group slots by period
  const morningSlots = slots.filter(s => parseInt(s.time.split(':')[0]) < 12);
  const afternoonSlots = slots.filter(s => parseInt(s.time.split(':')[0]) >= 12);

  const availableCount = slots.filter(s => s.available).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {availableCount} slots available
        </p>
        <p className="text-xs text-muted-foreground">
          {duration} min appointments
        </p>
      </div>

      {/* Morning Slots */}
      <div>
        <p className="text-sm font-medium mb-2">Morning</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {morningSlots.map(slot => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? 'default' : 'outline'}
              size="sm"
              disabled={!slot.available}
              onClick={() => onSelect(slot.time)}
              className={cn(
                'h-9',
                !slot.available && 'opacity-40 cursor-not-allowed',
                selectedTime === slot.time && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              {slot.time}
            </Button>
          ))}
        </div>
      </div>

      {/* Break indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>Lunch Break ({breakStart} - {breakEnd})</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Afternoon Slots */}
      <div>
        <p className="text-sm font-medium mb-2">Afternoon</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {afternoonSlots.map(slot => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? 'default' : 'outline'}
              size="sm"
              disabled={!slot.available}
              onClick={() => onSelect(slot.time)}
              className={cn(
                'h-9',
                !slot.available && 'opacity-40 cursor-not-allowed',
                selectedTime === slot.time && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              {slot.time}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
