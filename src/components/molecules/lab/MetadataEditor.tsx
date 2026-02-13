import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

const SUGGESTED_KEYS = [
  'Methodology',
  'Sample Condition',
  'Equipment',
  'Reagent Lot',
  'Turnaround Time',
  'Quality Control',
];

interface MetadataEditorProps {
  metadata: Record<string, string>;
  onChange: (metadata: Record<string, string>) => void;
  readOnly?: boolean;
}

export function MetadataEditor({ metadata, onChange, readOnly }: MetadataEditorProps) {
  const entries = Object.entries(metadata);

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const updated: Record<string, string> = {};
    for (const [k, v] of Object.entries(metadata)) {
      if (k === oldKey) {
        updated[newKey] = v;
      } else {
        updated[k] = v;
      }
    }
    onChange(updated);
  };

  const handleValueChange = (key: string, value: string) => {
    onChange({ ...metadata, [key]: value });
  };

  const handleRemove = (key: string) => {
    const updated = { ...metadata };
    delete updated[key];
    onChange(updated);
  };

  const handleAdd = () => {
    // Find a unique key name
    let newKey = '';
    let counter = 1;
    while (newKey === '' || newKey in metadata) {
      newKey = `Key ${counter}`;
      counter++;
    }
    onChange({ ...metadata, [newKey]: '' });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Test Metadata</p>
      {entries.length === 0 && readOnly && (
        <p className="text-xs text-muted-foreground">No metadata</p>
      )}
      {entries.map(([key, value], index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={SUGGESTED_KEYS.includes(key) ? key : '__custom__'}
            onValueChange={(val) => {
              if (val !== '__custom__') {
                handleKeyChange(key, val);
              }
            }}
            disabled={readOnly}
          >
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Select key" />
            </SelectTrigger>
            <SelectContent>
              {SUGGESTED_KEYS.map((sk) => (
                <SelectItem key={sk} value={sk}>{sk}</SelectItem>
              ))}
              <SelectItem value="__custom__">Custom...</SelectItem>
            </SelectContent>
          </Select>
          {!SUGGESTED_KEYS.includes(key) && (
            <Input
              className="w-[120px] h-8 text-xs"
              value={key}
              onChange={(e) => handleKeyChange(key, e.target.value)}
              placeholder="Key name"
              disabled={readOnly}
            />
          )}
          <Input
            className="flex-1 h-8 text-xs"
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            placeholder="Value"
            disabled={readOnly}
          />
          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => handleRemove(key)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ))}
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={handleAdd}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Metadata
        </Button>
      )}
    </div>
  );
}
