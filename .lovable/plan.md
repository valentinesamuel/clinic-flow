
# Billing Module - Cashier Dashboard, Billing Codes & Service Pricing

## Overview

This plan implements a comprehensive billing module with:
1. **Cashier Dashboard** - Main cashier interface with shift management and payment queue
2. **Pharmacy Billing Code Flow** - Enhanced workflow with code generation and payment processing
3. **Service Pricing Management** - Hospital Admin pricing table with CMO approval workflow
4. **Emergency Override System** - Authorized bypass for life-threatening cases
5. **Receipt Print Template** - A5-sized print-friendly receipt

---

## Part 1: Data Layer & Types

### New Types in `src/types/billing.types.ts`

Add new interfaces for shift management, service pricing, and emergency override:

| Type | Purpose |
|------|---------|
| `CashierShift` | Track shift start/end, transactions, cash reconciliation |
| `ServicePrice` | Service catalog with pricing and approval status |
| `PriceApproval` | Pending price changes awaiting CMO approval |
| `EmergencyOverride` | Logged bypass of payment requirement |
| `BillingCodeEntry` | Enhanced billing code with status tracking |

### New Data Files

| File | Purpose |
|------|---------|
| `src/data/service-pricing.ts` | Service catalog with consultation, lab, pharmacy items |
| `src/data/cashier-shifts.ts` | Mock shift data and transaction tracking |

---

## Part 2: Cashier Dashboard Components

### CashierDashboard.tsx (`src/components/billing/organisms/cashier-station/`)

Main cashier interface with three sections:

**Layout Structure:**
- Header with station name and shift controls
- Stats row (Transactions, Total, Cash, POS)
- Payment Queue list with patient cards and "Collect" buttons
- Recent Transactions table with receipt links

**Props:**
```text
interface CashierDashboardProps {
  station: 'main' | 'lab' | 'pharmacy';
}
```

**Features:**
- Payment queue filtered by station
- Real-time stats update
- Opens PaymentCollectionForm on "Collect" click
- Links to shift report on end shift

### TransactionHistory.tsx

Full transaction history table with filters:
- Search by receipt number, patient name, MRN
- Filter by date range, payment method
- Sort and pagination
- Click row to view receipt
- Export CSV option

### CashierShiftReport.tsx

End-of-shift report modal:
- Shift summary (start/end time, duration)
- Transaction breakdown by payment method
- Cash reconciliation with variance calculation
- Closing balance input
- Variance indicator (green/yellow/red based on amount)

---

## Part 3: Pharmacy Billing Code Enhancement

### PharmacyBillingCodeFlow.tsx (`src/components/billing/organisms/billing-codes/`)

**Pharmacist side - Generate Code:**

Step 1: Review selected drugs from prescription
- Patient and prescription info
- Drug list with prices
- HMO co-pay calculation (10% for HMO patients)
- Subtotal and patient liability

Step 2: Code generated display
- Large, bold 8-character code
- Expiry date (3 days)
- Print option for patient slip
- Instructions for billing desk

### CodePaymentProcessor.tsx

**Cashier side - Process payment by code:**

Step 1: Code entry
- 8-character input field
- Lookup button

Step 2: Code found - show details
- Patient info
- Items and prices
- HMO coverage if applicable
- Patient pays amount (large, bold)
- Payment method selection (Cash/POS/Transfer only)
- Change calculator for cash

Step 3: Payment success
- Receipt number
- Code marked as PAID
- Patient can collect drugs
- Print receipt option

---

## Part 4: Service Pricing Management

### ServicePricingTable.tsx (`src/components/billing/organisms/service-pricing/`)

**Hospital Admin pricing management:**

Table with columns:
- Service code
- Service name
- Category
- Current price
- Status (Approved/Pending/Rejected)
- Actions menu

Filters:
- Category dropdown (All, Consultation, Lab, Pharmacy, Procedure)
- Search
- Status filter
- Pagination

Actions:
- Add new service
- Edit existing (price change)
- Archive
- View price history

### AddServiceModal.tsx

New service creation form:
- Category selector (auto-prefixes code)
- Service code input
- Service name
- Description
- Standard price
- HMO price (optional)
- Taxable checkbox
- Warning: "Requires CMO approval"

### EditServiceModal.tsx

Price change form:
- Read-only service info
- Current price display
- New price input
- Auto-calculated change percentage
- Reason for change (required)
- Submit for approval

---

## Part 5: CMO Price Approval Queue

### PriceApprovalQueue.tsx (`src/pages/settings/`)

CMO approval interface:
- List of pending price changes
- Each card shows:
  - Service name and category
  - Price change (old arrow new with percentage)
  - Requested by (name + role)
  - Date and time
  - Reason for change
- Approve and Reject buttons

### PriceApprovalModal.tsx

Approve: Optional notes input
Reject: Required rejection reason

On approve: Update service price, notify admin
On reject: Keep old price, notify admin with reason

---

## Part 6: Emergency Override System

### EmergencyOverrideModal.tsx (`src/components/billing/organisms/emergency-override/`)

Emergency payment bypass (Doctor/CMO only):

Form fields:
- Patient info display
- Warning message about audit logging
- Reason for override (required, min 20 chars)
- Override scope selection:
  - Consultation only
  - Consultation + Emergency
  - Full visit (all services)
- Confirmation checkbox
- Authorizing staff name

On authorize:
- Create payment clearance with emergency status
- Add patient to queue immediately
- Create audit log entry
- Flag patient profile with red banner
- Track outstanding amount
- Notify billing department

### Patient Profile Emergency Banner

When emergency override is active:
- Red banner at top of profile
- Shows outstanding amount
- Authorized by name and date
- Link to clear/pay

---

## Part 7: Receipt Print Template

### ReceiptPrintTemplate.tsx (`src/components/billing/templates/`)

A5-sized (148x210mm) print-friendly receipt:

Sections:
- Clinic logo and header
- Receipt number and date
- Patient information
- Services list with prices
- Subtotal, tax, discount, total
- Amount paid and change
- Payment method and status
- QR code for digital verification
- Footer with thank you message

CSS:
- @media print styles
- 80mm thermal printer option
- "PAID" watermark
- window.print() trigger

---

## Part 8: Routes & Navigation

### New Routes in `src/App.tsx`

```text
// Cashier routes
/billing/cashier          - Main cashier dashboard
/billing/cashier/lab      - Lab station cashier
/billing/cashier/pharmacy - Pharmacy station cashier
/billing/shift-report     - Current shift report
/billing/receipt/:id      - Receipt viewer

// Hospital Admin routes
/hospital-admin/settings/pricing - Service pricing management

// CMO routes
/cmo/approvals/pricing    - Price approval queue
```

### Sidebar Updates

Add navigation items for:
- Billing Officer: Cashier Dashboard link
- Hospital Admin: Settings > Pricing
- CMO: Approvals > Pricing

---

## Part 9: Mock Data for Testing

### Ensure Searchable Patients

Update mock data to ensure patient searches return results:
- Add more diverse names that match common search terms
- Include patients with pending bills for queue testing
- Add patients with billing codes for code lookup testing

### Sample Billing Codes

Pre-populate bills with codes:
- `PH3K7M2Q` - Pharmacy, pending
- `LB7K2M4P` - Lab, pending
- `PH5N8R3T` - Pharmacy, paid

---

## Part 10: File Structure Summary

### New Files (16)

| File | Purpose |
|------|---------|
| `src/types/cashier.types.ts` | Shift and transaction types |
| `src/data/service-pricing.ts` | Service catalog data |
| `src/data/cashier-shifts.ts` | Shift mock data |
| `src/components/billing/organisms/cashier-station/CashierDashboard.tsx` | Main cashier UI |
| `src/components/billing/organisms/cashier-station/TransactionHistory.tsx` | Transaction table |
| `src/components/billing/organisms/cashier-station/CashierShiftReport.tsx` | Shift report modal |
| `src/components/billing/organisms/billing-codes/PharmacyBillingCodeFlow.tsx` | Code generation |
| `src/components/billing/organisms/billing-codes/CodePaymentProcessor.tsx` | Code payment |
| `src/components/billing/organisms/billing-codes/index.ts` | Barrel export |
| `src/components/billing/organisms/service-pricing/ServicePricingTable.tsx` | Pricing table |
| `src/components/billing/organisms/service-pricing/AddServiceModal.tsx` | Add service |
| `src/components/billing/organisms/service-pricing/EditServiceModal.tsx` | Edit price |
| `src/components/billing/organisms/service-pricing/PriceApprovalQueue.tsx` | CMO approvals |
| `src/components/billing/organisms/service-pricing/index.ts` | Barrel export |
| `src/components/billing/organisms/emergency-override/EmergencyOverrideModal.tsx` | Override modal |
| `src/components/billing/templates/ReceiptPrintTemplate.tsx` | A5 receipt |

### New Pages (3)

| File | Purpose |
|------|---------|
| `src/pages/billing/CashierDashboardPage.tsx` | Cashier dashboard page |
| `src/pages/billing/ServicePricingPage.tsx` | Admin pricing page |
| `src/pages/billing/PriceApprovalPage.tsx` | CMO approval page |

### Modified Files (8)

| File | Changes |
|------|---------|
| `src/types/billing.types.ts` | Add new types |
| `src/data/bills.ts` | Ensure billing codes work |
| `src/data/patients.ts` | Add searchable test patients |
| `src/App.tsx` | Add new routes |
| `src/components/layout/AppSidebar.tsx` | Add nav items |
| `src/pages/pharmacy/PharmacyBillingPage.tsx` | Integrate code flow |
| `src/pages/lab/LabBillingPage.tsx` | Integrate code flow |
| `src/components/billing/organisms/index.ts` | Export new organisms |

---

## Part 11: Implementation Order

1. **Types & Data Layer**
   - Add new types to billing.types.ts
   - Create service-pricing.ts data
   - Create cashier-shifts.ts data

2. **Cashier Dashboard**
   - CashierDashboard component
   - TransactionHistory component
   - CashierShiftReport modal
   - Shift management hook

3. **Billing Code Enhancement**
   - PharmacyBillingCodeFlow component
   - CodePaymentProcessor component
   - Update pharmacy/lab pages

4. **Service Pricing**
   - ServicePricingTable component
   - AddServiceModal component
   - EditServiceModal component
   - ServicePricingPage

5. **Price Approval**
   - PriceApprovalQueue component
   - PriceApprovalPage
   - CMO sidebar link

6. **Emergency Override**
   - EmergencyOverrideModal component
   - Patient profile banner
   - Integration with queue

7. **Receipt Template**
   - ReceiptPrintTemplate for A5
   - Print CSS styles

8. **Routes & Navigation**
   - Add all new routes
   - Update sidebar navigation

---

## Part 12: Testing Scenarios

| Test | Expected |
|------|----------|
| Search "Aisha" in cashier | Finds Aisha Mohammed |
| Generate billing code | 8-char alphanumeric shown |
| Lookup code PH3K7M2Q | Finds pharmacy bill |
| Add new service as Admin | Creates pending approval |
| CMO approves price | Price updated, status approved |
| CMO rejects price | Original price kept, reason shown |
| Emergency override as Doctor | Patient added to queue, audit logged |
| Print receipt | A5 format opens in print dialog |
| End shift | Report shows variance calculation |

---

## Part 13: Integration Points

### Queue Integration

After payment collected:
- Update queue entry paymentStatus to 'cleared'
- Add paymentClearanceId and timestamp
- If station-specific, add to next queue (lab/pharmacy)

### Notification Integration

- Notify billing when emergency override used
- Notify admin when price approved/rejected
- Notify pharmacist when billing code is paid

---

## Technical Notes

- Use existing PaymentCollectionForm for payment flows
- Leverage QueueContext for queue updates
- Use existing receipt molecules (ReceiptHeader, ReceiptItemList, etc.)
- Currency formatting: ₦ with Intl.NumberFormat('en-NG')
- Billing codes: 8-char alphanumeric, uppercase, no ambiguous chars (0/O, 1/I/l)
- Code expiry: 3 days from generation
