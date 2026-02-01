import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Package, ClipboardCheck, AlertTriangle, ArrowRight } from 'lucide-react';

const plannedFeatures = [
  {
    icon: Package,
    title: 'Inventory Tracking',
    description: 'Real-time stock levels with automatic low-stock alerts',
  },
  {
    icon: ClipboardCheck,
    title: 'Prescription Verification',
    description: 'Digital verification of prescriptions before dispensing',
  },
  {
    icon: AlertTriangle,
    title: 'Reorder Alerts',
    description: 'Automated alerts when medications need to be reordered',
  },
];

export default function PharmacyPlaceholder() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Pill className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy Module</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            A hybrid pharmacy management system supporting both in-house dispensary and external pharmacy partners.
          </p>
        </div>

        {/* Coming Soon Badge */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-medium text-primary">Coming Soon</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete pharmacy management with hybrid dispensing options
            </p>
          </CardContent>
        </Card>

        {/* Planned Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Planned Features</CardTitle>
            <CardDescription>What to expect from the Pharmacy module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plannedFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg border">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hybrid Model Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hybrid Dispensing Model</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our hybrid model allows clinics to manage their in-house pharmacy while seamlessly 
              connecting with external pharmacy partners for specialized medications. Patients 
              can choose where to fill their prescriptions while maintaining a complete 
              medication history in the system.
            </p>
            <div className="mt-4 flex items-center text-sm text-primary">
              <span>Learn more about our pharmacy network</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
