// ServicePricingPage - Hospital Admin service pricing management

import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ServicePricingTable } from "@/components/billing/organisms/service-pricing/ServicePricingTable";
import { ArrowLeft, DollarSign } from "lucide-react";

export default function ServicePricingPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout allowedRoles={["hospital_admin", "cmo"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Service Pricing Management
            </h1>
            <p className="text-muted-foreground">
              Manage service prices and submit changes for approval
            </p>
          </div>
        </div>

        <ServicePricingTable />
      </div>
    </DashboardLayout>
  );
}
