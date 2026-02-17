import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsultationLabOrder } from '@/types/consultation.types';
import { LabPriority } from '@/types/clinical.types';
import { useServiceItems } from '@/hooks/queries/useBillQueries';
import { Search, Plus, X, FlaskConical } from 'lucide-react';

interface LabOrderPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labOrders: ConsultationLabOrder[];
  onAdd: (order: Omit<ConsultationLabOrder, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ConsultationLabOrder>) => void;
}

export function LabOrderPanel({ open, onOpenChange, labOrders, onAdd, onRemove, onUpdate }: LabOrderPanelProps) {
  const { data: serviceItems = [] } = useServiceItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());

  const LAB_ITEMS = (serviceItems as any[]).filter((item: any) => item.category === 'lab' || item.type === 'lab');

  const filteredTests = LAB_ITEMS.filter((item: any) =>
    item.isActive && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelected = (testId: string) =>
    labOrders.some(o => o.testCode === testId);

  const handleAdd = (item: typeof LAB_ITEMS[0]) => {
    if (!isSelected(item.id)) {
      onAdd({
        testCode: item.id,
        testName: item.name,
        priority: 'routine',
        notes: '',
      });
    }
  };

  const handleDone = () => {
    const errors = new Set<string>();
    labOrders.forEach(order => {
      if (!order.testName.trim()) {
        errors.add(order.id);
      }
    });
    if (errors.size > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors(new Set());
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Lab Test Orders
            {labOrders.length > 0 && (
              <Badge variant="secondary">{labOrders.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
          <Tabs defaultValue="available" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Available Tests</TabsTrigger>
              <TabsTrigger value="selected">
                Selected ({labOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="flex-1 overflow-hidden flex flex-col mt-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lab tests..."
                  className="pl-10"
                />
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-1 pr-4">
                  {filteredTests.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAdd(item)}
                      disabled={isSelected(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <span className="truncate">{item.name}</span>
                      {isSelected(item.id) ? (
                        <Badge variant="outline" className="text-xs ml-2 shrink-0">Added</Badge>
                      ) : (
                        <Plus className="h-4 w-4 ml-2 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="selected" className="flex-1 overflow-hidden flex flex-col mt-2">
              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-4">
                  {labOrders.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No tests selected</p>
                  )}
                  {labOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`border rounded-lg p-3 space-y-2 ${validationErrors.has(order.id) ? 'border-destructive' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{order.testName}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(order.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Select
                        value={order.priority}
                        onValueChange={(val: LabPriority) => onUpdate(order.id, { priority: val })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="stat">STAT</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={order.notes}
                        onChange={(e) => onUpdate(order.id, { notes: e.target.value })}
                        placeholder="Notes..."
                        rows={1}
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="mt-4">
          <Button onClick={handleDone}>Done</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
