

# Complete Patient Management Module Enhancement

## Summary

This plan delivers a polished, clinically-focused patient management experience by:
1. Adding edit patient flow with full routing
2. Completing registration routes for all applicable roles
3. Fleshing out the Overview, Medical History, and Vital Signs tabs with real data and mature UI
4. Preparing placeholder infrastructure for Appointments, Prescriptions, Lab Results, and Billing tabs

---

## Part 1: Registration & Edit Flow

### 1.1 New Files

| File | Purpose |
|------|---------|
| `src/pages/patients/PatientEditPage.tsx` | Page wrapper for editing existing patients |

### 1.2 Modified Files

| File | Changes |
|------|---------|
| `src/components/patients/PatientRegistrationForm.tsx` | Add edit mode support via `initialPatient` prop |
| `src/App.tsx` | Add missing routes, fix route ordering |

### 1.3 PatientRegistrationForm Edit Mode Changes

The form will accept an optional `initialPatient` prop to enable edit mode:

```text
Props:
  - initialPatient?: Patient (NEW - when provided, form is in edit mode)

Conditional Behavior:
  - Title: "Register New Patient" vs "Edit Patient - [Name]"
  - Submit: "Register Patient" vs "Save Changes"
  - Draft auto-save: Enabled in create, Disabled in edit
  - On submit: addPatient() vs updatePatient()
  - Phone check: Excludes current patient ID in edit mode
  - MRN: Auto-generated in create, shown read-only in edit
  - Shows "Last updated" timestamp in edit mode
```

### 1.4 Route Additions to App.tsx

```text
CMO:
  /cmo/patients/new          → PatientRegistrationPage
  /cmo/patients/:id/edit     → PatientEditPage

Clinical Lead:
  /clinical-lead/patients         → PatientListPage
  /clinical-lead/patients/new     → PatientRegistrationPage
  /clinical-lead/patients/:id     → PatientProfilePage
  /clinical-lead/patients/:id/edit → PatientEditPage

Receptionist:
  /receptionist/patients/:id/edit → PatientEditPage

Doctor:
  /doctor/patients/new       → PatientRegistrationPage
  /doctor/patients/:id/edit  → PatientEditPage

Nurse:
  /nurse/patients/:id/edit   → PatientEditPage
```

Route order fix: Specific routes (e.g., `/patients/new`) must appear BEFORE wildcard routes (`/*`).

---

## Part 2: Patient Profile Tab Enhancements

### 2.1 Overview Tab Enhancement

Transform from basic cards to a clinically actionable summary:

**Quick Glance Section (Top Row)**
Three key metric cards:
- Last Visit: Date + doctor name + "X days ago"
- Next Appointment: Date/time or "None scheduled" with Book button
- Outstanding Balance: Amount in NGN with "Pay" button if > 0

**Recent Activity Timeline**
Vertical timeline showing last 5 activities:
- Consultation icon + "Consultation with Dr. X" + date
- Prescription icon + "Prescription dispensed" + date
- Lab icon + "Lab results ready" + date
- Payment icon + "Payment of NGN X,XXX" + date

Each item clickable to navigate to relevant tab.

**Information Cards (Grid)**
Keep existing but enhance:
- Contact Information (with click-to-call, click-to-email)
- Address Information
- Next of Kin (with emergency call button)
- Payment & Insurance (with expiry warning if < 30 days)

### 2.2 Medical History Tab Enhancement

Transform from empty placeholder to consultation timeline:

**Header Actions**
- Filter by date range (Last 30 days, 90 days, 1 year, All)
- Search consultations by diagnosis

**Consultation Cards (Accordion)**
Each consultation shows:
```text
┌─────────────────────────────────────────────────────────────┐
│ ● Feb 1, 2024                                   Dr. Nwosu   │
│   Follow-up Visit                                           │
├─────────────────────────────────────────────────────────────┤
│ Chief Complaint: Hypertension follow-up                     │
│ Diagnosis: Essential hypertension (I10)                     │
│                                                             │
│ [View Details] [View Prescription] [View Lab Results]       │
└─────────────────────────────────────────────────────────────┘
```

**Expanded View Shows:**
- Chief Complaint
- History of Present Illness
- Physical Examination findings
- Diagnosis with ICD codes
- Treatment Plan
- Follow-up date

**Empty State**
"No consultations recorded. Patient history will appear here after their first visit."

### 2.3 Vital Signs Tab Enhancement

Transform from placeholder to comprehensive vitals display:

**Latest Vitals Card (Prominent)**
Large card showing most recent readings in a grid:
```text
┌────────────────────────────────────────────────────────────────┐
│ Latest Vitals - Feb 1, 2024, 09:15 AM                         │
│ Recorded by: Fatima Ibrahim (Nurse)                           │
├────────────────────────────────────────────────────────────────┤
│  Blood Pressure    Temperature    Pulse    O2 Sat             │
│  [140/90 mmHg]     [36.8°C]       [78 bpm] [98%]              │
│   ▲ HIGH           Normal         Normal   Normal             │
│                                                                │
│  Weight     Height    BMI           Respiratory               │
│  [72 kg]    [165 cm]  [26.4]        [16 /min]                 │
│   Normal    Normal    Overweight    Normal                    │
└────────────────────────────────────────────────────────────────┘
```

**Abnormal Value Flagging:**
- Red badge + upward/downward arrow for out-of-range
- Yellow badge for borderline (within 10% of threshold)
- Thresholds from existing `getAbnormalVitals()` logic

**Vitals History Section**
- Table view of past readings (most recent first)
- Columns: Date, BP, Temp, Pulse, O2, BMI, Recorded By
- Pagination if > 10 entries

**Blood Pressure Trend Chart (Using Recharts)**
- Line chart showing BP readings over time
- Filter: Last 7 days, 30 days, 90 days
- Systolic and diastolic as separate lines
- Reference lines for normal range (120/80)

**Record New Vitals Button (Nurse/Doctor only)**
Opens a modal with vital entry form:
- All vital fields with validation
- Auto-calculate BMI from weight/height
- Flag abnormal values in real-time
- Submit adds to mock data and refreshes view

### 2.4 Appointments Tab (Placeholder - Ready for Module)

Show data from existing mock appointments:

**Upcoming Appointments Section**
Cards for scheduled appointments:
- Date, Time, Doctor, Type badge (Consultation/Follow-up)
- Status badge (Scheduled/Confirmed)
- Actions: Reschedule (placeholder), Cancel (placeholder)

**Past Appointments Section (Collapsed by default)**
- Same card format but muted colors
- "View Consultation" link if completed

**Empty State**
"No appointments scheduled."
[Schedule Appointment] button

### 2.5 Prescriptions Tab (Placeholder - Ready for Module)

Show data from existing mock prescriptions:

**Active Prescriptions**
Green-accented cards:
```text
┌─────────────────────────────────────────────────────────────┐
│ Lisinopril 10mg                           [Active] ●        │
│ Once daily - Morning with water                             │
│ Prescribed by Dr. Nwosu on Feb 1, 2024                      │
│                                      [Request Refill]       │
└─────────────────────────────────────────────────────────────┘
```

**Past Prescriptions (Collapsed)**
Gray cards with dispensed date

**Empty State**
"No prescriptions on record."

### 2.6 Lab Results Tab (Placeholder - Ready for Module)

Show data from existing mock lab orders:

**Pending Tests Section (Yellow accent)**
- Test name, ordered date, status badge (Ordered/Sample Collected/Processing)
- "Waiting for results" message

**Completed Results Section**
Cards with:
- Test name, completion date
- Abnormal flag if any test in order is abnormal
- "View Results" expands to show test details table:

```text
Test Name       | Result    | Normal Range | Status
Fasting Blood   | 156 mg/dL | 70-100 mg/dL | ▲ HIGH
Sugar           |           |              |
```

**Empty State**
"No lab tests ordered."

### 2.7 Billing Tab (Placeholder - Ready for Module)

Show data from existing mock bills:

**Outstanding Balance Alert (if > 0)**
Red banner with total balance and "Pay Now" button

**Recent Invoices Table**
- Invoice #, Date, Amount, Status (Paid/Partial/Pending), Actions
- Click row to see itemized bill

**Payment History (Collapsed)**
- Date, Amount, Method (Cash/Card/HMO), Receipt download link

**Empty State**
"No billing records."

---

## Part 3: New Data Functions

Add helper functions to support the enhanced tabs:

### 3.1 Additions to vitals.ts

```typescript
// Add more vitals for pat-001 to show history
export const addVitals = (vitals: Omit<VitalSigns, 'id'>): VitalSigns

// Calculate BMI
export const calculateBMI = (weight: number, height: number): number

// Get BMI category
export const getBMICategory = (bmi: number): 'Underweight' | 'Normal' | 'Overweight' | 'Obese'

// Check if vital is abnormal
export const isVitalAbnormal = (field: string, value: number): { abnormal: boolean; severity: 'warning' | 'critical' }
```

### 3.2 Additions to patients.ts

```typescript
// Update patient (already exists but needs enhancement)
export const updatePatient = (id: string, updates: Partial<Patient>): Patient | undefined
```

### 3.3 Create consultations mock data

New file: `src/data/consultations.ts`

```typescript
// Mock consultations linked to patients
export const mockConsultations: Consultation[] = [
  {
    id: 'con-001',
    patientId: 'pat-001',
    doctorId: 'usr-004',
    appointmentId: 'apt-001',
    chiefComplaint: 'Blood pressure follow-up',
    historyOfPresentIllness: 'Patient reports occasional headaches...',
    physicalExamination: 'BP 140/90, general appearance healthy...',
    diagnosis: ['Essential hypertension'],
    icdCodes: ['I10'],
    treatmentPlan: 'Continue current medication...',
    prescriptionId: 'rx-001',
    labOrderIds: ['lab-001'],
    followUpDate: '2024-03-01',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  // ... more consultations for other patients
];

export const getConsultationsByPatient = (patientId: string): Consultation[]
export const getRecentConsultations = (patientId: string, limit: number): Consultation[]
```

---

## Part 4: New Components

### 4.1 VitalSignsCard Component

Reusable component for displaying vitals with abnormal flagging:

```text
src/components/clinical/VitalSignsCard.tsx

Props:
  - vitals: VitalSigns
  - showRecordedBy?: boolean
  - compact?: boolean

Features:
  - Grid layout for vital metrics
  - Color-coded abnormal flags
  - BMI category display
  - Responsive design (stack on mobile)
```

### 4.2 VitalsEntryModal Component

Modal for recording new vitals:

```text
src/components/clinical/VitalsEntryModal.tsx

Props:
  - patientId: string
  - onSuccess: (vitals: VitalSigns) => void
  - onClose: () => void

Features:
  - All vital input fields with validation
  - Real-time BMI calculation
  - Real-time abnormal flagging
  - Submit handler that adds to mock data
```

### 4.3 ConsultationCard Component

```text
src/components/clinical/ConsultationCard.tsx

Props:
  - consultation: Consultation
  - expanded?: boolean
  - onToggle?: () => void

Features:
  - Accordion-style expand/collapse
  - Shows summary when collapsed
  - Full details when expanded
  - Links to related prescription/labs
```

### 4.4 ActivityTimeline Component

```text
src/components/patients/ActivityTimeline.tsx

Props:
  - patientId: string
  - limit?: number

Features:
  - Aggregates data from consultations, prescriptions, labs, bills
  - Sorts by date
  - Shows icon per activity type
  - Clickable to navigate to relevant tab
```

---

## Part 5: File Summary

### New Files (7)

| File | Purpose |
|------|---------|
| `src/pages/patients/PatientEditPage.tsx` | Edit patient wrapper page |
| `src/data/consultations.ts` | Mock consultation data |
| `src/components/clinical/VitalSignsCard.tsx` | Vitals display component |
| `src/components/clinical/VitalsEntryModal.tsx` | Record vitals modal |
| `src/components/clinical/ConsultationCard.tsx` | Consultation accordion card |
| `src/components/patients/ActivityTimeline.tsx` | Recent activity timeline |
| `src/components/clinical/VitalsTrendChart.tsx` | BP trend chart using Recharts |

### Modified Files (5)

| File | Changes |
|------|---------|
| `src/components/patients/PatientRegistrationForm.tsx` | Add edit mode |
| `src/components/patients/PatientProfile.tsx` | Enhanced tabs with real data |
| `src/data/vitals.ts` | Add helper functions, more mock data |
| `src/data/patients.ts` | Ensure updatePatient works correctly |
| `src/App.tsx` | Add all missing routes, fix order |

---

## Part 6: UI/UX Design Principles

### Minimal Clicks Philosophy

| Action | Current | Target |
|--------|---------|--------|
| Edit patient from profile | Click Edit → Navigate → Edit | Same (1 click) |
| View vitals from overview | Click tab → scroll | Direct link in overview |
| Record vitals | Tab → scroll → button → form | Tab → button → modal (2 clicks) |
| View consultation details | Tab → click card → navigate | Tab → click card → expand in-place |

### Mature Healthcare Aesthetic

- No emojis, only Lucide icons
- Color palette: Blue for primary, Red for alerts/abnormal, Yellow for warnings, Green for success/normal
- Muted backgrounds with clear data hierarchy
- Consistent spacing and typography

### Mobile Responsiveness

- Cards stack vertically on mobile
- Vitals grid becomes 2x3 instead of 1x6
- Tabs become scrollable horizontal list
- Touch targets minimum 44px

---

## Implementation Order

1. **PatientEditPage** + Routes - Enable edit flow
2. **PatientRegistrationForm edit mode** - Form reuse
3. **consultations.ts** - Mock data for history
4. **vitals.ts enhancements** - More data + helpers
5. **VitalSignsCard** - Reusable vitals display
6. **VitalsEntryModal** - Record new vitals
7. **VitalsTrendChart** - BP trend visualization
8. **ConsultationCard** - Medical history display
9. **ActivityTimeline** - Overview enhancement
10. **PatientProfile.tsx** - Wire everything together

---

## Expected Outcome

After implementation:

1. Edit patient button navigates correctly to edit page
2. Edit form pre-populates with existing patient data
3. All roles have appropriate registration/edit routes
4. Overview tab shows actionable patient summary
5. Medical History tab displays consultation timeline
6. Vital Signs tab shows latest readings with abnormal flags
7. Vital Signs tab includes BP trend chart
8. Nurses can record new vitals via modal
9. Other tabs show real data from mock (ready for module expansion)
10. Consistent, professional healthcare UI throughout

