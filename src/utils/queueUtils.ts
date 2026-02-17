export const calculateWaitTime = (checkInTime: string): number => {
  const now = new Date();
  const checkIn = new Date(checkInTime);
  return Math.floor((now.getTime() - checkIn.getTime()) / 60000); // minutes
};
