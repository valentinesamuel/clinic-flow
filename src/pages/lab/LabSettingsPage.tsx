import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlaskConical,
  FolderOpen,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  Send,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { testCatalog } from "@/data/lab-orders";

export default function LabSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const basePath = user?.role === "cmo" ? "/cmo" : "/hospital-admin";

  // Workflow settings
  const [autoFillFromCatalog, setAutoFillFromCatalog] = useState(true);
  const [requireTechNotesAbnormal, setRequireTechNotesAbnormal] =
    useState(false);
  const [requireSubmitConfirmation, setRequireSubmitConfirmation] =
    useState(true);
  const [autoNotifyDoctor, setAutoNotifyDoctor] = useState(false);

  // Quality control settings
  const [requireMetadata, setRequireMetadata] = useState(false);
  const [enforceMethodology, setEnforceMethodology] = useState(false);
  const [flagCriticalResults, setFlagCriticalResults] = useState(true);
  const [sendCriticalAlerts, setSendCriticalAlerts] = useState(false);

  // Catalog stats
  const stats = useMemo(() => {
    const categories = new Set(testCatalog.map((t) => t.category));
    const withCriticalValues = testCatalog.filter(
      (t) => t.criticalLow !== undefined || t.criticalHigh !== undefined,
    ).length;
    return {
      totalTests: testCatalog.length,
      categories: categories.size,
      withCriticalValues,
    };
  }, []);

  const previewTests = useMemo(() => testCatalog.slice(0, 5), []);

  const handleToggle = (
    name: string,
    value: boolean,
    setter: (v: boolean) => void,
  ) => {
    setter(value);
    toast({
      title: "Setting Updated",
      description: `${name} has been ${value ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <DashboardLayout allowedRoles={["cmo", "hospital_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            Lab Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure laboratory operations and test catalog
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="catalog">Test Catalog</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
          </TabsList>

          {/* Tab 1: Test Catalog */}
          <TabsContent value="catalog" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tests
                  </CardTitle>
                  <FlaskConical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTests}</div>
                  <p className="text-xs text-muted-foreground">
                    In the catalog
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categories
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.categories}</div>
                  <p className="text-xs text-muted-foreground">
                    Test categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Critical Values
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.withCriticalValues}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    With critical ranges
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Manage Test Catalog */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  Manage Test Catalog
                </CardTitle>
                <CardDescription>
                  View, add, edit, and delete laboratory tests, reference
                  ranges, and critical values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => navigate(`${basePath}/lab/test-catalog`)}
                >
                  Open Test Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Mini Preview */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Recent Tests
                  </p>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Code</TableHead>
                          <TableHead className="text-xs">Name</TableHead>
                          <TableHead className="text-xs">Category</TableHead>
                          <TableHead className="text-xs">Range</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewTests.map((test) => (
                          <TableRow key={test.testCode}>
                            <TableCell className="text-xs font-mono">
                              {test.testCode}
                            </TableCell>
                            <TableCell className="text-xs">
                              {test.testName}
                            </TableCell>
                            <TableCell className="text-xs">
                              <Badge variant="outline" className="text-xs">
                                {test.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {test.defaultRange}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing {previewTests.length} of {stats.totalTests} tests
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Workflow */}
          <TabsContent value="workflow" className="space-y-6">
            {/* Results Entry Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Results Entry
                </CardTitle>
                <CardDescription>
                  Control how lab technicians enter and manage test results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor="auto-fill" className="font-medium">
                      Auto-fill from test catalog
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Pre-populate unit and reference range from the test
                      catalog when entering results
                    </p>
                  </div>
                  <Switch
                    id="auto-fill"
                    checked={autoFillFromCatalog}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Auto-fill from test catalog",
                        checked,
                        setAutoFillFromCatalog,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={autoFillFromCatalog ? "default" : "secondary"}
                    >
                      {autoFillFromCatalog ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {autoFillFromCatalog
                        ? "Unit and range are pre-filled for lab techs"
                        : "Lab techs must enter unit and range manually"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor="require-notes" className="font-medium">
                      Require tech notes for abnormal results
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lab techs must provide technical notes when flagging a
                      result as abnormal
                    </p>
                  </div>
                  <Switch
                    id="require-notes"
                    checked={requireTechNotesAbnormal}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Require tech notes for abnormal results",
                        checked,
                        setRequireTechNotesAbnormal,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        requireTechNotesAbnormal ? "default" : "secondary"
                      }
                    >
                      {requireTechNotesAbnormal ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {requireTechNotesAbnormal
                        ? "Tech notes are mandatory for abnormal results"
                        : "Tech notes are optional for all results"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Result Submission
                </CardTitle>
                <CardDescription>
                  Configure how completed results are submitted to doctors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor="submit-confirm" className="font-medium">
                      Require SUBMIT confirmation
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lab techs must type "SUBMIT" to confirm before sending
                      results to doctors
                    </p>
                  </div>
                  <Switch
                    id="submit-confirm"
                    checked={requireSubmitConfirmation}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Require SUBMIT confirmation",
                        checked,
                        setRequireSubmitConfirmation,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        requireSubmitConfirmation ? "default" : "secondary"
                      }
                    >
                      {requireSubmitConfirmation ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {requireSubmitConfirmation
                        ? "Confirmation dialog required before submission"
                        : "Results can be submitted with a single click"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor="auto-notify" className="font-medium">
                      Auto-notify doctor on submission
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send a notification to the ordering doctor
                      when results are submitted
                    </p>
                  </div>
                  <Switch
                    id="auto-notify"
                    checked={autoNotifyDoctor}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Auto-notify doctor on submission",
                        checked,
                        setAutoNotifyDoctor,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge variant={autoNotifyDoctor ? "default" : "secondary"}>
                      {autoNotifyDoctor ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {autoNotifyDoctor
                        ? "Doctors are notified automatically"
                        : "No automatic notifications sent"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Quality Control */}
          <TabsContent value="quality" className="space-y-6">
            {/* Metadata Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Metadata Requirements
                </CardTitle>
                <CardDescription>
                  Define what additional information lab techs must provide with
                  results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor="require-metadata" className="font-medium">
                      Require metadata for completed tests
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lab techs must add at least one metadata entry (e.g.,
                      methodology, equipment) before completing a test
                    </p>
                  </div>
                  <Switch
                    id="require-metadata"
                    checked={requireMetadata}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Require metadata for completed tests",
                        checked,
                        setRequireMetadata,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge variant={requireMetadata ? "default" : "secondary"}>
                      {requireMetadata ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {requireMetadata
                        ? "Metadata is mandatory for test completion"
                        : "Metadata is optional"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label
                      htmlFor="enforce-methodology"
                      className="font-medium"
                    >
                      Enforce methodology field in test catalog
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require the methodology field to be filled for all test
                      catalog entries
                    </p>
                  </div>
                  <Switch
                    id="enforce-methodology"
                    checked={enforceMethodology}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Enforce methodology field",
                        checked,
                        setEnforceMethodology,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={enforceMethodology ? "default" : "secondary"}
                    >
                      {enforceMethodology ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {enforceMethodology
                        ? "Methodology is required in catalog entries"
                        : "Methodology is optional in catalog entries"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Values */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Critical Values
                </CardTitle>
                <CardDescription>
                  Configure how the system handles results that fall outside
                  critical ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor="flag-critical" className="font-medium">
                      Flag results outside critical ranges
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically highlight results that exceed the critical
                      low or high thresholds defined in the test catalog
                    </p>
                  </div>
                  <Switch
                    id="flag-critical"
                    checked={flagCriticalResults}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Flag results outside critical ranges",
                        checked,
                        setFlagCriticalResults,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={flagCriticalResults ? "default" : "secondary"}
                    >
                      {flagCriticalResults ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {flagCriticalResults
                        ? "Critical results are automatically flagged"
                        : "No automatic flagging of critical results"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 mr-4">
                    <Label htmlFor="critical-alerts" className="font-medium">
                      Send alerts for critical results
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notify the ordering doctor immediately when a result falls
                      in the critical range
                    </p>
                  </div>
                  <Switch
                    id="critical-alerts"
                    checked={sendCriticalAlerts}
                    onCheckedChange={(checked) =>
                      handleToggle(
                        "Send alerts for critical results",
                        checked,
                        setSendCriticalAlerts,
                      )
                    }
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={sendCriticalAlerts ? "default" : "secondary"}
                    >
                      {sendCriticalAlerts ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {sendCriticalAlerts
                        ? "Doctors receive immediate alerts for critical results"
                        : "No automatic alerts for critical results"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        About Critical Value Alerts
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Critical value alerts help catch potentially
                        life-threatening results early. When enabled, doctors
                        are notified immediately, enabling faster clinical
                        intervention. Critical thresholds are defined per-test
                        in the Test Catalog.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
