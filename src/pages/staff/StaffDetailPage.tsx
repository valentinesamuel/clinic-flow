import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Award, FileText, Edit2, Save, X, Users, TrendingUp, Activity, Calendar, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStaffMember, useStaffRoster } from '@/hooks/queries/useStaffQueries';
import { useUpdateStaffMember, useUpdateRoster } from '@/hooks/mutations/useStaffMutations';
import { getEffectiveTime, DAYS, DAY_LABELS, PREDEFINED_SLOTS } from '@/data/roster';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { StaffMember } from '@/types/clinical.types';
import type { ShiftType, CustomTimeOverride } from '@/types/roster.types';

interface PerformanceMetrics {
  patientsSeenOrEquivalent: number;
  consultationsOrActivities: number;
  avgTime?: number;
  shiftsCompleted: number;
}

const SHIFT_COLORS: Record<ShiftType, string> = {
  morning: 'bg-blue-100 text-blue-800 border-blue-200',
  afternoon: 'bg-amber-100 text-amber-800 border-amber-200',
  night: 'bg-purple-100 text-purple-800 border-purple-200',
  off: 'bg-gray-100 text-gray-600 border-gray-200',
};

const StaffDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: staff, isLoading: isLoadingStaff } = useStaffMember(id || '');
  const { data: rosterData, isLoading: isLoadingRoster } = useStaffRoster(id || '');
  const updateStaffMutation = useUpdateStaffMember();
  const updateRosterMutation = useUpdateRoster();

  const basePath = user?.role === 'cmo' ? 'cmo' : 'hospital-admin';

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedStaff, setEditedStaff] = useState<StaffMember | null>(null);
  const [editedShifts, setEditedShifts] = useState<Record<string, ShiftType>>({});
  const [editedCustomTimes, setEditedCustomTimes] = useState<Record<string, CustomTimeOverride>>({});

  const handleBack = () => {
    navigate(`/${basePath}/staff`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Profile editing
  const handleEditProfile = () => {
    if (staff) {
      setEditedStaff({ ...staff });
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = () => {
    if (editedStaff && id) {
      updateStaffMutation.mutate({ id, data: editedStaff }, {
        onSuccess: () => {
          setIsEditingProfile(false);
          setEditedStaff(null);
          toast({ title: 'Profile Updated', description: 'Staff profile has been saved.' });
        },
      });
    }
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setEditedStaff(null);
  };

  const handleInputChange = (field: keyof StaffMember, value: string) => {
    if (editedStaff) {
      setEditedStaff({ ...editedStaff, [field]: value });
    }
  };

  // Schedule editing
  const handleEditSchedule = () => {
    if (rosterData) {
      setEditedShifts({ ...rosterData.shifts });
      // Initialize custom times - use existing or fallback to predefined
      const times: Record<string, CustomTimeOverride> = {};
      DAYS.forEach(d => {
        const shift = rosterData.shifts[d];
        if (shift !== 'off') {
          const custom = rosterData.customTimes?.[d];
          const predefined = PREDEFINED_SLOTS[shift];
          times[d] = custom
            ? { ...custom }
            : predefined
            ? { startTime: predefined.startTime, endTime: predefined.endTime }
            : { startTime: '07:00', endTime: '15:00' };
        }
      });
      setEditedCustomTimes(times);
    } else {
      const defaults: Record<string, ShiftType> = {};
      DAYS.forEach(d => { defaults[d] = 'off'; });
      setEditedShifts(defaults);
      setEditedCustomTimes({});
    }
    setIsEditingSchedule(true);
  };

  const handleSaveSchedule = () => {
    if (!staff) return;

    const customTimes: Record<string, CustomTimeOverride> = {};
    DAYS.forEach(day => {
      const shift = editedShifts[day];
      if (shift !== 'off' && editedCustomTimes[day]) {
        customTimes[day] = editedCustomTimes[day];
      }
    });

    updateRosterMutation.mutate({
      staffId: staff.id,
      staffName: staff.name,
      role: staff.role,
      shifts: editedShifts,
      customTimes: Object.keys(customTimes).length > 0 ? customTimes : undefined,
    }, {
      onSuccess: () => {
        setIsEditingSchedule(false);
        setEditedCustomTimes({});
        toast({ title: 'Schedule Updated', description: 'Weekly schedule has been saved.' });
      },
    });
  };

  const handleCancelSchedule = () => {
    setIsEditingSchedule(false);
    setEditedShifts({});
    setEditedCustomTimes({});
  };

  const handleCreateSchedule = () => {
    if (!staff) return;
    const defaults: Record<string, ShiftType> = {};
    DAYS.forEach(d => { defaults[d] = 'off'; });
    updateRosterMutation.mutate({
      staffId: staff.id,
      staffName: staff.name,
      role: staff.role,
      shifts: defaults,
    }, {
      onSuccess: () => {
        toast({ title: 'Schedule Created', description: 'A default schedule has been created. Click Edit to customize.' });
      },
    });
  };

  const generatePerformanceMetrics = (role: string): PerformanceMetrics => {
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    switch (role.toLowerCase()) {
      case 'doctor':
        return { patientsSeenOrEquivalent: random(120, 180), consultationsOrActivities: random(80, 120), avgTime: random(15, 25), shiftsCompleted: random(15, 22) };
      case 'nurse':
        return { patientsSeenOrEquivalent: random(200, 300), consultationsOrActivities: random(150, 200), shiftsCompleted: random(15, 22) };
      case 'pharmacist':
        return { patientsSeenOrEquivalent: random(100, 150), consultationsOrActivities: random(80, 120), shiftsCompleted: random(15, 22) };
      case 'lab technician':
        return { patientsSeenOrEquivalent: random(80, 120), consultationsOrActivities: random(60, 90), shiftsCompleted: random(15, 22) };
      default:
        return { patientsSeenOrEquivalent: random(50, 100), consultationsOrActivities: random(40, 80), shiftsCompleted: random(15, 22) };
    }
  };

  if (isLoadingStaff || isLoadingRoster) {
    return (
      <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!staff) {
    return (
      <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-muted-foreground">Staff member not found</p>
              <Button onClick={handleBack} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Staff List
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const currentStaff = isEditingProfile ? editedStaff : staff;
  const metrics = generatePerformanceMetrics(staff.role);

  return (
    <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
      <div className="space-y-6">
        {/* 1. Hero Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={handleEditProfile} disabled={isEditingProfile}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <div className="flex flex-col items-center mt-4 gap-3">
              <Avatar className="h-20 w-20">
                <AvatarImage src={staff.photoUrl} alt={staff.name} />
                <AvatarFallback className="text-xl">{getInitials(staff.name)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-2xl font-bold">{staff.name}</h1>
                <div className="flex items-center gap-2 justify-center mt-2">
                  <Badge variant="outline">{staff.role}</Badge>
                  <Badge
                    variant={staff.isOnDuty ? 'default' : 'secondary'}
                    className={staff.isOnDuty ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  >
                    {staff.isOnDuty ? 'On Duty' : 'Off Duty'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {staff.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {staff.phone}</span>
              {staff.licenseNumber && (
                <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> {staff.licenseNumber}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. Performance Metrics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {staff.role.toLowerCase() === 'doctor' && (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Patients Seen</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.patientsSeenOrEquivalent}</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Consultations Completed</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.consultationsOrActivities}</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Consultation Time</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.avgTime} min</div>
                      <p className="text-xs text-muted-foreground">Average duration</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {staff.role.toLowerCase() === 'nurse' && (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Vitals Recorded</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.patientsSeenOrEquivalent}</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Triage Completed</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.consultationsOrActivities}</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {staff.role.toLowerCase() === 'pharmacist' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prescriptions Dispensed</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.patientsSeenOrEquivalent}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              )}

              {staff.role.toLowerCase() === 'lab technician' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Samples Processed</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.patientsSeenOrEquivalent}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shifts Completed</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.shiftsCompleted}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* 3. Side-by-side: Personal Information | Weekly Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  {isEditingProfile ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelProfile}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={handleEditProfile}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    {isEditingProfile ? (
                      <Input value={currentStaff?.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                    ) : (
                      <p className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> {currentStaff?.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    {isEditingProfile ? (
                      <Input type="email" value={currentStaff?.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
                    ) : (
                      <p className="text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {currentStaff?.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    {isEditingProfile ? (
                      <Input type="tel" value={currentStaff?.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
                    ) : (
                      <p className="text-sm flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {currentStaff?.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Department</Label>
                    {isEditingProfile ? (
                      <Input value={currentStaff?.department || ''} onChange={(e) => handleInputChange('department', e.target.value)} />
                    ) : (
                      <p className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {currentStaff?.department}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    {isEditingProfile ? (
                      <Input value={currentStaff?.specialization || ''} onChange={(e) => handleInputChange('specialization', e.target.value)} />
                    ) : (
                      <p className="text-sm flex items-center gap-2"><Award className="h-4 w-4 text-muted-foreground" /> {currentStaff?.specialization || '—'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>License Number</Label>
                    {isEditingProfile ? (
                      <Input value={currentStaff?.licenseNumber || ''} onChange={(e) => handleInputChange('licenseNumber', e.target.value)} />
                    ) : (
                      <p className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> {currentStaff?.licenseNumber || '—'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    {isEditingProfile ? (
                      <Input value={currentStaff?.role || ''} onChange={(e) => handleInputChange('role', e.target.value)} />
                    ) : (
                      <p className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /> {currentStaff?.role}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Weekly Schedule</CardTitle>
                  {rosterData && !isEditingSchedule && (
                    <Button size="sm" variant="ghost" onClick={handleEditSchedule}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  {isEditingSchedule && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveSchedule}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelSchedule}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {rosterData || isEditingSchedule ? (
                  <div className="space-y-2">
                    {DAYS.map((day) => {
                      const shiftType = isEditingSchedule
                        ? editedShifts[day] || 'off'
                        : rosterData?.shifts[day] || 'off';
                      const slot = PREDEFINED_SLOTS[shiftType];
                      const effectiveTime = !isEditingSchedule && rosterData ? getEffectiveTime(rosterData, day) : null;

                      return (
                        <div key={day} className="flex items-center justify-between py-1.5">
                          <span className="text-sm font-medium text-muted-foreground w-20">{DAY_LABELS[day].slice(0, 3)}</span>
                          {isEditingSchedule ? (
                            <div className="flex items-center gap-2">
                              <Select
                                value={editedShifts[day] || 'off'}
                                onValueChange={(value: string) => {
                                  const newShift = value as ShiftType;
                                  setEditedShifts(prev => ({ ...prev, [day]: newShift }));
                                  if (newShift !== 'off') {
                                    const predefined = PREDEFINED_SLOTS[newShift];
                                    if (predefined) {
                                      setEditedCustomTimes(prev => ({
                                        ...prev,
                                        [day]: { startTime: predefined.startTime, endTime: predefined.endTime },
                                      }));
                                    }
                                  } else {
                                    setEditedCustomTimes(prev => {
                                      const updated = { ...prev };
                                      delete updated[day];
                                      return updated;
                                    });
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[110px] text-xs h-7">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="morning">Morning</SelectItem>
                                  <SelectItem value="afternoon">Afternoon</SelectItem>
                                  <SelectItem value="night">Night</SelectItem>
                                  <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                              </Select>
                              {editedShifts[day] !== 'off' && (
                                <>
                                  <Input
                                    type="time"
                                    className="h-7 text-xs w-[90px]"
                                    value={editedCustomTimes[day]?.startTime || '07:00'}
                                    onChange={(e) =>
                                      setEditedCustomTimes(prev => ({
                                        ...prev,
                                        [day]: { ...prev[day], startTime: e.target.value },
                                      }))
                                    }
                                  />
                                  <Input
                                    type="time"
                                    className="h-7 text-xs w-[90px]"
                                    value={editedCustomTimes[day]?.endTime || '15:00'}
                                    onChange={(e) =>
                                      setEditedCustomTimes(prev => ({
                                        ...prev,
                                        [day]: { ...prev[day], endTime: e.target.value },
                                      }))
                                    }
                                  />
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${SHIFT_COLORS[shiftType]}`}>
                                {slot ? slot.label : 'Off'}
                              </Badge>
                              {effectiveTime && (
                                <span className="text-xs text-muted-foreground">
                                  {effectiveTime.startTime}–{effectiveTime.endTime}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No schedule assigned</p>
                    <Button onClick={handleCreateSchedule}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Create Schedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDetailPage;
