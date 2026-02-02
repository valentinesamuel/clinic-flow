

# Appointment Module & Patient Queue Management Implementation Plan

## Overview

This plan implements a comprehensive scheduling and patient flow management system that enables efficient clinic operations from appointment booking through patient checkout. The design prioritizes minimal clicks, real-time visibility, and a mature healthcare aesthetic.

---

## Module Architecture

### Patient Flow Journey

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PATIENT FLOW PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Book Appointment] → [Check-In] → [Triage] → [Doctor Queue] → [Checkout]   │
│        ↓                  ↓           ↓            ↓              ↓         │
│   Receptionist/      Reception     Nurse        Doctor      Pharmacy/Lab/   │
│   Patient Portal                                             Billing         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Appointment Booking System

### 1.1 Appointment Calendar View

**Route**: `/{role}/appointments`

**Design**: Full-width calendar with multiple viewing modes:

| View Mode | Description |
|-----------|-------------|
| Day View | Hourly slots for a single day (default for clinical staff) |
| Week View | 7-day overview with slot availability |
| Month View | High-level availability indicators |

**Calendar Features**:
- Colour-coded appointments by type (Consultation, Follow-up, Emergency, Lab Only)
- Doctor filter dropdown (multi-select)
- Patient quick-search overlay
- Drag-to-reschedule (desktop only)
- Click slot to create appointment

### 1.2 Appointment Booking Modal/Page

**Accessible via**: "Book Appointment" button, calendar slot click, or patient profile

**Form Sections**:

**Section 1: Patient Selection**
- Patient search autocomplete (Name, MRN, Phone)
- Selected patient card showing name, MRN, payment type, last visit

**Section 2: Appointment Details**
- Date picker (disabled past dates)
- Time slot selector (shows available slots based on doctor)
- Doctor dropdown (filtered by availability)
- Appointment type (Consultation, Follow-up, Procedure, Lab Only)
- Duration (auto-set based on type, editable)
- Reason for visit (required, text input)

**Section 3: Scheduling Options**
- Priority indicator (Normal, High, Emergency)
- Recurring appointment toggle (for follow-ups)
- Notes field (optional)

**Validation**:
- Prevent double-booking same slot
- Warn if patient has appointment same day
- Confirm if booking outside normal hours

### 1.3 Appointment Card Component

Reusable card displaying appointment details:

```text
┌────────────────────────────────────────────────────────────────┐
│ 09:00 AM                                        [Consultation] │
│                                                                │
│ Adaora Okafor                                                  │
│ LC-2024-0001 • Female, 45 yrs                                  │
│                                                                │
│ Blood pressure follow-up                                       │
│                                                                │
│ Dr. Chukwuemeka Nwosu                           [Scheduled ●]  │
│                                                                │
│ [Check In]  [Reschedule]  [Cancel]  [View Profile]            │
└────────────────────────────────────────────────────────────────┘
```

---

## Part 2: Check-In Flow

### 2.1 Check-In Queue Screen

**Route**: `/{role}/check-in`

**Target Users**: Receptionist

**Layout**: Two-column design

**Left Column - Scheduled Appointments (70%)**
- Today's appointments sorted by time
- Filter: All, Pending, Checked-In, Completed
- Each card shows: Time, Patient, Reason, Status
- Quick actions: Check In, No Show, Reschedule

**Right Column - Walk-In Registration (30%)**
- "Register Walk-In" prominent button
- Recent walk-ins list (today)
- Quick patient search for returning patients

### 2.2 Check-In Modal

When receptionist clicks "Check In":

**Step 1: Identity Verification**
- Display patient photo (if available)
- Confirm name and date of birth
- Update contact information if changed

**Step 2: Insurance Verification** (if HMO patient)
- Auto-verify HMO status (simulated API)
- Display active/inactive badge
- Policy expiry warning if < 30 days
- Capture co-pay amount

**Step 3: Queue Assignment**
- Select destination queue (Triage / Direct to Doctor)
- Priority selection (Normal, High, Emergency)
- Assign to specific doctor (if direct)
- Generate queue number

**Success**: 
- Toast: "Patient checked in - Queue #5"
- Print queue ticket option
- Patient moves to selected queue

---

## Part 3: Triage Queue (Nurse)

### 3.1 Triage Dashboard Enhancement

**Route**: `/nurse/triage`

**Layout**: Kanban-style board or list view toggle

**Columns/Sections**:
1. **Waiting for Triage** - Patients from check-in
2. **Triage In Progress** - Currently with nurse
3. **Ready for Doctor** - Vitals complete, in doctor queue

**Queue Card Features**:
- Patient name and queue number
- Wait time with colour coding (Green <15min, Yellow 15-30min, Red >30min)
- Priority badge (Normal/High/Emergency)
- Reason for visit
- Quick actions: Start Triage, View History

### 3.2 Triage Flow

When nurse clicks "Start Triage":

**Opens dedicated triage screen** with:

**Left Panel - Patient Context (30%)**
- Patient summary card
- Recent vitals history
- Active medications
- Known allergies (prominent red badges)
- Chronic conditions

**Right Panel - Triage Form (70%)**

**Vitals Entry Section**:
- Blood Pressure (Systolic/Diastolic) with validation
- Temperature (°C/°F toggle)
- Pulse Rate
- Respiratory Rate
- Oxygen Saturation
- Weight & Height → Auto-calculate BMI
- Real-time abnormal value flagging

**Chief Complaint Section**:
- Text area for presenting complaint
- Symptom duration dropdown
- Pain scale selector (0-10)

**Priority Assessment Section**:
- Algorithm-suggested priority (based on vitals + symptoms)
- Nurse can override with reason
- Emergency flag with immediate doctor notification

**Queue Assignment**:
- Select doctor queue
- Add notes for doctor

**Submit**: 
- Saves vitals
- Updates patient record
- Moves patient to doctor queue
- Toast: "Triage complete - Patient assigned to Dr. Nwosu"

---

## Part 4: Doctor Queue

### 4.1 Doctor Queue Dashboard

**Route**: `/doctor/queue`

**Layout**: Clean list with context panel

**Main List (60%)**:
- Patients assigned to logged-in doctor
- Sorted by: Priority (Emergency first), then Wait Time
- Each card shows:
  - Queue position indicator
  - Patient name, age, gender
  - Reason for visit
  - Wait time
  - Triage summary (vital alerts)
  - Actions: See Patient, Skip, Transfer

**Context Panel (40%)** - Shows when patient selected:
- Full patient summary
- Latest vitals with trend indicators
- Recent consultations
- Active medications
- Quick links to: Start Consultation, View Full Profile

### 4.2 Doctor Queue Card Component

```text
┌────────────────────────────────────────────────────────────────┐
│ #1                                              [🔴 Emergency] │
│                                                                │
│ ● Aisha Mohammed                                               │
│   14 yrs • Female • LC-2024-0005                               │
│                                                                │
│   Severe asthma attack                                         │
│                                                                │
│   ⚠️ BP: 110/70  |  Temp: 37.2°C  |  O2: 89% ▼                 │
│                                                                │
│   Wait: 45 min                                                 │
│                                                                │
│   [See Patient]  [View History]  [Transfer]                    │
└────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Patient Portal Appointment Booking

### 5.1 Patient Appointment Booking Flow

**Route**: `/patient/appointments`

**Layout**: Mobile-optimized, step-by-step wizard

**Step 1: Select Service**
- Cards for appointment types (General Consultation, Follow-up, Lab Only)
- Brief description of each

**Step 2: Select Doctor** (optional)
- List of available doctors with photos and specializations
- "Any available doctor" option

**Step 3: Select Date & Time**
- Calendar with available dates highlighted
- Time slots grid for selected date
- Morning/Afternoon filter

**Step 4: Confirm Details**
- Reason for visit input
- Summary of selected options
- Terms acceptance checkbox

**Step 5: Confirmation**
- Success screen with appointment details
- "Add to Calendar" button
- SMS/Email confirmation note

---

## Part 6: Queue Status Display

### 6.1 Public Queue Display Component

For waiting room screens or patient portal:

```text
┌────────────────────────────────────────────────────────────────┐
│                    WAITING ROOM STATUS                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   Now Serving: #12                                             │
│                                                                │
│   Triage Queue:  3 waiting  |  ~15 min average                 │
│   Doctor Queue:  5 waiting  |  ~25 min average                 │
│   Pharmacy:      2 waiting  |  ~10 min average                 │
│                                                                │
│   ─────────────────────────────────────────────────────────    │
│                                                                │
│   Your Number: #15                                             │
│   Estimated Wait: 30-45 minutes                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Part 7: Appointment Management Actions

### 7.1 Reschedule Appointment

**Modal with**:
- Current appointment details
- New date/time selection
- Reason for reschedule dropdown
- Confirm button
- Automatic notification (simulated)

### 7.2 Cancel Appointment

**Modal with**:
- Appointment details
- Cancellation reason dropdown
- Option to notify patient (checkbox)
- Confirm with warning about HMO implications

### 7.3 Mark No-Show

**Quick action with**:
- Confirmation dialog
- Auto-updates appointment status
- Option to reschedule immediately

---

## File Structure

### New Files to Create

```text
src/
├── components/
│   └── appointments/
│       ├── AppointmentCalendar.tsx        # Calendar view with day/week/month
│       ├── AppointmentCard.tsx            # Reusable appointment card
│       ├── AppointmentBookingModal.tsx    # Booking form modal
│       ├── AppointmentRescheduleModal.tsx # Reschedule dialog
│       ├── TimeSlotPicker.tsx             # Available time slots grid
│       └── DoctorSelector.tsx             # Doctor selection with availability
│   └── queue/
│       ├── QueueBoard.tsx                 # Kanban-style queue board
│       ├── QueueCard.tsx                  # Patient queue item card
│       ├── QueueStats.tsx                 # Queue statistics summary
│       ├── CheckInModal.tsx               # Check-in flow modal
│       ├── TriagePanel.tsx                # Triage form panel
│       └── WaitingRoomDisplay.tsx         # Public queue status
├── pages/
│   └── appointments/
│       ├── AppointmentListPage.tsx        # Appointment calendar/list view
│       ├── AppointmentBookingPage.tsx     # Full-page booking (patient portal)
│   └── queue/
│       ├── CheckInQueuePage.tsx           # Receptionist check-in view
│       ├── TriageQueuePage.tsx            # Nurse triage queue
│       └── DoctorQueuePage.tsx            # Doctor patient queue
├── data/
│   └── appointments.ts                    # Enhanced with CRUD functions
│   └── queue.ts                           # Enhanced with queue management
```

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add appointment and queue routes |
| `src/components/layout/AppSidebar.tsx` | Update navigation links |
| `src/data/appointments.ts` | Add CRUD functions, availability checking |
| `src/data/queue.ts` | Add queue management functions |
| `src/types/clinical.types.ts` | Add new appointment-related types if needed |
| `src/pages/dashboards/ReceptionistDashboard.tsx` | Integrate check-in queue |
| `src/pages/dashboards/NurseDashboard.tsx` | Integrate triage queue |
| `src/pages/dashboards/DoctorDashboard.tsx` | Integrate doctor queue |

---

## Route Configuration

| Route | Component | Access |
|-------|-----------|--------|
| `/receptionist/appointments` | AppointmentListPage | Receptionist |
| `/receptionist/check-in` | CheckInQueuePage | Receptionist |
| `/doctor/queue` | DoctorQueuePage | Doctor |
| `/doctor/appointments` | AppointmentListPage | Doctor |
| `/nurse/triage` | TriageQueuePage | Nurse |
| `/nurse/queue` | QueueBoard | Nurse |
| `/cmo/appointments` | AppointmentListPage | CMO |
| `/clinical-lead/queue` | QueueBoard | Clinical Lead |
| `/patient/appointments` | PatientAppointmentPage | Patient |
| `/patient/book` | AppointmentBookingPage | Patient |

---

## Data Layer Enhancements

### appointments.ts Additions

```typescript
// CRUD Operations
export const createAppointment = (data: AppointmentInput): Appointment
export const updateAppointment = (id: string, updates: Partial<Appointment>): Appointment
export const cancelAppointment = (id: string, reason: string): Appointment
export const rescheduleAppointment = (id: string, newDate: string, newTime: string): Appointment

// Availability
export const getAvailableSlots = (doctorId: string, date: string): TimeSlot[]
export const getDoctorAvailability = (date: string): DoctorAvailability[]
export const isSlotAvailable = (doctorId: string, date: string, time: string): boolean

// Queries
export const getAppointmentsByDateRange = (start: string, end: string): Appointment[]
export const getAppointmentsByStatus = (status: AppointmentStatus): Appointment[]
```

### queue.ts Additions

```typescript
// Queue Operations
export const addToQueue = (entry: QueueInput): QueueEntry
export const updateQueueEntry = (id: string, updates: Partial<QueueEntry>): QueueEntry
export const moveToNextQueue = (id: string, targetQueue: QueueType): QueueEntry
export const completeQueueEntry = (id: string): QueueEntry

// Statistics
export const getQueueStats = (queueType: QueueType): QueueStats
export const getAverageWaitTime = (queueType: QueueType): number
export const getQueuePosition = (id: string): number
```

---

## UI/UX Design Specifications

### Colour Coding System

| Element | Colour | Usage |
|---------|--------|-------|
| Consultation | Blue | Default appointment type |
| Follow-up | Teal | Return visits |
| Emergency | Red | Urgent cases |
| Lab Only | Purple | Non-clinical visits |
| Procedure | Orange | Scheduled procedures |

### Wait Time Indicators

| Duration | Colour | Icon |
|----------|--------|------|
| < 15 min | Green | None |
| 15-30 min | Yellow | Warning |
| > 30 min | Red | Alert |

### Priority Badges

| Priority | Design |
|----------|--------|
| Normal | Grey outline badge |
| High | Yellow filled badge |
| Emergency | Red filled badge with pulse animation |

### Mobile Responsiveness

- Calendar collapses to day view on mobile
- Queue cards stack vertically
- Bottom sheet modals instead of centered modals
- Swipe actions for queue management

---

## Component Specifications

### AppointmentCalendar Component

**Props**:
```typescript
interface AppointmentCalendarProps {
  view: 'day' | 'week' | 'month';
  selectedDate: Date;
  doctorFilter?: string[];
  onSlotClick?: (date: Date, time: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}
```

**Features**:
- Navigation arrows for date changing
- Today button to jump to current date
- View toggle buttons
- Appointment density indicators in month view

### QueueCard Component

**Props**:
```typescript
interface QueueCardProps {
  entry: QueueEntry;
  showVitals?: boolean;
  showActions?: boolean;
  onAction?: (action: 'start' | 'complete' | 'transfer' | 'skip') => void;
  onClick?: () => void;
}
```

### TimeSlotPicker Component

**Props**:
```typescript
interface TimeSlotPickerProps {
  date: Date;
  doctorId: string;
  duration: number;
  onSelect: (time: string) => void;
  selectedTime?: string;
}
```

**Layout**:
- Morning slots (08:00 - 12:00)
- Afternoon slots (14:00 - 17:00)
- Greyed out unavailable slots
- Highlighted selected slot

---

## Implementation Order

### Phase 1: Core Components (Days 1-2)
1. `AppointmentCard` - Display component
2. `QueueCard` - Queue item display
3. `TimeSlotPicker` - Slot selection
4. `DoctorSelector` - Doctor picker

### Phase 2: Appointment System (Days 3-4)
5. `AppointmentBookingModal` - Booking form
6. `AppointmentCalendar` - Calendar view
7. `AppointmentListPage` - Main appointments page
8. Data layer enhancements for appointments

### Phase 3: Queue Management (Days 5-6)
9. `CheckInModal` - Check-in flow
10. `CheckInQueuePage` - Receptionist view
11. `QueueBoard` - Kanban queue view
12. `TriagePanel` - Nurse triage form
13. `TriageQueuePage` - Nurse dashboard integration

### Phase 4: Doctor Queue (Day 7)
14. `DoctorQueuePage` - Doctor queue view
15. Context panel with patient details
16. Start consultation flow integration

### Phase 5: Patient Portal & Polish (Day 8)
17. Patient appointment booking wizard
18. Route configuration
19. Dashboard integrations
20. Final UI polish and testing

---

## Success Criteria

After implementation:

1. Receptionist can book appointments from calendar view
2. Walk-in patients can be registered and queued
3. Check-in process captures insurance verification
4. Nurse can view triage queue and record vitals
5. Priority patients automatically sorted to top
6. Doctors see their queue with wait times
7. Patient portal allows self-booking
8. Queue statistics visible in real-time
9. All transitions animate smoothly
10. Mobile experience is fully functional

---

## Technical Notes

### State Management
- Queue state uses React useState with mock data
- Appointment updates simulate API calls with 500ms delay
- Real-time updates simulated with setInterval for queue refresh

### Performance
- Calendar lazy loads appointments by visible range
- Queue cards use virtualization if > 20 items
- Debounced search for patient lookup

### Accessibility
- All interactive elements keyboard navigable
- ARIA labels for queue positions and wait times
- Colour coding supplemented with icons/text
- Focus management in multi-step flows

