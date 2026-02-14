import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QueuePagination } from '@/components/molecules/queue/QueuePagination';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  X,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Pencil,
  Send,
} from 'lucide-react';
import { mockInventory } from '@/data/inventory';
import { createStockRequest } from '@/data/stock-requests';
import type { StockRequestUrgency, StockRequestItem } from '@/types/stock-request.types';
import type { InventoryItem } from '@/types/billing.types';

interface SelectedItem {
  inventoryItem: InventoryItem;
  requestedQuantity: number;
  itemNotes: string;
}

function getRolePrefix(role: string): string {
  if (role === 'hospital_admin') return '/hospital-admin';
  if (role === 'clinical_lead') return '/clinical-lead';
  if (role === 'lab_tech') return '/lab-tech';
  return `/${role}`;
}

const ITEMS_PER_PAGE = 8;

const categoryColors: Record<string, string> = {
  medicine: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  consumable: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800',
  equipment: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  utility: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700',
};

export default function NewStockRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Inventory filters & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Cart state
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [urgency, setUrgency] = useState<StockRequestUrgency>('normal');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Edit modal state
  const [editingItem, setEditingItem] = useState<SelectedItem | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editItemNotes, setEditItemNotes] = useState('');

  const rolePrefix = user ? getRolePrefix(user.role) : '';
  const backPath = `${rolePrefix}/stock-requests`;

  // Filter inventory
  const filteredInventory = useMemo(() => {
    let items = [...mockInventory];
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter);
    }
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.supplier?.toLowerCase().includes(query)
      );
    }
    return items;
  }, [searchQuery, categoryFilter]);

  // Paginate
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInventory.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInventory, currentPage]);

  const selectedIds = useMemo(
    () => new Set(selectedItems.map(si => si.inventoryItem.id)),
    [selectedItems]
  );

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  // Cart actions
  const handleAddItem = (item: InventoryItem) => {
    if (selectedIds.has(item.id)) return;
    setSelectedItems(prev => [...prev, { inventoryItem: item, requestedQuantity: 1, itemNotes: '' }]);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(si => si.inventoryItem.id !== itemId));
  };

  const handleClearCart = () => {
    setSelectedItems([]);
  };

  // Edit modal
  const handleOpenEdit = (item: SelectedItem) => {
    setEditingItem(item);
    setEditQuantity(item.requestedQuantity);
    setEditItemNotes(item.itemNotes);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    setSelectedItems(prev =>
      prev.map(si =>
        si.inventoryItem.id === editingItem.inventoryItem.id
          ? { ...si, requestedQuantity: Math.max(1, editQuantity), itemNotes: editItemNotes }
          : si
      )
    );
    setEditingItem(null);
  };

  const handleRemoveFromEdit = () => {
    if (!editingItem) return;
    handleRemoveItem(editingItem.inventoryItem.id);
    setEditingItem(null);
  };

  // Submit
  const handleSubmit = () => {
    if (!user || selectedItems.length === 0 || !reason.trim()) return;

    const requestItems: StockRequestItem[] = selectedItems.map(si => ({
      inventoryItemId: si.inventoryItem.id,
      itemName: si.inventoryItem.name,
      currentStock: si.inventoryItem.currentStock,
      requestedQuantity: si.requestedQuantity,
    }));

    const combinedNotes = [
      notes.trim(),
      ...selectedItems
        .filter(si => si.itemNotes.trim())
        .map(si => `${si.inventoryItem.name}: ${si.itemNotes.trim()}`),
    ].filter(Boolean).join('\n') || undefined;

    createStockRequest({
      requesterId: user.id,
      requesterName: user.name,
      requesterRole: user.role,
      requesterDepartment: user.department || 'Unknown',
      items: requestItems,
      urgency,
      reason: reason.trim(),
      notes: combinedNotes,
    });

    toast({ title: 'Request Submitted', description: `${selectedItems.length} item(s) sent for admin approval` });
    navigate(backPath);
  };

  const canSubmit = selectedItems.length > 0 && reason.trim().length > 0;

  return (
    <DashboardLayout allowedRoles={['pharmacist', 'lab_tech', 'nurse', 'doctor', 'receptionist']}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(backPath)} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">New Stock Request</h1>
            <p className="text-sm text-muted-foreground">Browse inventory and add items to your request</p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

          {/* LEFT — Inventory Catalog (3/5 width) */}
          <div className="lg:col-span-3 space-y-0">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-base font-semibold">Inventory Catalog</CardTitle>
                <CardDescription>Click the add button to include an item in your request</CardDescription>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center pt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or supplier..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9 bg-background"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full sm:w-40 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="font-semibold">Item</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold text-right">Stock</TableHead>
                      <TableHead className="font-semibold text-center">Status</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p>No items match your filters</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedInventory.map((item) => {
                        const isLow = item.currentStock <= item.reorderLevel;
                        const inCart = selectedIds.has(item.id);
                        return (
                          <TableRow
                            key={item.id}
                            className={inCart ? 'bg-primary/[0.03]' : ''}
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.unit}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${categoryColors[item.category] || ''}`}>
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-medium">
                              {item.currentStock.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              {isLow ? (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Low
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                                  In Stock
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {inCart ? (
                                <Badge variant="secondary" className="text-xs">Added</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleAddItem(item)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {filteredInventory.length > ITEMS_PER_PAGE && (
                  <div className="border-t px-4 py-3">
                    <QueuePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredInventory.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setCurrentPage}
                      showPageSizeSelector={false}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT — Request Cart (2/5 width, sticky) */}
          <div className="lg:col-span-2 lg:sticky lg:top-4">
            <Card className="overflow-hidden border-primary/20">
              {/* Cart header */}
              <CardHeader className="bg-primary/5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">Your Request</CardTitle>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                        onClick={handleClearCart}
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Cart items */}
                {selectedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <p className="font-medium text-sm text-muted-foreground">No items added yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 max-w-[200px]">
                      Browse the catalog and click the + button to add items
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {selectedItems.map((si) => {
                      const isLow = si.inventoryItem.currentStock <= si.inventoryItem.reorderLevel;
                      return (
                        <div
                          key={si.inventoryItem.id}
                          className="group flex items-start gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors"
                          onClick={() => handleOpenEdit(si)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{si.inventoryItem.name}</p>
                              {isLow && <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">
                                Qty: <span className="font-semibold text-foreground">{si.requestedQuantity}</span>
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Stock: {si.inventoryItem.currentStock.toLocaleString()} {si.inventoryItem.unit}
                              </span>
                            </div>
                            {si.itemNotes && (
                              <p className="text-xs text-muted-foreground mt-1 italic truncate">
                                {si.itemNotes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                              onClick={(e) => { e.stopPropagation(); handleOpenEdit(si); }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                              onClick={(e) => { e.stopPropagation(); handleRemoveItem(si.inventoryItem.id); }}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Request form */}
                {selectedItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="p-4 space-y-4">
                      {/* Urgency */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Priority
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={urgency === 'normal' ? 'default' : 'outline'}
                            onClick={() => setUrgency('normal')}
                            className="h-9"
                          >
                            Normal
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={urgency === 'urgent' ? 'destructive' : 'outline'}
                            onClick={() => setUrgency('urgent')}
                            className="h-9"
                          >
                            Urgent
                          </Button>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Reason <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          placeholder="Why do you need these items?"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={2}
                          className="resize-none text-sm"
                        />
                      </div>

                      {/* Notes */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Notes
                        </Label>
                        <Textarea
                          placeholder="Additional context (optional)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          className="resize-none text-sm"
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate(backPath)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 gap-2"
                          onClick={handleSubmit}
                          disabled={!canSubmit}
                        >
                          <Send className="h-4 w-4" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Pencil className="h-4 w-4 text-primary" />
              Edit Item
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-5">
              {/* Item info card */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="font-semibold">{editingItem.inventoryItem.name}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className={`text-xs ${categoryColors[editingItem.inventoryItem.category] || ''}`}>
                    {editingItem.inventoryItem.category}
                  </Badge>
                  <span>Stock: {editingItem.inventoryItem.currentStock.toLocaleString()} {editingItem.inventoryItem.unit}</span>
                </div>
                {editingItem.inventoryItem.currentStock <= editingItem.inventoryItem.reorderLevel && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Below reorder level ({editingItem.inventoryItem.reorderLevel})
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Item notes */}
              <div className="space-y-2">
                <Label>Item Notes</Label>
                <Textarea
                  placeholder="Specific notes for this item (optional)"
                  value={editItemNotes}
                  onChange={(e) => setEditItemNotes(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 sm:mr-auto"
              onClick={handleRemoveFromEdit}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove Item
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
