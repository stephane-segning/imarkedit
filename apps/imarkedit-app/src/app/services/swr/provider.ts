import axios from 'axios';
import { useCacheProvider } from '@piotr-cz/swr-idb-cache';
import type { SWRProviderOptions } from './types';

export function useSwrProvider(): SWRProviderOptions {
  const cacheProvider = useCacheProvider({
    dbName: 'imarkedit',
    storeName: 'swr-cache',
  });

  return {
    provider: cacheProvider,
    fetcher: (url, options) => {
      return axios.request({ url, ...options }).then((res) => res.data);
    },
  };
}
