// Vital Signs Utility Functions

/**
 * Calculate BMI from weight and height
 * @param weight Weight in kilograms
 * @param height Height in centimeters
 * @returns BMI rounded to 1 decimal place
 */
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

/**
 * Get BMI category classification
 * @param bmi Body Mass Index
 * @returns Category label
 */
export const getBMICategory = (bmi: number): 'Underweight' | 'Normal' | 'Overweight' | 'Obese' => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Check if a vital sign value is abnormal
 * @param field Vital sign field name
 * @param value Measured value
 * @returns Abnormality status and severity
 */
export const isVitalAbnormal = (
  field: string,
  value: number
): { abnormal: boolean; severity: 'warning' | 'critical' } => {
  const thresholds: Record<string, { warning: [number, number]; critical: [number, number] }> = {
    bloodPressureSystolic: { warning: [130, 140], critical: [140, 999] },
    bloodPressureDiastolic: { warning: [85, 90], critical: [90, 999] },
    temperature: { warning: [37.5, 38], critical: [38, 999] },
    pulse: { warning: [90, 100], critical: [100, 999] },
    oxygenSaturation: { warning: [93, 95], critical: [0, 93] },
    respiratoryRate: { warning: [18, 20], critical: [20, 999] },
  };

  const threshold = thresholds[field];
  if (!threshold) return { abnormal: false, severity: 'warning' };

  if (field === 'oxygenSaturation') {
    if (value <= threshold.critical[1]) return { abnormal: true, severity: 'critical' };
    if (value <= threshold.warning[1]) return { abnormal: true, severity: 'warning' };
  } else {
    if (value >= threshold.critical[0]) return { abnormal: true, severity: 'critical' };
    if (value >= threshold.warning[0]) return { abnormal: true, severity: 'warning' };
  }

  return { abnormal: false, severity: 'warning' };
};
