import { useStorageService } from '../services/storage';
import { useAsync } from 'react-use';

export interface StorageConsumerProps<T> {
  storageKey: string;
  getKey: string;
  defaultData?: T;
  children: (setValue: (t: T) => void, value?: T) => JSX.Element;
}

export function StorageConsumer<T>({ defaultData, storageKey, getKey, children }: StorageConsumerProps<T>) {
  const service = useStorageService<T>(storageKey);
  const { value, loading, error } = useAsync(() => service.get(getKey), [getKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children((t: T) => service.set(getKey, t), value ?? defaultData ?? undefined);
}
