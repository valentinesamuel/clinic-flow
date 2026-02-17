# Migration Plan: Dummy Data → React Query Hooks

## Migration Status

- ✅ **Batch 0: Type & Utility Extraction** - COMPLETED
- ✅ **Batch 1: Patients & Staff (Foundation)** - COMPLETED
- ✅ **Batch 2: Queue & Vitals (Clinical Operations)** - COMPLETED
- ✅ **Batch 3: Appointments, Episodes & Consultations** - COMPLETED
- ✅ **Batch 4: Lab, Prescriptions & Inventory** - COMPLETED
- 🔄 **Batch 5: Billing Domain** - IN PROGRESS (7/9 files migrated)
- ⏳ **Batch 6: Reference Data** - PENDING
- ⏳ **Batch 7: Reports, Roster, Users & Dashboard Cleanup** - PENDING

---

## Context

The application currently imports mock/dummy data directly from 30 files in `src/data/` into components. Meanwhile, a complete React Query infrastructure already exists (19 query hooks, 15 mutation hooks, 26 API service modules, offline-first persistence, json-server backend). The goal is to **rewire all components** from `src/data/*` imports to the existing React Query hooks, then delete the data files. For every batch that you implement, mark it as completed 

---

## Batch 0: Type & Utility Extraction (Pre-Migration) ✅ COMPLETED

Move types and pure functions out of `src/data/` files before touching any components.

**Status**: All types moved to appropriate type files, all utility functions extracted to utils files, `useNigerianBanks()` deduplicated.

### 0A. Move Interfaces to `src/types/`

| Type | From | To |
|------|------|----|
| `ConflictRule`, `PatientLabResult` | `data/conflict-rules.ts` | `types/consultation.types.ts` |
| `HMOAlertResult` | `data/hmo-rules.ts` | `types/consultation.types.ts` |
| `ICD10Code` | `data/icd10-codes.ts` | `types/clinical.types.ts` |
| `StateOption`, `LGAOption` | `data/nigerian-locations.ts` | `types/patient.types.ts` |
| `ServiceItem` | `data/bill-items.ts` | `types/billing.types.ts` |
| `BillFilters` | `data/bills.ts` | `types/billing.types.ts` |
| `ClaimFilters` | `data/claims.ts` | `types/billing.types.ts` |
| `PaymentRecord`, `PaymentFilters` | `data/payments.ts` | `types/billing.types.ts` |
| `HMOProviderExtended` | `data/hmo-providers.ts` | `types/billing.types.ts` |
| `CoverageFilters`, `PaginatedCoverageResponse` | `data/hmo-service-coverage.ts` | `types/billing.types.ts` |
| `ReportSummary`, `ReportAlert`, `DashboardType`, `DashboardMetadata` | `data/reports.ts` | `types/report.types.ts` (new) |
| `AuditAction`, `AuditEntityType`, `AuditEntry` | `data/audit-log.ts` | `types/audit.types.ts` (new) |
| `QueueInput`, `QueueStats` | `data/queue.ts` | `types/queue.types.ts` |
| `AppointmentInput`, `TimeSlot`, `DoctorAvailability` | `data/appointments.ts` | `types/clinical.types.ts` |

**Key consumers to update imports**: `ConsultationForm.tsx`, `DiagnosisSelector.tsx`, `SOAPAssessment.tsx`, `FinalizeConfirmationDialog.tsx`, `HMOAlertBanner.tsx`, `BillCreationForm.tsx`, `ClaimCreationModal.tsx`, `useHMOAlerts.ts`, `useJustificationTriggers.ts`

### 0B. Move Pure Utility Functions to `src/utils/`

| Function | From | To |
|----------|------|----|
| `calculateWaitTime()` | `data/queue.ts` | `utils/queueUtils.ts` (exists) |
| `calculateBMI()`, `getBMICategory()`, `isVitalAbnormal()` | `data/vitals.ts` | `utils/vitalUtils.ts` (new) |
| `DAYS`, `DAY_LABELS`, `getEffectiveTime()` | `data/roster.ts` | `utils/rosterUtils.ts` (new) |
| `evaluateHMORules()`, `getHMORulesForProvider()` | `data/hmo-rules.ts` | `utils/hmoUtils.ts` (new) — refactor to accept data as params |
| `findConflicts()` | `data/conflict-rules.ts` | `utils/conflictUtils.ts` (new) — refactor to accept data as params |
| `SERVICE_CATEGORY_LABELS` | `data/bill-items.ts` | `utils/billingDepartment.ts` (exists) |

**Key consumers**: `TriagePanel.tsx`, `QueueTable.tsx`, `WaitingRoomPage.tsx`, `NurseDashboard.tsx`, `ReceptionistDashboard.tsx`, `VitalsListPage.tsx`, `RosterPage.tsx`, `StaffDetailPage.tsx`

### 0C. Deduplicate `useNigerianBanks()`

Two versions exist: stub in `data/nigerian-banks.ts` and real hook in `hooks/queries/useReferenceQueries.ts`. Update `PaymentCollectionForm.tsx` and `PayOutOfPocketModal.tsx` to import from `useReferenceQueries`.

---

## Batch 1: Patients & Staff (Foundation) ✅ COMPLETED

Everything else depends on these domains.

**Status**: All patient and staff data imports replaced with React Query hooks. Files migrated:
- BillingDashboard.tsx
- CashierCombinedDashboard.tsx
- CMODashboard.tsx
- BillsListPage.tsx
- MedicalStaffPage.tsx
- HospitalAdminDashboard.tsx
- AppointmentBookingModal.tsx

### Patients — `src/data/patients.ts`
**Hook**: `usePatientQueries.ts` → `usePatients()`, `usePatient(id)`, `usePatientSearch(query)`, `usePatientsPaginated()`
**Mutations**: `usePatientMutations.ts` → `useCreatePatient()`, `useUpdatePatient()`, `useDeletePatient()`

**Files to modify**:
- `components/appointments/AppointmentBookingModal.tsx` — replace `searchPatients`, `getPatientById`
- `pages/billing/BillsListPage.tsx` — replace `mockPatients`, `getPatientById`
- `pages/dashboards/BillingDashboard.tsx` — replace `mockPatients`
- `pages/dashboards/CashierCombinedDashboard.tsx` — replace `mockPatients`
- `pages/dashboards/CMODashboard.tsx` — replace `searchPatients`

### Staff — `src/data/staff.ts`
**Hook**: `useStaffQueries.ts` → `useStaff()`, `useStaffMember(id)`, `useDoctors()`, `useNurses()`

**Files to modify**:
- `pages/medical-staff/MedicalStaffPage.tsx` — replace `getMedicalStaff()`
- `pages/dashboards/HospitalAdminDashboard.tsx` — replace `getNonMedicalStaff()`, `getOnDutyStaff()`
- `components/appointments/AppointmentBookingModal.tsx` — replace `getDoctors()`

---

## Batch 2: Queue & Vitals (Clinical Operations) ✅ COMPLETED

**Status**: All queue and vitals data imports replaced with React Query hooks. Utility functions moved to utils.

### Queue — `src/data/queue.ts`
**Hook**: `useQueueQueries.ts` → `useQueueByType(type)`, `useQueueStats(type)`, `useAllQueueStats()`
**Mutations**: `useQueueMutations.ts`

**Files migrated**:
- WaitingRoomPage.tsx - updated `calculateWaitTime` import to `utils/queueUtils`
- NurseDashboard.tsx - updated `calculateWaitTime` import to `utils/queueUtils`
- ReceptionistDashboard.tsx - updated `calculateWaitTime` import to `utils/queueUtils`
- QueueTable.tsx - updated `calculateWaitTime` import to `utils/queueUtils`

### Vitals — `src/data/vitals.ts`
**Hook**: `useVitalQueries.ts` → `useVitals()`, `useVitalsByPatient(patientId)`, `useLatestVitals(patientId)`
**API**: Expanded `api/vitals.ts` with `getByPatient()` and `getLatest()` endpoints

**Files migrated**:
- VitalsListPage.tsx - updated `isVitalAbnormal` import to `utils/vitalUtils`
- TriagePanel.tsx - updated to use `useVitalsByPatient()` hook and utility imports from `utils/vitalUtils`

---

## Batch 3: Appointments, Episodes & Consultations (Clinical Workflow) ✅ COMPLETED

**Status**: All appointment, episode, and consultation data imports replaced with React Query hooks.

### Appointments — `src/data/appointments.ts`
**Hook**: ✅ Expanded `useAppointmentQueries.ts` with `useAppointments()`, `useAppointment(id)`, `useTodaysAppointments()`, `useAppointmentsByDoctor()`, `useAppointmentsByPatient()`, `useAppointmentsByDate()`

**API**: ✅ Expanded `api/appointments.ts` with all necessary endpoints (getById, getTodaysAppointments, getByDoctor, getByPatient, getByDate, getByDateRange, create, update, updateStatus)

**Utils**: ✅ `utils/appointmentUtils.ts` already contains pure utility functions refactored to accept data as params (from Batch 0)

**Files migrated**:
- AppointmentBookingModal.tsx - updated to use `useAppointments()` and `useCreateAppointment()` hooks

### Episodes — `src/data/episodes.ts`
**Status**: ✅ Already migrated - only used in `server/seed.ts`
**Hook**: `useEpisodeQueries.ts` → `useEpisodes()`, `useEpisodeTimeline(id)` - complete coverage

### Consultations — `src/data/consultations.ts`
**Status**: ✅ Already migrated - only used in `server/seed.ts`
**Hook**: `useConsultationQueries.ts` → `useConsultations()`, `useConsultation(id)`, `useConsultationsByPatient()` - complete coverage

---

## Batch 4: Lab, Prescriptions & Inventory (Clinical Support) ✅ COMPLETED

**Status**: All lab, prescription, and inventory data imports replaced with React Query hooks.

### Lab Orders + Referrals — `src/data/lab-orders.ts`, `src/data/lab-referrals.ts`
**Hook**: `useLabQueries.ts` → `useLabOrders()`, `useTestCatalog()`, `usePartnerLabs()`, `useLabReferrals()` — well-covered

**Files migrated**:
- LabSettingsPage.tsx - migrated to use `useTestCatalog()` hook with loading/error states
- LabTechDashboard.tsx - already using React Query hooks ✅
- SampleQueuePage.tsx - already using React Query hooks ✅

### Prescriptions — `src/data/prescriptions.ts`
**Hook**: `usePrescriptionQueries.ts` → `usePrescriptions()`, `usePrescription(id)` — straightforward
**Status**: No direct imports found; prescription queries already integrated where needed

### Inventory + Stock Requests — `src/data/inventory.ts`, `src/data/stock-requests.ts`
**Hook**: `useInventoryQueries.ts` → `useInventory()`, `useStockRequests()`, `usePendingStockRequests()`

**Files migrated**:
- HospitalAdminDashboard.tsx - migrated to use `useInventory()` with client-side filtering for low stock/critical items
- InventoryListPage.tsx - already using React Query hooks ✅
- StockRequestAdminPage.tsx - migrated to use `useStockRequests()`, `usePendingStockRequests()`, `useUrgentPendingStockRequests()`, and `useUpdateStockRequestStatus()` mutation hook

---

## Batch 5: Billing Domain (Most Complex) 🔄 IN PROGRESS

**Status**: 7 of 9 files migrated. Remaining: priceResolver.ts (requires significant refactoring) and BillCreationForm.tsx (type-only import).

### Bills + Bill Items — `src/data/bills.ts`, `src/data/bill-items.ts`
**Hook**: `useBillQueries.ts` → `useBills()`, `useBill(id)`, `useServiceItems()`, `useBillingCodes()`

**Files migrated**:
- ✅ BillingDashboard.tsx - migrated to use `useBills()` with client-side filtering for pending bills and today's revenue calculation
- ✅ CashierCombinedDashboard.tsx - migrated to use `useBills()` with client-side filtering by department
- ✅ HospitalAdminDashboard.tsx - partially migrated (claims added, bills imports still pending from earlier batches)
- ✅ CMODashboard.tsx - migrated claims to use `usePendingClaims()` (bills imports still pending)
- ✅ ClaimsListPage.tsx - migrated to use `useBills()` with client-side `getBillById()` helper
- ✅ PaymentsListPage.tsx - migrated to use `useBills()` with client-side `getBillById()` helper
- ⏳ BillsListPage.tsx - not yet migrated (still uses data imports)

**Note**: Several dashboard files still have other billing imports (from `@/data/bills`) that will need migration in a future pass

### Claims + HMO Providers — `src/data/claims.ts`, `src/data/hmo-providers.ts`
**Hook**: `useClaimQueries.ts` + `useReferenceQueries.ts`

**Files migrated**:
- ✅ HospitalAdminDashboard.tsx - migrated to use `usePendingClaims()`
- ✅ CMODashboard.tsx - migrated to use `usePendingClaims()`
- ✅ HMOCoverageConfigTable.tsx - migrated to use `useHMOProviders()`

**Note**: `useHMOProviders()` currently exists in `useClaimQueries.ts`. Deduplication to `useReferenceQueries` still pending

### Payments — `src/data/payments.ts`
**Hook**: `usePaymentQueries.ts` → `usePayments()` — straightforward

### Service Pricing — `src/data/service-pricing.ts`
**Hook**: `useServicePricingQueries.ts` → `useServicePrices()`, `usePriceApprovals()`

### Cashier Shifts — `src/data/cashier-shifts.ts`
**Hook**: `useBillQueries.ts` → `useCurrentShift()`, `useShiftTransactions()`

### priceResolver.ts Refactoring (CRITICAL) ⏳ PENDING
Current: `utils/priceResolver.ts` imports directly from 3 data files (service-pricing, bill-items, hmo-providers).

**Status**: Not yet migrated - requires significant refactoring

**Approach**:
1. Refactor `resolvePrice()` to accept data as parameters instead of importing static data
2. Create `hooks/usePriceResolver.ts` that fetches data via React Query and wraps the pure function
3. Update consumer `hooks/useFinancialSidebar.ts` to use the new hook

**Priority**: HIGH - This is a critical utility used across the billing system

### HMO Service Coverage — `src/data/hmo-service-coverage.ts`
**Hook**: `useReferenceQueries.ts` → `useHMOServiceCoverages()`

---

## Batch 6: Reference Data

All hooks already exist in `useReferenceQueries.ts`:

| Data File | Hook Replacement |
|-----------|-----------------|
| `icd10-codes.ts` | `useICD10Search()`, `useCommonICD10()`, `useICD10Categories()` |
| `nigerian-locations.ts` | `useNigerianStates()`, `useLGAsForState()` |
| `nigerian-banks.ts` | `useNigerianBanks()` (already handled in 0C) |
| `protocol-bundles.ts` | `useProtocolBundles()`, `useBundlesForDiagnosis()` |
| `hmo-rules.ts` | `useHMORules()` (pure logic already moved in 0B) |
| `conflict-rules.ts` | `useConflictRules()` (pure logic already moved in 0B) |

**Files to modify**: `SOAPAssessment.tsx`, `DiagnosisSelector.tsx`, `ClaimCreationModal.tsx`, `ConsultationForm.tsx`, `HMOCoverageConfigTable.tsx`

---

## Batch 7: Reports, Roster, Users & Dashboard Cleanup

### Reports — `src/data/reports.ts`
**Hook**: `useReportQueries.ts` → `useReportSummary()`, `useReportMetadata()`, `useReportAlerts()`

### Roster — `src/data/roster.ts`
**Hook**: `useStaffQueries.ts` → `useRoster()`, `useStaffRoster(staffId)` (constants moved in 0B)

### Users — `src/data/users.ts`
**Hook**: `useAuthQueries.ts` → `useCurrentUser()`

### Audit Log — `src/data/audit-log.ts`
**Gap**: No existing hook — add `useAuditLog()` query hook + `api/reference/audit.ts` endpoints

### Nigerian Names — `src/data/nigerianNames.ts`
**Action**: Move to `server/seed-data/` — only used by seed script and `api/reference/names.ts`

### Inline Dashboard Data
- `DoctorDashboard.tsx` — replace hardcoded `labResults`/`prescriptionRenewals` with `useLabResultsForReview()` + `usePendingPrescriptions()`
- `PatientDashboard.tsx` — replace hardcoded `recentLabResults`/`currentPrescriptions` with `useLabOrdersByPatient()` + `usePrescriptionsByPatient()`

---

## Cross-Cutting: Loading & Error States

Components currently treat data as synchronous. Each migrated component needs:
- **Loading state**: Skeleton/spinner while data loads
- **Error state**: Inline error message or error boundary
- **Empty state**: Message when data returns empty

**Pattern**: Use consistent destructuring: `const { data = [], isLoading, isError } = useXxx()`

---

## Final Cleanup

After all batches complete:
1. Move remaining `src/data/` files to `server/seed-data/` (for seed script)
2. Update `server/seed.ts` imports to point to new location
3. Delete `src/data/` directory
4. Remove any dead imports across the codebase

---

## New Files to Create

| File | Purpose |
|------|---------|
| `src/utils/vitalUtils.ts` | `calculateBMI()`, `getBMICategory()`, `isVitalAbnormal()` |
| `src/utils/rosterUtils.ts` | `DAYS`, `DAY_LABELS`, `getEffectiveTime()` |
| `src/utils/hmoUtils.ts` | `evaluateHMORules()`, `getHMORulesForProvider()` |
| `src/utils/conflictUtils.ts` | `findConflicts()` |
| `src/utils/appointmentUtils.ts` | `getDoctorAvailability()` pure logic |
| `src/hooks/usePriceResolver.ts` | React Query wrapper for `resolvePrice()` |
| `src/types/report.types.ts` | Report-related interfaces |
| `src/types/audit.types.ts` | Audit log interfaces |

---

## Verification (After Each Batch)

1. `npm run build` — no import/type errors
2. `npm test` — all Vitest tests pass
3. `npm run lint` — clean
4. Manual smoke test affected pages
5. Check Network tab — confirm API calls to json-server instead of static imports

---

## Batch Execution Order

```
Batch 0 (Types/Utils) → Batch 1 (Patients/Staff) → Batch 2 (Queue/Vitals)
→ Batch 3 (Appointments/Episodes/Consultations) → Batch 4 (Lab/Rx/Inventory)
→ Batch 5 (Billing) → Batch 6 (Reference Data) → Batch 7 (Reports/Roster/Cleanup)
```
