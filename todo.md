Good. Now I can see the situation:

  1. useHMOAlerts.ts — imports HMOAlertResult type from @/data/hmo-rules → convert to import type
  2. useJustificationTriggers.ts — imports PatientLabResult type from @/data/conflict-rules → convert to import type
  3. ReportEmbedPage.tsx — imports DashboardType type and getSeverityColor utility from @/data/reports → convert type to import type, keep utility or extract it
  4. src/api/queue.ts — imports calculateWaitTime pure utility from @/data/queue → extract to src/utils/queueUtils.ts
  5. src/api/reports.ts — imports DashboardType type from @/data/reports → convert to import type
  6. src/api/reference/names.ts — imports static name data from @/data/nigerianNames → this is seed data used by the API, acceptable to keep
  7. src/utils/hmoCoverage.ts — imports getCoverageForService from @/data/hmo-service-coverage → needs to be converted to accept data as param or use API
  8. src/utils/priceResolver.ts — imports mock data directly → needs to accept data as params

   35 files remaining. Excluding src/data/, src/api/, and src/utils/ internal references, there are about 28 page/component/hook files to migrate. Let me launch parallel agents to handle these in
  batches.