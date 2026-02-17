import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import { get, set, del } from 'idb-keyval';

const CACHE_KEY = 'clinic-flow-query-cache';

export function createIDBPersister(
  idbValidKey: IDBValidKey = CACHE_KEY,
): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  };
}

/** Max age for cached data — 7 days */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;
