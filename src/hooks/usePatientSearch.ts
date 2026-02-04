import { useState, useMemo, useCallback, useEffect } from 'react';
import { Patient } from '@/types/patient.types';
import { mockPatients } from '@/data/patients';

const RECENT_SEARCHES_KEY = 'hms_recent_patient_searches';
const MAX_RECENT_SEARCHES = 10;
const DEBOUNCE_MS = 300;

interface UsePatientSearchOptions {
  debounceMs?: number;
  maxResults?: number;
}

interface UsePatientSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: Patient[];
  isLoading: boolean;
  recentSearches: string[];
  clearRecentSearches: () => void;
  addToRecentSearches: (term: string) => void;
}

export function usePatientSearch(
  options: UsePatientSearchOptions = {}
): UsePatientSearchReturn {
  const { debounceMs = DEBOUNCE_MS, maxResults = 20 } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Debounce query
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsLoading(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Search patients
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const searchTerm = debouncedQuery.toLowerCase().trim();

    return mockPatients
      .filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const mrn = patient.mrn.toLowerCase();
        const phone = patient.phone.replace(/\D/g, '');
        const searchPhone = searchTerm.replace(/\D/g, '');

        return (
          fullName.includes(searchTerm) ||
          mrn.includes(searchTerm) ||
          (searchPhone && phone.includes(searchPhone))
        );
      })
      .slice(0, maxResults);
  }, [debouncedQuery, maxResults]);

  // Add to recent searches
  const addToRecentSearches = useCallback((term: string) => {
    if (!term.trim()) return;

    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }

      return updated;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    recentSearches,
    clearRecentSearches,
    addToRecentSearches,
  };
}
