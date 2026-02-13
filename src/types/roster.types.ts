export interface TimeSlot {
  label: string;
  startTime: string;
  endTime: string;
}

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'off';

export const PREDEFINED_SLOTS: Record<ShiftType, TimeSlot | null> = {
  morning: { label: 'Morning', startTime: '07:00', endTime: '15:00' },
  afternoon: { label: 'Afternoon', startTime: '15:00', endTime: '23:00' },
  night: { label: 'Night', startTime: '23:00', endTime: '07:00' },
  off: null,
};

export interface CustomTimeOverride {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface RosterEntry {
  staffId: string;
  staffName: string;
  role: string;
  shifts: Record<string, ShiftType>;
  customTimes?: Record<string, CustomTimeOverride>;
}

export interface WeeklyRoster {
  weekStart: string;
  weekEnd: string;
  entries: RosterEntry[];
}
