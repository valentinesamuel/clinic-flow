// Pharmacist Dashboard - Hybrid Module with Coming Soon indicators

import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pill,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  Receipt,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { usePendingPrescriptions, usePrescriptions } from '@/hooks/queries/usePrescriptionQueries';
import { useInventory } from '@/hooks/queries/useInventoryQueries';
import { useBills } from '@/hooks/queries/useBillQueries';
import { Prescription } from '@/types/clinical.types';
import { InventoryItem, Bill } from '@/types/billing.types';

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const { data: pendingPrescriptions = [] } = usePendingPrescriptions();
  const { data: allPrescriptions = [] } = usePrescriptions();
  const { data: allInventory = [] } = useInventory();
  const { data: allBills = [] } = useBills();
  const todaysPrescriptions = (allPrescriptions as Prescription[]);
  const medicines = (allInventory as InventoryItem[]).filter((i: InventoryItem) => i.category === 'medicine');
  const lowStockMedicines = (allInventory as InventoryItem[]).filter((i: InventoryItem) => i.category === 'medicine' && i.currentStock <= i.reorderLevel);
  const pendingPharmacyBills = (allBills as Bill[]).filter((b: Bill) => b.department === 'pharmacy' && b.status === 'pending');

  return (
    <DashboardLayout allowedRoles={['pharmacist']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">Dispensing and stock management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Rx
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingPrescriptions.length}</p>
              <p className="text-xs text-muted-foreground">Awaiting dispensing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Dispensed Today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {todaysPrescriptions.filter(p => p.status === 'dispensed').length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Medicine Items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{medicines.length}</p>
              <p className="text-xs text-muted-foreground">In inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Low Stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{lowStockMedicines.length}</p>
              <p className="text-xs text-muted-foreground">Need reorder</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card
            className="border-primary/30 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/pharmacist/billing')}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Receipt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Pharmacy Billing</p>
                    <p className="text-sm text-muted-foreground">
                      {pendingPharmacyBills.length} pending bills
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/pharmacist/billing'); }}>
                    Manage Bills
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-primary/30 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/pharmacist/stock')}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Stock Management</p>
                    <p className="text-sm text-muted-foreground">
                      {lowStockMedicines.length} low stock alerts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/pharmacist/stock'); }}>
                    Check Stock
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Prescription Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Prescription Queue
              </CardTitle>
              <CardDescription>Pending prescriptions to dispense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingPrescriptions.slice(0, 5).map((rx) => (
                <div
                  key={rx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
                  onClick={() => navigate(`/pharmacist/prescriptions/${rx.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium">{rx.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {rx.items.length} item{rx.items.length > 1 ? 's' : ''} • Dr. {rx.doctorName.split(' ').pop()}
                    </p>
                  </div>
                  <Badge variant="outline">{rx.status}</Badge>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate('/pharmacist/prescriptions')}
              >
                View All Prescriptions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Stock Alerts - Functional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Stock Alerts
              </CardTitle>
              <CardDescription>Medicines below reorder level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockMedicines.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All medicines adequately stocked
                </p>
              ) : (
                lowStockMedicines.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.supplier}</p>
                      </div>
                      <Badge variant="secondary">
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

          {/* Dispensing Log */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Dispensing Log</CardTitle>
              <CardDescription>Today's dispensed medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todaysPrescriptions.filter(p => p.status === 'dispensed').slice(0, 5).map((rx) => (
                  <div key={rx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                      <p className="text-sm font-medium">{rx.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {rx.items.map(i => i.drugName).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Dispensed</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(rx.dispensedAt!).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
