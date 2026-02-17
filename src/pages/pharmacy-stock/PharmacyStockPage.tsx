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
import { useInventory } from '@/hooks/queries/useInventoryQueries';
import { InventoryItem } from '@/types/billing.types';
import { format } from 'date-fns';
import { Search, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StockStatus = 'all' | 'in_stock' | 'low' | 'out';

export default function PharmacyStockPage() {
  const { toast } = useToast();
  const { data: inventoryData = [] } = useInventory();
  const mockInventory: InventoryItem[] = inventoryData as InventoryItem[];
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'medicine' | 'consumable'>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<StockStatus>('all');

  const pharmacyItems = useMemo(() => {
    return mockInventory.filter((item: InventoryItem) =>
      ['medicine', 'consumable'].includes(item.category)
    );
  }, [mockInventory]);

  const getStockStatus = (item: InventoryItem): 'in_stock' | 'low' | 'out' => {
    if (item.currentStock === 0) return 'out';
    if (item.currentStock <= item.reorderLevel) return 'low';
    return 'in_stock';
  };

  const filteredItems = useMemo(() => {
    let filtered = [...pharmacyItems];

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
  }, [pharmacyItems, searchQuery, categoryFilter, stockStatusFilter]);

  const stats = useMemo(() => {
    const totalItems = pharmacyItems.length;
    const lowStockCount = pharmacyItems.filter(item =>
      getStockStatus(item) === 'low' || getStockStatus(item) === 'out'
    ).length;
    const totalValue = pharmacyItems.reduce((sum, item) =>
      sum + (item.currentStock * item.unitCost), 0
    );

    return { totalItems, lowStockCount, totalValue };
  }, [pharmacyItems]);

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

  const handleRequestStock = () => {
    toast({
      title: 'Stock request submitted',
      description: 'Your stock request has been sent to the admin.',
    });
  };

  return (
    <DashboardLayout allowedRoles={['pharmacist']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pharmacy Stock</h1>
            <p className="text-muted-foreground mt-2">
              Manage medicines and consumables inventory
            </p>
          </div>
          <Button onClick={handleRequestStock}>
            <Package className="h-4 w-4 mr-2" />
            Request Stock
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.lowStockCount}</div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by drug name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(value: string) => setCategoryFilter(value as 'all' | 'medicine' | 'consumable')}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockStatusFilter} onValueChange={(value: string) => setStockStatusFilter(value as StockStatus)}>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
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
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredItems.length} of {pharmacyItems.length} items
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
