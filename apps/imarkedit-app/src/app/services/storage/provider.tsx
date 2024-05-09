import React from 'react';
import { context, storageServiceMap } from './index';

export const StorageServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <context.Provider value={storageServiceMap}>{children}</context.Provider>;
