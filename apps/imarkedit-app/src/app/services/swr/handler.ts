// custom-storage-handler.js
import { timestampStorageHandler } from '@piotr-cz/swr-idb-cache';

const blacklistStorageHandler = {
  ...timestampStorageHandler,
  // Ignore entries fetched from API endpoints starting with /api/device
  replace: (key: string, value: any) =>
    !key.startsWith('/api/auth/')
      ? // Wrapped value
        timestampStorageHandler.replace(key, value)
      : // Undefined to ignore storing value
        undefined,
};

export default blacklistStorageHandler;
