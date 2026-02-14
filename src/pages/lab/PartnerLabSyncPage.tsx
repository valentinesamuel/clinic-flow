// Partner Lab Sync Page

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentUploadZone } from '@/components/billing/molecules/documents/DocumentUploadZone';
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
  Send,
  FileText,
  ClipboardList,
} from 'lucide-react';
import {
  getPartnerLabs,
  getConnectedPartnerLabs,
  getReferralsByDirection,
  createReferral,
  updateReferralStatus,
  createInboundReferral,
  receiveOutboundResults,
  makeLabOrderOutbound,
  completeOutboundReferral,
} from '@/data/lab-referrals';
import { testCatalog, getLabOrdersByPatient } from '@/data/lab-orders';
import { getLabOrdersForOutbound } from '@/data/lab-orders';
import { searchPatients, getPatientById } from '@/data/patients';
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('outbound');

  // Dialog visibility
  const [newOutboundOpen, setNewOutboundOpen] = useState(false);
  const [newInboundOpen, setNewInboundOpen] = useState(false);
  const [sendExistingOpen, setSendExistingOpen] = useState(false);
  const [receiveResultsOpen, setReceiveResultsOpen] = useState(false);

  // Outbound form state
  const [outSelectedLab, setOutSelectedLab] = useState('');
  const [outSelectedPatientId, setOutSelectedPatientId] = useState('');
  const [outPatientSearch, setOutPatientSearch] = useState('');
  const [outSelectedTestKeys, setOutSelectedTestKeys] = useState<string[]>([]);
  const [outPriority, setOutPriority] = useState<'routine' | 'urgent'>('routine');
  const [outNotes, setOutNotes] = useState('');

  // Inbound form state
  const [inPatientName, setInPatientName] = useState('');
  const [inPatientPhone, setInPatientPhone] = useState('');
  const [inSelectedLab, setInSelectedLab] = useState('');
  const [inPriority, setInPriority] = useState<'routine' | 'urgent'>('routine');
  const [inNotes, setInNotes] = useState('');
  const [inTests, setInTests] = useState<ReferralTest[]>([{ testCode: '', testName: '' }]);
  const [inAttachmentFiles, setInAttachmentFiles] = useState<File[]>([]);

  // Send existing order state
  const [sendSelectedOrderId, setSendSelectedOrderId] = useState('');
  const [sendSelectedLab, setSendSelectedLab] = useState('');
  const [sendStep, setSendStep] = useState<'select' | 'confirm'>('select');

  // Receive results state
  const [receiveReferralId, setReceiveReferralId] = useState('');
  const [receiveExtRefNumber, setReceiveExtRefNumber] = useState('');
  const [receiveTestResults, setReceiveTestResults] = useState<ReferralTest[]>([]);
  const [receiveAttachmentFiles, setReceiveAttachmentFiles] = useState<File[]>([]);

  // Force re-render counter
  const [, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const partnerLabs = getPartnerLabs();
  const connectedLabs = getConnectedPartnerLabs();
  const outboundReferrals = getReferralsByDirection('outbound');
  const inboundReferrals = getReferralsByDirection('inbound');
  const eligibleLabOrders = getLabOrdersForOutbound();

  const outboundActive = outboundReferrals.filter(
    (ref) => !['completed', 'cancelled'].includes(ref.status)
  );
  const inboundActive = inboundReferrals.filter(
    (ref) => !['completed', 'cancelled'].includes(ref.status)
  );

  // Outbound: patient search & queue tests
  const outSearchResults = outPatientSearch.length >= 2 ? searchPatients(outPatientSearch) : [];
  const outSelectedPatient = outSelectedPatientId ? getPatientById(outSelectedPatientId) : undefined;
  const outPatientQueueOrders = outSelectedPatientId
    ? getLabOrdersByPatient(outSelectedPatientId).filter(
        (o) => ['ordered', 'sample_collected'].includes(o.status) && !o.referralId
      )
    : [];

  // --- Test row helpers (catalog-based) ---
  const handleTestSelect = (
    tests: ReferralTest[],
    setTests: React.Dispatch<React.SetStateAction<ReferralTest[]>>,
    index: number,
    testCode: string
  ) => {
    const entry = testCatalog.find((t) => t.testCode === testCode);
    const updated = [...tests];
    updated[index] = {
      testCode,
      testName: entry?.testName || '',
      unit: entry?.defaultUnit,
      normalRange: entry?.defaultRange,
    };
    setTests(updated);
  };

  const handleAddTestRow = (
    tests: ReferralTest[],
    setTests: React.Dispatch<React.SetStateAction<ReferralTest[]>>
  ) => {
    setTests([...tests, { testCode: '', testName: '' }]);
  };

  const handleRemoveTestRow = (
    tests: ReferralTest[],
    setTests: React.Dispatch<React.SetStateAction<ReferralTest[]>>,
    index: number
  ) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  // --- Outbound dialog handlers ---
  const resetOutboundForm = () => {
    setOutSelectedLab('');
    setOutSelectedPatientId('');
    setOutPatientSearch('');
    setOutSelectedTestKeys([]);
    setOutPriority('routine');
    setOutNotes('');
  };

  const toggleOutboundTestKey = (key: string) => {
    setOutSelectedTestKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCreateOutbound = () => {
    if (!outSelectedLab || !outSelectedPatientId || outSelectedTestKeys.length === 0) {
      toast({ title: 'Validation Error', description: 'Select a patient, at least one test, and a partner lab', variant: 'destructive' });
      return;
    }
    const lab = connectedLabs.find((l) => l.id === outSelectedLab);
    const patient = outSelectedPatient;
    if (!lab || !patient) return;

    // Resolve selected test keys to ReferralTest[]
    const tests: ReferralTest[] = outSelectedTestKeys.map((key) => {
      const [, testCode] = key.split(':');
      for (const order of outPatientQueueOrders) {
        const test = order.tests.find((t) => t.testCode === testCode);
        if (test) return { testCode: test.testCode, testName: test.testName };
      }
      return { testCode, testName: testCode };
    });

    createReferral({
      direction: 'outbound',
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      partnerLabId: lab.id,
      partnerLabName: lab.name,
      tests,
      status: 'pending',
      referredBy: user?.id || 'lab-t-001',
      referredByName: user?.name || 'Lab Tech',
      notes: outNotes,
      priority: outPriority,
    });

    toast({ title: 'Referral Created', description: `Outbound referral to ${lab.name} created successfully` });
    resetOutboundForm();
    setNewOutboundOpen(false);
    refresh();
  };

  // --- Inbound dialog handlers ---
  const resetInboundForm = () => {
    setInPatientName('');
    setInPatientPhone('');
    setInSelectedLab('');
    setInPriority('routine');
    setInNotes('');
    setInTests([{ testCode: '', testName: '' }]);
    setInAttachmentFiles([]);
  };

  const handleCreateInbound = () => {
    if (!inPatientName || !inPatientPhone || !inSelectedLab || inTests.some((t) => !t.testCode)) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    const lab = connectedLabs.find((l) => l.id === inSelectedLab);
    if (!lab) return;

    const attachmentUrls = inAttachmentFiles.map((f) => URL.createObjectURL(f));

    createInboundReferral({
      patientName: inPatientName,
      patientPhone: inPatientPhone,
      partnerLabId: lab.id,
      partnerLabName: lab.name,
      tests: inTests,
      priority: inPriority,
      notes: inNotes,
      attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      referredBy: user?.id || 'lab-t-001',
      referredByName: user?.name || 'Lab Tech',
    });

    toast({ title: 'Inbound Test Registered', description: `Inbound test from ${lab.name} registered and lab order created` });
    resetInboundForm();
    setNewInboundOpen(false);
    refresh();
  };

  // --- Send Existing Order handlers ---
  const resetSendExisting = () => {
    setSendSelectedOrderId('');
    setSendSelectedLab('');
    setSendStep('select');
  };

  const selectedOrder = eligibleLabOrders.find((o) => o.id === sendSelectedOrderId);
  const sendSelectedLabObj = connectedLabs.find((l) => l.id === sendSelectedLab);

  const handleConfirmSendExisting = () => {
    if (!sendSelectedOrderId || !sendSelectedLab) return;
    const lab = connectedLabs.find((l) => l.id === sendSelectedLab);
    if (!lab) return;

    makeLabOrderOutbound(
      sendSelectedOrderId,
      lab.id,
      lab.name,
      user?.id || 'lab-t-001',
      user?.name || 'Lab Tech'
    );

    toast({ title: 'Order Sent to Partner', description: `Lab order sent to ${lab.name} as outbound referral` });
    resetSendExisting();
    setSendExistingOpen(false);
    refresh();
  };

  // --- Receive Results handlers ---
  const openReceiveResults = (referral: LabReferral) => {
    setReceiveReferralId(referral.id);
    setReceiveExtRefNumber('');
    setReceiveTestResults(
      referral.tests.map((t) => ({ ...t, result: '', isAbnormal: false }))
    );
    setReceiveAttachmentFiles([]);
    setReceiveResultsOpen(true);
  };

  const handleSubmitResults = () => {
    if (!receiveExtRefNumber) {
      toast({ title: 'Validation Error', description: 'External reference number is required', variant: 'destructive' });
      return;
    }

    const attachmentUrls = receiveAttachmentFiles.map((f) => URL.createObjectURL(f));

    receiveOutboundResults(
      receiveReferralId,
      receiveExtRefNumber,
      receiveTestResults,
      attachmentUrls.length > 0 ? attachmentUrls : undefined
    );

    toast({ title: 'Results Received', description: 'Outbound referral results have been recorded' });
    setReceiveResultsOpen(false);
    refresh();
  };

  // --- Status actions ---
  const handleUpdateStatus = (id: string, status: ReferralStatus) => {
    updateReferralStatus(id, status);
    toast({ title: 'Status Updated', description: `Referral status updated to ${status.replace('_', ' ')}` });
    refresh();
  };

  const handleCompleteOutbound = (id: string) => {
    completeOutboundReferral(id);
    toast({ title: 'Referral Completed', description: 'Outbound referral marked as completed' });
    refresh();
  };

  // --- Status badge ---
  const getStatusBadge = (status: ReferralStatus) => {
    const variants: Record<ReferralStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string; className?: string }> = {
      pending: { variant: 'default', label: 'Pending' },
      sent: { variant: 'secondary', label: 'Sent' },
      in_transit: { variant: 'outline', label: 'In Transit' },
      received: { variant: 'secondary', label: 'Received' },
      processing: { variant: 'default', label: 'Processing' },
      results_received: { variant: 'default', label: 'Results In', className: 'bg-blue-500' },
      completed: { variant: 'default', label: 'Completed', className: 'bg-green-500' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getLabStatusBadge = (status: PartnerLab['status']) => {
    const variants: Record<PartnerLab['status'], { className: string; label: string }> = {
      connected: { className: 'bg-green-500', label: 'Connected' },
      disconnected: { className: 'bg-red-500', label: 'Disconnected' },
      pending: { className: 'bg-yellow-500', label: 'Pending' },
    };
    const config = variants[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // --- Test row renderer (catalog select) ---
  const renderTestRows = (
    tests: ReferralTest[],
    setTests: React.Dispatch<React.SetStateAction<ReferralTest[]>>
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Tests *</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => handleAddTestRow(tests, setTests)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Test
        </Button>
      </div>
      {tests.map((test, index) => (
        <div key={index} className="grid grid-cols-[2fr,2fr,auto] gap-2">
          <Select
            value={test.testCode}
            onValueChange={(val) => handleTestSelect(tests, setTests, index, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select test..." />
            </SelectTrigger>
            <SelectContent>
              {testCatalog.map((entry) => (
                <SelectItem key={entry.testCode} value={entry.testCode}>
                  {entry.testCode} — {entry.testName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Test Name"
            value={test.testName}
            onChange={(e) => {
              const updated = [...tests];
              updated[index] = { ...updated[index], testName: e.target.value };
              setTests(updated);
            }}
          />
          {tests.length > 1 && (
            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTestRow(tests, setTests, index)}>
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

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
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { resetSendExisting(); setSendExistingOpen(true); }}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Existing Order
                </Button>
                <Button onClick={() => { resetOutboundForm(); setNewOutboundOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Outbound Referral
                </Button>
              </div>
            )}
            {activeTab === 'inbound' && (
              <Button onClick={() => { resetInboundForm(); setNewInboundOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Register Inbound Test
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
                      <TableHead>Tracking / Ref #</TableHead>
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
                            <div className="text-sm space-y-0.5">
                              {referral.trackingNumber && (
                                <div className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  {referral.trackingNumber}
                                </div>
                              )}
                              {referral.externalReferenceNumber && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  {referral.externalReferenceNumber}
                                </div>
                              )}
                            </div>
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
                                  <>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(referral.id, 'in_transit')}>
                                      Mark In Transit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openReceiveResults(referral)}>
                                      <ClipboardList className="h-4 w-4 mr-2" />
                                      Receive Results
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {referral.status === 'in_transit' && (
                                  <DropdownMenuItem onClick={() => openReceiveResults(referral)}>
                                    <ClipboardList className="h-4 w-4 mr-2" />
                                    Receive Results
                                  </DropdownMenuItem>
                                )}
                                {referral.status === 'results_received' && (
                                  <DropdownMenuItem onClick={() => handleCompleteOutbound(referral.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
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
                      <TableHead>Date</TableHead>
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
                              <p className="text-xs text-muted-foreground">
                                {referral.patientPhone ? (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {referral.patientPhone}
                                  </span>
                                ) : (
                                  referral.patientMrn
                                )}
                              </p>
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

        {/* ====== DIALOGS ====== */}

        {/* New Outbound Referral Dialog */}
        <Dialog open={newOutboundOpen} onOpenChange={setNewOutboundOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Outbound Referral</DialogTitle>
              <DialogDescription>
                Select a patient, pick tests from their sample queue, and choose a partner lab.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Patient Search & Selection */}
              <div className="space-y-2">
                <Label>Patient *</Label>
                {outSelectedPatient ? (
                  <Card className="bg-muted/50">
                    <CardContent className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{outSelectedPatient.firstName} {outSelectedPatient.lastName}</p>
                        <p className="text-xs text-muted-foreground">MRN: {outSelectedPatient.mrn} &middot; {outSelectedPatient.phone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setOutSelectedPatientId(''); setOutPatientSearch(''); setOutSelectedTestKeys([]); }}
                      >
                        Change
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={outPatientSearch}
                      onChange={(e) => setOutPatientSearch(e.target.value)}
                      placeholder="Search by name, MRN, or phone..."
                    />
                    {outSearchResults.length > 0 && (
                      <Card className="max-h-48 overflow-y-auto">
                        <CardContent className="p-0">
                          {outSearchResults.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                              onClick={() => {
                                setOutSelectedPatientId(p.id);
                                setOutPatientSearch('');
                                setOutSelectedTestKeys([]);
                              }}
                            >
                              <div>
                                <p className="text-sm font-medium">{p.firstName} {p.lastName}</p>
                                <p className="text-xs text-muted-foreground">{p.mrn}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">{p.phone}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                    {outPatientSearch.length >= 2 && outSearchResults.length === 0 && (
                      <p className="text-xs text-muted-foreground">No patients found</p>
                    )}
                  </div>
                )}
              </div>

              {/* Tests from Sample Queue */}
              {outSelectedPatientId && (
                <div className="space-y-2">
                  <Label>Tests from Sample Queue *</Label>
                  {outPatientQueueOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No pending lab orders in the sample queue for this patient</p>
                  ) : (
                    <div className="space-y-3">
                      {outPatientQueueOrders.map((order) => (
                        <Card key={order.id} className="p-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            Order by {order.doctorName} &middot; {format(new Date(order.orderedAt), 'MMM dd, yyyy')}
                            {order.priority === 'stat' && <Badge variant="destructive" className="ml-2 text-[10px]">STAT</Badge>}
                          </p>
                          <div className="space-y-1.5">
                            {order.tests.map((test) => {
                              const key = `${order.id}:${test.testCode}`;
                              return (
                                <div key={key} className="flex items-center gap-2">
                                  <Checkbox
                                    id={`out-test-${key}`}
                                    checked={outSelectedTestKeys.includes(key)}
                                    onCheckedChange={() => toggleOutboundTestKey(key)}
                                  />
                                  <Label htmlFor={`out-test-${key}`} className="text-sm font-normal cursor-pointer">
                                    {test.testName} <span className="text-muted-foreground">({test.testCode})</span>
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Partner Lab & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Partner Lab *</Label>
                  <Select value={outSelectedLab} onValueChange={setOutSelectedLab}>
                    <SelectTrigger><SelectValue placeholder="Select partner lab" /></SelectTrigger>
                    <SelectContent>
                      {connectedLabs.map((lab) => (
                        <SelectItem key={lab.id} value={lab.id}>{lab.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={outPriority} onValueChange={(val) => setOutPriority(val as 'routine' | 'urgent')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={outNotes} onChange={(e) => setOutNotes(e.target.value)} placeholder="Add any additional notes..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOutboundOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateOutbound} disabled={!outSelectedPatientId || outSelectedTestKeys.length === 0 || !outSelectedLab}>
                Create Referral
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Register Inbound Test Dialog */}
        <Dialog open={newInboundOpen} onOpenChange={setNewInboundOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register Inbound Test</DialogTitle>
              <DialogDescription>
                Register a test from a partner lab patient. Phone number is used as temporary identification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name *</Label>
                  <Input value={inPatientName} onChange={(e) => setInPatientName(e.target.value)} placeholder="Enter patient name" />
                </div>
                <div className="space-y-2">
                  <Label>Patient Phone *</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">+234</span>
                    <Input
                      value={inPatientPhone.replace(/^\+234\s?/, '')}
                      onChange={(e) => setInPatientPhone(`+234${e.target.value.replace(/^\+234/, '')}`)}
                      placeholder="801 234 5678"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Partner Lab Source *</Label>
                  <Select value={inSelectedLab} onValueChange={setInSelectedLab}>
                    <SelectTrigger><SelectValue placeholder="Select source lab" /></SelectTrigger>
                    <SelectContent>
                      {connectedLabs.map((lab) => (
                        <SelectItem key={lab.id} value={lab.id}>{lab.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={inPriority} onValueChange={(val) => setInPriority(val as 'routine' | 'urgent')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {renderTestRows(inTests, setInTests)}
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={inNotes} onChange={(e) => setInNotes(e.target.value)} placeholder="Add any additional notes..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Slip Image</Label>
                <DocumentUploadZone
                  onFilesSelected={setInAttachmentFiles}
                  acceptedTypes=".jpg,.jpeg,.png,.pdf"
                  multiple={false}
                />
                {inAttachmentFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground">{inAttachmentFiles[0].name} selected</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewInboundOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateInbound}>Register Inbound Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Existing Order Dialog */}
        <Dialog open={sendExistingOpen} onOpenChange={(open) => { setSendExistingOpen(open); if (!open) resetSendExisting(); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Send Existing Lab Order to Partner</DialogTitle>
              <DialogDescription>
                Select a lab order to send to a partner lab for processing.
              </DialogDescription>
            </DialogHeader>

            {sendStep === 'select' && (
              <div className="space-y-4 py-4">
                {eligibleLabOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No eligible lab orders available</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Tests</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Order Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleLabOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className={`cursor-pointer ${sendSelectedOrderId === order.id ? 'bg-accent' : ''}`}
                          onClick={() => setSendSelectedOrderId(order.id)}
                        >
                          <TableCell>
                            <input
                              type="radio"
                              checked={sendSelectedOrderId === order.id}
                              onChange={() => setSendSelectedOrderId(order.id)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{order.patientName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{order.patientMrn}</TableCell>
                          <TableCell className="text-sm">{order.tests.map((t) => t.testName).join(', ')}</TableCell>
                          <TableCell className="text-sm">{order.doctorName}</TableCell>
                          <TableCell className="text-sm">{format(new Date(order.orderedAt), 'MMM dd, yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {sendSelectedOrderId && (
                  <div className="space-y-2">
                    <Label>Partner Lab *</Label>
                    <Select value={sendSelectedLab} onValueChange={setSendSelectedLab}>
                      <SelectTrigger><SelectValue placeholder="Select partner lab" /></SelectTrigger>
                      <SelectContent>
                        {connectedLabs.map((lab) => (
                          <SelectItem key={lab.id} value={lab.id}>{lab.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setSendExistingOpen(false)}>Cancel</Button>
                  <Button
                    disabled={!sendSelectedOrderId || !sendSelectedLab}
                    onClick={() => setSendStep('confirm')}
                  >
                    Next
                  </Button>
                </DialogFooter>
              </div>
            )}

            {sendStep === 'confirm' && selectedOrder && sendSelectedLabObj && (
              <div className="space-y-4 py-4">
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-sm">
                      This will send <strong>{selectedOrder.patientName}</strong>&apos;s{' '}
                      <strong>{selectedOrder.tests.map((t) => t.testName).join(', ')}</strong> to{' '}
                      <strong>{sendSelectedLabObj.name}</strong>.
                    </p>
                    {selectedOrder.doctorName && (
                      <p className="text-sm mt-2 text-muted-foreground">
                        When results return, they&apos;ll be routed to <strong>{selectedOrder.doctorName}</strong>.
                      </p>
                    )}
                  </CardContent>
                </Card>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSendStep('select')}>Back</Button>
                  <Button onClick={handleConfirmSendExisting}>Confirm &amp; Send</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Receive Results Dialog */}
        <Dialog open={receiveResultsOpen} onOpenChange={setReceiveResultsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Receive Results</DialogTitle>
              <DialogDescription>
                Enter the results received from the partner lab for this referral.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>External Reference Number *</Label>
                <Input
                  value={receiveExtRefNumber}
                  onChange={(e) => setReceiveExtRefNumber(e.target.value)}
                  placeholder="Partner lab reference number"
                />
              </div>

              <div className="space-y-3">
                <Label>Test Results</Label>
                {receiveTestResults.map((test, index) => (
                  <Card key={test.testCode} className="p-4">
                    <p className="font-medium text-sm mb-3">{test.testName} ({test.testCode})</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Result</Label>
                        <Input
                          value={test.result || ''}
                          onChange={(e) => {
                            const updated = [...receiveTestResults];
                            updated[index] = { ...updated[index], result: e.target.value };
                            setReceiveTestResults(updated);
                          }}
                          placeholder="Enter result"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Unit</Label>
                        <Input
                          value={test.unit || ''}
                          onChange={(e) => {
                            const updated = [...receiveTestResults];
                            updated[index] = { ...updated[index], unit: e.target.value };
                            setReceiveTestResults(updated);
                          }}
                          placeholder="Unit"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Normal Range</Label>
                        <Input
                          value={test.normalRange || ''}
                          onChange={(e) => {
                            const updated = [...receiveTestResults];
                            updated[index] = { ...updated[index], normalRange: e.target.value };
                            setReceiveTestResults(updated);
                          }}
                          placeholder="Normal range"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Checkbox
                        id={`abnormal-${test.testCode}`}
                        checked={test.isAbnormal || false}
                        onCheckedChange={(checked) => {
                          const updated = [...receiveTestResults];
                          updated[index] = { ...updated[index], isAbnormal: checked === true };
                          setReceiveTestResults(updated);
                        }}
                      />
                      <Label htmlFor={`abnormal-${test.testCode}`} className="text-sm">Mark as abnormal</Label>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Result Slip Scan</Label>
                <DocumentUploadZone
                  onFilesSelected={setReceiveAttachmentFiles}
                  acceptedTypes=".jpg,.jpeg,.png,.pdf"
                  multiple={false}
                />
                {receiveAttachmentFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground">{receiveAttachmentFiles[0].name} selected</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReceiveResultsOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitResults}>Submit Results</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
