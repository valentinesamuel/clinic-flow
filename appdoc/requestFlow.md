
┌─────────────────────────────────────────────────────────────────────┐
│                        REACT COMPONENTS                              │
└───────────────┬─────────────────────────────────┬───────────────────┘
                │                                 │
┌───────────▼──────────┐         ┌────────────▼──────────┐
│   MUTATION HOOKS     │         │    QUERY HOOKS        │
│ usePatientMutations  │         │  usePatientQueries    │
│ useStaffMutations    │         │  useStaffQueries      │
│ useBillMutations     │         │  useBillQueries       │
│ useQueueMutations ┐  │         │  useQueueQueries      │
│ useConsultation.. ┘  │         │  ...etc               │
└───────────┬──────────┘         └────────────┬──────────┘
            │                                 │
┌───────────▼──────────┐         ┌────────────▼──────────┐
│   REACT QUERY        │         │   REACT QUERY         │
│   useMutation()      │         │   useQuery()          │
└──────┬───────────────┘         └─────────────┬─────────┘
        │                                       │
┌────────▼──────────────────┐         ┌──────────▼──────────────────┐
│ TWO PATHS FOR MUTATIONS   │         │ API SERVICE OBJECTS          │
└──────┬──────────┬─────────┘         │ patientsApi, queueApi,      │
        │          │                   │ consultationsApi, etc.       │
┌──────▼──┐  ┌────▼────────────────┐  └──────────┬──────────────────┘
│offline  │  │ API Services        │             │
│ApiClient│  │ (queueApi,          │             │
│(offline │  │  claimsApi,         │             │
│ writes) │  │  consultationsApi)  │             │
└──────┬──┘  └────┬────────────────┘             │
        │          │                             |
┌──────▼──────────▼──┐                 ┌─────────▼─────────┐
│  isOnline?         │                 │   apiClient        │
└──────┬──────┬──────┘                 │ (src/api/client.ts)│
        │      │                        │ import.meta.env.   │
        YES      NO                       │ VITE_API_BASE_URL  │
        │      │                        └─────────┬─────────┘
        │   ┌──▼─────────────────────┐           │
        │   │  mutationQueue         │           │
        │   │  (IndexedDB via        │           │
        │   │   idb-keyval)          │           │
        │   │  Returns optimistic    │           │
        │   │  {id: "temp-123",      │           │
        │   │   _offline: true}      │           │
        │   └────────────────────────┘           │
        │                                        │
┌──────▼────────────────────────────────────────▼──────────┐
│               Client class  (src/api/axios.ts)           │
│  process.env.apiBaseUrl                                  │
│  static get / post / patch / put / delete                │
└──────────────────────────┬───────────────────────────────┘
                │
┌────────────────▼───────────────────┐
│         AXIOS INTERCEPTORS          │
│                                    │
│  Request:                          │
│  ├─ Attach Bearer token            │
│  └─ Inject _lastModified +         │
│     _modifiedBy (conflict res.)    │
│                                    │
│  Response:                         │
│  ├─ successHandler → resolve       │
│  └─ errorHandler →                 │
│     handleErrorByStatus()          │
└────────────────┬───────────────────┘
│
┌────────────────▼───────────────────┐
│         BACKEND API SERVER         │
└────────────────────────────────────┘
│
┌────────────────▼───────────────────┐
│     SYNC ON RECONNECT              │
│  (mutationQueue drains IndexedDB,  │
│   retries queued mutations,        │
│   max 3 retries then → failed[])   │
└────────────────────────────────────┘
