
# Pagination Enhancement Plan

## Overview

Enhance the existing pagination system to include a **page size selector** alongside page navigation, then refactor all pages with lists to use the unified pagination component. This ensures consistent user experience across the entire application.

---

## Current State

### What Exists
- `QueuePagination` molecule: Has page navigation but **no page size selector**
- `usePagination` hook: Already supports `setItemsPerPage` functionality
- `PAGINATION` constant: Has `defaultPageSize: 20` and `pageSizeOptions: [10, 20, 50, 100]`

### Pages with Lists (Need Pagination)
| Page | Current State |
|------|---------------|
| `DoctorQueuePage` | Uses `QueueTable` with pagination |
| `CheckInQueuePage` | Uses `AppointmentTable` with custom pagination |
| `TriageQueuePage` | Uses `QueueBoard` - no pagination |
| `AppointmentListPage` | Uses `AppointmentTable` with custom pagination |
| `PatientListPage` | Uses `PatientTable` with pagination |
| `NurseDashboard` | Shows only 5 items (dashboard preview) |
| `BillingDashboard` | Shows only 4 items (dashboard preview) |
| `ReceptionistDashboard` | Shows only 5 items (dashboard preview) |
| Other Dashboards | Show limited items (dashboard previews) |

---

## Part 1: Update Design System Constants

**File**: `src/constants/designSystem.ts`

Update pagination options to match user preference:

| Setting | Value |
|---------|-------|
| Default Page Size | 25 |
| Page Size Options | [10, 25, 50] |

---

## Part 2: Create PageSizeSelector Atom

**New File**: `src/components/atoms/input/PageSizeSelector.tsx`

A dropdown component for selecting items per page:

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number` | Current page size |
| `options` | `number[]` | Available options (default from designSystem) |
| `onChange` | `(size: number) => void` | Callback when changed |
| `className` | `string` | Optional styling |

Display format: "Show [10 ▼] per page"

---

## Part 3: Enhance QueuePagination Molecule

**File**: `src/components/molecules/queue/QueuePagination.tsx`

Add page size selector integration:

| New Prop | Type | Description |
|----------|------|-------------|
| `showPageSizeSelector` | `boolean` | Show/hide page size dropdown (default: true) |
| `onPageSizeChange` | `(size: number) => void` | Callback when page size changes |
| `pageSizeOptions` | `number[]` | Available page size options |

Updated layout:
```
┌─────────────────────────────────────────────────────────────────┐
│ Show [25 ▼] per page    Showing 1-25 of 156    [< 1 2 3 ... >] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 4: Update usePagination Hook

**File**: `src/hooks/usePagination.ts`

Minor enhancement to use updated default from designSystem:
- Update default page size to 25 (from PAGINATION constant)
- Ensure `setItemsPerPage` resets to page 1

---

## Part 5: Refactor Pages to Use Enhanced Pagination

### 5.1 Queue Pages

**DoctorQueuePage** (`src/pages/queue/DoctorQueuePage.tsx`)
- Already uses `QueueTable` with pagination
- Update to use enhanced `QueuePagination` with page size selector
- Wire `onPageSizeChange` handler

**TriageQueuePage** (`src/pages/queue/TriageQueuePage.tsx`)
- Currently uses `QueueBoard` without pagination
- Add pagination for waiting patients list
- Use `usePagination` hook

**CheckInQueuePage** (`src/pages/queue/CheckInQueuePage.tsx`)
- Already passes pagination props to `AppointmentTable`
- Update to use enhanced pagination with page size selector

### 5.2 Patient Pages

**PatientListPage** (`src/pages/patients/PatientListPage.tsx`)
- Already has pagination via `PatientTable`
- Update to use enhanced `QueuePagination` component
- Add page size selector

### 5.3 Appointment Pages

**AppointmentListPage** (`src/pages/appointments/AppointmentListPage.tsx`)
- Currently uses `AppointmentTable` with custom inline pagination
- Update to use `QueuePagination` molecule

### 5.4 Component Updates

**AppointmentTable** (`src/components/appointments/AppointmentTable.tsx`)
- Replace custom inline pagination with `QueuePagination` molecule
- Add page size selector support

**QueueTable** (`src/components/queue/QueueTable.tsx`)
- Already uses `QueuePagination`
- Verify page size selector is wired correctly

**PatientTable** (`src/components/patients/PatientTable.tsx`)
- Update to use `QueuePagination` molecule if not already
- Add page size selector support

---

## Part 6: Dashboard Pages (No Changes Needed)

Dashboard pages show **preview lists** (limited to 5 items) with "View All" buttons. These intentionally don't need full pagination - they direct users to dedicated list pages.

| Dashboard | Approach |
|-----------|----------|
| NurseDashboard | Shows 5 items, "View All" goes to TriageQueuePage |
| ReceptionistDashboard | Shows 5 items, "View All" goes to CheckInQueuePage |
| BillingDashboard | Shows 4 items, "View All" planned for future billing list |
| DoctorDashboard | Shows limited items, "View All" available |

---

## Part 7: File Changes Summary

### New Files (1)

| File | Purpose |
|------|---------|
| `src/components/atoms/input/PageSizeSelector.tsx` | Dropdown for page size selection |

### Modified Files (9)

| File | Changes |
|------|---------|
| `src/constants/designSystem.ts` | Update default page size to 25, options to [10, 25, 50] |
| `src/components/molecules/queue/QueuePagination.tsx` | Add page size selector integration |
| `src/components/atoms/input/index.ts` | Export PageSizeSelector |
| `src/pages/queue/DoctorQueuePage.tsx` | Wire page size selector |
| `src/pages/queue/TriageQueuePage.tsx` | Add pagination to queue list |
| `src/pages/queue/CheckInQueuePage.tsx` | Wire page size selector |
| `src/pages/patients/PatientListPage.tsx` | Wire page size selector |
| `src/pages/appointments/AppointmentListPage.tsx` | Wire page size selector |
| `src/components/appointments/AppointmentTable.tsx` | Replace custom pagination with QueuePagination |

---

## Part 8: Implementation Order

1. Update `designSystem.ts` with new pagination defaults
2. Create `PageSizeSelector` atom
3. Enhance `QueuePagination` molecule with page size selector
4. Update `AppointmentTable` to use `QueuePagination`
5. Refactor `DoctorQueuePage` with page size selector
6. Refactor `CheckInQueuePage` with page size selector
7. Refactor `TriageQueuePage` to add pagination
8. Refactor `PatientListPage` with page size selector
9. Refactor `AppointmentListPage` with page size selector

---

## Success Criteria

After implementation:

1. All list pages have consistent pagination controls
2. Users can select page size (10, 25, or 50 items)
3. Default page size is 25 across all lists
4. Changing page size resets to page 1
5. "Showing X-Y of Z" indicator displays correctly
6. Mobile-responsive pagination (condensed on small screens)
7. Dashboard preview lists remain unchanged (5 items with "View All")
