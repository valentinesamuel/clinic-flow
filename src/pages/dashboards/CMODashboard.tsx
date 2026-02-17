import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  TrendingUp,
  Activity,
  AlertTriangle,
  Settings,
  DollarSign,
  Clock,
  UserCheck,
  Wifi,
  WifiOff,
  Search,
  Calendar,
  ChevronRight,
  UserPlus,
  Receipt,
  FileCheck,
} from "lucide-react";
import { usePermissionToggles } from "@/hooks/queries/usePermissionQueries";
import { Link } from "react-router-dom";
import { usePatientSearch } from "@/hooks/queries/usePatientQueries";
import {
  getRecentBills,
  getPendingBills,
  getTotalPendingAmount,
  getTodaysRevenue,
} from "@/data/bills";
import { usePendingClaims } from "@/hooks/queries/useClaimQueries";
import { AppointmentBookingModal } from "@/components/appointments/AppointmentBookingModal";
import { useDashboardActions } from "@/hooks/useDashboardActions";
import { BillingOverviewCard } from "@/components/billing/BillingOverviewCard";
import { RevenueStatsCards } from "@/components/billing/RevenueStatsCards";

export default function CMODashboard() {
  const navigate = useNavigate();
  const { data: toggles } = usePermissionToggles();
  const safeToggles = toggles ?? { hospitalAdminClinicalAccess: false, clinicalLeadFinancialAccess: false };
  const { actions } = useDashboardActions("cmo");

  const [searchQuery, setSearchQuery] = useState("");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  // Fetch patients based on search query
  const { data: patientSearchResults } = usePatientSearch(searchQuery);
  const searchResults = searchQuery.length >= 2 ? (patientSearchResults || []).slice(0, 5) : [];

  // Billing data
  const recentBills = getRecentBills(5);
  const pendingBills = getPendingBills();
  const totalPendingAmount = getTotalPendingAmount();
  const { data: pendingClaims = [] } = usePendingClaims();
  const todaysRevenue = getTodaysRevenue();

  const handleBookAppointment = (patientId: string) => {
    setSelectedPatientId(patientId);
    setBookingModalOpen(true);
  };

  return (
    <DashboardLayout allowedRoles={["cmo"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">CMO Dashboard</h1>
            <p className="text-muted-foreground">Executive overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={actions.viewAppointments}>
              <Calendar className="h-4 w-4 mr-2" />
              View Appointments
            </Button>
            <Link to="/cmo/settings/permissions">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Permission Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Patient Search & Booking */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Patient Management
            </CardTitle>
            <CardDescription>
              Search patients to book appointments or view profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patient by name, MRN, or phone..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-3 border rounded-lg divide-y">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/cmo/patients/${patient.id}`)}
                    >
                      <p className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {patient.mrn} • {patient.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          patient.paymentType === "hmo"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {patient.paymentType.toUpperCase()}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookAppointment(patient.id)}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Book
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/cmo/patients/${patient.id}`)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="mt-3 p-4 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  No patients found
                </p>
                <Button size="sm" onClick={actions.newPatient}>
                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                  Register New Patient
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Today's Patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Today's Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦1.2M</p>
              <p className="text-xs text-muted-foreground">
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Wait Time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">18 min</p>
              <p className="text-xs text-muted-foreground">-5 min from avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Staff on Duty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground">
                3 doctors, 4 nurses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Clinical Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Clinical Summary
              </CardTitle>
              <CardDescription>Patient care overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">In Consultation</span>
                <Badge>5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Triage Queue</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Lab Results</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-destructive">Critical Cases</span>
                <Badge variant="destructive">2</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary - Now with real data */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Financial Summary
                  </CardTitle>
                  <CardDescription>Revenue and collections</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/cmo/billing")}
                >
                  <Receipt className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cash Collected</span>
                <span className="font-medium">
                  ₦{(todaysRevenue.cash / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">HMO Receivables</span>
                <span className="font-medium">
                  ₦{(todaysRevenue.hmo / 1000).toFixed(0)}K
                </span>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                onClick={() => navigate("/cmo/billing/bills?status=pending")}
              >
                <span className="text-sm">Pending Bills</span>
                <Badge variant="secondary">{pendingBills.length}</Badge>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                onClick={() => navigate("/cmo/billing/claims")}
              >
                <span className="text-sm">Pending Claims</span>
                <Badge variant="outline">{pendingClaims.length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing Overview Card */}
          <BillingOverviewCard
            bills={recentBills}
            pendingClaimsCount={pendingClaims.length}
            totalPendingAmount={totalPendingAmount}
            routePrefix="/cmo"
            showDepartmentBadge={true}
          />

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                System Alerts
              </CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">
                  Low Stock: Medical Oxygen
                </p>
                <p className="text-xs text-muted-foreground">
                  5 cylinders remaining (min: 8)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Low Stock: Diesel
                </p>
                <p className="text-xs text-muted-foreground">
                  150L remaining (min: 200L)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium">3 HMO Claims Denied</p>
                <p className="text-xs text-muted-foreground">
                  Review and resubmit required
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Permission Toggles Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Access Control Status
              </CardTitle>
              <CardDescription>Current permission toggles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    Hospital Admin Clinical Access
                  </p>
                  <p className="text-xs text-muted-foreground">
                    View patient records
                  </p>
                </div>
                <Badge
                  variant={
                    safeToggles.hospitalAdminClinicalAccess
                      ? "default"
                      : "secondary"
                  }
                >
                  {safeToggles.hospitalAdminClinicalAccess ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    Clinical Lead Financial Access
                  </p>
                  <p className="text-xs text-muted-foreground">
                    View revenue reports
                  </p>
                </div>
                <Badge
                  variant={
                    safeToggles.clinicalLeadFinancialAccess
                      ? "default"
                      : "secondary"
                  }
                >
                  {safeToggles.clinicalLeadFinancialAccess ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <Link to="/cmo/settings/permissions" className="block">
                <Button variant="outline" className="w-full mt-2">
                  Manage Permissions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Infrastructure and connectivity status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Wifi className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Internet</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">Healthy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <WifiOff className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Lab Integration</p>
                  <p className="text-xs text-muted-foreground">Partial</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Pharmacy Sync</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <AppointmentBookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        initialPatientId={selectedPatientId || undefined}
      />
    </DashboardLayout>
  );
}
