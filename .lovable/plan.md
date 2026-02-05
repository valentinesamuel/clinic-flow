
# Billing Module: Payment Collection & HMO Verification

## Overview

Build payment collection molecules, HMO verification flow, receipt components, and the PaymentCollectionForm organism. This extends the foundation from the previous plan (types, hooks, context, atoms).

---

## Part 1: Payment Molecules

### Directory: `src/components/billing/molecules/payment/`

### 1.1 PaymentMethodSelector.tsx

| Prop | Type | Description |
|------|------|-------------|
| `selected` | PaymentMethod | Currently selected method |
| `onChange` | (method: PaymentMethod) => void | Selection handler |
| `disabled` | PaymentMethod[] | Methods to disable |

Layout:
- 4-column grid on desktop, 2x2 on mobile
- Each button 80px height with icon above label
- Uses PaymentMethodButton atom
- Selected: Blue bg (#1e40af), white text, shadow
- Unselected: White bg, gray border

### 1.2 AmountBreakdown.tsx

| Prop | Type | Description |
|------|------|-------------|
| `subtotal` | number | Subtotal amount |
| `discount` | number | Discount amount (optional) |
| `tax` | number | Tax amount (optional, from clinic settings) |
| `total` | number | Total due |
| `showHMO` | boolean | Show HMO coverage section |
| `hmoCoverage` | number | Amount covered by HMO |
| `patientLiability` | number | Amount patient pays |

Features:
- Card with white bg, border, p-4
- Each line uses CurrencyDisplay atom
- Discount shows in red (negative)
- Divider before total
- Patient liability highlighted (blue bg)

### 1.3 ChangeCalculator.tsx

| Prop | Type | Description |
|------|------|-------------|
| `totalDue` | number | Amount due |
| `onAmountReceived` | (amount: number, change: number) => void | Callback with values |

Features:
- Uses AmountInput atom (large size)
- Quick amount buttons: Generate based on totalDue
  - Round up to nearest 5k, 10k, 20k increments
  - Example: ₦16,500 → [₦20k] [₦25k] [₦30k] [Exact]
- Change display: Large green text if valid
- Error display: Red text if amount < totalDue

### 1.4 PaymentSummaryCard.tsx

| Prop | Type | Description |
|------|------|-------------|
| `patient` | Patient | Patient information |
| `items` | PaymentItem[] | Service items |
| `total` | number | Total amount |

Layout:
- Header: "COLLECT PAYMENT"
- Patient info: Name, MRN
- Items list using ReceiptLineItem atoms
- Embedded AmountBreakdown at bottom

---

## Part 2: HMO Molecules

### Directory: `src/components/billing/molecules/hmo/`

### 2.1 HMOProviderSelector.tsx

| Prop | Type | Description |
|------|------|-------------|
| `selected` | string | Selected provider ID |
| `onChange` | (providerId: string) => void | Selection handler |

Features:
- Uses shadcn Select component
- Options from HMO_PROVIDERS data
- Each option shows: Icon + Provider name
- Shield icon as provider placeholder

### 2.2 HMOVerificationCard.tsx

| Prop | Type | Description |
|------|------|-------------|
| `verification` | HMOVerification | Verification result |
| `compact` | boolean | Show compact version |

Full version:
- Header: Green if active, red if expired
- Provider name and policy number
- Status with expiry date
- Coverage list with checkmarks/warnings
- Pre-auth code (copyable)

Compact version:
- Single line: "NHIA Verified | PA-2024-00456"

### 2.3 HMOCoPayCalculator.tsx

| Prop | Type | Description |
|------|------|-------------|
| `total` | number | Total pharmacy amount |
| `coPayPercentage` | number | Co-pay percentage (typically 10%) |
| `onChange` | (coPayAmount: number) => void | Callback with calculated co-pay |

Layout:
- Header: "PHARMACY CO-PAYMENT" with pill emoji
- Line: Total Pharmacy amount
- Line: HMO Covers (90%) in purple
- Highlighted box: Patient pays (10%) - large, bold

### 2.4 HMOCoverageDisplay.tsx

| Prop | Type | Description |
|------|------|-------------|
| `verification` | HMOVerification | Verification data |
| `service` | ServiceCategory | Service to check coverage |

Display states:
- **Covered (100%)**: Green background, checkmark
- **Partial (co-pay)**: Yellow background, warning icon
- **Not covered**: Red background, X icon

---

## Part 3: Receipt Molecules

### Directory: `src/components/billing/molecules/receipt/`

### 3.1 ReceiptHeader.tsx

| Prop | Type | Description |
|------|------|-------------|
| `receiptNumber` | string | Receipt reference |
| `date` | string | Receipt date/time |
| `cashier` | string | Cashier name (optional) |

Layout (80mm thermal format):
- Clinic logo placeholder (48px centered)
- Clinic name (bold, centered)
- Address lines (centered)
- Phone number
- Divider
- "RECEIPT" header
- Divider
- Receipt #, Date, Cashier

### 3.2 ReceiptItemList.tsx

| Prop | Type | Description |
|------|------|-------------|
| `items` | PaymentItem[] | Payment items |

Layout:
- "SERVICES" section header
- Each item using ReceiptLineItem atom
- Quantity shown as (xN) if > 1
- Sub-items indented with └─ prefix

### 3.3 ReceiptTotals.tsx

| Prop | Type | Description |
|------|------|-------------|
| `subtotal` | number | Subtotal |
| `discount` | number | Discount (optional) |
| `tax` | number | Tax amount (optional) |
| `total` | number | Total |
| `amountPaid` | number | Amount received |
| `change` | number | Change given (optional) |
| `paymentMethod` | PaymentMethod | Payment method used |

Layout:
- Subtotal, Discount, Tax lines
- Thick divider
- TOTAL (bold, larger)
- Amount Paid with method label
- Change in green

### 3.4 ReceiptFooter.tsx

| Prop | Type | Description |
|------|------|-------------|
| `showQRCode` | boolean | Whether to show QR code |
| `receiptId` | string | Receipt ID for QR URL |
| `paymentMethod` | PaymentMethod | Payment method |

Layout:
- Payment Method line
- Status: "PAID" (green, bold)
- QR Code (100px) linking to receipt URL
- Thank you message
- "Computer-generated receipt" note

QR Code URL format: `{clinic_url}/receipts/{receiptId}`

---

## Part 4: Bank Data

### New File: `src/data/nigerian-banks.ts`

Placeholder structure for Paystack integration:

```text
interface NigerianBank {
  id: string;
  name: string;
  code: string;
}

// Placeholder - will be replaced with Paystack API
const NIGERIAN_BANKS: NigerianBank[] = [
  { id: 'gtb', name: 'GTBank', code: '058' },
  { id: 'access', name: 'Access Bank', code: '044' },
  { id: 'zenith', name: 'Zenith Bank', code: '057' },
  { id: 'firstbank', name: 'First Bank', code: '011' },
  { id: 'uba', name: 'UBA', code: '033' },
  // ... more banks
];

// Hook for future Paystack integration
export function useNigerianBanks() {
  // TODO: Replace with Paystack API call
  return { banks: NIGERIAN_BANKS, isLoading: false };
}
```

---

## Part 5: Payment Collection Organism

### Directory: `src/components/billing/organisms/cashier-station/`

### PaymentCollectionForm.tsx

| Prop | Type | Description |
|------|------|-------------|
| `patient` | Patient | Patient data |
| `items` | PaymentItem[] | Items to pay for |
| `onComplete` | (clearance: PaymentClearance) => void | Success callback |
| `onCancel` | () => void | Cancel callback |

**Step 1: Review Items**
- PaymentSummaryCard with patient and items
- AmountBreakdown showing totals
- [Cancel] [Continue] buttons

**Step 2: Payment Method**
- PaymentMethodSelector (4 options)
- Conditional content based on selection:

| Method | Fields |
|--------|--------|
| Cash | ChangeCalculator |
| POS | Reference number input |
| Transfer | Bank selector (placeholder) + Reference number |
| HMO | HMOProviderSelector + Policy number + Verify button + HMOVerificationCard |

- [Back] [Process Payment] buttons

**Step 3: Success**
- Green success banner
- Receipt number (large)
- Amount, Method, Change details
- [Print Receipt] [Done] buttons

**Validation Rules:**
| Method | Required |
|--------|----------|
| Cash | amountReceived >= total |
| POS | referenceNumber not empty |
| Transfer | bank selected + referenceNumber |
| HMO | verification successful |

**State Management:**
```text
currentStep: 1 | 2 | 3
paymentMethod: PaymentMethod
amountReceived: number
referenceNumber: string
selectedBank: string
hmoProvider: string
policyNumber: string
verification: HMOVerification | null
clearance: PaymentClearance | null
```

### Step Components (Internal)

| Component | Purpose |
|-----------|---------|
| PaymentStepIndicator | Visual stepper (1 → 2 → 3) |
| Step1ReviewItems | Item review and summary |
| Step2PaymentMethod | Method selection and details |
| Step3Success | Confirmation and actions |

---

## Part 6: HMO Verification Organism

### Directory: `src/components/billing/organisms/hmo-verification/`

### HMOVerificationFlow.tsx

| Prop | Type | Description |
|------|------|-------------|
| `patient` | Patient | Patient data |
| `service` | ServiceCategory | Service being verified |
| `onVerified` | (verification: HMOVerification) => void | Success callback |
| `onCancel` | () => void | Cancel callback |

**States:**
1. **Select Provider**: HMOProviderSelector + Policy input
2. **Verifying**: Spinner with "Checking database..." message
3. **Success**: HMOVerificationCard + HMOCoverageDisplay
4. **Failed**: Error message with options (Proceed Cash / Cancel)

Uses useHMOVerification hook with 500ms simulated delay.

---

## Part 7: Thermal Receipt Component

### New File: `src/components/billing/organisms/receipt/ThermalReceipt.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `clearance` | PaymentClearance | Payment data |
| `patient` | Patient | Patient data |
| `onPrint` | () => void | Print handler |

Layout optimised for 80mm thermal paper:
- Fixed width: 80mm (approximately 302px at 96dpi)
- Monospace font for alignment
- Composed of: ReceiptHeader, ReceiptItemList, ReceiptTotals, ReceiptFooter
- QR code centered at bottom
- Print button triggers `window.print()` with print-specific CSS

Print CSS:
```text
@media print {
  .thermal-receipt {
    width: 80mm;
    margin: 0;
    padding: 0;
  }
  .no-print { display: none; }
}
```

---

## Part 8: File Structure Summary

### New Files (16)

| File | Purpose |
|------|---------|
| `src/data/nigerian-banks.ts` | Bank list placeholder for Paystack |
| `src/components/billing/molecules/payment/PaymentMethodSelector.tsx` | Payment method grid |
| `src/components/billing/molecules/payment/AmountBreakdown.tsx` | Amount summary card |
| `src/components/billing/molecules/payment/ChangeCalculator.tsx` | Change calculation |
| `src/components/billing/molecules/payment/PaymentSummaryCard.tsx` | Pre-payment summary |
| `src/components/billing/molecules/payment/index.ts` | Barrel export |
| `src/components/billing/molecules/hmo/HMOProviderSelector.tsx` | HMO dropdown |
| `src/components/billing/molecules/hmo/HMOVerificationCard.tsx` | Verification result |
| `src/components/billing/molecules/hmo/HMOCoPayCalculator.tsx` | Co-pay breakdown |
| `src/components/billing/molecules/hmo/HMOCoverageDisplay.tsx` | Coverage status |
| `src/components/billing/molecules/hmo/index.ts` | Barrel export |
| `src/components/billing/molecules/receipt/ReceiptHeader.tsx` | Receipt header |
| `src/components/billing/molecules/receipt/ReceiptItemList.tsx` | Items list |
| `src/components/billing/molecules/receipt/ReceiptTotals.tsx` | Totals section |
| `src/components/billing/molecules/receipt/ReceiptFooter.tsx` | Footer with QR |
| `src/components/billing/molecules/receipt/index.ts` | Barrel export |
| `src/components/billing/organisms/cashier-station/PaymentCollectionForm.tsx` | 3-step payment flow |
| `src/components/billing/organisms/cashier-station/index.ts` | Barrel export |
| `src/components/billing/organisms/hmo-verification/HMOVerificationFlow.tsx` | HMO verification |
| `src/components/billing/organisms/hmo-verification/index.ts` | Barrel export |
| `src/components/billing/organisms/receipt/ThermalReceipt.tsx` | Printable receipt |
| `src/components/billing/organisms/receipt/index.ts` | Barrel export |
| `src/components/billing/molecules/index.ts` | Main molecules barrel |
| `src/components/billing/organisms/index.ts` | Main organisms barrel |

---

## Part 9: Implementation Order

1. **Bank Data**: Create nigerian-banks.ts placeholder
2. **Payment Molecules**: PaymentMethodSelector, AmountBreakdown, ChangeCalculator, PaymentSummaryCard
3. **HMO Molecules**: HMOProviderSelector, HMOVerificationCard, HMOCoPayCalculator, HMOCoverageDisplay
4. **Receipt Molecules**: ReceiptHeader, ReceiptItemList, ReceiptTotals, ReceiptFooter
5. **HMO Organism**: HMOVerificationFlow
6. **Receipt Organism**: ThermalReceipt with print CSS
7. **Payment Organism**: PaymentCollectionForm (3-step flow)
8. **Barrel Exports**: Create all index.ts files
9. **Integration**: Wire up to BillingDashboard

---

## Part 10: Testing Checklist

After implementation:

| Test | Expected |
|------|----------|
| Payment method switches | All 4 methods selectable |
| Change calculator | Correct calculation, quick buttons work |
| Insufficient amount | Red error message shown |
| HMO provider selector | Shows 5 providers |
| HMO verification | 500ms delay, shows result |
| Co-pay calculator | Shows 10% for pharmacy |
| Receipt header | Clinic info displayed |
| Receipt items | Quantities and indentation correct |
| Receipt totals | All amounts calculated |
| PaymentCollectionForm Step 1→2 | Always allowed |
| PaymentCollectionForm Step 2→3 | Validates per method |
| Cash validation | Requires amount >= total |
| POS validation | Requires reference number |
| Transfer validation | Requires bank + reference |
| HMO validation | Requires successful verification |
| Print receipt | Opens print dialog, 80mm format |
| Currency formatting | All use clinic currency |

---

## Dependencies

This plan depends on:
- Foundation plan (types, hooks, context, atoms) being implemented first
- Existing shadcn/ui components (Dialog, Select, Button, Card, Input)
- Existing atoms (CurrencyDisplay, AmountInput, PaymentMethodButton, etc.)

No new npm packages required. QR code will use a simple placeholder until qrcode.react is added if needed.
