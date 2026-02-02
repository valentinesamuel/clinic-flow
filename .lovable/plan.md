

# Full Navigation & Role Expansion Plan

## Summary

This plan expands the current 5-role system to a comprehensive 10-role architecture with the CMO-controlled permission system, full routing skeleton, and mock data infrastructure.

---

## Role Architecture

### Complete Role Hierarchy

| Role | Route Prefix | Primary Focus | Reports To |
|------|--------------|---------------|------------|
| **CMO** | `/cmo` | Executive oversight, toggle permissions | Owner |
| **Hospital Administrator** | `/hospital-admin` | Operations, finance, logistics | CMO |
| **Clinical Lead** | `/clinical-lead` | Medical quality, staff performance | CMO |
| **Doctor** | `/doctor` | Consultations, prescriptions | Clinical Lead |
| **Nurse** | `/nurse` | Triage, vitals, patient care | Clinical Lead |
| **Receptionist** | `/receptionist` | Registration, scheduling, queue | Hospital Admin |
| **Billing Officer** | `/billing` | Payments, invoices, claims | Hospital Admin |
| **Pharmacist** | `/pharmacist` | Dispensing, stock (hybrid module) | Clinical Lead |
| **Lab Technician** | `/lab` | Sample processing (hybrid module) | Clinical Lead |
| **Patient** | `/patient` | Portal access | N/A |

### Permission Toggle System

The CMO can enable/disable cross-domain access for the two admin roles:

```text
Hospital Administrator:
  Default: Finance, Inventory, Non-clinical Staff, Billing/Invoices
  Toggle ON: "Clinical Access" → Can view patient records (read-only)

Clinical Lead:
  Default: Clinical Records, EMRs, Medical Staff, Patient Safety
  Toggle ON: "Financial Transparency" → Can view revenue/profit reports
```

---

## File Structure

### New Directories

```text
src/
├── data/                          # Mock data files (one per "table")
│   ├── users.ts
│   ├── patients.ts
│   ├── appointments.ts
│   ├── staff.ts
│   ├── inventory.ts
│   ├── bills.ts
│   ├── claims.ts
│   ├── lab-orders.ts
│   ├── prescriptions.ts
│   └── vitals.ts
├── types/                         # TypeScript interfaces
│   ├── user.types.ts
│   ├── patient.types.ts
│   ├── clinical.types.ts
│   └── billing.types.ts
├── contexts/
│   ├── AuthContext.tsx           # Expanded with 10 roles
│   └── PermissionContext.tsx     # NEW: CMO toggle system
├── hooks/
│   └── usePermissions.ts         # Permission checking hook
├── pages/
│   ├── dashboards/
│   │   ├── CMODashboard.tsx
│   │   ├── HospitalAdminDashboard.tsx
│   │   ├── ClinicalLeadDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── NurseDashboard.tsx
│   │   ├── ReceptionistDashboard.tsx
│   │   ├── BillingDashboard.tsx
│   │   ├── PharmacistDashboard.tsx
│   │   ├── LabTechDashboard.tsx
│   │   └── PatientDashboard.tsx
│   └── settings/
│       └── PermissionSettings.tsx  # CMO-only toggle management
```

---

## Implementation Steps

### Phase 1: Type System & Mock Data

**1.1 Create Type Definitions**

Define interfaces for all entities:
- `UserRole` enum with 10 roles
- `User` interface with role and permissions
- `Patient`, `Appointment`, `Bill`, `LabOrder`, etc.

**1.2 Create Mock Data Files**

Each file exports typed arrays simulating database tables:
- `users.ts` - 10 mock users (one per role)
- `patients.ts` - 15-20 sample patients with Nigerian names
- `appointments.ts` - Today's appointments linked to patients/doctors
- `staff.ts` - Staff records with shift information
- `inventory.ts` - Stock items (medicines, diesel, oxygen, stationery)
- `bills.ts` - Invoices with payment status
- `claims.ts` - HMO claim records
- `lab-orders.ts` - Lab test orders and results
- `prescriptions.ts` - Prescription records

### Phase 2: Permission System

**2.1 Create PermissionContext**

```typescript
interface PermissionToggles {
  hospitalAdminClinicalAccess: boolean;
  clinicalLeadFinancialAccess: boolean;
}

interface PermissionContextType {
  toggles: PermissionToggles;
  setToggle: (key: keyof PermissionToggles, value: boolean) => void;
  canAccess: (resource: ResourceType, action: ActionType) => boolean;
}
```

**2.2 Create usePermissions Hook**

A hook that combines role + toggles to determine access:

```typescript
function usePermissions() {
  const { user } = useAuth();
  const { toggles } = usePermissionContext();
  
  const canViewClinicalData = () => {
    if (['cmo', 'clinical_lead', 'doctor', 'nurse'].includes(user.role)) return true;
    if (user.role === 'hospital_admin' && toggles.hospitalAdminClinicalAccess) return true;
    return false;
  };
  
  const canViewFinancialData = () => {
    if (['cmo', 'hospital_admin', 'billing'].includes(user.role)) return true;
    if (user.role === 'clinical_lead' && toggles.clinicalLeadFinancialAccess) return true;
    return false;
  };
  
  return { canViewClinicalData, canViewFinancialData };
}
```

Phase 2.5: Shared Component System
----------------------------------

Create reusable component library:

**Forms**

*   Multi-step wizard component (for HMO claims, appointments, registration)    
*   Auto-save forms (save to localStorage every 30s, show "Saved" indicator)
*   Validation: React Hook Form + Zod, inline error messages
*   Patient search autocomplete (debounced, minimum 2 chars)
*   Drug search autocomplete (with interaction warnings)
*   Nigerian phone input with +234 format validation
*   Date/time pickers (disable past dates for appointments)
*   File upload with drag-drop (max 5MB, PDF/JPG/PNG)
    

**Data Display**

*   Paginated tables (default 20 items, max 100)
*   Empty states with CTAs
*   Loading skeletons matching content shape
*   Badge variants: status (scheduled/completed), priority (normal/urgent/emergency), alert levels


**Navigation**

*   Breadcrumbs for nested screens    
*   Tab groups for multi-section views
*   Modal system (confirmation, forms, alerts)
    

**Nigerian Specifics**

*   State/city cascading dropdowns (use mock Nigerian locations)
*   HMO provider selector (Hygeia, AIICO, AXA Mansard, Reliance)
*   Currency formatting (₦ with comma separators)

### Phase 3: Expanded AuthContext

**3.1 Update UserRole Type**

```typescript
export type UserRole = 
  | 'cmo'
  | 'hospital_admin'
  | 'clinical_lead'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'billing'
  | 'pharmacist'
  | 'lab_tech'
  | 'patient';
```

**3.2 Update Mock Users**

Create 10 mock users with Nigerian names matching each role.

# Phase 3.5: Critical Workflow Briefs

## Queue Management System

### 3 Queue Types with Real-Time Simulation:
- **Check-in Queue:** Patients waiting at reception
- **Triage Queue:** Patients waiting for nurse
- **Doctor Queue:** Patients ready for consultation

### Each Queue Item Shows:
- Patient name, wait time (color-coded: <20min green, >20min orange, >40min red)
- Priority badge (normal/high/emergency)
- Action button (`Check In`, `Start Triage`, `See Patient`)

### Simulated Real-Time:
When nurse completes triage, patient auto-moves to doctor queue (use `setTimeout` in mock)

---

## Check-In Flow (Receptionist)
1. Select patient from check-in queue.
2. Verify identity (show photo ID field).
3. If HMO:
   - Verify enrollment (mock API call).
   - Show active/inactive badge.
4. Update contact info if changed.
5. Enter reason for visit.
6. Assign to triage or doctor queue.
7. Collect co-pay if required (open payment modal).
8. Print queue ticket (simulate with download).

---

## Triage Flow (Nurse)
1. Select patient from triage queue.
2. Record vitals:
   - BP, temp, pulse, O2 sat, weight, height - auto-calculate BMI.
   - Flag abnormal values (red for out-of-range).
3. Enter chief complaint.
4. Assess priority:
   - Algorithm suggests based on vitals,
   - Nurse can override.
5. Assign to specific doctor queue.

### Phase 4: Navigation Configuration

**4.1 Update AppSidebar**

Expand navigation groups for each role:

| Role | Navigation Groups |
|------|-------------------|
| CMO | Overview, Clinical, Administrative, Integrations, Settings |
| Hospital Admin | Overview, Finance, Inventory, Non-Clinical Staff, Reports |
| Clinical Lead | Overview, Clinical Quality, Medical Staff, Patient Safety |
| Doctor | Clinical (Queue, Patients, Prescriptions), Diagnostics |
| Nurse | Clinical (Triage, Queue, Vitals) |
| Receptionist | Registration, Appointments, Queue Management |
| Billing | Finance (Bills, Claims, Payments, Receipts) |
| Pharmacist | Dispensing, Stock, Prescriptions |
| Lab Tech | Samples, Results, Equipment |
| Patient | My Health (Appointments, Results, Bills, Profile) |

**4.2 Update MobileBottomNav**

5-tab configurations for all 10 roles.

# Phase 4.5: Offline & Data Sync Brief

## Offline Capabilities
- Mark screens as offline-capable with banner:
  - Patient list (cached)
  - Consultation form (full offline, syncs when online)
  - Vital signs entry (offline)
  - Appointment calendar (read-only offline)

## Sync Indicator Component
- **Green "Online"**: All synced
- **Yellow "Syncing 3/5 changes"**: Progress bar
- **Orange "Offline - 5 pending"**: Show count
- **Red "Sync failed"**: Retry button

## When form saved offline:
- Store in `localStorage` with prefix `offline_draft_`
- Add to sync queue
- Show yellow sync status
- On reconnect: auto-submit, replace with server data

### Phase 5: Route Configuration

**5.1 Update App.tsx Routes**

```typescript
// CMO Routes
<Route path="/cmo" element={<CMODashboard />} />
<Route path="/cmo/*" element={<CMODashboard />} />

// Hospital Admin Routes
<Route path="/hospital-admin" element={<HospitalAdminDashboard />} />
<Route path="/hospital-admin/*" element={<HospitalAdminDashboard />} />

// Clinical Lead Routes
<Route path="/clinical-lead" element={<ClinicalLeadDashboard />} />
<Route path="/clinical-lead/*" element={<ClinicalLeadDashboard />} />

// Receptionist Routes
<Route path="/receptionist" element={<ReceptionistDashboard />} />
<Route path="/receptionist/*" element={<ReceptionistDashboard />} />

// Pharmacist Routes (Hybrid - Full routes with placeholder content)
<Route path="/pharmacist" element={<PharmacistDashboard />} />
<Route path="/pharmacist/*" element={<PharmacistDashboard />} />

// Lab Tech Routes (Hybrid - Full routes with placeholder content)
<Route path="/lab-tech" element={<LabTechDashboard />} />
<Route path="/lab-tech/*" element={<LabTechDashboard />} />

// Existing routes remain (doctor, nurse, billing, patient)
```

Phase 5.5: Print/Export Templates
Documents to Generate (PDF simulation)
Use browser print dialog with formatted HTML:

Queue Ticket: Patient name, number, queue type, timestamp
Receipt: Clinic logo, items, payment method, total, balance
Lab Requisition: Patient details, tests ordered, barcode, doctor signature
Prescription Label: Drug name, dosage, frequency, patient name, warnings

Add "Print" button that triggers window.print() on formatted template.

### Phase 6: Dashboard Shells

**6.1 CMO Dashboard**

Executive view combining:
- Revenue Summary (from Hospital Admin)
- Patient Volume Stats (from Clinical Lead)
- Staff Overview (all staff types)
- System Health / Connectivity Status
- Quick access to Permission Settings

**6.2 Hospital Administrator Dashboard**

- Financial Charts (Revenue vs Expenses - area chart)
- Inventory Alerts (Low stock: Diesel, Oxygen, Stationery)
- Non-Clinical Staff Roster (Front Desk, Security)
- Billing Overview (if not toggled off)
- Conditionally hidden: Clinical data sections

**6.3 Clinical Lead Dashboard**

- Patient Volume & Wait Times
- Pending Lab Results Queue
- Critical Cases Review
- Medical Staff Rotation/Roster
- Conditionally hidden: Revenue/profit sections

**6.4 Receptionist Dashboard**

- Today's Appointments (check-in status)
- Walk-in Queue Management
- Patient Search / Quick Registration
- Waiting Room Status
- Doctor Availability

**6.5 Pharmacist Dashboard (Hybrid Placeholder)**

- Prescription Queue ("Coming Soon" overlay on functional UI)
- Stock Levels (mock data)
- Dispensing Log
- Reorder Alerts
- Banner: "Full pharmacy integration coming soon"

**6.6 Lab Technician Dashboard (Hybrid Placeholder)**

- Sample Queue ("Coming Soon" overlay)
- Pending Results
- Equipment Status
- Partner Lab Sync Status
- Banner: "External lab integration coming soon"

### Phase 7: Login Page Update

**7.1 Reorganize Demo Role Selection**

Group roles by category for clearer UX:

```text
Executive & Administration:
  - CMO (Chief Medical Officer)
  - Hospital Administrator
  - Clinical Lead

Clinical Staff:
  - Doctor
  - Nurse

Support Staff:
  - Receptionist
  - Billing Officer

Hybrid Modules (Coming Soon):
  - Pharmacist
  - Lab Technician

Patient Portal:
  - Patient
```

---

## Technical Considerations

### Africa-Specific Optimizations

1. **Lazy Loading**: All dashboard components will use React.lazy() for code splitting
2. **Minimal Re-renders**: Permission checks memoized with useMemo
3. **Offline Indicator**: Remains global, visible on all dashboards
4. **Currency**: All financial displays use NGN formatting

### Security Notes

1. **Client-Side Only**: This is demo/mock mode; real authentication requires server-side validation
2. **Permission Toggles**: Stored in React context (would be database in production)
3. **No localStorage for Roles**: Following security guidelines, roles are only in memory

---

## Files to Create/Modify

### New Files (19)

| File | Purpose |
|------|---------|
| `src/types/user.types.ts` | User and role type definitions |
| `src/types/patient.types.ts` | Patient-related interfaces |
| `src/types/clinical.types.ts` | Clinical data interfaces |
| `src/types/billing.types.ts` | Billing/financial interfaces |
| `src/data/users.ts` | Mock user data |
| `src/data/patients.ts` | Mock patient data |
| `src/data/appointments.ts` | Mock appointment data |
| `src/data/staff.ts` | Mock staff data |
| `src/data/inventory.ts` | Mock inventory data |
| `src/data/bills.ts` | Mock billing data |
| `src/data/claims.ts` | Mock HMO claims data |
| `src/data/lab-orders.ts` | Mock lab order data |
| `src/data/prescriptions.ts` | Mock prescription data |
| `src/contexts/PermissionContext.tsx` | Permission toggle system |
| `src/hooks/usePermissions.ts` | Permission checking hook |
| `src/pages/dashboards/CMODashboard.tsx` | CMO dashboard |
| `src/pages/dashboards/HospitalAdminDashboard.tsx` | Hospital Admin dashboard |
| `src/pages/dashboards/ClinicalLeadDashboard.tsx` | Clinical Lead dashboard |
| `src/pages/dashboards/ReceptionistDashboard.tsx` | Receptionist dashboard |
| `src/pages/dashboards/PharmacistDashboard.tsx` | Pharmacist dashboard (hybrid) |
| `src/pages/dashboards/LabTechDashboard.tsx` | Lab Tech dashboard (hybrid) |
| `src/pages/settings/PermissionSettings.tsx` | CMO permission toggles |

### Modified Files (6)

| File | Changes |
|------|---------|
| `src/contexts/AuthContext.tsx` | Expand to 10 roles |
| `src/components/layout/AppSidebar.tsx` | Add navigation for new roles |
| `src/components/layout/MobileBottomNav.tsx` | Add mobile nav for new roles |
| `src/pages/Login.tsx` | Reorganize demo login with role categories |
| `src/App.tsx` | Add all new routes |
| `src/components/layout/DashboardLayout.tsx` | Update allowed roles logic |

---

# HMO Providers (hmo-providers.ts)

- **Hygeia HMO** (ID: hyg-001, copay: ₦5,000)
- **AIICO Multishield** (ID: aii-001, copay: ₦3,000)
- **AXA Mansard** (ID: axa-001, copay: ₦4,000)
- **Reliance HMO** (ID: rel-001, copay: ₦2,500)

# Navigation Updates Per Role

Add these specific screens to each role's sidebar:

## Receptionist
- Check-In Queue (with count badge)
- Walk-In Registration
- Today's Appointments
- Waiting Room Status

## Nurse
- Triage Queue (with urgent count)
- Pending Vitals
- Patient Search
- Shift Handover (placeholder)

## Pharmacist (hybrid - show but disable)
- Prescription Queue (overlay: "Coming Soon")
- Stock Alerts (functional with mock data)
- Dispensing Log (placeholder)

## Lab Tech (hybrid - show but disable)
- Sample Queue (overlay: "Coming Soon")
- Pending Results (functional with mock data)
- Equipment Status (placeholder)

## Deliverables

After implementation, you will have:

1. **10 distinct user roles** with appropriate routing
2. **CMO permission toggle system** for cross-domain access control
3. **Mock data infrastructure** with separate files per data type
4. **Full navigation skeleton** for desktop sidebar and mobile bottom nav
5. **Dashboard shells** with placeholder content ready for module development
6. **Hybrid module dashboards** (Pharmacist/Lab Tech) with "Coming Soon" indicators
7. **Categorized demo login** for easy role testing

This foundation will be ready for the Patient Management module development.

