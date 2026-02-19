import { TAPIResponse, TGetAPIMetaResponse } from "../generic.types";

export type TUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TUserRole;
  avatar?: string;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  createdAt: string;
  isActive: boolean;
};

// export type TLoginSuccesResponse = TAPIResponse<TUser>
export type TLoginSuccesResponse = TGetAPIMetaResponse<TUser[]>;

 
export type TUserRole =
  | "cmo"
  | "hospital_admin"
  | "clinical_lead"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "cashier"
  | "pharmacist"
  | "lab_tech"
  | "patient";


  export interface PermissionToggles {
    hospitalAdminClinicalAccess: boolean;
    clinicalLeadFinancialAccess: boolean;
  }

  export interface RoleMetadata {
    label: string;
    description: string;
    category: "executive" | "clinical" | "support" | "hybrid" | "portal";
    reportsTo: TUserRole | null;
    routePrefix: string;
  }

  export const roleMetadata: Record<TUserRole, RoleMetadata> = {
    cmo: {
      label: "Chief Medical Officer",
      description: "Executive oversight & permissions",
      category: "executive",
      reportsTo: null,
      routePrefix: "/cmo",
    },
    hospital_admin: {
      label: "Hospital Administrator",
      description: "Operations, finance & logistics",
      category: "executive",
      reportsTo: "cmo",
      routePrefix: "/hospital-admin",
    },
    clinical_lead: {
      label: "Clinical Lead",
      description: "Medical quality & staff performance",
      category: "executive",
      reportsTo: "cmo",
      routePrefix: "/clinical-lead",
    },
    doctor: {
      label: "Doctor",
      description: "Patient consultations & prescriptions",
      category: "clinical",
      reportsTo: "clinical_lead",
      routePrefix: "/doctor",
    },
    nurse: {
      label: "Nurse",
      description: "Triage, vitals & patient care",
      category: "clinical",
      reportsTo: "clinical_lead",
      routePrefix: "/nurse",
    },
    receptionist: {
      label: "Receptionist",
      description: "Registration, scheduling & queue",
      category: "support",
      reportsTo: "hospital_admin",
      routePrefix: "/receptionist",
    },
    cashier: {
      label: "Cashier",
      description: "Payments, invoices & claims",
      category: "support",
      reportsTo: "hospital_admin",
      routePrefix: "/cashier",
    },
    pharmacist: {
      label: "Pharmacist",
      description: "Dispensing & stock management",
      category: "hybrid",
      reportsTo: "clinical_lead",
      routePrefix: "/pharmacist",
    },
    lab_tech: {
      label: "Lab Technician",
      description: "Sample processing & results",
      category: "hybrid",
      reportsTo: "clinical_lead",
      routePrefix: "/lab-tech",
    },
    patient: {
      label: "Patient",
      description: "View appointments & results",
      category: "portal",
      reportsTo: null,
      routePrefix: "/patient",
    },
  };

  export const roleCategories = {
    executive: ["cmo", "hospital_admin", "clinical_lead"] as TUserRole[],
    clinical: ["doctor", "nurse"] as TUserRole[],
    support: ["receptionist", "cashier"] as TUserRole[],
    hybrid: ["pharmacist", "lab_tech"] as TUserRole[],
    portal: ["patient"] as TUserRole[],
  };
