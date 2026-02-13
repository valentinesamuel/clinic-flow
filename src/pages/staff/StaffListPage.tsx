import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users, UserCheck, Stethoscope, Heart } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { mockStaff, addStaffMember } from '@/data/staff';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ROLES = ['Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Security', 'Cleaner'];
const DEPARTMENTS = ['General Practice', 'Pediatrics', 'Internal Medicine', 'Nursing', 'Front Desk', 'Pharmacy', 'Laboratory', 'Security', 'Housekeeping'];

const StaffListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add staff form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    specialization: '',
    licenseNumber: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const basePath = user?.role === 'cmo' ? 'cmo' : 'hospital-admin';

  const departments = useMemo(() => {
    const depts = new Set(mockStaff.map(s => s.department));
    return Array.from(depts).sort();
  }, [refreshKey]);

  const filteredStaff = useMemo(() => {
    return mockStaff.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || staff.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'on_duty' && staff.isOnDuty) ||
        (statusFilter === 'off_duty' && !staff.isOnDuty);

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [searchQuery, roleFilter, departmentFilter, statusFilter, refreshKey]);

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    const totalStaff = mockStaff.length;
    const onDuty = mockStaff.filter(s => s.isOnDuty).length;
    const doctors = mockStaff.filter(s => s.role === 'Doctor').length;
    const nurses = mockStaff.filter(s => s.role === 'Nurse').length;

    return { totalStaff, onDuty, doctors, nurses };
  }, [refreshKey]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.department) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStaff = () => {
    setShowAddModal(true);
    setFormData({ name: '', email: '', phone: '', role: '', department: '', specialization: '', licenseNumber: '' });
    setFormErrors({});
  };

  const handleSubmitStaff = () => {
    if (!validateForm()) return;

    addStaffMember({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      specialization: formData.specialization || undefined,
      licenseNumber: formData.licenseNumber || undefined,
      isOnDuty: false,
    });

    toast({
      title: 'Staff Member Added',
      description: `${formData.name} has been added to the staff directory.`,
    });
    setShowAddModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleRowClick = (staffId: string) => {
    navigate(`/${basePath}/staff/${staffId}`);
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' => {
    const roleMap: Record<string, 'default' | 'secondary' | 'outline'> = {
      Doctor: 'default',
      Nurse: 'secondary',
      Pharmacist: 'default',
      'Lab Technician': 'secondary',
      Receptionist: 'outline',
      Security: 'outline',
      Cleaner: 'outline',
    };
    return roleMap[role] || 'outline';
  };

  return (
    <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
            <p className="text-muted-foreground">Manage and view all hospital staff members</p>
          </div>
          <Button onClick={handleAddStaff}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStaff}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Duty</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onDuty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.doctors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nurses</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nurses}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="lab technician">Lab Technician</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="cleaner">Cleaner</SelectItem>
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
                  <SelectTrigger className="w-[160px]">
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
                    <TableHead>Contact</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No staff members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStaff.map(staff => (
                      <TableRow
                        key={staff.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(staff.id)}
                      >
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(staff.role)}>{staff.role}</Badge>
                        </TableCell>
                        <TableCell>{staff.department}</TableCell>
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

            {totalPages > 1 && (
              <div className="mt-4">
                <QueuePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredStaff.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. John Doe"
                />
                {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@deyon.ng"
                />
                {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 xxx xxx xxxx"
                />
                {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.role && <p className="text-sm text-destructive">{formErrors.role}</p>}
              </div>

              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.department && <p className="text-sm text-destructive">{formErrors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label>License Number</Label>
                <Input
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleSubmitStaff}>Add Staff Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StaffListPage;
