// AddServiceModal - Add new service to pricing catalog

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ServiceCategory } from '@/types/billing.types';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (service: NewServiceData) => void;
}

interface NewServiceData {
  category: ServiceCategory;
  code: string;
  name: string;
  description: string;
  standardPrice: number;
  hmoPrice?: number;
  isTaxable: boolean;
}

const categoryPrefixes: Record<ServiceCategory, string> = {
  consultation: 'CONS',
  lab: 'LAB',
  pharmacy: 'PHRM',
  procedure: 'PROC',
  admission: 'ADM',
  other: 'OTH',
};

export function AddServiceModal({ open, onOpenChange, onSubmit }: AddServiceModalProps) {
  const { toast } = useToast();
  const [category, setCategory] = useState<ServiceCategory | ''>('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [hmoPrice, setHmoPrice] = useState('');
  const [isTaxable, setIsTaxable] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCategoryChange = (value: ServiceCategory) => {
    setCategory(value);
    const prefix = categoryPrefixes[value] || 'OTH';
    setCode(`${prefix}-`);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category) newErrors.category = 'Category is required';
    if (!code || code.length < 5) newErrors.code = 'Valid code is required';
    if (!name || name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!standardPrice || parseFloat(standardPrice) <= 0) {
      newErrors.standardPrice = 'Valid price is required';
    }
    if (hmoPrice && parseFloat(hmoPrice) > parseFloat(standardPrice)) {
      newErrors.hmoPrice = 'HMO price cannot exceed standard price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newService: NewServiceData = {
      category: category as ServiceCategory,
      code: code.toUpperCase(),
      name,
      description,
      standardPrice: parseFloat(standardPrice),
      hmoPrice: hmoPrice ? parseFloat(hmoPrice) : undefined,
      isTaxable,
    };

    toast({
      title: 'Service Submitted',
      description: 'Service has been submitted for CMO approval',
    });

    onSubmit(newService);
    handleClose();
  };

  const handleClose = () => {
    setCategory('');
    setCode('');
    setName('');
    setDescription('');
    setStandardPrice('');
    setHmoPrice('');
    setIsTaxable(false);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
                <SelectItem value="admission">Admission</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Service Code *</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. CONS-GEN-001"
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. General Consultation"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Standard Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="price"
                  type="number"
                  value={standardPrice}
                  onChange={(e) => setStandardPrice(e.target.value)}
                  className="pl-7"
                  placeholder="0"
                />
              </div>
              {errors.standardPrice && (
                <p className="text-sm text-destructive">{errors.standardPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hmo-price">HMO Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="hmo-price"
                  type="number"
                  value={hmoPrice}
                  onChange={(e) => setHmoPrice(e.target.value)}
                  className="pl-7"
                  placeholder="Optional"
                />
              </div>
              {errors.hmoPrice && (
                <p className="text-sm text-destructive">{errors.hmoPrice}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="taxable"
              checked={isTaxable}
              onCheckedChange={(checked) => setIsTaxable(checked === true)}
            />
            <Label htmlFor="taxable" className="text-sm font-normal">
              Taxable (7.5%)
            </Label>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This price will require CMO approval before activation
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
