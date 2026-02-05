
# Comprehensive Billing Flows: Claims & Bills Management

## Overview

Build impeccable UI/UX for:
1. **Bill Creation** - From patient profile and billing dashboard
2. **Bill Details Drawer** - Full-height drawer with complete bill information
3. **Claim Lifecycle** - Create, save draft, submit, edit, resubmit, view with version history
4. **Auto-generation Integration** - Bills from clinical orders
5. **Document Management** - Auto-attach, manual upload, claim form generation

---

## Part 1: Bill Details Drawer

### New Component: `src/components/billing/organisms/bill-details/BillDetailsDrawer.tsx`

Full-height right-side drawer (Sheet) following PatientDrawer pattern.

### Layout Structure

```text
+------------------------------------------+
|  BILL DETAILS                      [X]   |
|  INV-2024-0001                           |
|------------------------------------------|
|  PATIENT INFO                            |
|  ├─ Name: Aisha Mohammed                 |
|  ├─ MRN: PT-2024-00123                   |
|  ├─ Phone: +234 803 123 4567             |
|  └─ Payment Type: [HMO Badge]            |
|------------------------------------------|
|  BILL SUMMARY                            |
|  ├─ Created: 05 Feb 2026, 10:30 AM       |
|  ├─ Cashier: Blessing Okafor             |
|  ├─ Status: [Pending Badge]              |
|  └─ Visit: Check-up                      |
|------------------------------------------|
|  ITEMS                                   |
|  ┌────────────────────────────────────┐  |
|  │ Consultation Fee        ₦15,000   │  |
|  │ Lab: FBC                 ₦5,000   │  |
|  │ Lab: MP                  ₦2,500   │  |
|  │ Pharmacy: Paracetamol      ₦800   │  |
|  └────────────────────────────────────┘  |
|------------------------------------------|
|  AMOUNTS                                 |
|  Subtotal:                   ₦23,300     |
|  Discount:                       ₦0      |
|  Tax:                            ₦0      |
|  ──────────────────────────────────      |
|  TOTAL:                      ₦23,300     |
|  Paid:                        ₦5,000     |
|  Balance:                    ₦18,300     |
|------------------------------------------|
|  PAYMENT HISTORY                         |
|  ├─ ₦5,000 Cash - 05 Feb, 10:35 AM      |
|  └─ RCP-2024-ABC123                      |
|------------------------------------------|
|  NOTES                                   |
|  "Partial payment, balance next visit"   |
+------------------------------------------+
|  [Print Invoice]  [Collect Payment]      |
|  [Create Claim] (if HMO)                 |
+------------------------------------------+
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | boolean | Drawer visibility |
| `onOpenChange` | (open: boolean) => void | Toggle handler |
| `bill` | Bill | Bill data |
| `onCollect` | () => void | Trigger payment collection |
| `onCreateClaim` | () => void | Create HMO claim from bill |
| `onPrint` | () => void | Print invoice |

### Features

- Patient quick info with insurance badge
- Itemised list with category icons
- Payment history timeline
- Action buttons contextual to status
- "Create Claim" only visible for HMO patients with pending balance

---

## Part 2: Bill Creation Flow

### New Component: `src/components/billing/organisms/bill-creation/BillCreationForm.tsx`

Multi-step modal for creating bills.

### Step 1: Select/Confirm Patient

| Field | Type | Notes |
|-------|------|-------|
| Patient Search | Combobox | Search by name/MRN |
| Selected Patient | Display Card | Shows name, MRN, payment type |

If opened from patient profile, patient is pre-selected.

### Step 2: Add Items

| Section | Description |
|---------|-------------|
| Category Tabs | Consultation, Lab, Pharmacy, Procedure, Other |
| Item Search | Filter items within category |
| Selected Items | List with quantity, unit price, discount |
| Quick Add | Common items as chips |
| Custom Item | "Add Custom" for ad-hoc charges |

### Item Row

```text
+--------------------------------------------------+
| [x] Consultation Fee     Qty: [1]   ₦15,000  [X] |
+--------------------------------------------------+
```

### Step 3: Review & Notes

| Field | Description |
|-------|-------------|
| Items Summary | Read-only list |
| Subtotal/Discount/Tax/Total | Calculated |
| Notes | Optional textarea |
| Visit Reason | Optional input |

### Actions

| Button | Action |
|--------|--------|
| Save as Draft | Save bill with status 'pending' |
| Generate Bill | Create bill, optionally trigger payment |
| Cancel | Close without saving |

### Flow Entry Points

1. **From Patient Profile** (Billing Tab) - Patient pre-filled
2. **From Billing Dashboard** (Quick Action) - Patient search first
3. **Auto-generated** - From clinical orders (internal trigger)

---

## Part 3: Claim Creation Modal

### New Component: `src/components/billing/organisms/claim-submission/ClaimCreationModal.tsx`

### Entry Points

1. **From Bill Details Drawer** - "Create Claim" button (bill pre-selected)
2. **From Claims List** - "New Claim" button (search patient first)
3. **From Billing Dashboard** - "Submit Claim" button

### Step 1: Select Patient & Bill (if not pre-filled)

| Field | Description |
|-------|-------------|
| Patient Search | Combobox with autocomplete |
| Bills Dropdown | Filter: Pending/Partial bills for patient |
| Selected Bill | Shows bill number, amount, items |

### Step 2: HMO Details

| Field | Description |
|-------|-------------|
| HMO Provider | Dropdown from HMO_PROVIDERS |
| Policy Number | Text input |
| Enrollment ID | Auto-generated or manual |
| Pre-Auth Code | Optional (if already obtained) |

### Step 3: Claim Items

Pre-filled from selected bill, with ability to:
- Adjust claimed amounts (within limits)
- Add clinical notes per item
- Mark items as "Not Covered" (excluded from claim)

### Step 4: Documents

| Section | Description |
|---------|-------------|
| Auto-attached | Consultation notes, lab results (checkbox to include) |
| Manual Upload | Drag-drop zone for PDFs/images |
| Generate Form | Button to generate pre-filled HMO claim form PDF |

### Step 5: Review & Submit

| Field | Description |
|-------|-------------|
| Claim Summary | All details read-only |
| Total Claim Amount | Calculated |
| Expected Patient Liability | Co-pay if pharmacy items |

### Actions

| Button | Action |
|--------|--------|
| Save as Draft | Status = 'draft' |
| Submit Claim | Status = 'submitted', timestamp |
| Cancel | Close without saving |

---

## Part 4: Claim Details Drawer

### New Component: `src/components/billing/organisms/claim-details/ClaimDetailsDrawer.tsx`

Full-height drawer for viewing claim details.

### Layout

```text
+------------------------------------------+
|  CLAIM DETAILS                     [X]   |
|  CLM-2024-0001                           |
|------------------------------------------|
|  STATUS: [Submitted - Blue Badge]        |
|  Submitted: 05 Feb 2026, 11:00 AM        |
|------------------------------------------|
|  PATIENT                                 |
|  Aisha Mohammed (PT-2024-00123)          |
|------------------------------------------|
|  HMO PROVIDER                            |
|  ├─ Hygeia HMO                           |
|  ├─ Policy: NHIA-12345-6789              |
|  ├─ Enrollment: HYG-2024-ABC123          |
|  └─ Pre-Auth: PA-2024-XYZ789             |
|------------------------------------------|
|  LINKED BILL                             |
|  INV-2024-0001 - ₦23,300 [View]          |
|------------------------------------------|
|  CLAIMED ITEMS                           |
|  ┌────────────────────────────────────┐  |
|  │ Consultation Fee        ₦15,000   │  |
|  │ Lab: FBC                 ₦5,000   │  |
|  │ Lab: MP                  ₦2,500   │  |
|  └────────────────────────────────────┘  |
|  Total Claimed:              ₦22,500     |
|------------------------------------------|
|  DOCUMENTS (3)                           |
|  ├─ consultation_note.pdf    [View]      |
|  ├─ lab_results.pdf          [View]      |
|  └─ claim_form.pdf           [View]      |
|------------------------------------------|
|  VERSION HISTORY                         |
|  ├─ v3: Resubmitted (05 Feb 14:00)       |
|  ├─ v2: Denied (05 Feb 12:00)            |
|  └─ v1: Submitted (05 Feb 11:00)         |
|------------------------------------------|
|  (If Denied) DENIAL REASON               |
|  "Service not covered under plan..."     |
+------------------------------------------+
|  Actions based on status                 |
+------------------------------------------+
```

### Status-Based Actions

| Status | Available Actions |
|--------|-------------------|
| Draft | Edit, Submit, Delete |
| Submitted | View, Cancel |
| Processing | View |
| Approved | View, Mark as Paid |
| Denied | View, Edit & Resubmit, Appeal |
| Paid | View, Print |

---

## Part 5: Claim Edit/Resubmit Modal

### New Component: `src/components/billing/organisms/claim-submission/ClaimEditModal.tsx`

Re-uses ClaimCreationModal structure with modifications:

### For Draft Claims

- Full editing of all fields
- Same as creation flow
- Version incremented on save

### For Denied Claims (Resubmission)

- HMO details: Read-only (can request provider change)
- Bill: Read-only (linked)
- Items: Can adjust amounts, add notes
- Documents: Can add new documents
- **Required**: Resubmission Notes explaining changes

### Resubmission Flow

```text
+------------------------------------------+
|  RESUBMIT CLAIM                          |
|  CLM-2024-0001 (v2 → v3)                 |
|------------------------------------------|
|  DENIAL REASON                           |
|  "Service not covered under plan..."     |
|------------------------------------------|
|  [Read-only sections]                    |
|------------------------------------------|
|  RESUBMISSION NOTES *                    |
|  [Textarea: Explain corrections made]    |
|------------------------------------------|
|  ADDITIONAL DOCUMENTS                    |
|  [Upload zone]                           |
|------------------------------------------|
|  [Cancel]  [Save Draft]  [Resubmit]      |
+------------------------------------------+
```

---

## Part 6: Version History Component

### New Component: `src/components/billing/molecules/claim/ClaimVersionHistory.tsx`

Timeline display of claim changes.

| Version | Display |
|---------|---------|
| Current | Badge + "Current Version" |
| Previous | Status change, timestamp, notes |
| Original | Initial submission details |

### Version Comparison

Click any version to see:
- What changed (diff)
- Who made the change
- Timestamp

---

## Part 7: Document Management

### Auto-Attach Logic

When creating a claim from a bill:
1. Query consultations for patient on bill date
2. Query lab results for items in bill
3. Present as checkboxes (default: checked)

### Manual Upload Component

### `src/components/billing/molecules/documents/DocumentUploadZone.tsx`

| Feature | Description |
|---------|-------------|
| Drag & Drop | Visual drop zone |
| File Types | PDF, JPG, PNG (max 5MB each) |
| Upload Status | Progress indicator |
| Preview | Thumbnail for images, icon for PDFs |
| Delete | Remove uploaded file |

### Claim Form Generation

### `src/components/billing/molecules/documents/ClaimFormGenerator.tsx`

| Field | Source |
|-------|--------|
| Patient Name | From patient record |
| HMO Details | From claim |
| Diagnosis | From consultation |
| Items & Amounts | From claim items |
| Doctor Signature | Placeholder |
| Date | Current date |

Generates a print-friendly/downloadable PDF template.

---

## Part 8: Data Layer Updates

### Update: `src/types/billing.types.ts`

Add new types:

```text
interface ClaimVersion {
  version: number;
  status: ClaimStatus;
  changedAt: string;
  changedBy: string;
  notes?: string;
  previousValues?: Partial<HMOClaim>;
}

interface ClaimDocument {
  id: string;
  name: string;
  type: 'auto' | 'manual' | 'generated';
  source?: string; // consultation_id, lab_order_id, etc.
  uploadedAt: string;
  url?: string;
}

// Add to HMOClaim interface
versions: ClaimVersion[];
documents: ClaimDocument[];
```

### Update: `src/data/claims.ts`

Add functions:

```text
createClaim(data): HMOClaim
updateClaim(id, data): HMOClaim
saveClaimDraft(id, data): HMOClaim
submitClaim(id): HMOClaim
resubmitClaim(id, notes): HMOClaim
addClaimDocument(id, doc): ClaimDocument
getClaimVersions(id): ClaimVersion[]
```

### New: `src/data/bill-items.ts`

Service catalog for bill creation:

```text
interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  defaultPrice: number;
  isActive: boolean;
}

const CONSULTATION_ITEMS: ServiceItem[]
const LAB_ITEMS: ServiceItem[]
const PHARMACY_ITEMS: ServiceItem[]
const PROCEDURE_ITEMS: ServiceItem[]
```

### Update: `src/data/bills.ts`

Add functions:

```text
createBill(data): Bill
updateBill(id, data): Bill
addBillItem(billId, item): BillItem
removeBillItem(billId, itemId): void
getBillPaymentHistory(id): Payment[]
```

---

## Part 9: Integration Points

### BillsListPage Updates

| Element | Action |
|---------|--------|
| Row click | Open BillDetailsDrawer |
| "View" action | Open BillDetailsDrawer |
| "Collect" action | Open PaymentCollectionForm |
| Add "Create Bill" button | Open BillCreationForm |

### ClaimsListPage Updates

| Element | Action |
|---------|--------|
| Row click | Open ClaimDetailsDrawer |
| "View" action | Open ClaimDetailsDrawer |
| "Edit" action | Open ClaimEditModal |
| "Resubmit" action | Open ClaimEditModal (resubmit mode) |
| "New Claim" button | Open ClaimCreationModal |

### BillingDashboard Updates

| Element | Action |
|---------|--------|
| "Submit Claim" button | Open ClaimCreationModal |
| Add "Create Bill" quick action | Open BillCreationForm |
| Unpaid bills "Collect" | Already wired |
| HMO stats cards | Remain non-clickable |

### PatientProfile (Billing Tab)

| Element | Action |
|---------|--------|
| "Create Bill" button | Open BillCreationForm (patient pre-filled) |
| Bills list | Click opens BillDetailsDrawer |
| Claims list | Click opens ClaimDetailsDrawer |

---

## Part 10: File Structure Summary

### New Files (15)

| File | Purpose |
|------|---------|
| `src/components/billing/organisms/bill-details/BillDetailsDrawer.tsx` | Bill details drawer |
| `src/components/billing/organisms/bill-details/index.ts` | Barrel export |
| `src/components/billing/organisms/bill-creation/BillCreationForm.tsx` | Bill creation modal |
| `src/components/billing/organisms/bill-creation/index.ts` | Barrel export |
| `src/components/billing/organisms/claim-submission/ClaimCreationModal.tsx` | Claim creation flow |
| `src/components/billing/organisms/claim-submission/ClaimEditModal.tsx` | Edit/resubmit claims |
| `src/components/billing/organisms/claim-submission/index.ts` | Barrel export |
| `src/components/billing/organisms/claim-details/ClaimDetailsDrawer.tsx` | Claim details drawer |
| `src/components/billing/organisms/claim-details/index.ts` | Barrel export |
| `src/components/billing/molecules/claim/ClaimVersionHistory.tsx` | Version timeline |
| `src/components/billing/molecules/claim/index.ts` | Barrel export |
| `src/components/billing/molecules/documents/DocumentUploadZone.tsx` | File upload |
| `src/components/billing/molecules/documents/ClaimFormGenerator.tsx` | PDF generation |
| `src/components/billing/molecules/documents/index.ts` | Barrel export |
| `src/data/bill-items.ts` | Service catalog |

### Modified Files (7)

| File | Changes |
|------|---------|
| `src/types/billing.types.ts` | Add ClaimVersion, ClaimDocument types |
| `src/data/claims.ts` | Add CRUD and version functions |
| `src/data/bills.ts` | Add create/update functions |
| `src/pages/billing/BillsListPage.tsx` | Add drawer, create bill |
| `src/pages/billing/ClaimsListPage.tsx` | Add drawers, modals |
| `src/pages/dashboards/BillingDashboard.tsx` | Add create bill action |
| `src/components/billing/organisms/index.ts` | Export new organisms |

---

## Part 11: Implementation Order

1. **Types & Data**: Update billing types, add claim version/document structures
2. **Service Catalog**: Create bill-items.ts with service items
3. **Bill Details Drawer**: Full drawer with all sections
4. **Bill Creation Form**: Multi-step bill creation
5. **Claim Creation Modal**: 5-step claim flow
6. **Claim Details Drawer**: Full claim view with version history
7. **Claim Edit Modal**: Edit and resubmit flows
8. **Document Components**: Upload zone, claim form generator
9. **Version History**: Timeline component
10. **Page Integrations**: Wire up all pages
11. **Dashboard Updates**: Add new quick actions

---

## Part 12: UX Principles Applied

| Principle | Implementation |
|-----------|----------------|
| Minimal Clicks | Pre-fill data from context (patient, bill) |
| Progressive Disclosure | Multi-step flows reveal complexity gradually |
| Contextual Actions | Status-based buttons (Edit only for Draft) |
| Draft Recovery | Save draft anytime, resume later |
| Visual Feedback | Status badges, progress indicators, success states |
| Error Prevention | Validation before submit, confirmation dialogs |
| Undo/Recovery | Version history, resubmit from denied |
| Mobile Responsive | Drawer collapses, modals adapt |
| Keyboard Navigation | Tab through forms, Enter to submit |
| Loading States | Skeletons, spinners during operations |

---

## Part 13: Testing Checklist

After implementation:

| Test | Expected |
|------|----------|
| Open bill from table | Drawer shows all details |
| Collect from drawer | Opens PaymentCollectionForm |
| Create claim from bill | Modal pre-fills bill data |
| Create bill from dashboard | Patient search first |
| Create bill from patient | Patient pre-selected |
| Add items to bill | Updates totals live |
| Save claim as draft | Status = draft, can edit later |
| Submit claim | Status = submitted, timestamp set |
| Edit draft claim | All fields editable |
| Resubmit denied | Notes required, version incremented |
| Upload document | Shows in document list |
| Generate claim form | Opens printable PDF |
| View version history | Shows all status changes |
| Delete draft claim | Removed from list |
| Mark approved as paid | Status = paid |
