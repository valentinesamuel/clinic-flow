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
                    <Route path="/lab-tech/*" element={<LabTechDashboard />} />

                    {/* Patient Routes */}
                    <Route path="/patient" element={<PatientDashboard />} />
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
