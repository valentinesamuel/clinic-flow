

# Hospital Management System (HMS) — App Shell & Multi-Role Navigation

## Project Overview
A modular, offline-first Hospital Management System designed for small-to-medium private clinics in Nigeria and Sub-Saharan Africa. This initial phase establishes the foundational app shell, authentication system, and role-based navigation.

---

## Phase 1: App Shell Foundation

### 1.1 Design System Implementation
- **Color Tokens**: Primary Blue (#1F4E78), Secondary Blue (#2E5C8A), Success Green (#28A745), Warning Yellow (#FFC107), Error Red (#DC3545), Offline Orange (#FF6B35), Neutral Gray palette
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif) with 16px body minimum
- **Spacing & Touch Targets**: 44x44px minimum for all interactive elements
- **No emojis or playful elements** — professional, trustworthy healthcare aesthetic using Lucide React icons throughout

### 1.2 Global Sync/Offline Status Indicator
- **Fixed position**: Top-right corner, always visible (40x40px)
- **Four states with icons**:
  - ✓ **Online** (Cloud check icon) — Green: "All changes saved"
  - ↻ **Syncing** (Cloud with arrows, animated pulse) — Blue: "Saving..."
  - ⊘ **Offline** (Cloud with slash) — Orange: "Working offline (X pending)"
  - ✕ **Error** (Cloud with X) — Red: "Cannot sync - check internet"
- Clicking opens a details panel showing last sync time and pending changes count

---

## Phase 2: Authentication & Role-Based Routing

### 2.1 Shared Login Page
- Clean, professional login form (email/phone + password)
- Clinic branding area (logo placeholder, clinic name)
- "Forgot Password" and "Contact Admin" links
- Mobile-optimized: single column, large input fields (48px height)
- System detects user role from credentials and redirects accordingly

### 2.2 Role-Based Dashboard Routes
| Role | Route | Primary Purpose |
|------|-------|-----------------|
| Admin/Medical Director | `/admin` | Clinic-wide oversight, revenue, staff |
| Doctor | `/doctor` | Patient queue, consultations, prescriptions |
| Nurse | `/nurse` | Triage, vitals, patient queue |
| Front Desk/Billing | `/billing` | Payments, HMO claims, receipts |
| Patient | `/patient` | Appointments, results, bills |

---

## Phase 3: Navigation System

### 3.1 Desktop Navigation (≥768px)
- **Persistent sidebar**: 240px width, collapsible to 60px (icons only)
- **Grouped by workflow**: Clinical, Administrative, Patient Portal
- **Active state**: Bold text + left border accent in Primary Blue
- **Badge counts**: For pending actions (e.g., "5 unpaid bills", "3 lab results")
- **Search box**: Natural language search at top
- **User profile section**: Role indicator, quick logout

### 3.2 Mobile Navigation (<768px)
- **Bottom tab bar**: Fixed position, 5 primary tabs
- **Icon size**: 28x28px with 12px labels below
- **Tabs vary by role**:
  - **Admin**: Dashboard, Patients, Staff, Reports, More
  - **Doctor**: Dashboard, Queue, Patients, Rx, More
  - **Nurse**: Dashboard, Triage, Queue, Vitals, More
  - **Billing**: Dashboard, Bills, Claims, Payments, More
  - **Patient**: Home, Appointments, Results, Bills, More

---

## Phase 4: Role-Specific Dashboards

### 4.1 Admin Dashboard
- **Revenue Summary Card**: Today/Week/Month figures with trend indicators
- **Staff Overview**: On-duty count, absent today, shifts ending soon
- **Patient Stats**: Today's visits, wait time average, queue length
- **Alerts Panel**: Low inventory items, overdue claims, pending approvals
- **Quick Actions**: Add Patient, View Reports, Staff Schedule
- **Data-driven KPIs**: No decorative elements, every component serves a purpose

### 4.2 Doctor Dashboard
- **Today's Appointments**: Patient list with name, time, reason (card format)
- **Pending Lab Results**: Count badge with quick-view capability
- **Prescription Renewals**: Flagged patients needing attention
- **Quick Actions**: Start Consultation, Order Lab Test, Write Prescription
- **Clinical Alerts**: Drug interactions, allergy warnings (when CDSS implemented)

### 4.3 Nurse Dashboard
- **Patient Queue**: Real-time list with wait times
- **Triage Summary**: Patients processed today, urgent cases flagged
- **Pending Vitals**: Patients needing vital signs recorded
- **Shift Information**: Current shift, next break, handover notes

### 4.4 Front Desk/Billing Dashboard
- **Unpaid Bills**: Sortable table with patient, amount, days overdue
- **HMO Claims Status**: Visual breakdown (Pending/Approved/Rejected/Paid)
- **Daily Revenue**: Cash vs Card vs HMO breakdown
- **Quick Actions**: Record Payment, Generate Receipt, Submit Claim

### 4.5 Patient Portal (Mobile-First)
- **Single-column layout**: Optimized for 320px-576px screens
- **Upcoming Appointments**: Next visit card with date, doctor, location
- **Recent Lab Results**: Available results with download option
- **Current Prescriptions**: Active medications with refill status
- **Outstanding Bills**: Amount due with payment options
- **Bottom navigation**: Home, Appointments, Results, Bills, Profile
- **Language selector**: Accessible from profile (English default)

---

## Phase 5: Placeholder Routes for Hybrid Modules

### 5.1 Lab Integration Module (Hybrid)
- `/lab` route with "Coming Soon" placeholder
- Explains integration with external partner labs
- Shows planned features: digital requisitions, result tracking, auto-import

### 5.2 Pharmacy Module (Hybrid)
- `/pharmacy` route with "Coming Soon" placeholder
- Explains hybrid model (in-house + external pharmacy partners)
- Shows planned features: stock tracking, prescription verification, reorder alerts

---

## Technical Approach

### Responsive Breakpoints
| Device | Width | Layout |
|--------|-------|--------|
| Mobile Portrait | <576px | Single column, bottom nav |
| Mobile Landscape | 576-767px | 2 columns, bottom nav |
| Tablet | 768-991px | Sidebar + 2-3 column grid |
| Desktop | 992-1199px | Sidebar + 3-4 column dashboard |
| Large Desktop | ≥1200px | Sidebar + max-width 1400px |

### Performance Budget
- Initial page load: <2s on 3G connection
- Bundle size: <150KB gzipped JS
- Touch-optimized: All buttons 44x44px minimum
- System fonts: Zero download time for typography

### Offline-Ready Foundation
- Service worker registration (placeholder for future sync logic)
- UI gracefully handles offline state via status indicator
- All forms designed for auto-save pattern (future implementation)

---

## Deliverables

1. **Design system CSS variables** with full color palette and typography
2. **Global sync status indicator component** with 4 visual states
3. **Shared login page** with role-based redirect logic
4. **5 dashboard layouts** (Admin, Doctor, Nurse, Billing, Patient)
5. **Responsive navigation** (desktop sidebar + mobile bottom tabs)
6. **Placeholder routes** for Lab (/lab) and Pharmacy (/pharmacy)
7. **Demo mode** with mock role selection for testing all views

This foundation establishes a professional, mature healthcare UI that respects African infrastructure constraints while providing a clean, efficient interface for all user roles.

