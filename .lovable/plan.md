Here's your comprehensive Patient Management Module prompt for Lovable:

PATIENT MANAGEMENT MODULE - Complete Implementation Brief
=========================================================

Module Overview
---------------

Build the complete Patient Management module with 8 main screens, full CRUD operations, Nigerian-specific fields, offline support, and role-based access. This is the foundation module - all other modules depend on patient data.

1\. PATIENT LIST SCREEN (/patients)
-----------------------------------

**Access**: All staff roles (NOT patients)

**Layout**: Full-width data table with header actions

**Header Section**:

*   Page title: "Patients"
    
*   Search bar (left): Placeholder "Search by name, phone, or patient number", debounced 300ms, min 2 chars
    
*   Filter dropdown (center): "All Patients", "Has Insurance", "No Insurance", "Active Today"
    
*   "Register New Patient" button (right, primary, blue)
    

**Table Columns**:

1.  Patient Number (e.g., PT-2026-00123)
    
2.  Name (First + Last)
    
3.  Age (auto-calculated from DOB)
    
4.  Gender (icon + text)
    
5.  Phone Number
    
6.  Insurance Status (badge: green "Active" with HMO name, gray "None")
    
7.  Last Visit (date, or "Never" if new)
    
8.  Actions (eye icon → view details)
    

**Table Features**:

*   Pagination: 20 items per page, controls at bottom
    
*   Sorting: Click column headers to sort
    
*   Loading: Show skeleton rows while loading
    
*   Empty state: "No patients found" with illustration, "Register New Patient" CTA
    

**Filters Implementation**:

*   All: No filter
    
*   Has Insurance: patient.hasInsurance === true
    
*   No Insurance: patient.hasInsurance === false
    
*   Active Today: patient.lastVisit === today
    

**Search Logic**:

*   Search across: firstName, lastName, phoneNumber, patientNumber
    
*   Case-insensitive
    
*   Highlight matching text in results
    

2\. PATIENT REGISTRATION FORM (/patients/new)
---------------------------------------------

**Access**: Doctor, Nurse, Receptionist, Admin

**Layout**: Full-page form with save actions at top-right

**Form Structure**: 6 sections with clear headings

### Section 1: Personal Information

*   **First Name** (text input, required, 2-50 chars, letters only, error: "First name is required")
    
*   **Last Name** (text input, required, 2-50 chars, letters only)
    
*   **Date of Birth** (date picker, required, past dates only, max 150 years ago, show age preview)
    
*   **Age Display** (computed, read-only, shows immediately when DOB selected, format: "34 years old")
    
*   **Gender** (radio buttons: Male, Female, Other, required)
    
*   **Blood Type** (dropdown: A+, A-, B+, B-, AB+, AB-, O+, O-, optional)
    

### Section 2: Contact Information

*   **Phone Number** (text input, required, Nigerian format validation)
    
    *   Accept: +234xxxxxxxxxx or 0xxxxxxxxxx
        
    *   Show format helper: "Format: +234 801 234 5678"
        
    *   Error: "Enter valid Nigerian phone number"
        
    *   Auto-format as user types
        
*   **Alternate Phone** (same validation, optional)
    
*   **Email** (email input, optional, validate format if provided)
    
*   **Address** (textarea, required, 10-200 chars, placeholder: "Residential address")
    
*   **City** (text input, required)
    
*   **State** (dropdown, required, Nigerian states):
    
    *   Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno, Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, FCT, Gombe, Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara, Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau, Rivers, Sokoto, Taraba, Yobe, Zamfara
        

### Section 3: Emergency Contact

*   **Contact Name** (text input, required)
    
*   **Relationship** (text input, required, e.g., "Spouse", "Parent", "Sibling")
    
*   **Emergency Phone** (Nigerian phone validation, required)
    

### Section 4: Insurance Information

*   **Has Insurance?** (checkbox, toggles section below)
    
*   **If checked, show**:
    
    *   **HMO Provider** (dropdown, required if has insurance):
        
        *   Hygeia HMO
            
        *   AIICO Multishield
            
        *   AXA Mansard Health
            
        *   Reliance HMO
            
    *   **Policy Number** (text input, required, alphanumeric, 6-20 chars)
        
    *   **Policy Expiry** (date picker, required, future dates only)
        
    *   Show warning if expiry < 30 days: "Policy expires soon" (yellow badge)
        

### Section 5: Identification

*   **ID Type** (dropdown, required):
    
    *   National Identity Number (NIN)
        
    *   International Passport
        
    *   Driver's License
        
    *   Voter's Card
        
*   **ID Number** (text input, required, validation varies by type):
    
    *   NIN: 11 digits
        
    *   Passport: alphanumeric, 9 chars
        
    *   Driver's License: alphanumeric, 10-12 chars
        
    *   Voter's Card: alphanumeric, 10-19 chars
        
*   **Upload ID Photo** (file upload, optional, drag-drop area):
    
    *   Accept: .jpg, .png, .pdf
        
    *   Max size: 5MB
        
    *   Show preview if uploaded
        
    *   "Remove" option if uploaded
        

### Section 6: Medical History (Quick Entry)

*   **Known Allergies** (textarea, optional, 0-500 chars, placeholder: "List any known allergies")
    
*   **Chronic Conditions** (textarea, optional, placeholder: "E.g., Hypertension, Diabetes")
    
*   **Current Medications** (textarea, optional, placeholder: "List any medications currently taking")
    

### Form Actions (Sticky header, top-right)

*   **Cancel** button (ghost, navigate back to /patients)
    
*   **Save Draft** button (outline, saves to localStorage with prefix draft\_patient\_, shows toast "Draft saved")
    
*   **Submit** button (primary, disabled until all required fields valid)
    

### Validation Behavior

*   Real-time validation on blur for each field
    
*   Show error message below field (red text, small)
    
*   Required field errors appear on submit if empty
    
*   Phone uniqueness check on blur (simulated API call, show "Phone number already exists" if duplicate)
    

### Submit Success

*   Toast: "Patient registered successfully"
    
*   Navigate to patient detail page: /patients/{id}
    
*   Auto-generate patient number: PT-YYYY-XXXXX format
    

### Draft Recovery

*   If draft exists in localStorage, show banner on page load: "Continue registration from draft?" with "Resume" and "Discard" buttons
    
*   Resume: pre-fill all fields from draft
    
*   Discard: clear localStorage, start fresh
    

3\. PATIENT DETAILS SCREEN (/patients/{id})
-------------------------------------------

**Access**: All staff (read), Doctor/Nurse/Admin (edit)

**Layout**: Two-column layout (sidebar + main content)

### Left Sidebar (Sticky)

*   **Patient Photo** (placeholder avatar if none)
    
*   **Patient Number** (large, bold)
    
*   **Full Name** (H2)
    
*   **Quick Info Card**:
    
    *   Age & Gender (icon + text)
        
    *   Blood Type (with drop icon)
        
    *   Phone (clickable tel: link)
        
    *   Email (clickable mailto: if exists)
        
*   **Insurance Badge** (large):
    
    *   If has insurance: Green badge with HMO logo/name, policy number below
        
    *   If no insurance: Gray "No Insurance" badge
        
*   **Action Buttons** (full-width):
    
    *   "Book Appointment" (primary)
        
    *   "Start Consultation" (outline, Doctor only)
        
    *   "Edit Details" (outline, if has permission)
        
    *   "View Full History" (ghost)
        

### Main Content Area: Tabbed Interface

**Tab 1: Overview** (default)

*   **Recent Activity Timeline** (last 5 items):
    
    *   Icon + timestamp + description
        
    *   Types: Consultation, Lab Test, Prescription, Payment
        
    *   "View All" link at bottom
        
*   **Allergies** (if any):
    
    *   Red alert badges with X icons
        
    *   "No known allergies" if none
        
*   **Chronic Conditions** (if any):
    
    *   Yellow warning badges
        
    *   "None recorded" if none
        
*   **Current Medications** (if any):
    
    *   List with medication names
        
    *   "None" if empty
        

**Tab 2: Medical History**

*   **Consultations List** (most recent first):
    
    *   Card per consultation: Date, Doctor, Chief Complaint, Diagnosis
        
    *   "View Details" link → opens consultation detail
        
    *   Empty state: "No consultations yet"
        
*   **Pagination** if more than 10 consultations
    

**Tab 3: Vital Signs**

*   **Latest Vitals Card** (prominent):
    
    *   BP, Temp, Pulse, O2 Sat, Weight, Height, BMI
        
    *   Recorded by (nurse name) at (timestamp)
        
    *   Flag abnormal values (red badge)
        
*   **Vitals History Graph**:
    
    *   Line chart showing BP trend over time
        
    *   Filter: Last 7 days, 30 days, 90 days, All time
        
*   **Record New Vitals** button (Nurse only)
    

**Tab 4: Consultations**

*   Same as Medical History tab but filterable by:
    
    *   Date range picker
        
    *   Doctor dropdown
        
    *   Diagnosis search
        
*   Export to PDF button (top-right)
    

**Tab 5: Prescriptions**

*   **Active Prescriptions** section (green):
    
    *   Card per prescription: Drug name, dosage, frequency, start date
        
    *   "Refill" button (opens refill request modal)
        
*   **Past Prescriptions** section (gray):
    
    *   Collapsed by default, expand to see
        
    *   Show completion date
        
*   Empty state: "No prescriptions"
    

**Tab 6: Lab Results**

*   **Pending Tests** (yellow warning):
    
    *   Test name, ordered by, ordered date
        
    *   "Sample not collected" or "In progress" status
        
*   **Completed Results** (most recent first):
    
    *   Test name, date, view PDF icon
        
    *   Abnormal flag if critical values
        
    *   Click to view detailed results
        
*   Empty state: "No lab tests ordered"
    

**Tab 7: Billing**

*   **Outstanding Balance** (red alert if > 0):
    
    *   Large number, "Pay Now" button
        
*   **Recent Invoices** (table):
    
    *   Invoice #, Date, Amount, Status (Paid/Unpaid/Partial), Actions (View/Pay)
        
*   **Payment History** (collapsible):
    
    *   Payment date, amount, method, receipt download
        

**Tab 8: Documents**

*   **Uploaded Documents** (grid):
    
    *   Document type, upload date, size, download icon
        
    *   Types: ID card, Insurance card, Test results, Prescriptions
        
*   **Upload New Document** button (top-right):
    
    *   Opens upload modal
        
    *   Select type dropdown + file upload
        

4\. EDIT PATIENT FORM (/patients/{id}/edit)
-------------------------------------------

**Access**: Doctor, Nurse, Admin

**Layout**: Same as registration form but:

*   Pre-filled with existing data
    
*   Page title: "Edit Patient - \[Patient Name\]"
    
*   Cannot change: Patient Number, Registration Date
    
*   Can update all other fields
    
*   Show "Last updated by \[User\] on \[Date\]" at top
    
*   Actions: "Cancel", "Save Changes"
    

**Save Behavior**:

*   PUT request to update patient
    
*   Toast: "Patient details updated"
    
*   Navigate back to patient details page
    

5\. PATIENT SEARCH (Global Component)
-------------------------------------

**Location**: Available in top navigation bar (all staff)

**Trigger**: Click search icon or press "/" key

**Behavior**:

*   Opens modal with large search input
    
*   Placeholder: "Search patients by name, phone, or ID"
    
*   Debounced search (300ms)
    
*   Shows results as cards:
    
    *   Patient photo + name + patient number + age + last visit
        
    *   Click card → navigate to patient details
        
*   Recent searches (stored in localStorage, max 5):
    
    *   Show below input when empty
        
    *   Click to repeat search
        
*   Keyboard navigation: Arrow keys to select, Enter to open
    

6\. PATIENT TRANSFER (MULTI-BRANCH)
-----------------------------------

**Screen**: /patients/{id}/transfer (Phase 2 feature)

**Show as placeholder**: "Patient Transfer (Coming Soon)" with lock icon

7\. PATIENT PORTAL SCREENS
--------------------------

**Access**: Patient role only

### Patient Dashboard (/patient/dashboard)

*   **Welcome Section**: "Welcome back, \[First Name\]"
    
*   **Next Appointment Card** (prominent):
    
    *   Date, time, doctor name, location
        
    *   Appointment type badge
        
    *   "Reschedule" and "Get Directions" buttons
        
    *   If no appointment: "Book Your Next Appointment" CTA
        
*   **Lab Results Card**:
    
    *   "View All Results" link with count badge
        
    *   Most recent 3 results listed (test name, date, "View" button)
        
*   **Current Prescriptions Card**:
    
    *   Active medications listed (drug name, dosage, refills remaining)
        
    *   "Request Refill" button if refills allowed
        
*   **Outstanding Bills Card**:
    
    *   Large amount if unpaid
        
    *   "View Details" and "Pay Now" buttons
        
*   **Quick Actions Grid** (4 icons):
    
    *   Book Appointment
        
    *   View Lab Results
        
    *   My Medications
        
    *   Pay Bills
        

### My Appointments (/patient/appointments)

*   **Upcoming Tab**:
    
    *   Cards showing date, time, doctor, reason
        
    *   "Reschedule" and "Cancel" buttons
        
*   **Past Tab**:
    
    *   Same card layout but read-only
        
    *   "View Consultation Notes" link
        
*   **Book New Appointment** button (floating, bottom-right)
    

### My Lab Results (/patient/lab-results)

*   List of all lab results (most recent first)
    
*   Each card: Test name, date, doctor who ordered, download PDF icon
    
*   Click card → full result details with parameter table
    
*   Abnormal values flagged in red
    

### My Prescriptions (/patient/prescriptions)

*   **Active Prescriptions** (green cards):
    
    *   Drug name, dosage, frequency, start date, refills remaining
        
    *   "Request Refill" button
        
*   **Past Prescriptions** (gray cards):
    
    *   Same info but read-only
        
    *   Completion date shown
        

### My Bills (/patient/bills)

*   **Outstanding Balance** (large, red if > 0)
    
*   **Unpaid Bills** (cards):
    
    *   Invoice number, date, amount, "Pay Now" button
        
*   **Payment History** (table):
    
    *   Date, invoice #, amount, method, download receipt
        

### My Profile (/patient/profile)

*   Same fields as registration form but read-only for most
    
*   Can update: Phone, email, address
    
*   Shows: Insurance status, emergency contact, medical history
    
*   "Request Profile Update" button (sends request to admin for protected fields)
    

8\. COMPONENT SPECIFICATIONS
----------------------------

### PatientCard Component

Used in: Search results, lists, modals

**Props**:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    patient: Patient;    onClick: () => void;    showActions?: boolean;  }   `

**Layout**:

*   Horizontal card with avatar left, info center, actions right
    
*   Info: Name (bold), patient number (muted), age + gender
    
*   Conditional: Insurance badge if has insurance
    
*   Actions: View details icon
    

### PatientSearchAutocomplete Component

Used in: Appointment booking, consultation start, billing

**Props**:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    onSelect: (patient: Patient) => void;    placeholder?: string;    excludeIds?: string[];  }   `

**Behavior**:

*   Combobox with dropdown
    
*   Type to search (min 2 chars)
    
*   Shows max 10 results
    
*   Displays: Name, patient number, age
    
*   Keyboard navigable
    

### VitalsEntryForm Component

Used in: Record vitals modal

**Fields**:

*   Blood Pressure: Two inputs (Systolic/Diastolic), validate ranges (60-250 / 40-150)
    
*   Temperature: Input with unit toggle (°C / °F), validate 35-42°C
    
*   Pulse Rate: Input, validate 40-200 bpm
    
*   Respiratory Rate: Input, validate 10-40 /min
    
*   Oxygen Saturation: Input, validate 70-100%
    
*   Weight: Input, validate 1-300 kg
    
*   Height: Input, validate 50-250 cm
    
*   BMI: Auto-calculated, show category (Underweight/Normal/Overweight/Obese)
    

**Auto-flagging**:

*   Red badge for out-of-range values
    
*   Yellow for borderline (within 10% of range limits)
    

9\. USER FLOWS
--------------

### Flow 1: Register New Patient (Walk-In)

1.  Receptionist clicks "Register New Patient"
    
2.  Form opens at /patients/new
    
3.  Fill all required fields (validate as they go)
    
4.  Check "Has Insurance", select HMO provider
    
5.  Enter policy number and expiry
    
6.  Upload ID photo (optional)
    
7.  Click "Submit"
    
8.  Show loading spinner on button
    
9.  Simulate API call (1s delay)
    
10.  Success: Toast + navigate to patient details
    
11.  Error: Show error alert at top of form
    

### Flow 2: Search and View Patient

1.  User types in global search (top nav)
    
2.  Results appear in modal
    
3.  Click on patient card
    
4.  Navigate to /patients/{id}
    
5.  Default tab: Overview
    
6.  User clicks "Medical History" tab
    
7.  Tab content loads (show skeleton first)
    
8.  Display consultations list
    

### Flow 3: Edit Patient Demographics

1.  From patient details, click "Edit Details"
    
2.  Navigate to /patients/{id}/edit
    
3.  Form pre-filled
    
4.  Update phone number
    
5.  Form validates new phone (check uniqueness)
    
6.  If duplicate: Show error "Phone number already in use"
    
7.  Change to different number
    
8.  Validation passes (green checkmark)
    
9.  Click "Save Changes"
    
10.  Loading state
    
11.  Success: Toast + return to details page
    

### Flow 4: Patient Self-Books Appointment

1.  Patient logs into portal
    
2.  Dashboard shows "No upcoming appointments"
    
3.  Click "Book Appointment" quick action
    
4.  Navigate to booking flow (see Appointment module)
    

10\. API INTEGRATION POINTS
---------------------------

**Mock API Endpoints** (simulate with setTimeout 500-1000ms):

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // GET /api/patients?page=1&limit=20&search=john&filter=has_insurance  // Returns: { items: Patient[], pagination: {...} }  // POST /api/patients  // Body: Patient data  // Returns: { id: string, patientNumber: string }  // GET /api/patients/{id}  // Returns: Patient with full details  // PUT /api/patients/{id}  // Body: Updated fields  // Returns: Updated patient  // GET /api/patients/search?q={query}  // Returns: Patient[] (max 10 for autocomplete)  // GET /api/patients/{id}/history  // Returns: { consultations: [], labResults: [], prescriptions: [] }  // POST /api/vitals  // Body: Vitals data with patientId  // Returns: Created vitals record   `

11\. VALIDATION RULES
---------------------

### Client-Side (Immediate Feedback)

*   Required fields: Show error on blur if empty
    
*   Format validation: Show error on blur (phone, email, date)
    
*   Length validation: Show character count for textareas
    
*   Unique checks: Debounced API call, show inline error/success
    

### Business Rules

*   Age calculated from DOB: Update immediately when date selected
    
*   BMI calculated from weight + height: Update on either field change
    
*   Policy expiry warning: If < 30 days, show yellow "Expires Soon" badge
    
*   Phone format: Auto-format as user types (+234 prefix)
    

### Error Messages

*   Generic: "This field is required"
    
*   Specific: "Enter a valid Nigerian phone number (+234 or 0 format)"
    
*   Unique: "A patient with this phone number already exists"
    
*   Date: "Date of birth must be in the past"
    

12\. OFFLINE BEHAVIOR
---------------------

### Screens that Work Offline

*   ✅ Patient List (cached data, show "Data may be outdated" banner)
    
*   ✅ Patient Details (cached, banner if > 5 min old)
    
*   ❌ Patient Registration (require online - insurance verification)
    
*   ❌ Patient Search (require online for real-time results)
    

### Offline Indicator

*   Banner at top: "You're offline. Some features unavailable."
    
*   Disable: Submit buttons, search, file uploads
    
*   Show: Cached data with timestamp
    

13\. ROLE-BASED ACCESS
----------------------

### View Permissions

*   ✅ CMO: All patients, all data
    
*   ✅ Hospital Admin: All patients, demographic data only (unless toggle enabled)
    
*   ✅ Clinical Lead: All patients, all clinical data
    
*   ✅ Doctor: All patients, all clinical data
    
*   ✅ Nurse: All patients, vitals and basic info
    
*   ✅ Receptionist: All patients, demographic and appointment data
    
*   ✅ Billing: All patients, demographic and billing data
    
*   ⚠️ Pharmacist: Search only, view prescriptions
    
*   ⚠️ Lab Tech: Search only, view lab orders
    
*   ✅ Patient: Own data only
    

### Edit Permissions

*   ✅ Doctor, Nurse, Admin: Can edit all fields
    
*   ✅ Receptionist: Can edit contact info and insurance
    
*   ❌ Billing, Pharmacist, Lab Tech, Patient: Read-only
    

### Create Permissions

*   ✅ Doctor, Nurse, Receptionist, Admin: Can register patients
    
*   ❌ All others: Cannot register
    

14\. NIGERIAN-SPECIFIC REQUIREMENTS
-----------------------------------

### Data

*   Use Nigerian names in mock data (Chukwuemeka, Adaobi, Folake, etc.)
    
*   Nigerian phone format validation (+234 or 0 prefix)
    
*   All 36 states + FCT in state dropdown
    
*   Real HMO providers (Hygeia, AIICO, AXA Mansard, Reliance)
    
*   Currency: Display as ₦ with comma separators (e.g., ₦45,000)
    

### UI Considerations

*   Date format: DD/MM/YYYY (common in Nigeria)
    
*   Time format: 12-hour with AM/PM
    
*   Language: British English spelling (e.g., "Colour" not "Color" if used)
    

15\. EDGE CASES & ERROR HANDLING
--------------------------------

### Duplicate Detection

*   On phone blur: Check if exists
    
*   If found: Show warning "Patient exists - \[Name\] (\[Patient #\])" with "View Patient" link
    
*   Allow override: "Register anyway" button (for shared family phones)
    

### Missing Required Data

*   Can't book appointment without: name, DOB, phone
    
*   Show error modal if try to proceed: "Complete patient profile first"
    

### Insurance Edge Cases

*   Expired policy: Show red banner on patient details
    
*   Invalid policy number: Flag during registration, allow anyway but mark as "Verify Insurance"
    
*   No policy number but HMO selected: Block submit, show error
    

### Data Loading Failures

*   Patient list fails: Show error state with retry button
    
*   Patient details fails: Show 404 page "Patient not found" with back button
    
*   Search fails: Show "Search unavailable" in dropdown
    

16\. SUCCESS CRITERIA
---------------------

After implementation, you should be able to:

1.  ✅ Register a new patient with full details in under 2 minutes
    
2.  ✅ Search and find any patient in under 5 seconds
    
3.  ✅ View complete patient history with all tabs functional
    
4.  ✅ Edit patient details and see changes reflected immediately
    
5.  ✅ See appropriate data based on logged-in role
    
6.  ✅ Work with cached data when offline (list and details)
    
7.  ✅ Navigate entire patient module without errors
    
8.  ✅ See Nigerian-specific formatting (phone, currency, states)
    
9.  ✅ Experience smooth transitions between all screens
    
10.  ✅ Have form validations prevent bad data entry
    

NEXT STEPS
----------

After Patient Management is complete, we'll build:

*   Appointment Scheduling (depends on patient search)
    
*   Queue Management (uses patient data)
    
*   Clinical Workflows (consultations tied to patients)
    



# Patient Management Module Implementation Plan

## Overview

This module provides the core patient registration, search, and profile management functionality. It will be accessible from multiple roles (Receptionist, Doctor, Nurse, CMO, Clinical Lead) with role-appropriate permissions.

---

## Module Components

### 1. Patient Registration Form

A multi-step form with offline-capable auto-save for registering new patients:

**Step 1: Personal Information**
- First name, Middle name (optional), Last name (required)
- Date of birth with age auto-calculation
- Gender selection (Male/Female/Other)
- Blood group dropdown
- Marital status
- Photo upload (optional, max 2MB)

**Step 2: Contact Information**
- Phone number with +234 prefix validation
- Alternate phone (optional)
- Email (optional)
- Address (street address)
- State dropdown (Nigerian states)
- LGA dropdown (cascading based on state selection)
- Nationality (default: Nigerian)
- Occupation (optional)

**Step 3: Payment & Insurance**
- Payment type selection (Cash/HMO/Corporate)
- If HMO selected:
  - HMO Provider dropdown (Hygeia, AIICO, AXA Mansard, Reliance)
  - Enrollment ID
  - Plan type
  - Expiry date
  - Copay amount (auto-filled from provider default)

**Step 4: Medical & Emergency**
- Allergies (multi-input with chips)
- Chronic conditions (multi-input with chips)
- Next of Kin: Name, Relationship, Phone, Address

**Step 5: Review & Submit**
- Summary of all entered data
- MRN auto-generation (format: LC-YYYY-XXXX)
- Submit button with loading state

---

### 2. Patient Search Component

A reusable search component with:

- Debounced search input (300ms delay, minimum 2 characters)
- Search by: Name, MRN, Phone number
- Quick filter badges: All, HMO, Cash, Recent Visits
- Search results displayed as cards or table rows
- Empty state with "No patients found" message
- "Register New Patient" CTA when no results

**Search Result Card Shows:**
- Patient photo (or initials avatar)
- Full name
- MRN
- Age/Gender
- Phone number
- Payment type badge (Cash/HMO/Corporate)
- Last visit date (if available)
- Quick action buttons: View Profile, Check In

---

### 3. Patient List View

A paginated table/list of all patients:

**Table Columns:**
- MRN
- Full Name
- Age/Gender
- Phone
- Payment Type (with HMO name if applicable)
- Last Visit
- Status (Active/Inactive)
- Actions (View, Edit)

**Features:**
- Pagination (20 items per page)
- Column sorting (Name, MRN, Last Visit)
- Filter by payment type
- Export functionality (placeholder)
- Responsive: Cards on mobile, table on desktop

---

### 4. Patient Profile View

A comprehensive patient profile page with tabbed sections:

**Header Section:**
- Patient photo (or avatar with initials)
- Full name
- MRN with copy button
- Age, Gender, Blood Group
- Payment type badge
- Quick action buttons: Edit, Check In, New Appointment

**Tab: Overview**
- Contact information card
- Address information card
- Next of Kin card
- Medical alerts (allergies, chronic conditions)

**Tab: Visit History**
- Timeline of past visits
- Each entry shows: Date, Doctor, Reason, Diagnosis summary
- Click to expand for details

**Tab: Appointments**
- Upcoming appointments
- Past appointments
- Button: Schedule New Appointment

**Tab: Lab Results**
- List of lab results with dates
- Status badges (Pending, Ready)
- Download/View buttons

**Tab: Prescriptions**
- Active medications
- Past prescriptions
- Refill status

**Tab: Billing**
- Outstanding bills
- Payment history
- HMO claims (if applicable)

---

## File Structure

### New Files to Create

```text
src/
├── components/
│   └── patients/
│       ├── PatientRegistrationForm.tsx    # Multi-step registration form
│       ├── PatientSearch.tsx              # Reusable search component
│       ├── PatientCard.tsx                # Patient summary card
│       ├── PatientTable.tsx               # Paginated patient table
│       └── PatientProfile.tsx             # Full patient profile view
├── data/
│   └── nigerian-locations.ts              # Nigerian states and LGAs
├── pages/
│   └── patients/
│       ├── PatientListPage.tsx            # Patient list/search page
│       ├── PatientRegistrationPage.tsx    # New patient registration
│       └── PatientProfilePage.tsx         # Individual patient view
```

### Files to Modify

- `src/App.tsx` - Add patient routes
- `src/components/layout/AppSidebar.tsx` - Update navigation links
- `src/data/patients.ts` - Add CRUD helper functions

---

## Route Structure

| Route | Component | Access |
|-------|-----------|--------|
| `/receptionist/patients` | PatientListPage | Receptionist |
| `/receptionist/register` | PatientRegistrationPage | Receptionist |
| `/receptionist/patients/:id` | PatientProfilePage | Receptionist |
| `/doctor/patients` | PatientListPage | Doctor |
| `/doctor/patients/:id` | PatientProfilePage | Doctor |
| `/nurse/patients` | PatientListPage | Nurse |
| `/nurse/patients/:id` | PatientProfilePage | Nurse |
| `/cmo/patients` | PatientListPage | CMO |
| `/cmo/patients/:id` | PatientProfilePage | CMO |
| `/clinical-lead/patients` | PatientListPage | Clinical Lead |
| `/clinical-lead/patients/:id` | PatientProfilePage | Clinical Lead |

---

## Nigerian Location Data

Create a comprehensive data file with:

- 36 states + FCT
- LGAs for each state (774 total)
- Cascading dropdown support

Sample structure:
```typescript
export const nigerianStates = [
  { value: 'lagos', label: 'Lagos' },
  { value: 'abuja', label: 'Abuja (FCT)' },
  // ... all 37 states
];

export const lgasByState: Record<string, Array<{value: string, label: string}>> = {
  lagos: [
    { value: 'eti-osa', label: 'Eti-Osa' },
    { value: 'ikeja', label: 'Ikeja' },
    // ...
  ],
  // ...
};
```

---

## Form Validation Schema

Using Zod for validation:

```typescript
const patientSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.date().max(new Date()),
  gender: z.enum(['male', 'female', 'other']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']),
  phone: z.string().regex(/^\+234\s?\d{3}\s?\d{3}\s?\d{4}$/),
  // ... remaining fields
});
```

---

## Offline Capabilities

**Auto-Save Feature:**
- Form data saved to localStorage every 30 seconds
- Key format: `offline_draft_patient_${timestamp}`
- Resume incomplete registration on return
- Clear draft on successful submission

**Offline Indicator:**
- Yellow banner when working offline
- Pending sync count displayed
- Auto-sync when connection restored

---

## UI/UX Considerations

### Mobile-First Design
- Single column form layout on mobile
- Bottom-sticky action buttons
- Swipeable tabs on profile view
- Touch-friendly input sizes (min 44px)

### Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation support
- Error messages linked to inputs
- Focus management in multi-step form

### Performance
- Lazy load profile tabs
- Debounced search
- Virtualized patient list for large datasets
- Image compression for photo uploads

---

## Data Mock Functions

Add to `src/data/patients.ts`:

```typescript
// CRUD operations
export const addPatient = (patient: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>): Patient
export const updatePatient = (id: string, updates: Partial<Patient>): Patient | undefined
export const deletePatient = (id: string): boolean
export const generateMRN = (): string

// Queries
export const getAllPatients = (): Patient[]
export const getPatientsPaginated = (page: number, limit: number): { patients: Patient[], total: number }
export const getRecentPatients = (days: number): Patient[]
export const getPatientsByPaymentType = (type: PaymentType): Patient[]
```

---

## Implementation Order

1. **Nigerian locations data** - Foundation for address forms
2. **Patient mock data CRUD functions** - Enable state management
3. **PatientSearch component** - Reusable across all views
4. **PatientCard component** - Search result display
5. **PatientTable component** - List view display
6. **PatientListPage** - Full patient list with search
7. **PatientRegistrationForm** - Multi-step registration
8. **PatientRegistrationPage** - Wrapper page for form
9. **PatientProfile component** - Detailed patient view
10. **PatientProfilePage** - Wrapper with routing
11. **Route configuration** - Add all patient routes
12. **Navigation updates** - Update sidebar links

---

## Technical Notes

### Dependencies Used
- `react-hook-form` - Form state management
- `zod` + `@hookform/resolvers` - Validation
- `date-fns` - Date formatting
- Shadcn components: Form, Input, Select, Tabs, Dialog, Sheet, Calendar, Badge, Avatar

### State Management
- React useState for local form state
- Mock data functions for CRUD (will be replaced with Supabase later)
- localStorage for offline drafts

### Accessibility Compliance
- WCAG 2.1 Level AA target
- Proper heading hierarchy
- Screen reader compatible form errors



**Start with**: Patient List screen and Patient Registration form - these are the foundation. Build them fully functional before moving to details/edit screens.