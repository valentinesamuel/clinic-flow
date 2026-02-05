// HMO Providers Data with NHIA and contact details for retraction requests
import { HMOProvider } from '@/types/billing.types';

export interface HMOProviderExtended extends HMOProvider {
  portalUrl?: string;
  relationshipManagerPhone?: string;
  claimsEmail?: string;
  retractionEmail?: string;
}

export const HMO_PROVIDERS: HMOProviderExtended[] = [
  {
    id: 'nhia-001',
    name: 'NHIA Basic Plan',
    code: 'NHIA',
    contactPhone: '+234 9 461 9100',
    contactEmail: 'info@nhia.gov.ng',
    address: 'NHIA Headquarters, Central Business District, Abuja',
    defaultCopay: 0,
    isActive: true,
    portalUrl: 'https://portal.nhia.gov.ng',
    claimsEmail: 'claims@nhia.gov.ng',
    retractionEmail: 'retraction@nhia.gov.ng',
  },
  {
    id: 'hyg-001',
    name: 'Hygeia HMO',
    code: 'HYG',
    contactPhone: '+234 1 271 2200',
    contactEmail: 'claims@hygeiahmo.com',
    address: '13A A.J Marinho Drive, Victoria Island, Lagos',
    defaultCopay: 5000,
    isActive: true,
    portalUrl: 'https://providers.hygeiahmo.com',
    relationshipManagerPhone: '+234 803 456 7890',
    claimsEmail: 'claims@hygeiahmo.com',
    retractionEmail: 'retractions@hygeiahmo.com',
  },
  {
    id: 'aii-001',
    name: 'AIICO Multishield',
    code: 'AII',
    contactPhone: '+234 1 279 7400',
    contactEmail: 'hmo@ailohealth.com',
    address: 'Plot PC 12, Churchgate Street, Victoria Island, Lagos',
    defaultCopay: 3000,
    isActive: true,
    portalUrl: 'https://provider.aiicomultishield.com',
    relationshipManagerPhone: '+234 802 345 6789',
    claimsEmail: 'hmo@ailohealth.com',
    retractionEmail: 'retractions@ailohealth.com',
  },
  {
    id: 'axa-001',
    name: 'AXA Mansard Health',
    code: 'AXA',
    contactPhone: '+234 1 448 5991',
    contactEmail: 'hmo@axamansard.com',
    address: '2 Adeyemo Alakija Street, Victoria Island, Lagos',
    defaultCopay: 4000,
    isActive: true,
    portalUrl: 'https://hmo.axamansard.com/providers',
    relationshipManagerPhone: '+234 801 234 5678',
    claimsEmail: 'hmo@axamansard.com',
    retractionEmail: 'retractions@axamansard.com',
  },
  {
    id: 'rel-001',
    name: 'Reliance HMO',
    code: 'REL',
    contactPhone: '+234 700 073 5426',
    contactEmail: 'support@reliancehmo.com',
    address: '8 Toyin Street, Ikeja, Lagos',
    defaultCopay: 2500,
    isActive: true,
    portalUrl: 'https://providers.reliancehmo.com',
    relationshipManagerPhone: '+234 809 876 5432',
    claimsEmail: 'support@reliancehmo.com',
    retractionEmail: 'retractions@reliancehmo.com',
  },
];

export const getHMOProviderById = (id: string): HMOProviderExtended | undefined =>
  HMO_PROVIDERS.find(p => p.id === id);

export const getActiveHMOProviders = (): HMOProviderExtended[] =>
  HMO_PROVIDERS.filter(p => p.isActive);
