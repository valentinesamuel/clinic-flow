

# Comprehensive Dashboard & Module Fix Plan

## Summary

This plan addresses 11 key issues across Doctor, CMO, Nurse, and Receptionist dashboards including non-functional buttons, boring UI designs, missing pagination, and improper drawer layouts.

---

## Issues to Fix

| # | Issue | Location |
|---|-------|----------|
| 1 | Today's Appointments section buttons non-functional | Doctor Dashboard |
| 2 | Start Consultation button non-functional | Doctor Dashboard |
| 3 | Patient queue needs table design with pagination | Doctor Queue Page |
| 4 | Patient drawer too small, squashes layout | Doctor Queue Page |
| 5 | Patient list table needs professional redesign | Patient List Page |
| 6 | Top-right Start Consultation button non-functional | Doctor Dashboard |
| 7 | CMO dashboard needs patient search for booking flow | CMO Dashboard |
| 8 | Appointments list needs redesign and pagination | Appointment List Page |
| 9 | Quick action buttons non-functional on all dashboards | All Dashboards |
| 10 | Check-in queue page needs redesign and pagination | Check-In Queue Page |
| 11 | Appointments page needs redesign and pagination | Appointment List Page |

---

## Part 1: Doctor Dashboard Fixes

### 1.1 Fix Today's Appointments Section

**Current Issue**: Appointment items are not clickable/actionable

**Solution**:
- Add `onClick` handler to navigate to patient profile
- Add "Check In" button that opens check-in modal for scheduled patients
- Add "See Patient" button for checked-in patients that navigates to consultation
- Wire up "View All" button to navigate to `/doctor/appointments`

**Code Changes in `DoctorDashboard.tsx`**:
- Import `useNavigate` from react-router-dom
- Import appointment data functions from `@/data/appointments`
- Replace mock appointments with real data using `getTodaysAppointments()`
- Add handlers: `handleViewAppointments`, `handleCheckIn`, `handleSeePatient`
- Add action buttons to each appointment row

### 1.2 Fix Start Consultation Button (Top Right)

**Current Issue**: Button does nothing when clicked

**Solution**:
- Navigate to `/doctor/queue` when clicked (where doctor can select a patient)
- Alternative: Open a modal to select from queue or search patient

### 1.3 Fix Quick Actions Section

**Current Issue**: All 4 quick action buttons are non-functional

**Solution**:
| Button | Action |
|--------|--------|
| Start Consultation | Navigate to `/doctor/queue` |
| Order Lab Test | Show toast "Feature coming soon" or navigate to lab order page |
| Write Prescription | Show toast "Feature coming soon" or navigate to prescription page |
| Patient History | Navigate to `/doctor/patients` |

---

## Part 2: Doctor Queue Page Improvements

### 2.1 Convert Queue List to Professional Table

**Current Issue**: Queue displayed as cards, needs table design with pagination

**Solution**: Create a professional table layout with the following columns:

| Column | Description |
|--------|-------------|
| # | Queue position |
| Patient | Name + MRN with avatar |
| Age/Gender | Calculated age with gender icon |
| Reason | Chief complaint/reason for visit |
| Priority | Color-coded badge (Normal/High/Emergency) |
| Wait Time | Color-coded duration |
| Vitals | Quick summary with abnormal flags |
| Status | Waiting/In Progress |
| Actions | See Patient, View History buttons |

**Features**:
- Pagination with 10 items per page
- Row click to show patient context panel
- Row highlighting for selected patient
- Row highlighting for emergency priority
- Sortable by priority and wait time

### 2.2 Fix Patient Context Drawer

**Current Issue**: Drawer is too small, squashes content, icons disproportionate

**Solution**:
- Use full-height Sheet component from right side instead of inline panel
- Sheet width: `sm:max-w-lg` (512px) for comfortable reading
- Proper icon sizing: `h-5 w-5` for section icons, `h-4 w-4` for inline icons
- Add close button for mobile
- Include action buttons at bottom of drawer
- Smooth slide-in animation

**Drawer Content Sections**:
1. Patient Header (photo, name, MRN, priority badge)
2. Demographics Card (age, gender, blood type, payment type)
3. Reason for Visit Card
4. Alerts Card (allergies, chronic conditions)
5. Latest Vitals Card (with abnormal highlighting)
6. Recent Consultations Card
7. Action Buttons (Start Consultation, View Full Profile)

---

## Part 3: Patient List Table Redesign

### 3.1 Professional Table Design

**Current Issue**: Table looks basic and boring

**Solution**: Enhanced table with modern styling:

**Visual Improvements**:
- Alternating row colours (subtle)
- Hover state with elevation/shadow
- Sticky header on scroll
- Better column spacing and alignment
- Status dot indicator instead of badge for compact view
- Payment type with HMO logo/icon
- Last visit with relative time ("2 days ago")

**Header Row Styling**:
- Slightly darker background
- Uppercase letter-spacing for column names
- Sortable column indicators

**Enhanced Columns**:
| Column | Enhancement |
|--------|-------------|
| MRN | Monospace font, copy button on hover |
| Patient | Larger avatar (40px), email below name |
| Age/Gender | Icon instead of symbol |
| Phone | Click-to-call link |
| Payment | Icon + text (HMO logo if applicable) |
| Last Visit | Relative time with tooltip for exact date |
| Status | Coloured dot indicator |
| Actions | Icon buttons with tooltips |

---

## Part 4: CMO Dashboard Enhancement

### 4.1 Add Patient Search for Booking Flow

**Current Issue**: No way to search patients and book appointments

**Solution**: Add Patient Search section with booking capability

**New Section: Patient Management**
- Patient search input with autocomplete
- Quick patient results showing:
  - Name, MRN, Payment type
  - "Book Appointment" button per result
  - "View Profile" button per result
- "Register New Patient" CTA when no results

**Additional Quick Actions**:
- Add "Search Patients" button to existing grid
- Add "Book Appointment" button that opens booking modal

---

## Part 5: Appointment List Page Redesign

### 5.1 Professional Appointment List Design

**Current Issue**: Design is boring, needs pagination

**Solution**: Modern appointment list with enhanced visuals

**Table View** (alternative to card grid):
- Clean table with columns: Time, Patient, Type, Doctor, Status, Actions
- Status shown as coloured dot + text
- Type shown as coloured badge
- Actions: Check In, Reschedule, Cancel (dropdown)

**Day View Enhancement**:
- Timeline layout with time slots on left
- Appointment cards aligned to time slots
- Visual time indicator for current time
- Empty slots shown as dashed lines

**Pagination**:
- 20 appointments per page in list view
- Page numbers with first/last buttons
- "Showing X-Y of Z appointments" text

**Filter Pills**:
- Replace dropdown with horizontal pill buttons
- Pills: All, Scheduled, Checked In, Completed, Cancelled
- Selected state with primary colour fill

---

## Part 6: Nurse Dashboard Fixes

### 6.1 Fix Quick Action Buttons

**Current Issue**: All quick action buttons are non-functional

**Solution**:
| Button | Action |
|--------|--------|
| Start Triage | Navigate to `/nurse/triage` |
| Record Vitals | Open vitals entry modal for patient search |
| View Queue | Navigate to `/nurse/triage` |
| Patient Search | Navigate to `/nurse/patients` |

---

## Part 7: Receptionist Dashboard & Queue Page Fixes

### 7.1 Fix Dashboard Quick Actions

**Current Issue**: Buttons in receptionist dashboard are non-functional

**Solution**:
- "New Patient" button: Navigate to `/receptionist/patients/new`
- Patient search: Navigate on result click to patient profile
- "Check In" button on appointments: Open check-in modal
- "Process" button on walk-ins: Open check-in modal

### 7.2 Redesign Check-In Queue Page

**Current Issue**: Design looks boring, needs pagination

**Solution**: Modern queue management interface

**Layout Changes**:
- Full-width appointment table on left (70%)
- Sidebar with stats and quick actions (30%)

**Appointment Table Design**:
| Column | Description |
|--------|-------------|
| Time | Scheduled time, bold |
| Patient | Name + MRN with small avatar |
| Type | Coloured badge |
| Doctor | Doctor name |
| Status | Dot + text |
| Wait | Time since scheduled (if past) |
| Actions | Check In, No Show buttons |

**Table Features**:
- Row hover state
- Selected row highlight
- Status tabs above table (not in table)
- Pagination: 15 items per page
- Search bar above table

**Stats Cards Enhancement**:
- Larger icons
- Progress ring for daily completion
- Real-time wait time average

### 7.3 Redesign Appointments Page

Same improvements as Part 5, applied consistently.

---

## Part 8: Universal Quick Actions Fix

### 8.1 Create Reusable Quick Action Handler

Create a utility hook for dashboard quick actions:

```typescript
// src/hooks/useDashboardActions.ts
export function useDashboardActions(role: UserRole) {
  const navigate = useNavigate();
  
  const actions = {
    startConsultation: () => navigate(`/${role}/queue`),
    orderLabTest: () => toast({ title: 'Coming Soon', description: 'Lab ordering will be available soon' }),
    writePrescription: () => toast({ title: 'Coming Soon', description: 'Prescription writing will be available soon' }),
    patientHistory: () => navigate(`/${role}/patients`),
    startTriage: () => navigate('/nurse/triage'),
    recordVitals: () => // open vitals modal,
    viewQueue: () => navigate(`/${role}/queue` or `/nurse/triage`),
    patientSearch: () => navigate(`/${role}/patients`),
    newPatient: () => navigate(`/${role}/patients/new`),
    bookAppointment: () => // open booking modal,
  };
  
  return actions;
}
```

---

## File Changes Summary

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/dashboards/DoctorDashboard.tsx` | Wire buttons, use real data, add navigation |
| `src/pages/dashboards/NurseDashboard.tsx` | Wire quick action buttons |
| `src/pages/dashboards/ReceptionistDashboard.tsx` | Wire all buttons, add navigation |
| `src/pages/dashboards/CMODashboard.tsx` | Add patient search section and quick actions |
| `src/pages/queue/DoctorQueuePage.tsx` | Convert to table, use Sheet drawer, add pagination |
| `src/pages/queue/CheckInQueuePage.tsx` | Redesign with professional table, add pagination |
| `src/pages/appointments/AppointmentListPage.tsx` | Redesign list view, add pagination |
| `src/components/patients/PatientTable.tsx` | Enhanced professional styling |
| `src/components/queue/QueueCard.tsx` | Add table row variant |
| `src/components/appointments/AppointmentCard.tsx` | Add table row variant |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useDashboardActions.ts` | Reusable quick action handlers |
| `src/components/queue/QueueTable.tsx` | Table variant of queue display |
| `src/components/appointments/AppointmentTable.tsx` | Table variant of appointments |
| `src/components/patients/PatientDrawer.tsx` | Right-side patient context drawer |

---

## UI/UX Design Specifications

### Table Styling Standards

```css
/* Table Row Hover */
hover:bg-accent/30

/* Selected Row */
bg-primary/5 border-l-2 border-primary

/* Emergency Row */
bg-destructive/5 border-l-2 border-destructive

/* Header Row */
bg-muted/50 font-medium text-xs uppercase tracking-wider

/* Cell Padding */
px-4 py-3

/* Alternating Rows */
even:bg-muted/20
```

### Drawer Specifications

```typescript
// Sheet component configuration
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent 
    side="right" 
    className="w-full sm:max-w-lg overflow-y-auto"
  >
    {/* Content */}
  </SheetContent>
</Sheet>
```

### Pagination Component

```typescript
// Consistent pagination across all tables
<div className="flex items-center justify-between px-4 py-3 border-t">
  <p className="text-sm text-muted-foreground">
    Showing {start + 1}-{Math.min(end, total)} of {total}
  </p>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm" disabled={page === 1}>
      Previous
    </Button>
    {/* Page numbers */}
    <Button variant="outline" size="sm" disabled={page === totalPages}>
      Next
    </Button>
  </div>
</div>
```

---

## Implementation Order

1. **useDashboardActions hook** - Foundation for all button fixes
2. **DoctorDashboard.tsx** - Fix all buttons with real data
3. **QueueTable.tsx + PatientDrawer.tsx** - New components for doctor queue
4. **DoctorQueuePage.tsx** - Apply table + drawer
5. **PatientTable.tsx** - Enhanced styling
6. **NurseDashboard.tsx** - Wire quick actions
7. **CMODashboard.tsx** - Add patient search
8. **AppointmentTable.tsx** - New table component
9. **AppointmentListPage.tsx** - Apply table with pagination
10. **CheckInQueuePage.tsx** - Redesign with table
11. **ReceptionistDashboard.tsx** - Wire all buttons

---

## Expected Outcomes

After implementation:

1. All quick action buttons across dashboards navigate correctly
2. Doctor can see today's appointments and interact with them
3. Patient queue displays as professional table with pagination
4. Patient drawer slides in from right with proper proportions
5. CMO can search patients and book appointments
6. All tables have consistent professional styling
7. All list views have pagination with 15-20 items per page
8. Check-in queue page has modern, functional design
9. Appointment list page is visually appealing with proper layout
10. Mobile experience remains functional with responsive design

