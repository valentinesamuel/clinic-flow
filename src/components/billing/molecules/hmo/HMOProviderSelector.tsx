import { Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHMOProviders } from '@/hooks/queries/useReferenceQueries';

interface HMOProviderSelectorProps {
  selected?: string;
  onChange: (providerId: string) => void;
}

export function HMOProviderSelector({ selected, onChange }: HMOProviderSelectorProps) {
  const { data: hmoProviders = [] } = useHMOProviders();
  const selectedProvider = selected ? (hmoProviders as any[]).find((p: any) => p.id === selected) : undefined;

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Select HMO Provider">
            {selectedProvider?.name}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {(hmoProviders as any[]).filter((p: any) => p.isActive).map((provider: any) => (
          <SelectItem key={provider.id} value={provider.id}>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>{provider.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
