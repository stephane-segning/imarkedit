import { useCacheProvider } from '@piotr-cz/swr-idb-cache';
import type { SWRProviderOptions } from './types';
import { createId } from '@paralleldrive/cuid2';
import { useAuth } from '../auth';
import blacklistStorageHandler from './handler';

export function useSwrProvider(): SWRProviderOptions {
  const cacheProvider = useCacheProvider({
    dbName: 'imarkedit',
    storeName: 'swr-cache',
    storageHandler: blacklistStorageHandler
  });
  const { token } = useAuth();

  return {
    provider: cacheProvider,
    fetcher: async (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Request-Id': createId(),
          Authorization: `Bearer ${token!.accessToken}`
        }
      });
    }
  };
}
