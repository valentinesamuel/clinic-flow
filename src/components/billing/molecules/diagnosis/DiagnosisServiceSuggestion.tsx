import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Check } from 'lucide-react';
import { getServicesForMultipleDiagnoses } from '@/data/icd10-service-mappings';
import { getServiceItemById } from '@/data/bill-items';

interface DiagnosisServiceSuggestionProps {
  diagnosisCodes: string[];
  onAddService: (serviceId: string, serviceName: string) => void;
  onRemoveService?: (serviceId: string, serviceName: string, justification: string) => void;
  selectedServiceIds: string[];
  serviceJustifications?: Record<string, string>;
  onJustificationChange?: (serviceId: string, justification: string) => void;
}

export function DiagnosisServiceSuggestion({
  diagnosisCodes,
  onAddService,
  onRemoveService,
  selectedServiceIds,
  serviceJustifications = {},
  onJustificationChange,
}: DiagnosisServiceSuggestionProps) {
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const [removalJustification, setRemovalJustification] = useState('');
  const [pendingAddId, setPendingAddId] = useState<string | null>(null);
  const [addJustification, setAddJustification] = useState('');

  const mappings = useMemo(() => {
    return getServicesForMultipleDiagnoses(diagnosisCodes);
  }, [diagnosisCodes]);

  const allSuggestedServices = useMemo(() => {
    const serviceMap = new Map<string, string>();
    for (const mapping of mappings) {
      mapping.approvedServiceIds.forEach((id, idx) => {
        if (!serviceMap.has(id)) {
          serviceMap.set(id, mapping.approvedServiceNames[idx] || id);
        }
      });
    }
    return Array.from(serviceMap.entries());
  }, [mappings]);

  const approvedServiceIdSet = useMemo(() => {
    return new Set(allSuggestedServices.map(([id]) => id));
  }, [allSuggestedServices]);

  if (diagnosisCodes.length === 0 || allSuggestedServices.length === 0) {
    return null;
  }

  const handleToggle = (serviceId: string, serviceName: string) => {
    const isSelected = selectedServiceIds.includes(serviceId);
    const isApproved = approvedServiceIdSet.has(serviceId);

    if (isSelected) {
      // Deselecting
      if (isApproved && onRemoveService) {
        // Approved service removal needs justification
        setPendingRemovalId(serviceId);
        setRemovalJustification('');
      } else if (onRemoveService) {
        onRemoveService(serviceId, serviceName, '');
      }
    } else {
      // Selecting
      if (!isApproved) {
        // Non-covered service needs justification
        setPendingAddId(serviceId);
        setAddJustification('');
      } else {
        onAddService(serviceId, serviceName);
      }
    }
  };

  const confirmRemoval = (serviceId: string, serviceName: string) => {
    if (onRemoveService && removalJustification.trim()) {
      onRemoveService(serviceId, serviceName, removalJustification.trim());
      setPendingRemovalId(null);
      setRemovalJustification('');
    }
  };

  const confirmAdd = (serviceId: string, serviceName: string) => {
    if (addJustification.trim()) {
      onAddService(serviceId, serviceName);
      onJustificationChange?.(serviceId, addJustification.trim());
      setPendingAddId(null);
      setAddJustification('');
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Approved Services for Selected Diagnoses</p>
      <p className="text-xs text-muted-foreground">Click to select or deselect services. Removing approved services or adding non-covered services requires justification.</p>
      <div className="flex flex-wrap gap-2">
        {allSuggestedServices.map(([serviceId, serviceName]) => {
          const isSelected = selectedServiceIds.includes(serviceId);
          const serviceItem = getServiceItemById(serviceId);
          return (
            <button
              key={serviceId}
              onClick={() => handleToggle(serviceId, serviceName)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isSelected
                  ? 'bg-primary/10 text-primary border-primary/20 hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer'
                  : 'bg-background hover:bg-accent border-border cursor-pointer'
              }`}
            >
              {isSelected ? (
                <Check className="h-3 w-3" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              {serviceName}
              {serviceItem && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 ml-1">
                  {serviceItem.category}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Removal justification prompt */}
      {pendingRemovalId && (
        <div className="mt-2 p-3 rounded-lg border border-amber-200 bg-amber-50 space-y-2">
          <p className="text-xs font-medium text-amber-800">
            This is an approved service. Please provide a reason for removing it:
          </p>
          <Textarea
            value={removalJustification}
            onChange={(e) => setRemovalJustification(e.target.value)}
            placeholder="Reason for removing this approved service..."
            className="text-xs min-h-[60px]"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                const name = allSuggestedServices.find(([id]) => id === pendingRemovalId)?.[1] || '';
                confirmRemoval(pendingRemovalId, name);
              }}
              disabled={!removalJustification.trim()}
              className="px-3 py-1 text-xs font-medium rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Confirm Removal
            </button>
            <button
              onClick={() => { setPendingRemovalId(null); setRemovalJustification(''); }}
              className="px-3 py-1 text-xs font-medium rounded border hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add non-covered service justification prompt */}
      {pendingAddId && (
        <div className="mt-2 p-3 rounded-lg border border-blue-200 bg-blue-50 space-y-2">
          <p className="text-xs font-medium text-blue-800">
            This service is not covered by HMO. Please provide clinical justification:
          </p>
          <Textarea
            value={addJustification}
            onChange={(e) => setAddJustification(e.target.value)}
            placeholder="Clinical justification for adding this non-covered service..."
            className="text-xs min-h-[60px]"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                const name = allSuggestedServices.find(([id]) => id === pendingAddId)?.[1] || '';
                confirmAdd(pendingAddId, name);
              }}
              disabled={!addJustification.trim()}
              className="px-3 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Add with Justification
            </button>
            <button
              onClick={() => { setPendingAddId(null); setAddJustification(''); }}
              className="px-3 py-1 text-xs font-medium rounded border hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
