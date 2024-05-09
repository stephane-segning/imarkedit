import type { FetchFn } from '@zenstackhq/swr/runtime';

export interface SWRProviderOptions {
  fetcher: FetchFn;
  provider: any;
}
