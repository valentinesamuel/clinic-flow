# PATIENT & QUEUE MODULE RE-ARCHITECTURE - Atomic Design Update

## Overview

Re-architect the existing Patient Management and Queue Management modules to follow **Atomic Design principles** with emphasis on reusability, maintainability, and preparation for billing/lab/pharmacy/consultation integration. This update maintains all existing functionality while creating a scalable component foundation.

---

## Part 1: Atomic Component Architecture

### 1.1 Directory Structure

```
src/components/
├── atoms/
│   ├── display/
│   │   ├── PatientNumber.tsx          # PT-2026-00123 display
│   │   ├── PatientAge.tsx             # Age with icon
│   │   ├── GenderIcon.tsx             # Male/Female/Other icons
│   │   ├── BloodTypeDisplay.tsx       # Blood type with drop icon
│   │   ├── PhoneNumber.tsx            # Clickable tel: link
│   │   ├── WaitTimeIndicator.tsx      # Color-coded wait time
│   │   ├── QueueNumber.tsx            # Queue ticket number
│   │   └── PriorityBadge.tsx          # Normal/High/Emergency
│   ├── input/
│   │   ├── NigerianPhoneInput.tsx     # +234 format validation
│   │   ├── StateSelector.tsx          # 36 states + FCT
│   │   ├── CityInput.tsx              # City text input
│   │   ├── DateOfBirthPicker.tsx      # Past dates only, age preview
│   │   ├── BloodTypeSelector.tsx      # A+, A-, B+, etc.
│   │   └── GenderSelector.tsx         # Radio buttons
│   ├── feedback/
│   │   ├── StatusBadge.tsx            # Generic status badge
│   │   ├── InsuranceBadge.tsx         # HMO status display
│   │   ├── PaymentStatusBadge.tsx     # Paid/Pending/Cleared
│   │   ├── AllergyAlert.tsx           # Red allergy badge
│   │   └── LoadingSkeleton.tsx        # Skeleton loader
│   └── actions/
│       ├── IconButton.tsx             # Reusable icon button
│       ├── ActionMenu.tsx             # Three-dot menu
│       └── CopyButton.tsx             # Copy to clipboard
│
├── molecules/
│   ├── patient/
│   │   ├── PatientQuickInfo.tsx       # Name + Age + Gender block
│   │   ├── PatientContact.tsx         # Phone + Email block
│   │   ├── PatientInsurance.tsx       # HMO card with details
│   │   ├── PatientIdentification.tsx  # ID type + number display
│   │   ├── EmergencyContact.tsx       # Emergency contact card
│   │   ├── PatientAllergyList.tsx     # List of allergy badges
│   │   ├── PatientConditionList.tsx   # Chronic conditions
│   │   └── PatientMedicationList.tsx  # Current medications
│   ├── queue/
│   │   ├── QueueCard.tsx              # Patient card in queue (reusable)
│   │   ├── QueueFilters.tsx           # Filter buttons group
│   │   ├── QueueSearch.tsx            # Search + clear button
│   │   ├── QueueStats.tsx             # Count + wait time stats
│   │   ├── QueuePagination.tsx        # Pagination controls
│   │   └── QueueSorter.tsx            # Sort dropdown
│   ├── forms/
│   │   ├── PersonalInfoSection.tsx    # Registration section 1
│   │   ├── ContactInfoSection.tsx     # Registration section 2
│   │   ├── EmergencyContactSection.tsx # Registration section 3
│   │   ├── InsuranceInfoSection.tsx   # Registration section 4
│   │   ├── IdentificationSection.tsx  # Registration section 5
│   │   └── MedicalHistorySection.tsx  # Registration section 6
│   └── search/
│       ├── PatientSearchInput.tsx     # Debounced search
│       ├── PatientSearchResults.tsx   # Results dropdown
│       └── RecentSearches.tsx         # Recent searches list
│
├── organisms/
│   ├── patient/
│   │   ├── PatientListTable.tsx       # Complete patient table
│   │   ├── PatientRegistrationForm.tsx # Full registration form
│   │   ├── PatientDetailsSidebar.tsx  # Left sidebar on details page
│   │   ├── PatientDetailsContent.tsx  # Tabbed content area
│   │   ├── PatientSearchModal.tsx     # Global search modal
│   │   ├── PatientEditForm.tsx        # Edit patient form
│   │   └── PatientTimeline.tsx        # Activity timeline
│   ├── queue/
│   │   ├── TriageQueue.tsx            # Triage-specific queue
│   │   ├── DoctorNewQueue.tsx         # New patient queue
│   │   ├── DoctorReviewQueue.tsx      # Review/paused patients queue
│   │   ├── LabQueue.tsx               # Lab queue (payment verified)
│   │   ├── PharmacyQueue.tsx          # Pharmacy queue
│   │   ├── CheckInModal.tsx           # Multi-step check-in
│   │   ├── TriageModal.tsx            # Triage with vitals
│   │   └── QueueManagementPanel.tsx   # Queue controls
│   └── vitals/
│       ├── VitalsEntryForm.tsx        # Complete vitals form
│       ├── VitalsDisplay.tsx          # Read-only vitals card
│       └── VitalsHistory.tsx          # Historical vitals graph
│
└── templates/
    ├── patient/
    │   ├── PatientListPage.tsx        # /patients layout
    │   ├── PatientDetailsPage.tsx     # /patients/:id layout
    │   └── PatientRegistrationPage.tsx # /patients/new layout
    └── queue/
        ├── QueueDashboardLayout.tsx   # Generic queue page layout
        └── QueueMonitorLayout.tsx     # Waiting room display
```

---

## Part 2: Shared Hooks

### 2.1 Create Custom Hooks (`src/hooks/`)

```typescript
// usePatientSearch.ts
export function usePatientSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearch = useMemo(
    () => debounce((q: string) => {
      // Search logic
    }, 300),
    []
  );
  
  return { query, setQuery, results, isLoading };
}

// useQueueManagement.ts
export function useQueueManagement(queueType: QueueType) {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [filters, setFilters] = useState<QueueFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('waitTime');
  
  const addToQueue = (patient: Patient) => { /* */ };
  const removeFromQueue = (entryId: string) => { /* */ };
  const callNextPatient = () => { /* */ };
  
  return { queue, filters, sortBy, addToQueue, removeFromQueue, callNextPatient };
}

// usePatientForm.ts
export function usePatientForm(patientId?: string) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: /* */
  });
  
  const { saveAsDraft, loadDraft, clearDraft } = useDraftRecovery('patient_draft');
  
  return { form, saveAsDraft, loadDraft, clearDraft };
}

// useVitals.ts
export function useVitals(patientId: string) {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [history, setHistory] = useState<Vitals[]>([]);
  
  const recordVitals = (data: VitalsInput) => { /* */ };
  const calculateBMI = (weight: number, height: number) => { /* */ };
  const flagAbnormal = (vital: keyof Vitals, value: number) => { /* */ };
  
  return { vitals, history, recordVitals, calculateBMI, flagAbnormal };
}

// usePagination.ts
export function usePagination<T>(items: T[], itemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return { currentPage, totalPages, paginatedItems, setCurrentPage };
}

// useTableSort.ts
export function useTableSort<T>(data: T[], defaultSort: keyof T) {
  const [sortKey, setSortKey] = useState<keyof T>(defaultSort);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      // Sorting logic
    });
  }, [data, sortKey, sortOrder]);
  
  return { sortedData, sortKey, sortOrder, setSortKey, setSortOrder };
}
```

---

## Part 3: Shared Contexts

### 3.1 Queue Context (`src/contexts/QueueContext.tsx`)

```typescript
interface QueueContextType {
  queues: {
    triage: QueueEntry[];
    doctorNew: QueueEntry[];
    doctorReview: QueueEntry[];
    lab: QueueEntry[];
    pharmacy: QueueEntry[];
  };
  addToQueue: (queueType: QueueType, entry: QueueEntry) => void;
  removeFromQueue: (queueType: QueueType, entryId: string) => void;
  updateQueueEntry: (queueType: QueueType, entryId: string, updates: Partial<QueueEntry>) => void;
  callNextPatient: (queueType: QueueType) => QueueEntry | null;
  getQueueStats: (queueType: QueueType) => QueueStats;
}

export const QueueProvider = ({ children }) => {
  const [queues, setQueues] = useState<QueueState>(initialState);
  
  // Real-time simulation (polling every 5s)
  useEffect(() => {
    const interval = setInterval(() => {
      // Update wait times
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <QueueContext.Provider value={contextValue}>
      {children}
    </QueueContext.Provider>
  );
};
```

### 3.2 Notification Context (`src/contexts/NotificationContext.tsx`)

```typescript
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

type NotificationType = 
  | 'patient_arrived'        // Patient checked in
  | 'results_ready'          // Lab results available
  | 'prescription_ready'     // Pharmacy ready
  | 'consultation_paused'    // Doctor paused consultation
  | 'consultation_autoclosed' // 12-hour auto-close
  | 'payment_received'       // Payment confirmed
  | 'queue_warning';         // Too many reviews pending

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Push notification simulation
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => removeNotification(id), 10000);
  };
  
  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};
```

---

## Part 4: Enhanced Queue System

### 4.1 Queue Types (`src/types/queue.types.ts`)

```typescript
export type QueueType = 
  | 'triage'           // Nurse triage queue
  | 'doctor_new'       // New consultations
  | 'doctor_review'    // Result reviews (paused consultations)
  | 'lab'              // Lab sample collection
  | 'pharmacy';        // Pharmacy dispensing

export type QueueStatus =
  | 'waiting'          // In queue
  | 'in_progress'      // Being attended to
  | 'paused'           // Consultation paused
  | 'completed'        // Done
  | 'no_show';         // Marked as no-show

export type PauseReason =
  | 'waiting_lab_results'
  | 'personal_urgent_issue'
  | 'patient_requested'
  | 'waiting_specialist'
  | 'other';

export interface QueueEntry {
  id: string;
  patientId: string;
  patient: Patient;
  queueType: QueueType;
  status: QueueStatus;
  priority: 'normal' | 'high' | 'emergency';
  
  // Timestamps
  joinedAt: string;
  calledAt?: string;
  completedAt?: string;
  
  // Wait time (calculated)
  waitTimeMinutes: number;
  
  // Payment verification
  paymentStatus: 'pending' | 'cleared' | 'hmo_verified' | 'emergency_override';
  paymentClearanceId?: string;
  paymentVerifiedBy?: string;
  paymentVerifiedAt?: string;
  
  // Review-specific
  isReview?: boolean;              // True if returning for results
  originalConsultationId?: string; // Link to paused consultation
  
  // Pause-specific
  pauseReason?: PauseReason;
  pauseReasonOther?: string;       // If reason = 'other'
  pausedAt?: string;
  pausedBy?: string;               // Doctor who paused
  autoPauseExpiryAt?: string;      // 12 hours from pause
  
  // Assignment
  assignedTo?: string;             // Nurse/Doctor/Lab Tech/Pharmacist ID
  assignedAt?: string;
  
  // Notes
  notes?: string;
}

export interface QueueStats {
  total: number;
  waiting: number;
  inProgress: number;
  paused: number;
  averageWaitTime: number;
  longestWaitTime: number;
}

export interface QueueFilters {
  priority?: 'normal' | 'high' | 'emergency';
  paymentStatus?: 'pending' | 'cleared' | 'hmo_verified';
  waitTime?: 'under_20' | '20_to_40' | 'over_40';
}
```

### 4.2 Queue Configuration (`src/config/queueConfig.ts`)

```typescript
export const QUEUE_CONFIGS: Record<QueueType, QueueConfig> = {
  triage: {
    name: 'Triage Queue',
    icon: 'stethoscope',
    color: 'blue',
    allowedRoles: ['nurse', 'admin'],
    requiresPayment: true,
    maxWaitTimeWarning: 30, // minutes
    columns: ['patient', 'priority', 'waitTime', 'paymentStatus', 'actions'],
    sortOptions: ['waitTime', 'priority', 'joinedAt'],
    filterOptions: ['priority', 'paymentStatus', 'waitTime'],
  },
  doctor_new: {
    name: 'New Consultations',
    icon: 'user-doctor',
    color: 'green',
    allowedRoles: ['doctor', 'admin'],
    requiresPayment: true,
    maxWaitTimeWarning: 45,
    columns: ['patient', 'chiefComplaint', 'priority', 'waitTime', 'actions'],
    sortOptions: ['waitTime', 'priority', 'joinedAt'],
    filterOptions: ['priority', 'waitTime'],
  },
  doctor_review: {
    name: 'Result Reviews',
    icon: 'clipboard-check',
    color: 'purple',
    allowedRoles: ['doctor', 'admin'],
    requiresPayment: false, // Already paid for consultation
    maxWaitTimeWarning: 20, // Reviews should be quick
    columns: ['patient', 'pauseReason', 'pausedAt', 'waitTime', 'actions'],
    sortOptions: ['pausedAt', 'waitTime'],
    filterOptions: ['pauseReason'],
    showWarningThreshold: 3, // Warn doctor if >3 reviews pending
  },
  lab: {
    name: 'Lab Queue',
    icon: 'flask',
    color: 'teal',
    allowedRoles: ['lab_tech', 'admin'],
    requiresPayment: true,
    maxWaitTimeWarning: 60,
    columns: ['patient', 'tests', 'priority', 'waitTime', 'paymentStatus', 'actions'],
    sortOptions: ['priority', 'waitTime', 'joinedAt'],
    filterOptions: ['priority', 'paymentStatus'],
  },
  pharmacy: {
    name: 'Pharmacy Queue',
    icon: 'pills',
    color: 'orange',
    allowedRoles: ['pharmacist', 'admin'],
    requiresPayment: false, // Payment happens at pharmacy cashier
    maxWaitTimeWarning: 30,
    columns: ['patient', 'prescriptions', 'waitTime', 'checkedIn', 'actions'],
    sortOptions: ['waitTime', 'joinedAt'],
    filterOptions: ['checkedIn'],
  },
};
```

---

## Part 5: Atomic Components Specifications

### 5.1 Atoms - Display Components

#### **PatientNumber.tsx**
```typescript
interface PatientNumberProps {
  number: string;
  size?: 'sm' | 'md' | 'lg';
  copyable?: boolean;
}

// Display: PT-2026-00123
// Colors: Medical blue (#1e40af)
// Font: Monospace for readability
// Size sm: 12px, md: 14px, lg: 18px
// If copyable: show copy icon on hover
```

#### **WaitTimeIndicator.tsx**
```typescript
interface WaitTimeIndicatorProps {
  minutes: number;
  showIcon?: boolean;
  compact?: boolean;
}

// Color logic:
// 0-20 min: Green (#10b981)
// 21-40 min: Orange (#f59e0b)
// 40+ min: Red (#ef4444)

// Display formats:
// Compact: "25m" with colored dot
// Full: "25 minutes" with clock icon and colored background
```

#### **PriorityBadge.tsx**
```typescript
interface PriorityBadgeProps {
  priority: 'normal' | 'high' | 'emergency';
  size?: 'sm' | 'md';
}

// Styles:
// Normal: Gray outline badge
// High: Yellow filled badge with warning icon
// Emergency: Red filled badge with alert icon
```

### 5.2 Molecules - Queue Components

#### **QueueCard.tsx** (Reusable for all queues)
```typescript
interface QueueCardProps {
  entry: QueueEntry;
  config: QueueConfig;
  onCall?: (entry: QueueEntry) => void;
  onView?: (entry: QueueEntry) => void;
  showPaymentStatus?: boolean;
  showPauseInfo?: boolean;
}

/**
 * Professional card design:
 * ┌─────────────────────────────────────────────────┐
 * │ [Avatar] Patient Name          [Priority Badge] │
 * │          PT-2026-00123         [Wait Time]      │
 * │                                                  │
 * │ Age: 34 | Gender: F | Blood: O+                 │
 * │                                                  │
 * │ [Payment Status Badge] [Actions Menu]           │
 * └─────────────────────────────────────────────────┘
 * 
 * Hover: Subtle elevation
 * Click: Navigate to patient or open action menu
 */
```

#### **QueueFilters.tsx**
```typescript
interface QueueFiltersProps {
  config: QueueConfig;
  activeFilters: QueueFilters;
  onChange: (filters: QueueFilters) => void;
}

/**
 * Horizontal filter buttons:
 * [All] [High Priority] [Emergency] [Paid] [Pending]
 * 
 * Active filter: Filled blue
 * Inactive: Outline gray
 * Shows count in badge: "High Priority (3)"
 */
```

#### **QueueSearch.tsx**
```typescript
interface QueueSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

/**
 * Search input with:
 * - Icon (search magnifying glass)
 * - Debounced input (300ms)
 * - Clear button (X) when query not empty
 * - Focus ring: Medical blue
 */
```

#### **QueueStats.tsx**
```typescript
interface QueueStatsProps {
  stats: QueueStats;
  config: QueueConfig;
}

/**
 * 4-column grid:
 * ┌──────────┬──────────┬──────────┬──────────┐
 * │ Total    │ Waiting  │ Average  │ Longest  │
 * │ 12       │ 8        │ 15 min   │ 42 min   │
 * └──────────┴──────────┴──────────┴──────────┘
 * 
 * Colors:
 * - Total: Blue
 * - Waiting: Green (or orange if high)
 * - Average: Teal
 * - Longest: Red if > maxWaitTimeWarning
 */
```

### 5.3 Organisms - Queue Pages

#### **DoctorReviewQueue.tsx** (New - Separate from main queue)
```typescript
/**
 * Layout:
 * ┌────────────────────────────────────────────────────┐
 * │ RESULT REVIEWS (3)                    [Sort ▼]     │
 * ├────────────────────────────────────────────────────┤
 * │ ⚠️ 3 patients waiting for result reviews           │
 * │    Please prioritize these before new patients     │
 * ├────────────────────────────────────────────────────┤
 * │ [QueueCard - Review Entry 1]                       │
 * │   Paused: 45 min ago                               │
 * │   Reason: Waiting for lab results                  │
 * │   ✓ Results Available: FBC, Malaria                │
 * ├────────────────────────────────────────────────────┤
 * │ [QueueCard - Review Entry 2]                       │
 * │   Paused: 2 hours ago                              │
 * │   Reason: Patient requested pause                  │
 * ├────────────────────────────────────────────────────┤
 * │ [QueueCard - Review Entry 3]                       │
 * │   Paused: 10 hours ago ⚠️ Auto-close in 2h        │
 * │   Reason: Personal urgent issue                    │
 * └────────────────────────────────────────────────────┘
 * 
 * Card Actions:
 * - "Resume Consultation" button (primary)
 * - View patient details
 * - View paused consultation
 * 
 * Auto-close warning:
 * - If paused > 10 hours: Show orange badge "Auto-closes soon"
 * - If paused > 11.5 hours: Show red badge "Auto-closes in 30 min"
 */
```

#### **Doctor Dashboard Layout Enhancement**
```typescript
/**
 * Two-column layout for doctor:
 * 
 * ┌─────────────────────┬─────────────────────┐
 * │ RESULT REVIEWS (3)  │ NEW PATIENTS (5)    │
 * │ ⚠️ Prioritize these │                     │
 * ├─────────────────────┼─────────────────────┤
 * │ [Review Cards]      │ [New Patient Cards] │
 * │                     │                     │
 * └─────────────────────┴─────────────────────┘
 * 
 * Visual cue logic:
 * - If reviews > 3: Show orange banner "You have 3+ patients waiting for result reviews"
 * - If reviews cleared and new > 5: Show blue banner "Great! Return to new patients (5 waiting)"
 * - If both low: No banner
 */
```

---

## Part 6: Patient Registration Form Re-architecture

### 6.1 Form Sections as Molecules

Each section is a self-contained molecule with:
- Internal validation
- Auto-save capability
- Clear visual hierarchy
- Helper text

#### **PersonalInfoSection.tsx**
```typescript
interface PersonalInfoSectionProps {
  control: Control<PatientFormData>;
  errors: FieldErrors<PatientFormData>;
}

/**
 * Section contains:
 * - First Name (required, 2-50 chars, letters only)
 * - Last Name (required, 2-50 chars, letters only)
 * - Date of Birth (required, date picker, past only)
 * - Age Display (auto-calculated, read-only, muted text)
 * - Gender (required, radio buttons: Male/Female/Other)
 * - Blood Type (optional, dropdown)
 * 
 * Layout: 2-column grid on desktop, single column mobile
 * Spacing: 24px vertical between fields
 * Labels: 14px, gray-700, above input
 * Inputs: White bg, subtle border, blue focus ring
 */
```

#### **ContactInfoSection.tsx**
```typescript
/**
 * Fields:
 * - Phone Number (NigerianPhoneInput component)
 *   - Format: +234 or 0 prefix
 *   - Auto-format as user types
 *   - Check uniqueness on blur (debounced API call)
 *   - If duplicate: Show warning with "View Patient" link
 * 
 * - Alternate Phone (same validation, optional)
 * - Email (email validation, optional)
 * - Address (textarea, 10-200 chars, required)
 * - City (text input, required)
 * - State (StateSelector dropdown, required)
 */
```

#### **InsuranceInfoSection.tsx**
```typescript
/**
 * Conditional rendering:
 * 
 * [☐ Has Insurance] checkbox
 * 
 * If checked, show:
 * ┌────────────────────────────────────────────┐
 * │ HMO Provider: [Dropdown ▼]                │
 * │   - Hygeia HMO                             │
 * │   - AIICO Multishield                      │
 * │   - AXA Mansard Health                     │
 * │   - Reliance HMO                           │
 * │                                            │
 * │ Policy Number: [______________]            │
 * │ Policy Expiry: [DD/MM/YYYY ▼]             │
 * │                                            │
 * │ ⚠️ Policy expires in 15 days (if < 30)    │
 * └────────────────────────────────────────────┘
 * 
 * Validation:
 * - If checked: All fields required
 * - Policy expiry: Must be future date
 * - Show yellow warning if < 30 days
 */
```

### 6.2 Form Actions (Sticky Header)

```typescript
/**
 * Sticky header (top-right):
 * ┌────────────────────────────────────────────┐
 * │                [Cancel] [Save Draft] [Submit] │
 * └────────────────────────────────────────────┘
 * 
 * Buttons:
 * - Cancel: Ghost, confirmation if unsaved changes
 * - Save Draft: Outline, saves to localStorage with "draft_patient_" prefix
 * - Submit: Primary blue, disabled until all required fields valid
 * 
 * Auto-save indicator below buttons:
 * "Last saved: 30s ago" (muted green text)
 */
```

---

## Part 7: Patient Details Page Re-architecture

### 7.1 Tabbed Interface Enhancement

```typescript
/**
 * Tab configuration:
 */
const PATIENT_TABS = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: 'grid',
    component: PatientOverviewTab 
  },
  { 
    id: 'history', 
    label: 'Medical History', 
    icon: 'clipboard',
    component: PatientHistoryTab,
    badge: () => getConsultationCount() // Show count
  },
  { 
    id: 'vitals', 
    label: 'Vital Signs', 
    icon: 'heart-pulse',
    component: PatientVitalsTab 
  },
  { 
    id: 'consultations', 
    label: 'Consultations', 
    icon: 'stethoscope',
    component: PatientConsultationsTab,
    badge: () => getPausedCount(), // Show paused consultations
    badgeColor: 'yellow'
  },
  { 
    id: 'prescriptions', 
    label: 'Prescriptions', 
    icon: 'pills',
    component: PatientPrescriptionsTab 
  },
  { 
    id: 'lab', 
    label: 'Lab Results', 
    icon: 'flask',
    component: PatientLabResultsTab,
    badge: () => getPendingLabCount(),
    badgeColor: 'blue'
  },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: 'receipt',
    component: PatientBillingTab,
    badge: () => getOutstandingBalance() > 0 ? 'Due' : null,
    badgeColor: 'red'
  },
  { 
    id: 'documents', 
    label: 'Documents', 
    icon: 'folder',
    component: PatientDocumentsTab 
  },
];
```

### 7.2 Patient Sidebar Enhancement

```typescript
/**
 * Add payment status section to sidebar:
 * 
 * ┌────────────────────────────────┐
 * │ [Patient Photo]                │
 * │ PT-2026-00123                  │
 * │ Aisha Mohammed                 │
 * ├────────────────────────────────┤
 * │ 34F | O+ | +234 801 234 5678  │
 * ├────────────────────────────────┤
 * │ [✓ NHIA Basic Plan]            │
 * │ Policy: NHIA-12345-6789        │
 * ├────────────────────────────────┤
 * │ CURRENT VISIT STATUS           │
 * │ ✓ Consultation: Paid           │
 * │ ⏸️ Status: Paused (Lab results)│
 * │ ⏳ Wait time: 45 minutes        │
 * ├────────────────────────────────┤
 * │ [Book Appointment]             │
 * │ [Resume Consultation] (Doctor) │
 * │ [Edit Details]                 │
 * │ [View Full History]            │
 * └────────────────────────────────┘
 */
```

---

## Part 8: Pagination, Filtering, Sorting Specifications

### 8.1 Professional Table Design

```typescript
/**
 * Standard table layout for all lists:
 * 
 * ┌────────────────────────────────────────────────────────────┐
 * │ [Search ____________] [Filter ▼] [Sort ▼]     [Action +]  │
 * ├────────────────────────────────────────────────────────────┤
 * │ Showing 1-20 of 156 patients                               │
 * ├──────┬────────────┬─────┬────────┬──────────┬─────────────┤
 * │ #    │ Patient    │ Age │ Gender │ Insurance│ Actions     │
 * ├──────┼────────────┼─────┼────────┼──────────┼─────────────┤
 * │ Sort │ Sort       │Sort │ Sort   │ Sort     │             │
 * │ ▼    │ ▼          │ ▼   │ ▼      │ ▼        │             │
 * ├──────┼────────────┼─────┼────────┼──────────┼─────────────┤
 * │ 123  │ Aisha M.   │ 34  │ F      │ ✓ NHIA   │ [👁] [✏️]   │
 * │ 124  │ Emeka O.   │ 45  │ M      │ None     │ [👁] [✏️]   │
 * │ ...                                                        │
 * ├────────────────────────────────────────────────────────────┤
 * │ [< Previous] [1] [2] [3] ... [8] [Next >]                │
 * └────────────────────────────────────────────────────────────┘
 * 
 * Design:
 * - Header: Sticky on scroll
 * - Rows: Hover effect (subtle gray bg)
 * - Sortable columns: Show sort icon on hover
 * - Active sort: Blue icon + column slightly highlighted
 * - Loading: Skeleton rows
 * - Empty: Centered empty state with illustration
 */
```

### 8.2 Filter Dropdown Component

```typescript
interface FilterDropdownProps {
  options: FilterOption[];
  activeFilters: string[];
  onChange: (filters: string[]) => void;
}

/**
 * Dropdown design:
 * ┌────────────────────────┐
 * │ Filters (2)          ▼ │ ← Button shows active count
 * └────────────────────────┘
 *         ↓ Opens
 * ┌────────────────────────┐
 * │ ☑ Has Insurance        │
 * │ ☐ No Insurance         │
 * │ ☑ Active Today         │
 * │ ── separator ──        │
 * │ Clear All              │
 * └────────────────────────┘
 * 
 * Features:
 * - Multi-select checkboxes
 * - Active filters shown in blue
 * - Clear all option at bottom
 * - Apply immediately on check/uncheck
 * - Close on outside click
 */
```

### 8.3 Sort Dropdown Component

```typescript
interface SortDropdownProps {
  options: SortOption[];
  currentSort: string;
  currentOrder: 'asc' | 'desc';
  onChange: (sort: string, order: 'asc' | 'desc') => void;
}

/**
 * Dropdown design:
 * ┌────────────────────────┐
 * │ Sort: Name ↑         ▼ │
 * └────────────────────────┘
 *         ↓ Opens
 * ┌────────────────────────┐
 * │ ● Name (A-Z)           │ ← Active
 * │ ○ Name (Z-A)           │
 * │ ○ Age (Low-High)       │
 * │ ○ Age (High-Low)       │
 * │ ○ Last Visit (Recent)  │
 * │ ○ Last Visit (Oldest)  │
 * └────────────────────────┘
 * 
 * Features:
 * - Radio select (one active)
 * - Current sort shown with filled circle
 * - Direction arrows: ↑↓
 * - Apply immediately on select
 */
```

### 8.4 Pagination Component

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Design:
 * ┌─────────────────────────────────────────────────────┐
 * │ Showing 21-40 of 156                                │
 * │                                                     │
 * │ [< Prev] [1] ... [3] [4] [5] ... [8] [Next >]     │
 * └─────────────────────────────────────────────────────┘
 * 
 * Logic:
 * - Show first page, last page always
 * - Show current page ± 2 pages
 * - Use ... for gaps
 * - Prev/Next disabled on edges
 * - Current page: Filled blue
 * - Other pages: Outline
 * - Mobile: Show fewer pages (current ± 1)
 */
```

---

## Part 9: Nigerian Context & Professional Design

### 9.1 Design System Constants

```typescript
// src/constants/designSystem.ts

export const COLORS = {
  // Medical Professional Palette
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Medical blue
    600: '#2563eb',
    700: '#1d4ed8',
  },
  clinical: {
    teal: '#14b8a6',
    green: '#10b981',
    purple: '#a855f7',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  priority: {
    normal: '#6b7280',
    high: '#f59e0b',
    emergency: '#ef4444',
  },
};

export const SPACING = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const TYPOGRAPHY = {
  heading1: { size: '32px', weight: 700, lineHeight: 1.2 },
  heading2: { size: '24px', weight: 600, lineHeight: 1.3 },
  heading3: { size: '18px', weight: 600, lineHeight: 1.4 },
  body: { size: '14px', weight: 400, lineHeight: 1.5 },
  caption: { size: '12px', weight: 400, lineHeight: 1.4 },
  medical: { size: '14px', weight: 500, family: 'monospace' }, // For codes/numbers
};
```

### 9.2 Nigerian Names for Mock Data

```typescript
// src/data/nigerianNames.ts

export const NIGERIAN_FIRST_NAMES = {
  male: [
    'Chukwuemeka', 'Olumide', 'Emeka', 'Tunde', 'Obinna', 'Ikenna',
    'Chinedu', 'Adeola', 'Kunle', 'Femi', 'Ibrahim', 'Musa',
    'Abdullahi', 'Yusuf', 'Biodun', 'Segun', 'Chijioke', 'Kelechi'
  ],
  female: [
    'Adaobi', 'Folake', 'Ngozi', 'Chiamaka', 'Amaka', 'Chinwe',
    'Fatima', 'Aisha', 'Blessing', 'Chioma', 'Ifunanya', 'Nneka',
    'Zainab', 'Hadiza', 'Funmilayo', 'Adenike', 'Ifeoma', 'Ebele'
  ],
};

export const NIGERIAN_LAST_NAMES = [
  'Eze', 'Okafor', 'Adeleke', 'Nwosu', 'Ibrahim', 'Bello',
  'Okonkwo', 'Adeyemi', 'Okoro', 'Adekunle', 'Nnamdi', 'Ugochukwu',
  'Mohammed', 'Abubakar', 'Yusuf', 'Hassan', 'Olaleye', 'Ogunleye'
];
```

### 9.3 Professional Medical Icons

Use consistent icon library (Lucide React recommended):
- `Stethoscope` - Consultations
- `Flask` - Lab tests
- `Pills` - Pharmacy
- `ClipboardList` - Patient records
- `HeartPulse` - Vitals
- `Calendar` - Appointments
- `Receipt` - Billing
- `Clock` - Wait time
- `AlertCircle` - Warnings
- `CheckCircle` - Success
- `XCircle` - Errors
- `Info` - Information

---

## Part 10: Implementation Checklist

### Phase 1: Foundation (Do First)
- [ ] Create all type definitions (patient.types.ts, queue.types.ts)
- [ ] Create all custom hooks (usePatientSearch, useQueueManagement, etc.)
- [ ] Create contexts (QueueContext, NotificationContext)
- [ ] Set up design system constants

### Phase 2: Atoms (Building Blocks)
- [ ] Display atoms (PatientNumber, WaitTimeIndicator, etc.)
- [ ] Input atoms (NigerianPhoneInput, StateSelector, etc.)
- [ ] Feedback atoms (StatusBadge, AllergyAlert, etc.)
- [ ] Action atoms (IconButton, ActionMenu, etc.)

### Phase 3: Molecules (Combinations)
- [ ] Patient info molecules (PatientQuickInfo, PatientContact, etc.)
- [ ] Queue molecules (QueueCard, QueueFilters, QueueStats, etc.)
- [ ] Form section molecules (PersonalInfoSection, ContactInfoSection, etc.)

### Phase 4: Organisms (Complete Features)
- [ ] Patient list table with filters/sort/pagination
- [ ] Patient registration form (all 6 sections)
- [ ] Patient details sidebar + tabs
- [ ] All 5 queue pages (Triage, Doctor New, Doctor Review, Lab, Pharmacy)
- [ ] Check-in modal (payment integration prep)
- [ ] Triage modal with vitals

### Phase 5: Integration
- [ ] Wire QueueContext to all queue pages
- [ ] Wire NotificationContext for real-time updates
- [ ] Connect patient forms to backend (mock)
- [ ] Test all flows end-to-end

---

## Part 11: Success Criteria

After re-architecture, verify:

1. ✅ All 5 queue types visible and functional
2. ✅ Doctor Review Queue separate with warning system
3. ✅ Patient registration form uses atomic sections
4. ✅ All tables have pagination + filters + sorting
5. ✅ Payment status visible on all queue entries
6. ✅ Professional medical aesthetic throughout
7. ✅ Nigerian names and context in all mock data
8. ✅ Reusable components across modules
9. ✅ No code duplication between queue types
10. ✅ Clean separation of concerns (atoms → molecules → organisms)

---

## Part 12: Key Design Principles

**Professional Medical Interface:**
- Medical blue primary color (#3b82f6)
- Generous white space
- Clear visual hierarchy
- Consistent spacing (16px/24px grid)
- Readable typography (14px body, 18px+ headings)
- Subtle shadows (avoid harsh borders)

**Efficiency:**
- Max 2 clicks to complete common tasks
- Keyboard shortcuts for frequent actions
- Auto-save prevents data loss
- Smart defaults reduce typing
- Filters remember previous selections

**Nigerian Context:**
- Nigerian phone format (+234)
- 36 states + FCT dropdown
- Real HMO providers
- Naira currency (₦)
- Local names in examples
- DD/MM/YYYY date format

**Accessibility:**
- WCAG AA compliance
- Keyboard navigable
- Screen reader friendly
- Color contrast > 4.5:1
- Focus indicators visible

---

**This completes the Patient & Queue Module Re-architecture specification.**

