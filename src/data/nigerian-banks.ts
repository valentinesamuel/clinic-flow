// Nigerian Banks - Placeholder for Paystack Integration
import { NigerianBank } from '@/types/billing.types';

// Placeholder data - will be replaced with Paystack API
export const NIGERIAN_BANKS: NigerianBank[] = [
  { id: 'gtb', name: 'GTBank', code: '058' },
  { id: 'access', name: 'Access Bank', code: '044' },
  { id: 'zenith', name: 'Zenith Bank', code: '057' },
  { id: 'firstbank', name: 'First Bank', code: '011' },
  { id: 'uba', name: 'UBA', code: '033' },
  { id: 'fcmb', name: 'FCMB', code: '214' },
  { id: 'fidelity', name: 'Fidelity Bank', code: '070' },
  { id: 'stanbic', name: 'Stanbic IBTC', code: '221' },
  { id: 'sterling', name: 'Sterling Bank', code: '232' },
  { id: 'union', name: 'Union Bank', code: '032' },
  { id: 'wema', name: 'Wema Bank', code: '035' },
  { id: 'polaris', name: 'Polaris Bank', code: '076' },
  { id: 'keystone', name: 'Keystone Bank', code: '082' },
  { id: 'ecobank', name: 'Ecobank', code: '050' },
  { id: 'heritage', name: 'Heritage Bank', code: '030' },
];

// Hook for future Paystack integration
export function useNigerianBanks() {
  // TODO: Replace with Paystack API call
  // const { data, isLoading } = useQuery({
  //   queryKey: ['nigerian-banks'],
  //   queryFn: () => fetch('/api/paystack/banks').then(res => res.json()),
  // });
  
  return { banks: NIGERIAN_BANKS, isLoading: false };
}

export const getBankById = (id: string): NigerianBank | undefined =>
  NIGERIAN_BANKS.find(b => b.id === id);

export const getBankByCode = (code: string): NigerianBank | undefined =>
  NIGERIAN_BANKS.find(b => b.code === code);
