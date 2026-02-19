import {TGetAPIMetaResponse, TAPIResponse, TQueryParams, TBaseQueryParams} from "../generic.types";
import {TUserRole} from "@/api/clients/auth/authClient.types.ts";
import {Appointment} from "@/api/clients/appointment/appointmentClient.types.ts";

export enum PaymentMethodEnum {
    CASH = 'cash',
    CARD = 'card',
    TRANSFER = 'transfer',
    HMO = 'hmo',
    CORPORATE = 'corporate',
}

export enum BillStatusEnum {
    PENDING = 'pending',
    PARTIAL = 'partial',
    PAID = 'paid',
    WAIVED = 'waived',
    REFUNDED = 'refunded',
}

export enum HMOClaimStatusEnum {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    PROCESSING = 'processing',
    APPROVED = 'approved',
    DENIED = 'denied',
    PAID = 'paid',
    WITHDRAWN = 'withdrawn',
    RETRACTED = 'retracted',
}

export enum ServiceCategoryEnum {
    CONSULTATION = 'consultation',
    LAB = 'lab',
    PHARMACY = 'pharmacy',
    PROCEDURE = 'procedure',
    ADMISSION = 'admission',
    OTHER = 'other',
}

export enum WithdrawalReasonEnum {
    PATIENT_SELF_PAY = 'patient self pay',
    HOSPITAL_CANCELLED = 'hospital cancelled',
    CLAIM_ERROR = 'claim error',
    TREATMENT_CHANGED = 'treatment changed',
}

export enum BillingDepartmentEnum {
    FRONT_DESK = 'front desk',
    LAB = 'lab',
    PHARMACY = 'pharmacy',
    NURSING = 'nursing',
    ALL = 'all'
}

export enum HMOCoverageTypeEnum {
    FULL = 'full',
    PARTIAL_PERCENT = 'partial percent',
    PARTIAL_FLAT = 'partial flat',
    NONE = 'none',
}

export enum HMOItemStatusEnum {
    COVERED = 'covered',
    PARTIAL = 'partial',
    NOT_COVERED = 'not covered',
    OPTED_OUT = 'opted out',
}

export interface THMOServiceCoverage {
    id: string;
    hmoProviderId: string;
    serviceId: string;
    serviceName: string;
    serviceCategory: ServiceCategoryEnum;
    coverageType: HMOCoverageTypeEnum;
    coveragePercentage?: number;
    coverageFlatAmount?: number;
    maxCoveredAmount?: number;
    requiresPreAuth: boolean;
    isActive: boolean;
    updatedAt: string;
    updatedBy: string;
}

export interface TPaymentSplit {
    id: string;
    method: PaymentMethodEnum;
    amount: number;
    referenceNumber?: string;
    bank?: string;
    hmoProviderId?: string;
    notes?: string;
}

// Diagnosis codes for claims (ICD-10)
export interface TClaimDiagnosis {
    code: string;
    description: string;
    isPrimary: boolean;
}

export interface TBillItem {
    id: string;
    description: string;
    category: ServiceCategoryEnum;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
    hmoStatus?: HMOItemStatusEnum;
    hmoCoveredAmount?: number;
    patientLiabilityAmount?: number;
    hmoServiceCoverageId?: string;
    isOptedOutOfHMO?: boolean;
}

export interface TBill {
    id: string;
    billNumber: string;
    patientId: string;
    patientName: string;
    patientMrn: string;
    visitId: string;
    items: TBillItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    amountPaid: number;
    balance: number;
    status: BillStatusEnum;
    paymentMethod?: PaymentMethodEnum;
    hmoClaimId?: string;
    createdAt: string;
    createdBy: string;
    createdByRole?: TUserRole;
    department: BillingDepartmentEnum;
    billingCode?: string;
    billingCodeExpiry?: string;
    paidAt?: string;
    notes?: string;
    episodeId?: string;
    isWalkIn?: boolean;
    walkInCustomerName?: string;
    walkInPhone?: string;
    hmoTotalCoverage?: number;
    patientTotalLiability?: number;
    paymentSplits?: TPaymentSplit[];
}

export interface TPayment {
    id: string;
    billId: string;
    amount: number;
    paymentMethod: PaymentMethodEnum;
    referenceNumber?: string;
    receivedBy: string;
    receivedAt: string;
    notes?: string;
}

export interface TClaimVersion {
    version: number;
    status: HMOClaimStatusEnum;
    changedAt: string;
    changedBy: string;
    changedByName?: string;
    notes?: string;
    previousValues?: Partial<THMOClaim>;
}

export enum ClaimDocumentTypeEnum {
    AUTO = 'auto',
    MANUAL = 'manual',
    GENERATED = 'generated',
}

export interface TClaimDocument {
    id: string;
    name: string;
    type: ClaimDocumentTypeEnum;
    source?: string; // consultation_id, lab_order_id, etc.
    uploadedAt: string;
    url?: string;
    size?: number;
    mimeType?: string;
}

export interface TClaimItem {
    id: string;
    description: string;
    category: ServiceCategoryEnum;
    quantity: number;
    unitPrice: number;
    claimedAmount: number;
    isExcluded: boolean;
    clinicalNotes?: string;
    clinicalJustification?: string;
    isOffProtocol?: boolean;
}

export interface THMOClaim {
    id: string;
    claimNumber: string;
    patientId: string;
    patientName: string;
    hmoProviderId: string;
    hmoProviderName: string;
    enrollmentId: string;
    policyNumber?: string;
    preAuthCode?: string;
    billIds: string[];
    items?: TClaimItem[];
    diagnoses?: TClaimDiagnosis[];
    claimAmount: number;
    approvedAmount?: number;
    status: HMOClaimStatusEnum;
    submittedAt?: string;
    processedAt?: string;
    denialReason?: string;
    resubmissionNotes?: string;
    documents: TClaimDocument[];
    versions: TClaimVersion[];
    currentVersion: number;
    createdAt: string;
    createdBy: string;
    withdrawnAt?: string;
    withdrawnReason?: WithdrawalReasonEnum;
    retractionNotes?: string;
    privateBillId?: string;
    privatePaymentId?: string;
}

export interface THMOProvider {
    id: string;
    name: string;
    code: string;
    contactPhone: string;
    contactEmail: string;
    address: string;
    defaultCopay: number;
    isActive: boolean;
}

export enum InventoryItemCategory {
    MEDICINE = 'medicine',
    CONSUMABLE = 'consumable',
    EQUIPMENT = 'equipment',
    UTILITY = 'utility',
}

export interface TInventoryItem {
    id: string;
    name: string;
    category: InventoryItemCategory;
    unit: string;
    currentStock: number;
    reorderLevel: number;
    unitCost: number;
    supplier?: string;
    expiryDate?: string;
    location: string;
    lastRestocked?: string;
}

export interface TFinancialSummary {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    pendingBills: number;
    pendingClaims: number;
    cashCollected: number;
    hmoReceivables: number;
    period: string;
}

// Payment Collection Types
export interface TPaymentItem {
    id: string;
    description: string;
    category: ServiceCategoryEnum;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
    subItems?: TPaymentItem[];
}

export interface TPaymentClearance {
    id: string;
    receiptNumber: string;
    patientId: string;
    patientName: string;
    patientMrn: string;
    items: TPaymentItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    amountPaid: number;
    change: number;
    paymentMethod: PaymentMethodEnum;
    referenceNumber?: string;
    bank?: string;
    hmoProviderId?: string;
    hmoPreAuthCode?: string;
    hmoCoverage?: number;
    patientLiability?: number;
    cashierId: string;
    cashierName: string;
    createdAt: string;
    receiptUrl?: string;
    paymentSplits?: TPaymentSplit[];
}

export enum HMOVerificationStatusEnum {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    SUSPENDED = 'suspended',
    PENDING = 'pending',
}

export interface THMOVerification {
    id: string;
    providerId: string;
    providerName: string;
    policyNumber: string;
    enrollmentId: string;
    status: HMOVerificationStatusEnum;
    expiryDate: string;
    coveredServices: ServiceCategoryEnum[];
    coPayPercentage: number; // For pharmacy (typically 10%)
    preAuthCode?: string;
    verifiedAt: string;
    errorMessage?: string;
}

export interface TNigerianBank {
    id: string;
    name: string;
    code: string;
}

// Service Item Types
export interface TServiceItem {
    id: string;
    name: string;
    category: ServiceCategoryEnum;
    defaultPrice: number;
    isActive: boolean;
    description?: string;
    isPremium?: boolean;
    isRestricted?: boolean;
    restrictionReason?: string;
}

// Filter Types
export interface TBillFilters {
    status?: BillStatusEnum;
    department?: BillingDepartmentEnum;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface TClaimFilters {
    status?: HMOClaimStatusEnum;
    providerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface TPaymentFilters {
    method?: PaymentMethodEnum;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

// Payment Record Types
export interface TPaymentRecord {
    id: string;
    receiptNumber: string;
    patientId: string;
    patientName: string;
    patientMrn: string;
    billId: string;
    amount: number;
    paymentMethod: PaymentMethodEnum;
    referenceNumber?: string;
    bank?: string;
    cashierId: string;
    cashierName: string;
    createdAt: string;
    items: {
        description: string;
        category: ServiceCategoryEnum;
        amount: number;
    }[];
}

// HMO Provider Extended Types
export interface THMOProviderExtended extends THMOProvider {
    portalUrl?: string;
    relationshipManagerPhone?: string;
    claimsEmail?: string;
    retractionEmail?: string;
}

// HMO Service Coverage Filter Types
export interface TCoverageFilters {
    hmoProviderId?: string;
    serviceCategory?: ServiceCategoryEnum;
    search?: string;
    coverageType?: HMOCoverageTypeEnum;
    requiresPreAuth?: boolean;
}


export type TGetBillsQueryParams = TBaseQueryParams & {
    "filter[status]"?: string;
};


export interface TPaginatedCoverageResponse {
    data: THMOServiceCoverage[];
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export type TGetAllBillsSuccessResponse = TGetAPIMetaResponse<
    TBill[]
>;

export type TGetAllBilllingCodesSuccessResponse = TGetAPIMetaResponse<
    TBill[]
>;

export type TCreateBillRequest = {
    id: string;
    [key: string]: unknown;
};

export type TCreateBillSuccessResponse = TAPIResponse<TBill>;
export type TGetBillSuccessResponse = TAPIResponse<TBill>;
