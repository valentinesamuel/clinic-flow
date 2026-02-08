import { useState, useCallback, useMemo } from 'react';
import { Consultation } from '@/types/clinical.types';
import {
  ConsultationFormData,
  ConsultationDiagnosis,
  ConsultationPrescriptionItem,
  ConsultationLabOrder,
  BundleDeselectionRecord,
  JustificationEntry,
  OrderMetadata,
} from '@/types/consultation.types';

const initialFormData: ConsultationFormData = {
  chiefComplaint: '',
  historyOfPresentIllness: '',
  physicalExamination: '',
  selectedDiagnoses: [],
  treatmentPlan: '',
  prescriptionItems: [],
  labOrders: [],
  followUpDate: null,
  notes: '',
  bundleDeselections: [],
  justifications: [],
};

export function useConsultationForm() {
  const [formData, setFormData] = useState<ConsultationFormData>(initialFormData);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(<K extends keyof ConsultationFormData>(
    field: K,
    value: ConsultationFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  // Diagnosis management
  const addDiagnosis = useCallback((diagnosis: Omit<ConsultationDiagnosis, 'isPrimary'>) => {
    setFormData(prev => {
      const isPrimary = prev.selectedDiagnoses.length === 0;
      return {
        ...prev,
        selectedDiagnoses: [
          ...prev.selectedDiagnoses,
          { ...diagnosis, isPrimary },
        ],
      };
    });
    setIsDirty(true);
  }, []);

  const removeDiagnosis = useCallback((code: string) => {
    setFormData(prev => {
      const filtered = prev.selectedDiagnoses.filter(d => d.code !== code);
      // If we removed the primary, make the first remaining one primary
      if (filtered.length > 0 && !filtered.some(d => d.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, selectedDiagnoses: filtered };
    });
    setIsDirty(true);
  }, []);

  const setPrimaryDiagnosis = useCallback((code: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDiagnoses: prev.selectedDiagnoses.map(d => ({
        ...d,
        isPrimary: d.code === code,
      })),
    }));
    setIsDirty(true);
  }, []);

  // Prescription management
  const addPrescriptionItem = useCallback((item: Omit<ConsultationPrescriptionItem, 'id'>) => {
    setFormData(prev => ({
      ...prev,
      prescriptionItems: [
        ...prev.prescriptionItems,
        { ...item, id: `pitem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
      ],
    }));
    setIsDirty(true);
  }, []);

  const removePrescriptionItem = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      prescriptionItems: prev.prescriptionItems.filter(i => i.id !== id),
    }));
    setIsDirty(true);
  }, []);

  const updatePrescriptionItem = useCallback((id: string, updates: Partial<ConsultationPrescriptionItem>) => {
    setFormData(prev => ({
      ...prev,
      prescriptionItems: prev.prescriptionItems.map(i =>
        i.id === id ? { ...i, ...updates } : i
      ),
    }));
    setIsDirty(true);
  }, []);

  // Lab order management
  const addLabOrder = useCallback((order: Omit<ConsultationLabOrder, 'id'>) => {
    setFormData(prev => ({
      ...prev,
      labOrders: [
        ...prev.labOrders,
        { ...order, id: `lorder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
      ],
    }));
    setIsDirty(true);
  }, []);

  const removeLabOrder = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      labOrders: prev.labOrders.filter(o => o.id !== id),
    }));
    setIsDirty(true);
  }, []);

  const updateLabOrder = useCallback((id: string, updates: Partial<ConsultationLabOrder>) => {
    setFormData(prev => ({
      ...prev,
      labOrders: prev.labOrders.map(o =>
        o.id === id ? { ...o, ...updates } : o
      ),
    }));
    setIsDirty(true);
  }, []);

  // Bundle deselection tracking
  const recordBundleDeselection = useCallback((record: BundleDeselectionRecord) => {
    setFormData(prev => ({
      ...prev,
      bundleDeselections: [...prev.bundleDeselections, record],
    }));
    setIsDirty(true);
  }, []);

  // Justification management
  const addJustification = useCallback((entry: JustificationEntry) => {
    setFormData(prev => ({
      ...prev,
      justifications: [
        ...prev.justifications.filter(j => j.triggerId !== entry.triggerId),
        entry,
      ],
    }));
    setIsDirty(true);
  }, []);

  const removeJustification = useCallback((triggerId: string) => {
    setFormData(prev => ({
      ...prev,
      justifications: prev.justifications.filter(j => j.triggerId !== triggerId),
    }));
    setIsDirty(true);
  }, []);

  // Update metadata on individual items
  const updateItemMetadata = useCallback((
    itemType: 'labOrder' | 'prescription',
    itemId: string,
    metadata: Partial<OrderMetadata>,
  ) => {
    setFormData(prev => {
      if (itemType === 'labOrder') {
        return {
          ...prev,
          labOrders: prev.labOrders.map(o =>
            o.id === itemId ? { ...o, metadata: { ...o.metadata, ...metadata } } : o
          ),
        };
      }
      return {
        ...prev,
        prescriptionItems: prev.prescriptionItems.map(i =>
          i.id === itemId ? { ...i, metadata: { ...i.metadata, ...metadata } } : i
        ),
      };
    });
    setIsDirty(true);
  }, []);

  // Hydrate from existing consultation
  const hydrateForm = useCallback((consultation: Consultation) => {
    setFormData({
      chiefComplaint: consultation.chiefComplaint,
      historyOfPresentIllness: consultation.historyOfPresentIllness,
      physicalExamination: consultation.physicalExamination,
      selectedDiagnoses: consultation.diagnosis.map((desc, i) => ({
        code: consultation.icdCodes[i] || '',
        description: desc,
        isPrimary: i === 0,
      })),
      treatmentPlan: consultation.treatmentPlan,
      prescriptionItems: [],
      labOrders: [],
      followUpDate: consultation.followUpDate || null,
      notes: '',
      bundleDeselections: [],
      justifications: [],
    });
    setIsDirty(false);
  }, []);

  const hasDiagnoses = formData.selectedDiagnoses.length > 0;

  const isValid = useMemo(() => {
    return (
      formData.chiefComplaint.trim().length > 0 &&
      formData.historyOfPresentIllness.trim().length > 0 &&
      formData.physicalExamination.trim().length > 0 &&
      formData.selectedDiagnoses.length > 0 &&
      formData.treatmentPlan.trim().length > 0
    );
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setIsDirty(false);
  }, []);

  return {
    formData,
    updateField,
    addDiagnosis,
    removeDiagnosis,
    setPrimaryDiagnosis,
    addPrescriptionItem,
    removePrescriptionItem,
    updatePrescriptionItem,
    addLabOrder,
    removeLabOrder,
    updateLabOrder,
    recordBundleDeselection,
    addJustification,
    removeJustification,
    updateItemMetadata,
    hydrateForm,
    hasDiagnoses,
    isValid,
    isDirty,
    resetForm,
  };
}
