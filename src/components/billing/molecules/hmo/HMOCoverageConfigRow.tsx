import { HMOServiceCoverage, HMOCoverageType } from '@/types/billing.types';
import { HMOCoverageTypeBadge } from '@/components/atoms/display/HMOCoverageTypeBadge';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';

interface HMOCoverageConfigRowProps {
  coverage: HMOServiceCoverage;
  onUpdate: (id: string, updates: Partial<HMOServiceCoverage>) => void;
}

const coverageTypeLabels: Record<HMOCoverageType, string> = {
  full: 'Full',
  partial_percent: 'Partial %',
  partial_flat: 'Partial Flat',
  none: 'None',
};

export function HMOCoverageConfigRow({ coverage, onUpdate }: HMOCoverageConfigRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="text-sm font-medium">{coverage.serviceName}</p>
          <Badge variant="outline" className="text-[10px] mt-0.5">
            {coverage.serviceCategory}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={coverage.coverageType}
          onValueChange={(value: HMOCoverageType) =>
            onUpdate(coverage.id, { coverageType: value })
          }
        >
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(coverageTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {coverage.coverageType === 'partial_percent' && (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={0}
              max={100}
              value={coverage.coveragePercentage || 0}
              onChange={(e) =>
                onUpdate(coverage.id, { coveragePercentage: Number(e.target.value) })
              }
              className="w-20 h-8 text-xs"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        )}
        {coverage.coverageType === 'partial_flat' && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">₦</span>
            <Input
              type="number"
              min={0}
              value={coverage.coverageFlatAmount || 0}
              onChange={(e) =>
                onUpdate(coverage.id, { coverageFlatAmount: Number(e.target.value) })
              }
              className="w-24 h-8 text-xs"
            />
          </div>
        )}
        {coverage.coverageType === 'full' && (
          <HMOCoverageTypeBadge coverageType="full" />
        )}
        {coverage.coverageType === 'none' && (
          <HMOCoverageTypeBadge coverageType="none" />
        )}
      </TableCell>
      <TableCell>
        <Switch
          checked={coverage.requiresPreAuth}
          onCheckedChange={(checked) =>
            onUpdate(coverage.id, { requiresPreAuth: checked })
          }
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={coverage.isActive}
          onCheckedChange={(checked) =>
            onUpdate(coverage.id, { isActive: checked })
          }
        />
      </TableCell>
    </TableRow>
  );
}
