// Partner Lab Sync Page

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  MoreVertical,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  getPartnerLabs,
  getConnectedPartnerLabs,
  getReferralsByDirection,
  createReferral,
  updateReferralStatus,
} from '@/data/lab-referrals';
import { LabReferral, PartnerLab, ReferralStatus, ReferralTest } from '@/types/lab-referral.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export default function PartnerLabSyncPage() {
  const { toast } = useToast();
  const [newReferralOpen, setNewReferralOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('outbound');

  // Referral form state
  const [selectedLab, setSelectedLab] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientMrn, setPatientMrn] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent'>('routine');
  const [notes, setNotes] = useState('');
  const [tests, setTests] = useState<ReferralTest[]>([{ testCode: '', testName: '' }]);

  const partnerLabs = getPartnerLabs();
  const connectedLabs = getConnectedPartnerLabs();
  const outboundReferrals = getReferralsByDirection('outbound');
  const inboundReferrals = getReferralsByDirection('inbound');

  const outboundActive = outboundReferrals.filter(
    (ref) => !['completed', 'cancelled'].includes(ref.status)
  );
  const inboundActive = inboundReferrals.filter(
    (ref) => !['completed', 'cancelled'].includes(ref.status)
  );

  const handleAddTest = () => {
    setTests([...tests, { testCode: '', testName: '' }]);
  };

  const handleRemoveTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleTestChange = (index: number, field: 'testCode' | 'testName', value: string) => {
    const updatedTests = [...tests];
    updatedTests[index][field] = value;
    setTests(updatedTests);
  };

  const handleCreateReferral = () => {
    if (!selectedLab || !patientName || !patientMrn || tests.some((t) => !t.testCode || !t.testName)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const lab = connectedLabs.find((l) => l.id === selectedLab);
    if (!lab) return;

    createReferral({
      direction: 'outbound',
      patientId: 'pat-new',
      patientName,
      patientMrn,
      partnerLabId: lab.id,
      partnerLabName: lab.name,
      tests,
      status: 'pending',
      referredBy: 'lab-t-001',
      referredByName: 'Chinedu Okafor',
      notes,
      priority,
    });

    toast({
      title: 'Referral Created',
      description: `Referral to ${lab.name} created successfully`,
    });

    // Reset form
    setSelectedLab('');
    setPatientName('');
    setPatientMrn('');
    setPriority('routine');
    setNotes('');
    setTests([{ testCode: '', testName: '' }]);
    setNewReferralOpen(false);
  };

  const handleUpdateStatus = (id: string, status: ReferralStatus) => {
    updateReferralStatus(id, status);
    toast({
      title: 'Status Updated',
      description: `Referral status updated to ${status}`,
    });
  };

  const getStatusBadge = (status: ReferralStatus) => {
    const variants: Record<ReferralStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
      pending: { variant: 'default', label: 'Pending' },
      sent: { variant: 'secondary', label: 'Sent' },
      in_transit: { variant: 'outline', label: 'In Transit' },
      received: { variant: 'secondary', label: 'Received' },
      processing: { variant: 'default', label: 'Processing' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={status === 'completed' ? 'bg-green-500' : ''}>
        {config.label}
      </Badge>
    );
  };

  const getLabStatusBadge = (status: PartnerLab['status']) => {
    const variants: Record<PartnerLab['status'], { className: string, label: string }> = {
      connected: { className: 'bg-green-500', label: 'Connected' },
      disconnected: { className: 'bg-red-500', label: 'Disconnected' },
      pending: { className: 'bg-yellow-500', label: 'Pending' },
    };

    const config = variants[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout allowedRoles={['lab_tech']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Partner Lab Sync</h1>
          <p className="text-muted-foreground">Manage external lab referrals and partnerships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Outbound Active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{outboundActive.length}</p>
              <p className="text-xs text-muted-foreground">Referrals to partner labs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Inbound Active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{inboundActive.length}</p>
              <p className="text-xs text-muted-foreground">Referrals from partner labs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Connected Partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{connectedLabs.length}</p>
              <p className="text-xs text-muted-foreground">Active partnerships</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="outbound">Outbound Referrals</TabsTrigger>
              <TabsTrigger value="inbound">Inbound Referrals</TabsTrigger>
              <TabsTrigger value="partners">Partner Labs</TabsTrigger>
            </TabsList>
            {activeTab === 'outbound' && (
              <Button onClick={() => setNewReferralOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Referral
              </Button>
            )}
          </div>

          {/* Outbound Referrals Tab */}
          <TabsContent value="outbound">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Partner Lab</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outboundReferrals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No outbound referrals
                        </TableCell>
                      </TableRow>
                    ) : (
                      outboundReferrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{referral.patientName}</p>
                              <p className="text-xs text-muted-foreground">{referral.patientMrn}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {referral.tests.map((t) => t.testName).join(', ')}
                            </div>
                          </TableCell>
                          <TableCell>{referral.partnerLabName}</TableCell>
                          <TableCell>{getStatusBadge(referral.status)}</TableCell>
                          <TableCell>
                            {referral.trackingNumber && (
                              <div className="flex items-center gap-1 text-sm">
                                <Truck className="h-3 w-3" />
                                {referral.trackingNumber}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(referral.referredAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {referral.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(referral.id, 'sent')}>
                                    Mark as Sent
                                  </DropdownMenuItem>
                                )}
                                {referral.status === 'sent' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(referral.id, 'in_transit')}>
                                    Mark In Transit
                                  </DropdownMenuItem>
                                )}
                                {referral.status === 'in_transit' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(referral.id, 'completed')}>
                                    Mark Completed
                                  </DropdownMenuItem>
                                )}
                                {!['completed', 'cancelled'].includes(referral.status) && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(referral.id, 'cancelled')}
                                    className="text-destructive"
                                  >
                                    Cancel Referral
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inbound Referrals Tab */}
          <TabsContent value="inbound">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>From Lab</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Received Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inboundReferrals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No inbound referrals
                        </TableCell>
                      </TableRow>
                    ) : (
                      inboundReferrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{referral.patientName}</p>
                              <p className="text-xs text-muted-foreground">{referral.patientMrn}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {referral.tests.map((t) => t.testName).join(', ')}
                            </div>
                          </TableCell>
                          <TableCell>{referral.partnerLabName}</TableCell>
                          <TableCell>{getStatusBadge(referral.status)}</TableCell>
                          <TableCell className="text-sm">
                            {referral.receivedAt
                              ? format(new Date(referral.receivedAt), 'MMM dd, yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {referral.status === 'sent' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(referral.id, 'received')}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark Received
                                  </DropdownMenuItem>
                                )}
                                {referral.status === 'received' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(referral.id, 'processing')}>
                                    Start Processing
                                  </DropdownMenuItem>
                                )}
                                {referral.status === 'processing' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(referral.id, 'completed')}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Complete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partner Labs Tab */}
          <TabsContent value="partners">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerLabs.map((lab) => (
                <Card key={lab.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {lab.name}
                        </CardTitle>
                        <CardDescription className="font-mono text-xs">{lab.code}</CardDescription>
                      </div>
                      {getLabStatusBadge(lab.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {lab.location}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Specializations:</p>
                      <div className="flex flex-wrap gap-1">
                        {lab.specializations.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {lab.lastSyncAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Last sync: {format(new Date(lab.lastSyncAt), 'MMM dd, HH:mm')}
                      </div>
                    )}

                    <div className="pt-3 border-t space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{lab.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{lab.contactEmail}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* New Referral Dialog */}
        <Dialog open={newReferralOpen} onOpenChange={setNewReferralOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Referral</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner-lab">Partner Lab *</Label>
                  <Select value={selectedLab} onValueChange={setSelectedLab}>
                    <SelectTrigger id="partner-lab">
                      <SelectValue placeholder="Select partner lab" />
                    </SelectTrigger>
                    <SelectContent>
                      {connectedLabs.map((lab) => (
                        <SelectItem key={lab.id} value={lab.id}>
                          {lab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as 'routine' | 'urgent')}>
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient Name *</Label>
                  <Input
                    id="patient-name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-mrn">Patient MRN *</Label>
                  <Input
                    id="patient-mrn"
                    value={patientMrn}
                    onChange={(e) => setPatientMrn(e.target.value)}
                    placeholder="Enter MRN"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Tests *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTest}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Test
                  </Button>
                </div>
                {tests.map((test, index) => (
                  <div key={index} className="grid grid-cols-[1fr,2fr,auto] gap-2">
                    <Input
                      placeholder="Test Code"
                      value={test.testCode}
                      onChange={(e) => handleTestChange(index, 'testCode', e.target.value)}
                    />
                    <Input
                      placeholder="Test Name"
                      value={test.testName}
                      onChange={(e) => handleTestChange(index, 'testName', e.target.value)}
                    />
                    {tests.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTest(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setNewReferralOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReferral}>Create Referral</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
