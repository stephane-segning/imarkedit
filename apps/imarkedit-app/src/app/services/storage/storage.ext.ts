import type { StorageService } from './types';

export class StorageServiceImpl<T> implements StorageService<T> {
  constructor(name: string) {
    throw new Error('Not implemented');
  }

  clear(): Promise<void> {
    throw new Error('Not implemented');
  }

  delete(key: string): Promise<void> {
    throw new Error('Not implemented');
  }

  get(key: string): Promise<T | null> {
    throw new Error('Not implemented');
  }

  items(): Promise<[string, T][]> {
    throw new Error('Not implemented');
  }

  iterate(): Promise<[string, T]> {
    throw new Error('Not implemented');
  }

  keys(): Promise<string[]> {
    throw new Error('Not implemented');
  }

  set(key: string, value: T): Promise<void> {
    throw new Error('Not implemented');
  }
}
