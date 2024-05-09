import type { StorageService } from './types';
import localforage from 'localforage';

export class StorageServiceImpl<T> implements StorageService<T> {
  private readonly store: LocalForage;

  constructor(name: string) {
    this.store = localforage.createInstance({
      name,
    });
  }

  clear(): Promise<void> {
    return this.store.clear();
  }

  delete(key: string): Promise<void> {
    return this.store.removeItem(key);
  }

  get(key: string): Promise<T | null> {
    return this.store.getItem<T>(key);
  }

  async items(): Promise<[string, T][]> {
    const keys = await this.store.keys();
    return await Promise.all(
      keys.map(async (key) => {
        const value = await this.store.getItem<T>(key);
        return [key, value] as [string, T];
      })
    );
  }

  iterate(): Promise<[string, T]> {
    return this.store.iterate<T, [string, T]>((value, key, iterationNumber) => [
      key,
      value,
    ]);
  }

  keys(): Promise<string[]> {
    return this.store.keys();
  }

  async set(key: string, value: T): Promise<void> {
    await this.store.setItem(key, value);
  }
}
