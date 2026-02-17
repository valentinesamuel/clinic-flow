import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { VitalSignsCard } from '@/components/clinical/VitalSignsCard';
import { VitalsEntryModal } from '@/components/clinical/VitalsEntryModal';
import { VitalSigns } from '@/types/clinical.types';
import { isVitalAbnormal } from '@/utils/vitalUtils';
import { usePatients } from '@/hooks/queries/usePatientQueries';
import { useVitals } from '@/hooks/queries/useVitalQueries';
import { useStaff } from '@/hooks/queries/useStaffQueries';
import { useCreateVitals } from '@/hooks/mutations/useVitalMutations';
import { useToast } from '@/hooks/use-toast';
import { Activity, AlertTriangle, Plus, Search, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const hasAbnormalVitals = (vital: VitalSigns): boolean => {
  return (
    isVitalAbnormal('bloodPressureSystolic', vital.bloodPressureSystolic).abnormal ||
    isVitalAbnormal('bloodPressureDiastolic', vital.bloodPressureDiastolic).abnormal ||
    isVitalAbnormal('temperature', vital.temperature).abnormal ||
    isVitalAbnormal('pulse', vital.pulse).abnormal ||
    isVitalAbnormal('oxygenSaturation', vital.oxygenSaturation).abnormal ||
    isVitalAbnormal('respiratoryRate', vital.respiratoryRate).abnormal
  );
};

export default function VitalsListPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAbnormal, setFilterAbnormal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const itemsPerPage = 10;

  // Vitals recording modal state
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [showPatientSelector, setShowPatientSelector] = useState(false);

  // Vitals detail dialog state
  const [selectedVital, setSelectedVital] = useState<VitalSigns | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data: vitalsData } = useVitals();
  const { data: patientsData } = usePatients();
  const { data: staffData } = useStaff();
  const createVitals = useCreateVitals();

  const allVitals = vitalsData ?? [];
  const patients = patientsData ?? [];
  const staff = staffData ?? [];

  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getStaffById = (id: string) => staff.find(s => s.id === id);
  const getVitalsByPatient = (patientId: string) =>
    allVitals.filter(v => v.patientId === patientId).sort((a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );

  // Filter vitals
  const filteredVitals = useMemo(() => {
    let results = allVitals;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((vital) => {
        const patient = getPatientById(vital.patientId);
        if (!patient) return false;
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return fullName.includes(query) || patient.mrn.toLowerCase().includes(query);
      });
    }

    if (filterAbnormal) {
      results = results.filter((vital) => hasAbnormalVitals(vital));
    }

    return results;
  }, [allVitals, searchQuery, filterAbnormal]);

  // Pagination
  const totalPages = Math.ceil(filteredVitals.length / itemsPerPage);
  const paginatedVitals = filteredVitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const stats = useMemo(() => {
    const totalToday = allVitals.length;
    const abnormalCount = allVitals.filter((vital) => hasAbnormalVitals(vital)).length;
    const avgBMI =
      allVitals.reduce((sum, vital) => sum + (vital.bmi || 0), 0) / allVitals.length || 0;

    return {
      totalToday,
      abnormalCount,
      avgBMI: avgBMI.toFixed(1),
    };
  }, [allVitals]);

  const handleRecordVitals = () => {
    setShowPatientSelector(true);
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = getPatientById(patientId);
    if (patient) {
      setSelectedPatientId(patientId);
      setSelectedPatientName(`${patient.firstName} ${patient.lastName}`);
      setShowPatientSelector(false);
      setShowVitalsModal(true);
    }
  };

  const handleVitalsSuccess = async (vitals: VitalSigns) => {
    try {
      await createVitals.mutateAsync(vitals);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save vitals',
        variant: 'destructive',
      });
    }
  };

  const handleRowClick = (vital: VitalSigns) => {
    setSelectedVital(vital);
    setShowDetailDialog(true);
  };

  const getVitalStatus = (vital: VitalSigns) => {
    return hasAbnormalVitals(vital) ? 'abnormal' : 'normal';
  };

  const renderVitalValue = (value: number | undefined, isAbnormal: boolean) => {
    if (value === undefined) return '-';
    return (
      <span className={cn(isAbnormal && 'text-red-600 font-semibold')}>
        {value}
      </span>
    );
  };

  // Get trend for vital detail
  const getVitalTrend = (vital: VitalSigns) => {
    const patientVitals = getVitalsByPatient(vital.patientId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    const currentIndex = patientVitals.findIndex((v) => v.id === vital.id);
    if (currentIndex < 0 || currentIndex >= patientVitals.length - 1) return null;
    const previous = patientVitals[currentIndex + 1];
    return {
      previous,
      bpChange: vital.bloodPressureSystolic - previous.bloodPressureSystolic,
      pulseChange: vital.pulse - previous.pulse,
      tempChange: +(vital.temperature - previous.temperature).toFixed(1),
    };
  };

  return (
    <DashboardLayout allowedRoles={['nurse']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patient Vitals</h1>
          <Button onClick={handleRecordVitals}>
            <Plus className="w-4 h-4 mr-2" />
            Record Vitals
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Patients Today
              </CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Abnormal Vitals
              </CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.abnormalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average BMI
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgBMI}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by patient name or MRN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={filterAbnormal ? 'default' : 'outline'}
                onClick={() => setFilterAbnormal(!filterAbnormal)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Abnormal Only
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Vitals Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>BP (mmHg)</TableHead>
                    <TableHead>Temp ({'\u00B0'}C)</TableHead>
                    <TableHead>Pulse (bpm)</TableHead>
                    <TableHead>O2 Sat (%)</TableHead>
                    <TableHead>BMI</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVitals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No vitals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedVitals.map((vital) => {
                      const patient = getPatientById(vital.patientId);
                      if (!patient) return null;

                      const abnormal = hasAbnormalVitals(vital);
                      const bpAbnormal = isVitalAbnormal('bloodPressureSystolic', vital.bloodPressureSystolic).abnormal || isVitalAbnormal('bloodPressureDiastolic', vital.bloodPressureDiastolic).abnormal;
                      const tempAbnormal = isVitalAbnormal('temperature', vital.temperature).abnormal;
                      const pulseAbnormal = isVitalAbnormal('pulse', vital.pulse).abnormal;
                      const o2Abnormal = isVitalAbnormal('oxygenSaturation', vital.oxygenSaturation).abnormal;
                      const bmiAbnormal = vital.bmi > 30 || vital.bmi < 18.5;

                      return (
                        <TableRow
                          key={vital.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(vital)}
                        >
                          <TableCell className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </TableCell>
                          <TableCell>{patient.mrn}</TableCell>
                          <TableCell>
                            <span className={cn(bpAbnormal && 'text-red-600 font-semibold')}>
                              {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                            </span>
                          </TableCell>
                          <TableCell>
                            {renderVitalValue(vital.temperature, !!tempAbnormal)}
                          </TableCell>
                          <TableCell>
                            {renderVitalValue(vital.pulse, !!pulseAbnormal)}
                          </TableCell>
                          <TableCell>
                            {renderVitalValue(vital.oxygenSaturation, !!o2Abnormal)}
                          </TableCell>
                          <TableCell>
                            {renderVitalValue(vital.bmi, !!bmiAbnormal)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(vital.recordedAt), 'HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={abnormal ? 'destructive' : 'success'}>
                              {getVitalStatus(vital)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <QueuePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patient Selector Dialog */}
      <Dialog open={showPatientSelector} onOpenChange={setShowPatientSelector}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={handlePatientSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} ({patient.mrn})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vitals Entry Modal */}
      <VitalsEntryModal
        patientId={selectedPatientId}
        patientName={selectedPatientName}
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        onSuccess={handleVitalsSuccess}
      />

      {/* Vitals Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vital Signs Detail</DialogTitle>
          </DialogHeader>
          {selectedVital && (() => {
            const patient = getPatientById(selectedVital.patientId);
            const recorder = getStaffById(selectedVital.recordedBy);
            const trend = getVitalTrend(selectedVital);
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg">
                      {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      MRN: {patient?.mrn} | Recorded: {format(new Date(selectedVital.recordedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                    {recorder && (
                      <p className="text-sm text-muted-foreground">
                        Recorded by: {recorder.name}
                      </p>
                    )}
                  </div>
                  <Badge variant={hasAbnormalVitals(selectedVital) ? 'destructive' : 'success'}>
                    {hasAbnormalVitals(selectedVital) ? 'Abnormal' : 'Normal'}
                  </Badge>
                </div>

                <VitalSignsCard
                  vitals={selectedVital}
                  showRecordedBy
                  recordedByName={recorder?.name}
                />

                {selectedVital.notes && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedVital.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {trend && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Trend (vs Previous Reading)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">BP Change</p>
                          <p className={cn(
                            'font-medium',
                            trend.bpChange > 0 ? 'text-red-600' : trend.bpChange < 0 ? 'text-green-600' : ''
                          )}>
                            {trend.bpChange > 0 ? '+' : ''}{trend.bpChange} mmHg
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pulse Change</p>
                          <p className={cn(
                            'font-medium',
                            trend.pulseChange > 10 ? 'text-red-600' : trend.pulseChange < -10 ? 'text-yellow-600' : ''
                          )}>
                            {trend.pulseChange > 0 ? '+' : ''}{trend.pulseChange} bpm
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Temp Change</p>
                          <p className={cn(
                            'font-medium',
                            trend.tempChange > 0.5 ? 'text-red-600' : ''
                          )}>
                            {trend.tempChange > 0 ? '+' : ''}{trend.tempChange}{'\u00B0'}C
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Previous reading: {format(new Date(trend.previous.recordedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
