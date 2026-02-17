// Appointment Scheduling Utility Functions

import { DoctorAvailability, TimeSlot, Appointment } from '@/types/clinical.types';
import { StaffMember } from '@/types/clinical.types';

interface DoctorInfo {
  id: string;
  name: string;
}

/**
 * Generate time slots for a day
 * @param startHour Start hour (24h format)
 * @param endHour End hour (24h format)
 * @param slotDuration Duration in minutes
 * @returns Array of time slots
 */
export const generateTimeSlots = (
  startHour: number,
  endHour: number,
  slotDuration: number = 30
): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      slots.push(timeStr);
    }
  }
  return slots;
};

/**
 * Get available time slots for a specific doctor on a given date
 * @param doctorId Doctor's ID
 * @param date Date in YYYY-MM-DD format
 * @param existingAppointments List of existing appointments
 * @param slotDuration Duration of each slot in minutes
 * @returns Array of time slots with availability status
 */
export const getAvailableSlots = (
  doctorId: string,
  date: string,
  existingAppointments: Appointment[],
  slotDuration: number = 30
): TimeSlot[] => {
  // Generate slots from 8 AM to 5 PM
  const allSlots = generateTimeSlots(8, 17, slotDuration);

  // Get doctor's appointments for this date
  const doctorAppointments = existingAppointments.filter(
    apt => apt.doctorId === doctorId &&
           apt.scheduledDate === date &&
           apt.status !== 'cancelled' &&
           apt.status !== 'no_show'
  );

  // Mark slots as available or not
  return allSlots.map(time => {
    const hasConflict = doctorAppointments.some(apt => {
      const aptStart = apt.scheduledTime;
      const aptEnd = addMinutes(aptStart, apt.duration);
      return time >= aptStart && time < aptEnd;
    });

    return {
      time,
      available: !hasConflict,
    };
  });
};

/**
 * Add minutes to a time string
 * @param time Time in HH:mm format
 * @param minutes Minutes to add
 * @returns New time in HH:mm format
 */
const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

/**
 * Get doctor availability summary for a given date
 * Refactored to accept staff data as parameter instead of using hardcoded data
 * @param date Date in YYYY-MM-DD format
 * @param doctors List of doctors (from staff)
 * @param existingAppointments List of existing appointments
 * @returns Array of doctor availability summaries
 */
export const getDoctorAvailability = (
  date: string,
  doctors: DoctorInfo[] | StaffMember[],
  existingAppointments: Appointment[]
): DoctorAvailability[] => {
  return doctors.map(doc => {
    const doctorId = 'id' in doc ? doc.id : doc.id;
    const doctorName = 'name' in doc ? doc.name : doc.name;

    const slots = getAvailableSlots(doctorId, date, existingAppointments);
    const availableSlots = slots.filter(s => s.available);

    return {
      doctorId,
      doctorName,
      availableSlots: availableSlots.length,
      nextAvailable: availableSlots[0]?.time,
    };
  });
};
