import { useCacheProvider } from '@piotr-cz/swr-idb-cache';
import type { SWRProviderOptions } from './types';

export function useSwrProvider(): SWRProviderOptions {
  const cacheProvider = useCacheProvider({
    dbName: 'imarkedit',
    storeName: 'swr-cache'
  });

  return {
    provider: cacheProvider,
    fetcher: async (url, options) => {
      return fetch(url, options);
    }
  };
}
