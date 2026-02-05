
# Complete Billing Module: Dashboard + Full Sub-Pages

## Overview

This plan makes every button and interaction in the billing module fully functional by:
1. Wiring up the BillingDashboard with interactive handlers
2. Creating 3 full list pages (Bills, Claims, Payments/Transactions)
3. Fixing the Settings link in the sidebar
4. Adding revenue card navigation to transactions

---

## Part 1: Fix Sidebar Settings Link

### File: `src/components/layout/AppSidebar.tsx`

**Issue**: Line 200 links to `/settings` which doesn't exist

**Fix**: Change to role-based settings route or billing-specific settings

```text
Before: <Link to="/settings" ...>
After:  <Link to={`/${user.role.replace('_', '-')}/settings`} ...>
```

This creates dynamic settings routes per role.

---

## Part 2: Wire Up BillingDashboard

### File: `src/pages/dashboards/BillingDashboard.tsx`

Add full interactivity to all elements:

### State to Add
| State | Type | Purpose |
|-------|------|---------|
| `showPaymentModal` | boolean | Controls PaymentCollectionForm visibility |
| `selectedPatient` | Patient | Patient for payment collection |
| `selectedItems` | PaymentItem[] | Items being paid for |
| `selectedBill` | Bill | Bill being collected |

### Button Handlers

| Element | Handler | Action |
|---------|---------|--------|
| "Record Payment" (header) | `handleRecordPayment` | Open modal with mock data |
| "Submit Claim" (header) | `handleSubmitClaim` | Navigate to `/billing/claims?action=new` |
| "View All" (unpaid bills) | Navigate | Go to `/billing/bills?status=pending` |
| "Collect" (per bill row) | `handleCollectBill(bill)` | Open modal for that bill |
| Quick: Record Payment | Same as header | Open modal |
| Quick: Generate Receipt | `handleGenerateReceipt` | Toast "Select a paid bill first" |
| Quick: Submit Claim | Same as header | Navigate to claims |
| Quick: Daily Report | `handleDailyReport` | Toast "Coming Soon" |

### Revenue Cards (Clickable)

| Card | Navigation |
|------|------------|
| Cash Payments | `/billing/payments?method=cash` |
| Card Payments | `/billing/payments?method=card` |
| HMO Payments | `/billing/payments?method=hmo` |
| Total Today | `/billing/payments?date=today` |

### HMO Status Cards (Not Clickable)

As per your preference, these remain display-only statistics.

---

## Part 3: Bills List Page

### New File: `src/pages/billing/BillsListPage.tsx`

Professional table-based bill management following PatientListPage pattern.

### Features

| Feature | Description |
|---------|-------------|
| Search | Search by patient name, MRN, or bill number |
| Filters | Status: All, Pending, Partial, Paid |
| Date Filter | Today, This Week, This Month, Custom Range |
| Pagination | 10/25/50 per page with page size selector |
| Actions | View, Collect Payment, Print, Email |

### Table Columns

| Column | Content |
|--------|---------|
| Bill # | INV-2024-0001 (link to details) |
| Patient | Name + MRN |
| Date | Created date formatted |
| Items | Count of items (e.g., "3 items") |
| Total | Formatted amount |
| Paid | Amount paid |
| Balance | Outstanding amount (highlighted if > 0) |
| Status | Badge (Pending/Partial/Paid) |
| Actions | Collect / View / Print dropdown |

### Quick Stats Bar

| Stat | Value |
|------|-------|
| Total Pending | Sum of all pending balances |
| Bills Today | Count created today |
| Awaiting Payment | Count with status pending/partial |

### Components Used

- BillsTable (new component)
- PaymentCollectionForm (existing)
- Pagination molecules

---

## Part 4: Claims List Page

### New File: `src/pages/billing/ClaimsListPage.tsx`

HMO claims management with status workflow.

### Features

| Feature | Description |
|---------|-------------|
| Search | Search by patient, claim number, HMO provider |
| Status Tabs | All, Draft, Submitted, Processing, Approved, Denied, Paid |
| Provider Filter | Dropdown to filter by HMO provider |
| Batch Actions | Submit multiple claims at once |
| Date Filter | Submitted date range |

### Table Columns

| Column | Content |
|--------|---------|
| Claim # | CLM-2024-0001 |
| Patient | Name + MRN |
| HMO Provider | Provider name with logo/icon |
| Bill # | Link to original bill |
| Claim Amount | Amount being claimed |
| Approved | Amount approved (if applicable) |
| Status | Coloured badge (Draft/Submitted/etc.) |
| Submitted | Date submitted |
| Actions | Submit / View / Edit / Resubmit |

### Status Badge Colours

| Status | Colour |
|--------|--------|
| Draft | Gray |
| Submitted | Blue |
| Processing | Yellow |
| Approved | Green |
| Denied | Red |
| Paid | Purple |

### Claim Actions by Status

| Status | Available Actions |
|--------|-------------------|
| Draft | Edit, Submit, Delete |
| Submitted | View, Cancel |
| Processing | View |
| Approved | View, Mark as Paid |
| Denied | View, Resubmit, Appeal |
| Paid | View, Print |

### New Claim Flow

Button "New Claim" opens a modal/dialog:
1. Select patient (with pending bills)
2. Select bill to claim
3. Auto-fill HMO details from patient record
4. Attach documents
5. Submit

---

## Part 5: Payments/Transactions Page

### New File: `src/pages/billing/PaymentsListPage.tsx`

Transaction history and payment records.

### Features

| Feature | Description |
|---------|-------------|
| Search | Search by receipt number, patient, reference |
| Method Filter | All, Cash, POS, Transfer, HMO |
| Date Filter | Today, This Week, This Month, Custom |
| Export | Export to CSV |

### Table Columns

| Column | Content |
|--------|---------|
| Receipt # | RCP-2024-00123 (link to receipt) |
| Patient | Name + MRN |
| Date/Time | Payment timestamp |
| Amount | Total paid |
| Method | Payment method with icon |
| Reference | Transaction reference (if applicable) |
| Cashier | Staff who processed |
| Actions | View Receipt / Reprint / Email |

### Summary Stats (Top of Page)

| Stat | Value |
|------|-------|
| Today's Total | Sum of today's payments |
| Cash | Cash payments today |
| POS | Card payments today |
| Transfer | Bank transfers today |
| HMO | HMO payments today |

### View Receipt Action

Opens ThermalReceipt in a modal for preview/print.

---

## Part 6: Shared Components

### New File: `src/components/billing/organisms/tables/BillsTable.tsx`

Reusable table for bills with:
- Sortable columns
- Row actions
- Status badges
- Amount formatting

### New File: `src/components/billing/organisms/tables/ClaimsTable.tsx`

Reusable table for claims with:
- Status workflow badges
- Provider logos
- Document indicators

### New File: `src/components/billing/organisms/tables/PaymentsTable.tsx`

Reusable table for payments/transactions with:
- Method icons
- Receipt links
- Cashier info

---

## Part 7: New Data Helpers

### Update: `src/data/bills.ts`

Add pagination and filtering functions:

```text
getBillsPaginated(page, limit, filters)
getBillById(id)
updateBillStatus(id, status)
```

### Update: `src/data/claims.ts`

Add pagination and filtering:

```text
getClaimsPaginated(page, limit, filters)
getClaimById(id)
submitClaim(id)
updateClaimStatus(id, status)
```

### New File: `src/data/payments.ts`

Payment/transaction records:

```text
mockPayments: PaymentRecord[]
getPaymentsPaginated(page, limit, filters)
getPaymentById(id)
getPaymentsByDateRange(start, end)
getDailyRevenue(date)
```

---

## Part 8: Route Updates

### File: `src/App.tsx`

Add specific routes for billing sub-pages:

```text
{/* Billing Routes */}
<Route path="/billing" element={<BillingDashboard />} />
<Route path="/billing/bills" element={<BillsListPage />} />
<Route path="/billing/claims" element={<ClaimsListPage />} />
<Route path="/billing/payments" element={<PaymentsListPage />} />
<Route path="/billing/settings" element={<BillingSettings />} />
<Route path="/billing/*" element={<BillingDashboard />} />
```

---

## Part 9: File Structure Summary

### New Files (10)

| File | Purpose |
|------|---------|
| `src/pages/billing/BillsListPage.tsx` | Bills list with search, filters, actions |
| `src/pages/billing/ClaimsListPage.tsx` | HMO claims management |
| `src/pages/billing/PaymentsListPage.tsx` | Transaction history |
| `src/pages/billing/BillingSettings.tsx` | Billing-specific settings (placeholder) |
| `src/components/billing/organisms/tables/BillsTable.tsx` | Bills table component |
| `src/components/billing/organisms/tables/ClaimsTable.tsx` | Claims table component |
| `src/components/billing/organisms/tables/PaymentsTable.tsx` | Payments table component |
| `src/components/billing/organisms/tables/index.ts` | Barrel export |
| `src/data/payments.ts` | Payment/transaction mock data |
| `src/components/billing/organisms/claim-submission/ClaimSubmissionModal.tsx` | New claim modal |

### Modified Files (5)

| File | Changes |
|------|---------|
| `src/App.tsx` | Add billing sub-routes |
| `src/components/layout/AppSidebar.tsx` | Fix Settings link |
| `src/pages/dashboards/BillingDashboard.tsx` | Add all button handlers and PaymentCollectionForm |
| `src/data/bills.ts` | Add pagination helpers |
| `src/data/claims.ts` | Add pagination helpers |

---

## Part 10: Implementation Order

1. **Data Layer**: Add `payments.ts`, update `bills.ts` and `claims.ts` with pagination
2. **Fix Sidebar**: Update Settings link in AppSidebar
3. **Wire Dashboard**: Add all handlers to BillingDashboard
4. **Table Components**: Create BillsTable, ClaimsTable, PaymentsTable
5. **Bills Page**: Create BillsListPage with full functionality
6. **Claims Page**: Create ClaimsListPage with status workflow
7. **Payments Page**: Create PaymentsListPage with filters
8. **Settings Page**: Create placeholder BillingSettings
9. **Routes**: Update App.tsx with new routes
10. **Integration**: Test all navigation and actions

---

## Part 11: Interaction Summary

After implementation, every element will be functional:

### Dashboard Buttons
| Button | Action |
|--------|--------|
| Record Payment | Opens PaymentCollectionForm modal |
| Submit Claim | Navigates to Claims page with new claim dialog |
| View All (bills) | Navigates to Bills page filtered to pending |
| Collect (per bill) | Opens PaymentCollectionForm for that bill |
| All Quick Actions | Functional navigation or modal |

### Revenue Cards
| Card | Action |
|------|--------|
| Cash/Card/HMO/Total | Navigate to Payments page with filter |

### Sidebar Links
| Link | Action |
|------|--------|
| Dashboard | `/billing` |
| Bills | `/billing/bills` |
| HMO Claims | `/billing/claims` |
| Payments | `/billing/payments` |
| Settings | `/billing/settings` |

### Sub-Page Actions
| Page | Actions |
|------|---------|
| Bills | Search, Filter, Collect, View, Print |
| Claims | Search, Filter, Submit, Edit, Resubmit, View |
| Payments | Search, Filter, View Receipt, Reprint, Export |

---

## Part 12: UX Design Principles Applied

Following the project's established patterns:

| Principle | Implementation |
|-----------|----------------|
| Minimal Clicks | Modal-based workflows, inline actions |
| Professional Tables | Consistent with PatientTable, AppointmentTable |
| Contextual Actions | Dropdown menus for row actions |
| Visual Feedback | Toast notifications for all actions |
| Mobile Responsive | Grid adapts, tables scroll horizontally |
| Consistent Styling | Uses shadcn/ui components throughout |
| Status Indicators | Coloured badges matching design system |
