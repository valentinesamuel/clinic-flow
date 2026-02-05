// HMO Providers Data with NHIA
import { HMOProvider } from '@/types/billing.types';

export const HMO_PROVIDERS: HMOProvider[] = [
  {
    id: 'nhia-001',
    name: 'NHIA Basic Plan',
    code: 'NHIA',
    contactPhone: '+234 9 461 9100',
    contactEmail: 'info@nhia.gov.ng',
    address: 'NHIA Headquarters, Central Business District, Abuja',
    defaultCopay: 0,
    isActive: true,
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
  },
];

export const getHMOProviderById = (id: string): HMOProvider | undefined =>
  HMO_PROVIDERS.find(p => p.id === id);

export const getActiveHMOProviders = (): HMOProvider[] =>
  HMO_PROVIDERS.filter(p => p.isActive);
