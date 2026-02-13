import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { QueueProvider } from "@/contexts/QueueContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Login from "./pages/Login";
import CMODashboard from "./pages/dashboards/CMODashboard";
import HospitalAdminDashboard from "./pages/dashboards/HospitalAdminDashboard";
import ClinicalLeadDashboard from "./pages/dashboards/ClinicalLeadDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import NurseDashboard from "./pages/dashboards/NurseDashboard";
import ReceptionistDashboard from "./pages/dashboards/ReceptionistDashboard";
import BillingDashboard from "./pages/dashboards/BillingDashboard";
import PharmacistDashboard from "./pages/dashboards/PharmacistDashboard";
import LabTechDashboard from "./pages/dashboards/LabTechDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import PermissionSettings from "./pages/settings/PermissionSettings";
import PatientListPage from "./pages/patients/PatientListPage";
import PatientRegistrationPage from "./pages/patients/PatientRegistrationPage";
import PatientProfilePage from "./pages/patients/PatientProfilePage";
import PatientEditPage from "./pages/patients/PatientEditPage";
import AppointmentListPage from "./pages/appointments/AppointmentListPage";
import CheckInQueuePage from "./pages/queue/CheckInQueuePage";
import TriageQueuePage from "./pages/queue/TriageQueuePage";
import DoctorQueuePage from "./pages/queue/DoctorQueuePage";
import BillsListPage from "./pages/billing/BillsListPage";
import ClaimsListPage from "./pages/billing/ClaimsListPage";
import PaymentsListPage from "./pages/billing/PaymentsListPage";
import BillingSettings from "./pages/billing/BillingSettings";
import CashierDashboardPage from "./pages/billing/CashierDashboardPage";
import ServicePricingPage from "./pages/billing/ServicePricingPage";
import PriceApprovalPage from "./pages/billing/PriceApprovalPage";
import PharmacyBillingPage from "./pages/pharmacy/PharmacyBillingPage";
import LabBillingPage from "./pages/lab/LabBillingPage";
import CashierCombinedDashboard from "./pages/dashboards/CashierCombinedDashboard";
import ConsultationPage from "./pages/consultation/ConsultationPage";
import ConsultationViewPage from "./pages/consultation/ConsultationViewPage";
import HMOCoverageConfigPage from "./pages/billing/HMOCoverageConfigPage";
import ClaimDetailPage from "./pages/billing/ClaimDetailPage";
import EpisodeListPage from "./pages/episodes/EpisodeListPage";
import EpisodeDetailPage from "./pages/episodes/EpisodeDetailPage";
import VitalsListPage from "./pages/vitals/VitalsListPage";
import PrescriptionListPage from "./pages/prescriptions/PrescriptionListPage";
import PrescriptionDetailPage from "./pages/prescriptions/PrescriptionDetailPage";
import SampleQueuePage from "./pages/sample-queue/SampleQueuePage";
import ResultsEntryPage from "./pages/lab-results/ResultsEntryPage";
import WaitingRoomPage from "./pages/waiting-room/WaitingRoomPage";
import StaffListPage from "./pages/staff/StaffListPage";
import StaffDetailPage from "./pages/staff/StaffDetailPage";
import MedicalStaffPage from "./pages/medical-staff/MedicalStaffPage";
import RosterPage from "./pages/roster/RosterPage";
import PatientLabResultsPage from "./pages/patient/PatientLabResultsPage";
import LabResultsListPage from "./pages/lab-results/LabResultsListPage";
import PharmacyStockPage from "./pages/pharmacy-stock/PharmacyStockPage";
import InventoryListPage from "./pages/inventory/InventoryListPage";
import ReportsPage from "./pages/reports/ReportsPage";
import ReportsOverviewPage from "./pages/reports/ReportsOverviewPage";
import ExecutiveReportPage from "./pages/reports/ExecutiveReportPage";
import ClaimsReportPage from "./pages/reports/ClaimsReportPage";
import ConsultationReportPage from "./pages/reports/ConsultationReportPage";
import LaboratoryReportPage from "./pages/reports/LaboratoryReportPage";
import PharmacyReportPage from "./pages/reports/PharmacyReportPage";
import NursingReportPage from "./pages/reports/NursingReportPage";
import RadiologyReportPage from "./pages/reports/RadiologyReportPage";
import SurgeryReportPage from "./pages/reports/SurgeryReportPage";
import LabResultDetailPage from "./pages/lab-results/LabResultDetailPage";
import TestCatalogPage from "./pages/lab/TestCatalogPage";
import LabSettingsPage from "./pages/lab/LabSettingsPage";
import PartnerLabSyncPage from "./pages/lab/PartnerLabSyncPage";
import StockRequestsPage from "./pages/stock-requests/StockRequestsPage";
import StockRequestAdminPage from "./pages/stock-requests/StockRequestAdminPage";
import NewStockRequestPage from "./pages/stock-requests/NewStockRequestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PermissionProvider>
        <SyncProvider>
          <QueueProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/login" replace />}
                    />
                    <Route path="/login" element={<Login />} />

                    {/* CMO Routes */}
                    <Route path="/cmo" element={<CMODashboard />} />
                    <Route path="/cmo/patients" element={<PatientListPage />} />
                    <Route
                      path="/cmo/patients/new"
                      element={<PatientRegistrationPage />}
                    />
                    <Route
                      path="/cmo/patients/:id"
                      element={<PatientProfilePage />}
                    />
                    <Route
                      path="/cmo/patients/:id/edit"
                      element={<PatientEditPage />}
                    />
                    <Route
                      path="/cmo/appointments"
                      element={<AppointmentListPage />}
                    />
                    <Route path="/cmo/billing" element={<BillingDashboard />} />
                    <Route
                      path="/cmo/billing/bills"
                      element={<BillsListPage />}
                    />
                    <Route
                      path="/cmo/billing/claims"
                      element={<ClaimsListPage />}
                    />
                    <Route
                      path="/cmo/billing/payments"
                      element={<PaymentsListPage />}
                    />
                    <Route
                      path="/cmo/settings/permissions"
                      element={<PermissionSettings />}
                    />
                    <Route
                      path="/cmo/billing/claims/:id"
                      element={<ClaimDetailPage />}
                    />
                    <Route
                      path="/cmo/settings/hmo-coverage"
                      element={<HMOCoverageConfigPage />}
                    />
                    <Route
                      path="/cmo/episodes"
                      element={<EpisodeListPage />}
                    />
                    <Route
                      path="/cmo/episodes/:id"
                      element={<EpisodeDetailPage />}
                    />
                    <Route
                      path="/cmo/approvals/pricing"
                      element={<PriceApprovalPage />}
                    />
                    <Route path="/cmo/staff" element={<StaffListPage />} />
                    <Route path="/cmo/staff/:id" element={<StaffDetailPage />} />
                    <Route path="/cmo/lab/test-catalog" element={<TestCatalogPage />} />
                    <Route path="/cmo/settings/lab" element={<LabSettingsPage />} />
                    <Route path="/cmo/reports" element={<ReportsOverviewPage />} />
                    <Route path="/cmo/reports/executive" element={<ExecutiveReportPage />} />
                    <Route path="/cmo/reports/claims" element={<ClaimsReportPage />} />
                    <Route path="/cmo/reports/consultation" element={<ConsultationReportPage />} />
                    <Route path="/cmo/reports/laboratory" element={<LaboratoryReportPage />} />
                    <Route path="/cmo/reports/pharmacy" element={<PharmacyReportPage />} />
                    <Route path="/cmo/reports/nursing" element={<NursingReportPage />} />
                    <Route path="/cmo/reports/radiology" element={<RadiologyReportPage />} />
                    <Route path="/cmo/reports/surgery" element={<SurgeryReportPage />} />
                    <Route path="/cmo/consultations/:id" element={<ConsultationViewPage />} />
                    <Route path="/cmo/lab-results" element={<LabResultsListPage />} />
                    <Route path="/cmo/lab-results/:id" element={<LabResultDetailPage />} />
                    <Route path="/cmo/prescriptions" element={<PrescriptionListPage />} />
                    <Route path="/cmo/prescriptions/:id" element={<PrescriptionDetailPage />} />
                    <Route path="/cmo/stock-requests" element={<StockRequestAdminPage />} />
                    <Route path="/cmo/*" element={<CMODashboard />} />

                    {/* Hospital Admin Routes */}
                    <Route
                      path="/hospital-admin"
                      element={<HospitalAdminDashboard />}
                    />
                    <Route
                      path="/hospital-admin/billing"
                      element={<BillingDashboard />}
                    />
                    <Route
                      path="/hospital-admin/billing/bills"
                      element={<BillsListPage />}
                    />
                    <Route
                      path="/hospital-admin/billing/claims"
                      element={<ClaimsListPage />}
                    />
                    <Route
                      path="/hospital-admin/billing/payments"
                      element={<PaymentsListPage />}
                    />
                    <Route
                      path="/hospital-admin/settings/pricing"
                      element={<ServicePricingPage />}
                    />
                    <Route
                      path="/hospital-admin/billing/claims/:id"
                      element={<ClaimDetailPage />}
                    />
                    <Route
                      path="/hospital-admin/settings/hmo-coverage"
                      element={<HMOCoverageConfigPage />}
                    />
                    <Route
                      path="/hospital-admin/episodes"
                      element={<EpisodeListPage />}
                    />
                    <Route
                      path="/hospital-admin/episodes/:id"
                      element={<EpisodeDetailPage />}
                    />
                    <Route path="/hospital-admin/staff" element={<StaffListPage />} />
                    <Route path="/hospital-admin/staff/:id" element={<StaffDetailPage />} />
                    <Route path="/hospital-admin/inventory" element={<InventoryListPage />} />
                    <Route path="/hospital-admin/lab/test-catalog" element={<TestCatalogPage />} />
                    <Route path="/hospital-admin/settings/lab" element={<LabSettingsPage />} />
                    <Route path="/hospital-admin/reports" element={<ReportsOverviewPage />} />
                    <Route path="/hospital-admin/reports/executive" element={<ExecutiveReportPage />} />
                    <Route path="/hospital-admin/reports/claims" element={<ClaimsReportPage />} />
                    <Route path="/hospital-admin/reports/consultation" element={<ConsultationReportPage />} />
                    <Route path="/hospital-admin/reports/laboratory" element={<LaboratoryReportPage />} />
                    <Route path="/hospital-admin/reports/pharmacy" element={<PharmacyReportPage />} />
                    <Route path="/hospital-admin/reports/nursing" element={<NursingReportPage />} />
                    <Route path="/hospital-admin/reports/radiology" element={<RadiologyReportPage />} />
                    <Route path="/hospital-admin/reports/surgery" element={<SurgeryReportPage />} />
                    <Route path="/hospital-admin/consultations/:id" element={<ConsultationViewPage />} />
                    <Route path="/hospital-admin/lab-results" element={<LabResultsListPage />} />
                    <Route path="/hospital-admin/lab-results/:id" element={<LabResultDetailPage />} />
                    <Route path="/hospital-admin/prescriptions" element={<PrescriptionListPage />} />
                    <Route path="/hospital-admin/prescriptions/:id" element={<PrescriptionDetailPage />} />
                    <Route path="/hospital-admin/stock-requests" element={<StockRequestAdminPage />} />
                    <Route
                      path="/hospital-admin/*"
                      element={<HospitalAdminDashboard />}
                    />

                    {/* Clinical Lead Routes */}
                    <Route
                      path="/clinical-lead"
                      element={<ClinicalLeadDashboard />}
                    />
                    <Route
                      path="/clinical-lead/patients"
                      element={<PatientListPage />}
                    />
                    <Route
                      path="/clinical-lead/patients/new"
                      element={<PatientRegistrationPage />}
                    />
                    <Route
                      path="/clinical-lead/patients/:id"
                      element={<PatientProfilePage />}
                    />
                    <Route
                      path="/clinical-lead/patients/:id/edit"
                      element={<PatientEditPage />}
                    />
                    <Route
                      path="/clinical-lead/queue"
                      element={<TriageQueuePage />}
                    />
                    <Route
                      path="/clinical-lead/consultations/:id"
                      element={<ConsultationViewPage />}
                    />
                    <Route path="/clinical-lead/lab-results" element={<LabResultsListPage />} />
                    <Route path="/clinical-lead/lab-results/:id" element={<LabResultDetailPage />} />
                    <Route path="/clinical-lead/staff" element={<MedicalStaffPage />} />
                    <Route path="/clinical-lead/roster" element={<RosterPage />} />
                    <Route
                      path="/clinical-lead/*"
                      element={<ClinicalLeadDashboard />}
                    />

                    {/* Receptionist Routes */}
                    <Route
                      path="/receptionist"
                      element={<ReceptionistDashboard />}
                    />
                    <Route
                      path="/receptionist/patients"
                      element={<PatientListPage />}
                    />
                    <Route
                      path="/receptionist/patients/new"
                      element={<PatientRegistrationPage />}
                    />
                    <Route
                      path="/receptionist/patients/:id"
                      element={<PatientProfilePage />}
                    />
                    <Route
                      path="/receptionist/patients/:id/edit"
                      element={<PatientEditPage />}
                    />
                    <Route
                      path="/receptionist/check-in"
                      element={<CheckInQueuePage />}
                    />
                    <Route
                      path="/receptionist/appointments"
                      element={<AppointmentListPage />}
                    />
                    <Route
                      path="/receptionist/episodes"
                      element={<EpisodeListPage />}
                    />
                    <Route
                      path="/receptionist/episodes/:id"
                      element={<EpisodeDetailPage />}
                    />
                    <Route path="/receptionist/waiting" element={<WaitingRoomPage />} />
                    <Route path="/receptionist/consultations/:id" element={<ConsultationViewPage />} />
                    <Route path="/receptionist/lab-results" element={<LabResultsListPage />} />
                    <Route path="/receptionist/lab-results/:id" element={<LabResultDetailPage />} />
                    <Route path="/receptionist/prescriptions" element={<PrescriptionListPage />} />
                    <Route path="/receptionist/prescriptions/:id" element={<PrescriptionDetailPage />} />
                    <Route path="/receptionist/stock-requests" element={<StockRequestsPage />} />
                    <Route path="/receptionist/stock-requests/new" element={<NewStockRequestPage />} />
                    <Route
                      path="/receptionist/*"
                      element={<ReceptionistDashboard />}
                    />

                    {/* Doctor Routes */}
                    <Route path="/doctor" element={<DoctorDashboard />} />
                    <Route
                      path="/doctor/patients"
                      element={<PatientListPage />}
                    />
                    <Route
                      path="/doctor/patients/new"
                      element={<PatientRegistrationPage />}
                    />
                    <Route
                      path="/doctor/patients/:id"
                      element={<PatientProfilePage />}
                    />
                    <Route
                      path="/doctor/patients/:id/edit"
                      element={<PatientEditPage />}
                    />
                    <Route path="/doctor/queue" element={<DoctorQueuePage />} />
                    <Route
                      path="/doctor/consultation"
                      element={<ConsultationPage />}
                    />
                    <Route
                      path="/doctor/consultation/new"
                      element={<ConsultationPage />}
                    />
                    <Route
                      path="/doctor/consultations/:id"
                      element={<ConsultationViewPage />}
                    />
                    <Route
                      path="/doctor/appointments"
                      element={<AppointmentListPage />}
                    />
                    <Route
                      path="/doctor/episodes"
                      element={<EpisodeListPage />}
                    />
                    <Route
                      path="/doctor/episodes/:id"
                      element={<EpisodeDetailPage />}
                    />
                    <Route path="/doctor/prescriptions" element={<PrescriptionListPage />} />
                    <Route path="/doctor/prescriptions/:id" element={<PrescriptionDetailPage />} />
                    <Route path="/doctor/lab-results" element={<LabResultsListPage />} />
                    <Route path="/doctor/lab-results/:id" element={<LabResultDetailPage />} />
                    <Route path="/doctor/stock-requests" element={<StockRequestsPage />} />
                    <Route path="/doctor/stock-requests/new" element={<NewStockRequestPage />} />
                    <Route path="/doctor/*" element={<DoctorDashboard />} />

                    {/* Nurse Routes */}
                    <Route path="/nurse" element={<NurseDashboard />} />
                    <Route
                      path="/nurse/patients"
                      element={<PatientListPage />}
                    />
                    <Route
                      path="/nurse/patients/new"
                      element={<PatientRegistrationPage />}
                    />
                    <Route
                      path="/nurse/patients/:id"
                      element={<PatientProfilePage />}
                    />
                    <Route
                      path="/nurse/patients/:id/edit"
                      element={<PatientEditPage />}
                    />
                    <Route path="/nurse/triage" element={<TriageQueuePage />} />
                    <Route path="/nurse/queue" element={<TriageQueuePage />} />
                    <Route path="/nurse/vitals" element={<VitalsListPage />} />
                    <Route path="/nurse/stock-requests" element={<StockRequestsPage />} />
                    <Route path="/nurse/stock-requests/new" element={<NewStockRequestPage />} />
                    <Route path="/nurse/*" element={<NurseDashboard />} />

                    {/* Cashier Routes */}
                    <Route path="/cashier" element={<CashierCombinedDashboard />} />
                    <Route path="/cashier/bills" element={<BillsListPage />} />
                    <Route
                      path="/cashier/claims"
                      element={<ClaimsListPage />}
                    />
                    <Route
                      path="/cashier/payments"
                      element={<PaymentsListPage />}
                    />
                    <Route
                      path="/cashier/claims/:id"
                      element={<ClaimDetailPage />}
                    />
                    <Route
                      path="/cashier/episodes"
                      element={<EpisodeListPage />}
                    />
                    <Route
                      path="/cashier/episodes/:id"
                      element={<EpisodeDetailPage />}
                    />
                    <Route
                      path="/cashier/settings"
                      element={<BillingSettings />}
                    />
                    <Route
                      path="/cashier/station"
                      element={<CashierDashboardPage station="main" />}
                    />
                    <Route
                      path="/cashier/station/lab"
                      element={<CashierDashboardPage station="lab" />}
                    />
                    <Route
                      path="/cashier/station/pharmacy"
                      element={<CashierDashboardPage station="pharmacy" />}
                    />
                    <Route path="/cashier/consultations/:id" element={<ConsultationViewPage />} />
                    <Route path="/cashier/lab-results" element={<LabResultsListPage />} />
                    <Route path="/cashier/lab-results/:id" element={<LabResultDetailPage />} />
                    <Route path="/cashier/prescriptions" element={<PrescriptionListPage />} />
                    <Route path="/cashier/prescriptions/:id" element={<PrescriptionDetailPage />} />
                    <Route path="/cashier/*" element={<CashierCombinedDashboard />} />

                    {/* Pharmacist Routes */}
                    <Route
                      path="/pharmacist"
                      element={<PharmacistDashboard />}
                    />
                    <Route
                      path="/pharmacist/billing"
                      element={<PharmacyBillingPage />}
                    />
                    <Route path="/pharmacist/prescriptions" element={<PrescriptionListPage />} />
                    <Route path="/pharmacist/prescriptions/:id" element={<PrescriptionDetailPage />} />
                    <Route path="/pharmacist/stock" element={<PharmacyStockPage />} />
                    <Route path="/pharmacist/stock-requests" element={<StockRequestsPage />} />
                    <Route path="/pharmacist/stock-requests/new" element={<NewStockRequestPage />} />
                    <Route
                      path="/pharmacist/*"
                      element={<PharmacistDashboard />}
                    />

                    {/* Lab Tech Routes */}
                    <Route path="/lab-tech" element={<LabTechDashboard />} />
                    <Route
                      path="/lab-tech/billing"
                      element={<LabBillingPage />}
                    />
                    <Route path="/lab-tech/samples" element={<SampleQueuePage />} />
                    <Route path="/lab-tech/results" element={<ResultsEntryPage />} />
                    <Route path="/lab-tech/results/:id" element={<LabResultDetailPage />} />
                    <Route path="/lab-tech/partner-labs" element={<PartnerLabSyncPage />} />
                    <Route path="/lab-tech/stock-requests" element={<StockRequestsPage />} />
                    <Route path="/lab-tech/stock-requests/new" element={<NewStockRequestPage />} />
                    <Route path="/lab-tech/*" element={<LabTechDashboard />} />

                    {/* Patient Routes */}
                    <Route path="/patient" element={<PatientDashboard />} />
                    <Route path="/patient/results" element={<PatientLabResultsPage />} />
                    <Route path="/patient/*" element={<PatientDashboard />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </NotificationProvider>
          </QueueProvider>
        </SyncProvider>
      </PermissionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
