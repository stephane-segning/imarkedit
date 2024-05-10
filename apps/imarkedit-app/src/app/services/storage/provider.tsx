import React, { PropsWithChildren } from 'react';
import { context, storageServiceMap } from './index';

export function StorageServiceProvider({ children }: PropsWithChildren) {
  return <context.Provider value={storageServiceMap}>{children}</context.Provider>;
}
