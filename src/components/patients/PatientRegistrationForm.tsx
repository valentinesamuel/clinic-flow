import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X, AlertCircle, Check, Clock } from 'lucide-react';
import { useNigerianStates, useLGAsForState } from '@/hooks/queries/useReferenceQueries';
import { useCreatePatient, useUpdatePatient } from '@/hooks/mutations/usePatientMutations';
import { calculateAge } from '@/utils/patientUtils';
import { Patient, BloodGroup, Gender, MaritalStatus, PaymentType } from '@/types/patient.types';
import { format } from 'date-fns';
// HMO Providers
const hmoProviders = [
  { id: 'hyg-001', name: 'Hygeia HMO', defaultCopay: 5000 },
  { id: 'aii-001', name: 'AIICO Multishield', defaultCopay: 3000 },
  { id: 'axa-001', name: 'AXA Mansard Health', defaultCopay: 4000 },
  { id: 'rel-001', name: 'Reliance HMO', defaultCopay: 2500 },
];

// ID Types
const idTypes = [
  { value: 'nin', label: 'National Identity Number (NIN)', pattern: /^\d{11}$/ },
  { value: 'passport', label: 'International Passport', pattern: /^[A-Z0-9]{9}$/ },
  { value: 'drivers-license', label: "Driver's License", pattern: /^[A-Z0-9]{10,12}$/ },
  { value: 'voters-card', label: "Voter's Card", pattern: /^[A-Z0-9]{10,19}$/ },
];

// Validation Schema
const patientFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'] as const, { required_error: 'Gender is required' }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'] as const).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'] as const),
  phone: z.string().regex(/^(\+234|0)\d{10}$/, 'Enter valid Nigerian phone number (+234 or 0 format)'),
  altPhone: z.string().regex(/^(\+234|0)\d{10}$/, 'Enter valid Nigerian phone number').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(10, 'Address must be at least 10 characters').max(200),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
  occupation: z.string().optional(),
  paymentType: z.enum(['cash', 'hmo', 'corporate'] as const),
  hasInsurance: z.boolean(),
  hmoProviderId: z.string().optional(),
  policyNumber: z.string().optional(),
  policyExpiry: z.string().optional(),
  idType: z.string().min(1, 'ID type is required'),
  idNumber: z.string().min(1, 'ID number is required'),
  emergencyName: z.string().min(2, 'Emergency contact name is required'),
  emergencyRelationship: z.string().min(2, 'Relationship is required'),
  emergencyPhone: z.string().regex(/^(\+234|0)\d{10}$/, 'Enter valid Nigerian phone number'),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientRegistrationFormProps {
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
  initialPatient?: Patient;
}

const DRAFT_KEY = 'draft_patient_registration';

export function PatientRegistrationForm({ onSuccess, onCancel, initialPatient }: PatientRegistrationFormProps) {
  const isEditMode = !!initialPatient;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'checking' | 'unique' | 'duplicate'>('idle');
  const [hasDraft, setHasDraft] = useState(false);
  const [selectedState, setSelectedState] = useState(initialPatient?.state || '');
  const [computedAge, setComputedAge] = useState<number | null>(
    initialPatient ? calculateAge(initialPatient.dateOfBirth) : null
  );

  const { data: nigerianStates = [] } = useNigerianStates();
  const { data: lgasData = [] } = useLGAsForState(selectedState);
  const createPatient = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();

  // Find the state value from the label for edit mode
  const getStateValue = (stateLabel: string) => {
    const found = (nigerianStates as any[]).find((s: any) => s.label === stateLabel || s.value === stateLabel);
    return found?.value || stateLabel;
  };

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialPatient ? {
      firstName: initialPatient.firstName,
      lastName: initialPatient.lastName,
      middleName: initialPatient.middleName || '',
      dateOfBirth: initialPatient.dateOfBirth,
      gender: initialPatient.gender,
      bloodGroup: initialPatient.bloodGroup,
      maritalStatus: initialPatient.maritalStatus,
      phone: initialPatient.phone,
      altPhone: initialPatient.altPhone || '',
      email: initialPatient.email || '',
      address: initialPatient.address,
      city: initialPatient.lga, // LGA serves as city
      state: getStateValue(initialPatient.state),
      lga: initialPatient.lga,
      occupation: initialPatient.occupation || '',
      paymentType: initialPatient.paymentType,
      hasInsurance: initialPatient.paymentType === 'hmo',
      hmoProviderId: initialPatient.hmoDetails?.providerId || '',
      policyNumber: initialPatient.hmoDetails?.enrollmentId || '',
      policyExpiry: initialPatient.hmoDetails?.expiryDate || '',
      idType: '',
      idNumber: '',
      emergencyName: initialPatient.nextOfKin.name,
      emergencyRelationship: initialPatient.nextOfKin.relationship,
      emergencyPhone: initialPatient.nextOfKin.phone,
      allergies: initialPatient.allergies.join(', '),
      chronicConditions: initialPatient.chronicConditions.join(', '),
      currentMedications: '',
    } : {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      gender: undefined,
      bloodGroup: 'unknown',
      maritalStatus: 'single',
      phone: '',
      altPhone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      lga: '',
      occupation: '',
      paymentType: 'cash',
      hasInsurance: false,
      hmoProviderId: '',
      policyNumber: '',
      policyExpiry: '',
      idType: '',
      idNumber: '',
      emergencyName: '',
      emergencyRelationship: '',
      emergencyPhone: '',
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const watchPaymentType = watch('paymentType');
  const watchHasInsurance = watch('hasInsurance');
  const watchDob = watch('dateOfBirth');
  const watchPhone = watch('phone');
  const watchHmoProvider = watch('hmoProviderId');

  // Check for draft on mount (only in create mode)
  useEffect(() => {
    if (!isEditMode) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        setHasDraft(true);
      }
    }
  }, [isEditMode]);

  // Auto-save draft every 30 seconds (only in create mode)
  useEffect(() => {
    if (isEditMode) return;
    
    const interval = setInterval(() => {
      const formData = form.getValues();
      if (Object.values(formData).some(v => v)) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [form, isEditMode]);

  // Calculate age when DOB changes
  useEffect(() => {
    if (watchDob) {
      const age = calculateAge(watchDob);
      setComputedAge(age >= 0 ? age : null);
    } else {
      setComputedAge(null);
    }
  }, [watchDob]);

  // Phone validation - server-side uniqueness check would happen on submit
  useEffect(() => {
    if (!watchPhone || watchPhone.length < 11) {
      setPhoneStatus('idle');
      return;
    }
    // Mark as valid locally - uniqueness is checked server-side on submit
    setPhoneStatus('unique');
  }, [watchPhone]);

  // Auto-set copay when HMO provider changes
  useEffect(() => {
    if (watchHmoProvider) {
      const provider = hmoProviders.find(p => p.id === watchHmoProvider);
      if (provider) {
        // Could set a copay field here if needed
      }
    }
  }, [watchHmoProvider]);

  // Update LGAs when state changes
  useEffect(() => {
    const stateValue = watch('state');
    if (stateValue !== selectedState) {
      setSelectedState(stateValue);
      setValue('lga', '');
    }
  }, [watch('state'), selectedState, setValue]);

  const loadDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const data = JSON.parse(draft) as PatientFormData;
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof PatientFormData, value);
      });
      setHasDraft(false);
      toast({ title: 'Draft loaded', description: 'Continuing from where you left off.' });
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    toast({ title: 'Draft discarded', description: 'Starting fresh.' });
  };

  const saveDraft = () => {
    const formData = form.getValues();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    toast({ title: 'Draft saved', description: 'Your progress has been saved.' });
  };

  const onSubmit = async (data: PatientFormData) => {
    if (phoneStatus === 'duplicate') {
      toast({
        title: 'Duplicate phone number',
        description: 'A patient with this phone number already exists.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the state label for display
      const stateLabel = (nigerianStates as any[]).find((s: any) => s.value === data.state)?.label || data.state;

      // Prepare patient data
      const patientData = {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender as Gender,
        bloodGroup: (data.bloodGroup || 'unknown') as BloodGroup,
        maritalStatus: data.maritalStatus as MaritalStatus,
        phone: data.phone,
        altPhone: data.altPhone,
        email: data.email,
        address: data.address,
        state: stateLabel,
        lga: data.lga,
        nationality: 'Nigerian',
        occupation: data.occupation,
        paymentType: data.paymentType as PaymentType,
        hmoDetails: data.hasInsurance && data.hmoProviderId ? {
          providerId: data.hmoProviderId,
          providerName: hmoProviders.find(p => p.id === data.hmoProviderId)?.name || '',
          enrollmentId: data.policyNumber || '',
          planType: 'Standard',
          expiryDate: data.policyExpiry || '',
          copayAmount: hmoProviders.find(p => p.id === data.hmoProviderId)?.defaultCopay || 0,
          isActive: true,
        } : undefined,
        nextOfKin: {
          name: data.emergencyName,
          relationship: data.emergencyRelationship,
          phone: data.emergencyPhone,
          address: data.address,
        },
        allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()).filter(Boolean) : [],
        chronicConditions: data.chronicConditions ? data.chronicConditions.split(',').map(c => c.trim()).filter(Boolean) : [],
        isActive: true,
      };

      if (isEditMode && initialPatient) {
        const updatedPatient = await updatePatientMutation.mutateAsync({
          id: initialPatient.id,
          ...patientData,
        });
        toast({
          title: 'Patient details updated',
          description: `Changes saved for ${(updatedPatient as any).firstName} ${(updatedPatient as any).lastName}`,
        });
        onSuccess(updatedPatient as unknown as Patient);
      } else {
        const newPatient = await createPatient.mutateAsync(patientData);
        localStorage.removeItem(DRAFT_KEY);
        toast({
          title: 'Patient registered successfully',
          description: `Patient Number: ${(newPatient as any).mrn}`,
        });
        onSuccess(newPatient as unknown as Patient);
      }
    } catch (error) {
      toast({
        title: isEditMode ? 'Update failed' : 'Registration failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const lgas = lgasData as any[];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Draft Recovery Banner - Only in create mode */}
      {!isEditMode && hasDraft && (
        <div className="mb-6 p-4 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span className="text-sm">Continue registration from draft?</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={discardDraft}>
              Discard
            </Button>
            <Button size="sm" onClick={loadDraft}>
              Resume
            </Button>
          </div>
        </div>
      )}

      {/* Edit Mode Header Info */}
      {isEditMode && initialPatient && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium">Patient Number: <span className="font-mono">{initialPatient.mrn}</span></p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Last updated: {format(new Date(initialPatient.updatedAt), 'dd MMM yyyy, hh:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-background z-10 py-4 border-b">
        <h1 className="text-2xl font-bold">
          {isEditMode 
            ? `Edit Patient - ${initialPatient?.firstName} ${initialPatient?.lastName}` 
            : 'Register New Patient'}
        </h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          {!isEditMode && (
            <Button variant="outline" onClick={saveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          )}
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Register Patient'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register('firstName')} placeholder="Enter first name" />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" {...register('middleName')} placeholder="Enter middle name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register('lastName')} placeholder="Enter last name" />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} max={new Date().toISOString().split('T')[0]} />
              {computedAge !== null && (
                <p className="text-sm text-muted-foreground">{computedAge} years old</p>
              )}
              {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select onValueChange={(v) => setValue('gender', v as Gender)} value={watch('gender')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Blood Type</Label>
              <Select onValueChange={(v) => setValue('bloodGroup', v as BloodGroup)} value={watch('bloodGroup')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Marital Status *</Label>
              <Select onValueChange={(v) => setValue('maritalStatus', v as MaritalStatus)} value={watch('maritalStatus')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Input 
                  id="phone" 
                  {...register('phone')} 
                  placeholder="+234 801 234 5678" 
                />
                {phoneStatus === 'checking' && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {phoneStatus === 'unique' && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {phoneStatus === 'duplicate' && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">Format: +234 801 234 5678 or 08012345678</p>
              {phoneStatus === 'duplicate' && (
                <p className="text-sm text-destructive">A patient with this phone number already exists</p>
              )}
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="altPhone">Alternate Phone</Label>
              <Input id="altPhone" {...register('altPhone')} placeholder="+234 801 234 5678" />
              {errors.altPhone && <p className="text-sm text-destructive">{errors.altPhone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email')} placeholder="patient@example.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" {...register('occupation')} placeholder="e.g. Teacher, Engineer" />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Residential Address *</Label>
              <Textarea id="address" {...register('address')} placeholder="Enter full address" rows={2} />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register('city')} placeholder="Enter city" />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>State *</Label>
              <Select onValueChange={(v) => setValue('state', v)} value={watch('state')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>LGA *</Label>
              <Select 
                onValueChange={(v) => setValue('lga', v)} 
                value={watch('lga')}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedState ? "Select LGA" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {lgas.map((lga) => (
                    <SelectItem key={lga.value} value={lga.value}>
                      {lga.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.lga && <p className="text-sm text-destructive">{errors.lga.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name *</Label>
              <Input id="emergencyName" {...register('emergencyName')} placeholder="Full name" />
              {errors.emergencyName && <p className="text-sm text-destructive">{errors.emergencyName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship">Relationship *</Label>
              <Input id="emergencyRelationship" {...register('emergencyRelationship')} placeholder="e.g. Spouse, Parent" />
              {errors.emergencyRelationship && <p className="text-sm text-destructive">{errors.emergencyRelationship.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number *</Label>
              <Input id="emergencyPhone" {...register('emergencyPhone')} placeholder="+234 801 234 5678" />
              {errors.emergencyPhone && <p className="text-sm text-destructive">{errors.emergencyPhone.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Insurance Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Type *</Label>
              <Select onValueChange={(v) => {
                setValue('paymentType', v as PaymentType);
                if (v === 'hmo') {
                  setValue('hasInsurance', true);
                } else {
                  setValue('hasInsurance', false);
                }
              }} value={watchPaymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="hmo">HMO Insurance</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {watchPaymentType === 'hmo' && (
              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                  <Label>HMO Provider *</Label>
                  <Select onValueChange={(v) => setValue('hmoProviderId', v)} value={watch('hmoProviderId')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select HMO provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {hmoProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number *</Label>
                  <Input id="policyNumber" {...register('policyNumber')} placeholder="Enter policy number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="policyExpiry">Policy Expiry Date *</Label>
                  <Input 
                    id="policyExpiry" 
                    type="date" 
                    {...register('policyExpiry')} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                  {watch('policyExpiry') && new Date(watch('policyExpiry') || '') < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                    <Badge variant="outline" className="text-destructive border-destructive">
                      Policy expires soon
                    </Badge>
                  )}
                </div>
                
                {watchHmoProvider && (
                  <div className="space-y-2">
                    <Label>Default Co-pay</Label>
                    <p className="text-lg font-semibold">
                      ₦{hmoProviders.find(p => p.id === watchHmoProvider)?.defaultCopay.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 5: Identification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>ID Type *</Label>
              <Select onValueChange={(v) => setValue('idType', v)} value={watch('idType')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  {idTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.idType && <p className="text-sm text-destructive">{errors.idType.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input id="idNumber" {...register('idNumber')} placeholder="Enter ID number" />
              {errors.idNumber && <p className="text-sm text-destructive">{errors.idNumber.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Medical History (Quick Entry) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medical History (Quick Entry)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea 
                id="allergies" 
                {...register('allergies')} 
                placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chronicConditions">Chronic Conditions</Label>
              <Textarea 
                id="chronicConditions" 
                {...register('chronicConditions')} 
                placeholder="e.g., Hypertension, Diabetes, Asthma"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea 
                id="currentMedications" 
                {...register('currentMedications')} 
                placeholder="List any medications currently taking"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button (Mobile) */}
        <div className="flex gap-2 sm:hidden sticky bottom-0 bg-background py-4 border-t">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
