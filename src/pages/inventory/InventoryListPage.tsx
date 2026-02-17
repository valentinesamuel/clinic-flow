import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { useInventory } from '@/hooks/queries/useInventoryQueries';
import { useCreateInventoryItem, useUpdateInventoryItem } from '@/hooks/mutations/useInventoryMutations';
import { InventoryItem } from '@/types/billing.types';
import { format } from 'date-fns';
import { Search, Package, AlertTriangle, DollarSign, Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CategoryFilter = 'all' | 'medicine' | 'consumable' | 'equipment' | 'utility';
type StockStatus = 'all' | 'in_stock' | 'low' | 'out';

export default function InventoryListPage() {
  const { toast } = useToast();
  const { data: inventoryData = [] } = useInventory();
  const createInventoryItem = useCreateInventoryItem();
  const updateInventoryItemMutation = useUpdateInventoryItem();
  const mockInventory = inventoryData as InventoryItem[];
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<StockStatus>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Dialog states
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Archive dialog states
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<InventoryItem | null>(null);
  const [archiveInput, setArchiveInput] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'medicine' as InventoryItem['category'],
    unit: '',
    currentStock: 0,
    reorderLevel: 0,
    unitCost: 0,
    supplier: '',
    expiryDate: '',
    location: '',
  });

  const getStockStatus = (item: InventoryItem): 'in_stock' | 'low' | 'out' => {
    if (item.currentStock === 0) return 'out';
    if (item.currentStock <= item.reorderLevel) return 'low';
    return 'in_stock';
  };

  const filteredItems = useMemo(() => {
    let filtered = [...mockInventory];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (stockStatusFilter !== 'all') {
      filtered = filtered.filter(item => getStockStatus(item) === stockStatusFilter);
    }

    return filtered;
  }, [searchQuery, categoryFilter, stockStatusFilter, refreshKey]);

  // Pagination calculations
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddDialog = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      category: 'medicine',
      unit: '',
      currentStock: 0,
      reorderLevel: 0,
      unitCost: 0,
      supplier: '',
      expiryDate: '',
      location: '',
    });
    setShowItemDialog(true);
  };

  const handleOpenEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      reorderLevel: item.reorderLevel,
      unitCost: item.unitCost,
      supplier: item.supplier || '',
      expiryDate: item.expiryDate || '',
      location: item.location || '',
    });
    setShowItemDialog(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      updateInventoryItemMutation.mutate({ id: editingItem.id, ...itemForm });
      toast({
        title: 'Item Updated',
        description: `${itemForm.name} has been updated successfully.`,
      });
    } else {
      createInventoryItem.mutate(itemForm);
      toast({
        title: 'Item Added',
        description: `${itemForm.name} has been added to inventory.`,
      });
    }
    setShowItemDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenArchiveDialog = (item: InventoryItem) => {
    setArchiveTarget(item);
    setArchiveInput('');
    setShowArchiveDialog(true);
  };

  const handleArchiveItem = () => {
    if (archiveInput === 'ARCHIVE' && archiveTarget) {
      updateInventoryItemMutation.mutate({ id: archiveTarget.id, archived: true });
      toast({
        title: 'Item Archived',
        description: `${archiveTarget.name} has been archived successfully.`,
        variant: 'destructive',
      });
      setShowArchiveDialog(false);
      setArchiveTarget(null);
      setArchiveInput('');
      setRefreshKey(prev => prev + 1);
    }
  };

  const stats = useMemo(() => {
    const totalItems = mockInventory.length;
    const lowStockItems = mockInventory.filter(item =>
      getStockStatus(item) === 'low' || getStockStatus(item) === 'out'
    ).length;
    const categories = new Set(mockInventory.map(item => item.category)).size;
    const totalInventoryValue = mockInventory.reduce((sum, item) =>
      sum + (item.currentStock * item.unitCost), 0
    );

    return { totalItems, lowStockItems, categories, totalInventoryValue };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStockStatusBadge = (status: 'in_stock' | 'low' | 'out') => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Low Stock</Badge>;
      case 'out':
        return <Badge variant="destructive">Out of Stock</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['hospital_admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hospital Inventory</h1>
            <p className="text-muted-foreground mt-2">
              Complete inventory management for all hospital supplies and equipment
            </p>
          </div>
          <Button onClick={handleOpenAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.totalItems}</div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.lowStockItems}</div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.categories}</div>
                <Layers className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(stats.totalInventoryValue)}</div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by item name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="utility">Utility</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockStatusFilter} onValueChange={(value) => setStockStatusFilter(value as StockStatus)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.currentStock}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.reorderLevel}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitCost)}
                        </TableCell>
                        <TableCell>{item.supplier || 'N/A'}</TableCell>
                        <TableCell>
                          {item.expiryDate
                            ? format(new Date(item.expiryDate), 'MMM dd, yyyy')
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {getStockStatusBadge(getStockStatus(item))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditDialog(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenArchiveDialog(item)}
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <QueuePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setItemsPerPage(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={itemForm.category}
                  onValueChange={(value) => setItemForm({ ...itemForm, category: value as InventoryItem['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="consumable">Consumable</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="utility">Utility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={itemForm.unit}
                  onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                  placeholder="e.g., tablets, boxes, units"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={itemForm.supplier}
                  onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={itemForm.currentStock}
                  onChange={(e) => setItemForm({ ...itemForm, currentStock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={itemForm.reorderLevel}
                  onChange={(e) => setItemForm({ ...itemForm, reorderLevel: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitCost">Unit Cost (NGN)</Label>
                <Input
                  id="unitCost"
                  type="number"
                  value={itemForm.unitCost}
                  onChange={(e) => setItemForm({ ...itemForm, unitCost: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={itemForm.expiryDate}
                  onChange={(e) => setItemForm({ ...itemForm, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={itemForm.location}
                onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                placeholder="Enter storage location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Item</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{archiveTarget?.name}</strong> from inventory.
              Type <strong>ARCHIVE</strong> to confirm this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={archiveInput}
              onChange={(e) => setArchiveInput(e.target.value)}
              placeholder="Type ARCHIVE to confirm"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setArchiveInput('');
              setArchiveTarget(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveItem}
              disabled={archiveInput !== 'ARCHIVE'}
              className="bg-destructive hover:bg-destructive/90"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
