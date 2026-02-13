import { RosterEntry, ShiftType, CustomTimeOverride, PREDEFINED_SLOTS } from '@/types/roster.types';

export type { ShiftType, RosterEntry, CustomTimeOverride };
export { PREDEFINED_SLOTS };

export const mockRoster: RosterEntry[] = [
  {
    staffId: 'usr-004',
    staffName: 'Dr. Chukwuemeka Nwosu',
    role: 'Doctor',
    shifts: { mon: 'morning', tue: 'morning', wed: 'morning', thu: 'morning', fri: 'morning', sat: 'off', sun: 'off' },
    customTimes: { mon: { startTime: '08:00', endTime: '14:00' } },
  },
  {
    staffId: 'doc-002',
    staffName: 'Dr. Amaka Obi',
    role: 'Doctor',
    shifts: { mon: 'morning', tue: 'morning', wed: 'off', thu: 'morning', fri: 'morning', sat: 'morning', sun: 'off' },
  },
  {
    staffId: 'doc-003',
    staffName: 'Dr. Ibrahim Musa',
    role: 'Doctor',
    shifts: { mon: 'afternoon', tue: 'afternoon', wed: 'afternoon', thu: 'afternoon', fri: 'off', sat: 'off', sun: 'afternoon' },
  },
  {
    staffId: 'usr-005',
    staffName: 'Fatima Ibrahim',
    role: 'Nurse',
    shifts: { mon: 'morning', tue: 'morning', wed: 'morning', thu: 'morning', fri: 'morning', sat: 'off', sun: 'off' },
    customTimes: { tue: { startTime: '06:30', endTime: '14:30' } },
  },
  {
    staffId: 'nur-002',
    staffName: 'Adaeze Okoli',
    role: 'Nurse',
    shifts: { mon: 'afternoon', tue: 'afternoon', wed: 'afternoon', thu: 'afternoon', fri: 'afternoon', sat: 'off', sun: 'off' },
  },
  {
    staffId: 'nur-003',
    staffName: 'Joseph Okonkwo',
    role: 'Nurse',
    shifts: { mon: 'night', tue: 'night', wed: 'night', thu: 'off', fri: 'off', sat: 'night', sun: 'night' },
  },
];

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

export const getStaffRoster = (staffId: string): RosterEntry | undefined =>
  mockRoster.find((entry) => entry.staffId === staffId);

export const updateRosterShift = (
  staffId: string,
  day: string,
  shift: ShiftType
): RosterEntry | undefined => {
  const entry = mockRoster.find((e) => e.staffId === staffId);
  if (entry) {
    entry.shifts[day] = shift;
  }
  return entry;
};

export const updateRosterShiftWithTime = (
  staffId: string,
  day: string,
  shift: ShiftType,
  customTime?: CustomTimeOverride
): RosterEntry | undefined => {
  const entry = mockRoster.find((e) => e.staffId === staffId);
  if (!entry) return undefined;

  entry.shifts[day] = shift;

  if (!entry.customTimes) entry.customTimes = {};

  if (shift === 'off' || !customTime) {
    delete entry.customTimes[day];
  } else {
    const predefined = PREDEFINED_SLOTS[shift];
    if (predefined && customTime.startTime === predefined.startTime && customTime.endTime === predefined.endTime) {
      delete entry.customTimes[day];
    } else {
      entry.customTimes[day] = customTime;
    }
  }

  // Clean up empty customTimes
  if (Object.keys(entry.customTimes).length === 0) {
    delete entry.customTimes;
  }

  return entry;
};

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

export const createRosterEntry = (entry: RosterEntry): RosterEntry => {
  mockRoster.push(entry);
  return entry;
};
