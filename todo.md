This is the **Product Requirements Document (PRD)** and **Roadmap** for the Consultation Module—the "Truth Machine" of your HMS. This module is where a doctor's clinical findings are converted into financial claims and audit-proof records.

---

# **PRD: Consultation Module (The Nexus)**

## **1. Module Objective**

To provide a seamless interface for Doctors to document patient encounters using the SOAP (Subjective, Objective, Assessment, Plan) format, while simultaneously generating "Scrubbed" financial orders and audit-safe clinical evidence.

## **2. User Personas**

* **The Doctor:** Needs speed, order sets, and easy ICD-10 searching.
* **The HMO Officer:** Needs the "Why" (Justification) behind every high-cost order.
* **The Auditor/Admin:** Needs to see exactly what was changed and why.

---

## **3. Functional Requirements & Logic**

### **A. The SOAP Interface (The Input)**

* **Subjective/Objective:** Rich-text fields for clinical notes.
* **Assessment (The Anchor):**
* **ICD-10 Search:** A smart-search bar that suggests codes as the doctor types (e.g., typing "Mal" suggests "B54 - Unspecified Malaria").
* **Mandatory Coding:** The "Plan" section remains locked until at least one Primary Diagnosis (ICD-10) is selected.


* **Plan (The Orders):**
* **Protocol Bundles (Order Sets):** Pre-configured lists of Labs + Meds for common diagnoses (e.g., "Standard Typhoid Bundle").
* **The Deselect Rule:** Doctors can click a "Bundle," and the system checks all items. The doctor can then uncheck specific items they deem unnecessary for *this* specific patient.



### **B. The Financial Sidebar (Real-time Transparency)**

* **Live Billing Widget:** As the doctor selects a drug or test, a sidebar updates with:
* **Unit Price:** (Based on the patient’s specific Payer Tariff).
* **Coverage Status:** Green (Covered), Yellow (Requires PA Code), Red (Not Covered/Out of Pocket).
* **Total Bill Estimate:** Keeps the doctor aware of the financial burden on the patient/HMO.



### **C. The "Justification" Modal (Dual-Trigger Logic)**

The system interrupts the workflow with a mandatory text box in two scenarios:

1. **High-Value Trigger:** The doctor prescribes a drug/test marked as "Premium" or "Restricted" by the HMO.
2. **Conflict Trigger:** The doctor prescribes a treatment (e.g., Anti-malarial) while the linked Lab Result (e.g., MP) is recorded as `Negative`.
* *Logic:* The "Save" button is disabled until the doctor types at least 30 characters of clinical justification.



---

## **4. Interaction Flows**

### **The "Amendment" Flow (Post-Finalization)**

In the event a doctor needs to fix a note after clicking "Finalize":

1. **Action:** Doctor clicks "Amend Note."
2. **Constraint:** The original note is **not** overwritten.
3. **Mandatory Input:** A popup asks: *"Reason for Amendment?"* (Options: Typo, New Clinical Data, HMO Rejection Fix, Other).
4. **Result:** The system creates `Version 2.0`. The UI displays a "View History" badge. The HMO Officer and Admin see the original entry and the amended entry side-by-side.

---

## **5. Product Roadmap: Consultation Module**

### **Phase 1: The Core EMR (Months 1–2)**

* Build the SOAP entry UI.
* Integrate the full ICD-10 database with smart search.
* Implement basic Lab/Pharmacy order sending.
* **Audit Goal:** Basic logging of who opened which file.

### **Phase 2: The Financial Layer (Months 3–4)**

* Connect the **Payer Tariff Engine** to the Consultation screen.
* Build the **Financial Sidebar** (Real-time pricing).
* Implement **Protocol Bundles** (Order Sets) for the top 20 most common Nigerian diagnoses.
* **Audit Goal:** Log "Deselected" items from bundles to track clinical conservative-ism.

### **Phase 3: The "War-Ready" Intelligence (Months 5–6)**

* Deploy the **Dual-Trigger Justification Modals**.
* Build the **Versioned Amendment System** (Permanent visibility logic).
* Add "HMO Pet Peeve" alerts (e.g., *"Warning: This HMO requires a Temperature reading above 38°C for this claim"*).
* **Audit Goal:** Dashboard for Admins to view "Justification Quality" and "Amendment Frequency."

---

## **6. Technical "Link" Logic (For Developers)**

Every order generated in this module must carry the following metadata:

```json
{
  "order_id": "ORD-998",
  "linked_diagnosis": "B54",
  "is_from_bundle": true,
  "justification_provided": "Patient symptomatic despite neg test",
  "payer_authorized": "Pending",
  "original_price_at_order": 5500.00
}

```

---

### **Wait, what about the "Witness"?**

In many Nigerian hospitals, a nurse or "Scribe" might enter the note for the Doctor.

* **Scribe Mode:** A toggle that allows the note to be entered by a non-Doctor user. The system logs both the "Author" (Scribe) and the "Approver" (Doctor). The Doctor must review and click "Approve" before the note is finalized.

Adding the **"Co-Sign/Scribe"** logic is a masterstroke for adoption in busy Nigerian hospitals where Senior Consultants often have a Junior Doctor or Nurse handling the data entry.

However, from an **Audit** perspective, this is a dangerous "leak" if not handled correctly. We must ensure that a Scribe cannot "ghost-write" a prescription that the Doctor never saw.

Here is the updated logic for the **Co-Sign/Scribe Workflow** and how it fits into the PRD:

---

### **1. The "Scribe Mode" Execution Logic**

The system must distinguish between **Authoring** and **Authorizing**.

* **The Workflow:**
1. The Scribe (Junior Doctor/Nurse) logs in with their own account.
2. They select the patient and toggle **"Scribe Mode for [Doctor Name]."**
3. They fill out the SOAP note, select the ICD-10 codes, and build the Order Set.


* **The Constraint:** The orders (Lab/Pharmacy) are sent to the next department in a **"Pending Authorization"** state. The Pharmacy can see the order, but they cannot "Dispense" it until the Consultant clicks the button.

### **2. The "Batch Co-Sign" Dashboard**

Doctors are busy, so we shouldn't force them to open every single file individually to sign.

* **The Functionality:** A "Signature Inbox" for the Consultant.
* **The View:** A table showing: *Patient Name | Scribe Name | Diagnosis | Total Bill Amount | [View Details] | [Approve].*
* **One-Click Approval:** The Doctor can check multiple boxes and click **"Co-Sign & Release."** This instantly "triggers" the orders to the Lab and Pharmacy.

### **3. The Audit Logic for Scribes**

To prevent fraud (e.g., a Scribe writing prescriptions for their friends using the Doctor's name):

* **The "Dual-Stamp":** Every note must store two IDs: `Author_ID` (The Scribe) and `Signatory_ID` (The Doctor).
* **The Responsibility Rule:** If a Scribe makes an **Amendment** (as we discussed in Rule #4), the system must notify the Consultant immediately.
* **The Non-Repudiation Lock:** Once the Doctor co-signs, the Scribe can **no longer edit** that note. Only the Doctor can initiate an "Amendment."

---

## **Updated Roadmap: Phase 1 Extension**

* **Scribe Permission Matrix:** Define which roles (Nurse vs. Junior Doc) can scribe for which Consultants.
* **Pending Authorization State:** Implementation of the "Wait" status for Lab/Pharmacy orders.
* **The "Unsigned Notes" Alert:** A notification for the Consultant at the end of their shift: *"You have 12 encounters awaiting your Co-Sign."*

---

### **Summary of the Consultation Module "Golden Rules"**

| Feature | Business/Clinical Logic |
| --- | --- |
| **SOAP Entry** | Structured clinical data for HMO justification. |
| **ICD-10 Anchor** | No orders allowed without a diagnosis code. |
| **Order Sets** | Fast, protocol-driven medicine (with "Deselect" freedom). |
| **Financial Sidebar** | Real-time coverage and price transparency for the Doctor. |
| **Justification Trigger** | Forced explanation for conflict/high-cost items. |
| **Co-Sign Flow** | Allows Scribes to work while keeping the Doctor liable. |
| **Audit Amendments** | Permanent history of all changes with "Reason Codes." |

---

### **Final Confirmation on the Consultation Module**

We have built a module that:

1. **Speeds up the Doctor** (Order Sets).
2. **Protects the Hospital** (Justification & Financial Sidebar).
3. **Wins the HMO War** (ICD-10 & Evidence).
4. **Stops Theft** (Co-sign & Audit Logs).

