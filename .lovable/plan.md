
# Billing Integration & Department Separation Plan

## Overview

This plan addresses three key requirements:
1. **Integrate claim creation into BillDetailsDrawer** - Already partially implemented, needs wiring
2. **Add billing visibility to CMO and Hospital Admin dashboards** - Extend dashboard with billing sections
3. **Department-based billing separation** - Logical separation so pharmacy bills don't show at front desk/lab and vice versa

---

## Part 1: Department-Based Billing Separation

### Core Concept

Bills will have a `department` field that indicates where the bill originated:
- **front_desk** - Reception/Check-in (Consultation fees, registration)
- **lab** - Laboratory (Lab tests, imaging)
- **pharmacy** - Pharmacy (Medications, consumables)
- **nursing** - Nursing station (Procedures, vitals)
- **inpatient** - Ward/Admission (Bed charges, admission fees)

### Data Model Updates

**Update: `src/types/billing.types.ts`**

| New Field | Type | Description |
|-----------|------|-------------|
| `department` | BillingDepartment | Origin department for the bill |
| `createdByRole` | UserRole | Role of user who created the bill |

```text
export type BillingDepartment = 
  | 'front_desk' 
  | 'lab' 
  | 'pharmacy' 
  | 'nursing' 
  | 'inpatient'
  | 'all';  // For aggregated views (CMO/Admin)

interface Bill {
  // ... existing fields ...
  department: BillingDepartment;
  createdByRole: UserRole;
}
```

### Department Mapping

| User Role | Default Department | Can View |
|-----------|-------------------|----------|
| Receptionist | front_desk | front_desk only |
| Lab Tech | lab | lab only |
| Pharmacist | pharmacy | pharmacy only |
| Nurse | nursing | nursing only |
| Doctor | all (creates via orders) | all related to their orders |
| Billing Officer | all | all (primary billing role) |
| Hospital Admin | all | all (read-only financial view) |
| CMO | all | all (executive oversight) |

### Data Layer Updates

**Update: `src/data/bills.ts`**

Add department field to existing bills and create filtering functions:

```text
// Add to each mock bill:
department: 'front_desk' | 'lab' | 'pharmacy' | ...

// New functions:
getBillsByDepartment(department: BillingDepartment): Bill[]
getBillsPaginatedByDepartment(
  page: number, 
  limit: number, 
  department: BillingDepartment,
  filters?: BillFilters
): { data: Bill[]; total: number; totalPages: number }
```

**New: `src/utils/billingDepartment.ts`**

Utility functions for department logic:

```text
getDepartmentForRole(role: UserRole): BillingDepartment | 'all'
getDepartmentLabel(department: BillingDepartment): string
canViewDepartment(userRole: UserRole, department: BillingDepartment): boolean
getCategoryToDepartment(category: ServiceCategory): BillingDepartment
```

---

## Part 2: Update BillDetailsDrawer with Claim Creation

The drawer already has an `onCreateClaim` prop. Need to ensure:
1. The button is visible for HMO patients with balance
2. The callback is properly wired in all contexts

### Current State (Already Working)

- `BillDetailsDrawer.tsx` has `canCreateClaim` logic
- `BillsListPage.tsx` wires up `handleCreateClaimFromBill`

### Required Fixes

**Verify in `BillDetailsDrawer.tsx`:**
- Button shows when: `bill.paymentMethod === 'hmo' && bill.balance > 0 && !bill.hmoClaimId`
- Already implemented correctly

**Ensure all usages pass the callback:**
- CMO Dashboard (new)
- Hospital Admin Dashboard (new)
- Billing Dashboard - need to add drawer

---

## Part 3: CMO Dashboard Billing Section

### Update: `src/pages/dashboards/CMODashboard.tsx`

Add a new billing section with:

**Quick Stats Card Row:**
| Stat | Value | Action |
|------|-------|--------|
| Today's Revenue | ₦1.2M | Click → Payments list |
| Pending Bills | 23 | Click → Bills list (pending) |
| Pending Claims | 15 | Click → Claims list (pending) |
| Outstanding | ₦450K | Non-clickable |

**Recent Bills Card:**
- Shows last 5 bills across all departments
- Each row: Patient, Amount, Status, Department badge, "View" button
- "View All" link → `/cmo/billing/bills`

**HMO Claims Summary Card:**
- Draft: X
- Submitted: Y
- Approved: Z
- Denied: W
- "Manage Claims" button → `/cmo/billing/claims`

### Add CMO Billing Routes

**Update: `src/App.tsx`**

```text
<Route path="/cmo/billing" element={<BillingDashboard />} />
<Route path="/cmo/billing/bills" element={<BillsListPage />} />
<Route path="/cmo/billing/claims" element={<ClaimsListPage />} />
<Route path="/cmo/billing/payments" element={<PaymentsListPage />} />
```

---

## Part 4: Hospital Admin Dashboard Billing Section

### Update: `src/pages/dashboards/HospitalAdminDashboard.tsx`

Add billing section similar to CMO but with operational focus:

**Revenue Cards Row:**
| Card | Value | Click Action |
|------|-------|--------------|
| Cash Collected | ₦850K | → Payments (cash filter) |
| Card/POS | ₦127K | → Payments (card filter) |
| HMO Pending | ₦245K | → Claims list |
| Total Today | ₦1.2M | → Payments (today) |

**Pending Bills Card:**
- List of unpaid bills
- Each with "Collect" button → Opens PaymentCollectionForm
- "View All" link → `/hospital-admin/billing/bills`

**Claims Overview Card:**
- Already exists, just add click actions
- Draft claims → `/hospital-admin/billing/claims?status=draft`
- Submitted → `/hospital-admin/billing/claims?status=submitted`

### Add Hospital Admin Billing Routes

**Update: `src/App.tsx`**

```text
<Route path="/hospital-admin/billing" element={<BillingDashboard />} />
<Route path="/hospital-admin/billing/bills" element={<BillsListPage />} />
<Route path="/hospital-admin/billing/claims" element={<ClaimsListPage />} />
<Route path="/hospital-admin/billing/payments" element={<PaymentsListPage />} />
```

---

## Part 5: Department-Filtered Views for Other Roles

### Pharmacist Billing View

**New: `src/pages/pharmacy/PharmacyBillingPage.tsx`**

Shows only pharmacy department bills:
- Auto-filtered to `department: 'pharmacy'`
- Can create bills for dispensed medications
- Generate billing codes for pending payments

### Lab Tech Billing View

**New: `src/pages/lab/LabBillingPage.tsx`**

Shows only lab department bills:
- Auto-filtered to `department: 'lab'`
- Generate billing codes for ordered tests
- Track which tests are paid/unpaid

### Reception Billing View

**Update existing receptionist routes:**

When receptionist views bills, auto-filter to `department: 'front_desk'`:
- Only sees consultation fees, registration, procedures done at front desk

---

## Part 6: BillCreationForm Department Integration

### Update: `src/components/billing/organisms/bill-creation/BillCreationForm.tsx`

Add department awareness:

| When Created By | Department Set To | Items Available |
|-----------------|-------------------|-----------------|
| Receptionist | front_desk | Consultation, Procedures, Other |
| Pharmacist | pharmacy | Pharmacy items only |
| Lab Tech | lab | Lab items only |
| Nurse | nursing | Procedures, Vitals |
| Billing Officer | Selected | All (can choose department) |
| Doctor | Based on items | Auto-detect from item categories |
| CMO/Admin | Selected | All (can choose department) |

### Props Update

```text
interface BillCreationFormProps {
  // ... existing props ...
  defaultDepartment?: BillingDepartment;
  restrictDepartment?: boolean; // If true, department cannot be changed
}
```

---

## Part 7: Sidebar Navigation Updates

### Update: `src/components/layout/AppSidebar.tsx`

**Pharmacist Navigation:**
Add billing link:
```text
{ title: 'Billing', href: '/pharmacist/billing', icon: Receipt }
```

**Lab Tech Navigation:**
Add billing link:
```text
{ title: 'Billing', href: '/lab-tech/billing', icon: Receipt }
```

**CMO Navigation:**
Already has billing, ensure routes work

**Hospital Admin Navigation:**
Already has billing, ensure routes work

---

## Part 8: Quick Actions Wiring

### BillingDashboard Quick Actions

Ensure all buttons trigger appropriate flows:

| Button | Current State | Action Needed |
|--------|---------------|---------------|
| Record Payment | Opens mock data | Wire to select patient/bill |
| Generate Receipt | Toast only | Wire to open receipt generator |
| Submit Claim | Navigates | ✅ Working |
| Daily Report | Toast only | Generate summary report |
| Create Bill | Missing | Add button, open BillCreationForm |

### PatientProfile Billing Tab

Ensure these actions work:
- "Create Bill" → Opens BillCreationForm with patient pre-filled
- Bill list items → Click opens BillDetailsDrawer
- From drawer → "Create Claim" opens ClaimCreationModal

---

## Part 9: File Structure Summary

### New Files (5)

| File | Purpose |
|------|---------|
| `src/utils/billingDepartment.ts` | Department utility functions |
| `src/pages/pharmacy/PharmacyBillingPage.tsx` | Pharmacy-filtered billing |
| `src/pages/lab/LabBillingPage.tsx` | Lab-filtered billing |
| `src/components/billing/BillingOverviewCard.tsx` | Reusable billing stats card |
| `src/components/billing/DepartmentBillsList.tsx` | Department-filtered bills list |

### Modified Files (10)

| File | Changes |
|------|---------|
| `src/types/billing.types.ts` | Add BillingDepartment, department field |
| `src/data/bills.ts` | Add department to bills, filtering functions |
| `src/pages/dashboards/CMODashboard.tsx` | Add billing section with quick actions |
| `src/pages/dashboards/HospitalAdminDashboard.tsx` | Add billing section with payment collection |
| `src/pages/dashboards/PharmacistDashboard.tsx` | Add billing link/section |
| `src/pages/dashboards/LabTechDashboard.tsx` | Add billing link/section |
| `src/components/layout/AppSidebar.tsx` | Add billing nav items for pharmacy/lab |
| `src/components/billing/organisms/bill-creation/BillCreationForm.tsx` | Department awareness |
| `src/App.tsx` | Add new billing routes for all roles |
| `src/pages/billing/BillsListPage.tsx` | Department filter support |

---

## Part 10: Implementation Order

1. **Data Model First**
   - Update billing types with department
   - Add department to existing mock bills
   - Create utility functions

2. **Bill Filtering**
   - Implement department filtering in bills.ts
   - Update BillsListPage with department filter

3. **CMO Dashboard**
   - Add billing section
   - Wire up all quick actions
   - Add routes

4. **Hospital Admin Dashboard**
   - Add billing section with payment collection
   - Wire up "Collect" buttons
   - Add routes

5. **Department-Specific Views**
   - Create PharmacyBillingPage
   - Create LabBillingPage
   - Update sidebar navigation

6. **Bill Creation Enhancement**
   - Add department awareness to BillCreationForm
   - Auto-detect department from user role

7. **Integration Testing**
   - Test flow from each role
   - Verify department isolation
   - Test claim creation from drawers

---

## Part 11: Access Control Summary

| Role | Can Create Bills | Can View | Can Collect | Can Submit Claims |
|------|-----------------|----------|-------------|-------------------|
| CMO | ✅ All | ✅ All | ✅ | ✅ |
| Hospital Admin | ✅ All | ✅ All | ✅ | ✅ |
| Billing Officer | ✅ All | ✅ All | ✅ | ✅ |
| Pharmacist | ✅ Pharmacy | Pharmacy | ❌ (generates code) | ❌ |
| Lab Tech | ✅ Lab | Lab | ❌ (generates code) | ❌ |
| Receptionist | ✅ Front Desk | Front Desk | ✅ (basic) | ❌ |
| Nurse | ✅ Nursing | Nursing | ❌ | ❌ |
| Doctor | Via orders | Related | ❌ | ❌ |
| Patient | ❌ | Own bills | ❌ | ❌ |

---

## Part 12: Billing Code Generation for Non-Billing Roles

Pharmacy and Lab staff cannot collect payments directly. Instead:

1. They **generate a billing code** (e.g., `PH3K7M2Q`)
2. Patient takes code to billing desk
3. Billing officer scans/enters code
4. Payment collected, service unlocked

This maintains the "pay-before-service" policy while keeping department separation.

### Components Needed

- `BillingCodeGenerator` - Generates 8-char alphanumeric code
- `BillingCodeScanner` - For billing desk to lookup by code
- `BillingCodeStatus` - Shows if code is paid/pending
