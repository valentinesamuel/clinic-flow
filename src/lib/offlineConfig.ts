import type { Query } from '@tanstack/react-query';

export const offlineConfig = {
  shouldDehydrateQuery: (query: Query) => {
    const key = query.queryKey[0];

    // Don't persist auth (handled via localStorage) or notifications (real-time only)
    if (key === 'auth' || key === 'notifications') return false;

    // Don't persist errored queries
    if (query.state.status === 'error') return false;

    return true;
  },
};
