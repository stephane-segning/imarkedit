import { StorageService, StorageServiceMap, UseStorageService } from './types';
import React, { useMemo } from 'react';
import { StorageServiceImpl } from './storage';

export const storageServiceMap: StorageServiceMap = new Map<
  string,
  StorageService
>();

export const context = React.createContext(storageServiceMap);

export const useStorageServiceContext = () => React.useContext(context);

export const useStorageService: UseStorageService = <T>(key: string) => {
  const map = useStorageServiceContext();
  return useMemo(() => {
    let storageService = map.get(key) as StorageService<T>;
    if (!storageService) {
      storageService = new StorageServiceImpl<T>(key);
      map.set(key, storageService);
    }
    return storageService;
  }, [map, key]);
};
