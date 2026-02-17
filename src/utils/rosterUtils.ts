// Roster Management Utility Functions

import { RosterEntry, ShiftType, PREDEFINED_SLOTS } from '@/types/roster.types';

// Day constants
export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

/**
 * Get effective time for a roster entry on a specific day
 * Returns custom time if set, otherwise predefined slot time
 * @param entry Roster entry
 * @param day Day of week key
 * @returns Start and end time, or null if off
 */
export const getEffectiveTime = (
  entry: RosterEntry,
  day: string
): { startTime: string; endTime: string } | null => {
  const shift = entry.shifts[day];
  if (shift === 'off') return null;

  const custom = entry.customTimes?.[day];
  if (custom) return custom;

  const predefined = PREDEFINED_SLOTS[shift];
  if (predefined) return { startTime: predefined.startTime, endTime: predefined.endTime };

  return null;
};
