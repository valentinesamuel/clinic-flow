import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, FlaskConical, Search } from 'lucide-react';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { useTestCatalog } from '@/hooks/queries/useLabQueries';
import type { TestCatalogEntry } from '@/types/clinical.types';

export default function TestCatalogPage() {
  const { toast } = useToast();
  const { data: testCatalogData = [] } = useTestCatalog();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTest, setEditingTest] = useState<TestCatalogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<TestCatalogEntry | null>(null);

  // Form state
  const [formData, setFormData] = useState<TestCatalogEntry>({
    testCode: '',
    testName: '',
    category: '',
    defaultUnit: '',
    defaultRange: '',
    criticalLow: undefined,
    criticalHigh: undefined,
    methodology: '',
    preparationInstructions: '',
    sampleType: '',
  });

  // Get all tests and categories
  const allTests = useMemo((): TestCatalogEntry[] => {
    return testCatalogData;
  }, [testCatalogData, refreshKey]);

  const categoryList = useMemo(() => {
    return Array.from(new Set(allTests.map((test) => test.category))).sort();
  }, [allTests]);

  const categoriesCount = categoryList.length;

  // Filter tests based on search query and category
  const filteredTests = useMemo((): TestCatalogEntry[] => {
    let result = allTests;

    if (categoryFilter !== 'all') {
      result = result.filter((test) => test.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (test) =>
          test.testCode.toLowerCase().includes(query) ||
          test.testName.toLowerCase().includes(query) ||
          test.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [allTests, searchQuery, categoryFilter]);

  // Pagination
  const totalItems = filteredTests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTests = filteredTests.slice(startIndex, endIndex);

  const handleOpenAddDialog = (): void => {
    setEditingTest(null);
    setFormData({
      testCode: '',
      testName: '',
      category: '',
      defaultUnit: '',
      defaultRange: '',
      criticalLow: undefined,
      criticalHigh: undefined,
      methodology: '',
      preparationInstructions: '',
      sampleType: '',
    });
    setShowDialog(true);
  };

  const handleOpenEditDialog = (test: TestCatalogEntry): void => {
    setEditingTest(test);
    setFormData({ ...test });
    setShowDialog(true);
  };

  const handleCloseDialog = (): void => {
    setShowDialog(false);
    setEditingTest(null);
    setFormData({
      testCode: '',
      testName: '',
      category: '',
      defaultUnit: '',
      defaultRange: '',
      criticalLow: undefined,
      criticalHigh: undefined,
      methodology: '',
      preparationInstructions: '',
      sampleType: '',
    });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    try {
      if (editingTest) {
        // Update existing test - mock implementation
        toast({
          title: 'Test Updated',
          description: `${formData.testName} has been updated successfully.`,
        });
      } else {
        // Add new test - mock implementation
        toast({
          title: 'Test Added',
          description: `${formData.testName} has been added to the catalog.`,
        });
      }

      setRefreshKey((prev) => prev + 1);
      handleCloseDialog();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save test. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: keyof TestCatalogEntry, value: string | number | undefined): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleDeleteTest = (): void => {
    if (!deleteTarget) return;
    // Mock delete implementation
    setRefreshKey((prev) => prev + 1);
    toast({
      title: 'Test Deleted',
      description: `${deleteTarget.testName} has been removed from the catalog.`,
    });
    setDeleteTarget(null);
  };

  const handlePageSizeChange = (size: number): void => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout allowedRoles={['cmo', 'hospital_admin']}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test Catalog</h1>
            <p className="text-muted-foreground">
              Manage laboratory test reference ranges and configurations
            </p>
          </div>
          <Button onClick={handleOpenAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Test
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTests.length}</div>
              <p className="text-xs text-muted-foreground">
                Laboratory test types available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Badge variant="outline">{categoriesCount}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoriesCount}</div>
              <p className="text-xs text-muted-foreground">
                Distinct test categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Category Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by test code, name, or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryList.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Code</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Critical Low</TableHead>
                  <TableHead>Critical High</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No tests found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTests.map((test) => (
                    <TableRow key={test.testCode}>
                      <TableCell className="font-mono font-medium">
                        {test.testCode}
                      </TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{test.category}</Badge>
                      </TableCell>
                      <TableCell>{test.defaultUnit}</TableCell>
                      <TableCell>{test.defaultRange}</TableCell>
                      <TableCell>
                        {test.criticalLow !== undefined ? test.criticalLow : '-'}
                      </TableCell>
                      <TableCell>
                        {test.criticalHigh !== undefined ? test.criticalHigh : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(test)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(test)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalItems > 0 && (
          <QueuePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTest ? 'Edit Test' : 'Add New Test'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testCode">Test Code</Label>
                  <Input
                    id="testCode"
                    value={formData.testCode}
                    onChange={(e) => handleInputChange('testCode', e.target.value)}
                    readOnly={!!editingTest}
                    required
                    className={editingTest ? 'bg-muted' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testName">Test Name</Label>
                  <Input
                    id="testName"
                    value={formData.testName}
                    onChange={(e) => handleInputChange('testName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultUnit">Unit</Label>
                  <Input
                    id="defaultUnit"
                    value={formData.defaultUnit}
                    onChange={(e) => handleInputChange('defaultUnit', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultRange">Reference Range</Label>
                <Input
                  id="defaultRange"
                  value={formData.defaultRange}
                  onChange={(e) => handleInputChange('defaultRange', e.target.value)}
                  required
                  placeholder="e.g., 3.5-5.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="criticalLow">Critical Low</Label>
                  <Input
                    id="criticalLow"
                    type="number"
                    step="any"
                    value={formData.criticalLow ?? ''}
                    onChange={(e) =>
                      handleInputChange(
                        'criticalLow',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticalHigh">Critical High</Label>
                  <Input
                    id="criticalHigh"
                    type="number"
                    step="any"
                    value={formData.criticalHigh ?? ''}
                    onChange={(e) =>
                      handleInputChange(
                        'criticalHigh',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="methodology">Methodology</Label>
                  <Input
                    id="methodology"
                    value={formData.methodology ?? ''}
                    onChange={(e) => handleInputChange('methodology', e.target.value)}
                    placeholder="e.g., HPLC, Enzymatic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <Input
                    id="sampleType"
                    value={formData.sampleType ?? ''}
                    onChange={(e) => handleInputChange('sampleType', e.target.value)}
                    placeholder="e.g., Serum, Whole Blood"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preparationInstructions">Preparation Instructions</Label>
                <Textarea
                  id="preparationInstructions"
                  value={formData.preparationInstructions ?? ''}
                  onChange={(e) => handleInputChange('preparationInstructions', e.target.value)}
                  placeholder="e.g., 12-hour fasting required"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTest ? 'Update Test' : 'Add Test'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.testName}</strong> ({deleteTarget?.testCode})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
