// EditServiceModal - Edit service price

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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ServicePrice } from '@/types/cashier.types';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServicePrice;
  onSubmit: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EditServiceModal({
  open,
  onOpenChange,
  service,
  onSubmit,
}: EditServiceModalProps) {
  const { toast } = useToast();
  const [newPrice, setNewPrice] = useState(service.standardPrice.toString());
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentPrice = service.standardPrice;
  const proposedPrice = parseFloat(newPrice) || 0;
  const priceDiff = proposedPrice - currentPrice;
  const percentChange = currentPrice > 0 ? (priceDiff / currentPrice) * 100 : 0;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newPrice || proposedPrice <= 0) {
      newErrors.newPrice = 'Valid price is required';
    }
    if (proposedPrice === currentPrice) {
      newErrors.newPrice = 'New price must be different from current price';
    }
    if (!reason || reason.length < 10) {
      newErrors.reason = 'Please provide a reason for this change (min 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    toast({
      title: 'Price Change Submitted',
      description: 'Price change has been submitted for CMO approval',
    });

    onSubmit();
    handleClose();
  };

  const handleClose = () => {
    setNewPrice(service.standardPrice.toString());
    setReason('');
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Service Price</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Service Info (read-only) */}
          <div className="p-3 bg-muted rounded-lg space-y-1">
            <p className="font-medium">{service.name}</p>
            <p className="text-sm font-mono text-muted-foreground">
              {service.code}
            </p>
            <Badge variant="outline" className="capitalize">
              {service.category}
            </Badge>
          </div>

          {/* Current Price */}
          <div className="space-y-2">
            <Label>Current Price</Label>
            <p className="text-lg font-bold">{formatCurrency(currentPrice)}</p>
          </div>

          {/* New Price */}
          <div className="space-y-2">
            <Label htmlFor="new-price">New Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₦
              </span>
              <Input
                id="new-price"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="pl-7 text-lg"
              />
            </div>
            {errors.newPrice && (
              <p className="text-sm text-destructive">{errors.newPrice}</p>
            )}
          </div>

          {/* Price Change Display */}
          {proposedPrice > 0 && proposedPrice !== currentPrice && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Change:</span>
              <span className="font-medium">
                {formatCurrency(currentPrice)}
              </span>
              <ArrowRight className="h-4 w-4" />
              <span className="font-bold">{formatCurrency(proposedPrice)}</span>
              <Badge
                variant={priceDiff > 0 ? 'destructive' : 'secondary'}
                className="ml-auto"
              >
                {priceDiff > 0 ? '+' : ''}
                {percentChange.toFixed(1)}%
              </Badge>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for this price change..."
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason}</p>
            )}
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Price changes require CMO approval
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
