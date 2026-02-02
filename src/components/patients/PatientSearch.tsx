import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Plus, Loader2 } from 'lucide-react';
import { searchPatients } from '@/data/patients';
import { Patient } from '@/types/patient.types';
import { PatientCard } from './PatientCard';
import { cn } from '@/lib/utils';

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
  onRegisterNew?: () => void;
  placeholder?: string;
  excludeIds?: string[];
  className?: string;
  autoFocus?: boolean;
}

export function PatientSearch({
  onSelect,
  onRegisterNew,
  placeholder = "Search by name, phone, or patient number...",
  excludeIds = [],
  className,
  autoFocus = false,
}: PatientSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = searchPatients(query)
        .filter(p => !excludeIds.includes(p.id))
        .slice(0, 10);
      setResults(searchResults);
      setIsSearching(false);
      setShowResults(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, excludeIds]);

  const handleSelect = useCallback((patient: Patient) => {
    onSelect(patient);
    setQuery('');
    setResults([]);
    setShowResults(false);
  }, [onSelect]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          autoFocus={autoFocus}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2 space-y-1">
              {results.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => handleSelect(patient)}
                  showActions={false}
                  compact
                />
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                No patients found for "{query}"
              </p>
              {onRegisterNew && (
                <Button onClick={onRegisterNew} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Patient
                </Button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
