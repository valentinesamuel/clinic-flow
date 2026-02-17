import { useState, useMemo } from 'react';
import { Search, X, Plus, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ClaimDiagnosis } from '@/types/billing.types';
import { ICD10Code } from '@/types/clinical.types';
import { useICD10Search, useCommonICD10 } from '@/hooks/queries/useReferenceQueries';
import { cn } from '@/lib/utils';

interface DiagnosisSelectorProps {
  selectedDiagnoses: ClaimDiagnosis[];
  onDiagnosesChange: (diagnoses: ClaimDiagnosis[]) => void;
  suggestedCodes?: ICD10Code[];
  required?: boolean;
}

export function DiagnosisSelector({
  selectedDiagnoses,
  onDiagnosesChange,
  suggestedCodes = [],
  required = true,
}: DiagnosisSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: icd10SearchResults = [] } = useICD10Search(searchQuery.length >= 2 ? searchQuery : '');
  const { data: commonICD10Data = [] } = useCommonICD10();

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return (icd10SearchResults as any[]).filter(
      (code: any) => !selectedDiagnoses.some((d) => d.code === code.code)
    );
  }, [searchQuery, selectedDiagnoses, icd10SearchResults]);

  const commonCodes = useMemo(() => {
    return (commonICD10Data as any[]).filter(
      (code: any) => !selectedDiagnoses.some((d) => d.code === code.code)
    );
  }, [selectedDiagnoses, commonICD10Data]);

  const availableSuggestions = useMemo(() => {
    return suggestedCodes.filter(
      (code) => !selectedDiagnoses.some((d) => d.code === code.code)
    );
  }, [suggestedCodes, selectedDiagnoses]);

  const handleAddDiagnosis = (code: ICD10Code) => {
    const isPrimary = selectedDiagnoses.length === 0;
    const newDiagnosis: ClaimDiagnosis = {
      code: code.code,
      description: code.description,
      isPrimary,
    };
    onDiagnosesChange([...selectedDiagnoses, newDiagnosis]);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleRemoveDiagnosis = (code: string) => {
    const remaining = selectedDiagnoses.filter((d) => d.code !== code);
    // If we removed the primary, make the first remaining one primary
    if (remaining.length > 0 && !remaining.some((d) => d.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    onDiagnosesChange(remaining);
  };

  const handleTogglePrimary = (code: string) => {
    const updated = selectedDiagnoses.map((d) => ({
      ...d,
      isPrimary: d.code === code,
    }));
    onDiagnosesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Selected Diagnoses */}
      {selectedDiagnoses.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Diagnoses</p>
          <div className="space-y-2">
            {selectedDiagnoses.map((diagnosis) => (
              <div
                key={diagnosis.code}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  diagnosis.isPrimary && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleTogglePrimary(diagnosis.code)}
                    title={diagnosis.isPrimary ? 'Primary Diagnosis' : 'Set as Primary'}
                  >
                    {diagnosis.isPrimary ? (
                      <Star className="h-4 w-4 text-primary fill-primary" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0 font-mono">
                        {diagnosis.code}
                      </Badge>
                      {diagnosis.isPrimary && (
                        <Badge variant="default" className="shrink-0 text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {diagnosis.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveDiagnosis(diagnosis.code)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Diagnosis */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Add ICD-10 Diagnosis {required && selectedDiagnoses.length === 0 && <span className="text-destructive">*</span>}
        </p>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Search ICD-10 codes...</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Type code or description..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No matching codes found.</CommandEmpty>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <CommandGroup heading="Search Results">
                    {searchResults.map((code) => (
                      <CommandItem
                        key={code.code}
                        onSelect={() => handleAddDiagnosis(code)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="font-mono shrink-0">
                          {code.code}
                        </Badge>
                        <span className="text-sm truncate">{code.description}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Suggested from Consultation */}
                {searchQuery.length < 2 && availableSuggestions.length > 0 && (
                  <CommandGroup heading="Suggested from Consultation">
                    {availableSuggestions.map((code) => (
                      <CommandItem
                        key={code.code}
                        onSelect={() => handleAddDiagnosis(code)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="font-mono shrink-0">
                          {code.code}
                        </Badge>
                        <span className="text-sm truncate">{code.description}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Common Codes */}
                {searchQuery.length < 2 && commonCodes.length > 0 && (
                  <CommandGroup heading="Common Diagnoses">
                    <ScrollArea className="h-[200px]">
                      {commonCodes.map((code) => (
                        <CommandItem
                          key={code.code}
                          onSelect={() => handleAddDiagnosis(code)}
                          className="flex items-center gap-2 py-2"
                        >
                          <Plus className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="font-mono shrink-0">
                            {code.code}
                          </Badge>
                          <span className="text-sm truncate">{code.description}</span>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {required && selectedDiagnoses.length === 0 && (
        <p className="text-sm text-destructive">At least one diagnosis is required for claim submission.</p>
      )}
    </div>
  );
}
