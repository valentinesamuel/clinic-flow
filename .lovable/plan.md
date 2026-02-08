
# Comprehensive Pharmacy Module Implementation Plan

## Executive Summary

This plan implements a full-featured Pharmacy Module that serves as a clinical control point, financial firewall, and theft-resistant revenue engine. The module encompasses prescription queue management, multi-tariff dispensing, inventory fortress controls, clinical safety automation, HMO justification enforcement, retail POS functionality, and intelligent reporting.

---

## Part 1: Data Layer & Type Definitions

### New Types in `src/types/pharmacy.types.ts`

Create a dedicated pharmacy types file with the following interfaces:

| Type | Purpose |
|------|---------|
| `PrescriptionQueueEntry` | Enhanced prescription with payment status, PA codes, source type |
| `DispensingItem` | Individual drug with brand selection, batch tracking, FEFO |
| `DispensingRecord` | Complete dispensing transaction with stock deductions |
| `DrugFormulary` | Drug catalog with generic/brand, HMO approval status |
| `DrugBatch` | Batch tracking with expiry, quantity, location |
| `StockRequisition` | Internal requisition from pharmacy to main store |
| `DrugInteraction` | Drug-drug interaction alert data |
| `RetailItem` | Non-prescription retail items (barcode, VAT, fixed price) |
| `RetailSale` | POS transaction for walk-in retail |
| `ShrinkageLog` | Damage/expiry/missing stock logging |
| `DispensingAudit` | Audit trail for reversed/cancelled dispenses |

### Key Type Definitions

```text
// Prescription Queue Entry
interface PrescriptionQueueEntry {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  sourceType: 'in_patient' | 'out_patient' | 'walk_in';
  payerStatus: 'hmo' | 'retainership' | 'private';
  paymentStatus: 'paid' | 'unpaid' | 'pending_pa';
  paCode?: string;
  diagnosisCode: string; // ICD-10 required
  diagnosisDescription: string;
  prescriberId: string;
  prescriberName: string;
  prescriberLevel: 'gp' | 'consultant' | 'specialist';
  items: PrescriptionItemWithStock[];
  priority: 'normal' | 'urgent' | 'stat';
  queuedAt: string;
  dispensedAt?: string;
  dispensedBy?: string;
  notes?: string;
}

// Drug with Batch Tracking
interface DrugBatch {
  id: string;
  drugId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  location: string;
  receivedDate: string;
  costPrice: number;
}

// Retail Item for POS
interface RetailItem {
  id: string;
  barcode: string;
  name: string;
  category: 'otc' | 'cosmetic' | 'supplement' | 'baby_care' | 'first_aid';
  unitPrice: number;
  vatApplicable: boolean;
  currentStock: number;
  reorderLevel: number;
}
```

### New Data Files

| File | Purpose |
|------|---------|
| `src/data/drug-formulary.ts` | Nigerian essential drugs with brands, generics, HMO lists |
| `src/data/drug-batches.ts` | Batch/expiry tracking mock data |
| `src/data/drug-interactions.ts` | Common drug-drug interactions database |
| `src/data/retail-catalog.ts` | Retail items with barcodes |
| `src/data/requisitions.ts` | Stock requisition history |

---

## Part 2: Prescription Queue (Digital Handshake)

### PrescriptionQueuePage.tsx (`src/pages/pharmacy/PrescriptionQueuePage.tsx`)

Main prescription queue interface visible only after Doctor commits prescription with ICD-10 diagnosis.

**Layout:**
```text
+--------------------------------------------------+
| PRESCRIPTION QUEUE           [Filters ▼] [Stats] |
+--------------------------------------------------+
| SOURCE: [All] [In-Patient] [Out-Patient] [Walk-In]|
| PAYER:  [All] [HMO] [Retainer] [Private-Paid]     |
|         [Private-Unpaid]                          |
+--------------------------------------------------+
| [🔴] Aisha Mohammed - PT-2026-00123              |
|     In-Patient | HMO: Hygeia | PA: PA-2026-XXXX  |
|     Dx: J45.20 - Mild asthma                     |
|     3 items | Dr. Nwosu (Consultant)             |
|     [View Rx] [DISPENSE ✓]                       |
|--------------------------------------------------+
| [🟡] Emmanuel Adeleke - PT-2026-0002             |
|     Out-Patient | PRIVATE: UNPAID                 |
|     Dx: E11.9 - Type 2 diabetes                  |
|     1 item | Dr. Adeyemi (GP)                    |
|     [View Rx] [DISPENSE 🔒] ← Disabled           |
+--------------------------------------------------+
```

**Features:**
- Real-time queue from doctor prescriptions
- Color-coded payment status (Green=Paid, Red=Unpaid, Yellow=Pending PA)
- Source type filtering (In-Patient, Out-Patient, Walk-In)
- Payer filtering (HMO/Retainer/Private)
- Patient context bar with allergies visible
- Queue priority sorting

**Hard Guardrail - No-Voucher, No-Drug Rule:**
- "Dispense" button disabled unless:
  - Private → Payment confirmed (green badge)
  - HMO → PA Code attached OR drug on auto-approved list

### PrescriptionQueueCard.tsx (`src/components/pharmacy/PrescriptionQueueCard.tsx`)

Individual queue entry card showing:
- Patient name, MRN, photo
- Source type badge (In-Patient/Out-Patient/Walk-In)
- Payer status with color coding
- PA Code if HMO
- Diagnosis (ICD-10 code + description)
- Prescriber name and level
- Item count
- Action buttons (View, Dispense)

---

## Part 3: Multi-Tariff Dispensing Engine

### DispensingWorkflow.tsx (`src/pages/pharmacy/DispensingWorkflow.tsx`)

Multi-step dispensing workflow:

**Step 1: Verify Prescription**
```text
+------------------------------------------+
| VERIFY PRESCRIPTION                      |
+------------------------------------------+
| Patient: Aisha Mohammed (PT-2026-00123)  |
| Allergies: [⚠️ Penicillin]               |
|                                          |
| Prescriber: Dr. Chukwuemeka Nwosu        |
| Diagnosis: J45.20 - Mild asthma          |
| Justification: [Doctor's clinical notes] |
|                                          |
| ✓ Diagnosis attached                     |
| ✓ Prescriber verified                    |
| ✓ Payment status: CLEARED                |
+------------------------------------------+
```

**Step 2: Drug Selection & Substitution**
```text
+------------------------------------------+
| SELECT DRUGS                             |
+------------------------------------------+
| 1. Ventolin Inhaler                      |
|    Prescribed: Ventolin (Brand)          |
|    ┌─────────────────────────────────┐   |
|    │ ○ Ventolin (GlaxoSmithKline)   │   |
|    │   ₦4,500 | Stock: 50           │   |
|    │ ● Salbutamol Generic            │   | ← Auto-suggested
|    │   ₦2,800 | Stock: 120          │   |
|    │   [HMO Approved ✓]             │   |
|    └─────────────────────────────────┘   |
|    Selected: Salbutamol Generic          |
|                                          |
|    ⚠️ DRUG INTERACTION WARNING          |
|    [Minor] with Propranolol              |
|    [Acknowledge & Continue]              |
+------------------------------------------+
```

**Step 3: Batch Selection (FEFO)**
```text
+------------------------------------------+
| SELECT BATCH (FEFO)                      |
+------------------------------------------+
| Salbutamol Inhaler                       |
| Qty Required: 1                          |
|                                          |
| Available Batches:                       |
| ┌─────────────────────────────────────┐  |
| │ ● Batch: SAL-2024-001              │  | ← First expiring
| │   Expiry: 15 Mar 2026 (38 days)    │  |
| │   Stock: 45 | Location: Shelf A1   │  |
| ├─────────────────────────────────────┤  |
| │ ○ Batch: SAL-2024-002              │  |
| │   Expiry: 30 Jun 2026 (145 days)   │  |
| │   Stock: 75 | Location: Shelf A1   │  |
| └─────────────────────────────────────┘  |
|                                          |
| FEFO: First-Expiring-First-Out enforced  |
+------------------------------------------+
```

**Step 4: Partial Dispensing (if needed)**
```text
+------------------------------------------+
| PARTIAL DISPENSING                       |
+------------------------------------------+
| Paracetamol 500mg                        |
| Prescribed: 60 tablets                   |
| Available: 25 tablets                    |
|                                          |
| Dispense: [25] of 60                     |
|                                          |
| ⚠️ Partial fill - 35 tablets outstanding|
| Patient will need to return              |
|                                          |
| [Create Outstanding Balance Record]      |
+------------------------------------------+
```

**Step 5: Auto-Label & Finalize**
```text
+------------------------------------------+
| FINALIZE DISPENSING                      |
+------------------------------------------+
| ┌─────────────────────────────────────┐  |
| │ LABEL PREVIEW                       │  |
| │ ─────────────────────────────────── │  |
| │ Salbutamol Inhaler 100mcg          │  |
| │ Patient: Aisha Mohammed            │  |
| │ Dose: 2 puffs when needed          │  |
| │ Max: 8 puffs in 24 hours           │  |
| │ Batch: SAL-2024-001                │  |
| │ Exp: 15-Mar-2026                   │  |
| └─────────────────────────────────────┘  |
|                                          |
| [Print Labels] [Complete Dispensing]     |
+------------------------------------------+
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `DrugSelector.tsx` | Drug search with brand/generic alternatives |
| `GenericSubstitutionEngine.tsx` | Suggest in-stock generics for prescribed brands |
| `BatchSelector.tsx` | FEFO-enforced batch selection |
| `PartialDispensingModal.tsx` | Handle partial fills with outstanding tracking |
| `DrugLabelGenerator.tsx` | Auto-generate labels from dosage instructions |
| `DrugInteractionAlert.tsx` | Display drug-drug interaction warnings |
| `AllergyWarningBanner.tsx` | Red banner for allergy conflicts |

---

## Part 4: Inventory Fortress (Anti-Theft Core)

### DrugInventoryPage.tsx (`src/pages/pharmacy/DrugInventoryPage.tsx`)

Comprehensive inventory management with anti-theft controls:

**Features:**
- Batch + Expiry tracking for all drugs
- FEFO enforcement (cannot dispense newer batch if older exists)
- Real-time stock sync (dispense = immediate deduction)
- No manual override for stock adjustments (requires approval)
- Expiry alerts (30, 60, 90 days)
- Low stock alerts
- Location tracking (Shelf A1, Pharmacy Store B, etc.)

### StockRequisitionFlow.tsx (`src/pages/pharmacy/StockRequisitionFlow.tsx`)

Internal requisition from Pharmacy to Main Store:

```text
+------------------------------------------+
| NEW REQUISITION                          |
+------------------------------------------+
| Requesting: Pharmacy                     |
| From: Main Store                         |
|                                          |
| Items:                                   |
| + Paracetamol 500mg    | Qty: 500       |
| + Amoxicillin 500mg    | Qty: 200       |
| + Metformin 500mg      | Qty: 300       |
|                                          |
| Reason: Low stock replenishment          |
|                                          |
| [Submit Request]                         |
+------------------------------------------+
| APPROVAL WORKFLOW                        |
| 1. Pharmacist submits                    |
| 2. Storekeeper reviews & approves        |
| 3. Pharmacist acknowledges receipt       |
| Both digital signatures required         |
+------------------------------------------+
```

### ShrinkageLogPage.tsx (`src/pages/pharmacy/ShrinkageLogPage.tsx`)

Mandatory logging for stock discrepancies:

```text
+------------------------------------------+
| LOG SHRINKAGE / DAMAGE                   |
+------------------------------------------+
| Type: [Expired] [Damaged] [Missing]      |
|                                          |
| Drug: Amoxicillin 500mg                  |
| Batch: AMX-2024-003                      |
| Quantity Affected: [___]                 |
| Reason: [________________________]       |
|                                          |
| Evidence Photo: [Upload]                 |
|                                          |
| ⚠️ Admin approval required for write-off |
|                                          |
| [Submit for Approval]                    |
+------------------------------------------+
```

### Theft Detection Alerts

System flags for review:
- Cancelled bills with "Returned to Stock"
- Repeated reversals by same staff
- Stock count vs system mismatch
- Unusual dispensing patterns

---

## Part 5: Clinical Safety & Evidence Layer

### Clinical Safety Components

**PatientContextBar.tsx** (Sticky header during dispensing):
```text
+--------------------------------------------------+
| 👤 Aisha Mohammed | PT-2026-00123 | 39F          |
| [🔴 Allergies: Penicillin, Sulfa]                |
| [🟡 Conditions: Hypertension, Asthma]            |
| Current Meds: Lisinopril 10mg, Amlodipine 5mg    |
+--------------------------------------------------+
```

**DrugInteractionChecker.tsx**:
- Checks prescribed drugs against:
  - Current medications
  - Other prescribed items in same prescription
- Severity levels: Minor, Moderate, Severe
- Severe interactions require "Prescribe Anyway" confirmation

**AllergyBlocker.tsx**:
- Hard block on drugs containing allergens
- Cannot proceed without override by prescriber

### Chain of Evidence

Pharmacist can view (read-only):
- Diagnosis (ICD-10) from consultation
- Prescriber details and credentials
- Clinical justification written by doctor
- All attached to dispensing record for HMO audit

---

## Part 6: HMO Justification & Policy Enforcement

### HMO Rules Engine

**Prescriber Level Validation:**
```text
Drug: Specialist Antibiotic XYZ
Rule: Consultant-only authorization required

Prescribed by: Dr. Adeyemi (GP)
Status: ❌ BLOCKED

Options:
[Escalate to Consultant] [Request Override]
```

**Clinical Justification Display:**
```text
+------------------------------------------+
| HMO JUSTIFICATION                        |
+------------------------------------------+
| Drug: Expensive Brand Medication         |
|                                          |
| Doctor's Justification:                  |
| "Patient has documented intolerance to   |
| generic alternatives. Brand medication   |
| required for therapeutic efficacy."      |
|                                          |
| ✓ Attached to claim for HMO review       |
+------------------------------------------+
```

### PACodeVerifier.tsx

Verify Pre-Authorization codes for HMO drugs:
- Check PA code validity
- Verify covered amount
- Flag expired/invalid codes

---

## Part 7: Walk-In Retail Flow (POS Mode)

### RetailPOSPage.tsx (`src/pages/pharmacy/RetailPOSPage.tsx`)

Direct retail sales without clinical workflow:

```text
+--------------------------------------------------+
| RETAIL POS                      [New Sale]       |
+--------------------------------------------------+
| Scan Barcode: [____________________] 📷          |
|                                                  |
| CART                                             |
| ┌──────────────────────────────────────────────┐ |
| │ Multivitamin (120 caps)        ₦3,500   x1  │ |
| │ Hand Sanitizer 500ml           ₦1,200   x2  │ |
| │ Baby Wipes (80 sheets)         ₦1,800   x1  │ |
| └──────────────────────────────────────────────┘ |
|                                                  |
| Subtotal:                            ₦7,700     |
| VAT (7.5%):                            ₦578     |
| ─────────────────────────────────────────────── |
| TOTAL:                               ₦8,278     |
|                                                  |
| Payment: [Cash] [POS] [Transfer]                 |
|                                                  |
| [Cancel Sale]              [Complete Sale]       |
+--------------------------------------------------+
```

**Features:**
- Barcode scanning (camera or manual entry)
- No manual price entry (prevents fraud)
- VAT auto-applied to applicable items
- Bundle/kit support (e.g., Maternity Kit)
- Separate inventory from clinical stock
- Walk-in customers (no patient registration required)

### RetailInventoryPage.tsx

Separate catalog for retail items:
- OTC medications
- Cosmetics
- Supplements
- Baby care
- First aid supplies

---

## Part 8: One-Receipt Experience

### UnifiedReceipt.tsx (`src/components/pharmacy/UnifiedReceipt.tsx`)

Single receipt with clear sections:

```text
+------------------------------------------+
|        LIFECARE MEDICAL CENTRE           |
|        Pharmacy Receipt                   |
+------------------------------------------+
| Receipt: RX-2026-00123                   |
| Date: 04 Feb 2026, 2:45 PM              |
| Patient: Aisha Mohammed                  |
| MRN: PT-2026-00123                      |
+------------------------------------------+
| HMO COVERED ITEMS (Hygeia HMO)           |
| PA Code: PA-2026-XXXX                   |
|------------------------------------------|
| Salbutamol Inhaler        ₦2,800        |
| Montelukast 10mg x30      ₦4,500        |
| ---------------------------------------- |
| HMO Covers (90%):        -₦6,570        |
| Patient Co-pay (10%):     ₦730          |
+------------------------------------------+
| PRIVATE / NON-COVERED ITEMS              |
|------------------------------------------|
| Vitamin C 1000mg x30      ₦2,500        |
| ---------------------------------------- |
| Subtotal:                 ₦2,500        |
+------------------------------------------+
| TOTAL PATIENT PAYS:       ₦3,230        |
+------------------------------------------+
| Dispensed by: Pharm. Blessing Okafor     |
+------------------------------------------+
```

---

## Part 9: Pharmacy Admin & Intelligence Reports

### PharmacyReportsPage.tsx (`src/pages/pharmacy/PharmacyReportsPage.tsx`)

**Report Types:**

| Report | Content |
|--------|---------|
| Fast/Slow Movers | Drug turnover analysis |
| Expiry Risk | Items expiring in 30/60/90 days |
| Revenue vs Cost | Margin analysis per drug |
| HMO Margin | Revenue after HMO discounts |
| Theft Detection | Flagged suspicious activities |
| Stock Reconciliation | System vs physical count |
| Prescription Analysis | Top prescribers, common drugs |
| Outstanding Balances | Partial dispenses pending |

### Dashboard Widgets

```text
+------------------------------------------+
| PHARMACY INTELLIGENCE                    |
+------------------------------------------+
| ┌──────────┬──────────┬──────────┐       |
| │ Revenue  │ Margin   │ HMO Rec. │       |
| │ ₦2.5M    │ 32%      │ ₦890K    │       |
| │ This Week│          │ Pending  │       |
| └──────────┴──────────┴──────────┘       |
|                                          |
| ⚠️ 3 items expiring in 30 days          |
| ⚠️ 5 items below reorder level          |
| 🔴 2 flagged reversals for review       |
+------------------------------------------+
```

---

## Part 10: File Structure Summary

### New Files (28+)

**Types:**
| File | Purpose |
|------|---------|
| `src/types/pharmacy.types.ts` | All pharmacy-specific types |

**Data:**
| File | Purpose |
|------|---------|
| `src/data/drug-formulary.ts` | Drug catalog with generics/brands |
| `src/data/drug-batches.ts` | Batch tracking data |
| `src/data/drug-interactions.ts` | Interaction database |
| `src/data/retail-catalog.ts` | Retail items |
| `src/data/requisitions.ts` | Stock requisitions |

**Pages:**
| File | Purpose |
|------|---------|
| `src/pages/pharmacy/PrescriptionQueuePage.tsx` | Main queue |
| `src/pages/pharmacy/DispensingWorkflow.tsx` | Multi-step dispense |
| `src/pages/pharmacy/DrugInventoryPage.tsx` | Inventory management |
| `src/pages/pharmacy/StockRequisitionFlow.tsx` | Internal requisitions |
| `src/pages/pharmacy/ShrinkageLogPage.tsx` | Damage/loss logging |
| `src/pages/pharmacy/RetailPOSPage.tsx` | Walk-in retail |
| `src/pages/pharmacy/RetailInventoryPage.tsx` | Retail stock |
| `src/pages/pharmacy/PharmacyReportsPage.tsx` | Intelligence reports |

**Components:**
| File | Purpose |
|------|---------|
| `src/components/pharmacy/PrescriptionQueueCard.tsx` | Queue entry card |
| `src/components/pharmacy/DrugSelector.tsx` | Drug search |
| `src/components/pharmacy/GenericSubstitutionEngine.tsx` | Generic suggestions |
| `src/components/pharmacy/BatchSelector.tsx` | FEFO batch picker |
| `src/components/pharmacy/PartialDispensingModal.tsx` | Partial fills |
| `src/components/pharmacy/DrugLabelGenerator.tsx` | Label printing |
| `src/components/pharmacy/DrugInteractionAlert.tsx` | Interaction warnings |
| `src/components/pharmacy/AllergyWarningBanner.tsx` | Allergy blocks |
| `src/components/pharmacy/PACodeVerifier.tsx` | HMO PA verification |
| `src/components/pharmacy/UnifiedReceipt.tsx` | Combined receipt |
| `src/components/pharmacy/RetailCartItem.tsx` | POS cart item |
| `src/components/pharmacy/BarcodeScanner.tsx` | Camera barcode scan |
| `src/components/pharmacy/ShrinkageForm.tsx` | Loss logging form |
| `src/components/pharmacy/RequisitionCard.tsx` | Requisition display |

### Modified Files

| File | Changes |
|------|---------|
| `src/pages/dashboards/PharmacistDashboard.tsx` | Remove "Coming Soon", add live queue |
| `src/data/prescriptions.ts` | Add diagnosis, payment status fields |
| `src/data/inventory.ts` | Add batch tracking, FEFO logic |
| `src/App.tsx` | Add new pharmacy routes |
| `src/components/layout/AppSidebar.tsx` | Add pharmacy navigation items |
| `src/types/clinical.types.ts` | Extend Prescription interface |

---

## Part 11: Routes & Navigation

### New Routes in `src/App.tsx`

```text
// Pharmacist Routes
/pharmacist/queue              - Prescription queue
/pharmacist/dispense/:rxId     - Dispensing workflow
/pharmacist/inventory          - Drug inventory
/pharmacist/inventory/batches  - Batch management
/pharmacist/requisitions       - Stock requisitions
/pharmacist/shrinkage          - Shrinkage logging
/pharmacist/retail             - Retail POS
/pharmacist/retail/inventory   - Retail stock
/pharmacist/reports            - Intelligence reports
/pharmacist/billing            - (existing) Pharmacy billing
```

### Sidebar Navigation Updates

```text
Pharmacist Menu:
├── Dashboard
├── Prescription Queue ← NEW
├── Dispensing Log
├── Inventory
│   ├── Drug Stock
│   ├── Batch Tracking
│   └── Requisitions
├── Retail POS ← NEW
├── Shrinkage Log ← NEW
├── Reports ← NEW
└── Billing
```

---

## Part 12: Implementation Order

1. **Phase 1: Types & Data Layer**
   - Create pharmacy.types.ts
   - Create drug-formulary.ts with Nigerian essential drugs
   - Create drug-batches.ts with FEFO logic
   - Create drug-interactions.ts

2. **Phase 2: Prescription Queue**
   - PrescriptionQueuePage
   - PrescriptionQueueCard
   - Payment status indicators
   - PA code verification

3. **Phase 3: Dispensing Workflow**
   - DrugSelector with brand/generic
   - GenericSubstitutionEngine
   - BatchSelector with FEFO
   - PartialDispensingModal
   - DrugLabelGenerator

4. **Phase 4: Clinical Safety**
   - DrugInteractionAlert
   - AllergyWarningBanner
   - PatientContextBar enhancement
   - Chain of evidence display

5. **Phase 5: Inventory Fortress**
   - DrugInventoryPage
   - BatchManagement
   - StockRequisitionFlow
   - ShrinkageLogPage
   - Dual signature workflow

6. **Phase 6: Retail POS**
   - RetailPOSPage
   - BarcodeScanner
   - RetailInventoryPage
   - VAT calculation

7. **Phase 7: Receipts & Reports**
   - UnifiedReceipt
   - PharmacyReportsPage
   - Dashboard widgets

8. **Phase 8: Dashboard & Navigation**
   - Update PharmacistDashboard
   - Add routes to App.tsx
   - Update sidebar navigation

---

## Part 13: Workflow Guardrails Summary

| Step | Action | Non-Negotiable Rule |
|------|--------|---------------------|
| 1 | View Prescription | Diagnosis (ICD-10) must exist |
| 2 | Verify Payer | No payment/PA → No dispense button |
| 3 | Check Safety | Drug interactions + allergies acknowledged |
| 4 | Pick Stock | FEFO batch enforced (cannot skip) |
| 5 | Label | Auto-generated from dosage |
| 6 | Finalize | Stock deducts instantly + audit logged |

---

## Part 14: Testing Scenarios

| Test | Expected Result |
|------|-----------------|
| Prescription without diagnosis | Cannot enter queue |
| Private patient, unpaid | Dispense button disabled |
| HMO patient, no PA code | Dispense disabled unless auto-approved |
| Drug with allergy | Hard block, cannot proceed |
| Severe drug interaction | Must acknowledge before continue |
| Select non-FEFO batch | System prevents selection |
| Partial dispense | Outstanding balance created |
| Retail barcode scan | Item added to cart instantly |
| Manual price entry retail | Not possible (no input field) |
| Stock requisition | Requires dual signatures |
| Shrinkage logging | Admin approval required |

---

## Part 15: Security & Audit Considerations

**Audit Trail Captures:**
- Every dispensing transaction
- Stock movements (in/out)
- Requisition approvals
- Shrinkage write-offs
- Reversed/cancelled dispenses
- Price changes
- User who performed each action
- Timestamp for all events

**Theft Prevention:**
- No manual stock adjustments
- FEFO cannot be bypassed
- Reversed dispenses flagged
- Physical count vs system reconciliation
- Barcode-only retail (no manual prices)
