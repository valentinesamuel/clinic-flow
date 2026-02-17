import { useState } from 'react';
import { Patient } from '@/types/patient.types';
import { usePatientSearch } from '@/hooks/queries/usePatientQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { InsuranceBadge } from '@/components/atoms/display/InsuranceBadge';
import { Search, User, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EpisodeCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (episode: {
    patientId: string;
    patientName: string;
    patientMrn: string;
    notes?: string;
  }) => void;
}

export function EpisodeCreationModal({
  open,
  onOpenChange,
  onComplete,
}: EpisodeCreationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = searchQuery.length >= 2 ? searchPatients(searchQuery) : [];

  const handleReset = () => {
    setSearchQuery('');
    setSelectedPatient(null);
    setNotes('');
    setIsSearchOpen(false);
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleCreate = () => {
    if (!selectedPatient) return;

    onComplete({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientMrn: selectedPatient.mrn,
      notes: notes.trim() || undefined,
    });

    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Episode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient Search */}
          <div className="space-y-2">
            <Label htmlFor="patient-search">Patient</Label>
            {!selectedPatient ? (
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isSearchOpen}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Search className="h-4 w-4" />
                      Search by name, MRN, or phone...
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[550px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search by name, MRN, or phone..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      {searchQuery.length < 2 ? (
                        <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
                      ) : searchResults.length === 0 ? (
                        <CommandEmpty>No patients found</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {searchResults.map((patient) => (
                            <CommandItem
                              key={patient.id}
                              value={patient.id}
                              onSelect={() => {
                                setSelectedPatient(patient);
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">
                                      {patient.firstName} {patient.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      MRN: {patient.mrn} • {patient.phone}
                                    </p>
                                  </div>
                                </div>
                                <InsuranceBadge paymentType={patient.paymentType} />
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              // Selected Patient Card
              <div className="border rounded-lg p-4 bg-accent/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <InsuranceBadge paymentType={selectedPatient.paymentType} />
                      </div>
                      <div className="space-y-0.5 text-sm text-muted-foreground">
                        <p>MRN: {selectedPatient.mrn}</p>
                        <p>Phone: {selectedPatient.phone}</p>
                        <p>
                          {selectedPatient.gender.charAt(0).toUpperCase() +
                            selectedPatient.gender.slice(1)}{' '}
                          • {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant notes about this episode..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              These notes will be visible in the episode timeline
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedPatient}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Episode
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
