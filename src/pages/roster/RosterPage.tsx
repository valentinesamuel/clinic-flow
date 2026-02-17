import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users, AlertCircle, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoster } from '@/hooks/queries/useStaffQueries';
import { useUpdateRoster } from '@/hooks/mutations/useStaffMutations';
import { DAYS, DAY_LABELS, PREDEFINED_SLOTS, getEffectiveTime, type ShiftType } from '@/utils/rosterUtils';
import { useToast } from '@/hooks/use-toast';

interface ShiftEditState {
  staffId: string;
  staffName: string;
  day: string;
  currentShift: ShiftType;
}

const RosterPage = () => {
  const { toast } = useToast();
  const { data: rosterData = [], isLoading } = useRoster();
  const updateRosterMutation = useUpdateRoster();
  const [weekOffset, setWeekOffset] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editState, setEditState] = useState<ShiftEditState | null>(null);
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType>('morning');
  const [customStartTime, setCustomStartTime] = useState('07:00');
  const [customEndTime, setCustomEndTime] = useState('15:00');

  const getShiftBadgeClasses = (shift: ShiftType): string => {
    const classMap: Record<ShiftType, string> = {
      morning: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      afternoon: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
      night: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
      off: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
    };
    return classMap[shift];
  };

  const getShiftLabel = (shift: ShiftType): string => {
    const labelMap: Record<ShiftType, string> = {
      morning: 'Morning',
      afternoon: 'Afternoon',
      night: 'Night',
      off: 'Off',
    };
    return labelMap[shift];
  };

  const getShiftTimeRange = (shift: ShiftType): string => {
    const timeSlot = PREDEFINED_SLOTS[shift];
    if (!timeSlot) return '';
    return `${timeSlot.startTime} - ${timeSlot.endTime}`;
  };

  const stats = useMemo(() => {
    const totalSlots = rosterData.length * DAYS.length;
    const assignedShifts = rosterData.reduce((count, entry) => {
      return count + DAYS.filter(day => entry.shifts[day] !== 'off').length;
    }, 0);
    const unassignedSlots = totalSlots - assignedShifts;
    const coveragePercentage = totalSlots > 0 ? Math.round((assignedShifts / totalSlots) * 100) : 0;

    return {
      coveragePercentage,
      unassignedSlots,
    };
  }, [rosterData]);

  const handleShiftClick = (staffId: string, staffName: string, day: string, currentShift: ShiftType) => {
    setEditState({ staffId, staffName, day, currentShift });
    setSelectedShiftType(currentShift);

    // Initialize from existing custom times if present, otherwise use predefined
    const entry = rosterData.find(e => e.staffId === staffId);
    const existingCustom = entry?.customTimes?.[day];
    if (existingCustom) {
      setCustomStartTime(existingCustom.startTime);
      setCustomEndTime(existingCustom.endTime);
    } else {
      const timeSlot = PREDEFINED_SLOTS[currentShift];
      if (timeSlot) {
        setCustomStartTime(timeSlot.startTime);
        setCustomEndTime(timeSlot.endTime);
      }
    }

    setIsDialogOpen(true);
  };

  const handleSaveShift = () => {
    if (!editState) return;

    const entry = rosterData.find(e => e.staffId === editState.staffId);
    if (!entry) return;

    const customTime = selectedShiftType !== 'off'
      ? { startTime: customStartTime, endTime: customEndTime }
      : undefined;

    const updatedShifts = { ...entry.shifts, [editState.day]: selectedShiftType };
    const updatedCustomTimes = { ...entry.customTimes };
    if (customTime) {
      updatedCustomTimes[editState.day] = customTime;
    } else {
      delete updatedCustomTimes[editState.day];
    }

    updateRosterMutation.mutate({
      staffId: editState.staffId,
      staffName: entry.staffName,
      role: entry.role,
      shifts: updatedShifts,
      customTimes: Object.keys(updatedCustomTimes).length > 0 ? updatedCustomTimes : undefined,
    }, {
      onSuccess: () => {
        const displayTime = customTime ? `${customTime.startTime} - ${customTime.endTime}` : '';
        toast({
          title: 'Shift updated',
          description: `${editState.staffName}'s ${DAY_LABELS[editState.day]} shift has been set to ${getShiftLabel(selectedShiftType)}${
            displayTime ? ` (${displayTime})` : ''
          }`,
        });
        setIsDialogOpen(false);
        setEditState(null);
      },
    });
  };

  const handleShiftTypeChange = (value: ShiftType) => {
    setSelectedShiftType(value);
    const timeSlot = PREDEFINED_SLOTS[value];
    if (timeSlot) {
      setCustomStartTime(timeSlot.startTime);
      setCustomEndTime(timeSlot.endTime);
    }
  };

  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  return (
    <DashboardLayout allowedRoles={['clinical_lead']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Weekly Roster</h1>
            <p className="text-muted-foreground">View and manage staff shift assignments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 rounded-md border px-4 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Week {weekOffset === 0 ? '(Current)' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}
              </span>
            </div>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coveragePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                Shifts assigned out of total slots
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unassigned Slots</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unassignedSlots}</div>
              <p className="text-xs text-muted-foreground">
                Off-duty periods in the week
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shift Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Staff Member</TableHead>
                    {DAYS.map(day => (
                      <TableHead key={day} className="text-center">
                        {DAY_LABELS[day]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoster.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No roster entries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    mockRoster.map(entry => (
                      <TableRow key={entry.staffId}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{entry.staffName}</p>
                            <p className="text-xs text-muted-foreground">{entry.role}</p>
                          </div>
                        </TableCell>
                        {DAYS.map(day => {
                          const effectiveTime = getEffectiveTime(entry, day);
                          return (
                            <TableCell key={day} className="text-center">
                              <div
                                className="inline-flex flex-col items-center gap-1 cursor-pointer"
                                onClick={() => handleShiftClick(entry.staffId, entry.staffName, day, entry.shifts[day])}
                              >
                                <Badge className={getShiftBadgeClasses(entry.shifts[day])}>
                                  {getShiftLabel(entry.shifts[day])}
                                </Badge>
                                {effectiveTime && (
                                  <span className="text-xs text-muted-foreground">
                                    {effectiveTime.startTime} - {effectiveTime.endTime}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Morning</Badge>
                <span className="text-sm text-muted-foreground">07:00 - 15:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Afternoon</Badge>
                <span className="text-sm text-muted-foreground">15:00 - 23:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Night</Badge>
                <span className="text-sm text-muted-foreground">23:00 - 07:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Off</Badge>
                <span className="text-sm text-muted-foreground">Off duty</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Shift</DialogTitle>
              <DialogDescription>
                {editState && (
                  <>
                    Set shift for <span className="font-semibold">{editState.staffName}</span> on{' '}
                    <span className="font-semibold">{DAY_LABELS[editState.day]}</span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="shift-type">Shift Type</Label>
                <Select value={selectedShiftType} onValueChange={handleShiftTypeChange}>
                  <SelectTrigger id="shift-type">
                    <SelectValue placeholder="Select shift type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">
                      <div className="flex items-center gap-2">
                        <span>Morning</span>
                        <span className="text-xs text-muted-foreground">07:00 - 15:00</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="afternoon">
                      <div className="flex items-center gap-2">
                        <span>Afternoon</span>
                        <span className="text-xs text-muted-foreground">15:00 - 23:00</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="night">
                      <div className="flex items-center gap-2">
                        <span>Night</span>
                        <span className="text-xs text-muted-foreground">23:00 - 07:00</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="off">Off Duty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedShiftType !== 'off' && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    <span>Custom Time Range</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time" className="text-xs">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={customStartTime}
                        onChange={(e) => setCustomStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time" className="text-xs">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={customEndTime}
                        onChange={(e) => setCustomEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Custom times are for display purposes. Shift type determines the default schedule.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveShift}>Save Shift</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RosterPage;
