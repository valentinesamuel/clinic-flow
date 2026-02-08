import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { SOAPSectionHeader } from '../atoms/SOAPSectionHeader';
import { DiagnosisBadge } from '../atoms/DiagnosisBadge';
import { ConsultationDiagnosis } from '@/types/consultation.types';
import { searchICD10, getCommonICD10Codes, ICD10Code } from '@/data/icd10-codes';
import { Stethoscope, Plus, Search } from 'lucide-react';

interface SOAPAssessmentProps {
  selectedDiagnoses: ConsultationDiagnosis[];
  onAdd: (diagnosis: Omit<ConsultationDiagnosis, 'isPrimary'>) => void;
  onRemove: (code: string) => void;
  onSetPrimary: (code: string) => void;
  readOnly?: boolean;
}

export function SOAPAssessment({ selectedDiagnoses, onAdd, onRemove, onSetPrimary, readOnly }: SOAPAssessmentProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.length >= 2
    ? searchICD10(searchQuery).filter(c => !selectedDiagnoses.some(d => d.code === c.code))
    : [];

  const commonCodes = getCommonICD10Codes().filter(
    c => !selectedDiagnoses.some(d => d.code === c.code)
  );

  const handleSelect = (icd: ICD10Code) => {
    onAdd({ code: icd.code, description: icd.description });
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <SOAPSectionHeader
          icon={<Stethoscope className="h-4 w-4 text-orange-500" />}
          title="Assessment"
          description="ICD-10 diagnoses"
          badge={selectedDiagnoses.length > 0 ? selectedDiagnoses.length : undefined}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && (
          <div className="space-y-2">
            <Label>Search ICD-10 Codes *</Label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-muted-foreground">
                  <Search className="h-4 w-4 mr-2" />
                  Search diagnoses...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search by code or description..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {searchQuery.length < 2 ? 'Type at least 2 characters...' : 'No codes found'}
                    </CommandEmpty>
                    {searchQuery.length >= 2 && searchResults.length > 0 && (
                      <CommandGroup heading="Search Results">
                        {searchResults.map((icd) => (
                          <CommandItem
                            key={icd.code}
                            value={`${icd.code}-${icd.description}`}
                            onSelect={() => handleSelect(icd)}
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            <span className="font-mono text-xs mr-2">{icd.code}</span>
                            <span className="text-sm truncate">{icd.description}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {searchQuery.length < 2 && commonCodes.length > 0 && (
                      <CommandGroup heading="Common Codes">
                        {commonCodes.map((icd) => (
                          <CommandItem
                            key={icd.code}
                            value={`${icd.code}-${icd.description}`}
                            onSelect={() => handleSelect(icd)}
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            <span className="font-mono text-xs mr-2">{icd.code}</span>
                            <span className="text-sm truncate">{icd.description}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
        {selectedDiagnoses.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedDiagnoses.map((d) => (
              <DiagnosisBadge
                key={d.code}
                code={d.code}
                description={d.description}
                isPrimary={d.isPrimary}
                onRemove={readOnly ? undefined : () => onRemove(d.code)}
                onSetPrimary={readOnly ? undefined : () => onSetPrimary(d.code)}
                readOnly={readOnly}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No diagnoses selected yet</p>
        )}
      </CardContent>
    </Card>
  );
}
