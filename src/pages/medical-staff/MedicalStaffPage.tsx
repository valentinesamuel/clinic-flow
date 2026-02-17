import { useState, useMemo } from 'react';
import { Search, Stethoscope, UserCheck, Heart } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStaff } from '@/hooks/queries/useStaffQueries';

const MedicalStaffPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch staff data
  const { data: staffData, isLoading } = useStaff();
  const allStaff = staffData || [];

  // Filter for medical staff only (doctors and nurses)
  const medicalStaff = allStaff.filter(s => s.role === 'Doctor' || s.role === 'Nurse');

  const departments = useMemo(() => {
    const depts = new Set(medicalStaff.map(s => s.department));
    return Array.from(depts).sort();
  }, [medicalStaff]);

  const filteredStaff = useMemo(() => {
    return medicalStaff.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (staff.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesRole = roleFilter === 'all' || staff.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'on_duty' && staff.isOnDuty) ||
        (statusFilter === 'off_duty' && !staff.isOnDuty);

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [searchQuery, roleFilter, departmentFilter, statusFilter, medicalStaff]);

  const stats = useMemo(() => {
    const totalMedicalStaff = medicalStaff.length;
    const doctorsOnDuty = medicalStaff.filter(s => s.role === 'Doctor' && s.isOnDuty).length;
    const nursesOnDuty = medicalStaff.filter(s => s.role === 'Nurse' && s.isOnDuty).length;

    return { totalMedicalStaff, doctorsOnDuty, nursesOnDuty };
  }, [medicalStaff]);

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' => {
    return role === 'Doctor' ? 'default' : 'secondary';
  };

  return (
    <DashboardLayout allowedRoles={['clinical_lead']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Staff</h1>
          <p className="text-muted-foreground">View and manage medical personnel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medical Staff</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMedicalStaff}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors On Duty</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.doctorsOnDuty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nurses On Duty</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nursesOnDuty}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="on_duty">On Duty</SelectItem>
                    <SelectItem value="off_duty">Off Duty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No medical staff members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map(staff => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(staff.role)}>{staff.role}</Badge>
                        </TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>
                          {staff.specialization || <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                        <TableCell>{staff.phone}</TableCell>
                        <TableCell>
                          {staff.shiftStart && staff.shiftEnd
                            ? `${staff.shiftStart} - ${staff.shiftEnd}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={staff.isOnDuty ? 'default' : 'secondary'}
                            className={
                              staff.isOnDuty
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                            }
                          >
                            {staff.isOnDuty ? 'On Duty' : 'Off Duty'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MedicalStaffPage;
