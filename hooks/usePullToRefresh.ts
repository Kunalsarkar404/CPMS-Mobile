import { useCallback, useState } from 'react';

// Shared pull-to-refresh state machine — wraps any async refresh callback
// with a `refreshing` flag suitable for RefreshControl's `refreshing`/`onRefresh` props.
export function usePullToRefresh(onRefresh: () => Promise<unknown> | unknown) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return { refreshing, onRefresh: handleRefresh };
}
