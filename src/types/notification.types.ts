export type NotificationType =
  | 'patient_arrived'        // Patient checked in
  | 'results_ready'          // Lab results available
  | 'prescription_ready'     // Pharmacy ready
  | 'consultation_paused'    // Doctor paused consultation
  | 'consultation_autoclosed' // 12-hour auto-close
  | 'payment_received'       // Payment confirmed
  | 'queue_warning'          // Too many reviews pending
  | 'emergency'              // Emergency alert
  | 'info'                   // General info
  | 'success'                // Success message
  | 'error';                 // Error message

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  patientId?: string;
  patientName?: string;
}
