/**
 * Seed script — generates server/db.json from src/data/*.ts mock data.
 * Run with: npx tsx server/seed.ts
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ---- Data imports ----
import { mockUsers } from '@/data/users';
import { mockPatients } from '@/data/patients';
import { mockAppointments } from '@/data/appointments';
import { mockConsultations } from '@/data/consultations';
import { mockVitals } from '@/data/vitals';
import { mockEpisodes, mockEpisodeTimeline } from '@/data/episodes';
import { mockPrescriptions } from '@/data/prescriptions';
import { mockLabOrders, testCatalog } from '@/data/lab-orders';
import { mockPartnerLabs, mockLabReferrals } from '@/data/lab-referrals';
import { mockBills } from '@/data/bills';
import { ALL_SERVICE_ITEMS } from '@/data/bill-items';
import { mockPayments } from '@/data/payments';
import {
  mockShifts,
  mockBillingCodes,
  mockEmergencyOverrides,
} from '@/data/cashier-shifts';
import { mockServicePrices, mockPriceApprovals } from '@/data/service-pricing';
import { mockClaims, mockHMOProviders } from '@/data/claims';
import { HMO_PROVIDERS } from '@/data/hmo-providers';
import { HMO_CLINICAL_RULES } from '@/data/hmo-rules';
import { hmoServiceCoverages } from '@/data/hmo-service-coverage';
import { mockInventory } from '@/data/inventory';
import { mockStockRequests } from '@/data/stock-requests';
import { mockStaff } from '@/data/staff';
import { mockRoster } from '@/data/roster';
import { mockQueueEntries } from '@/data/queue';
import { nigerianStates, lgasByState } from '@/data/nigerian-locations';
import { NIGERIAN_BANKS } from '@/data/nigerian-banks';
import { ICD10_CODES, ICD10_CATEGORIES } from '@/data/icd10-codes';
import { ICD10_SERVICE_MAPPINGS } from '@/data/icd10-service-mappings';
import { PROTOCOL_BUNDLES } from '@/data/protocol-bundles';
import { CONFLICT_RULES } from '@/data/conflict-rules';
import {
  mockReportSummary,
  reportMetadata,
  mockAlerts,
} from '@/data/reports';
import {
  NIGERIAN_FIRST_NAMES,
  NIGERIAN_LAST_NAMES,
  NIGERIAN_CITIES,
  NIGERIAN_STREETS,
} from '@/data/nigerianNames';
import {
  basePermissions,
} from '@/types/permission.types';
import { TestCatalogEntry } from '@/types/clinical.types';
import { BillingCodeEntry } from '@/types/cashier.types';
import { RosterEntry } from '@/types/roster.types';
import { ICD10ServiceMapping } from '@/types/financial.types';

// ---- Helpers ----

/** Ensure every object in an array has an `id` field. */
function ensureIds<T extends Record<string, unknown>>(
  arr: T[],
  idField?: keyof T,
): (T & { id: string })[] {
  return arr.map((item, idx) => {
    if (item.id) return item as T & { id: string };
    const fallbackId = idField ? String(item[idField]) : String(idx + 1);
    return { ...item, id: fallbackId };
  });
}

/** Strip `undefined` values so JSON.stringify doesn't drop keys inconsistently. */
function stripUndefined(obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj));
}

// ---- Build the database object ----

// Flatten lgasByState → array of { id, state, value, label }
const flatLgas = Object.entries(lgasByState).flatMap(([state, lgas]) =>
  lgas.map((lga) => ({ id: `${state}--${lga.value}`, state, ...lga })),
);

// Flatten reportMetadata → array
const flatReportMetadata = Object.entries(reportMetadata).map(([key, val]) => ({
  id: key,
  ...val,
}));

// Flatten mockAlerts → array with dashboardType
const flatAlerts = Object.entries(mockAlerts).flatMap(([dashType, alerts]) =>
  alerts.map((a) => ({ ...a, dashboardType: dashType })),
);

// basePermissions → array of { id: role, resources: [...] }
const flatBasePermissions = Object.entries(basePermissions).map(
  ([role, resources]) => ({ id: role, resources }),
);

const db = {
  users: stripUndefined(Object.values(mockUsers)),
  patients: stripUndefined(mockPatients),
  appointments: stripUndefined(mockAppointments),
  consultations: stripUndefined(mockConsultations),
  vitals: stripUndefined(mockVitals),
  episodes: stripUndefined(mockEpisodes),
  'episode-timeline': stripUndefined(mockEpisodeTimeline),
  prescriptions: stripUndefined(mockPrescriptions),
  'lab-orders': stripUndefined(mockLabOrders),
  'test-catalog': stripUndefined(ensureIds(testCatalog as TestCatalogEntry[], 'testCode')),
  'partner-labs': stripUndefined(mockPartnerLabs),
  'lab-referrals': stripUndefined(mockLabReferrals),
  bills: stripUndefined(mockBills),
  'service-items': stripUndefined(ALL_SERVICE_ITEMS),
  payments: stripUndefined(mockPayments),
  'cashier-shifts': stripUndefined(mockShifts),
  'billing-codes': stripUndefined(ensureIds(mockBillingCodes as BillingCodeEntry[])),
  'emergency-overrides': stripUndefined(mockEmergencyOverrides),
  'service-prices': stripUndefined(mockServicePrices),
  'price-approvals': stripUndefined(mockPriceApprovals),
  claims: stripUndefined(mockClaims),
  'hmo-providers': stripUndefined(mockHMOProviders),
  'hmo-providers-extended': stripUndefined(HMO_PROVIDERS),
  'hmo-rules': stripUndefined(HMO_CLINICAL_RULES),
  'hmo-service-coverage': stripUndefined(hmoServiceCoverages),
  inventory: stripUndefined(mockInventory),
  'stock-requests': stripUndefined(mockStockRequests),
  staff: stripUndefined(mockStaff),
  roster: stripUndefined(ensureIds(mockRoster as RosterEntry[])),
  'queue-entries': stripUndefined(mockQueueEntries),
  'nigerian-states': stripUndefined(
    nigerianStates.map((s) => ({ id: s.value, ...s })),
  ),
  lgas: stripUndefined(flatLgas),
  'nigerian-banks': stripUndefined(NIGERIAN_BANKS),
  'icd10-codes': stripUndefined(
    ICD10_CODES.map((c) => ({ id: c.code, ...c })),
  ),
  'icd10-categories': [{ id: '1', categories: ICD10_CATEGORIES }],
  'icd10-service-mappings': stripUndefined(
    ensureIds(ICD10_SERVICE_MAPPINGS as ICD10ServiceMapping[], 'icd10Code'),
  ),
  'protocol-bundles': stripUndefined(PROTOCOL_BUNDLES),
  'conflict-rules': stripUndefined(CONFLICT_RULES),
  'report-summary': [{ id: '1', ...mockReportSummary }],
  'report-metadata': stripUndefined(flatReportMetadata),
  'report-alerts': stripUndefined(flatAlerts),
  'audit-log': [],
  notifications: [],
  'permission-toggles': [
    {
      id: '1',
      hospitalAdminClinicalAccess: false,
      clinicalLeadFinancialAccess: false,
    },
  ],
  'base-permissions': stripUndefined(flatBasePermissions),
  'nigerian-names': [
    {
      id: '1',
      firstNames: NIGERIAN_FIRST_NAMES,
      lastNames: NIGERIAN_LAST_NAMES,
      cities: NIGERIAN_CITIES,
      streets: NIGERIAN_STREETS,
    },
  ],
};

// ---- Write to disk ----
const outPath = resolve(dirname(fileURLToPath(import.meta.url)), 'db.json');
writeFileSync(outPath, JSON.stringify(db, null, 2));
console.log(`✔ db.json written (${Object.keys(db).length} resources) → ${outPath}`);
