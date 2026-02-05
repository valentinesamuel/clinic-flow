
# Enhanced HMO Claims Workflow: Full Lifecycle Management

## Overview

This plan implements comprehensive HMO claim enhancements including:
1. Test HMO patients for easier testing
2. ICD-10 diagnosis codes on claims for evidence
3. "Pay Out of Pocket" option when claims are denied
4. Enhanced Claim Details with first 4 bill items and navigation to full bill
5. Document preview functionality
6. Claim withdrawal/cancellation workflow with retraction requests
7. Private/Self-Pay conversion flow

---

## Part 1: Add Test HMO Patients

### Update: `src/data/patients.ts`

Add 3 more HMO patients with different providers to facilitate testing:

| Patient | HMO Provider | Plan | Policy Status |
|---------|--------------|------|---------------|
| Nkechi Onyekachi | Hygeia HMO | Gold | Active |
| Tunde Bakare | Reliance HMO | Standard | Active |
| Amara Okwu | AXA Mansard | Premium | Active (near expiry) |

These patients will have complete HMO details pre-filled for quick claim testing.

---

## Part 2: Add ICD-10 Diagnosis Codes to Claims

### Update: `src/types/billing.types.ts`

Add diagnosis fields to claim types:

```text
interface ClaimDiagnosis {
  code: string;        // ICD-10 code (e.g., "I10")
  description: string; // Diagnosis name (e.g., "Essential hypertension")
  isPrimary: boolean;  // Primary vs secondary diagnosis
}

// Add to HMOClaim interface:
diagnoses: ClaimDiagnosis[];
```

### Update: `src/data/claims.ts`

Add diagnosis data to existing mock claims using ICD codes from consultations.

### New: `src/data/icd10-codes.ts`

Create a searchable catalog of common ICD-10 codes used in Nigerian clinics:

| Code | Description |
|------|-------------|
| I10 | Essential hypertension |
| E11.9 | Type 2 diabetes mellitus |
| J06.9 | Acute upper respiratory infection |
| J45.20 | Mild intermittent asthma |
| M17.0 | Osteoarthritis of knee |
| ... | (50+ common codes) |

### Update: `ClaimCreationModal.tsx`

Add diagnosis selection step (after HMO Details):
- Auto-suggest diagnoses from linked consultation's ICD codes
- Search/add additional ICD-10 codes
- Mark primary diagnosis
- At least one diagnosis required for submission

---

## Part 3: Pay Out of Pocket for Denied Claims

### New Flow: When a claim is denied, patient can choose to pay privately

### Update: `ClaimDetailsDrawer.tsx`

When status is "denied", add new action button:

```text
+------------------------------------------+
|  DENIAL REASON                           |
|  "Service not covered under plan..."     |
|------------------------------------------|
|  [Resubmit Claim]  [Pay Out of Pocket]   |
+------------------------------------------+
```

### New Component: `src/components/billing/organisms/claim-details/PayOutOfPocketModal.tsx`

Modal workflow for converting HMO claim to self-pay:

Step 1: Confirmation
- Display claim amount
- Show original bill details
- Warn: "This will void the HMO claim and create a private bill"

Step 2: Payment Method
- Select: Cash, POS, or Transfer (HMO option removed)
- Enter payment details

Step 3: Process
- Update claim status to "withdrawn"
- Create new private bill (or update existing bill payment method)
- Open PaymentCollectionForm

### Data Changes

```text
// Add to ClaimStatus type:
type ClaimStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'denied' | 'paid' | 'withdrawn' | 'retracted';

// Add to HMOClaim interface:
withdrawnAt?: string;
withdrawnReason?: 'patient_self_pay' | 'hospital_cancelled' | 'claim_error';
privatePaymentId?: string; // Link to new private payment
```

---

## Part 4: Enhanced Bill Items in Claim Details

### Update: `ClaimDetailsDrawer.tsx`

Show first 4 items from the linked bill:

```text
+------------------------------------------+
|  BILL ITEMS                              |
|  ┌────────────────────────────────────┐  |
|  │ Consultation Fee        ₦15,000   │  |
|  │ Lab: FBC                 ₦5,000   │  |
|  │ Lab: MP                  ₦2,500   │  |
|  │ Pharmacy: Paracetamol      ₦800   │  |
|  └────────────────────────────────────┘  |
|  +2 more items  [View Full Bill →]       |
+------------------------------------------+
```

### Linked Bill Navigation

- Clicking "Linked Bill" card opens `BillDetailsDrawer`
- "View Full Bill" link opens `BillDetailsDrawer`
- Pass bill data from claims data or fetch by ID

### Implementation

```text
// ClaimDetailsDrawer receives new prop:
onViewBill?: (billId: string) => void;

// Get bill items:
const bill = getBillById(claim.billId);
const displayItems = bill?.items.slice(0, 4);
const remainingCount = (bill?.items.length || 0) - 4;
```

---

## Part 5: Document Preview

### Update: `ClaimDetailsDrawer.tsx`

Make document rows clickable with preview action:

```text
+------------------------------------------+
|  DOCUMENTS (3)                           |
|  ┌────────────────────────────────────┐  |
|  │ consultation_note.pdf   [Preview] │  |
|  │ lab_results.pdf         [Preview] │  |
|  │ claim_form.pdf          [Preview] │  |
|  └────────────────────────────────────┘  |
+------------------------------------------+
```

### New Component: `src/components/billing/molecules/documents/DocumentPreviewModal.tsx`

| Feature | Implementation |
|---------|----------------|
| PDF Preview | Embed iframe or use react-pdf |
| Image Preview | Native img tag with zoom |
| Download | Download link |
| Print | Print button |
| Fallback | "Preview not available" with download option |

Since this is mock data, show placeholder preview:
- For PDFs: Show document metadata and a "Download" option
- For images: Show placeholder thumbnail
- In production: Would integrate with actual document storage

---

## Part 6: Claim Withdrawal/Cancellation Flow

### Workflow Based on Status

| Current Status | Action | Process |
|----------------|--------|---------|
| Draft | Delete | Immediate removal |
| Submitted (Pending) | Cancel | Instant cancellation via HMO portal (simulated) |
| Processing | Request Withdrawal | Submit withdrawal request |
| Approved (Pre-payment) | Retraction Request | Issue formal retraction to HMO |
| Paid | Cannot Withdraw | No action available |
| Denied | Already closed | Convert to self-pay available |

### New Component: `src/components/billing/organisms/claim-details/ClaimWithdrawalModal.tsx`

Handles different withdrawal scenarios:

#### For Submitted Claims (Instant Cancel)

```text
+------------------------------------------+
|  CANCEL CLAIM                            |
|  CLM-2024-0001                           |
|------------------------------------------|
|  This claim is still pending and can be  |
|  cancelled immediately.                  |
|                                          |
|  Reason for cancellation:                |
|  ○ Patient opted for self-pay            |
|  ○ Claim submitted in error              |
|  ○ Bill needs correction                 |
|  ○ Other: [________________]             |
|------------------------------------------|
|  [Cancel]           [Confirm Cancellation]|
+------------------------------------------+
```

#### For Approved Claims (Retraction Request)

```text
+------------------------------------------+
|  REQUEST RETRACTION                      |
|  CLM-2024-0001                           |
|------------------------------------------|
|  ⚠️ This claim has been APPROVED         |
|                                          |
|  To withdraw, you must:                  |
|  1. Contact {HMO Provider} via their     |
|     provider portal or relationship      |
|     manager                              |
|  2. Request that funds NOT be released   |
|  3. Void the HMO invoice                 |
|------------------------------------------|
|  HMO Contact: claims@hygeiahmo.com       |
|  Phone: +234 1 271 2200                  |
|------------------------------------------|
|  Reason for retraction:                  |
|  ○ Patient opted for private/self-pay    |
|  ○ Treatment plan changed                |
|  ○ Billing error discovered              |
|------------------------------------------|
|  Notes for HMO:                          |
|  [____________________________________]  |
|------------------------------------------|
|  [ ] I confirm I will contact the HMO    |
|      to complete this retraction         |
|------------------------------------------|
|  [Cancel]        [Submit Retraction Request]|
+------------------------------------------+
```

### Post-Withdrawal Actions

After successful withdrawal/retraction:
1. Claim status updated to 'withdrawn' or 'retracted'
2. Version history records the change
3. Option appears: "Generate Private Bill"
4. Opens BillCreationForm pre-filled with claim items

---

## Part 7: Convert to Private Bill

### New Component: `src/components/billing/organisms/bill-creation/ConvertToPrivateBillModal.tsx`

When converting from HMO to self-pay:

```text
+------------------------------------------+
|  GENERATE PRIVATE BILL                   |
|------------------------------------------|
|  Original Claim: CLM-2024-0001           |
|  HMO Claim Amount: ₦22,500               |
|------------------------------------------|
|  The HMO claim has been withdrawn.       |
|  A new private bill will be generated.   |
|------------------------------------------|
|  ITEMS TO BILL                           |
|  ☑ Consultation Fee         ₦15,000      |
|  ☑ Lab: FBC                  ₦5,000      |
|  ☑ Lab: MP                   ₦2,500      |
|  ──────────────────────────────────      |
|  Total:                     ₦22,500      |
|------------------------------------------|
|  Apply Discount?  [____]  %              |
|------------------------------------------|
|  [Cancel]  [Generate Bill & Collect]     |
+------------------------------------------+
```

After generating:
- New bill created with paymentMethod = 'cash' (or selected method)
- Opens PaymentCollectionForm immediately
- Original claim marked with reference to new bill

---

## Part 8: Data Layer Updates

### Update: `src/types/billing.types.ts`

```text
// Extended ClaimStatus
export type ClaimStatus = 
  | 'draft' 
  | 'submitted' 
  | 'processing' 
  | 'approved' 
  | 'denied' 
  | 'paid' 
  | 'withdrawn'   // Cancelled before HMO payment
  | 'retracted';  // Cancelled after HMO approval

// New ClaimDiagnosis interface
export interface ClaimDiagnosis {
  code: string;
  description: string;
  isPrimary: boolean;
}

// Extended HMOClaim
export interface HMOClaim {
  // ... existing fields ...
  diagnoses: ClaimDiagnosis[];
  withdrawnAt?: string;
  withdrawnReason?: 'patient_self_pay' | 'hospital_cancelled' | 'claim_error';
  retractionNotes?: string;
  privatePaymentId?: string;
  privateBillId?: string;
}
```

### Update: `src/data/claims.ts`

Add new functions:

```text
withdrawClaim(id: string, reason: string): HMOClaim
requestRetraction(id: string, notes: string): HMOClaim
convertToPrivateBill(claimId: string): { claim: HMOClaim; bill: Bill }
```

### New: `src/data/icd10-codes.ts`

Searchable ICD-10 catalog with common Nigerian clinical codes.

---

## Part 9: File Structure Summary

### New Files (6)

| File | Purpose |
|------|---------|
| `src/data/icd10-codes.ts` | ICD-10 code catalog |
| `src/components/billing/organisms/claim-details/PayOutOfPocketModal.tsx` | Self-pay conversion |
| `src/components/billing/organisms/claim-details/ClaimWithdrawalModal.tsx` | Withdrawal flows |
| `src/components/billing/organisms/bill-creation/ConvertToPrivateBillModal.tsx` | Bill conversion |
| `src/components/billing/molecules/documents/DocumentPreviewModal.tsx` | Document preview |
| `src/components/billing/molecules/diagnosis/DiagnosisSelector.tsx` | ICD-10 selector |

### Modified Files (8)

| File | Changes |
|------|---------|
| `src/data/patients.ts` | Add 3 test HMO patients |
| `src/types/billing.types.ts` | Add diagnosis, withdrawal fields |
| `src/data/claims.ts` | Add diagnosis data, withdrawal functions |
| `src/components/billing/organisms/claim-details/ClaimDetailsDrawer.tsx` | Bill items, docs preview, new actions |
| `src/components/billing/organisms/claim-submission/ClaimCreationModal.tsx` | Add diagnosis step |
| `src/pages/billing/ClaimsListPage.tsx` | Wire up new modals |
| `src/components/billing/organisms/tables/ClaimsTable.tsx` | Show diagnosis codes |
| `src/data/hmo-providers.ts` | Add contact details for retraction |

---

## Part 10: Implementation Order

1. **Data Layer First**:
   - Add ICD-10 codes catalog
   - Update billing types with new fields
   - Add test HMO patients
   - Update claims mock data with diagnoses

2. **Diagnosis Selection**:
   - Create DiagnosisSelector component
   - Add to ClaimCreationModal

3. **Document Preview**:
   - Create DocumentPreviewModal
   - Update ClaimDetailsDrawer

4. **Enhanced Claim Details**:
   - Show first 4 bill items
   - Add bill navigation
   - Wire up view bill action

5. **Withdrawal Flow**:
   - Create ClaimWithdrawalModal
   - Handle different status scenarios
   - Add to ClaimDetailsDrawer actions

6. **Pay Out of Pocket**:
   - Create PayOutOfPocketModal
   - Wire to denied claim actions
   - Connect to PaymentCollectionForm

7. **Private Bill Conversion**:
   - Create ConvertToPrivateBillModal
   - Link withdrawal to bill creation

8. **Integration Testing**:
   - Test complete flow end-to-end
   - Verify all status transitions
   - Test with mock HMO patients

---

## Part 11: User Flow Summary

### Happy Path: Claim Approved & Paid

```text
Create Claim → Add Diagnoses → Attach Docs → Submit → Processing → Approved → Paid
```

### Denied → Self-Pay Path

```text
Claim Denied → View Details → "Pay Out of Pocket" → Select Payment Method → Process → Receipt
```

### Withdrawal Before Approval

```text
Claim Submitted → View Details → "Cancel Claim" → Select Reason → Confirm → Withdrawn
→ Optional: "Generate Private Bill" → Collect Payment
```

### Retraction After Approval

```text
Claim Approved → View Details → "Request Retraction" → Enter Notes → Confirm Contact HMO
→ Status: "Retraction Requested" → Manual HMO Contact → Status Updated → Generate Private Bill
```

---

## Part 12: UI/UX Principles Applied

| Principle | Implementation |
|-----------|----------------|
| Clear Status Communication | Distinct badges and messaging for each claim state |
| Guided Workflows | Step-by-step modals for complex actions |
| Error Prevention | Confirmation dialogs before destructive actions |
| Context Preservation | Drawer-based details keep list visible |
| Progressive Disclosure | Show relevant actions based on status |
| Help Text | Inline guidance for HMO contact procedures |
| Audit Trail | Version history tracks all changes |
| Quick Access | Bill navigation from claim details |
