import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HMOCoverageConfigTable } from "@/components/billing/organisms/hmo-coverage-config/HMOCoverageConfigTable";
import { Shield } from "lucide-react";

export default function HMOCoverageConfigPage() {
  return (
    <DashboardLayout allowedRoles={["hospital_admin", "cmo"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            HMO Coverage Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure per-service coverage for each HMO provider
          </p>
        </div>

        <HMOCoverageConfigTable />
      </div>
    </DashboardLayout>
  );
}
