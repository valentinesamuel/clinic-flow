import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SyncProvider } from "@/contexts/SyncContext";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import NurseDashboard from "./pages/dashboards/NurseDashboard";
import BillingDashboard from "./pages/dashboards/BillingDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import LabPlaceholder from "./pages/LabPlaceholder";
import PharmacyPlaceholder from "./pages/PharmacyPlaceholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SyncProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Role-based dashboards */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/*" element={<DoctorDashboard />} />
              
              <Route path="/nurse" element={<NurseDashboard />} />
              <Route path="/nurse/*" element={<NurseDashboard />} />
              
              <Route path="/billing" element={<BillingDashboard />} />
              <Route path="/billing/*" element={<BillingDashboard />} />
              
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/*" element={<PatientDashboard />} />
              
              {/* Hybrid module placeholders */}
              <Route path="/lab" element={<LabPlaceholder />} />
              <Route path="/pharmacy" element={<PharmacyPlaceholder />} />
              
              {/* Settings (placeholder) */}
              <Route path="/settings" element={<AdminDashboard />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SyncProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
