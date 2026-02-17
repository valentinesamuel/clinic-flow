// Queue Management Utility Functions

/**
 * Calculate wait time in minutes from check-in time
 * @param checkInTime ISO timestamp of check-in
 * @returns Wait time in minutes
 */
export const calculateWaitTime = (checkInTime: string): number => {
  const now = new Date();
  const checkIn = new Date(checkInTime);
  return Math.floor((now.getTime() - checkIn.getTime()) / 60000); // minutes
};
