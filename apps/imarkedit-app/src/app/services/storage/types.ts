export interface StorageService<T = never> {
  set(key: string, value: T): Promise<void>;

  get(key: string): Promise<T | null>;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;

  keys(): Promise<string[]>;

  items(): Promise<[string, T][]>;

  iterate(): Promise<[string, T]>;
}

export type StorageServiceMap = Map<string, StorageService<any>>;

export type UseStorageService = <T>(key: string) => StorageService<T>;
