// HMS Design System Constants
// Professional medical interface optimised for Nigerian healthcare context

// Wait time thresholds (minutes)
export const WAIT_TIME_THRESHOLDS = {
  good: 20,    // 0-20 min: Green
  warning: 40, // 21-40 min: Orange/Yellow
  // 40+ min: Red
} as const;

// Queue priority colours (using Tailwind semantic tokens)
export const PRIORITY_STYLES = {
  normal: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
  high: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning',
  },
  emergency: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive',
  },
} as const;

// Payment status styles
export const PAYMENT_STATUS_STYLES = {
  pending: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    label: 'Payment Pending',
  },
  cleared: {
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Paid',
  },
  hmo_verified: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    label: 'HMO Verified',
  },
  emergency_override: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    label: 'Emergency',
  },
} as const;

// Queue status styles
export const QUEUE_STATUS_STYLES = {
  waiting: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    label: 'Waiting',
  },
  in_progress: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    label: 'In Progress',
  },
  paused: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    label: 'Paused',
  },
  completed: {
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Completed',
  },
  no_show: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    label: 'No Show',
  },
} as const;

// Queue colour mapping (for visual distinction)
export const QUEUE_COLOURS = {
  blue: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  green: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
  },
  purple: {
    bg: 'bg-chart-4/10',
    text: 'text-chart-4',
    border: 'border-chart-4/20',
  },
  teal: {
    bg: 'bg-chart-2/10',
    text: 'text-chart-2',
    border: 'border-chart-2/20',
  },
  orange: {
    bg: 'bg-offline/10',
    text: 'text-offline',
    border: 'border-offline/20',
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// Auto-pause expiry (hours)
export const AUTO_PAUSE_EXPIRY_HOURS = 12;

// Nigerian phone number regex
export const NIGERIAN_PHONE_REGEX = /^(\+234|0)[789][01]\d{8}$/;

// Nigerian phone format helper
export const formatNigerianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

// Calculate age from date of birth
export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Format currency (Naira)
export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date (DD/MM/YYYY - Nigerian format)
export const formatDateNG = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Format time (24-hour or 12-hour)
export const formatTime = (date: string | Date, use24Hour = false): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour,
  });
};

// Format relative time (e.g., "5 min ago")
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateNG(d);
};

// Blood type options
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'] as const;

// Gender options
export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

// Marital status options
export const MARITAL_STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
] as const;

// Nigerian HMO providers
export const HMO_PROVIDERS = [
  { value: 'nhia', label: 'NHIA (National Health Insurance Authority)' },
  { value: 'hygeia', label: 'Hygeia HMO' },
  { value: 'aiico', label: 'AIICO Multishield' },
  { value: 'axa', label: 'AXA Mansard Health' },
  { value: 'reliance', label: 'Reliance HMO' },
  { value: 'clearline', label: 'Clearline HMO' },
  { value: 'redcare', label: 'Redcare HMO' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'united', label: 'United Healthcare' },
  { value: 'other', label: 'Other' },
] as const;
