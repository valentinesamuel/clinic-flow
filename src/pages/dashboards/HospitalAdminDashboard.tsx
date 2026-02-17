// Hospital Administrator Dashboard - Operations & Finance

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
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Package,
  Users,
  Receipt,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useInventory } from "@/hooks/queries/useInventoryQueries";
import {
  getPendingBills,
  getTotalPendingAmount,
  getRecentBills,
} from "@/data/bills";
import { getTotalPendingClaims } from "@/data/claims";
import { usePendingClaims } from "@/hooks/queries/useClaimQueries";
import { useStaff } from "@/hooks/queries/useStaffQueries";
import { BillingOverviewCard } from "@/components/billing/BillingOverviewCard";
import { InventoryItem } from "@/types/billing.types";

export default function HospitalAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canViewClinicalData } = usePermissions({ userRole: user?.role });

  // Fetch staff data
  const { data: staffData } = useStaff();
  const allStaff = staffData || [];

  // Fetch inventory data
  const { data: inventoryData = [] } = useInventory();
  const lowStockItems = (inventoryData as InventoryItem[]).filter(
    (item: InventoryItem) => item.currentStock <= item.reorderLevel
  );
  const criticalItems = (inventoryData as InventoryItem[]).filter(
    (item: InventoryItem) =>
      ['Diesel', 'Medical Oxygen'].includes(item.name) &&
      item.currentStock <= item.reorderLevel
  );

  // Fetch claims data
  const { data: pendingClaims = [] } = usePendingClaims();

  const pendingBills = getPendingBills();

  // Compute non-medical staff and on-duty staff from fetched data
  const nonMedicalStaff = allStaff.filter(
    s => s.role !== 'Doctor' && s.role !== 'Nurse'
  );
  const onDutyStaff = allStaff.filter(s => s.isOnDuty);

  const recentBills = getRecentBills(5);
  const totalPendingAmount = getTotalPendingAmount();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout allowedRoles={["hospital_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Hospital Administrator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Operations, finance & logistics overview
          </p>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Today's Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦1.2M</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8.5% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Expenses (MTD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦4.8M</p>
              <p className="text-xs text-muted-foreground">On budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Pending Bills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingBills.length}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(getTotalPendingAmount())}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Low Stock Items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
              <p className="text-xs text-destructive">
                {criticalItems.length} critical
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Inventory Alerts
              </CardTitle>
              <CardDescription>Items below reorder level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All items adequately stocked
                </p>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border ${
                      criticalItems.some((c) => c.id === item.id)
                        ? "bg-destructive/10 border-destructive/20"
                        : "bg-warning/10 border-warning/20"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.location}
                        </p>
                      </div>
                      <Badge
                        variant={
                          criticalItems.some((c) => c.id === item.id)
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {item.currentStock} {item.unit}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reorder level: {item.reorderLevel} {item.unit}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Non-Medical Staff */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Non-Clinical Staff
              </CardTitle>
              <CardDescription>
                Front desk, security & housekeeping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nonMedicalStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {staff.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {staff.role} • {staff.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant={staff.isOnDuty ? "default" : "secondary"}>
                    {staff.isOnDuty ? "On Duty" : "Off Duty"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* HMO Claims Summary - with click actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>HMO Claims Overview</CardTitle>
                  <CardDescription>Pending claims and status</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/hospital-admin/billing/claims")}
                >
                  Manage
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                onClick={() =>
                  navigate("/hospital-admin/billing/claims?status=draft")
                }
              >
                <span className="text-sm">Draft Claims</span>
                <Badge variant="outline">
                  {pendingClaims.filter((c) => c.status === "draft").length}
                </Badge>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                onClick={() =>
                  navigate("/hospital-admin/billing/claims?status=submitted")
                }
              >
                <span className="text-sm">Submitted</span>
                <Badge variant="secondary">
                  {pendingClaims.filter((c) => c.status === "submitted").length}
                </Badge>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                onClick={() =>
                  navigate("/hospital-admin/billing/claims?status=processing")
                }
              >
                <span className="text-sm">Processing</span>
                <Badge>
                  {
                    pendingClaims.filter((c) => c.status === "processing")
                      .length
                  }
                </Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Total Pending Value
                  </span>
                  <span className="font-bold">
                    {formatCurrency(getTotalPendingClaims())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Overview */}
          <BillingOverviewCard
            bills={recentBills}
            pendingClaimsCount={pendingClaims.length}
            totalPendingAmount={totalPendingAmount}
            routePrefix="/hospital-admin"
            showDepartmentBadge={true}
          />

          {/* Conditional Clinical Access */}
          {canViewClinicalData && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Extended Access
                  </Badge>
                </CardTitle>
                <CardDescription>Clinical data (read-only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Patients Today</span>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Consultation</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Lab Results</span>
                  <span className="font-medium">12</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This access was granted by the CMO
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
