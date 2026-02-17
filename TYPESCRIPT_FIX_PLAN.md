# TypeScript Error Remediation Plan - Clinic Flow

## Context

The codebase currently has TypeScript errors showing up in VSCode that are affecting the application at runtime. When starting the app, errors like `HospitalAdminDashboard.tsx:307 Uncaught ReferenceError: getTotalPendingClaims is not defined` appear.

The root causes are:
1. **Missing imports** - Functions called but not imported (2 critical runtime errors)
2. **Explicit 'any' usage** - ~246 ESLint violations across 75 files violating `@typescript-eslint/no-explicit-any`

Despite these errors, the project has **excellent type coverage** with well-defined interfaces in `/src/types/` for all domains (queue, billing, clinical, etc.). The issue is that these existing types are simply not being applied consistently.

## Phased Implementation Strategy

### Phase 0: Critical Runtime Fixes (IMMEDIATE) ✅ COMPLETED
**Duration**: 15 minutes
**Impact**: Prevents app crashes
**Files**: 2

#### Fix 1: HospitalAdminDashboard.tsx
**Location**: `src/pages/dashboards/HospitalAdminDashboard.tsx`

**Error**: Line 307 calls `getTotalPendingClaims()` which is not imported

**Fix**:
```typescript
// Add to imports (around line 30-35)
import { getTotalPendingClaims } from "@/data/claims";

// Also remove unused imports:
// - getTodaysRevenue (imported but never used)
// - Fuel (imported from lucide-react but never used)
// - CreditCard (imported from lucide-react but never used)
```

#### Fix 2: ClinicalLeadDashboard.tsx
**Location**: `src/pages/dashboards/ClinicalLeadDashboard.tsx`

**Error**: Lines 116, 117, 127, 128, 136 call `getWaitingCount()` which is not imported

**Fix**:
```typescript
// Add to imports
import { getWaitingCount } from "@/data/queue";
```

**Verification**:
- Run `npm run dev` - app should start without runtime errors
- Test HospitalAdminDashboard and ClinicalLeadDashboard - no console errors

---

### Phase 1: API Layer Type Safety (HIGH PRIORITY) ✅ COMPLETED
**Duration**: 2-3 hours
**Impact**: High - Cascades type safety to all consumers
**Files**: 7 API files
**Errors Fixed**: ~17 direct + reduces downstream issues

#### Why This Matters
The API layer is the foundation. When API functions return properly typed data, all React Query hooks and components that consume them automatically get better type inference. This cascading effect reduces the number of explicit type assertions needed downstream.

#### Pattern to Apply

**Before** (current state):
```typescript
// src/api/queue.ts
getByType: async (type: string) => {
  const { data } = await apiClient.get('/queue-entries', { params: { queueType: type } });
  return data.filter((e: any) => e.status === 'waiting');
}
```

**After** (with types):
```typescript
import { QueueEntry } from '@/types/queue.types';

getByType: async (type: string): Promise<QueueEntry[]> => {
  const { data } = await apiClient.get<QueueEntry[]>('/queue-entries', {
    params: { queueType: type }
  });
  return data.filter((e: QueueEntry) => e.status === 'waiting');
}
```

#### Files to Fix

1. **`src/api/queue.ts`** (7 errors)
   - Use `QueueEntry` type from `@/types/queue.types`
   - Type `getByType`, `getStats`, `getWaitingCount` return values
   - Remove all `(e: any)` callbacks → `(e: QueueEntry)`

2. **`src/api/lab.ts`** (5 errors)
   - Use `LabOrder` type from `@/types/clinical.types`
   - Type filter callbacks: `(o: any)` → `(o: LabOrder)`
   - Type test callbacks: `(t: any)` → `(t: LabTest)`

3. **`src/api/payments.ts`** (1 error)
   - Use `Payment` type from `@/types/billing.types`
   - Fix reduce callback: `(sum: number, p: any)` → `(sum: number, p: Payment)`

4. **`src/api/bills.ts`** (1 error)
   - Use `CashierShift` type from `@/types/cashier.types`
   - Fix `calculateShiftStats` parameter: `(shift: any)` → `(shift: CashierShift)`

5. **`src/api/reference/protocols.ts`** (1 error)
   - Use `ConflictRule` type from `@/types/consultation.types`
   - Fix callback: `(rule: any)` → `(rule: ConflictRule)`

6. **`src/api/reference/icd10.ts`** (1 error)
   - Use `ICD10Code` type from `@/types/clinical.types`
   - Fix callback: `(c: any)` → `(c: ICD10Code)`

7. **`src/api/reference/locations.ts`** (1 error)
   - Define `LGAOption` interface: `{ value: string; label: string }`
   - Fix callbacks and return types

**Verification**:
- Run `npm run lint` - should see ~17 fewer `no-explicit-any` errors
- Run `npm run build` - should succeed
- Test queue, lab, and billing workflows

---

### Phase 2: Hooks Type Safety ✅ COMPLETED
**Duration**: 1 hour
**Impact**: Medium - Improves consultation workflow
**Files**: 3 hook files
**Errors Fixed**: ~4

#### Files to Fix

1. **`src/hooks/useHMOAlerts.ts`** (2 errors)
   ```typescript
   // Before
   (hmoRules as any[]).map((rule: any) => { ... })

   // After
   import { HMORule } from '@/types/consultation.types';
   (hmoRules as HMORule[]).map((rule: HMORule) => { ... })
   ```

2. **`src/hooks/useJustificationTriggers.ts`** (2 errors)
   ```typescript
   // Before
   (conflictRules as any[]).filter((rule: any) => ...)

   // After
   import { ConflictRule } from '@/types/consultation.types';
   (conflictRules as ConflictRule[]).filter((rule: ConflictRule) => ...)
   ```

3. **`src/hooks/useBundleSuggestion.ts`** (1 error)
   ```typescript
   // Use ProtocolBundle from @/types/financial.types
   const matches: ProtocolBundle[] = diagnosis.code === primaryCode
     ? (bundlesForDiagnosis as ProtocolBundle[])
     : [];
   ```

**Verification**: Test consultation workflow - HMO alerts and conflict detection still work

---

### Phase 3: Report Pages (Low Complexity - Identical Pattern) ✅ COMPLETED
**Duration**: 45 minutes
**Impact**: Low complexity - All 8 files follow identical pattern
**Files**: 8 report pages
**Errors Fixed**: ~8

#### Pattern to Apply

All report pages have the same metadata casting pattern:

```typescript
// Before
const { data: allMetadata } = useReportMetadata();
const metadata = (allMetadata as any)?.claims ?? { title: '...', description: '', metrics: [] };

// After
import { DashboardMetadata } from '@/types/report.types';

const { data: allMetadata } = useReportMetadata();
const metadata: DashboardMetadata = allMetadata?.claims ?? {
  title: 'Claims Report',
  description: '',
  metrics: []
};
```

#### Files to Fix (Batch - Same Pattern)
1. `src/pages/reports/ClaimsReportPage.tsx`
2. `src/pages/reports/ConsultationReportPage.tsx`
3. `src/pages/reports/ExecutiveReportPage.tsx`
4. `src/pages/reports/LaboratoryReportPage.tsx`
5. `src/pages/reports/NursingReportPage.tsx`
6. `src/pages/reports/PharmacyReportPage.tsx`
7. `src/pages/reports/RadiologyReportPage.tsx`
8. `src/pages/reports/SurgeryReportPage.tsx`

**Verification**: All report pages load without errors

---

### Phase 4: Dashboard Pages ✅ COMPLETED
**Duration**: 2 hours
**Impact**: Medium - User-facing dashboards
**Files**: 7 dashboard files
**Errors Fixed**: ~25-30

#### Common Pattern

```typescript
// Before
const lowStockItems = (inventoryData as any[]).filter(
  item => item.currentStock <= item.reorderLevel
);

// After
import { InventoryItem } from '@/types/billing.types';

const lowStockItems = (inventoryData as InventoryItem[]).filter(
  (item: InventoryItem) => item.currentStock <= item.reorderLevel
);
```

#### Files to Fix
1. `src/pages/dashboards/HospitalAdminDashboard.tsx` - `InventoryItem[]`
2. `src/pages/dashboards/DoctorDashboard.tsx` - `QueueEntry[]`
3. `src/pages/dashboards/LabTechDashboard.tsx` - `LabOrder[]`, `Bill[]`
4. `src/pages/dashboards/PharmacistDashboard.tsx` - `InventoryItem[]`, `Bill[]`
5. `src/pages/dashboards/ReceptionistDashboard.tsx` - `QueueEntry[]`
6. `src/pages/dashboards/NurseDashboard.tsx` - `QueueEntry[]`
7. `src/pages/dashboards/BillingDashboard.tsx` - `Bill[]`

**Verification**: Test all dashboards - data displays correctly

---

### Phase 5: Billing Components ✅ COMPLETED
**Duration**: 3-4 hours
**Impact**: High business value - Financial workflows
**Files**: ~15 components
**Errors Fixed**: ~50-60

#### Common Patterns

**Form Event Handlers**:
```typescript
// Before
onChange={(e: any) => setField(e.target.value)}

// After
import { ChangeEvent } from 'react';
onChange={(e: ChangeEvent<HTMLInputElement>) => setField(e.target.value)}
```

**Select Events**:
```typescript
// Before
onValueChange={(value: any) => setSelection(value)}

// After
onValueChange={(value: string) => setSelection(value)}
```

**Data Transformations**:
```typescript
// Before
const services = ((paginatedResult as any)?.data || []) as ServicePrice[];

// After
import { ServicePrice } from '@/types/cashier.types';
interface PaginatedResponse<T> { data: T[]; total: number }
const services = (paginatedResult as PaginatedResponse<ServicePrice>)?.data || [];
```

#### Files to Fix (Grouped by Complexity)

**High Complexity**:
1. `src/components/billing/organisms/bill-creation/BillCreationForm.tsx` (8 errors)
2. `src/components/billing/organisms/claim-submission/ClaimCreationModal.tsx` (5 errors)
3. `src/components/billing/organisms/payment-collection/PaymentCollectionForm.tsx`

**Medium Complexity**:
4. `src/components/billing/organisms/service-pricing/PriceApprovalQueue.tsx` (4 errors)
5. `src/components/billing/organisms/service-pricing/ServicePricingTable.tsx` (2 errors)
6. `src/components/billing/organisms/cashier-station/CashierDashboard.tsx` (3 errors)
7. `src/components/billing/organisms/cashier-station/CashierShiftReport.tsx` (2 errors)

**Low Complexity**:
8. Other billing molecules and atoms

**Verification**:
- Test full billing workflow end-to-end
- Create bill, collect payment, submit claim
- No runtime errors in console

---

### Phase 6: Consultation Components ✅ COMPLETED
**Duration**: 2 hours
**Impact**: High clinical value
**Files**: 5 components
**Errors Fixed**: ~20-25

#### Files to Fix

1. `src/components/consultation/molecules/SOAPAssessment.tsx`
   - Use `ICD10Code[]` from `@/types/clinical.types`

2. `src/components/consultation/molecules/LabOrderPanel.tsx`
   - Use `ServiceItem[]` from `@/types/billing.types`
   - Use `ConsultationLabOrder` from `@/types/consultation.types`

3. `src/components/consultation/molecules/PrescriptionPanel.tsx`
   - Use `ConsultationPrescriptionItem` from `@/types/consultation.types`

4. Related consultation molecules

**Verification**: Test consultation workflow - create consultation with diagnosis, prescriptions, lab orders

---

### Phase 7: Patient Components ✅ COMPLETED
**Duration**: 1.5 hours
**Impact**: Medium - Patient data safety
**Files**: 3 components
**Errors Fixed**: ~18

#### Files to Fix

1. `src/components/patients/PatientRegistrationForm.tsx` (6 errors)
   ```typescript
   // Use Patient type from @/types/patient.types
   // Define NigerianState interface for state/LGA handling
   ```

2. `src/components/patients/ActivityTimeline.tsx` (12 errors)
   ```typescript
   // Use Consultation, VitalSigns, Prescription, LabOrder, Bill types
   // All types already exist in clinical.types and billing.types
   ```

**Verification**: Test patient registration and activity timeline display

---

### Phase 8: Remaining Pages & Components
**Duration**: 3-4 hours
**Impact**: Medium - Various workflows
**Files**: ~30 remaining files
**Errors Fixed**: ~80-100

#### Grouped by Feature

**Pharmacy Pages**:
- `src/pages/pharmacy-stock/PharmacyStockPage.tsx` - Use `InventoryItem[]`
- `src/pages/pharmacy-stock/PharmacyBillingPage.tsx`

**Lab Pages**:
- `src/pages/lab-results/ResultsEntryPage.tsx` - Use `LabOrder`, `LabTest`
- `src/pages/lab-results/PartnerLabSyncPage.tsx`
- `src/pages/lab-results/LabBillingPage.tsx`

**Billing Pages**:
- `src/pages/billing/PaymentsListPage.tsx` - Use `Bill[]`
- `src/pages/billing/ClaimsListPage.tsx` - Use `Claim[]`

**Episode Pages**:
- `src/pages/episodes/EpisodeDetailPage.tsx` - Use `Episode` type

**Other Components**:
- Queue components, notification components, etc.

**Verification**: Test each workflow area after fixing

---

## New Type Definitions Needed

Create these in appropriate type files:

1. **`PaginatedResponse<T>`** in `src/types/common.types.ts`:
```typescript
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

2. **`LGAOption`** in `src/types/reference.types.ts`:
```typescript
export interface LGAOption {
  value: string;
  label: string;
}

export interface NigerianState {
  value: string;
  label: string;
  lgas: LGAOption[];
}
```

3. **`ReportMetadataMap`** in `src/types/report.types.ts`:
```typescript
export type ReportMetadataMap = Record<DashboardType, DashboardMetadata>;
```

---

## Implementation Principles (Per CLAUDE.md)

1. **Baby Steps™**: Fix one file or small group at a time, commit after each logical unit
2. **Parallel Execution**: When fixing similar patterns (e.g., all 8 report pages), fix them together in one commit
3. **Verification**: Run `npm run lint` after each phase to track progress
4. **No Build Errors**: Ensure `npm run build` succeeds after each phase
5. **Testing**: Test affected workflows after each phase

---

## Verification Strategy

### After Each Phase:
1. **Lint Check**: `npm run lint` - Count remaining `no-explicit-any` errors
2. **Build Check**: `npm run build` - Must succeed
3. **Manual Testing**: Test the affected feature area

### Final Verification (After All Phases):
1. **Zero Lint Errors**: `npm run lint` should show 0 `@typescript-eslint/no-explicit-any` errors
2. **Production Build**: `npm run build` succeeds
3. **Test Suite**: `npm test` passes
4. **Manual Testing Checklist**:
   - [ ] Patient registration workflow
   - [ ] Queue management (triage, doctor, lab, pharmacy)
   - [ ] Consultation creation with diagnosis, prescriptions, lab orders
   - [ ] Billing & payment collection
   - [ ] HMO claim submission
   - [ ] Lab order & result entry
   - [ ] All dashboard pages load correctly
   - [ ] All report pages load correctly
   - [ ] Inventory management (pharmacy stock)

---

## Critical Files Reference

Most impactful files to fix first:

1. `src/pages/dashboards/HospitalAdminDashboard.tsx`
2. `src/pages/dashboards/ClinicalLeadDashboard.tsx`
3. `src/api/queue.ts`
4. `src/api/lab.ts`
5. `src/hooks/useHMOAlerts.ts`

---

## Timeline Estimate

| Phase | Duration | Errors Fixed |
|-------|----------|--------------|
| Phase 0: Critical Fixes | 15 min | 2 runtime errors |
| Phase 1: API Layer | 2-3 hrs | ~17 errors |
| Phase 2: Hooks | 1 hr | ~4 errors |
| Phase 3: Reports | 45 min | ~8 errors |
| Phase 4: Dashboards | 2 hrs | ~30 errors |
| Phase 5: Billing | 3-4 hrs | ~60 errors |
| Phase 6: Consultation | 2 hrs | ~25 errors |
| Phase 7: Patients | 1.5 hrs | ~18 errors |
| Phase 8: Remaining | 3-4 hrs | ~82 errors |
| **Total** | **14-18 hrs** | **246 errors** |

---

## Expected Outcome

After completing all phases:
- ✅ Zero runtime errors in the browser console
- ✅ Zero ESLint `@typescript-eslint/no-explicit-any` violations
- ✅ Full type safety across the codebase
- ✅ Better IDE autocomplete and type inference
- ✅ Reduced risk of type-related bugs in production
- ✅ Improved developer experience with proper TypeScript errors catching issues at compile time
