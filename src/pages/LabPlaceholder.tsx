import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, Beaker, FileText, Clock, ArrowRight } from 'lucide-react';

const plannedFeatures = [
  {
    icon: FileText,
    title: 'Digital Requisitions',
    description: 'Create and send lab test orders digitally to partner laboratories',
  },
  {
    icon: Clock,
    title: 'Result Tracking',
    description: 'Real-time status updates from sample collection to result delivery',
  },
  {
    icon: Beaker,
    title: 'Auto-Import Results',
    description: 'Automatic import of lab results into patient records',
  },
];

export default function LabPlaceholder() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <TestTube className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Laboratory Integration</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            This module enables seamless integration with external partner laboratories for comprehensive diagnostic services.
          </p>
        </div>

        {/* Coming Soon Badge */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-medium text-primary">Coming Soon</p>
            <p className="text-sm text-muted-foreground mt-1">
              We're working on bringing you powerful lab integration features
            </p>
          </CardContent>
        </Card>

        {/* Planned Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Planned Features</CardTitle>
            <CardDescription>What to expect from the Lab Integration module</CardDescription>
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

        {/* Integration Partners Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We're partnering with leading diagnostic laboratories in Nigeria to bring you accurate, 
              timely results. Partner laboratories undergo rigorous quality assurance to ensure 
              the highest standards of diagnostic accuracy.
            </p>
            <div className="mt-4 flex items-center text-sm text-primary">
              <span>Learn more about our lab partners</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
