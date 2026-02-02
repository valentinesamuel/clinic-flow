import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { PermissionProvider } from "@/contexts/PermissionContext";

// Pages
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PermissionProvider>
        <SyncProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                
                {/* CMO Routes */}
                <Route path="/cmo" element={<CMODashboard />} />
                <Route path="/cmo/patients" element={<PatientListPage />} />
                <Route path="/cmo/patients/new" element={<PatientRegistrationPage />} />
                <Route path="/cmo/patients/:id" element={<PatientProfilePage />} />
                <Route path="/cmo/patients/:id/edit" element={<PatientEditPage />} />
                <Route path="/cmo/settings/permissions" element={<PermissionSettings />} />
                <Route path="/cmo/*" element={<CMODashboard />} />
                
                {/* Hospital Admin Routes */}
                <Route path="/hospital-admin" element={<HospitalAdminDashboard />} />
                <Route path="/hospital-admin/*" element={<HospitalAdminDashboard />} />
                
                {/* Clinical Lead Routes */}
                <Route path="/clinical-lead" element={<ClinicalLeadDashboard />} />
                <Route path="/clinical-lead/patients" element={<PatientListPage />} />
                <Route path="/clinical-lead/patients/new" element={<PatientRegistrationPage />} />
                <Route path="/clinical-lead/patients/:id" element={<PatientProfilePage />} />
                <Route path="/clinical-lead/patients/:id/edit" element={<PatientEditPage />} />
                <Route path="/clinical-lead/*" element={<ClinicalLeadDashboard />} />
                
                {/* Receptionist Routes */}
                <Route path="/receptionist" element={<ReceptionistDashboard />} />
                <Route path="/receptionist/patients" element={<PatientListPage />} />
                <Route path="/receptionist/patients/new" element={<PatientRegistrationPage />} />
                <Route path="/receptionist/patients/:id" element={<PatientProfilePage />} />
                <Route path="/receptionist/patients/:id/edit" element={<PatientEditPage />} />
                <Route path="/receptionist/*" element={<ReceptionistDashboard />} />
                
                {/* Doctor Routes */}
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/doctor/patients" element={<PatientListPage />} />
                <Route path="/doctor/patients/new" element={<PatientRegistrationPage />} />
                <Route path="/doctor/patients/:id" element={<PatientProfilePage />} />
                <Route path="/doctor/patients/:id/edit" element={<PatientEditPage />} />
                <Route path="/doctor/*" element={<DoctorDashboard />} />
                
                {/* Nurse Routes */}
                <Route path="/nurse" element={<NurseDashboard />} />
                <Route path="/nurse/patients" element={<PatientListPage />} />
                <Route path="/nurse/patients/new" element={<PatientRegistrationPage />} />
                <Route path="/nurse/patients/:id" element={<PatientProfilePage />} />
                <Route path="/nurse/patients/:id/edit" element={<PatientEditPage />} />
                <Route path="/nurse/*" element={<NurseDashboard />} />
                
                {/* Billing Routes */}
                <Route path="/billing" element={<BillingDashboard />} />
                <Route path="/billing/*" element={<BillingDashboard />} />
                
                {/* Pharmacist Routes */}
                <Route path="/pharmacist" element={<PharmacistDashboard />} />
                <Route path="/pharmacist/*" element={<PharmacistDashboard />} />
                
                {/* Lab Tech Routes */}
                <Route path="/lab-tech" element={<LabTechDashboard />} />
                <Route path="/lab-tech/*" element={<LabTechDashboard />} />
                
                {/* Patient Routes */}
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/patient/*" element={<PatientDashboard />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SyncProvider>
      </PermissionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
