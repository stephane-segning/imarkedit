import { useCacheProvider } from '@piotr-cz/swr-idb-cache';
import type { SWRProviderOptions } from './types';
import { createId } from '@paralleldrive/cuid2';

export function useSwrProvider(): SWRProviderOptions {
  const cacheProvider = useCacheProvider({
    dbName: 'imarkedit',
    storeName: 'swr-cache'
  });

  return {
    provider: cacheProvider,
    fetcher: async (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Request-Id': createId(),
          'X-User-Id': 'xmiaou',
        }
      });
    }
  };
}
